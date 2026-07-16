'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUser, SignIn, UserButton } from '@/lib/clerk';
import { db, Lead, Case, PopiaAuditLog } from '@/lib/db';
import { sendClientNotificationEmail } from '@/app/actions/email';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Search, 
  Trash2, 
  Clock, 
  Scale, 
  Award,
  BookOpen,
  Sun,
  Moon,
  ShieldCheck,
  File,
  Eye,
  Upload,
  History,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const { isSignedIn, user } = useUser();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize theme from localStorage on client-side mount (hydration-safe)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem('ndaba_theme');
      if (savedTheme === 'dark') {
        setTheme('dark');
      } else if (savedTheme === 'light') {
        setTheme('light');
      } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemPrefersDark ? 'dark' : 'light');
      }
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ndaba_theme', nextTheme);
    }
  };

  // -------------------------------------------------------------
  // TOAST ALERTS NOTIFICATION SYSTEM
  // -------------------------------------------------------------
  interface Toast {
    id: string;
    message: string;
    type: 'success' | 'info' | 'error';
  }
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // -------------------------------------------------------------
  // IN-DASHBOARD FICA DOCUMENT PREVIEW STATE
  // -------------------------------------------------------------
  const [previewDoc, setPreviewDoc] = useState<{ 
    name: string; 
    url: string; 
    caseId: string; 
    clientName: string;
    docIndex: number;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'leads' | 'cases' | 'clients' | 'calendar' | 'reports'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [popiaLogs, setPopiaLogs] = useState<PopiaAuditLog[]>([]);
  const [uploadingCaseId, setUploadingCaseId] = useState<string | null>(null);
  const [notifyingCaseId, setNotifyingCaseId] = useState<string | null>(null);
  const [notificationSubject, setNotificationSubject] = useState('Case Status Update - Ndabas Attorneys');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationMethod, setNotificationMethod] = useState<'Email' | 'WhatsApp'>('Email');
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Manual Contact registration form state
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientService, setNewClientService] = useState('Conveyancing & Property Transfers');
  const [newClientMessage, setNewClientMessage] = useState('');

  // Load data from unified db module with non-intrusive real-time background polling auto-refresh
  useEffect(() => {
    if (!isSignedIn) return;

    const loadData = async (showSpinner = false) => {
      if (showSpinner) setIsLoading(true);
      try {
        const [fetchedLeads, fetchedCases, fetchedLogs] = await Promise.all([
          db.getLeads(),
          db.getCases(),
          db.getPopiaLogs().catch(() => [])
        ]);
        setLeads(fetchedLeads);
        setCases(fetchedCases);
        setPopiaLogs(fetchedLogs);
      } catch (error) {
        console.error('Error loading CRM dashboard data:', error);
      } finally {
        if (showSpinner) setIsLoading(false);
      }
    };

    // Initial load with full screen loader
    loadData(true);

    // Dynamic background auto-refresh polling interval (every 10 seconds)
    const intervalId = setInterval(() => {
      loadData(false); // Refresh silently in the background
    }, 10000);

    return () => clearInterval(intervalId);
  }, [isSignedIn]);

  // Update Lead pipeline state
  const handleUpdateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const updatedLead = await db.updateLeadStatus(leadId, newStatus);
      if (updatedLead) {
        // Refresh leads state
        const fetchedLeads = await db.getLeads();
        setLeads(fetchedLeads);

        // If converted to client, automatically create a Case record!
        if (newStatus === 'Client') {
          await createCaseFromLead(updatedLead);
        }
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const createCaseFromLead = async (lead: Lead) => {
    try {
      // Map practice area dropdown value to shorthand
      let practice_area = 'Attorneys & Litigation';
      if (lead.service_type.includes('Conveyancing')) practice_area = 'Conveyancing';
      else if (lead.service_type.includes('Notary')) practice_area = 'Notary Services';
      else if (lead.service_type.includes('Advocacy')) practice_area = 'Advocacy';

      await db.insertCase({
        client_name: lead.name,
        case_title: `${lead.name} - Matter`,
        status: 'Open',
        practice_area,
        key_dates: 'First consultation scheduled'
      });

      // Refresh cases list
      const fetchedCases = await db.getCases();
      setCases(fetchedCases);
    } catch (error) {
      console.error('Error auto-creating case from lead:', error);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead record?')) {
      try {
        await db.deleteLead(leadId);
        const fetchedLeads = await db.getLeads();
        setLeads(fetchedLeads);
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleAddAsClient = async (cs: Case) => {
    try {
      const existingClient = leads.find(l => l.name.toLowerCase() === cs.client_name.toLowerCase());
      if (existingClient) {
        if (existingClient.status !== 'Client') {
          await handleUpdateLeadStatus(existingClient.id, 'Client');
          showToast(`Client "${cs.client_name}" added to Client Directory! 👥`, 'success');
        } else {
          showToast(`"${cs.client_name}" is already in your Client Directory!`, 'info');
        }
        return;
      }

      const newLead = await db.insertLead({
        name: cs.client_name,
        phone: '082 490 6285', // Standard placeholder phone
        email: 'client@directory.co.za', // Standard placeholder email
        service_type: cs.practice_area,
        message: `Registered from active Case Tracker matter: ${cs.case_title}`
      });

      await db.updateLeadStatus(newLead.id, 'Client', 'Auto-added from Case Tracker Card.');
      
      const fetchedLeads = await db.getLeads();
      setLeads(fetchedLeads);

      showToast(`Client "${cs.client_name}" registered and added to Directory! 👥`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to add client to Directory.', 'error');
    }
  };

  const handleUpdateCaseStatus = async (caseId: string, newStatus: Case['status']) => {
    try {
      await db.updateCase(caseId, { status: newStatus });
      
      if (newStatus === 'Complete') {
        showToast(`🎉 Case COMPLETED! Funneling client to contact directory...`, 'success');
        const currentCase = cases.find(c => c.id === caseId);
        if (currentCase) {
          await handleAddAsClient(currentCase);
        }
      } else if (newStatus === 'In Progress') {
        showToast(`💼 Case is now IN PROGRESS! 📈`, 'success');
      } else if (newStatus === 'Awaiting Documents') {
        showToast(`🟡 Case status set to AWAITING DOCUMENTS. FICA alerts active.`, 'info');
      } else {
        showToast(`Case status updated to "${newStatus.toUpperCase()}"! 💼`, 'info');
      }

      const fetchedCases = await db.getCases();
      setCases(fetchedCases);
    } catch (error) {
      console.error('Error updating case status:', error);
      showToast('Failed to update case status.', 'error');
    }
  };

  const handleLogDocumentView = async (caseId: string, clientName: string, docName: string) => {
    try {
      await db.insertPopiaLog({
        case_id: caseId,
        case_title: clientName,
        document_name: docName,
        action: 'Viewed',
        user_email: user?.primaryEmailAddress?.emailAddress || 'staff@ndabasattorneys.co.za'
      });
      const fetchedLogs = await db.getPopiaLogs().catch(() => []);
      setPopiaLogs(fetchedLogs);
    } catch (error) {
      console.error('Error logging document view:', error);
    }
  };

  const handlePreviewDocument = async (caseId: string, clientName: string, docName: string, docUrl: string, docIndex: number) => {
    try {
      await db.insertPopiaLog({
        case_id: caseId,
        case_title: clientName,
        document_name: docName,
        action: 'Viewed',
        user_email: user?.primaryEmailAddress?.emailAddress || 'staff@ndabasattorneys.co.za'
      });
      const fetchedLogs = await db.getPopiaLogs().catch(() => []);
      setPopiaLogs(fetchedLogs);
    } catch (error) {
      console.error('Error logging document preview:', error);
    }

    setPreviewDoc({
      name: docName,
      url: docUrl,
      caseId,
      clientName,
      docIndex
    });
  };

  const handleUpdateDocumentStatus = async (caseId: string, docIndex: number, newStatus: 'Pending' | 'Approved' | 'Rejected') => {
    try {
      const currentCase = cases.find(c => c.id === caseId);
      if (!currentCase || !currentCase.documents) return;

      const updatedDocs = [...currentCase.documents];
      const docName = updatedDocs[docIndex].name;
      updatedDocs[docIndex] = {
        ...updatedDocs[docIndex],
        status: newStatus
      };

      await db.updateCase(caseId, { documents: updatedDocs });
      
      if (newStatus === 'Approved' || newStatus === 'Rejected') {
        try {
          await db.insertPopiaLog({
            case_id: caseId,
            case_title: currentCase.client_name,
            document_name: docName,
            action: newStatus,
            user_email: user?.primaryEmailAddress?.emailAddress || 'staff@ndabasattorneys.co.za'
          });
        } catch (logErr) {
          console.error('Error writing POPIA status log:', logErr);
        }
      }

      const fetchedCases = await db.getCases();
      const fetchedLogs = await db.getPopiaLogs().catch(() => []);
      setCases(fetchedCases);
      setPopiaLogs(fetchedLogs);

      // Trigger beautiful, responsive Toast notifications
      if (newStatus === 'Approved') {
        showToast(`Document "${docName}" has been APPROVED! 🟢`, 'success');
      } else if (newStatus === 'Rejected') {
        showToast(`Document "${docName}" has been REJECTED! 🔴`, 'error');
      } else {
        showToast(`Document "${docName}" status reset to Pending. 🟡`, 'info');
      }

      // Automatically advance case status to In Progress if all docs approved
      if (updatedDocs.every(d => d.status === 'Approved') && currentCase.status === 'Awaiting Documents') {
        await handleUpdateCaseStatus(caseId, 'In Progress');
        showToast("🎉 FICA verified! Case status automatically advanced to 'In Progress'.", 'success');
      }
    } catch (error) {
      console.error('Error updating document status:', error);
      showToast('Failed to update document status.', 'error');
    }
  };

  const handleAddCaseDocument = async (caseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingCaseId(caseId);
    try {
      const uploadedUrl = await db.uploadFile(file);
      if (!uploadedUrl) {
        throw new Error('Upload returned null url.');
      }

      const currentCase = cases.find(c => c.id === caseId);
      if (!currentCase) return;

      const newDoc = {
        name: file.name,
        url: uploadedUrl,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        status: 'Approved' as const, // Staff addition defaults to approved
        uploaded_at: new Date().toISOString()
      };

      const updatedDocs = [...(currentCase.documents || []), newDoc];
      await db.updateCase(caseId, { documents: updatedDocs });

      try {
        await db.insertPopiaLog({
          case_id: caseId,
          case_title: currentCase.client_name,
          document_name: file.name,
          action: 'Uploaded',
          user_email: user?.primaryEmailAddress?.emailAddress || 'staff@ndabasattorneys.co.za'
        });
      } catch (logErr) {
        console.error('Error writing POPIA upload log:', logErr);
      }

      const fetchedCases = await db.getCases();
      const fetchedLogs = await db.getPopiaLogs().catch(() => []);
      setCases(fetchedCases);
      setPopiaLogs(fetchedLogs);
    } catch (err: any) {
      console.error('Error adding case document:', err);
      alert(`Failed to add case document: ${err?.message || String(err)}`);
    } finally {
      setUploadingCaseId(null);
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    if (confirm('Are you sure you want to delete this case matter record?')) {
      try {
        await db.deleteCase(caseId);
        const fetchedCases = await db.getCases();
        setCases(fetchedCases);
      } catch (error) {
        console.error('Error deleting case:', error);
      }
    }
  };

  const handleSendClientNotification = async (cs: Case) => {
    if (!notificationMessage.trim()) {
      alert('Please enter a message to notify the client.');
      return;
    }

    setIsSendingNotification(true);
    try {
      const matchingLead = leads.find(l => l.name === cs.client_name);
      const clientEmail = matchingLead?.email || 'onboarded@client.co.za';
      const clientPhone = matchingLead?.phone || '082 490 6285';

      if (notificationMethod === 'Email') {
        const res = await sendClientNotificationEmail({
          name: cs.client_name,
          email: clientEmail,
          subject: notificationSubject,
          message: notificationMessage,
          caseNumber: cs.case_number || cs.id
        });
        if (res.success) {
          alert(`Client notified successfully via Email${res.mocked ? ' (Simulated)' : ''}.`);
        } else {
          throw new Error(res.error);
        }
      } else {
        // WhatsApp Click-to-Chat
        let formattedPhone = clientPhone.replace(/\s+/g, '').replace('+', '');
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '27' + formattedPhone.substring(1);
        }
        const prefilledText = encodeURIComponent(`*${notificationSubject}*\n\nDear ${cs.client_name},\n\n${notificationMessage}\n\n_Ref Case Number: ${cs.case_number || 'N/A'}_`);
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${prefilledText}`;
        
        window.open(whatsappUrl, '_blank');
        alert('WhatsApp Click-to-Chat session launched! Please review and send inside WhatsApp.');
      }

      setNotificationMessage('');
      setNotifyingCaseId(null);
    } catch (err: any) {
      console.error('Error sending client notification:', err);
      alert(`Failed to send notification: ${err?.message || String(err)}`);
    } finally {
      setIsSendingNotification(false);
    }
  };

  // Manually register contact client form submit handler
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) {
      alert('Please provide at least Name and Cellphone contact to register.');
      return;
    }
    try {
      // 1. Insert lead with details
      const newLead = await db.insertLead({
        name: newClientName,
        phone: newClientPhone,
        email: newClientEmail || 'manual@client.co.za',
        service_type: newClientService,
        message: newClientMessage || 'Manually registered via staff control dashboard.'
      });
      
      // 2. Transition lead status to 'Client'
      const updatedLead = await db.updateLeadStatus(newLead.id, 'Client', 'Manually registered contact client directory.');
      
      // 3. Automatically trigger associated case matter creation!
      if (updatedLead) {
        await createCaseFromLead(updatedLead);
      }

      // Refresh records state
      const fetchedLeads = await db.getLeads();
      setLeads(fetchedLeads);

      // Reset contact states
      setNewClientName('');
      setNewClientPhone('');
      setNewClientEmail('');
      setNewClientService('Conveyancing & Property Transfers');
      setNewClientMessage('');
      setIsAddingClient(false);
      alert('Client contact registered successfully! Associated case matter opened automatically.');
    } catch (err) {
      console.error('Error manually registering contact:', err);
      alert('Failed to register contact.');
    }
  };

  // Compute meetings/consultations dynamically from leads with status 'Consultation Booked'
  const consultations = leads.filter(l => l.status === 'Consultation Booked');

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.service_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClients = leads.filter(l => 
    l.status === 'Client' &&
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gated Access Screen
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between relative">
        {/* Top Minimal Header */}
        <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between z-40 select-none">
          <a href="/" className="flex items-center gap-2 font-serif text-lg font-bold tracking-wide">
            <Scale className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">NDABAS</span>
          </a>
          
          <div className="flex items-center gap-2.5">
            <button 
              onClick={toggleTheme}
              type="button"
              className="p-2.5 hover:bg-card/90 border border-border rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <a 
              href="/" 
              className="px-4 py-2 bg-card border border-border hover:border-primary/50 hover:bg-border/10 text-muted-foreground hover:text-foreground rounded-full shadow-sm transition-all flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest font-bold cursor-pointer"
            >
              BACK HOME
            </a>
          </div>
        </header>

        <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
            {/* Left Column: Text description and credentials guidance */}
            <div className="lg:col-span-6 space-y-6 text-left select-none">
              <div className="space-y-2">
                <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">JUSTICE HOUSE CRM</span>
                <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground leading-tight">
                  Staff Control &<br />Administration Portal
                </h1>
                <div className="h-[1px] w-20 bg-primary mt-4"></div>
              </div>
              
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-md font-sans">
                Access authorized client profiles, litigation matters, notary deeds, and consultation bookings. Direct synchronization with the remote Pretoria Deeds Office and live Supabase pipelines.
              </p>

              <div className="space-y-4 pt-2 max-w-md font-sans text-xs">
                <div className="bg-card border border-border/80 p-4.5 rounded-2xl flex gap-3 shadow-sm">
                  <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block mb-0.5">LPC Legal Ethics Compliant</strong>
                    <span className="text-muted-foreground leading-relaxed text-[11px] block">
                      Secure session encryption handles all client personal records under high ethical standards and South African Legal Practice Council regulations.
                    </span>
                  </div>
                </div>

                <div className="bg-card border border-border/80 p-4.5 rounded-2xl flex gap-3 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground block mb-0.5">POPIA Privacy Safeguards</strong>
                    <span className="text-muted-foreground leading-relaxed text-[11px] block">
                      Automatic background logging ensures all document activities and files remain completely private and securely partitioned.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Beautiful custom-styled Clerk SignIn Component */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <SignIn redirectUrl="/admin" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden flex font-sans">
      
      {/* LEFT SIDEBAR: Collapsible sidebar-07 template styling */}
      <aside className={`shrink-0 border-r border-border/60 bg-card select-none flex flex-col justify-between h-screen sticky top-0 transition-all duration-300 z-30 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex flex-col gap-6 p-4">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4 h-12">
            {!isSidebarCollapsed ? (
              <a href="/" className="flex items-center gap-2 font-serif text-sm font-bold tracking-wide">
                <Scale className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent uppercase tracking-wider">NDABAS CRM</span>
              </a>
            ) : (
              <a href="/" className="mx-auto" title="Ndabas Attorneys CRM">
                <Scale className="h-5 w-5 text-primary" />
              </a>
            )}
            
            {/* Collapse Toggle trigger */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 hover:bg-border/30 border border-border/60 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Sidebar Tabs Links */}
          <nav className="flex flex-col gap-1.5 text-xs font-bold tracking-wider">
            <button
              onClick={() => { setActiveTab('leads'); setSearchQuery(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${activeTab === 'leads' ? 'bg-primary/10 text-primary border border-primary/15 font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent'}`}
            >
              <Users className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>LEADS PIPELINE</span>}
            </button>

            <button
              onClick={() => { setActiveTab('cases'); setSearchQuery(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${activeTab === 'cases' ? 'bg-primary/10 text-primary border border-primary/15 font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent'}`}
            >
              <Briefcase className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>CASE TRACKER</span>}
            </button>

            <button
              onClick={() => { setActiveTab('clients'); setSearchQuery(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${activeTab === 'clients' ? 'bg-primary/10 text-primary border border-primary/15 font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent'}`}
            >
              <Users className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>CLIENT DIRECTORY</span>}
            </button>

            <button
              onClick={() => { setActiveTab('calendar'); setSearchQuery(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${activeTab === 'calendar' ? 'bg-primary/10 text-primary border border-primary/15 font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent'}`}
            >
              <Calendar className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex justify-between items-center w-full">
                  <span>MEETINGS</span>
                  {consultations.length > 0 && (
                    <span className="bg-primary/15 text-primary text-[9px] px-1.5 py-0.5 rounded font-bold">{consultations.length}</span>
                  )}
                </div>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('reports'); setSearchQuery(''); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left ${activeTab === 'reports' ? 'bg-primary/10 text-primary border border-primary/15 font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent'}`}
            >
              <TrendingUp className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>ANALYTICS & POPIA</span>}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Theme toggle and profile */}
        <div className="p-4 border-t border-border/40 flex flex-col gap-3">
          {/* Quick theme trigger inside sidebar */}
          <button 
            onClick={toggleTheme}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 py-2 px-3 hover:bg-border/20 border border-border/60 rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer font-mono text-[9px] font-bold"
            title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {!isSidebarCollapsed && <span>{theme === 'dark' ? 'LIGHT THEME' : 'DARK THEME'}</span>}
          </button>

          {/* User profile widget */}
          <div className="flex items-center justify-between gap-3 h-10 px-1">
            <UserButton />
            {!isSidebarCollapsed && (
              <div className="truncate text-left flex-grow max-w-[140px]">
                <span className="font-bold text-foreground text-xs block truncate leading-none">{user?.fullName || 'Counselor'}</span>
                <span className="text-muted-foreground text-[8px] font-mono uppercase tracking-wider block mt-1">Authorized Staff</span>
              </div>
            )}
          </div>
        </div>

      </aside>

      {/* RIGHT MAIN CONTENT AREA: Scrollable right side */}
      <div className="flex-grow h-screen overflow-y-auto flex flex-col justify-between">
        
        {/* TOP STATUS / BREADCRUMB BAR */}
        <header className="bg-card border-b border-border/40 px-6 py-4 flex items-center justify-between select-none h-16 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="text-muted-foreground">JUSTICE HOUSE</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-primary tracking-wider uppercase">{activeTab === 'calendar' ? 'meetings scheduler' : activeTab === 'reports' ? 'compliance ledger' : `${activeTab} pipeline`}</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[10px] text-muted-foreground">Active Server Port: <strong>3000</strong></span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="flex-grow p-6 sm:p-8 space-y-6 select-none max-w-6xl w-full mx-auto">
          
          {/* Header Snapshot Panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
            <div className="space-y-1 text-left">
              <span className="text-primary text-[10px] tracking-widest block font-bold uppercase font-mono">CRM MANAGEMENT PORTAL</span>
              <h1 className="font-serif text-3xl font-bold tracking-wide text-foreground">
                {activeTab === 'leads' ? 'Leads & Inquiries' :
                 activeTab === 'cases' ? 'Case Tracker Matters' :
                 activeTab === 'clients' ? 'Permanent Contact Directory' :
                 activeTab === 'calendar' ? 'Meetings Calendar' :
                 'Analytics & Compliance Logs'}
              </h1>
            </div>
            
            {/* Quick Metrics */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="bg-card border border-border/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
                <TrendingUp className="h-4 w-4 text-primary animate-pulse" />
                <div>
                  <span className="text-muted-foreground block text-[9px] tracking-wider font-bold">NEW LEADS</span>
                  <span className="font-bold text-foreground">{leads.filter(l => l.status === 'New').length}</span>
                </div>
              </div>
              <div className="bg-card border border-border/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
                <Briefcase className="h-4 w-4 text-primary" />
                <div>
                  <span className="text-muted-foreground block text-[9px] tracking-wider font-bold">ACTIVE CASES</span>
                  <span className="font-bold text-foreground">{cases.filter(c => c.status !== 'Complete').length}</span>
                </div>
              </div>
              <div className="bg-card border border-border/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-sm">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <span className="text-muted-foreground block text-[9px] tracking-wider font-bold">MEETINGS BOOKED</span>
                  <span className="font-bold text-foreground">{consultations.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Areas */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-muted-foreground text-xs font-mono">LOADING CRM RECORDS...</p>
              </div>
            ) : (
              <>
              {/* SEARCH BAR & ADD CLIENT BUTTON */}
              {(activeTab === 'leads' || activeTab === 'clients') && (
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                  <div className="relative flex-grow w-full">
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={activeTab === 'leads' ? "Search client records, names, or legal service lines..." : "Search contact list names..."}
                      className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-3.5 text-xs focus:outline-none focus:border-primary text-foreground"
                    />
                  </div>
                  {activeTab === 'clients' && (
                    <button 
                      onClick={() => setIsAddingClient(!isAddingClient)}
                      className="w-full sm:w-auto bg-primary text-primary-foreground font-mono text-[10px] tracking-widest font-bold px-6 py-3.5 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      {isAddingClient ? 'CANCEL REGISTRATION' : 'ADD NEW CONTACT'}
                    </button>
                  )}
                </div>
              )}

              {/* Inline Add New Client Form */}
              {activeTab === 'clients' && isAddingClient && (
                <div className="bg-card border border-border p-6 rounded-3xl mb-8 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-lavender/5 to-accent/10 blur-md rounded-full"></div>
                  
                  <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-base font-bold text-foreground">Register Manual Contact</h4>
                      <p className="text-muted-foreground text-[10px] leading-relaxed">Add verified client details. This will automatically seed a FICA-verified lead record and create an active Case Matter in our CRM tracker.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveContact} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground col-span-2 md:col-span-1">
                      <label>CLIENT FULL NAME</label>
                      <input 
                        type="text" 
                        required
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder="John Sipho Doe" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                      />
                    </div>
                    <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground col-span-2 md:col-span-1">
                      <label>CELLPHONE CHANNELS</label>
                      <input 
                        type="text" 
                        required
                        value={newClientPhone}
                        onChange={(e) => setNewClientPhone(e.target.value)}
                        placeholder="082 490 6285" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                      />
                    </div>
                    <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground col-span-2 md:col-span-1">
                      <label>EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        value={newClientEmail}
                        onChange={(e) => setNewClientEmail(e.target.value)}
                        placeholder="john.doe@gmail.com" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                      />
                    </div>
                    <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground col-span-2 md:col-span-1">
                      <label>LEGAL SERVICE COMPONENT</label>
                      <select 
                        value={newClientService}
                        onChange={(e) => setNewClientService(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                      >
                        <option>Conveyancing & Property Transfers</option>
                        <option>Notary Services (Antenuptial Contracts)</option>
                        <option>Attorneys & Litigation</option>
                        <option>Advocacy Counsel</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground col-span-2">
                      <label>INITIAL MATTER NOTES / BRIEF</label>
                      <textarea 
                        value={newClientMessage}
                        onChange={(e) => setNewClientMessage(e.target.value)}
                        placeholder="State any specific deed of sale files, ANC details, or pleading files being tracked..." 
                        rows={3}
                        className="w-full bg-background border border-border rounded-xl p-4 text-xs text-foreground focus:outline-none focus:border-primary font-sans resize-none" 
                      />
                    </div>
                    <div className="col-span-2 pt-2">
                      <button 
                        type="submit"
                        className="bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-[10px] tracking-widest font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        SAVE CLIENT & GENERATE MATTER
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 1. LEADS PIPELINE */}
              {activeTab === 'leads' && (
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-border/20 border-b border-border text-muted-foreground font-bold tracking-wider">
                        <tr>
                          <th className="p-4">RECEIVED</th>
                          <th className="p-4">CLIENT DETAILS</th>
                          <th className="p-4">SERVICE INQUIRY</th>
                          <th className="p-4">PIPELINE STATUS</th>
                          <th className="p-4 text-center">DELETE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-border/10 transition-colors">
                            <td className="p-4 whitespace-nowrap text-muted-foreground font-mono text-[10px]">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-foreground block font-sans text-sm">{lead.name}</span>
                              <span className="text-muted-foreground text-[10px] block font-mono mt-0.5">{lead.phone}</span>
                              <span className="text-muted-foreground text-[10px] block font-mono">{lead.email || 'No email'}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-primary block text-[11px] tracking-wide uppercase">{lead.service_type}</span>
                              <span className="text-muted-foreground text-xs block max-w-sm line-clamp-2 mt-1 font-sans" title={lead.message}>
                                {lead.message}
                              </span>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <select 
                                value={lead.status}
                                onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                                className="bg-background border border-border rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-foreground focus:outline-none cursor-pointer hover:border-primary transition-colors"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Consultation Booked">Consultation Booked</option>
                                <option value="Client">Converted (Client)</option>
                                <option value="Closed/Lost">Closed/Lost</option>
                              </select>
                            </td>
                            <td className="p-4 text-center">
                              <button 
                                onClick={() => handleDeleteLead(lead.id)}
                                className="text-muted-foreground hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredLeads.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-12 text-center text-muted-foreground font-mono">
                              No active leads registered.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. CASE TRACKER */}
              {activeTab === 'cases' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cases.map((cs) => (
                    <div key={cs.id} className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
                      
                      <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-start border-b border-border/60 pb-3">
                          <div className="space-y-1">
                            <span className="text-[9px] text-primary tracking-widest block font-bold font-mono uppercase">CASE NO: {cs.case_number || `#${cs.id.substring(0, 8).toUpperCase()}`}</span>
                            <h3 className="font-serif font-bold text-foreground text-lg leading-snug">{cs.client_name}</h3>
                            {cs.access_key && (
                              <span className="text-[8.5px] text-muted-foreground block font-mono">KEY: <strong className="text-foreground select-all bg-border/20 px-1 py-0.5 rounded">{cs.access_key}</strong></span>
                            )}
                          </div>
                          <select 
                            value={cs.status}
                            onChange={(e) => handleUpdateCaseStatus(cs.id, e.target.value as Case['status'])}
                            className="bg-background border border-border rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-primary focus:outline-none cursor-pointer font-sans"
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Awaiting Documents">Awaiting Documents</option>
                            <option value="Complete">Complete</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <span className="font-mono text-[9px] tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded uppercase font-bold">{cs.practice_area}</span>
                          <p className="text-muted-foreground text-xs leading-relaxed font-sans pt-2">{cs.case_title}</p>
                        </div>

                        {/* Documents Section */}
                        <div className="border-t border-border/60 pt-4 space-y-2.5">
                          <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase font-bold block">
                            FICA CASE DOCUMENTS ({cs.documents?.length || 0})
                          </span>
                          
                          {cs.documents && cs.documents.length > 0 ? (
                            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                              {cs.documents.map((doc, dIdx) => (
                                <div key={dIdx} className="bg-background border border-border rounded-xl p-2.5 flex items-center justify-between text-xs shadow-sm font-sans">
                                  <div className="flex items-center gap-2 truncate max-w-[60%]">
                                    <File className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <div className="truncate">
                                      <button 
                                        type="button"
                                        className="font-bold text-foreground hover:underline truncate block text-xs cursor-pointer hover:text-primary transition-colors text-left"
                                        title={`Preview "${doc.name}"`}
                                        onClick={() => handlePreviewDocument(cs.id, cs.client_name, doc.name, doc.url, dIdx)}
                                      >
                                        {doc.name}
                                      </button>
                                      <span className="text-[9px] text-muted-foreground block font-mono">{doc.size}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <select
                                      value={doc.status}
                                      onChange={(e) => handleUpdateDocumentStatus(cs.id, dIdx, e.target.value as any)}
                                      className={`text-[9px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer font-sans ${doc.status === 'Approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : doc.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Approved">Approved</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground block font-sans italic pb-1">
                              No documents uploaded yet for this case matter.
                            </span>
                          )}

                          {/* Inline Case Document Uploader */}
                          <div className="pt-2">
                            <div className="relative">
                              <input 
                                type="file"
                                id={`upload-${cs.id}`}
                                className="hidden"
                                onChange={(e) => handleAddCaseDocument(cs.id, e)}
                                disabled={uploadingCaseId === cs.id}
                              />
                              <label 
                                htmlFor={`upload-${cs.id}`}
                                className={`flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 rounded-xl text-[10px] font-mono tracking-wider font-bold cursor-pointer text-muted-foreground hover:text-foreground transition-all ${uploadingCaseId === cs.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {uploadingCaseId === cs.id ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span>UPLOADING...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-3.5 w-3.5 text-primary" />
                                    <span>APPEND COURT ORDER / FILE</span>
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Notify Client Trigger Button */}
                        <div className="border-t border-border/60 pt-3 space-y-2">
                          <button 
                            type="button"
                            onClick={() => {
                              setNotifyingCaseId(notifyingCaseId === cs.id ? null : cs.id);
                              
                              let prefilledMsg = `Hi ${cs.client_name},\n\nWe have received and verified your FICA uploads for case number ${cs.case_number || 'N/A'}.\n\nYour matter is now marked as ${cs.status.toUpperCase()}.\n\nKind regards,\nNdabas Attorneys.`;
                              if (cs.status === 'Awaiting Documents') {
                                prefilledMsg = `Hi ${cs.client_name},\n\nWe are currently awaiting outstanding FICA files for your case ${cs.case_number || 'N/A'}.\n\nPlease upload them on our tracking portal using your access key, or reply to this WhatsApp bot directly.\n\nKind regards,\nNdabas Attorneys.`;
                              } else if (cs.status === 'Complete') {
                                prefilledMsg = `Hi ${cs.client_name},\n\nWe are pleased to inform you that your case ${cs.case_number || 'N/A'} has been settled successfully.\n\nAll registries are closed. Thank you for choosing Ndabas Attorneys.\n\nKind regards,\nNdabas Attorneys.`;
                              }
                              setNotificationMessage(prefilledMsg);
                              setNotificationSubject(`Legal Status Update - Case ${cs.case_number || 'N/A'}`);
                            }}
                            className="flex items-center gap-1.5 py-2 px-3 border border-border bg-background hover:bg-border/20 rounded-xl text-[10px] font-mono tracking-wider font-bold cursor-pointer text-muted-foreground hover:text-foreground transition-all w-full justify-center"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-primary" />
                            <span>{notifyingCaseId === cs.id ? 'CLOSE NOTIFIER' : 'NOTIFY CLIENT VIA EMAIL/WA'}</span>
                          </button>

                          {/* Add as Client Button inside case cards */}
                          <button 
                            type="button"
                            onClick={() => handleAddAsClient(cs)}
                            className="flex items-center gap-1.5 py-2 px-3 border border-border bg-background hover:bg-border/20 rounded-xl text-[10px] font-mono tracking-wider font-bold cursor-pointer text-muted-foreground hover:text-foreground transition-all w-full justify-center"
                          >
                            <Users className="h-3.5 w-3.5 text-primary" />
                            <span>ADD CLIENT TO CONTACT DIRECTORY</span>
                          </button>
                        </div>

                        {/* Inline Client Notification Dashboard Panel */}
                        {notifyingCaseId === cs.id && (
                          <div className="border border-border/80 bg-background/50 rounded-2xl p-4.5 space-y-3 shadow-inner">
                            <div className="flex items-center justify-between border-b border-border/40 pb-2">
                              <span className="font-mono text-[9px] font-bold text-muted-foreground tracking-widest uppercase">CLIENT ALERTS</span>
                              <div className="flex gap-2">
                                <button 
                                  type="button" 
                                  onClick={() => setNotificationMethod('Email')} 
                                  className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold transition-all ${notificationMethod === 'Email' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border'}`}
                                >
                                  EMAIL
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => setNotificationMethod('WhatsApp')} 
                                  className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold transition-all ${notificationMethod === 'WhatsApp' ? 'bg-green-600 text-white' : 'bg-card text-muted-foreground border border-border'}`}
                                >
                                  WHATSAPP
                                </button>
                              </div>
                            </div>

                            <div className="space-y-2 text-xs">
                              {notificationMethod === 'Email' && (
                                <div className="space-y-1 font-mono text-[9px] text-muted-foreground">
                                  <label>SUBJECT</label>
                                  <input 
                                    type="text" 
                                    value={notificationSubject}
                                    onChange={(e) => setNotificationSubject(e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                                  />
                                </div>
                              )}
                              <div className="space-y-1 font-mono text-[9px] text-muted-foreground">
                                <label>MESSAGE STATEMENT</label>
                                <textarea 
                                  value={notificationMessage}
                                  onChange={(e) => setNotificationMessage(e.target.value)}
                                  rows={4}
                                  className="w-full bg-background border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans resize-none" 
                                />
                              </div>

                              <button
                                type="button"
                                disabled={isSendingNotification}
                                onClick={() => handleSendClientNotification(cs)}
                                className={`w-full py-2.5 rounded-xl font-mono text-[9px] tracking-wider font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all ${notificationMethod === 'Email' ? 'bg-foreground text-background dark:bg-foreground dark:text-background' : 'bg-green-600 text-white'}`}
                              >
                                {isSendingNotification ? (
                                  <span>TRANSMITTING...</span>
                                ) : (
                                  <>
                                    <Send className="h-3 w-3" />
                                    <span>{notificationMethod === 'Email' ? 'Send Compliance Email' : 'Launch WhatsApp Chat'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                      </div>

                      <div className="flex justify-between text-[9px] text-muted-foreground border-t border-border/60 pt-3 mt-4 relative z-10 font-mono">
                        <span>Opened: {new Date(cs.created_at).toLocaleDateString()}</span>
                        <div className="flex gap-4 items-center">
                          {cs.key_dates && <span className="text-primary font-bold">Notice: {cs.key_dates}</span>}
                          <button 
                            onClick={() => handleDeleteCase(cs.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {cases.length === 0 && (
                    <div className="col-span-2 bg-card border border-border p-12 rounded-3xl text-center text-muted-foreground">
                      No active case matters tracked. Convert a lead to Client to open a matter automatically.
                    </div>
                  )}
                </div>
              )}

              {/* 3. CLIENT DIRECTORY */}
              {activeTab === 'clients' && (
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-border/20 border-b border-border text-muted-foreground font-bold tracking-wider">
                      <tr>
                        <th className="p-4">CLIENT NAME</th>
                        <th className="p-4">PHONE CHANNELS</th>
                        <th className="p-4">EMAIL ADDRESS</th>
                        <th className="p-4">DATE ONBOARDED</th>
                        <th className="p-4 text-center">FICA STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredClients.map((cl) => (
                        <tr key={cl.id} className="hover:bg-border/10 transition-colors">
                          <td className="p-4 font-bold text-foreground font-sans text-sm">{cl.name}</td>
                          <td className="p-4 text-muted-foreground font-mono">{cl.phone}</td>
                          <td className="p-4 text-muted-foreground font-mono">{cl.email || 'N/A'}</td>
                          <td className="p-4 text-muted-foreground font-mono">{new Date(cl.created_at).toLocaleDateString()}</td>
                          <td className="p-4 text-center">
                            <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide">✓ VERIFIED FICA</span>
                          </td>
                        </tr>
                      ))}
                      {filteredClients.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-muted-foreground font-mono">
                            No onboarded client records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 4. CALENDAR VIEW */}
              {activeTab === 'calendar' && (
                <div className="space-y-10">
                  
                  {/* Pending consultations grid */}
                  <div className="space-y-4">
                    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                      <h3 className="font-serif text-lg font-bold text-foreground mb-1">Pending Consultations</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed max-w-xl font-sans">
                        These consultations were booked by clients through our website. Staff can contact the client manually to confirm dates and mark their lead pipeline record once finalized.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {consultations.map((cons) => (
                        <div key={cons.id} className="bg-card border border-border p-5 rounded-3xl shadow-sm flex items-start justify-between gap-4 relative overflow-hidden text-left">
                          <div className="absolute top-0 right-0 w-16 h-14 bg-gradient-to-br from-lavender/5 to-accent/10 blur-md rounded-full"></div>
                          <div className="space-y-3 relative z-10">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4.5 w-4.5 text-primary" />
                              <span className="font-bold text-foreground text-sm font-mono">Pending Confirmation</span>
                            </div>
                            <div className="space-y-1 font-sans text-xs text-muted-foreground">
                              <span>Client: <strong className="text-foreground">{cons.name}</strong></span>
                              <span className="block">Contact: <strong className="text-foreground">{cons.phone}</strong></span>
                              <span className="block">Email: <strong className="text-foreground">{cons.email || 'N/A'}</strong></span>
                              <span className="text-primary font-bold block mt-2.5 tracking-wider text-[11px] uppercase">Service: {cons.service_type}</span>
                            </div>
                          </div>

                          <div className="relative z-10 shrink-0">
                            <button 
                              onClick={() => {
                                handleUpdateLeadStatus(cons.id, 'Contacted');
                                showToast(`Consultation for "${cons.name}" marked as contacted!`, 'success');
                              }}
                              className="bg-primary text-primary-foreground font-mono text-[9px] tracking-widest font-bold px-3 py-2.5 rounded-xl hover:opacity-90 shadow cursor-pointer"
                            >
                              MARK CONTACTED
                            </button>
                          </div>
                        </div>
                      ))}
                      {consultations.length === 0 && (
                        <div className="col-span-2 bg-card border border-border p-12 rounded-3xl text-center text-muted-foreground font-mono">
                          No pending consultations booked currently.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contacted / Completed Consultations grid */}
                  <div className="border-t border-border/40 pt-8 space-y-4">
                    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                      <h3 className="font-serif text-lg font-bold text-foreground mb-1">Contacted / Completed Consultations</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed max-w-xl font-sans">
                        These are consultations that have been successfully contacted by staff. You can view their details or directly register them as clients in your active Contact Directory from here!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {leads.filter(l => l.status === 'Contacted').map((cons) => (
                        <div key={cons.id} className="bg-card border border-border p-5 rounded-3xl shadow-sm flex items-start justify-between gap-4 relative overflow-hidden text-left">
                          <div className="absolute top-0 right-0 w-16 h-14 bg-gradient-to-br from-green-500/5 to-emerald-500/10 blur-md rounded-full"></div>
                          <div className="space-y-3 relative z-10">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                              <span className="font-bold text-green-500 text-xs font-mono uppercase tracking-wider">COMPLETED / CONTACTED</span>
                            </div>
                            <div className="space-y-1 font-sans text-xs text-muted-foreground">
                              <span>Client Name: <strong className="text-foreground">{cons.name}</strong></span>
                              <span className="block">Contact: <strong className="text-foreground">{cons.phone}</strong></span>
                              <span className="block">Email: <strong className="text-foreground">{cons.email || 'N/A'}</strong></span>
                              <span className="text-primary font-bold block mt-2.5 tracking-wider text-[11px] uppercase">Service: {cons.service_type}</span>
                            </div>
                          </div>

                          <div className="relative z-10 shrink-0">
                            <button 
                              onClick={() => {
                                // Add as Client directly!
                                const mockCase = {
                                  client_name: cons.name,
                                  practice_area: cons.service_type,
                                  case_title: `Manual consultation: ${cons.name}`
                                } as any;
                                handleAddAsClient(mockCase);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white font-mono text-[9px] tracking-widest font-bold px-3.5 py-2.5 rounded-xl shadow flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                            >
                              <Users className="h-3.5 w-3.5" />
                              <span>CONVERT TO CLIENT</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      {leads.filter(l => l.status === 'Contacted').length === 0 && (
                        <div className="col-span-2 bg-card border border-border p-12 rounded-3xl text-center text-muted-foreground font-mono">
                          No completed/contacted consultations logged currently.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* 5. REPORTS TAB */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-foreground mb-1">CRM Analytics & Insights</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-xl font-sans">
                      A visual summary tracking the firm's client onboarding, leads volume, and performance indicators under POPIA/LPC guidelines.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Leads by Status Graphic */}
                    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4">
                      <h4 className="font-serif font-bold text-foreground text-sm tracking-wide">LEAD CONVERSION FLOW</h4>
                      <div className="space-y-3 font-mono text-[11px]">
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>NEW REQUESTS</span>
                            <span className="font-bold text-foreground">{leads.filter(l => l.status === 'New').length}</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${Math.max(10, leads.length ? (leads.filter(l => l.status === 'New').length / leads.length) * 100 : 0)}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>CONTACTED PIPELINE</span>
                            <span className="font-bold text-foreground">{leads.filter(l => l.status === 'Contacted').length}</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-lavender" style={{ width: `${Math.max(10, leads.length ? (leads.filter(l => l.status === 'Contacted').length / leads.length) * 100 : 0)}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>CONSULTATION BOOKED</span>
                            <span className="font-bold text-foreground">{leads.filter(l => l.status === 'Consultation Booked').length}</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${Math.max(10, leads.length ? (leads.filter(l => l.status === 'Consultation Booked').length / leads.length) * 100 : 0)}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>CONVERTED CLIENTS</span>
                            <span className="font-bold text-green-500">{leads.filter(l => l.status === 'Client').length}</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${Math.max(10, leads.length ? (leads.filter(l => l.status === 'Client').length / leads.length) * 100 : 0)}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services Popularity Graphic */}
                    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4">
                      <h4 className="font-serif font-bold text-foreground text-sm tracking-wide">PRACTICE AREA DISTRIBUTIONS</h4>
                      <div className="space-y-3 font-mono text-[11px]">
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>CONVEYANCING & DEEDS</span>
                            <span className="font-bold text-foreground">{leads.filter(l => l.service_type.includes('Conveyancing')).length} leads</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${leads.length ? (leads.filter(l => l.service_type.includes('Conveyancing')).length / leads.length) * 100 : 0}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>ATTORNEYS & LITIGATION</span>
                            <span className="font-bold text-foreground">{leads.filter(l => l.service_type.includes('Litigation') || l.service_type.includes('Attorneys')).length} leads</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-lavender" style={{ width: `${leads.length ? (leads.filter(l => l.service_type.includes('Litigation') || l.service_type.includes('Attorneys')).length / leads.length) * 100 : 0}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>NOTARY PUBLIC ACTS</span>
                            <span className="font-bold text-foreground">{leads.filter(l => l.service_type.includes('Notary')).length} leads</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${leads.length ? (leads.filter(l => l.service_type.includes('Notary')).length / leads.length) * 100 : 0}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* POPIA Compliance Audit Log Viewer */}
                  <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4">
                    <div className="flex items-start gap-3 border-b border-border/60 pb-3 flex-col sm:flex-row">
                      <History className="h-5 w-5 text-primary shrink-0 mt-1" />
                      <div>
                        <h4 className="font-serif font-bold text-foreground text-sm tracking-wide uppercase">POPIA SECURITY & DOCUMENT ACCESS COMPLIANCE LOGS</h4>
                        <p className="text-muted-foreground text-[10px] font-sans leading-relaxed mt-0.5">
                          In compliance with South Africa's Protection of Personal Information Act (POPIA), this live trail logs all administrative file interactions—including client self-onboarded uploads, internal attorney views, and document validations.
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-border/10 border-b border-border text-muted-foreground font-bold tracking-wider">
                          <tr>
                            <th className="p-3">TIMESTAMP</th>
                            <th className="p-3">OPERATOR EMAIL</th>
                            <th className="p-3">MATTER CLIENT</th>
                            <th className="p-3">DOCUMENT FILE NAME</th>
                            <th className="p-3 text-center">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40 font-mono">
                          {popiaLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-border/10 transition-colors">
                              <td className="p-3 text-muted-foreground text-[10px] whitespace-nowrap">
                                {new Date(log.created_at).toLocaleString()}
                              </td>
                              <td className="p-3 text-foreground font-bold whitespace-nowrap">
                                {log.user_email}
                              </td>
                              <td className="p-3 text-muted-foreground whitespace-nowrap">
                                {log.case_title}
                              </td>
                              <td className="p-3 text-primary truncate max-w-[200px]" title={log.document_name}>
                                {log.document_name}
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold ${
                                  log.action === 'Viewed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/10' :
                                  log.action === 'Approved' ? 'bg-green-500/10 text-green-500 border border-green-500/10' :
                                  log.action === 'Rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/10' :
                                  'bg-purple-500/10 text-purple-500 border border-purple-500/10'
                                }`}>
                                  {log.action.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {popiaLogs.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-muted-foreground font-sans italic">
                                No POPIA audit events logged yet in active database.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </main>

      {/* Floating Document Previewer Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm p-4 font-sans select-none">
            {/* Click outside to close */}
            <div className="absolute inset-0 animate-none" onClick={() => setPreviewDoc(null)}></div>
            
            {/* Drawer container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 30 }}
              className="relative w-full max-w-5xl h-full max-h-[92vh] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Top Side: Giant Document Renderer */}
              <div className="flex-grow bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-3 relative h-[80%] border-b border-border/40">
                {/* Floating close button in top right corner of the document */}
                <button 
                  onClick={() => setPreviewDoc(null)}
                  className="absolute top-4 right-4 z-20 p-2 bg-card/85 backdrop-blur-md hover:bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-md"
                  title="Close Preview"
                >
                  <X className="h-4.5 w-4.5" />
                </button>

                {previewDoc.url.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp|svg)/) ? (
                  <img src={previewDoc.url} alt={previewDoc.name} className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
                ) : (
                  <iframe 
                    src={previewDoc.url} 
                    title={previewDoc.name}
                    className="w-full h-full border-0 rounded-lg shadow-inner"
                  ></iframe>
                )}
              </div>

              {/* Bottom Side: Compliance Details & Actions (aligned from left to right) */}
              <div className="bg-card py-4.5 px-6 flex flex-col md:flex-row items-center justify-between gap-4 select-none text-left border-t border-border/20">
                
                {/* Left: Metadata */}
                <div className="flex items-center gap-3 max-w-sm truncate text-left shrink-0 w-full md:w-auto">
                  <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl">
                    <FileText className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div className="truncate">
                    <span className="font-mono text-[8px] tracking-[0.2em] text-primary font-bold block uppercase">PREVIEWING FICA DOCUMENT</span>
                    <h4 className="font-serif font-bold text-foreground text-xs leading-none truncate max-w-[180px] mt-0.5" title={previewDoc.name}>{previewDoc.name}</h4>
                    <span className="text-muted-foreground text-[10px] block mt-0.5">Client Matter: <strong className="text-foreground">{previewDoc.clientName}</strong></span>
                  </div>
                </div>

                {/* Center: Compact POPIA compliance warning */}
                <div className="hidden lg:flex items-center gap-2.5 bg-background border border-border/60 px-4 py-2.5 rounded-2xl text-[10px] text-muted-foreground leading-normal max-w-md text-left">
                  <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0" />
                  <span>POPIA AUDITED: All file reviews and status adjustments are logged permanently under operator: <strong className="text-foreground">{user?.primaryEmailAddress?.emailAddress || 'staff'}</strong>.</span>
                </div>

                {/* Right: Approve & Reject Actions */}
                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateDocumentStatus(previewDoc.caseId, previewDoc.docIndex, 'Approved');
                      setPreviewDoc(null);
                    }}
                    className="flex-grow md:flex-grow-0 bg-green-600 hover:bg-green-700 text-white font-mono text-[9px] tracking-widest font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>APPROVE</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateDocumentStatus(previewDoc.caseId, previewDoc.docIndex, 'Rejected');
                      setPreviewDoc(null);
                    }}
                    className="flex-grow md:flex-grow-0 bg-red-600 hover:bg-red-700 text-white font-mono text-[9px] tracking-widest font-bold px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>REJECT</span>
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Alerts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full select-none pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`p-4 rounded-2xl shadow-lg border text-xs font-sans font-bold flex items-center justify-between gap-3 pointer-events-auto leading-relaxed ${
                t.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 bg-card' 
                  : t.type === 'error' 
                    ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 bg-card' 
                    : 'bg-primary/10 border-primary/20 text-primary bg-card'
              }`}
            >
              <span>{t.message}</span>
              <button 
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="text-muted-foreground hover:text-foreground font-bold cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Footer />
      </div>

    </div>
  );
}
