'use client';

import React, { useState, useEffect, useRef } from 'react';
import Footer from '@/components/Footer';
import { db, Case } from '@/lib/db';
import { 
  Scale, 
  Search, 
  Lock, 
  Send, 
  Smartphone, 
  Paperclip,
  ArrowRight,
  Sun,
  Moon,
  File,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Track() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Tab control: 'portal' or 'whatsapp'
  const [activeTab, setActiveTab] = useState<'portal' | 'whatsapp'>('portal');

  // Theme support
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
  // TAB 1: WEB TRACKING PORTAL STATES & LOGIC
  // -------------------------------------------------------------
  const [portalCaseNumber, setPortalCaseNumber] = useState('');
  const [portalAccessKey, setPortalAccessKey] = useState('');
  const [portalCase, setPortalCase] = useState<Case | null>(null);
  const [portalError, setPortalAccessError] = useState<string | null>(null);
  const [portalLoading, setPortalIsLoading] = useState(false);
  const [portalUploading, setPortalUploading] = useState(false);
  const [showAccessKey, setShowAccessKey] = useState(false);

  const portalUploaderRef = useRef<HTMLInputElement>(null);

  const handlePortalTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalCaseNumber || !portalAccessKey) return;
    setPortalIsLoading(true);
    setPortalAccessError(null);
    try {
      const retrievedCase = await db.getCaseByNumberAndKey(portalCaseNumber, portalAccessKey);
      if (retrievedCase) {
        setPortalCase(retrievedCase);
        showToast(`🔒 Case Matter "${retrievedCase.case_title}" successfully loaded!`, 'success');
        
        // Log Viewed under POPIA compliance!
        try {
          await db.insertPopiaLog({
            case_id: retrievedCase.id,
            case_title: retrievedCase.client_name,
            document_name: 'Client Tracking Login',
            action: 'Viewed',
            user_email: `Client: ${retrievedCase.client_name}`
          });
        } catch (logErr) {
          console.error('Failed to write POPIA viewed log for client tracker:', logErr);
        }
      } else {
        setPortalAccessError('No case matches those credentials. Check details and retry.');
        showToast('❌ Access Denied: Invalid credentials.', 'error');
        setPortalCase(null);
      }
    } catch (err: any) {
      console.error(err);
      setPortalAccessError('Database connection error. Please try again.');
      showToast('❌ Database connection disruption.', 'error');
    } finally {
      setPortalIsLoading(false);
    }
  };

  const handlePortalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !portalCase) return;
    const file = e.target.files[0];
    
    setPortalUploading(true);
    showToast(`⏳ Uploading "${file.name}" to secure cloud storage...`, 'info');

    try {
      const uploadedUrl = await db.uploadFile(file);
      if (!uploadedUrl) throw new Error('File upload failed.');

      const newDoc = {
        name: file.name,
        url: uploadedUrl,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        status: 'Pending' as const,
        uploaded_at: new Date().toISOString()
      };

      const updatedDocs = [...(portalCase.documents || []), newDoc];
      await db.updateCase(portalCase.id, { documents: updatedDocs });

      // Log POPIA
      await db.insertPopiaLog({
        case_id: portalCase.id,
        case_title: portalCase.client_name,
        document_name: file.name,
        action: 'Uploaded',
        user_email: `Client Portal: ${portalCase.client_name}`
      });

      // Refresh local case data
      const freshCase = await db.getCaseByNumberAndKey(portalCase.case_number!, portalCase.access_key!);
      if (freshCase) {
        setPortalCase(freshCase);
      }
      
      showToast(`✅ Certified FICA File "${file.name}" uploaded successfully! Pending review.`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`❌ Upload failed: ${err?.message || String(err)}`, 'error');
    } finally {
      setPortalUploading(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 2: WHATSAPP BOT SIMULATOR STATES & LOGIC
  // -------------------------------------------------------------
  interface Message {
    sender: 'bot' | 'client';
    text: string;
    timestamp: string;
    isAttachment?: boolean;
    fileName?: string;
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "⚖️ *Ndabas Attorneys - Virtual Assistant*\n\nWelcome to Ndabas Attorneys. I am your automated digital legal assistant. How can I help you today?\n\nReply with *1* to *Onboard as a New Client*\nReply with *2* to *Access an Existing Case (Check Status & Upload Docs)*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [botStep, setBotStep] = useState<
    'welcome' | 'case_number' | 'access_key' | 'menu' | 'uploading' | 
    'onboard_name' | 'onboard_email' | 'onboard_phone' | 'onboard_id' | 'onboard_address' | 
    'onboard_matter_type' | 'onboard_matter_desc' | 'onboard_upload'
  >('welcome');
  
  // Temp auth and onboarding holders during chat
  const [tempCaseNumber, setTempCaseNumber] = useState('');
  const [authenticatedCase, setAuthenticatedCase] = useState<Case | null>(null);
  const [onboardData, setOnboardData] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    address: '',
    matterType: '',
    matterDescription: ''
  });
  const [botUploadedFiles, setBotUploadedFiles] = useState<{ name: string; size: string; url: string }[]>([]);

  // Hidden uploader inside simulated chat
  const botUploaderRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string, isFile = false, fileName?: string) => {
    const rawText = textToSend !== undefined ? textToSend : inputText;
    if (!rawText.trim() && !isFile) return;

    if (!isFile) {
      setInputText('');
    }

    // Add client reply to bubble list
    setMessages(prev => [
      ...prev,
      {
        sender: 'client',
        text: isFile ? `Uploaded File: ${fileName}` : rawText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAttachment: isFile,
        fileName: fileName
      }
    ]);

    // Bot processing response sequentially
    setTimeout(async () => {
      const trimmedText = rawText.trim();
      
      if (botStep === 'welcome') {
        if (trimmedText === '1') {
          setBotStep('onboard_name');
          addBotMessage(`📝 *New Client Onboarding*\n\nGreat choice! Let's get your matter registered on our system. Please reply with your *Full Name*:`);
        } else if (trimmedText === '2') {
          setBotStep('case_number');
          addBotMessage(`⚖️ *Existing Case Tracker*\n\nTo begin, please reply with your *Case Number* (e.g., NDB-2026-1001).`);
        } else {
          addBotMessage(`⚠️ *Invalid Choice.*\n\nPlease reply with *1* to Onboard as a New Client, or *2* to Access an Existing Case.`);
        }
      }
      else if (botStep === 'onboard_name') {
        setOnboardData(prev => ({ ...prev, name: trimmedText }));
        setBotStep('onboard_email');
        addBotMessage(`Thank you, *${trimmedText}*.\n\nPlease reply with your *Email Address* (or type "none" to skip):`);
      }
      else if (botStep === 'onboard_email') {
        const email = trimmedText.toLowerCase() === 'none' ? 'onboarded@client.co.za' : trimmedText;
        setOnboardData(prev => ({ ...prev, email }));
        setBotStep('onboard_phone');
        addBotMessage(`Understood.\n\nPlease reply with your *Phone/Mobile Number*:`);
      }
      else if (botStep === 'onboard_phone') {
        setOnboardData(prev => ({ ...prev, phone: trimmedText }));
        setBotStep('onboard_id');
        addBotMessage(`Got it.\n\nPlease reply with your South African *ID or Passport Number*:`);
      }
      else if (botStep === 'onboard_id') {
        setOnboardData(prev => ({ ...prev, idNumber: trimmedText }));
        setBotStep('onboard_address');
        addBotMessage(`Thank you.\n\nPlease reply with your *Physical Residential Address*:`);
      }
      else if (botStep === 'onboard_address') {
        setOnboardData(prev => ({ ...prev, address: trimmedText }));
        setBotStep('onboard_matter_type');
        addBotMessage(`🏡 *Select Matter/Service Type*\n\nPlease reply with the number corresponding to your legal matter:\n\n*1.* Conveyancing & Property Transfers\n*2.* Notary Services (Antenuptial Contracts)\n*3.* Attorneys & Litigation\n*4.* Advocacy Counsel`);
      }
      else if (botStep === 'onboard_matter_type') {
        let matterType = '';
        if (trimmedText === '1') matterType = 'Conveyancing & Property Transfers';
        else if (trimmedText === '2') matterType = 'Notary Services (Antenuptial Contracts)';
        else if (trimmedText === '3') matterType = 'Attorneys & Litigation';
        else if (trimmedText === '4') matterType = 'Advocacy Counsel';
        else {
          addBotMessage(`⚠️ *Invalid Choice.*\n\nPlease reply with *1*, *2*, *3*, or *4*:`);
          return;
        }
        setOnboardData(prev => ({ ...prev, matterType }));
        setBotStep('onboard_matter_desc');
        addBotMessage(`You selected: *${matterType}*.\n\nPlease reply with a brief *Description of your matter* (the reason you are seeking counsel):`);
      }
      else if (botStep === 'onboard_matter_desc') {
        const updatedDescData = { ...onboardData, matterDescription: trimmedText };
        setOnboardData(updatedDescData);
        setBotStep('onboard_upload');
        setBotUploadedFiles([]);
        addBotMessage(`📂 *FICA Documents Required*\n\nYour matter details are recorded! We now require you to upload your FICA documents (such as ID smartcard, Proof of Residence, or offer to purchase).\n\nPlease tap the 📎 *clip paper icon* inside the chat panel below to attach and upload your files one by one.\n\nReply with *DONE* when you are finished uploading all documents.`);
      }
      else if (botStep === 'onboard_upload') {
        const reply = trimmedText.toUpperCase();
        if (reply === 'DONE') {
          addBotMessage('🔐 _Finalizing secure client onboarding and writing records to Supabase database..._');
          
          try {
            // 1. Insert Lead to CRM
            const fileUrls = botUploadedFiles
              .map(f => `${f.name}: ${f.url}`)
              .join(' | ');

            const notesDetails = `Client Self-Onboarded via WhatsApp Bot. ID: ${onboardData.idNumber}. Residence: ${onboardData.address}. Files uploaded: [${fileUrls || 'None'}].`;
            
            const newLead = await db.insertLead({
              name: onboardData.name,
              phone: onboardData.phone,
              email: onboardData.email || 'onboarded@client.co.za',
              service_type: onboardData.matterType,
              message: `WHATSAPP ONBOARDING: ${onboardData.matterDescription}`
            });

            // Update status to Consultation Booked and save notes
            await db.updateLeadStatus(newLead.id, 'Consultation Booked', notesDetails);

            // 2. Insert Case
            const mappedDocs = botUploadedFiles.map(f => ({
              name: f.name,
              url: f.url,
              size: f.size,
              status: 'Pending' as const,
              uploaded_at: new Date().toISOString()
            }));

            let practice_area = 'Attorneys & Litigation';
            if (onboardData.matterType.includes('Conveyancing')) practice_area = 'Conveyancing';
            else if (onboardData.matterType.includes('Notary')) practice_area = 'Notary Services';
            else if (onboardData.matterType.includes('Advocacy')) practice_area = 'Advocacy';

            const newCase = await db.insertCase({
              client_name: onboardData.name,
              client_email: onboardData.email || 'onboarded@client.co.za',
              client_phone: onboardData.phone,
              case_title: `FICA ONBOARDING (WA): ${onboardData.name} (${onboardData.matterType})`,
              status: 'Awaiting Documents',
              practice_area,
              key_dates: `WhatsApp Consultation requested`,
              documents: mappedDocs
            });

            // Log POPIA log
            await db.insertPopiaLog({
              case_id: newCase.id,
              case_title: newCase.client_name,
              document_name: 'WhatsApp Onboarding Registration',
              action: 'Uploaded',
              user_email: `WhatsApp Bot: ${newCase.client_name}`
            });

            // 3. Trigger beautifully styled transactional Resend emails (Server Action)
            try {
              const { sendOnboardingEmails } = await import('@/app/actions/email');
              await sendOnboardingEmails({
                name: onboardData.name,
                email: onboardData.email || 'onboarded@client.co.za',
                phone: onboardData.phone,
                idNumber: onboardData.idNumber,
                address: onboardData.address,
                matterType: onboardData.matterType,
                matterDescription: onboardData.matterDescription,
                bookingDate: new Date().toLocaleDateString(),
                bookingTime: 'WhatsApp Bot Session',
                caseNumber: newCase.case_number,
                accessKey: newCase.access_key
              });
            } catch (emailErr) {
              console.error('Background Resend email sending failed:', emailErr);
            }

            // Welcome client
            setBotStep('menu');
            setAuthenticatedCase(newCase);
            addBotMessage(`🎉 *Onboarding Successfully Completed!*\n\nWelcome to Ndabas Attorneys, *${onboardData.name}*!\n\nYour matter has been registered successfully.\n\nHere are your secure tracking credentials:\n\n*Case Number:* ${newCase.case_number}\n*Secret Access Key:* ${newCase.access_key}\n\nThese details have also been sent to your email. You can use them on our website portal or right here on WhatsApp to track your case.\n\nReply with *1* to *Check Matter Status & Documents*\nReply with *3* to *Exit and Logout*`);
          } catch (err: any) {
            console.error(err);
            setBotStep('welcome');
            addBotMessage(`❌ *Onboarding Failed.*\n\nCould not register matter: ${err?.message || String(err)}. Please type any message to restart.`);
          }
        } else {
          addBotMessage(`Please upload files using the 📎 *clip paper icon* inside the chat panel below.\n\nReply with *DONE* when you are finished uploading all documents.`);
        }
      }
      else if (botStep === 'case_number') {
        const inputCaseNum = trimmedText.toUpperCase();
        setTempCaseNumber(inputCaseNum);
        setBotStep('access_key');
        addBotMessage(`Acknowledged Case Number: *${inputCaseNum}*.\n\nNow, please provide your *Secret Access Key* (the 8-character unique alphanumeric key provided upon onboarding/receipt) to verify identity.`);
      } 
      else if (botStep === 'access_key') {
        const inputKey = trimmedText.toUpperCase();
        addBotMessage('🔐 _Verifying secure credentials against remote Supabase instance..._');
        
        try {
          const matchedCase = await db.getCaseByNumberAndKey(tempCaseNumber, inputKey);
          if (matchedCase) {
            setAuthenticatedCase(matchedCase);
            setBotStep('menu');
            
            // Log access in compliance log
            await db.insertPopiaLog({
              case_id: matchedCase.id,
              case_title: matchedCase.client_name,
              document_name: 'WhatsApp Bot Authentication',
              action: 'Viewed',
              user_email: `WhatsApp Bot: ${matchedCase.client_name}`
            });

            addBotMessage(`✅ *Authentication Successful!*\n\nWelcome back, *${matchedCase.client_name}*.\n\nYour active legal matter is: *${matchedCase.case_title}*.\nStatus: *${matchedCase.status.toUpperCase()}*.\n\nWhat would you like to do?\nReply with *1* to *Check Matter Status & Documents*\nReply with *2* to *Upload New Case Document*\nReply with *3* to *Reset and Exit*`);
          } else {
            setBotStep('welcome');
            addBotMessage('❌ *Authentication Failed.*\n\nNo case matches that combination. Let\'s restart from the menu.\n\nReply with *1* to Onboard, or *2* to try Case Tracking again.');
          }
        } catch (err) {
          console.error(err);
          setBotStep('welcome');
          addBotMessage('❌ *Database Error.*\n\nFailed to authenticate due to service disruptions. Returning to the main menu.');
        }
      } 
      else if (botStep === 'menu') {
        const choice = trimmedText;
        if (choice === '1') {
          if (!authenticatedCase) return;
          // Retrieve latest details
          try {
            const freshCase = await db.getCaseByNumberAndKey(authenticatedCase.case_number!, authenticatedCase.access_key!);
            if (freshCase) {
              setAuthenticatedCase(freshCase);
              const docsListText = freshCase.documents && freshCase.documents.length > 0
                ? freshCase.documents.map((d, i) => `${i+1}. ${d.name} (${d.status === 'Approved' ? '🟢 APPROVED' : d.status === 'Rejected' ? '🔴 REJECTED' : '🟡 PENDING'})`).join('\n')
                : 'No documents attached yet.';

              addBotMessage(`📊 *CASE STATUS SUMMARY*\n\n*Client:* ${freshCase.client_name}\n*Case Number:* ${freshCase.case_number}\n*Matter:* ${freshCase.case_title}\n*Live Status:* ${freshCase.status}\n*Key Deadlines:* ${freshCase.key_dates}\n\n*Attached FICA Documents:* \n${docsListText}\n\nReply with any other option to proceed or *3* to exit.`);
            }
          } catch {
            addBotMessage('Failed to fetch latest. Try again.');
          }
        } 
        else if (choice === '2') {
          setBotStep('uploading');
          addBotMessage('📂 *Document Upload Selection*\n\nPlease tap the 📎 *clip paper icon* inside the chat panel below to choose a document (e.g. proof of payment, deeds records, or IDs) to upload directly to your case files.');
        } 
        else if (choice === '3') {
          setBotStep('welcome');
          setAuthenticatedCase(null);
          setTempCaseNumber('');
          addBotMessage('🚪 *Logged Out successfully.*\n\nWelcome back. Reply with *1* to Onboard, or *2* to Track a Case.');
        } 
        else {
          addBotMessage('⚠️ *Invalid Choice.*\n\nPlease reply with *1* (Check status), *2* (Upload file), or *3* (Reset/Exit).');
        }
      }
    }, 1200);
  };

  const handleBotFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // 1. Alert user that file received and starting upload
    handleSendMessage(`Appending file: ${file.name}`, true, file.name);

    setTimeout(async () => {
      addBotMessage(`⏳ _Uploading "${file.name}" securely to Supabase storage..._`);

      try {
        const uploadedUrl = await db.uploadFile(file);
        if (!uploadedUrl) throw new Error('Upload returned null.');

        // Is it for Onboarding, or for appending to an Existing Case?
        if (botStep === 'onboard_upload') {
          const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
          setBotUploadedFiles(prev => [...prev, { name: file.name, size: fileSize, url: uploadedUrl }]);
          
          addBotMessage(`🟢 *File Attached successfully!*\n\nAttached: *"${file.name}"* (${fileSize}).\n\nYou can attach more files, or reply with *DONE* if finished.`);
        } else if (authenticatedCase) {
          // Fetch fresh copy of case
          const currentCase = await db.getCaseByNumberAndKey(authenticatedCase.case_number!, authenticatedCase.access_key!);
          if (!currentCase) return;

          const newDoc = {
            name: file.name,
            url: uploadedUrl,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            status: 'Pending' as const, // WhatsApp Bot uploads start as pending verification
            uploaded_at: new Date().toISOString()
          };

          const updatedDocs = [...(currentCase.documents || []), newDoc];
          await db.updateCase(currentCase.id, { documents: updatedDocs });

          // Log POPIA log
          await db.insertPopiaLog({
            case_id: currentCase.id,
            case_title: currentCase.client_name,
            document_name: file.name,
            action: 'Uploaded',
            user_email: `WhatsApp Bot: ${currentCase.client_name}`
          });

          // Set state to menu
          setBotStep('menu');
          setAuthenticatedCase({
            ...currentCase,
            documents: updatedDocs
          });

          addBotMessage(`🎉 *Upload Complete!*\n\nFile *"${file.name}"* was successfully processed and attached to Case *${currentCase.case_number}* under *Pending Verification*.\n\nReply with *1* to verify files or *3* to reset.`);
        }
      } catch (err: any) {
        console.error(err);
        addBotMessage(`❌ *Upload Failed.*\n\nCould not save file: ${err?.message || String(err)}.`);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between font-sans relative">
      
      {/* Header Bar */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between z-40 select-none">
        <a href="/" className="flex items-center gap-2 font-serif text-lg font-bold tracking-wide">
          <Scale className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">NDABAS</span>
        </a>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            type="button"
            className="p-2.5 hover:bg-card/90 border border-border rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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

      <main className="flex-grow pb-24 px-4 max-w-5xl mx-auto w-full space-y-12">
        
        {/* Onboarding Header */}
        <div className="text-center space-y-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block uppercase">LIVE MATTER MANAGEMENT</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">Secure Case Tracking</h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Verify case schedules, check document approval progress under POPIA controls, or utilize our simulated WhatsApp bot support to upload missing court files.
          </p>
          
          {/* Tab Selector */}
          <div className="flex justify-center pt-4 select-none">
            <div className="bg-card border border-border p-1.5 rounded-full flex gap-1 shadow-sm">
              <button
                onClick={() => setActiveTab('portal')}
                className={`px-5 py-2 rounded-full font-mono text-[10px] tracking-wider font-bold transition-all flex items-center gap-1.5 uppercase ${activeTab === 'portal' ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/25' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Search className="h-3.5 w-3.5" />
                WEB TRACKER PORTAL
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-5 py-2 rounded-full font-mono text-[10px] tracking-wider font-bold transition-all flex items-center gap-1.5 uppercase ${activeTab === 'whatsapp' ? 'bg-green-600 text-white shadow-sm shadow-green-500/25' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Smartphone className="h-3.5 w-3.5 text-green-500 shrink-0" />
                WHATSAPP BOT SIMULATOR
              </button>
            </div>
          </div>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* TAB 1: WEB TRACKER PORTAL */}
          {activeTab === 'portal' && (
            <motion.div
              key="portal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                <div className="space-y-1 border-b border-border/60 pb-3">
                  <h3 className="font-serif text-xl font-normal text-foreground">Matter Credentials Access</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">Enter your credentials to query live Supabase databases securely.</p>
                </div>

                <form onSubmit={handlePortalTrack} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                      <label>CASE NUMBER</label>
                      <input 
                        type="text"
                        value={portalCaseNumber}
                        onChange={(e) => setPortalCaseNumber(e.target.value)}
                        placeholder="NDB-2026-1001"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                        required
                      />
                    </div>
                    <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                      <label>SECRET ACCESS KEY</label>
                      <div className="relative w-full">
                        <input 
                          type={showAccessKey ? "text" : "password"}
                          value={portalAccessKey}
                          onChange={(e) => setPortalAccessKey(e.target.value)}
                          placeholder="8-CHARACTER ACCESS KEY"
                          className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowAccessKey(!showAccessKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-border/20 border border-border/40 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          title={showAccessKey ? "Hide Access Key" : "Show Access Key"}
                        >
                          {showAccessKey ? <EyeOff className="h-4 w-4 text-primary" /> : <Eye className="h-4 w-4 text-primary" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {portalError && (
                    <p className="text-red-500 text-xs font-sans italic">{portalError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={portalLoading}
                    className="w-full bg-gradient-to-r from-primary to-lavender text-white dark:from-primary dark:to-lavender py-3.5 rounded-xl font-mono text-xs tracking-wider font-bold shadow-md uppercase flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {portalLoading ? 'QUERYING DB...' : 'TRACK LIVE CASE MATTER'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>

              {/* LIVE CASE SUMMARY DISPLAY */}
              {portalCase && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm space-y-6"
                >
                  <div className="border-b border-border/60 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] tracking-widest text-primary font-bold uppercase">SECURED FILE SEARCH SUCCESS</span>
                      <h3 className="font-serif text-xl font-bold text-foreground">{portalCase.case_title}</h3>
                      <p className="text-muted-foreground text-xs font-sans">Registered to: <strong className="text-foreground">{portalCase.client_name}</strong></p>
                    </div>

                    <div className="flex items-center gap-2 bg-background border border-border rounded-2xl p-3 shadow-sm shrink-0">
                      <Lock className="h-4 w-4 text-primary shrink-0" />
                      <div className="font-mono text-[10px] text-muted-foreground leading-normal">
                        <span className="block font-bold">CASE ID:</span>
                        <span className="block text-foreground font-bold">{portalCase.case_number}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tracking progress Timeline summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start font-sans text-xs">
                    <div className="space-y-4">
                      <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase font-bold block">LIVE MILESTONES</span>
                      <div className="space-y-4 border-l border-border/80 pl-4 relative ml-2">
                        
                        <div className="relative">
                          <div className="absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full bg-green-500"></div>
                          <span className="font-bold text-foreground block">Client Self-Onboarding Completed</span>
                          <span className="text-[10px] text-muted-foreground block">Matter created with status "Awaiting Documents".</span>
                        </div>

                        <div className="relative">
                          <div className={`absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full ${portalCase.status !== 'Awaiting Documents' ? 'bg-green-500' : 'bg-primary animate-pulse'}`}></div>
                          <span className="font-bold text-foreground block">FICA Documents Verification</span>
                          <span className="text-[10px] text-muted-foreground block">Status: {portalCase.status === 'Awaiting Documents' ? '🟡 Awaiting validation...' : '🟢 Verified and validated!'}</span>
                        </div>

                        <div className="relative">
                          <div className={`absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full ${portalCase.status === 'In Progress' || portalCase.status === 'Complete' ? 'bg-green-500' : 'bg-border'}`}></div>
                          <span className="font-bold text-foreground block">Matter Processing & Counsel Representation</span>
                          <span className="text-[10px] text-muted-foreground block">Adv. Ndaba compiles legal files at Justice House.</span>
                        </div>

                        <div className="relative">
                          <div className={`absolute -left-[21px] top-0 w-2.5 h-2.5 rounded-full ${portalCase.status === 'Complete' ? 'bg-green-500' : 'bg-border'}`}></div>
                          <span className="font-bold text-foreground block">Matter Settled / Complete</span>
                          <span className="text-[10px] text-muted-foreground block">All files submitted, transfers executed or briefs closed.</span>
                        </div>

                      </div>
                    </div>

                    <div className="space-y-4 bg-background border border-border p-5 rounded-2xl shadow-sm">
                      <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase font-bold block">CASE SPECIFICATIONS</span>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-border/40 pb-2">
                          <span className="text-muted-foreground uppercase tracking-wider font-mono text-[9px]">PRACTICE AREA:</span>
                          <span className="font-bold text-foreground">{portalCase.practice_area}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/40 pb-2">
                          <span className="text-muted-foreground uppercase tracking-wider font-mono text-[9px]">KEY DATE INFO:</span>
                          <span className="font-bold text-foreground">{portalCase.key_dates}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/40 pb-2">
                          <span className="text-muted-foreground uppercase tracking-wider font-mono text-[9px]">LIVESTATUS:</span>
                          <span className={`font-bold ${portalCase.status === 'Complete' ? 'text-green-500' : 'text-primary animate-pulse'}`}>{portalCase.status.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents checklist details */}
                  <div className="border-t border-border/60 pt-6 space-y-4">
                    <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase font-bold block">FICA CASE DOCUMENTS STATUS</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {portalCase.documents && portalCase.documents.map((doc, idx) => (
                        <div key={idx} className="bg-background border border-border rounded-xl p-3.5 flex items-center justify-between text-xs shadow-sm">
                          <div className="flex items-center gap-2 truncate">
                            <File className="h-4 w-4 text-primary shrink-0" />
                            <div className="truncate">
                              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="font-bold text-foreground hover:underline block truncate hover:text-primary transition-colors">{doc.name}</a>
                              <span className="text-[10px] text-muted-foreground block font-mono">{doc.size}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${doc.status === 'Approved' ? 'bg-green-500/10 text-green-500' : doc.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            {doc.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                      {(!portalCase.documents || portalCase.documents.length === 0) && (
                        <p className="text-xs text-muted-foreground italic font-sans py-4">No documents have been uploaded to this matter yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Client Portal Secure Document Upload Panel */}
                  <div className="border-t border-border/60 pt-6 space-y-4 font-sans text-xs">
                    <div className="flex justify-between items-center select-none">
                      <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase font-bold block">SECURE CLIENT UPLOAD PANEL</span>
                      {portalUploading && (
                        <span className="text-[10px] text-primary font-mono font-bold animate-pulse">UPLOADING...</span>
                      )}
                    </div>
                    <div 
                      onClick={() => !portalUploading && portalUploaderRef.current?.click()}
                      className={`border border-dashed border-border/80 hover:border-primary/50 bg-background hover:bg-card/40 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 select-none ${portalUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input 
                        type="file" 
                        ref={portalUploaderRef} 
                        onChange={handlePortalFileUpload} 
                        className="hidden" 
                        disabled={portalUploading}
                      />
                      <div className="p-2.5 bg-card border border-border rounded-xl shadow-sm">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground text-xs block">Upload Additional Certified Documents</span>
                        <span className="text-muted-foreground text-[10px] block">Click here to choose or drop certified FICA PDFs or photos directly.</span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </motion.div>
          )}

          {/* TAB 2: WHATSAPP BOT SIMULATOR */}
          {activeTab === 'whatsapp' && (
            <motion.div
              key="whatsapp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto"
            >
              {/* SMARTPHONE BODY FRAME */}
              <div className="bg-[#111110] border-4 border-zinc-800 rounded-[40px] shadow-2xl p-3.5 relative max-w-sm mx-auto overflow-hidden">
                
                {/* Speaker/Camera notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-5 bg-zinc-800 rounded-full z-50 flex items-center justify-center">
                  <div className="w-12 h-1 bg-zinc-700 rounded-full mb-1"></div>
                </div>

                {/* WHATSAPP CONTAINER SCREEN */}
                <div className="bg-[#F0F0ED] rounded-[28px] overflow-hidden flex flex-col h-[520px] relative">
                  
                  {/* Status Bar / Notch pad padding */}
                  <div className="bg-[#075E54] text-[8px] font-mono text-white/90 px-5 pt-7 pb-1.5 flex justify-between select-none">
                    <span>9:41 AM</span>
                    <div className="flex gap-1.5 font-bold">
                      <span>LTE</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Header Chat Panel */}
                  <div className="bg-[#075E54] px-3.5 py-3 flex items-center justify-between text-white border-b border-white/5 select-none shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-zinc-800 border border-white/20 rounded-full flex items-center justify-center text-sm">
                        ⚖️
                      </div>
                      <div className="leading-tight">
                        <span className="font-bold text-xs block tracking-wide">Ndabas Attorneys Bot</span>
                        <span className="text-[9px] text-green-300 block font-bold animate-pulse">online support</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-white/70 font-mono tracking-widest font-bold">LPC-SA</div>
                  </div>

                  {/* Chat Bubbles Scroll Area */}
                  <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-[#E5DDD5]">
                    
                    {/* Security compliance watermark banner */}
                    <div className="bg-[#FFFFCC] border border-yellow-200/80 rounded-lg p-2 text-[9px] leading-relaxed text-yellow-800 text-center font-sans max-w-xs mx-auto shadow-sm select-none">
                      🔒 Messages are encrypted and stored inside Ndabas Attorneys' secure compliance database.
                    </div>

                    {messages.map((msg, mIdx) => {
                      const isBot = msg.sender === 'bot';
                      return (
                        <div 
                          key={mIdx} 
                          className={`flex ${isBot ? 'justify-start' : 'justify-end'} w-full`}
                        >
                          <div className={`rounded-xl p-3 shadow-sm text-[10.5px] max-w-[85%] relative leading-relaxed font-sans ${isBot ? 'bg-white text-zinc-800 rounded-tl-none' : 'bg-[#DCF8C6] text-zinc-900 rounded-tr-none'}`}>
                            
                            {/* Rich text Markdown bullet formatter in simulated bot messages */}
                            <p className="whitespace-pre-line select-text">
                              {msg.text}
                            </p>

                            <span className="text-[7.5px] text-muted-foreground font-mono block text-right mt-1 select-none">
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Simulated Input Bar controls */}
                  <div className="bg-[#F4F4F4] border-t border-zinc-200 p-2 flex items-center gap-2 shrink-0">
                    
                    {/* Hidden actual browser uploader */}
                    <input 
                      type="file" 
                      ref={botUploaderRef}
                      onChange={handleBotFileUpload}
                      className="hidden"
                    />

                    {/* Clip icon button */}
                    <button
                      type="button"
                      disabled={botStep !== 'uploading' && botStep !== 'onboard_upload'}
                      onClick={() => botUploaderRef.current?.click()}
                      className={`p-2 bg-zinc-200 hover:bg-zinc-300 rounded-full text-zinc-600 transition-colors cursor-pointer ${botStep !== 'uploading' && botStep !== 'onboard_upload' ? 'opacity-30 cursor-not-allowed' : ''}`}
                      title={botStep === 'uploading' || botStep === 'onboard_upload' ? 'Attach FICA Document' : 'Auth first to upload'}
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>

                    <input 
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-grow bg-white border border-zinc-200 rounded-full px-3.5 py-2 text-[11px] focus:outline-none focus:border-green-600 text-zinc-800 font-sans"
                    />

                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      className="p-2 bg-[#075E54] hover:opacity-95 rounded-full text-white cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

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
  );
}
