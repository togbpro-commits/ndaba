'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db, Case } from '@/lib/db';
import { sendOnboardingEmails } from '@/app/actions/email';
import { 
  User, 
  FileText, 
  Calendar, 
  Signature, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone,
  Trash2,
  File,
  X,
  Scale,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type OnboardStep = 1 | 2 | 3 | 4 | 5;

export default function Onboard() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [step, setStep] = useState<OnboardStep>(1);
  const [createdCase, setCreatedCase] = useState<Case | null>(null);

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
  const [formData, setFormData] = useState({
    // Step 1: FICA Personal
    name: '',
    email: '',
    phone: '',
    idNumber: '',
    address: '',
    
    // Step 2: Matter Details
    matterType: 'Conveyancing & Property Transfers',
    matterDescription: '',
    
    // Step 3: Booking Info
    bookingDate: '',
    bookingTime: '09:00',
    
    // Step 5: POPIA and Sign
    popiaConsent: false,
    signatureName: ''
  });

  // Step 3: Mock Files Upload state
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; progress: number; url?: string | null; requirementName?: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 5: Signature Pad simulation (Draw)
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasSigned, setHasOnboardSigned] = useState(false);

  const [onboardSubmitted, setOnboardSubmitted] = useState(false);

  // File Uploader Mocking & Real Sync
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addRealFiles(Array.from(e.target.files));
    }
  };

  const addRealFiles = async (filesList: File[], requirementName?: string) => {
    const newFiles = filesList.map(f => ({
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
      progress: 10,
      url: null as string | null,
      requirementName
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Perform actual sequential file uploads to Supabase Storage
    for (const file of filesList) {
      try {
        setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: 50 } : f));
        
        const uploadedUrl = await db.uploadFile(file);
        
        setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: 100, url: uploadedUrl } : f));
      } catch (error) {
        console.error(`Error uploading file "${file.name}":`, error);
        setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, progress: 0, size: 'Failed to upload' } : f));
        alert(`Failed to upload ${file.name} to database: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addRealFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Canvas drawing simulation
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#B76E79'; // Rose gold
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
    setHasOnboardSigned(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasOnboardSigned(false);
  };

  // Form Navigation Validation
  const validateStep = (currentStep: OnboardStep): boolean => {
    if (currentStep === 1) {
      return !!(formData.name && formData.phone && formData.idNumber && formData.address);
    }
    if (currentStep === 2) {
      return !!(formData.matterType && formData.matterDescription);
    }
    if (currentStep === 3) {
      return true; // Files optional for demo, but highly recommended
    }
    if (currentStep === 4) {
      return !!(formData.bookingDate && formData.bookingTime);
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => (prev + 1) as OnboardStep);
    } else {
      alert('Please fill out all required fields on this step to proceed.');
    }
  };

  const prevStep = () => {
    setStep(prev => (prev - 1) as OnboardStep);
  };

  // Submit Final Onboarding
  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.popiaConsent) {
      alert('You must accept the POPIA consent to submit.');
      return;
    }

    try {
      // 1. Submit lead to CRM database
      const fileUrls = uploadedFiles
        .filter(f => f.url)
        .map(f => `${f.name}: ${f.url}`)
        .join(' | ');

      const notesDetails = `Client Self-Onboarded. ID: ${formData.idNumber}. Residence: ${formData.address}. Files uploaded: [${fileUrls || 'None'}]. Signed name: ${formData.signatureName}. Preferred appointment: ${formData.bookingDate} at ${formData.bookingTime}.`;
      
      const newLead = await db.insertLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || 'onboarded@client.co.za',
        service_type: formData.matterType,
        message: `ONBOARDING REGISTRATION: ${formData.matterDescription}`
      });

      // 2. Set status to Consultation Booked and append notes
      await db.updateLeadStatus(newLead.id, 'Consultation Booked', notesDetails);

      // 3. Auto-Create Case matter awaiting documents
      const mappedDocs = uploadedFiles
        .filter(f => f.url)
        .map(f => ({
          name: f.requirementName ? `${f.requirementName}: ${f.name}` : f.name,
          url: f.url || '',
          size: f.size,
          status: 'Pending' as const,
          uploaded_at: new Date().toISOString()
        }));

      const newCase = await db.insertCase({
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        case_title: `FICA ONBOARDING: ${formData.name} (${formData.matterType})`,
        status: 'Awaiting Documents',
        practice_area: formData.matterType.split(' ')[0],
        key_dates: `Meeting: ${formData.bookingDate} @ ${formData.bookingTime}`,
        documents: mappedDocs
      });

      setCreatedCase(newCase);

      // 4. Trigger beautifully styled transactional Resend emails (Server Action)
      try {
        await sendOnboardingEmails({
          name: formData.name,
          email: formData.email || 'onboarded@client.co.za',
          phone: formData.phone,
          idNumber: formData.idNumber,
          address: formData.address,
          matterType: formData.matterType,
          matterDescription: formData.matterDescription,
          bookingDate: formData.bookingDate,
          bookingTime: formData.bookingTime,
          caseNumber: newCase.case_number,
          accessKey: newCase.access_key
        });
      } catch (emailErr) {
        console.error('Background Resend email sending failed:', emailErr);
        // Continue silently as this is non-blocking for user onboarding flow
      }

      setOnboardSubmitted(true);
    } catch (error) {
      console.error('Error in client onboarding submission:', error);
      alert('An error occurred during onboarding. Please try again.');
    }
  };

  // Dynamic FICA document guidelines based on Matter
  const getFicaGuidelines = () => {
    switch (formData.matterType) {
      case 'Conveyancing & Property Transfers':
        return [
          { label: 'Deed of Sale / Offer to Purchase', desc: 'Signed by both buyer and seller (Original or certified copy).' },
          { label: 'FICA Proof of Residence', desc: 'Utility bill, rates invoice, or bank statement under 3 months old.' },
          { label: 'Certified ID / Smart Card copy', desc: 'Clear color photo of both front and back faces.' },
          { label: 'Marital Status Proof', desc: 'Marriage certificate and ANC contract copy if married Out of Community.' }
        ];
      case 'Notary Services (Antenuptial Contracts)':
        return [
          { label: 'Certified Identity Documents', desc: 'Clear smart card or passport copies of both marrying partners.' },
          { label: 'FICA Residence Verification', desc: 'A municipal service statement or mobile account under 3 months.' },
          { label: 'Divorce Decree or Death Certificates', desc: 'Required only if either partner was previously married.' }
        ];
      case 'Attorneys & Litigation':
      case 'Advocacy Counsel':
        return [
          { label: 'Certified ID / smart card', desc: 'Clear front and back copies certified within 3 months.' },
          { label: 'Court briefs or Summons files', desc: 'Any legal letters of demand, pleadings, or sheriff notices received.' },
          { label: 'Prior contract or files', desc: 'Any signed agreements or transaction trails central to the civil claim.' }
        ];
      default:
        return [
          { label: 'Certified Copy of ID Book/Card', desc: 'Certified within the last 3 months.' },
          { label: 'Proof of residential address', desc: 'Standard utility letter or lease agreement.' }
        ];
    }
  };

  const stepDetails = [
    { title: "Personal Details", icon: <User className="h-4 w-4" /> },
    { title: "Matter Scope", icon: <FileText className="h-4 w-4" /> },
    { title: "FICA Documents", icon: <Upload className="h-4 w-4" /> },
    { title: "Schedule", icon: <Calendar className="h-4 w-4" /> },
    { title: "Verification", icon: <Signature className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between font-sans relative">
      
      {/* Top Action Bar instead of Navbar */}
      <header className="max-w-4xl mx-auto w-full px-6 py-6 flex items-center justify-between z-40 select-none">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 font-serif text-lg font-bold tracking-wide">
          <Scale className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">NDABAS</span>
        </a>

        {/* Theme, Exit Portal Group */}
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
            title="Exit Onboarding"
          >
            <X className="h-3.5 w-3.5 text-primary" />
            EXIT PORTAL
          </a>
        </div>
      </header>

      <main className="flex-grow pb-20 px-4 max-w-4xl mx-auto w-full space-y-12 select-none">
        
        {/* Onboarding Header */}
        <div className="text-center space-y-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">ELITE ONBOARDING PORTAL</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">Secure Client Onboarding</h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Onboard formally from the comfort of your home. Provide your FICA details, review matter checklists, upload files, and lock in a premium consultation at Justice House.
          </p>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </div>

        {onboardSubmitted ? (
          /* SUCCESS SCREEN */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border p-8 sm:p-12 rounded-3xl text-center space-y-8 shadow-lg max-w-2xl mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender/5 to-accent/15 blur-xl rounded-full"></div>
            
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
            
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-foreground">Onboarding Complete</h2>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-foreground">{formData.name}</strong>. Your legal FICA file and mock case matter have been successfully generated in the Ndabas Attorneys CRM system.
              </p>
            </div>

            {/* Credentials Card */}
            {createdCase && (
              <div className="bg-background border border-border/80 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-24 bg-gradient-to-bl from-primary/5 to-transparent blur-lg rounded-full"></div>
                <div className="border-b border-border/60 pb-3">
                  <span className="text-primary font-bold tracking-widest text-[10px] uppercase font-mono block">SECURE CASE TRACKING CREDENTIALS</span>
                  <span className="text-[10.5px] text-muted-foreground font-sans mt-0.5 block leading-normal">Use these secure credentials on our client portal or text them to our WhatsApp Bot to track details or append documents.</span>
                </div>
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-center bg-card p-2.5 border border-border/60 rounded-xl">
                    <span className="text-muted-foreground text-[9px] uppercase font-bold">CASE NUMBER:</span>
                    <span className="font-bold text-foreground text-sm tracking-wider select-text">{createdCase.case_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-card p-2.5 border border-border/60 rounded-xl">
                    <span className="text-muted-foreground text-[9px] uppercase font-bold">SECRET KEY:</span>
                    <span className="font-bold bg-foreground text-background dark:bg-foreground dark:text-background px-3 py-1 rounded-lg text-sm select-all tracking-wider">{createdCase.access_key || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Details Card */}
            <div className="bg-background border border-border rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto font-mono text-xs text-muted-foreground shadow-sm">
              <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                <span className="text-primary font-bold tracking-widest text-[10px]">CONSULTATION SECURED</span>
                <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-0.5 rounded text-[9px] font-bold">CONFIRMED</span>
              </div>
              <div className="space-y-2 font-sans text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Time:</strong> {formData.bookingDate} @ {formData.bookingTime}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Location:</strong> Justice House, 2208C Block AA Portion 9, Hammanskraal</span>
                </div>
                <div className="flex items-center gap-2 border-t border-border/60 pt-3 mt-2">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Office Support:</strong> 012 711 0427 / 082 490 6285</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-[11px] text-muted-foreground leading-relaxed font-sans max-w-sm mx-auto">
                Our administrative staff will call or message you on WhatsApp to finalize your consultation checklists. Please bring your hard-copy original FICA files with you.
              </p>
              <a 
                href="/" 
                className="inline-flex bg-gradient-to-r from-primary to-lavender text-white dark:from-primary dark:to-lavender font-mono text-xs tracking-widest font-bold px-10 py-4 rounded-xl hover:opacity-95 shadow-md shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                CONGRATULATIONS - GO BACK TO HOMEPAGE
              </a>
            </div>
          </motion.div>
        ) : (
          /* STEP-BY-STEP WIZARD */
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm relative">
            
            {/* Steps Progress rail */}
            <div className="hidden sm:flex items-center justify-between border-b border-border/60 pb-8 mb-8 font-mono text-[9px] tracking-widest text-muted-foreground">
              {stepDetails.map((details, index) => {
                const stepNum = index + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;
                
                return (
                  <div key={index} className="flex items-center gap-2 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border transition-colors ${isActive ? 'bg-primary border-primary text-primary-foreground font-mono shadow-sm shadow-primary/30' : isCompleted ? 'bg-green-500/15 border-green-500 text-green-500' : 'bg-background border-border text-muted-foreground'}`}>
                      {isCompleted ? '✓' : stepNum}
                    </div>
                    <span className={`font-bold uppercase tracking-wider text-[8.5px] ${isActive ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {details.title}
                    </span>
                    {index < stepDetails.length - 1 && (
                      <div className="h-[1px] w-6 bg-border/80 ml-2"></div>
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: PERSONAL & FICA IDENTITY */}
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5 border-b border-border/60 pb-3">
                      <h3 className="font-serif text-xl font-normal text-foreground">Personal Information</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">Enter your full legal identity details as verified under South African FICA.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                        <label>FULL LEGAL NAME(S)</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Sipho Doe" 
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                          required 
                        />
                      </div>
                      <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                        <label>SA ID / PASSPORT NUMBER</label>
                        <input 
                          type="text" 
                          value={formData.idNumber}
                          onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                          placeholder="860101 5555 083" 
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                          maxLength={13}
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                        <label>CELLPHONE CHANNELS</label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="082 490 6285" 
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                          required 
                        />
                      </div>
                      <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                        <label>EMAIL ADDRESS</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john.doe@gmail.com" 
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                      <label>RESIDENTIAL / FICA PHYSICAL ADDRESS</label>
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="2208C Block AA, Hammanskraal, Gauteng" 
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                        required 
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: MATTER CLASSIFICATION */}
                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5 border-b border-border/60 pb-3">
                      <h3 className="font-serif text-xl font-normal text-foreground">Matter Classification</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">Select the exact legal scope or practice area representation required from Adv. Ndaba.</p>
                    </div>

                    <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                      <label>LEGAL SERVICE REPRESENTATION NEEDED</label>
                      <select 
                        value={formData.matterType}
                        onChange={(e) => setFormData({ ...formData, matterType: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                      >
                        <option>Conveyancing & Property Transfers</option>
                        <option>Notary Services (Antenuptial Contracts)</option>
                        <option>Attorneys & Litigation</option>
                        <option>Advocacy Counsel</option>
                      </select>
                    </div>

                    <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                      <label>MATTER BRIEF / DESCRIPTION DETAILS</label>
                      <textarea 
                        value={formData.matterDescription}
                        onChange={(e) => setFormData({ ...formData, matterDescription: e.target.value })}
                        placeholder="State any specific deeds, purchases, court briefs, summons details, or agreements we need to compile..." 
                        rows={6} 
                        className="w-full bg-background border border-border rounded-xl p-4 text-xs text-foreground focus:outline-none focus:border-primary font-sans resize-none" 
                        required
                      ></textarea>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: DOCUMENT UPLOAD & FICA CHECKLIST */}
                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5 border-b border-border/60 pb-3">
                      <h3 className="font-serif text-xl font-normal text-foreground">FICA Checklist & Mock File Upload</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">Prepare the necessary legal documentation according to your matter type.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      
                      {/* Left: Dynamic Checklist Display with Inline Uploaders */}
                      <div className="space-y-4">
                        <span className="font-mono text-[9px] tracking-widest text-primary font-bold block uppercase bg-primary/10 px-2.5 py-1 rounded w-fit">REQUIRED AT JUSTICE HOUSE</span>
                        <div className="space-y-3">
                          {getFicaGuidelines().map((guide, idx) => {
                            // Find if there is an uploaded file for this specific guideline requirement
                            const matchingFile = uploadedFiles.find(f => f.requirementName === guide.label);

                            return (
                              <div key={idx} className="bg-background border border-border/60 p-4 rounded-xl shadow-sm space-y-3">
                                <div className="flex gap-2.5 items-start">
                                  <CheckCircle2 className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${matchingFile?.progress === 100 ? 'text-green-500' : 'text-primary'}`} />
                                  <div className="space-y-0.5 font-sans">
                                    <span className="font-bold text-foreground text-xs block">{guide.label}</span>
                                    <span className="text-muted-foreground text-[11px] leading-relaxed block">{guide.desc}</span>
                                  </div>
                                </div>

                                {/* Inline uploader status or action */}
                                <div className="pl-7">
                                  {matchingFile ? (
                                    <div className="bg-card border border-border/50 rounded-xl p-2.5 flex items-center justify-between gap-3 text-[11px] shadow-sm animate-fade-in">
                                      <div className="flex items-center gap-2 truncate max-w-[65%]">
                                        <File className="h-3.5 w-3.5 text-primary shrink-0" />
                                        <div className="truncate space-y-0.5">
                                          <span className="font-bold text-foreground block truncate">{matchingFile.name}</span>
                                          <span className="text-[9px] text-muted-foreground block">{matchingFile.size} · {matchingFile.progress === 100 ? 'Uploaded ✅' : `${matchingFile.progress}%`}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0 font-mono">
                                        <div className="h-1 w-10 bg-border rounded-full overflow-hidden">
                                          <div className={`h-full ${matchingFile.progress === 100 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${matchingFile.progress}%` }}></div>
                                        </div>
                                        <button 
                                          type="button"
                                          onClick={() => removeFile(matchingFile.name)}
                                          className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                                          title="Remove Document"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <label 
                                        htmlFor={`requirement-upload-${idx}`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-primary/40 text-primary hover:bg-primary/5 rounded-lg text-[10px] font-mono tracking-wider font-bold transition-all cursor-pointer hover:scale-102 active:scale-98 shadow-sm"
                                      >
                                        <Upload className="h-3 w-3" /> UPLOAD DOCUMENT
                                      </label>
                                      <input 
                                        type="file"
                                        id={`requirement-upload-${idx}`}
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files.length > 0) {
                                            addRealFiles([e.target.files[0]], guide.label);
                                          }
                                        }}
                                        className="hidden" 
                                      />
                                      <span className="text-[10px] text-muted-foreground font-sans">No file uploaded</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Additional Supporting Documents & General List */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <span className="font-mono text-[9px] tracking-widest text-muted-foreground font-bold block uppercase">ADDITIONAL DOCUMENTATION</span>
                          <p className="text-muted-foreground text-[11px] leading-relaxed">
                            Drag or select any other custom files (spouse ID, bank statements, tax documents) to support your FICA file registration.
                          </p>
                        </div>

                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 relative overflow-hidden select-none min-h-[140px] ${isDragging ? 'bg-primary/5 border-primary scale-[0.98]' : 'bg-background hover:bg-card/30 border-border/80'}`}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple 
                            className="hidden" 
                          />
                          <div className="p-2.5 bg-card border border-border rounded-xl shadow-sm">
                            <Upload className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-0.5 font-sans text-[11px]">
                            <span className="font-bold text-foreground block">General Drag & Drop</span>
                            <span className="text-muted-foreground text-[10px]">Add supplementary matter attachments.</span>
                          </div>
                        </div>

                        {/* List of general (non-requirement) files */}
                        {uploadedFiles.filter(f => !f.requirementName).length > 0 && (
                          <div className="space-y-2">
                            <span className="font-mono text-[8px] tracking-widest text-muted-foreground block uppercase font-bold">SUPPLEMENTARY FILES:</span>
                            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                              {uploadedFiles.filter(f => !f.requirementName).map((file, fIdx) => (
                                <div key={fIdx} className="bg-background border border-border rounded-xl p-3 flex items-center justify-between gap-3 text-xs shadow-sm">
                                  <div className="flex items-center gap-2 max-w-[70%]">
                                    <File className="h-4 w-4 text-primary shrink-0" />
                                    <div className="space-y-1 truncate">
                                      <span className="font-bold text-foreground block truncate">{file.name}</span>
                                      <span className="text-[10px] text-muted-foreground block">{file.size} · {file.progress === 100 ? '100% - Complete! ✅' : `${file.progress}%`}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <div className="h-1.5 w-14 bg-border rounded-full overflow-hidden">
                                      <div className={`h-full ${file.progress === 100 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${file.progress}%` }}></div>
                                    </div>
                                    <button 
                                      type="button"
                                      onClick={() => removeFile(file.name)}
                                      className="text-muted-foreground hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive developer sandbox helper note */}
                        {uploadedFiles.some(f => f.url && f.url.startsWith('blob:')) && (
                          <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex gap-3 text-[11px] leading-relaxed text-muted-foreground font-sans mt-3 animate-fade-in">
                            <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-foreground block mb-0.5">Local Encrypted Sandbox Mode</strong>
                              Your files are saved securely inside your local browser memory sandbox because cloud file storage is not configured yet. 
                              <br className="mb-2 block" />
                              <strong className="text-foreground">To enable cloud uploads:</strong> Please ensure your secure database storage buckets are correctly initialized and verified inside your backend database console!
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* STEP 4: PREFERRED SCHEDULE BOOKING */}
                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5 border-b border-border/60 pb-3">
                      <h3 className="font-serif text-xl font-normal text-foreground">Schedule Consultation</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">Choose your preferred day and time slot to present your original physical deeds or files at Justice House.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground">
                        <label>PREFERRED MEETING DATE</label>
                        <input 
                          type="date" 
                          value={formData.bookingDate}
                          onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans cursor-pointer" 
                          required 
                        />
                      </div>
                      
                      {/* Time Slots grid */}
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] tracking-wider text-muted-foreground block">AVAILABLE TIME SLOTS</label>
                        <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-muted-foreground">
                          {['08:30', '10:00', '11:30', '13:00', '14:30', '15:30'].map((time) => {
                            const isSelected = formData.bookingTime === time;
                            return (
                              <button
                                type="button"
                                key={time}
                                onClick={() => setFormData({ ...formData, bookingTime: time })}
                                className={`py-2 px-3 border rounded-xl shadow-sm transition-all text-center ${isSelected ? 'bg-primary border-primary text-primary-foreground font-bold font-mono' : 'bg-background hover:bg-card border-border'}`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: POPIA & AUTHORIZATION SIGN-OFF */}
                {step === 5 && (
                  <motion.div 
                    key="step5"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5 border-b border-border/60 pb-3">
                      <h3 className="font-serif text-xl font-normal text-foreground">Sign-Off & Legal Verification</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">Formally consent to data processing under POPIA and sign your onboarding files.</p>
                    </div>

                    {/* POPIA Info Banner */}
                    <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex gap-3.5 items-start">
                      <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1 font-sans text-xs text-muted-foreground">
                        <span className="font-bold text-foreground text-sm block">POPIA Protection Statement</span>
                        <p className="leading-relaxed">
                          Ndabas Attorneys acts as a secure legal processing operator under South African privacy guidelines. Your uploaded files are encrypted and utilized solely for deeds registration, notary acts, and counsel trial preparations. We reject third-party data tracking.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                      
                      {/* Signature Pad Drawing Simulation */}
                      <div className="space-y-3">
                        <label className="font-mono text-[10px] tracking-wider text-muted-foreground block">DRAW LEGAL SIGNATURE</label>
                        <div className="bg-background border border-border rounded-2xl overflow-hidden relative shadow-sm">
                          <canvas 
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            width={320}
                            height={160}
                            className="w-full bg-background cursor-crosshair min-h-[160px]"
                          />
                          <button
                            type="button"
                            onClick={clearCanvas}
                            className="absolute bottom-2 right-3 font-mono text-[9px] tracking-widest text-primary hover:text-foreground transition-colors font-bold uppercase"
                          >
                            Clear Pad
                          </button>
                        </div>
                        <span className="text-[9px] text-muted-foreground block font-mono">Use your mouse or touchscreen to sign in the box above.</span>
                      </div>

                      {/* Signature Verification Text */}
                      <div className="space-y-4">
                        <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                          <label>TYPE LEGAL NAME TO SIGN</label>
                          <input 
                            type="text" 
                            value={formData.signatureName}
                            onChange={(e) => setFormData({ ...formData, signatureName: e.target.value })}
                            placeholder="John Sipho Doe" 
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                            required 
                          />
                        </div>

                        {/* POPIA Checkbox */}
                        <div className="flex gap-2.5 items-start font-sans text-xs text-muted-foreground select-none pt-2">
                          <input 
                            type="checkbox" 
                            checked={formData.popiaConsent}
                            onChange={(e) => setFormData({ ...formData, popiaConsent: e.target.checked })}
                            className="mt-0.5 h-3.5 w-3.5" 
                            required 
                            id="popia-onboard" 
                          />
                          <label htmlFor="popia-onboard" className="cursor-pointer leading-tight">
                            I verify that all identity details are legally correct, and I consent to Ndabas Attorneys processing my legal files under the **Protection of Personal Information Act (POPIA)**.
                          </label>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Steps Controls Buttons */}
              <div className="flex justify-between items-center border-t border-border/60 pt-6 mt-6">
                <div>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="font-mono text-[10px] tracking-widest text-muted-foreground hover:text-foreground font-bold flex items-center gap-1 uppercase"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back Step
                    </button>
                  )}
                </div>

                <div>
                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-[10px] tracking-widest font-bold px-6 py-3 rounded-full flex items-center gap-1 uppercase"
                    >
                      Next Step <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!formData.popiaConsent || !hasSigned || !formData.signatureName}
                      className="bg-primary text-primary-foreground font-mono text-[10px] tracking-widest font-bold px-8 py-3.5 rounded-full flex items-center gap-1.5 uppercase shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Onboard Complete
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Niche Features / Business Guidelines section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card/40 border border-border/80 p-8 rounded-3xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
          
          <div className="space-y-4">
            <span className="font-mono text-[9px] tracking-widest text-primary font-bold block uppercase">OUR LEGAL CAPABILITIES</span>
            <h3 className="font-serif text-2xl font-normal text-foreground">Why Onboard with Ndabas Attorneys?</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-sans">
              Ndabas Attorneys, operating from the iconic <strong>Justice House</strong> in Hammanskraal, Pretoria, merges extensive legal pedigree with ultra-modern digital conveniences to fast-track your matters.
            </p>
            <ul className="space-y-3 font-sans text-xs text-muted-foreground pt-1">
              <li className="flex gap-2.5 items-start">
                <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                <span><strong>Direct Deeds Office courier integrations:</strong> Daily submissions and tracking with the Pretoria deeds registry for rapid, delays-free property transfers.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                <span><strong>In-House Notary Public authentication:</strong> Direct drafting and registration of customized Antenuptial Contracts (ANC) and document legalizations.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 justify-between flex flex-col">
            <div className="space-y-3 font-sans text-xs text-muted-foreground">
              <span className="font-mono text-[9px] tracking-widest text-primary font-bold block uppercase">COMPLIANCE & SECURITY</span>
              <p className="leading-relaxed">
                As a fully registered and certified member of the <strong>Legal Practice Council (LPC)</strong> of South Africa, Adv. Ndaba and the staff control panel adhere strictly to supreme professional ethics and security controls.
              </p>
              <div className="bg-background border border-border p-4 rounded-2xl flex gap-3 leading-relaxed text-[11px]">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <strong className="text-foreground block mb-0.5">POPIA Shield Protection</strong>
                  Your personal identity files and FICA document briefs are encrypted in transit and stored locally with zero external trackers.
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
