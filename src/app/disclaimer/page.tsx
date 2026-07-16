'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Info, HelpCircle, Scale, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function LegalDisclaimer() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between font-sans">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-4xl mx-auto space-y-12 select-none">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">COMPLIANCE ASSURANCE</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground font-serif">Legal Disclaimer</h1>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </div>

        {/* LPC Banner */}
        <section className="bg-card border border-border rounded-3xl p-6 sm:p-10 flex gap-4 items-start shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
          <Scale className="h-6 w-6 text-primary shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-foreground text-base tracking-wide">Legal Practice Council Advertising Compliance</h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              This website is designed and maintained in strict accordance with the rules of the **Legal Practice Council (LPC)** of South Africa, compiled under the **Legal Practice Act No. 28 of 2014**. Our online marketing matches the highest professional and ethical standards, and is strictly for informative and general educational purposes.
            </p>
          </div>
        </section>

        {/* Disclaimer sections */}
        <section className="space-y-8 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-primary" /> 1. No Professional Legal Advice
            </h3>
            <p>
              The articles, checklists, FICA guidelines, and general legal descriptions hosted on this website are compiled to assist clients in understanding South African deeds transfers, notary contracts, and trial pleadings. However, they are **not** intended to constitute, and do **not** constitute, formal legal advice. 
            </p>
            <p>
              Every legal case has unique specifics relating to transaction values, Deeds Office indices, and high-court summonses. You must not act or refrain from acting based on any content read on this website without first obtaining direct, personalized professional legal counsel from our qualified practitioners at Justice House in Hammanskraal.
            </p>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-primary" /> 2. Estimation Calculator Accuracy
            </h3>
            <p>
              Our interactive **Conveyancing & Transfer Cost Estimator** on the `/fees` page calculates taxes and professional fees using:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The latest official South African Revenue Service (SARS) Transfer Duty brackets.</li>
              <li>Sliding LPC attorney professional conveyancing fee guidelines.</li>
              <li>Deeds Office registration sliding scales.</li>
            </ul>
            <p className="pt-2">
              While we make every effort to keep these calculators accurate, statutory tariffs, municipality clearance charges, and Deeds Registry fees are subject to regular legislative changes. The values produced are non-binding pro-forma estimations only. Ndabas Attorneys accepts no liability for discrepancies between calculator results and your final itemized legal account.
            </p>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-primary" /> 3. Verification & Case Tracker
            </h3>
            <p>
              Our Digital Case Matter Tracker acts as a convenient convenience tool for active Ndabas Attorneys clients. While we strive to update case milestone statuses (File Opened, FICA Approved, Drafting, Lodged, Completed) on our secure cloud servers, status lags may occur during heavy court or Deeds Registry schedules. Status tracking reports do not constitute formal registry certificates of registration.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
