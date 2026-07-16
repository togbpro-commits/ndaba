'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronRight, Scale } from 'lucide-react';

export default function Services() {
  const services = [
    {
      slug: "attorneys",
      title: "Attorneys & Litigation",
      desc: "Our attorneys handle civil and criminal litigation, commercial contract drafting, family disputes, and broad advisory services. We represent you vigorously in both magistrate and regional courts.",
      checklist: ["Certified copy of ID", "Summons or relevant court briefs", "Recent utility bill (FICA)"]
    },
    {
      slug: "conveyancing",
      title: "Conveyancing & Property Transfers",
      desc: "Specialized deed transfer, subdivision, property development contracts, and township registrations at the Pretoria Deeds Registry. We navigate clearance certificates and SARS transfer duties quickly.",
      checklist: ["Admitted Deed of Sale / Offer to Purchase", "Rates Clearance from local municipality", "SARS transfer duty filing approval"]
    },
    {
      slug: "notary",
      title: "Notary Public services",
      desc: "Legal acts of public authentication including Antenuptial Contracts (ANCs), authentication of credentials for overseas travel, and drafting of legal trusts.",
      checklist: ["IDs of both partners (for ANC)", "FICA Proof of Residence", "Any specific overseas credentials to certify"]
    },
    {
      slug: "advocacy",
      title: "Advocacy & High Court Counsel",
      desc: "Our in-house advocates provide specialized legal trial representation in the High Court of South Africa, handling complex corporate, personal injury, and constitutional matters.",
      checklist: ["Briefing files from instructing attorneys", "Certified IDs of principal litigants", "Previous trial records or transcripts"]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">PRACTICE LINES</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">Our Legal Services</h1>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </div>

        {/* List of services */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc, idx) => (
            <div 
              key={idx}
              className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-4">
                <span className="font-mono text-[9px] tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">SERVICE LINE</span>
                <h3 className="font-serif text-xl font-bold text-foreground">{svc.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{svc.desc}</p>
                
                {/* Checklist preview */}
                <div className="border-t border-border/60 pt-4 space-y-1.5 font-mono text-[10px] text-muted-foreground">
                  <span className="font-bold text-foreground">WHAT TO BRING CHECKLIST:</span>
                  <ul className="list-disc pl-4 space-y-1 text-[9px] sm:text-[10px]">
                    {svc.checklist.map((item, cIdx) => <li key={attTypeString(cIdx)}>{item}</li>)}
                  </ul>
                </div>
              </div>

              <a 
                href={`/services/${svc.slug}`}
                className="font-mono text-[10px] tracking-widest text-primary font-bold inline-flex items-center gap-1 hover:translate-x-1.5 transition-transform duration-300 pt-4"
              >
                READ DETAIL PAGE <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </section>

      </main>

      <Footer />
    </div>
  );
}

function attTypeString(idx: number) {
  return `chk_${idx}`;
}
