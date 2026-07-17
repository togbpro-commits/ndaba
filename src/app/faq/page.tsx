'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  Home, 
  Award, 
  Scale, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const categories = [
    { 
      id: 'property', 
      label: 'Property & Conveyancing', 
      desc: 'Deeds Office transfers, costs, and timings.',
      icon: <Home className="h-5 w-5 text-primary shrink-0" />
    },
    { 
      id: 'notary', 
      label: 'Notary & Marriage Contracts', 
      desc: 'Antenuptial contracts (ANC) and notarization.',
      icon: <Award className="h-5 w-5 text-primary shrink-0" />
    },
    { 
      id: 'litigation', 
      label: 'Attorneys & Civil Litigation', 
      desc: 'Court actions, summonses, and trial counsel.',
      icon: <Scale className="h-5 w-5 text-primary shrink-0" />
    },
    { 
      id: 'compliance', 
      label: 'FICA, LPC & POPIA Compliance', 
      desc: 'Regulatory registration and data protection.',
      icon: <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
    }
  ];

  const faqs = [
    // PROPERTY
    {
      category: 'property',
      q: "How long does a standard property transfer take?",
      a: "A standard conveyancing transfer in South Africa generally takes 6 to 10 weeks. This includes obtaining Rates Clearance Certificates from the local municipality, Transfer Duty receipts from SARS, and lodging the transfer deeds for registration at the Pretoria Deeds Registry. Minor administrative delays may occur if bank bond cancellations are pending."
    },
    {
      category: 'property',
      q: "What are transfer duties and who is responsible for paying them?",
      a: "Transfer Duty is a statutory tax levied by SARS on the acquisition of property. It is payable by the buyer on properties valued above R1,100,000 (according to current South African tax brackets). Properties below this threshold are exempt from transfer duty, though standard conveyancer fees still apply."
    },
    {
      category: 'property',
      q: "Can a signed Offer to Purchase (OTP) be cancelled?",
      a: "An Offer to Purchase is a legally binding contract once signed by both buyer and seller. It can only be cancelled without penalty if a suspensive condition (such as securing a home loan or selling an existing property) is not met within the agreed timeframe. Otherwise, cancellation may constitute breach of contract, making the defaulting party liable for damages or agent commission."
    },

    // NOTARY
    {
      category: 'notary',
      q: "What is an Antenuptial Contract (ANC) and why do I need one?",
      a: "An Antenuptial Contract (ANC) is a notary-drafted agreement signed prior to marriage. It determines whether your marriage will be Out of Community of Property (with or without the Accrual system). Without a signed and registered ANC, your marriage defaults to 'In Community of Property' in South African law, merging all assets and liabilities into a single joint estate."
    },
    {
      category: 'notary',
      q: "What is the Accrual System and how does it protect spouses?",
      a: "Under the Accrual System, assets built up during the marriage are shared 50/50 upon divorce or death, while assets owned before the marriage remain separate (along with any explicitly excluded inheritances). This is widely considered the most equitable marital regime as it protects the financially weaker spouse while maintaining asset independence."
    },
    {
      category: 'notary',
      q: "How much does it cost to register an ANC at the Deeds Office?",
      a: "Registering an Antenuptial Contract involves professional notary drafting fees and a nominal Deeds Office statutory registration fee. At Ndabas Attorneys, we offer transparent, fixed notary packages that include consultation, contract compilation, signing at Justice House, and registration at the Pretoria Deeds Registry."
    },

    // LITIGATION
    {
      category: 'litigation',
      q: "What is civil litigation and how do I initiate a claim?",
      a: "Civil litigation is the legal process of resolving non-criminal disputes between individuals or businesses. To initiate a claim, our trial practitioners will draft a Letter of Demand followed by a Summons or Application, which is formally served on the defendant by the Sheriff of the Court. If undefended, default judgment can be requested; if defended, the matter proceeds to trial preparation."
    },
    {
      category: 'litigation',
      q: "How are legal fees calculated at Ndabas Attorneys?",
      a: "We adhere strictly to Legal Practice Council (LPC) guidelines. Fees are calculated either on an hourly rate, a fixed-package mandate (typical for conveyancing and notary contracts), or according to statutory court tariffs. We provide a comprehensive, transparent Mandate and Fee Agreement upfront so you are never surprised by unexpected bills."
    },
    {
      category: 'litigation',
      q: "What is the difference between an Attorney and Advocacy Counsel?",
      a: "An Attorney is your primary point of contact who drafts pleadings, compiles your file, and manages trust accounts. An Advocate (or Counsel) is a specialist litigator instructed by your attorney to present your case in the High Court, write formal legal opinions, and provide advanced trial advocacy. At Ndabas Attorneys, Adv. Ndaba functions as in-house counsel, merging these roles to save you dual instruction fees."
    },

    // COMPLIANCE
    {
      category: 'compliance',
      q: "What documents must I bring to satisfy South African FICA?",
      a: "To satisfy the Financial Intelligence Centre Act (FICA), you must bring: 1) A clear, color certified copy of your South African ID book or smart card, 2) Recent proof of residential address under 3 months old (e.g. utility bill, cell account, or lease agreement), and 3) Your SARS tax registration number. This verification is mandatory before we can open any trust files."
    },
    {
      category: 'compliance',
      q: "Is Ndabas Attorneys fully compliant with the Legal Practice Council?",
      a: "Yes. Ndabas Attorneys is fully registered and compliant with the Legal Practice Council (LPC) of South Africa. Our trust accounts are audited annually by independent certified public auditors, and our practitioners carry comprehensive professional indemnity insurance through the LPIIF to ensure absolute client security."
    },
    {
      category: 'compliance',
      q: "How is my personal information protected under POPIA?",
      a: "We treat your privacy with extreme seriousness. Under the Protection of Personal Information Act (POPIA), all client data, case briefs, and uploaded files are stored in an encrypted environment. We do not use third-party tracking pixels or cookies, and we never share or sell client details. Your data is handled solely for your specific legal mandate."
    }
  ];

  const [activeCategory, setActiveCategory] = useState('property');
  const [expandedFaq, setExpandedFaq] = useState<Record<string, boolean>>({});

  const toggleFaq = (questionText: string) => {
    setExpandedFaq(prev => ({
      ...prev,
      [questionText]: !prev[questionText]
    }));
  };

  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between relative">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-5xl mx-auto w-full space-y-12 select-none">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">ANSWERS & INTEL</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Gain immediate clarity on property transfers, antenuptial notary contracts, litigation procedures, and regulatory FICA guidelines at Justice House.
          </p>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </div>

        {/* 2-Column Responsive Layout for stable heights */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Left: Category Nav Card list (Fixed side panel on desktop) */}
          <div className="md:col-span-4 space-y-3.5">
            <span className="font-mono text-[9px] tracking-widest text-primary font-bold block uppercase bg-primary/10 px-2.5 py-1 rounded w-fit mb-2">SELECT LEGAL SUBJECT</span>
            <div className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none snap-x">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setExpandedFaq({}); // Reset expanded states when category switches for stability
                    }}
                    className={`flex-grow md:flex-grow-0 flex items-center md:items-start gap-3 text-left p-4 rounded-2xl border transition-all hover:scale-[1.01] active:scale-[0.99] snap-start min-w-[240px] md:min-w-0 cursor-pointer ${
                      isActive 
                        ? 'bg-card border-primary text-foreground shadow-sm' 
                        : 'bg-card/45 border-border hover:bg-card hover:border-border/80 text-muted-foreground'
                    }`}
                  >
                    <div className={`p-2 rounded-xl border ${isActive ? 'bg-primary/5 border-primary/20' : 'bg-background border-border/50'} shrink-0`}>
                      {cat.icon}
                    </div>
                    <div className="space-y-0.5 font-sans">
                      <span className={`font-bold text-xs block ${isActive ? 'text-foreground font-sans' : 'text-muted-foreground font-sans'}`}>
                        {cat.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-snug hidden md:block">
                        {cat.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Smooth Accordions with min-height boundary for absolute layout stability */}
          <div className="md:col-span-8 space-y-4 min-h-[380px]">
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground font-bold block uppercase mb-2">EXPLORE CATEGORY TOPICS</span>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {filteredFaqs.map((faq, idx) => {
                  const isExpanded = expandedFaq[faq.q] || false;
                  return (
                    <div 
                      key={idx} 
                      className={`bg-card border rounded-2xl overflow-hidden shadow-xs transition-colors duration-300 ${
                        isExpanded ? 'border-primary/50 bg-card' : 'border-border hover:border-border/80'
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(faq.q)}
                        className="w-full flex items-center justify-between p-5 text-left font-serif font-normal text-foreground text-sm sm:text-base hover:bg-border/5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 pr-4">
                          <HelpCircle className={`h-4 w-4 shrink-0 transition-colors ${isExpanded ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className="font-serif leading-snug">{faq.q}</span>
                        </div>
                        <div className={`p-1 bg-background border border-border rounded-lg shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-primary border-primary/20' : 'text-muted-foreground'}`}>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 font-sans text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/50 pt-3 selection:bg-primary/30">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom Banner Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card/45 border border-border p-8 rounded-3xl shadow-sm relative overflow-hidden mt-8">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
          
          <div className="space-y-4">
            <span className="font-mono text-[9px] tracking-widest text-primary font-bold block uppercase">HAVE A SPECIAL CASE?</span>
            <h3 className="font-serif text-2xl font-normal text-foreground">Need Bespoke Legal Advice?</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-sans">
              While general FAQs provide foundational answers, every legal matter is unique and demands a thorough investigation of the specific material evidence.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <p className="text-muted-foreground text-xs leading-relaxed font-sans">
              Book a secure self-onboarding slot, upload your FICA files, and register a face-to-face consult at Justice House. Speak to our practitioners directly about property deeds, antenuptial contracts, or High Court trial briefs.
            </p>
            <a 
              href="/onboard" 
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-[10px] tracking-widest font-bold rounded-xl hover:opacity-90 w-fit cursor-pointer self-start md:self-end hover:scale-101 active:scale-99 transition-all shadow-md shadow-foreground/5"
            >
              BOOK SECURE ONBOARDING <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}