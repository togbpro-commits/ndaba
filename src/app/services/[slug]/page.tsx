'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Phone, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Scale 
} from 'lucide-react';

interface ServiceDetail {
  title: string;
  longDesc: string;
  process: string[];
  checklist: string[];
  icon: React.ReactNode;
}

export default function ServicePage() {
  const { slug } = useParams();

  const details: Record<string, ServiceDetail> = {
    attorneys: {
      title: "Attorneys & Litigation services",
      longDesc: "Our litigation team specializes in representing clients throughout Magistrate, Regional, and High Court jurisdictions. From drafting complex commercial agreements and corporate policies to resolving sensitive civil conflicts, family divorces, and labour union disputes. We ensure your trial strategy is calm, robust, and aggressively protective of your constitutional rights.",
      process: [
        "Case Analysis: Review past legal documents, briefs, and filings.",
        "Pleadings Drafting: Compile and serve court summons, notices, or claims.",
        "Trial Preparation: Gather witnesses and consult senior trial counsel.",
        "Vigorous Court Representation: Protect your legal interests at the trial bench."
      ],
      checklist: [
        "Certified copy of ID (Smart Card or Book)",
        "Proof of residential address (FICA, under 3 months old)",
        "Summons, letters of demand, or prior court notices",
        "Contracts, transaction slips, or files central to your claim"
      ],
      icon: <Scale className="h-10 w-10 text-primary" />
    },
    conveyancing: {
      title: "Conveyancing & Deeds Registration",
      longDesc: "We provide complete, premium conveyancing services to buyers, sellers, property developers, and banks. Our property law practitioners guide you step-by-step through signing the Offer to Purchase (Deed of Sale), securing rates clearance certificates from the local municipality, calculating and paying SARS transfer duties, and lodging the transfer deeds for registration at the Pretoria Deeds Registry. We handle everything transparently to ensure property transactions resolve with no hidden delays.",
      process: [
        "Deed of Sale: Capture the signed Offer to Purchase and open FICA files.",
        "Municipal & SARS Clearance: Pay rates clearances and register transfer duties.",
        "Bond Cancellation / Guarantees: Secure bonds and handle bank guarantees.",
        "Deeds Registry Lodgement: Lodge transfer deeds at the Pretoria Deeds Registry."
      ],
      checklist: [
        "Original or certified Copy of the Deed of Sale",
        "IDs and Proof of Residence of both Buyer and Seller",
        "Recent municipal utilities statement for property clearances",
        "Marital status documentation (Marriage Certificate / ANC)"
      ],
      icon: <FileText className="h-10 w-10 text-primary" />
    },
    notary: {
      title: "Notary Public & Public Authentications",
      longDesc: "A Notary Public holds specialized legal authority to authenticate documents for official, local, and international use. We draft and register Antenuptial Contracts (ANCs), draft lifetime trusts, authenticate commercial powers of attorney, and certify educational, commercial, or public credentials with Apostille legal certificates for overseas travel.",
      process: [
        "Contract Drafting: Plan ANC details or trust structures before marriage/action.",
        "Notarial Execution: Sign the official contract in the presence of the Notary.",
        "Deeds Registration: File ANCs at the local Pretoria Deeds Registry.",
        "Apostille Authentication: Issue public certificates for foreign jurisdictions."
      ],
      checklist: [
        "IDs and Proof of Residence of both partners (for ANCs)",
        "Divorce or death certificates if previously married",
        "Original copies of any documents or credentials to be certified",
        "Power of attorney draft (if authenticating signing rights)"
      ],
      icon: <ShieldCheck className="h-10 w-10 text-primary" />
    },
    advocacy: {
      title: "High Court Advocacy Counsel",
      longDesc: "Our in-house advocates provide specialized legal argument and trial defense in the High Court of South Africa. We represent clients in high-stakes corporate disputes, medical negligence claims, property litigation, and constitutional law motions, working as a united legal force alongside instructing attorneys.",
      process: [
        "Briefing Consultation: Evaluate pleadings files from instructing attorneys.",
        "Pre-Trial Motions: Prepare heads of argument and file high-court motions.",
        "High-Court Representation: Deliver oral arguments and trial testimony in court.",
        "Specialized Appeals: Draft appeal heads if reviewing prior rulings."
      ],
      checklist: [
        "Full brief files from your instructing attorney",
        "Certified copy of litigant ID and address (FICA)",
        "Past magistrate or regional court trial records (if appealing)",
        "Expert witness panels reports (e.g. medical or financial audits)"
      ],
      icon: <Scale className="h-10 w-10 text-primary" />
    }
  };

  const activeService = details[slug as string] || details['attorneys'];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-4xl mx-auto space-y-12">
        {/* Back Link */}
        <a 
          href="/services" 
          className="font-mono text-[10px] tracking-widest text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> BACK TO SERVICES
        </a>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-border/60 pb-8">
          <div className="p-4 bg-card border border-border rounded-2xl shadow-sm shrink-0">
            {activeService.icon}
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <span className="font-mono text-[9px] tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded font-bold">PRACTICE AREA DETAIL</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground mt-2">{activeService.title}</h1>
          </div>
        </div>

        {/* Detailed Description */}
        <section className="space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground font-sans">
          <p className="first-letter:text-4xl first-letter:font-serif first-letter:text-primary first-letter:font-bold first-letter:mr-1.5 first-letter:float-left">
            {activeService.longDesc}
          </p>
        </section>

        {/* Process Steps & Checklists */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
          
          {/* Step process */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-foreground">Our Step-by-Step Process</h3>
            <div className="space-y-3 font-mono text-[11px] text-muted-foreground leading-normal">
              {activeService.process.map((step, idx) => (
                <div key={idx} className="flex gap-2 bg-card border border-border p-3 rounded-xl shadow-sm">
                  <span className="text-primary font-bold">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-foreground">What to Bring Checklist</h3>
            <ul className="space-y-3 font-mono text-[10px] sm:text-[11px] text-muted-foreground">
              {activeService.checklist.map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        {/* Booking Prompt */}
        <section className="bg-border/20 border border-border p-6 sm:p-8 rounded-3xl text-center space-y-6">
          <h3 className="font-serif text-xl font-normal text-foreground">Ready to Proceed?</h3>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Connect directly with Adv. Ndaba at Justice House to compile your deeds or arrange court briefs.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="tel:0127110427" 
              className="bg-foreground text-background font-mono text-[10px] tracking-widest font-bold px-6 py-3 rounded-full flex items-center gap-1 hover:opacity-90"
            >
              <Phone className="h-3.5 w-3.5" /> CALL OFFICE
            </a>
            <a 
              href="https://wa.me/27734783775" 
              className="border border-border bg-card hover:bg-border/10 font-mono text-[10px] tracking-widest text-foreground font-bold px-6 py-3 rounded-full flex items-center gap-1"
            >
              <MessageSquare className="h-3.5 w-3.5 text-green-500 animate-pulse" /> WHATSAPP
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
