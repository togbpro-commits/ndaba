'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: "How long does a standard property transfer take?",
      a: "A standard conveyancing transfer in South Africa generally takes 6 to 10 weeks. This includes obtaining Rates Clearance Certificates from the local municipality, Transfer Duty receipts from SARS, and lodging the transfer deeds for registration at the Pretoria Deeds Registry."
    },
    {
      q: "What is an Antenuptial Contract (ANC) and why do I need one?",
      a: "An Antenuptial Contract is a legal notary contract signed before marriage. It determines whether your marriage will be Out of Community of Property (with or without the Accrual System). Without signing an ANC, your marriage defaults automatically to 'In Community of Property' in South Africa, meaning all assets and liabilities are shared 50/50."
    },
    {
      q: "What documents must I bring to my first legal consultation?",
      a: "To satisfy South African FICA (Financial Intelligence Centre Act) requirements, you must always bring: 1) Certified copy of your South African ID document or smart card, 2) Recent proof of address (not older than 3 months, e.g. a utility bill or bank statement), and 3) Any specific documents related to your case (e.g. title deeds, purchase contracts, high-court summons, or past case briefs)."
    },
    {
      q: "How do I request a consultation with Ndabas Attorneys?",
      a: "You can request a consultation by filling out our secure online request form on the contact page, calling us directly at 012 711 0427, or messaging us on WhatsApp at 082 490 6285. Once submitted, our administrative staff at Justice House will manually contact you to finalize the scheduled time."
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState<Record<number, boolean>>({});

  const toggleFaq = (index: number) => {
    setExpandedFaq(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">ANSWERS TO INQUIRIES</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">Frequently Asked Questions</h1>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Accordions */}
        <section className="space-y-4">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq[idx] || false;
            return (
              <div key={idx} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-foreground text-sm sm:text-base hover:bg-border/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 font-sans text-xs sm:text-sm leading-relaxed text-muted-foreground border-t border-border/50 pt-3 selection:bg-primary/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </section>

      </main>

      <Footer />
    </div>
  );
}
