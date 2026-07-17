'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronRight, Scale, Award, Home, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Services() {
  const services = [
    {
      slug: "attorneys",
      title: "Attorneys & Litigation",
      desc: "Our attorneys handle civil and commercial litigation, commercial contract drafting, family disputes, and broad advisory services. We represent you vigorously in both magistrate and regional courts.",
      icon: <Scale className="h-5 w-5 text-primary" />,
      bgGradient: "from-amber-100 to-rose-100 dark:from-amber-950/10 dark:to-rose-950/10",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&auto=format&fit=crop",
      checklist: ["Certified copy of ID (Smart Card)", "Summons or relevant court briefs", "Recent utility bill (FICA under 3 months)"]
    },
    {
      slug: "conveyancing",
      title: "Conveyancing & Property Transfers",
      desc: "Specialized deed transfer, subdivision, property development contracts, and township registrations at the Pretoria Deeds Registry. We navigate rates clearance certificates and SARS transfer duties rapidly.",
      icon: <Home className="h-5 w-5 text-primary" />,
      bgGradient: "from-rose-100 to-purple-100 dark:from-rose-950/10 dark:to-purple-950/10",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop",
      checklist: ["Admitted Deed of Sale / Offer to Purchase", "Rates Clearance from local municipality", "SARS transfer duty tax filing receipt"]
    },
    {
      slug: "notary",
      title: "Notary Public services",
      desc: "Legal acts of public authentication including Antenuptial Contracts (ANCs), authentication of credentials for overseas travel, and drafting of specialized family trusts.",
      icon: <Award className="h-5 w-5 text-primary" />,
      bgGradient: "from-purple-100 to-indigo-100 dark:from-purple-950/10 dark:to-indigo-950/10",
      image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=400&auto=format&fit=crop",
      checklist: ["ID documents of both partners (for ANC)", "FICA Proof of Address details", "Specific overseas documents to authenticate"]
    },
    {
      slug: "advocacy",
      title: "Advocacy & High Court Counsel",
      desc: "Our in-house advocates provide specialized legal trial representation in the High Court of South Africa, handling complex corporate litigation, personal injury, and constitutional cases.",
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      bgGradient: "from-indigo-100 to-blue-100 dark:from-indigo-950/10 dark:to-indigo-950/10",
      image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=400&auto=format&fit=crop",
      checklist: ["Briefing files from instructing attorneys", "Certified ID copies of principal litigants", "Previous trial records or court transcripts"]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between relative">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-5xl mx-auto space-y-12 select-none">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">PRACTICE LINES</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">Our Legal Services</h1>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-sans">
            Explore our specialized legal services spanning high-court litigation, conveyancing property deeds, marital notary acts, and regulatory counsel at Justice House.
          </p>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </motion.div>

        {/* List of services in a beautiful 2-column grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {services.map((svc, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between relative overflow-hidden group hover:border-primary/25 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              
              {/* Background photo texture overlay */}
              <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img 
                  src={svc.image} 
                  alt={svc.title}
                  className="w-full h-full object-cover opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] group-hover:scale-103 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
              </div>

              {/* Visual glow bubble */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${svc.bgGradient} blur-2xl rounded-full opacity-35 group-hover:opacity-60 transition-opacity z-0`}></div>

              <div className="space-y-4 relative z-10 font-sans">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-background border border-border rounded-xl shrink-0 group-hover:border-primary/20 transition-colors">
                    {svc.icon}
                  </div>
                  <span className="font-mono text-[9px] tracking-widest text-primary font-bold uppercase">SERVICE DIVISION</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground group-hover:text-primary transition-colors">{svc.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-[13.5px] leading-relaxed font-sans">{svc.desc}</p>
                
                {/* Checklist preview card */}
                <div className="border-t border-border/60 pt-4.5 space-y-3 font-mono text-[10px] text-muted-foreground">
                  <span className="font-bold text-foreground tracking-wider uppercase block">REQUIRED ONBOARDING CHECKLIST:</span>
                  <div className="space-y-2 font-sans text-xs">
                    {svc.checklist.map((item, cIdx) => (
                      <div key={cIdx} className="flex gap-2 items-center bg-background/50 border border-border/40 p-2.5 rounded-xl shadow-xs leading-normal">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-[11px] font-sans text-muted-foreground block">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 relative z-10">
                <a 
                  href={`/services/${svc.slug}`}
                  className="font-mono text-[9px] tracking-widest text-primary font-bold inline-flex items-center gap-1.5 hover:translate-x-1.5 transition-transform duration-300"
                >
                  EXPLORE DETAILED PORTAL <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Bottom Booking Teaser */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border border-border p-8 rounded-3xl shadow-sm relative overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
          
          <div className="space-y-4 font-sans">
            <span className="font-mono text-[9px] tracking-widest text-primary font-bold block uppercase">ONBOARD ONLINE</span>
            <h3 className="font-serif text-2xl font-normal text-foreground">Need Immediate Legal Lodgement?</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-sans">
              Ndabas Attorneys fast-tracks cases by collecting FICA profiles programmatically, eliminating physical document delivery bottlenecks before first briefings.
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <p className="text-muted-foreground text-xs leading-relaxed font-sans">
              Choose your service category, scan and upload your certified ID and proof of residence under FICA guidelines, and schedule your appointment slot directly into our secure control panels.
            </p>
            <a 
              href="/onboard" 
              className="inline-flex items-center gap-1.5 px-5 py-3 bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-[10px] tracking-widest font-bold rounded-xl hover:opacity-90 w-fit cursor-pointer self-start md:self-end hover:scale-101 active:scale-99 transition-all shadow-md shadow-foreground/5"
            >
              START ONLINE ONBOARDING <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}