'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Gavel, AlertOctagon, Scale, ShieldAlert, CheckCircle, FileWarning } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">GOVERNING RULES</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">Terms of Service</h1>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Warning Banner */}
        <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 sm:p-10 flex gap-4 items-start shadow-sm relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/5 to-orange-500/5 blur-xl rounded-full"></div>
          <ShieldAlert className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-foreground text-base tracking-wide">Strict Fraud and Money Laundering Prevention Notice</h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              In terms of the **Financial Intelligence Centre Act (FICA)**, Ndabas Attorneys maintains a zero-tolerance policy towards fraudulent transactions, money laundering, identity theft, and property hijacking. Any attempt to upload falsified certified ID copies, forged purchase contracts, or misrepresent property assets will result in immediate termination of access and a formal criminal report to the **Financial Intelligence Centre (FIC)** and the **South African Police Service (SAPS)**.
            </p>
          </div>
        </section>

        {/* Terms of Service Content */}
        <section className="space-y-8 font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <Gavel className="h-4.5 w-4.5 text-primary" /> 1. Acceptance of Terms
            </h3>
            <p>
              By accessing this website, utilizing our online conveyancing calculators, or registering your legal FICA profile on our client onboarding portal, you formally agree to be bound by these Terms of Service and all applicable South African statutes. If you do not agree to these terms, you are prohibited from using this website or submitting any files to our database.
            </p>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <FileWarning className="h-4.5 w-4.5 text-primary" /> 2. Lawful Use & Prohibited Activities
            </h3>
            <p>
              Our onboarding portal is a secure legal gateway designed for legitimate South African citizens and corporate entities requiring deeds registry transfers, notarizations, and trial representation. You strictly agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Upload any documents that are forged, altered, or represent a stolen identity.</li>
              <li>Provide false, misleading, or fraudulent information regarding municipal rates clearances, marital statuses, or property values.</li>
              <li>Use the client Case Tracker with malicious automated scripts or attempt unauthorized dashboard logins.</li>
              <li>Utilize our web portals to facilitate unlawful transactions, shell-company schemes, or evade SARS tax compliance.</li>
            </ul>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-primary" /> 3. No Attorney-Client Relationship
            </h3>
            <p>
              Please note that browsing our website, calculating municipal transfer fees, submitting an inquiry via `/contact`, or completing the initial `/onboard` FICA wizard does **not** constitute or establish a formal attorney-client relationship. An attorney-client relationship is strictly formed only when:
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Our Hammanskraal practitioners have manually reviewed your FICA files and completed conflict-of-interest checks.</li>
              <li>You have formally signed a written **Mandate and Fee Agreement** specifying our retainer rules and LPC tariffs.</li>
            </ol>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <AlertOctagon className="h-4.5 w-4.5 text-primary" /> 4. Governing Law and Jurisdiction
            </h3>
            <p>
              These terms, along with any disputes arising from your use of this website, the onboarding wizard, or our secure digital databases, are governed strictly by the **laws of the Republic of South Africa**. Any legal proceedings relating to your use of this website shall be subject to the exclusive jurisdiction of the High Court of South Africa (Gauteng Division, Pretoria).
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
