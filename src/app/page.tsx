'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  ChevronRight, 
  Phone, 
  MessageSquare, 
  Sun, 
  Moon, 
  Award, 
  Users, 
  Clock, 
  MapPin, 
  BookOpen,
  Calendar,
  CheckCircle,
  HelpCircle,
  Menu,
  X,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Attorneys & Litigation',
    message: '',
    popia: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Scroll to Top & FICA precheck states
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activePrecheck, setActivePrecheck] = useState<'property' | 'marriage' | 'litigation'>('property');

  // Case Tracker States
  const [trackerCaseId, setTrackerCaseId] = useState('');
  const [trackedCase, setTrackedCase] = useState<any | null>(null);
  const [trackerError, setTrackerError] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrackCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackerError('');
    setTrackedCase(null);
    setIsTracking(true);

    const enteredId = trackerCaseId.trim().toLowerCase();

    // Check for demo IDs first
    if (enteredId === 'case-1') {
      setTrackedCase({
        id: 'case-1',
        case_number: 'NDB-2026-CASE1',
        client_name: 'Sipho Zuma',
        case_title: 'Property Transfer (Erf 402, Hammanskraal)',
        status: 'In Progress',
        practice_area: 'Conveyancing',
        key_dates: 'Deeds Office Lodgement: 2026-07-28',
        created_at: new Date().toISOString(),
        documents: [
          { name: 'ID_Copy_Zuma.pdf', url: '#', size: '1.2 MB', status: 'Approved', uploaded_at: new Date().toISOString() },
          { name: 'Proof_Of_Address_Zuma.pdf', url: '#', size: '0.8 MB', status: 'Approved', uploaded_at: new Date().toISOString() }
        ]
      });
      setIsTracking(false);
      return;
    } else if (enteredId === 'case-2') {
      setTrackedCase({
        id: 'case-2',
        case_number: 'NDB-2026-CASE2',
        client_name: 'Lerato & Kabelo Modise',
        case_title: 'Antenuptial Contract (Marriage Out of Community)',
        status: 'Awaiting Documents',
        practice_area: 'Notary Services',
        key_dates: 'Signing Appointment: 2026-07-22 @ 11:30',
        created_at: new Date().toISOString(),
        documents: [
          { name: 'Draft_ANC_Contract.pdf', url: '#', size: '2.1 MB', status: 'Pending', uploaded_at: new Date().toISOString() }
        ]
      });
      setIsTracking(false);
      return;
    } else if (enteredId === 'case-3') {
      setTrackedCase({
        id: 'case-3',
        case_number: 'NDB-2026-CASE3',
        client_name: 'Mokoena Holdings Pty Ltd',
        case_title: 'Partnership Dispute Resolution',
        status: 'Open',
        practice_area: 'Attorneys & Litigation',
        key_dates: 'Pre-trial Conference: 2026-08-05',
        created_at: new Date().toISOString(),
        documents: []
      });
      setIsTracking(false);
      return;
    }

    try {
      const casesList = await db.getCases();
      const match = casesList.find(c => 
        (c.case_number && c.case_number.toLowerCase() === enteredId) ||
        (c.id.toLowerCase() === enteredId)
      );
      
      if (match) {
        setTrackedCase(match);
      } else {
        setTrackerError('Case Number not found. Please enter a valid Case Number (e.g. NDB-2026-1001) or a demo ID.');
      }
    } catch (err: any) {
      console.error('Error tracking case:', err);
      setTrackerError(`Live Sync Error: ${err.message || String(err)}`);
    } finally {
      setIsTracking(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.insertLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        service_type: formData.service,
        message: formData.message
      });
      setIsSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Attorneys & Litigation',
        message: '',
        popia: false
      });
    } catch (err) {
      console.error('Error submitting lead:', err);
    }
  };

  const services = [
    {
      title: "ATTORNEYS",
      description: "Comprehensive litigation, corporate legal representation, and legal advisory.",
      href: "/services/attorneys",
      bgGradient: "from-amber-100 to-rose-100 dark:from-amber-950/20 dark:to-rose-950/20",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "CONVEYANCING",
      description: "Expert property transfers, deed registration, and real estate transactions.",
      href: "/services/conveyancing",
      bgGradient: "from-rose-100 to-purple-100 dark:from-rose-950/20 dark:to-purple-950/20",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "NOTARY SERVICES",
      description: "Antenuptial contracts, authentication of legal documents, and official acts.",
      href: "/services/notary",
      bgGradient: "from-purple-100 to-indigo-100 dark:from-purple-950/20 dark:to-indigo-950/20",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=400&auto=format&fit=crop"
    },
    {
      title: "ADVOCACY",
      description: "High-court counsel representation and specialized trial advocacy.",
      href: "/services/advocacy",
      bgGradient: "from-indigo-100 to-blue-100 dark:from-indigo-950/20 dark:to-blue-950/20",
      image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=400&auto=format&fit=crop"
    }
  ];

  const trustStats = [
    { label: "ATTORNEYS & NOTARIES", value: "LPC Registered" },
    { label: "COMMUNITY FIRST", value: "Hammanskraal Local" },
    { label: "COMBINED EXPERTISE", value: "Conveyancers & Advocates" }
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
      
      {/* Soft Prismatic Glow behind Hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[600px] pointer-events-none overflow-hidden select-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lavender/30 via-accent/25 to-transparent dark:from-lavender/10 dark:via-accent/5 dark:to-transparent blur-[120px] rounded-full"></div>
      </div>

      {/* 1. FLOATING PILL-SHAPED NAVBAR */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-36 pb-20 px-4 max-w-5xl mx-auto flex flex-col items-center text-center z-10 select-none">
        
        {/* Eyebrow badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border border-border/80 bg-card/65 backdrop-blur-sm px-4 py-1.5 rounded-full font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-muted-foreground mb-8"
        >
          ATTORNEYS · CONVEYANCERS · NOTARIES · ADVOCATES
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.1] max-w-3xl text-foreground mb-6"
        >
          Legal guidance <span className="bg-gradient-to-r from-primary via-lavender to-accent bg-clip-text text-transparent font-semibold">worthy</span> of your trust
        </motion.h1>

        {/* Subhead */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-10 font-sans"
        >
          Ndabas Attorneys brings property law, conveyancing, notary services, and high-court advocacy together to provide premium legal support in Hammanskraal, Pretoria, and Gauteng.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-16"
        >
          <a 
            href="/contact" 
            className="w-full sm:w-auto bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-xs tracking-widest font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
          >
            BOOK CONSULTATION <ChevronRight className="h-4 w-4" />
          </a>

          <a 
            href="/fees#calculator" 
            className="w-full sm:w-auto border border-primary/80 hover:bg-primary/5 text-primary font-mono text-xs tracking-widest font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm bg-card/10 backdrop-blur-sm"
          >
            CALCULATE FEES <ChevronRight className="h-4 w-4" />
          </a>
        </motion.div>

        {/* Direct Channels Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground border border-border/85 px-5 py-2.5 rounded-full bg-card/25 backdrop-blur-sm mb-16 shadow-sm"
        >
          <a href="tel:0127110427" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <Phone className="h-3 w-3 text-primary" /> CALL FIRM (012 711 0427)
          </a>
          <span>·</span>
          <a href="https://wa.me/27734783775" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <MessageSquare className="h-3 w-3 text-green-500 animate-pulse" /> WHATSAPP CHAT
          </a>
        </motion.div>

        {/* Hero Office/Practice image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full border border-border/80 bg-card rounded-3xl overflow-hidden shadow-sm h-[200px] sm:h-[350px] relative mb-16 selection:pointer-events-none"
        >
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" 
            alt="Justice House Chambers Pretoria"
            className="w-full h-full object-cover opacity-85 dark:opacity-40 hover:scale-[1.01] transition-transform duration-700 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-6 text-left space-y-0.5 font-mono text-[9px] tracking-widest text-muted-foreground">
            <span className="font-bold text-foreground uppercase block text-[11px] font-sans">Justice House Chambers</span>
            <span>PRETORIA, GAUTENG · PRIMARY CHANCERY</span>
          </div>
        </motion.div>

        {/* 3. PRACTICE AREA HORIZONTAL RAIL */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          id="services"
          className="w-full"
        >
          <div className="flex flex-col items-start text-left mb-6">
            <span className="font-mono text-[10px] tracking-widest text-primary font-bold">PRACTICE AREAS</span>
            <div className="h-[1px] w-12 bg-primary mt-1"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full text-left">
            {services.map((svc, sIdx) => (
              <a 
                href={svc.href}
                key={sIdx}
                className="group relative block bg-card hover:bg-card/95 border border-border/60 rounded-3xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden"
              >
                {/* Background image textured overlay */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={svc.image} 
                    alt={svc.title}
                    className="w-full h-full object-cover opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] group-hover:scale-105 transition-all duration-500 select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
                </div>

                {/* Visual Glow behind card */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${svc.bgGradient} blur-2xl rounded-full opacity-35 group-hover:opacity-60 transition-opacity z-0`}></div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                  <div className="font-serif text-sm tracking-widest font-bold text-muted-foreground group-hover:text-primary transition-colors">
                    {svc.title}
                  </div>
                  <div className="space-y-2">
                    <p className="text-foreground text-xs sm:text-[13px] leading-relaxed line-clamp-3">
                      {svc.description}
                    </p>
                    <span className="font-mono text-[10px] tracking-widest text-primary inline-flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300 pt-2">
                      EXPLORE <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* 4. TRUST BAR */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="w-full border-t border-border mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-3 font-serif text-lg font-bold">
            <Award className="h-6 w-6 text-primary" />
            <span className="text-foreground text-sm tracking-widest">JUSTICE HOUSE · EST. HAMMANSKRAAL</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {trustStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="font-serif font-bold text-base text-foreground tracking-wide">{stat.value}</span>
                <span className="font-mono text-[9px] tracking-widest text-muted-foreground mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </section>

      {/* 5. ABOUT FIRM BRIEF */}
      <section id="about" className="py-20 bg-card/30 dark:bg-card/10 border-y border-border px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">OUR FOUNDATION</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
              A modern firm anchored in community and authority.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Operating from the prominent \"Justice House\" in Hammanskraal, Ndabas Attorneys brings elite-grade legal representation directly to the local community. We reject complex, corporate abstractions in favor of calm, transparent, and approachable client care.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 font-mono text-[11px] tracking-widest">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" /> LPC REGISTERED
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" /> BILINGUAL ADVOCATES
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" /> LOCAL COUNSEL
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" /> CONVEYANCERS
              </div>
            </div>
          </div>

          {/* Interactive Card */}
          <div className="bg-card border border-border p-8 rounded-3xl shadow-sm font-mono text-xs select-none space-y-6 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-lavender/10 to-accent/15 blur-2xl rounded-full"></div>
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <span className="text-primary font-bold">VISIT JUSTICE HOUSE</span>
                <h3 className="font-serif text-lg font-bold text-foreground mt-1">Hammanskraal Office</h3>
              </div>
              <div className="space-y-3 font-sans text-xs">
                <div className="flex gap-2.5 items-start">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">2208C Block AA Portion 9, Hammanskraal, Gauteng</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Mon - Fri: 08:00 - 16:30</span>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Tel: 012 711 0427 <br />Cell: 082 490 6285 / 073 478 3775</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/40">
              <a href="/offices" className="text-primary font-mono text-[9px] tracking-widest font-bold inline-flex items-center gap-1 hover:translate-x-1.5 transition-transform duration-300 cursor-pointer">
                VIEW OFFICE DIRECTIONS & OPERATIONS <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: REGULATORY STANDARDS & COMPLIANCE RESOURCE HUB */}
      <section className="py-20 bg-background border-b border-border px-4 select-none">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">COMPLIANCE & LEGAL RESOURCE HUB</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground">Firm Certification & Standards</h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans">
              Ndabas Attorneys adheres strictly to statutory legal regulations, audits, and professional guidelines established by South African judicial authorities at Justice House.
            </p>
            <div className="h-[1px] w-12 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Card 1: LPC */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group cursor-default"
            >
              <div className="space-y-4">
                <div className="p-2.5 bg-background border border-border/60 rounded-xl w-fit group-hover:border-primary/20 transition-all">
                  <Award className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-foreground text-[13px] leading-snug">LPC Regulatory Compliance</h3>
                  <p className="text-muted-foreground text-[11px] leading-relaxed font-sans">
                    Fully registered under the South African Legal Practice Council. We carry indemnity coverage and maintain annual trust audits.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-border/40 mt-4">
                <a href="/lpc-compliance" className="text-primary font-mono text-[9px] tracking-widest font-bold inline-flex items-center gap-1 hover:translate-x-1 transition-transform cursor-pointer">
                  READ STANDARDS <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* Card 2: Deeds */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group cursor-default"
            >
              <div className="space-y-4">
                <div className="p-2.5 bg-background border border-border/60 rounded-xl w-fit group-hover:border-primary/20 transition-all">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-foreground text-[13px] leading-snug">Pretoria Deeds Office Rules</h3>
                  <p className="text-muted-foreground text-[11px] leading-relaxed font-sans">
                    Daily physical deeds submissions and SARS conveyancing clearance workflows for rapid property transfer registrations.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-border/40 mt-4">
                <a href="/deeds-registry" className="text-primary font-mono text-[9px] tracking-widest font-bold inline-flex items-center gap-1 hover:translate-x-1 transition-transform cursor-pointer">
                  READ DEEDS PROCESS <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* Card 3: FICA */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group cursor-default"
            >
              <div className="space-y-4">
                <div className="p-2.5 bg-background border border-border/60 rounded-xl w-fit group-hover:border-primary/20 transition-all">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-foreground text-[13px] leading-snug">FICA Client Identification</h3>
                  <p className="text-muted-foreground text-[11px] leading-relaxed font-sans">
                    Mandatory legal identification rules for individuals, companies, and trusts. Mandatory verification before file opening.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-border/40 mt-4">
                <a href="/fica-rules" className="text-primary font-mono text-[9px] tracking-widest font-bold inline-flex items-center gap-1 hover:translate-x-1 transition-transform cursor-pointer">
                  READ FICA CARD <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* Card 4: POPIA */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300 flex flex-col justify-between group cursor-default"
            >
              <div className="space-y-4">
                <div className="p-2.5 bg-background border border-border/60 rounded-xl w-fit group-hover:border-primary/20 transition-all">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-foreground text-[13px] leading-snug">POPIA Shield Privacy Ledger</h3>
                  <p className="text-muted-foreground text-[11px] leading-relaxed font-sans">
                    Complete data protection with local browser encryption and automatic compliance logging of all document access.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-border/40 mt-4">
                <a href="/popia-policy" className="text-primary font-mono text-[9px] tracking-widest font-bold inline-flex items-center gap-1 hover:translate-x-1 transition-transform cursor-pointer">
                  READ PRIVACY REGIME <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE FICA PRE-CHECKER */}
      <section className="py-20 px-4 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">FICA PLANNER</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground animate-fade-in">Interactive Document Planner</h2>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Select your upcoming transaction to instantly map out the exact certified files and certifications required by South African Law before our first consultation.
          </p>
        </div>

        {/* Matter Type Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 font-mono text-[10px] tracking-wider">
          <button 
            onClick={() => setActivePrecheck('property')}
            className={`px-5 py-2.5 border rounded-full transition-all font-bold cursor-pointer ${activePrecheck === 'property' ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20' : 'bg-card border-border hover:bg-border/20 text-muted-foreground hover:text-foreground'}`}
          >
            BUYING/SELLING HOME
          </button>
          <button 
            onClick={() => setActivePrecheck('marriage')}
            className={`px-5 py-2.5 border rounded-full transition-all font-bold cursor-pointer ${activePrecheck === 'marriage' ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20' : 'bg-card border-border hover:bg-border/20 text-muted-foreground hover:text-foreground'}`}
          >
            MARRIAGE CONTRACTS
          </button>
          <button 
            onClick={() => setActivePrecheck('litigation')}
            className={`px-5 py-2.5 border rounded-full transition-all font-bold cursor-pointer ${activePrecheck === 'litigation' ? 'bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20' : 'bg-card border-border hover:bg-border/20 text-muted-foreground hover:text-foreground'}`}
          >
            CIVIL DISPUTES
          </button>
        </div>

        {/* Precheck display panel */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activePrecheck}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border p-6 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-lavender/5 to-accent/10 blur-2xl rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
              
              <div className="space-y-4">
                <span className="font-mono text-[9px] tracking-widest text-primary font-bold block uppercase">PRE-CHECKLIST GENERATED</span>
                <h3 className="font-serif text-2xl font-normal text-foreground leading-snug">
                  {activePrecheck === 'property' && "Conveyancing & Deeds Registration Files"}
                  {activePrecheck === 'marriage' && "Antenuptial Act Marriage Certifications"}
                  {activePrecheck === 'litigation' && "Civil Claims summons & Pleadings Brief"}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-sans">
                  {activePrecheck === 'property' && "Our Hammanskraal conveyancing division requires these documents to request rates clearances from the municipality and lodge transfer files at the Pretoria Deeds Registry."}
                  {activePrecheck === 'marriage' && "To draft and sign your ANC contract with accrual benefits before your wedding day, our Notary Public requires identity files for both partners."}
                  {activePrecheck === 'litigation' && "For contract breaches, corporate disputes, or claims in the Magistrates or High Court, Adv. Ndaba requires certified transaction histories."}
                </p>
                <div className="pt-2">
                  <a 
                    href={
                      activePrecheck === 'property' ? '/onboard?matter=conveyancing' :
                      activePrecheck === 'marriage' ? '/onboard?matter=notary' :
                      '/onboard?matter=litigation'
                    } 
                    className="inline-flex bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-[10px] tracking-widest font-bold px-6 py-3 rounded-full hover:opacity-95 shadow-sm transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    ONBOARD WITH THESE FILES →
                  </a>
                </div>
              </div>

              {/* Checklist visual display */}
              <div className="space-y-2.5 font-sans text-xs">
                {activePrecheck === 'property' && [
                  { t: "Offer to Purchase (Deed of Sale)", d: "Must be signed by buyer and seller with full witness certified." },
                  { t: "FICA Residence Statement", d: "Utility statement or home account under 3 months old." },
                  { t: "Certified Identity Copies", d: "Color smart card or ID pages front and back." },
                  { t: "SARS/Income Tax Numbers", d: "Verification copies needed for transfer duty receipts." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-background border border-border/65 p-3.5 rounded-2xl flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground font-bold block">{item.t}</strong>
                      <span className="text-muted-foreground text-[11px] leading-relaxed block mt-0.5">{item.d}</span>
                    </div>
                  </div>
                ))}

                {activePrecheck === 'marriage' && [
                  { t: "Dual Identity Declarations", d: "Smart cards or legal passports for both marrying parties." },
                  { t: "Proof of Address details", d: "Certified municipality statements under 3 months." },
                  { t: "Prior Marital Decrees", d: "Divorce settlement acts if either spouse was married before." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-background border border-border/65 p-3.5 rounded-2xl flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground font-bold block">{item.t}</strong>
                      <span className="text-muted-foreground text-[11px] leading-relaxed block mt-0.5">{item.d}</span>
                    </div>
                  </div>
                ))}

                {activePrecheck === 'litigation' && [
                  { t: "Breach Correspondence", d: "Signed agreements, demand letters, or emails detailing the dispute." },
                  { t: "Payment & Transaction ledger", d: "Proof of banking transfers or supplier receipts." },
                  { t: "Certified Smart ID copies", d: "Sufficiently clear scan certified within the last 90 days." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-background border border-border/65 p-3.5 rounded-2xl flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground font-bold block">{item.t}</strong>
                      <span className="text-muted-foreground text-[11px] leading-relaxed block mt-0.5">{item.d}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 7. PREMIUM MATTERS LIFECYCLE (PROCESS STEPS TIMELINE) */}
      <section className="py-20 border-y border-border bg-card/10 dark:bg-card/5">
        <div className="max-w-5xl mx-auto px-4 space-y-16">
          <div className="text-center space-y-3">
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">CASE STAGES</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground">The Matter Lifecycle Map</h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              We coordinate our processes dynamically. See how your deeds transfer or litigation brief is managed from discovery to final lodge.
            </p>
          </div>

          {/* Stepper Timeline row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="space-y-4 font-mono text-xs text-left bg-card border border-border p-6 rounded-3xl relative shadow-sm hover:shadow-md transition-shadow">
              <span className="text-primary font-bold text-sm">01</span>
              <div className="h-[1px] w-8 bg-primary/60 mt-1"></div>
              <div className="space-y-1">
                <span className="font-bold text-foreground text-sm font-sans block pt-2">Initial Brief</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed font-sans pt-1">
                  Access the portal or dial direct cell. Provide basic matter outline and target dates.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 font-mono text-xs text-left bg-card border border-border p-6 rounded-3xl relative shadow-sm hover:shadow-md transition-shadow">
              <span className="text-primary font-bold text-sm">02</span>
              <div className="h-[1px] w-8 bg-primary/60 mt-1"></div>
              <div className="space-y-1">
                <span className="font-bold text-foreground text-sm font-sans block pt-2">FICA Onboard</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed font-sans pt-1">
                  Complete your digital onboarding. Review checklists and schedule your consultation slot.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 font-mono text-xs text-left bg-card border border-border p-6 rounded-3xl relative shadow-sm hover:shadow-md transition-shadow">
              <span className="text-primary font-bold text-sm">03</span>
              <div className="h-[1px] w-8 bg-primary/60 mt-1"></div>
              <div className="space-y-1">
                <span className="font-bold text-foreground text-sm font-sans block pt-2">File Drafting</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed font-sans pt-1">
                  Our conveyancers and public notary compile deeds, clear municipal rates, and draft transfer deeds.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="space-y-4 font-mono text-xs text-left bg-card border border-border p-6 rounded-3xl relative shadow-sm hover:shadow-md transition-shadow">
              <span className="text-primary font-bold text-sm">04</span>
              <div className="h-[1px] w-8 bg-primary/60 mt-1"></div>
              <div className="space-y-1">
                <span className="font-bold text-foreground text-sm font-sans block pt-2">Deed Lodgement</span>
                <p className="text-muted-foreground text-[11px] leading-relaxed font-sans pt-1">
                  Files are formally lodged at the Pretoria Deeds Registry or court, and registrations completed.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. ELEVATED TEAM SPOTLIGHT */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[380px] h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
            
            <div className="space-y-6 relative z-10 font-mono text-xs h-full flex flex-col justify-between">
              
              {/* Flex Grid of portrait and details */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" 
                  alt="Advocate Ndaba"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-border shadow-sm shrink-0"
                />
                <div className="space-y-1.5 flex-grow">
                  <div className="border-b border-border pb-3 text-left">
                    <span className="text-primary font-bold uppercase tracking-widest text-[8px]">DIRECTOR & FOUNDER</span>
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground mt-1">Advocate Ndaba</h3>
                    <p className="text-muted-foreground text-[10px] tracking-wider mt-1 uppercase font-mono">Admitted Advocate & Conveyancer</p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-xs leading-relaxed font-sans text-left">
                Advocate Ndaba manages and directs litigation files, conveyancing transfers, and antenuptial acts at Justice House. With extensive legal practice credentials, Adv. Ndaba provides accessible bilingual representation across Pretoria and Gauteng.
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[9px] tracking-wide text-muted-foreground pt-4 border-t border-border/60 text-left">
                <div>
                  <strong className="text-foreground block text-[8px] tracking-widest uppercase mb-0.5">LPC REGISTRATION</strong>
                  <span>Admitted High Court Counsel</span>
                </div>
                <div>
                  <strong className="text-foreground block text-[8px] tracking-widest uppercase mb-0.5">LANGUAGES SERVED</strong>
                  <span>Sotho · Tswana · Zulu · English</span>
                </div>
              </div>

            </div>
          </div>

          <div className="space-y-6">
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">PRACTITIONER COUNSEL</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-foreground">
              Empathetic counsel backed by legal authority.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-sans">
              We believe legal transactions shouldn't feel alienating. Advocate Ndaba coordinates our staff with local bilingual expertise so that every contract, rates clearance, and civil claim is clearly explained to you step-by-step.
            </p>
            <div className="pt-2 font-mono text-xs">
              <a href="/about" className="text-primary hover:text-foreground transition-colors font-bold tracking-wider uppercase border-b border-primary pb-1">
                LEARN MORE ABOUT COUNSEL →
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* NEW: INFINITE TESTIMONIAL MARQUEE (NO HORIZONTAL SCROLL) */}
      <section className="py-20 border-t border-border bg-card/5 select-none overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4 mb-12">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block uppercase">CLIENT EXPERIENCES</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground">What Our Clients Say</h2>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            Read verified reviews from clients across Pretoria silver lakes and Hammanskraal who registered properties or trusts with our firm.
          </p>
          <div className="h-[1px] w-12 bg-primary mx-auto"></div>
        </div>

        {/* Marquee container with absolute mask gradients */}
        <div className="relative w-full overflow-hidden flex items-center">
          
          {/* Elegant Left/Right Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Row using Framer Motion */}
          <motion.div 
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 25,
              repeat: Infinity
            }}
          >
            {[
              {
                name: "Naledi Dlamini",
                role: "Pretoria East Homeowner",
                text: "Ndabas Attorneys handled my conveyancing transfer in Hammanskraal with absolute precision. Registered in 7 weeks! Transparent fees throughout.",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
              },
              {
                name: "Johan Groenewald",
                role: "Silver Lakes Newlywed",
                text: "Adv. Ndaba drafted our Antenuptial Contract at Justice House. The advice on the Accrual System was incredibly clear. Excellent notary service.",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop"
              },
              {
                name: "Thabo Mokoena",
                role: "Director, Mokoena Holdings",
                text: "Stunning CRM tracking on the site! Being able to verify our litigation files and check milestones in real-time is revolutionary for local firms.",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop"
              },
              {
                name: "Zanele Sithole",
                role: "Hammanskraal Litigant",
                text: "We briefed Adv. Ndaba for a regional court dispute and were impressed by his bilingual mastery and trial presence. Reliable and expert counsel.",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
              }
            ].concat([
              {
                name: "Naledi Dlamini",
                role: "Pretoria East Homeowner",
                text: "Ndabas Attorneys handled my conveyancing transfer in Hammanskraal with absolute precision. Registered in 7 weeks! Transparent fees throughout.",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
              },
              {
                name: "Johan Groenewald",
                role: "Silver Lakes Newlywed",
                text: "Adv. Ndaba drafted our Antenuptial Contract at Justice House. The advice on the Accrual System was incredibly clear. Excellent notary service.",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop"
              },
              {
                name: "Thabo Mokoena",
                role: "Director, Mokoena Holdings",
                text: "Stunning CRM tracking on the site! Being able to verify our litigation files and check milestones in real-time is revolutionary for local firms.",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop"
              },
              {
                name: "Zanele Sithole",
                role: "Hammanskraal Litigant",
                text: "We briefed Adv. Ndaba for a regional court dispute and were impressed by his bilingual mastery and trial presence. Reliable and expert counsel.",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
              }
            ]).map((item, idx) => (
              <div 
                key={idx}
                className="w-[280px] sm:w-[350px] bg-card border border-border p-6 rounded-3xl shadow-sm flex flex-col justify-between gap-6 shrink-0 relative overflow-hidden group select-none hover:border-primary/25 transition-colors text-left"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lavender/5 to-accent/5 blur-xl rounded-full"></div>
                <p className="text-muted-foreground text-xs leading-relaxed font-sans italic relative z-10">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="flex items-center gap-3.5 relative z-10 border-t border-border/50 pt-4">
                  <img 
                    src={item.img} 
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-primary/20 shrink-0"
                  />
                  <div className="space-y-0.5 font-sans">
                    <span className="font-bold text-foreground text-xs block">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground block">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* NEW: CLIENT CASE MATTER TRACKER (LIVE SUPABASE SYNC) */}
      <section id="tracker" className="py-20 px-4 border-t border-border bg-card/10 select-none">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block uppercase">Live Status Tracking</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-foreground">Digital Case Matter Tracker</h2>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Input your unique Case ID or Matter Number below to query live files, FICA approval checkpoints, or deeds registry registration status instantly from our secure cloud servers.
            </p>
            <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
          </div>

          <div className="bg-card border border-border p-6 sm:p-10 rounded-3xl shadow-sm relative overflow-hidden max-w-3xl mx-auto">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
            
            <form onSubmit={handleTrackCase} className="space-y-6 max-w-xl mx-auto text-center relative z-10">
              <div className="space-y-2 font-mono text-[10px] text-muted-foreground text-left">
                <label className="uppercase tracking-widest block font-bold">ENTER CASE ID / MATTER NUMBER</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={trackerCaseId}
                    onChange={(e) => setTrackerCaseId(e.target.value)}
                    placeholder="e.g. case-1 or your custom ID"
                    className="flex-grow bg-background border border-border rounded-2xl px-5 py-4 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isTracking}
                    className="bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-xs tracking-widest font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    {isTracking ? 'Searching...' : 'Track Case'}
                  </button>
                </div>
              </div>

              {trackerError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-mono text-left select-none">
                  {trackerError}
                </div>
              )}

              <p className="text-[10px] text-muted-foreground/80 leading-relaxed font-sans text-left">
                * Note: Standard demonstration IDs are seeded as <strong className="text-foreground">case-1</strong> (Property Transfer), <strong className="text-foreground">case-2</strong> (ANC drafting), and <strong className="text-foreground">case-3</strong> (Partnership dispute). Feel free to type these in to preview the tracking experience.
              </p>
            </form>

            {/* Timelines Animation results */}
            <AnimatePresence>
              {trackedCase && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="mt-10 border-t border-border/80 pt-10 space-y-8 relative z-10"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs text-muted-foreground">
                    <div className="space-y-1 bg-background/50 border border-border p-4 rounded-2xl">
                      <span className="font-bold text-foreground text-[10px] block uppercase text-primary">MATTER TYPE</span>
                      <span className="font-serif text-sm font-bold text-foreground block">{trackedCase.case_title}</span>
                    </div>
                    <div className="space-y-1 bg-background/50 border border-border p-4 rounded-2xl">
                      <span className="font-bold text-foreground text-[10px] block uppercase text-primary">CLIENT REPRESENTATIVE</span>
                      <span className="font-serif text-sm font-bold text-foreground block">{trackedCase.client_name}</span>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="space-y-4">
                    <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                      <span>CURRENT MILESTONE STATUS</span>
                      <span className="text-primary font-bold uppercase">{trackedCase.status}</span>
                    </div>
                    
                    <div className="h-2 bg-border rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ 
                          width: `${
                            trackedCase.status === 'Open' ? 25 :
                            trackedCase.status === 'Awaiting Documents' ? 50 :
                            trackedCase.status === 'In Progress' ? 75 :
                            trackedCase.status === 'Complete' ? 100 : 10
                          }%` 
                        }}
                      ></div>
                    </div>

                    {/* Milestone check indicators */}
                    <div className="grid grid-cols-4 gap-2 font-mono text-[9px] text-center text-muted-foreground pt-1.5 leading-tight">
                      <div className={trackedCase.status !== 'Pending' ? 'text-primary font-bold' : ''}>
                        <span>1. FILE OPENED</span>
                      </div>
                      <div className={['Awaiting Documents', 'In Progress', 'Complete'].includes(trackedCase.status) ? 'text-primary font-bold' : ''}>
                        <span>2. FICA APPROVED</span>
                      </div>
                      <div className={['In Progress', 'Complete'].includes(trackedCase.status) ? 'text-primary font-bold' : ''}>
                        <span>3. IN PROGRESS</span>
                      </div>
                      <div className={trackedCase.status === 'Complete' ? 'text-primary font-bold' : ''}>
                        <span>4. COMPLETED</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline note */}
                  <div className="bg-background/60 border border-border p-4.5 rounded-2xl flex gap-3 text-xs leading-relaxed text-muted-foreground font-sans">
                    <Info className="h-5 w-5 text-primary shrink-0" />
                    <div className="space-y-1">
                      <span className="font-bold text-foreground block">Key Milestone Tracking Notes:</span>
                      <span><strong>Key Timelines/Action:</strong> {trackedCase.key_dates || 'First consultation scheduled'}</span>
                      <p className="text-[11px] pt-1">
                        If your file shows "Awaiting Documents", please ensure your certified color ID card and municipal physical utility bill have been successfully uploaded through our Onboarding wizard.
                      </p>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* 9. ONBOARDING HIGH-IMPACT FINAL CALL TO ACTION (REPLACES REDUNDANT FORM) */}
      <section className="py-20 px-4 bg-foreground text-background dark:bg-card dark:text-foreground border-t border-border relative overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-lavender/10 to-accent/20 blur-3xl rounded-full opacity-60"></div>
        
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary dark:text-primary font-bold block">READY TO COMMENCE?</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight">Onboard Seamlessly Online</h2>
          <p className="text-muted-foreground dark:text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Skip the manual paper delays. Register your FICA personal profile, choose your matter category, review required certified document checklists, and schedule your appointment slot directly into our secure staff control panels.
          </p>
          <div className="pt-4">
            <a 
              href="/onboard" 
              className="inline-flex bg-background text-foreground dark:bg-foreground dark:text-background font-mono text-xs tracking-widest font-bold px-10 py-4 rounded-full hover:opacity-90 shadow-md shadow-black/10 transition-opacity"
            >
              BEGIN DIGITAL ONBOARDING
            </a>
          </div>
          <div className="text-[10px] tracking-widest font-mono text-muted-foreground/85 dark:text-muted-foreground">
            POPIA PRIVACY COMPLIANT · SECURE SSL TRANSMISSION
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <Footer />

      {/* 11. FLOATING SCROLL-TO-TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-card border border-border hover:bg-border/20 text-foreground rounded-full shadow-lg cursor-pointer transition-colors"
            title="Scroll to Top"
          >
            <ChevronRight className="h-4 w-4 -rotate-90 text-primary" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
