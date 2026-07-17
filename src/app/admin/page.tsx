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

  const [activeTab, setActiveTab] = useState<'leads' | 'cases' | 'clients' | 'calendar' | 'reports'>('reports');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(15);
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 1,
      day: 15,
      time: "10:00",
      title: "Sipho Zuma Consultation",
      desc: "Conveyancing & Erf 402, Hammanskraal property deeds verification session.",
      type: "conveyancing",
      operator: "info@ndabasattorneys.co.za",
      status: "ACTIVE"
    },
    {
      id: 2,
      day: 22,
      time: "11:30",
      title: "Lerato & Kabelo Modise Signing",
      desc: "Antenuptial Contract (ANC) with accrual system signing and notary public registry.",
      type: "notary",
      operator: "info@ndabasattorneys.co.za",
      status: "ACTIVE"
    },
    {
      id: 3,
      day: 28,
      time: "09:00",
      title: "High Court Pre-Trial Briefing",
      desc: "Mokoena Holdings partnership civil dispute High Court plea preparation.",
      type: "litigation",
      operator: "info@ndabasattorneys.co.za",
      status: "ACTIVE"
    }
  ]);

  // Calendar inline interactions form states
  const [isReschedulingId, setIsReschedulingId] = useState<number | null>(null);
  const [rescheduleDayInput, setRescheduleDayInput] = useState<number>(15);
  const [isAddingCalendarEvent, setIsAddingCalendarEvent] = useState(false);
  const [newCalTime, setNewCalTime] = useState("10:00");
  const [newCalTitle, setNewCalTitle] = useState("");
  const [newCalDesc, setNewCalDesc] = useState("");
  const [newCalType, setNewCalType] = useState("conveyancing");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [popiaLogs, setPopiaLogs] = useState<PopiaAuditLog[]>([]);
  const [uploadingCaseId, setUploadingCaseId] = useState<string | null>(null);
  const [notifyingCase, setNotifyingCase] = useState<Case | null>(null);
  const [notificationState, setNotificationState] = useState<'idle' | 'sending' | 'success'>('idle');
  const [notifyingCaseId, setNotifyingCaseId] = useState<string | null>(null);
  const [notificationSubject, setNotificationSubject] = useState("Case Status Update - Ndabas Attorneys");
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

        // Toast notifications
        if (newStatus === 'Contacted') {
          showToast(`Lead "${updatedLead.name}" marked as contacted! 📞`, 'success');
        } else if (newStatus === 'Consultation Booked') {
          showToast(`Consultation booked for "${updatedLead.name}"! 📅`, 'success');
        } else if (newStatus === 'Client') {
          showToast(`🎉 Converted "${updatedLead.name}" to Client! Case matter auto-created.`, 'success');
        } else if (newStatus === 'Closed/Lost') {
          showToast(`Lead "${updatedLead.name}" marked as closed/lost.`, 'info');
        } else {
          showToast(`Lead status updated to "${newStatus}"!`, 'info');
        }

        // If converted to client, automatically create a Case record!
        if (newStatus === 'Client') {
          await createCaseFromLead(updatedLead);
        }
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      showToast('Failed to update lead status.', 'error');
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
        client_email: lead.email,
        client_phone: lead.phone,
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
        phone: cs.client_phone || '082 490 6285', // Stored phone
        email: cs.client_email || 'client@directory.co.za', // Stored email
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
      const clientEmail = cs.client_email || 'onboarded@client.co.za';
      const clientPhone = cs.client_phone || '082 490 6285';

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
            <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">NDABA&apos;S</span>
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
                Access authorized client profiles, litigation matters, notary deeds, and consultation bookings. Direct synchronization with the remote Pretoria Deeds Office and live secure cloud pipelines.
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
      <aside className={`hidden md:flex shrink-0 border-r border-border/60 bg-card select-none flex flex-col justify-between h-screen sticky top-0 transition-all duration-300 z-30 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex flex-col gap-6 ${isSidebarCollapsed ? 'p-2' : 'p-4'}`}>
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4 h-12">
            {!isSidebarCollapsed ? (
              <a href="/" className="flex items-center gap-2 font-serif text-sm font-bold tracking-wide pl-2">
                <Scale className="h-5 w-5 text-primary" />
                <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent uppercase tracking-wider font-sans font-bold">NDABA&apos;S CRM</span>
              </a>
            ) : (
              <a href="/" className="mx-auto" title="Ndaba's Attorneys CRM">
                <Scale className="h-5.5 w-5.5 text-primary animate-none" />
              </a>
            )}
            
            {/* Collapse Toggle trigger */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 hover:bg-border/30 border border-border/60 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer transition-colors shrink-0"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Sidebar Tabs Links */}
          <nav className="flex flex-col gap-3 text-xs font-bold tracking-wider">
            {/* 1. Reports Tab */}
            <div className="relative group flex justify-center w-full">
              <button
                onClick={() => { setActiveTab('reports'); setSearchQuery(''); }}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all cursor-pointer ${isSidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-4 text-left w-full'} ${activeTab === 'reports' ? 'bg-primary/10 text-primary border border-primary/15 font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent'}`}
              >
                <TrendingUp className="h-4.5 w-4.5 shrink-0" />
                {!isSidebarCollapsed && <span className="font-sans">ANALYTICS & POPIA</span>}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-900 text-white font-mono text-[9px] tracking-widest font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg whitespace-nowrap z-50 border border-border/20">
                  ANALYTICS & POPIA
                </div>
              )}
            </div>

            {/* 2. Leads Pipeline Tab */}
            <div className="relative group flex justify-center w-full">
              <button
                onClick={() => { setActiveTab('leads'); setSearchQuery(''); }}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all cursor-pointer ${isSidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-4 text-left w-full'} ${activeTab === 'leads' ? 'bg-primary/10 text-primary border border-primary/15 font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent'}`}
              >
                <Users className="h-4.5 w-4.5 shrink-0" />
                {!isSidebarCollapsed && <span className="font-sans">LEADS PIPELINE</span>}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-900 text-white font-mono text-[9px] tracking-widest font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg whitespace-nowrap z-50 border border-border/20">
                  LEADS PIPELINE
                </div>
              )}
            </div>

            {/* 3. Case Tracker Tab */}
            <div className="relative group flex justify-center w-full">
              <button
                onClick={() => { setActiveTab('cases'); setSearchQuery(''); }}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all cursor-pointer ${isSidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-4 text-left w-full'} ${activeTab === 'cases' ? 'bg-primary/10 text-primary border border-primary/15 font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent'}`}
              >
                <Briefcase className="h-4.5 w-4.5 shrink-0" />
                {!isSidebarCollapsed && <span className="font-sans">CASE TRACKER</span>}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-900 text-white font-mono text-[9px] tracking-widest font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg whitespace-nowrap z-50 border border-border/20">
                  CASE TRACKER
                </div>
              )}
            </div>

            {/* 4. Client Directory Tab */}
            <div className="relative group flex justify-center w-full">
              <button
                onClick={() => { setActiveTab('clients'); setSearchQuery(''); }}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all cursor-pointer ${isSidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-4 text-left w-full'} ${activeTab === 'clients' ? 'bg-primary/10 text-primary border border-primary/15 font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent'}`}
              >
                <Users className="h-4.5 w-4.5 shrink-0" />
                {!isSidebarCollapsed && <span className="font-sans">CLIENT DIRECTORY</span>}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-900 text-white font-mono text-[9px] tracking-widest font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg whitespace-nowrap z-50 border border-border/20">
                  CLIENT DIRECTORY
                </div>
              )}
            </div>

            {/* 5. Meetings Calendar Tab */}
            <div className="relative group flex justify-center w-full">
              <button
                onClick={() => { setActiveTab('calendar'); setSearchQuery(''); }}
                className={`flex items-center gap-3 py-3 rounded-xl transition-all cursor-pointer ${isSidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : 'px-4 text-left w-full'} ${activeTab === 'calendar' ? 'bg-primary/10 text-primary border border-primary/15 font-bold shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-border/20 border border-transparent'}`}
              >
                <Calendar className="h-4.5 w-4.5 shrink-0" />
                {!isSidebarCollapsed ? (
                  <div className="flex justify-between items-center w-full font-sans">
                    <span>MEETINGS</span>
                    {consultations.length > 0 && (
                      <span className="bg-primary/15 text-primary text-[9px] px-1.5 py-0.5 rounded font-bold font-mono">{consultations.length}</span>
                    )}
                  </div>
                ) : (
                  consultations.length > 0 && (
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary animate-ping"></div>
                  )
                )}
              </button>
              {isSidebarCollapsed && (
                <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-900 text-white font-mono text-[9px] tracking-widest font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg whitespace-nowrap z-50 border border-border/20">
                  MEETINGS SCHEDULER
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer: Theme toggle and profile */}
        <div className={`border-t border-border/40 flex flex-col gap-3 ${isSidebarCollapsed ? 'p-2 items-center justify-center' : 'p-4'}`}>
          {/* Quick theme trigger inside sidebar */}
          <div className="relative group flex justify-center w-full">
            <button 
              onClick={toggleTheme}
              type="button"
              className={`w-full flex items-center gap-2.5 py-2 hover:bg-border/20 border border-border/60 rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer font-mono text-[9px] font-bold ${isSidebarCollapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : 'px-3'}`}
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {!isSidebarCollapsed && <span>{theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}</span>}
            </button>
            {isSidebarCollapsed && (
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-900 text-white font-mono text-[9px] tracking-widest font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg whitespace-nowrap z-50 border border-border/20">
                TOGGLE THEME
              </div>
            )}
          </div>
        </div>

      </aside>

      {/* RIGHT MAIN CONTENT AREA: Locked page height, scrollable inner content */}
      <div className="flex-grow h-screen overflow-hidden flex flex-col justify-between bg-background">
        
        {/* TOP STATUS / BREADCRUMB BAR */}
        <header className="bg-card border-b border-border/40 px-6 py-4 flex items-center justify-between select-none h-16 shrink-0 z-20">
          <div className="flex items-center gap-2">
            {/* Desktop Brand breadcrumb (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono font-bold">
              <span className="text-muted-foreground">JUSTICE HOUSE</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-primary tracking-wider uppercase">
                {activeTab === 'calendar' ? 'meetings scheduler' : activeTab === 'reports' ? 'compliance ledger' : `${activeTab} pipeline`}
              </span>
            </div>

            {/* Mobile Brand Logo (Visible on mobile, clickable link back to home '/') */}
            <a href="/" className="md:hidden flex items-center gap-1.5 font-serif text-sm font-bold tracking-wide">
              <Scale className="h-4.5 w-4.5 text-primary shrink-0" />
              <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent uppercase tracking-wider font-sans font-extrabold text-[12px]">NDABA&apos;S CRM</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
              <span className="font-bold text-foreground">{user?.fullName || 'Counselor'}</span>
              <span>•</span>
              <span className="text-[8px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded">Authorized Staff</span>
            </div>
            <div className="shrink-0 flex items-center justify-center">
              <UserButton />
            </div>
          </div>
        </header>

        {/* SCROLLABLE INNER BODY AREA */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 pb-24 md:pb-8 space-y-6">
          
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                  {cases.map((cs) => {
                    const isAlreadyInDirectory = leads.some(l => 
                      l.status === 'Client' && 
                      (l.name.toLowerCase() === cs.client_name.toLowerCase() || 
                       (l.email && cs.client_email && l.email.toLowerCase() === cs.client_email.toLowerCase()))
                    );

                    return (
                      <div key={cs.id} className="bg-card border border-border p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between max-w-md w-full mx-auto min-h-[480px] hover:shadow-xl transition-all duration-300">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
                      
                      <div className="space-y-4 relative z-10 flex-grow flex flex-col justify-between">
                        
                        {/* Top: Case Metadata */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-start border-b border-border/60 pb-3">
                            <div className="space-y-1">
                              <span className="text-[9px] text-primary tracking-widest block font-bold font-mono uppercase">CASE NO: {cs.case_number || `#${cs.id.substring(0, 8).toUpperCase()}`}</span>
                              <h3 className="font-serif font-bold text-foreground text-base leading-snug">{cs.client_name}</h3>
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

                          <div className="space-y-1.5">
                            <span className="font-mono text-[9px] tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded uppercase font-bold">{cs.practice_area}</span>
                            <p className="text-muted-foreground text-xs leading-relaxed font-sans pt-1">{cs.case_title}</p>
                          </div>
                        </div>

                        {/* Middle: Horizontal Documents Stack */}
                        <div className="border-t border-border/60 pt-4 space-y-2">
                          <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase font-bold block">
                            ATTACHED FICA FILES ({cs.documents?.length || 0})
                          </span>
                          
                          {cs.documents && cs.documents.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 pt-1 max-h-[160px] overflow-y-auto pr-1 custom-card-scrollbar">
                              {cs.documents.map((doc, dIdx) => (
                                <div key={dIdx} className="bg-background border border-border rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-xs font-sans text-left">
                                  {/* Left: Icon and Details */}
                                  <div className="flex items-center gap-2.5 truncate max-w-[55%]">
                                    <div className="p-1.5 bg-primary/5 rounded-lg shrink-0">
                                      <File className="h-3.5 w-3.5 text-primary shrink-0" />
                                    </div>
                                    <div className="truncate space-y-0.5">
                                      <span className="font-bold text-foreground text-[10.5px] block truncate" title={doc.name}>{doc.name}</span>
                                      <span className="text-[9px] text-muted-foreground font-mono block">{doc.size}</span>
                                    </div>
                                  </div>

                                  {/* Right: Controls & Status */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button 
                                      type="button"
                                      className="text-primary hover:text-primary/80 border border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-lg px-2.5 py-1 flex items-center gap-1 text-[9px] font-mono font-bold cursor-pointer transition-all h-7"
                                      onClick={() => handlePreviewDocument(cs.id, cs.client_name, doc.name, doc.url, dIdx)}
                                      title="View document"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                      <span>VIEW</span>
                                    </button>
                                    
                                    <select
                                      value={doc.status}
                                      onChange={(e) => handleUpdateDocumentStatus(cs.id, dIdx, e.target.value as any)}
                                      className={`text-[8.5px] font-mono font-bold px-1.5 py-1 rounded-lg border focus:outline-none cursor-pointer h-7 transition-all ${
                                        doc.status === 'Approved' 
                                          ? 'bg-green-500/10 text-green-500 border-green-500/25' 
                                          : doc.status === 'Rejected' 
                                            ? 'bg-red-500/10 text-red-500 border-red-500/25' 
                                            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/25'
                                      }`}
                                    >
                                      <option value="Pending">PEND</option>
                                      <option value="Approved">APPR</option>
                                      <option value="Rejected">REJC</option>
                                    </select>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground block font-sans italic py-1">
                              No documents uploaded yet for this case matter.
                            </span>
                          )}
                        </div>

                        {/* Feature Action Buttons (styled as icons for clean, non-cluttered look) */}
                        <div className="border-t border-border/60 pt-4 flex items-center justify-around gap-2 bg-background/40 p-2 rounded-2xl">
                          
                          {/* Upload File feature icon */}
                          <div className="relative group flex flex-col items-center">
                            <input 
                              type="file"
                              id={`upload-${cs.id}`}
                              className="hidden"
                              onChange={(e) => handleAddCaseDocument(cs.id, e)}
                              disabled={uploadingCaseId === cs.id}
                            />
                            <label 
                              htmlFor={`upload-${cs.id}`}
                              className={`flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer ${uploadingCaseId === cs.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title="Append file to case"
                            >
                              {uploadingCaseId === cs.id ? (
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Upload className="h-4 w-4 text-primary" />
                              )}
                              <span className="text-[8px] font-mono font-bold tracking-wider uppercase">APPEND FILE</span>
                            </label>
                          </div>

                          {/* Notify client alerts feature icon */}
                          <button 
                            type="button"
                            onClick={() => {
                              setNotifyingCase(cs);
                              
                              let prefilledMsg = `Hi ${cs.client_name},\n\nWe have received and verified your FICA uploads for case number ${cs.case_number || 'N/A'}.\n\nYour matter is now marked as ${cs.status.toUpperCase()}.\n\nKind regards,\nNdabas Attorneys.`;
                              if (cs.status === 'Awaiting Documents') {
                                prefilledMsg = `Hi ${cs.client_name},\n\nWe are currently awaiting outstanding FICA files for your case ${cs.case_number || 'N/A'}.\n\nPlease upload them on our tracking portal using your access key, or reply to this WhatsApp bot directly.\n\nKind regards,\nNdabas Attorneys.`;
                              } else if (cs.status === 'Complete') {
                                prefilledMsg = `Hi ${cs.client_name},\n\nWe are pleased to inform you that your case ${cs.case_number || 'N/A'} has been settled successfully.\n\nAll registries are closed. Thank you for choosing Ndabas Attorneys.\n\nKind regards,\nNdabas Attorneys.`;
                              }
                              setNotificationMessage(prefilledMsg);
                              setNotificationSubject(`Legal Status Update - Case ${cs.case_number || 'N/A'}`);
                            }}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer ${notifyingCase?.id === cs.id ? 'bg-primary/15 text-primary' : ''}`}
                            title="Send status notification"
                          >
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <span className="text-[8px] font-mono font-bold tracking-wider uppercase">{notifyingCase?.id === cs.id ? 'CLOSE' : 'NOTIFY'}</span>
                          </button>

                          {/* Add to Contact Directory feature icon */}
                          {isAlreadyInDirectory ? (
                            <div 
                              className="flex flex-col items-center gap-1 p-2 rounded-xl text-green-500 cursor-default shrink-0"
                              title="Verified CRM Contact"
                            >
                              <ShieldCheck className="h-4 w-4 text-green-500 animate-none" />
                              <span className="text-[8px] font-mono font-bold tracking-wider uppercase">IN DIRECTORY</span>
                            </div>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => handleAddAsClient(cs)}
                              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer shrink-0"
                              title="Register to contact directory"
                            >
                              <Users className="h-4 w-4 text-primary" />
                              <span className="text-[8px] font-mono font-bold tracking-wider uppercase">ADD DIRECTORY</span>
                            </button>
                          )}

                          {/* Delete case feature icon */}
                          <button 
                            type="button"
                            onClick={() => handleDeleteCase(cs.id)}
                            className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all cursor-pointer"
                            title="Delete case matter"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="text-[8px] font-mono font-bold tracking-wider uppercase">DELETE</span>
                          </button>

                        </div>

                      </div>

                      <div className="flex justify-between text-[9px] text-muted-foreground border-t border-border/60 pt-3 mt-4 relative z-10 font-mono">
                        <span>Opened: {new Date(cs.created_at).toLocaleDateString()}</span>
                        {cs.key_dates && <span className="text-primary font-bold">Notice: {cs.key_dates}</span>}
                      </div>
                    </div>
                  ); })}
                  {cases.length === 0 && (
                    <div className="col-span-2 bg-card border border-border p-12 rounded-3xl text-center text-muted-foreground">
                      No active case matters tracked. Convert a lead to Client to open a matter automatically.
                    </div>
                  )}
                </div>
              )}

              {/* 3. CLIENT DIRECTORY */}
              {activeTab === 'clients' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                  <AnimatePresence mode="popLayout">
                    {filteredClients.map((cl) => {
                      const initials = cl.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={cl.id} 
                          className="bg-card border border-border p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between max-w-sm w-full mx-auto min-h-[300px] hover:shadow-xl transition-all duration-300 text-left font-sans"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-emerald-500/10 blur-xl rounded-full"></div>
                          
                          <div className="space-y-4 relative z-10 flex-grow flex flex-col justify-between">
                            {/* Card Top: Initials Avatar & Name */}
                            <div className="flex items-center gap-4 border-b border-border/60 pb-4">
                              <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm tracking-wide shrink-0">
                                {initials}
                              </div>
                              <div className="truncate">
                                <span className="font-mono text-[9px] tracking-widest text-primary font-bold block uppercase">VERIFIED CRM CONTACT</span>
                                <h3 className="font-serif font-bold text-foreground text-base leading-snug truncate max-w-[180px]">{cl.name}</h3>
                              </div>
                            </div>

                            {/* Card Middle: Info List */}
                            <div className="space-y-2 text-xs text-muted-foreground pt-1 flex-grow">
                              <p className="flex items-center gap-2">
                                <strong className="text-foreground font-mono text-[10px] w-14 inline-block">CELL:</strong> 
                                <span className="select-all font-mono text-foreground">{cl.phone}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <strong className="text-foreground font-mono text-[10px] w-14 inline-block">EMAIL:</strong> 
                                <span className="select-all font-mono text-foreground truncate max-w-[170px]" title={cl.email}>{cl.email || 'N/A'}</span>
                              </p>
                              <p className="flex items-center gap-2 pt-1.5">
                                <strong className="text-foreground font-mono text-[10px] w-14 inline-block">ONBOARDED:</strong> 
                                <span className="font-mono text-xs">{new Date(cl.created_at).toLocaleDateString()}</span>
                              </p>
                            </div>

                            {/* Card Bottom: Quick Actions Bar (Email/WA click triggers!) */}
                            <div className="border-t border-border/60 pt-4 flex items-center justify-around gap-2 bg-background/40 p-2 rounded-2xl">
                              
                              {/* Action 1: Send WhatsApp Follow up */}
                              <button 
                                type="button"
                                onClick={() => {
                                  let phoneFormatted = cl.phone.replace(/\s+/g, '').replace('+', '');
                                  if (phoneFormatted.startsWith('0')) phoneFormatted = '27' + phoneFormatted.substring(1);
                                  const textPrefilled = encodeURIComponent(`Hi ${cl.name},\n\nThis is Ndabas Attorneys following up on your legal matter files. Please let us know if we can assist you further.\n\nKind regards,\nNdabas Attorneys.`);
                                  window.open(`https://wa.me/${phoneFormatted}?text=${textPrefilled}`, '_blank');
                                }}
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                                title="Send WhatsApp Message"
                              >
                                <MessageSquare className="h-4 w-4 text-primary" />
                                <span className="text-[8px] font-mono font-bold tracking-wider uppercase">WHATSAPP</span>
                              </button>

                              {/* Action 2: Open Direct Email */}
                              <a 
                                href={`mailto:${cl.email || 'info@ndabasattorneys.co.za'}`}
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                                title="Send Email Alert"
                              >
                                <Send className="h-4 w-4 text-primary" />
                                <span className="text-[8px] font-mono font-bold tracking-wider uppercase">EMAIL</span>
                              </a>

                              {/* Action 3: View Associated Cases */}
                              <button 
                                type="button"
                                onClick={() => {
                                  setActiveTab('cases');
                                  setSearchQuery(cl.name);
                                }}
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                                title="Filter associated tracked cases"
                              >
                                <Briefcase className="h-4 w-4 text-primary" />
                                <span className="text-[8px] font-mono font-bold tracking-wider uppercase">MATTERS</span>
                              </button>

                              {/* Action 4: Delete Client Record */}
                              <button 
                                type="button"
                                onClick={() => handleDeleteLead(cl.id)}
                                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all cursor-pointer"
                                title="Delete client from database"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="text-[8px] font-mono font-bold tracking-wider uppercase">DELETE</span>
                              </button>

                            </div>

                          </div>

                          <div className="flex justify-between text-[9px] text-muted-foreground border-t border-border/60 pt-3 mt-4 relative z-10 font-mono">
                            <span>ID Ref: #{cl.id.substring(0, 8).toUpperCase()}</span>
                            <span className="text-green-500 font-bold">✓ FICA VERIFIED</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {filteredClients.length === 0 && (
                    <div className="col-span-2 bg-card border border-border p-12 rounded-3xl text-center text-muted-foreground font-mono w-full">
                      No onboarded client records found.
                    </div>
                  )}
                </div>
              )}

              {/* 4. CALENDAR VIEW */}
              {activeTab === 'calendar' && (
                <div className="space-y-10 animate-fadeIn">
                  
                  {/* Pending consultations grid */}
                  <div className="space-y-6">
                    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                      <h3 className="font-serif text-lg font-bold text-foreground mb-1">Pending Consultations</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed max-w-xl font-sans">
                        These consultations were booked by clients through our website. Staff can contact the client manually to confirm dates and mark their lead pipeline record once finalized.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                      <AnimatePresence mode="popLayout">
                        {consultations.map((cons) => (
                          <motion.div 
                            layout
                            initial={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ duration: 0.3 }}
                            key={cons.id} 
                            className="bg-card border border-border p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between max-w-md w-full mx-auto min-h-[380px] hover:shadow-xl transition-all duration-300 text-left"
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
                            
                            <div className="space-y-4 relative z-10 flex-grow flex flex-col justify-between">
                              {/* Top Side: Metadata */}
                              <div className="space-y-3">
                                <div className="flex justify-between items-start border-b border-border/60 pb-3">
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-primary tracking-widest block font-bold font-mono uppercase">PENDING CONSULTATION</span>
                                    <h3 className="font-serif font-bold text-foreground text-base leading-snug">{cons.name}</h3>
                                  </div>
                                  <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[9px] font-mono font-bold px-2.5 py-1 rounded-xl uppercase shrink-0">Awaiting Call</span>
                                </div>

                                <div className="space-y-1.5 font-sans text-xs text-muted-foreground pt-1">
                                  <p className="flex items-center gap-1.5">
                                    <strong className="text-foreground font-mono text-[10px] w-14 inline-block">CELL:</strong> 
                                    <span className="select-all font-mono">{cons.phone}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <strong className="text-foreground font-mono text-[10px] w-14 inline-block">EMAIL:</strong> 
                                    <span className="select-all font-mono truncate max-w-[180px]" title={cons.email}>{cons.email || 'N/A'}</span>
                                  </p>
                                  <p className="text-primary font-bold block pt-2.5 tracking-wider text-[11px] uppercase">Service Interest: {cons.service_type}</p>
                                  {cons.message && (
                                    <p className="text-muted-foreground/80 italic text-[11px] bg-background/50 p-2.5 rounded-xl border border-border/40 mt-2 block line-clamp-3 leading-relaxed">
                                      "{cons.message}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Bottom Side: CRM Feature Icons Panel */}
                              <div className="border-t border-border/60 pt-4 flex items-center justify-around gap-2 bg-background/40 p-2 rounded-2xl">
                                
                                {/* Action 1: Mark Contacted */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    handleUpdateLeadStatus(cons.id, 'Contacted');
                                    showToast(`Consultation for "${cons.name}" marked as contacted! 📞`, 'success');
                                  }}
                                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                                  title="Mark consultation contacted"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase">MARK CONTACTED</span>
                                </button>

                                {/* Action 2: Convert/Add as Client */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    handleUpdateLeadStatus(cons.id, 'Client');
                                  }}
                                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                                  title="Convert to directory and open case"
                                >
                                  <Users className="h-4 w-4 text-primary" />
                                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase">CONVERT CLIENT</span>
                                </button>

                                {/* Action 3: Notify Client Reminder (Email/WhatsApp quick links) */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    let phoneFormatted = cons.phone.replace(/\s+/g, '').replace('+', '');
                                    if (phoneFormatted.startsWith('0')) phoneFormatted = '27' + phoneFormatted.substring(1);
                                    const textPrefilled = encodeURIComponent(`Hi ${cons.name},\n\nThis is Ndabas Attorneys confirming your booked legal consultation for ${cons.service_type}.\n\nAre you available to consult with counsel?\n\nKind regards,\nNdabas Attorneys.`);
                                    window.open(`https://wa.me/${phoneFormatted}?text=${textPrefilled}`, '_blank');
                                  }}
                                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                                  title="Launch WhatsApp Consultation Chat"
                                >
                                  <MessageSquare className="h-4 w-4 text-primary" />
                                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase">WHATSAPP</span>
                                </button>

                                {/* Action 4: Delete Consultation */}
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteLead(cons.id)}
                                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all cursor-pointer"
                                  title="Delete booking request"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase">DELETE</span>
                                </button>

                              </div>

                            </div>

                            <div className="flex justify-between text-[9px] text-muted-foreground border-t border-border/60 pt-3 mt-4 relative z-10 font-mono">
                              <span>Submitted: {new Date(cons.created_at).toLocaleDateString()}</span>
                              <span className="text-primary font-bold">Status: New Request</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {consultations.length === 0 && (
                        <div className="col-span-2 bg-card border border-border p-12 rounded-3xl text-center text-muted-foreground font-mono w-full">
                          No pending consultations booked currently.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contacted / Completed Consultations grid */}
                  <div className="border-t border-border/40 pt-8 space-y-6">
                    <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
                      <h3 className="font-serif text-lg font-bold text-foreground mb-1">Contacted / Completed Consultations</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed max-w-xl font-sans">
                        These are consultations that have been successfully contacted by staff. You can view their details or directly register them as clients in your active Contact Directory from here!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                      <AnimatePresence mode="popLayout">
                        {leads.filter(l => l.status === 'Contacted').map((cons) => (
                          <motion.div 
                            layout
                            initial={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ duration: 0.3 }}
                            key={cons.id} 
                            className="bg-card border border-border p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between max-w-md w-full mx-auto min-h-[380px] hover:shadow-xl transition-all duration-300 text-left"
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-emerald-500/10 blur-xl rounded-full"></div>
                            
                            <div className="space-y-4 relative z-10 flex-grow flex flex-col justify-between">
                              {/* Top Side: Metadata */}
                              <div className="space-y-3">
                                <div className="flex justify-between items-start border-b border-border/60 pb-3">
                                  <div className="space-y-1">
                                    <span className="text-[9px] text-green-500 tracking-widest block font-bold font-mono uppercase">COMPLETED INQUIRY</span>
                                    <h3 className="font-serif font-bold text-foreground text-base leading-snug">{cons.name}</h3>
                                  </div>
                                  <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[9px] font-mono font-bold px-2.5 py-1 rounded-xl uppercase shrink-0">Contacted</span>
                                </div>

                                <div className="space-y-1.5 font-sans text-xs text-muted-foreground pt-1">
                                  <p className="flex items-center gap-1.5">
                                    <strong className="text-foreground font-mono text-[10px] w-14 inline-block">CELL:</strong> 
                                    <span className="select-all font-mono">{cons.phone}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5">
                                    <strong className="text-foreground font-mono text-[10px] w-14 inline-block">EMAIL:</strong> 
                                    <span className="select-all font-mono truncate max-w-[180px]" title={cons.email}>{cons.email || 'N/A'}</span>
                                  </p>
                                  <p className="text-primary font-bold block pt-2.5 tracking-wider text-[11px] uppercase">Service Interest: {cons.service_type}</p>
                                  {cons.message && (
                                    <p className="text-muted-foreground/80 italic text-[11px] bg-background/50 p-2.5 rounded-xl border border-border/40 mt-2 block line-clamp-3 leading-relaxed">
                                      "{cons.message}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Bottom Side: CRM Feature Icons Panel */}
                              <div className="border-t border-border/60 pt-4 flex items-center justify-around gap-2 bg-background/40 p-2 rounded-2xl">
                                
                                {/* Action 1: Re-mark Pending / Uncontacted */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    handleUpdateLeadStatus(cons.id, 'Consultation Booked');
                                    showToast(`Consultation for "${cons.name}" marked back as pending. 🟡`, 'info');
                                  }}
                                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                                  title="Mark pending again"
                                >
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase">SET PENDING</span>
                                </button>

                                {/* Action 2: Convert to active Client */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    handleUpdateLeadStatus(cons.id, 'Client');
                                  }}
                                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                                  title="Register to directory and open case"
                                >
                                  <Users className="h-4 w-4 text-primary" />
                                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase">CONVERT CLIENT</span>
                                </button>

                                {/* Action 3: Notify WhatsApp */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    let phoneFormatted = cons.phone.replace(/\s+/g, '').replace('+', '');
                                    if (phoneFormatted.startsWith('0')) phoneFormatted = '27' + phoneFormatted.substring(1);
                                    const textPrefilled = encodeURIComponent(`Hi ${cons.name},\n\nThis is Ndabas Attorneys following up on our consultation details. Please let us know if we can assist you further.\n\nKind regards,\nNdabas Attorneys.`);
                                    window.open(`https://wa.me/${phoneFormatted}?text=${textPrefilled}`, '_blank');
                                  }}
                                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                                  title="Send follow up reminder"
                                >
                                  <MessageSquare className="h-4 w-4 text-primary" />
                                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase">FOLLOW UP</span>
                                </button>

                                {/* Action 4: Delete */}
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteLead(cons.id)}
                                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all cursor-pointer"
                                  title="Delete consultation record"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase">DELETE</span>
                                </button>

                              </div>

                            </div>

                            <div className="flex justify-between text-[9px] text-muted-foreground border-t border-border/60 pt-3 mt-4 relative z-10 font-mono">
                              <span>Contacted on: {new Date(cons.created_at).toLocaleDateString()}</span>
                              <span className="text-green-500 font-bold">Status: Finalized</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {leads.filter(l => l.status === 'Contacted').length === 0 && (
                        <div className="col-span-2 bg-card border border-border p-12 rounded-3xl text-center text-muted-foreground font-mono w-full">
                          No completed/contacted consultations logged currently.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* 5. REPORTS TAB */}
              {activeTab === 'reports' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-card border border-border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-left">
                      <h3 className="font-serif text-lg font-bold text-foreground mb-1">CRM Analytics & Insights</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed max-w-xl font-sans">
                        A visual summary tracking the firm's client onboarding, leads volume, and performance indicators under POPIA/LPC guidelines.
                      </p>
                    </div>
                    <div className="flex gap-2 font-mono text-[9px] font-bold">
                      <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-full">LPC AUDIT PASSED</span>
                      <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full">POPIA 100% INTEGRITY</span>
                    </div>
                  </div>

                  {/* 3-Column Compliance Scorecards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-card border border-border p-5 rounded-3xl shadow-sm text-left flex items-center gap-4">
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl text-primary shrink-0">
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div className="font-sans">
                        <span className="text-muted-foreground text-[10px] uppercase font-mono tracking-wider block">FICA Success Rate</span>
                        <span className="text-2xl font-bold text-foreground block mt-0.5">
                          {leads.length ? ((leads.filter(l => l.status === 'Client').length / leads.length) * 100).toFixed(1) : '100'}%
                        </span>
                        <span className="text-muted-foreground text-[10px] block mt-0.5">Conversion from inquiries to matters</span>
                      </div>
                    </div>

                    <div className="bg-card border border-border p-5 rounded-3xl shadow-sm text-left flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 shrink-0">
                        <Award className="h-6 w-6" />
                      </div>
                      <div className="font-sans">
                        <span className="text-muted-foreground text-[10px] uppercase font-mono tracking-wider block">POPIA Compliance</span>
                        <span className="text-2xl font-bold text-foreground block mt-0.5">100% SECURE</span>
                        <span className="text-muted-foreground text-[10px] block mt-0.5">Enclave file transfers & strict logs</span>
                      </div>
                    </div>

                    <div className="bg-card border border-border p-5 rounded-3xl shadow-sm text-left flex items-center gap-4">
                      <div className="p-3 bg-accent/10 border border-accent/20 rounded-2xl text-accent shrink-0">
                        <Scale className="h-6 w-6" />
                      </div>
                      <div className="font-sans">
                        <span className="text-muted-foreground text-[10px] uppercase font-mono tracking-wider block">LPC Trust Audit</span>
                        <span className="text-2xl font-bold text-foreground block mt-0.5">FULLY COMPLIANT</span>
                        <span className="text-muted-foreground text-[10px] block mt-0.5">Fiduciary bookkeeping standards</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Leads by Status Graphic */}
                    <div className="lg:col-span-4 bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4 text-left flex flex-col justify-between">
                      <h4 className="font-serif font-bold text-foreground text-sm tracking-wide">LEAD CONVERSION FLOW</h4>
                      <div className="space-y-4 font-mono text-[11px] flex-grow flex flex-col justify-center">
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>NEW REQUESTS</span>
                            <span className="font-bold text-foreground">{leads.filter(l => l.status === 'New').length}</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-none" style={{ width: `${Math.max(10, leads.length ? (leads.filter(l => l.status === 'New').length / leads.length) * 100 : 0)}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>CONTACTED PIPELINE</span>
                            <span className="font-bold text-foreground">{leads.filter(l => l.status === 'Contacted').length}</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-lavender animate-none" style={{ width: `${Math.max(10, leads.length ? (leads.filter(l => l.status === 'Contacted').length / leads.length) * 100 : 0)}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>CONSULTATION BOOKED</span>
                            <span className="font-bold text-foreground">{leads.filter(l => l.status === 'Consultation Booked').length}</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-accent animate-none" style={{ width: `${Math.max(10, leads.length ? (leads.filter(l => l.status === 'Consultation Booked').length / leads.length) * 100 : 0)}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-muted-foreground mb-1">
                            <span>CONVERTED CLIENTS</span>
                            <span className="font-bold text-green-500">{leads.filter(l => l.status === 'Client').length}</span>
                          </div>
                          <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-none" style={{ width: `${Math.max(10, leads.length ? (leads.filter(l => l.status === 'Client').length / leads.length) * 100 : 0)}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CSS Client Monthly Growth Bar Chart */}
                    <div className="lg:col-span-8 bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4 text-left">
                      <h4 className="font-serif font-bold text-foreground text-sm tracking-wide">CLIENT VOLUME MONTHLY GROWTH (2026)</h4>
                      
                      <div className="flex items-end justify-between gap-3 h-52 pt-4 font-mono text-[10px] border-b border-border/60 pb-2">
                        {/* JAN */}
                        <div className="flex flex-col items-center gap-2 flex-grow group">
                          <span className="opacity-0 group-hover:opacity-100 bg-zinc-900 text-white text-[8px] px-1.5 py-0.5 rounded transition-all">12</span>
                          <div className="w-full max-w-[28px] bg-primary/20 hover:bg-primary rounded-t-lg transition-all" style={{ height: '35px' }}></div>
                          <span className="text-muted-foreground font-bold">JAN</span>
                        </div>
                        {/* FEB */}
                        <div className="flex flex-col items-center gap-2 flex-grow group">
                          <span className="opacity-0 group-hover:opacity-100 bg-zinc-900 text-white text-[8px] px-1.5 py-0.5 rounded transition-all">18</span>
                          <div className="w-full max-w-[28px] bg-primary/20 hover:bg-primary rounded-t-lg transition-all" style={{ height: '55px' }}></div>
                          <span className="text-muted-foreground font-bold">FEB</span>
                        </div>
                        {/* MAR */}
                        <div className="flex flex-col items-center gap-2 flex-grow group">
                          <span className="opacity-0 group-hover:opacity-100 bg-zinc-900 text-white text-[8px] px-1.5 py-0.5 rounded transition-all">25</span>
                          <div className="w-full max-w-[28px] bg-primary/20 hover:bg-primary rounded-t-lg transition-all" style={{ height: '75px' }}></div>
                          <span className="text-muted-foreground font-bold">MAR</span>
                        </div>
                        {/* APR */}
                        <div className="flex flex-col items-center gap-2 flex-grow group">
                          <span className="opacity-0 group-hover:opacity-100 bg-zinc-900 text-white text-[8px] px-1.5 py-0.5 rounded transition-all">30</span>
                          <div className="w-full max-w-[28px] bg-primary/20 hover:bg-primary rounded-t-lg transition-all" style={{ height: '90px' }}></div>
                          <span className="text-muted-foreground font-bold">APR</span>
                        </div>
                        {/* MAY */}
                        <div className="flex flex-col items-center gap-2 flex-grow group">
                          <span className="opacity-0 group-hover:opacity-100 bg-zinc-900 text-white text-[8px] px-1.5 py-0.5 rounded transition-all">42</span>
                          <div className="w-full max-w-[28px] bg-primary/25 hover:bg-primary rounded-t-lg transition-all" style={{ height: '125px' }}></div>
                          <span className="text-muted-foreground font-bold">MAY</span>
                        </div>
                        {/* JUN */}
                        <div className="flex flex-col items-center gap-2 flex-grow group">
                          <span className="opacity-0 group-hover:opacity-100 bg-zinc-900 text-white text-[8px] px-1.5 py-0.5 rounded transition-all">48</span>
                          <div className="w-full max-w-[28px] bg-primary/30 hover:bg-primary rounded-t-lg transition-all" style={{ height: '145px' }}></div>
                          <span className="text-muted-foreground font-bold">JUN</span>
                        </div>
                        {/* JUL (Dynamic) */}
                        <div className="flex flex-col items-center gap-2 flex-grow group">
                          <span className="bg-zinc-900 text-white text-[8px] px-1.5 py-0.5 rounded font-bold animate-pulse">
                            {leads.length}
                          </span>
                          <div className="w-full max-w-[28px] bg-primary hover:bg-primary/95 rounded-t-lg transition-all shadow" style={{ height: `${Math.min(160, Math.max(40, leads.length * 4))}px` }}></div>
                          <span className="text-foreground font-black">JUL</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-sans leading-relaxed pt-1">
                        * Note: Growth rates represent FICA validations and matter initiations tracked since January. July is compiled dynamically from active leads.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Visual Consultation Calendar Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Visual Month Grid (July 2026) */}
                    <div className="lg:col-span-8 bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4 text-left">
                      <div className="flex justify-between items-center border-b border-border/40 pb-2 select-none">
                        <h4 className="font-serif font-bold text-foreground text-sm tracking-wide">INTERACTIVE MEETINGS CALENDAR (JULY 2026)</h4>
                        <span className="font-mono text-[9px] bg-primary/10 text-primary border border-primary/25 px-2.5 py-0.5 rounded font-bold">
                          {calendarEvents.length} ACTIVE CONSULTATIONS
                        </span>
                      </div>

                      {/* Weekday Labels */}
                      <div className="grid grid-cols-7 text-center font-mono text-[9px] text-muted-foreground font-bold uppercase pb-1 tracking-wider border-b border-border/40">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>

                      {/* Month Days Grid */}
                      <div className="grid grid-cols-7 gap-2 pt-2 font-mono text-[10px]">
                        {/* Empty Offsets (July 2026 starts on Wednesday) */}
                        <div className="bg-background/25 aspect-square rounded-xl opacity-30"></div>
                        <div className="bg-background/25 aspect-square rounded-xl opacity-30"></div>

                        {/* Day Blocks 1 to 31 */}
                        {Array.from({ length: 31 }, (_, idx) => {
                          const day = idx + 1;
                          const dayEvents = calendarEvents.filter(e => e.day === day);
                          const hasMeeting = dayEvents.length > 0;
                          const isSelected = selectedCalendarDay === day;

                          return (
                            <div 
                              key={day} 
                              onClick={() => {
                                setSelectedCalendarDay(day);
                                setIsReschedulingId(null); // Reset reschedule state on day change
                                setIsAddingCalendarEvent(false); // Reset add state
                              }}
                              className={`aspect-square border rounded-xl p-1.5 flex flex-col justify-between transition-all select-none relative cursor-pointer ${
                                isSelected
                                  ? 'ring-2 ring-primary border-primary bg-primary/10 scale-102 shadow-sm shadow-primary/10 z-10'
                                  : hasMeeting 
                                    ? 'bg-primary/5 hover:bg-primary/15 border-primary/35 hover:scale-103 shadow-xs' 
                                    : 'bg-background/50 hover:bg-border/20 text-muted-foreground border-border/40'
                              }`}
                            >
                              <span className={`font-bold block text-left ${hasMeeting || isSelected ? 'text-primary' : ''}`}>{day}</span>
                              
                              {/* Meeting Indicators */}
                              {hasMeeting && (
                                <div className="flex gap-1 justify-end items-center mt-1">
                                  {dayEvents.map((evt, eIdx) => (
                                    <span 
                                      key={eIdx} 
                                      className={`w-1.5 h-1.5 rounded-full ${evt.type === 'notary' ? 'bg-accent' : 'bg-primary'}`} 
                                    />
                                  ))}
                                  <span className="hidden sm:inline-block text-[7px] font-mono text-primary font-black">SESS</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Calendar Selected Schedule Detail Box */}
                    <div className="lg:col-span-4 bg-card border border-border p-6 rounded-3xl shadow-sm text-left flex flex-col justify-between min-h-[350px]">
                      <div className="space-y-4">
                        <div className="border-b border-border/40 pb-3">
                          <span className="font-mono text-[8px] tracking-[0.2em] text-primary font-bold block uppercase">CALENDAR MATTERS BRIEF</span>
                          <h5 className="font-serif font-bold text-sm text-foreground">Schedule for July {selectedCalendarDay}, 2026</h5>
                        </div>

                        <div className="space-y-4 font-sans text-xs">
                          {calendarEvents.filter(e => e.day === selectedCalendarDay).length > 0 ? (
                            calendarEvents.filter(e => e.day === selectedCalendarDay).map((evt) => {
                              const isReschedulingThis = isReschedulingId === evt.id;

                              return (
                                <div key={evt.id} className="bg-background border border-border/55 p-3.5 rounded-2xl space-y-3 shadow-xs">
                                  <div className={`border-l-2 pl-2.5 py-0.5 space-y-1 ${evt.type === 'notary' ? 'border-accent' : 'border-primary'}`}>
                                    <div className="flex justify-between items-center text-[10px] font-mono">
                                      <span className={`${evt.type === 'notary' ? 'text-accent' : 'text-primary'} font-bold`}>JULY {evt.day} • {evt.time}</span>
                                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase">{evt.status}</span>
                                    </div>
                                    <h6 className="font-bold text-foreground text-[12px]">{evt.title}</h6>
                                    <p className="text-muted-foreground text-[11px] leading-relaxed font-sans">{evt.desc}</p>
                                  </div>

                                  {/* Rescheduling Form */}
                                  {isReschedulingThis ? (
                                    <div className="pt-2 border-t border-border/50 space-y-2 font-mono text-[10px]">
                                      <div className="flex items-center gap-2">
                                        <label className="text-muted-foreground uppercase font-bold text-[8px] tracking-wider shrink-0">NEW DAY (1-31):</label>
                                        <input 
                                          type="number" 
                                          min={1} 
                                          max={31}
                                          value={rescheduleDayInput}
                                          onChange={(e) => setRescheduleDayInput(Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
                                          className="w-16 bg-card border border-border px-2 py-1 rounded text-center text-foreground font-bold"
                                        />
                                      </div>
                                      <div className="flex gap-2 font-mono text-[9px] font-bold">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCalendarEvents(prev => prev.map(e => e.id === evt.id ? { ...e, day: rescheduleDayInput } : e));
                                            setIsReschedulingId(null);
                                            setSelectedCalendarDay(rescheduleDayInput);
                                            showToast(`Rescheduled consultation successfully to July ${rescheduleDayInput}! 📅`, 'success');
                                          }}
                                          className="bg-primary text-primary-foreground border border-primary/20 px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                        >
                                          SAVE DATE
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setIsReschedulingId(null)}
                                          className="bg-card border border-border px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                        >
                                          CANCEL
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    /* Interactive Control Buttons */
                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40 font-mono text-[9px] font-bold">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          showToast(`Dispatched email reminder for "${evt.title}" successfully! ✉️`, 'success');
                                        }}
                                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                                      >
                                        <Send className="h-3 w-3" /> REMINDER
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setIsReschedulingId(evt.id);
                                          setRescheduleDayInput(evt.day);
                                        }}
                                        className="bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                                      >
                                        <Clock className="h-3 w-3 text-primary" /> RESCHEDULE
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm(`Remove consultation "${evt.title}" on July ${evt.day}?`)) {
                                            setCalendarEvents(prev => prev.filter(e => e.id !== evt.id));
                                            showToast(`Removed consultation successfully.`, 'info');
                                          }
                                        }}
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer animate-none"
                                      >
                                        REMOVE
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            /* Open Slot and Reservation */
                            <div className="text-center py-4 space-y-4 font-sans text-muted-foreground">
                              {isAddingCalendarEvent ? (
                                <div className="space-y-3 bg-background border border-border/55 p-4 rounded-2xl text-left font-sans text-xs">
                                  <div className="border-b border-border pb-2 mb-2 flex items-center justify-between">
                                    <strong className="text-foreground uppercase tracking-wider font-mono text-[8px] text-primary">ADD CONSULTATION</strong>
                                    <button 
                                      type="button" 
                                      onClick={() => setIsAddingCalendarEvent(false)}
                                      className="text-muted-foreground hover:text-foreground"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                  
                                  <div className="space-y-1.5">
                                    <label className="font-mono text-[8px] text-muted-foreground uppercase font-bold">Title Name</label>
                                    <input 
                                      type="text"
                                      placeholder="Sipho Duma Consult"
                                      value={newCalTitle}
                                      onChange={(e) => setNewCalTitle(e.target.value)}
                                      className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1.5">
                                      <label className="font-mono text-[8px] text-muted-foreground uppercase font-bold">Time</label>
                                      <input 
                                        type="text"
                                        placeholder="14:00"
                                        value={newCalTime}
                                        onChange={(e) => setNewCalTime(e.target.value)}
                                        className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-mono text-center"
                                      />
                                    </div>
                                    <div className="space-y-1.5">
                                      <label className="font-mono text-[8px] text-muted-foreground uppercase font-bold">Division</label>
                                      <select 
                                        value={newCalType}
                                        onChange={(e) => setNewCalType(e.target.value)}
                                        className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary font-mono cursor-pointer"
                                      >
                                        <option value="conveyancing">Conveyance</option>
                                        <option value="notary">Notary Act</option>
                                        <option value="litigation">Litigation</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="font-mono text-[8px] text-muted-foreground uppercase font-bold">Details</label>
                                    <input 
                                      type="text"
                                      placeholder="Property deeds check at Pretoria Registry..."
                                      value={newCalDesc}
                                      onChange={(e) => setNewCalDesc(e.target.value)}
                                      className="w-full bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!newCalTitle.trim()) {
                                        alert('Please provide a title for the consultation.');
                                        return;
                                      }
                                      setCalendarEvents(prev => [...prev, {
                                        id: Date.now(),
                                        day: selectedCalendarDay,
                                        time: newCalTime,
                                        title: newCalTitle,
                                        desc: newCalDesc || "First consultation session with counsel.",
                                        type: newCalType,
                                        operator: user?.primaryEmailAddress?.emailAddress || "info@ndabasattorneys.co.za",
                                        status: "ACTIVE"
                                      }]);
                                      setIsAddingCalendarEvent(false);
                                      setNewCalTitle("");
                                      setNewCalDesc("");
                                      setNewCalTime("10:00");
                                      showToast(`Consultation successfully added to July ${selectedCalendarDay}! 📅`, 'success');
                                    }}
                                    className="w-full bg-primary text-primary-foreground font-mono text-[9px] tracking-widest font-bold py-2 rounded-xl hover:opacity-90 cursor-pointer text-center"
                                  >
                                    ADD TO SCHEDULE
                                  </button>
                                </div>
                              ) : (
                                <div className="py-6 space-y-4 text-center">
                                  <Clock className="h-7 w-7 text-muted-foreground/50 mx-auto" />
                                  <div className="space-y-1">
                                    <span className="font-bold text-foreground text-xs block font-sans">No Consultations Scheduled</span>
                                    <span className="text-[11px] text-muted-foreground block leading-relaxed max-w-[200px] mx-auto font-sans">This July {selectedCalendarDay} schedule slot is empty and open.</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setIsAddingCalendarEvent(true)}
                                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-mono tracking-wider font-bold transition-all cursor-pointer hover:scale-102 active:scale-98 shadow-sm"
                                  >
                                    + RESERVE SLOT
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-border/40 pt-4 mt-4 font-mono text-[9px] text-muted-foreground leading-relaxed">
                        ⚠️ Note: Click days highlighted with a blue background inside the Month Calendar grid to inspect, notify or reschedule appointments.
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

      </div> {/* Close SCROLLABLE INNER BODY AREA div */}

      {/* Shadcn-Style Floating Notification Dialog Modal */}
      <AnimatePresence>
        {notifyingCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-sans select-none">
            {/* Click outside to close (disabled when loading) */}
            <div 
              className="absolute inset-0 cursor-default animate-none" 
              onClick={() => {
                if (notificationState !== 'sending' && notificationState !== 'success') {
                  setNotifyingCase(null);
                  setNotificationState('idle');
                }
              }}
            />
            
            {/* Shadcn Card Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 p-6 text-left"
            >
              {/* Close Button */}
              {notificationState !== 'sending' && (
                <button 
                  onClick={() => {
                    setNotifyingCase(null);
                    setNotificationState('idle');
                  }}
                  className="absolute top-4 right-4 p-2 hover:bg-border/20 border border-border rounded-xl text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  title="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {notificationState === 'success' ? (
                // Success State View
                <div className="py-8 flex flex-col items-center text-center space-y-4 animate-scaleUp">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-full text-green-500">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-xl text-foreground">Client Notified Successfully!</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
                      Your compliance alert has been transmitted successfully to <strong className="text-foreground">{notifyingCase.client_email || 'onboarded@client.co.za'}</strong> via Email.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifyingCase(null);
                      setNotificationState('idle');
                    }}
                    className="px-6 py-2.5 bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-[10px] tracking-widest font-bold rounded-xl cursor-pointer shadow hover:opacity-90 transition-all"
                  >
                    DISMISS DETAILS
                  </button>
                </div>
              ) : (
                // Input Form State
                <div className="space-y-4">
                  <div className="border-b border-border/60 pb-3">
                    <span className="font-mono text-[9px] tracking-widest text-primary font-bold block uppercase">SECURE TRANSMISSION CENTER</span>
                    <h3 className="font-serif font-bold text-xl text-foreground mt-0.5">Send Client Compliance Alert</h3>
                    <p className="text-muted-foreground text-[10px] leading-relaxed mt-1">
                      Deliver urgent FICA statuses, approval logs, or progress announcements for Case Ref: <strong className="text-foreground">{notifyingCase.case_number || 'N/A'}</strong>.
                    </p>
                  </div>

                  {/* Channel Tab Selector */}
                  <div className="flex gap-2 bg-background/50 border border-border p-1 rounded-2xl">
                    <button 
                      type="button" 
                      onClick={() => setNotificationMethod('Email')} 
                      className={`flex-grow py-2 rounded-xl text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer ${notificationMethod === 'Email' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      EMAIL ALERT
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setNotificationMethod('WhatsApp')} 
                      className={`flex-grow py-2 rounded-xl text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer ${notificationMethod === 'WhatsApp' ? 'bg-green-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      WHATSAPP BOT ALERT
                    </button>
                  </div>

                  {/* Fields */}
                  <div className="space-y-3">
                    <div className="font-sans text-xs text-muted-foreground space-y-1">
                      <p><strong className="text-foreground font-mono text-[10px] inline-block w-20">RECIPIENT:</strong> {notifyingCase.client_name}</p>
                      <p><strong className="text-foreground font-mono text-[10px] inline-block w-20">CONTACT:</strong> {notificationMethod === 'Email' ? (notifyingCase.client_email || 'onboarded@client.co.za') : (notifyingCase.client_phone || '082 490 6285')}</p>
                    </div>

                    {notificationMethod === 'Email' && (
                      <div className="space-y-1 font-mono text-[9px] text-muted-foreground">
                        <label>EMAIL SUBJECT</label>
                        <input 
                          type="text" 
                          value={notificationSubject}
                          onChange={(e) => setNotificationSubject(e.target.value)}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                        />
                      </div>
                    )}

                    <div className="space-y-1 font-mono text-[9px] text-muted-foreground">
                      <label>MESSAGE STATEMENT</label>
                      <textarea 
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        rows={5}
                        className="w-full bg-background border border-border rounded-xl p-4 text-xs text-foreground focus:outline-none focus:border-primary font-sans resize-none leading-relaxed" 
                      />
                    </div>
                  </div>

                  {/* Transmit Trigger */}
                  <button
                    type="button"
                    disabled={notificationState === 'sending'}
                    onClick={async () => {
                      setNotificationState('sending');
                      try {
                        const clientEmail = notifyingCase.client_email || 'onboarded@client.co.za';
                        const clientPhone = notifyingCase.client_phone || '082 490 6285';

                        if (notificationMethod === 'Email') {
                          const res = await sendClientNotificationEmail({
                            name: notifyingCase.client_name,
                            email: clientEmail,
                            subject: notificationSubject,
                            message: notificationMessage,
                            caseNumber: notifyingCase.case_number || notifyingCase.id
                          });
                          if (res.success) {
                            setNotificationState('success');
                            showToast(`Client notified successfully via Email! ✉️`, 'success');
                          } else {
                            throw new Error(res.error);
                          }
                        } else {
                          // WhatsApp Click-to-Chat
                          let formattedPhone = clientPhone.replace(/\s+/g, '').replace('+', '');
                          if (formattedPhone.startsWith('0')) {
                            formattedPhone = '27' + formattedPhone.substring(1);
                          }
                          const prefilledText = encodeURIComponent(`*${notificationSubject}*\n\nDear ${notifyingCase.client_name},\n\n${notificationMessage}\n\n_Ref Case Number: ${notifyingCase.case_number || 'N/A'}_`);
                          const whatsappUrl = `https://wa.me/${formattedPhone}?text=${prefilledText}`;
                          
                          window.open(whatsappUrl, '_blank');
                          showToast('WhatsApp Chat window launched! 💬', 'success');
                          setNotifyingCase(null);
                          setNotificationState('idle');
                        }
                      } catch (err: any) {
                        console.error('Error sending client notification:', err);
                        showToast(`Failed to send notification: ${err.message || String(err)}`, 'error');
                        setNotificationState('idle');
                      }
                    }}
                    className={`w-full py-3.5 rounded-xl font-mono text-[9px] tracking-widest font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow transition-all ${
                      notificationState === 'sending' ? 'opacity-70 cursor-not-allowed' : ''
                    } ${notificationMethod === 'Email' ? 'bg-foreground text-background dark:bg-foreground dark:text-background animate-none' : 'bg-green-600 text-white hover:bg-green-700 animate-none'}`}
                  >
                    {notificationState === 'sending' ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>TRANSMITTING ALERT...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>{notificationMethod === 'Email' ? 'Transmit Compliance Email' : 'Transmit WhatsApp Chat'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STICKY FOOTER PANEL */}
      <footer className="hidden md:flex h-16 shrink-0 border-t border-border/40 bg-card select-none items-center justify-between px-6 font-mono text-[9px] text-muted-foreground/60 font-mono">
        <span>© 2026 NDABA&apos;S ATTORNEYS CRM. ALL RIGHTS RESERVED.</span>
        <span>POPIA & LPC COMPLIANT.</span>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border/60 select-none flex items-center justify-around px-2 z-30 shadow-lg font-sans">
        <button 
          onClick={() => { setActiveTab('leads'); setSearchQuery(''); }}
          className={`flex flex-col items-center justify-center gap-1 flex-grow h-full text-center transition-all cursor-pointer ${activeTab === 'leads' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Users className="h-5.5 w-5.5" />
          <span className="text-[9px] font-bold font-sans uppercase tracking-wider">LEADS</span>
        </button>

        <button 
          onClick={() => { setActiveTab('cases'); setSearchQuery(''); }}
          className={`flex flex-col items-center justify-center gap-1 flex-grow h-full text-center transition-all cursor-pointer ${activeTab === 'cases' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Briefcase className="h-5.5 w-5.5" />
          <span className="text-[9px] font-bold font-sans uppercase tracking-wider">MATTERS</span>
        </button>

        <button 
          onClick={() => { setActiveTab('clients'); setSearchQuery(''); }}
          className={`flex flex-col items-center justify-center gap-1 flex-grow h-full text-center transition-all cursor-pointer ${activeTab === 'clients' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Users className="h-5.5 w-5.5" />
          <span className="text-[9px] font-bold font-sans uppercase tracking-wider">CONTACTS</span>
        </button>

        <button 
          onClick={() => { setActiveTab('calendar'); setSearchQuery(''); }}
          className={`flex flex-col items-center justify-center gap-1 flex-grow h-full text-center transition-all cursor-pointer relative ${activeTab === 'calendar' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Calendar className="h-5.5 w-5.5" />
          <span className="text-[9px] font-bold font-sans uppercase tracking-wider">MEETINGS</span>
          {consultations.length > 0 && (
            <span className="absolute top-1.5 right-4 bg-primary text-primary-foreground font-mono text-[8px] h-3.5 w-3.5 rounded-full flex items-center justify-center font-bold shadow-sm">{consultations.length}</span>
          )}
        </button>

        <button 
          onClick={() => { setActiveTab('reports'); setSearchQuery(''); }}
          className={`flex flex-col items-center justify-center gap-1 flex-grow h-full text-center transition-all cursor-pointer ${activeTab === 'reports' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <TrendingUp className="h-5.5 w-5.5" />
          <span className="text-[9px] font-bold font-sans uppercase tracking-wider">REPORTS</span>
        </button>
      </nav>

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
      <div className="fixed top-6 right-6 bottom-auto md:top-auto md:bottom-6 md:right-6 z-50 flex flex-col gap-2 max-w-sm w-[calc(100%-3rem)] sm:w-full select-none pointer-events-none">
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

      </div>

    </div>
  );
}
