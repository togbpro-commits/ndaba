'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, Database, UserCheck, Scale } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">REGULATORY PROTECTION</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">POPIA & Privacy Policy</h1>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </div>

        {/* POPIA Overview Card */}
        <section className="bg-card border border-border rounded-3xl p-6 sm:p-10 flex gap-4 items-start shadow-sm relative overflow-hidden select-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
          <Shield className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-foreground text-base tracking-wide">Compliance with the Protection of Personal Information Act (POPIA)</h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              At Ndabas Attorneys, we are committed to safeguarding your personal data in strict compliance with the **Protection of Personal Information Act, No. 4 of 2013 (POPIA)** of South Africa. We respect your constitutional right to privacy and ensure that all personal information collected via our website, onboarding wizard, and portals is handled responsibly and securely.
            </p>
          </div>
        </section>

        {/* Real Policy Content */}
        <section className="space-y-8 font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <Eye className="h-4.5 w-4.5 text-primary" /> 1. Information We Collect
            </h3>
            <p>
              In order to provide Conveyancing, Notary, Litigation, and Advocate Advisory services, we collect personal information directly from you when you submit forms or complete our digital onboarding. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full names, contact details (phone and email), and residential physical addresses.</li>
              <li>South African Identity Numbers or Passport details.</li>
              <li>FICA documents, including certified ID copies, proof of residence, ANC registers, or property deeds of sale.</li>
              <li>Digital signatures drawn on our onboarding signature pad.</li>
            </ul>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <Database className="h-4.5 w-4.5 text-primary" /> 2. Purpose of Data Processing
            </h3>
            <p>
              We process your personal information strictly for legitimate legal business operations, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Satisfying statutory **FICA (Financial Intelligence Centre Act)** identification and verification requirements.</li>
              <li>Preparing pro-forma deeds registry transfer document packets.</li>
              <li>Scheduling practitioner consultations at our physical offices at "Justice House" in Hammanskraal.</li>
              <li>Opening legal files and preparing summonses, notary registers, or high-court pleadings.</li>
            </ul>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <Lock className="h-4.5 w-4.5 text-primary" /> 3. Data Security and Encrypted Storage
            </h3>
            <p>
              Your security is our absolute priority. We employ advanced technical and organizational measures to prevent unauthorized data access, leakage, or loss:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>All database submissions and uploaded FICA files are transmitted via secure SSL encryption.</li>
              <li>Documents are housed within strictly secured, encrypted storage buckets on our secure cloud servers.</li>
              <li>We enforce a zero-sharing policy: your data is never rented, sold, or distributed to third parties unless required by a court order or during standard deeds registry filings.</li>
            </ul>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <h3 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
              <UserCheck className="h-4.5 w-4.5 text-primary" /> 4. Your Rights Under POPIA
            </h3>
            <p>
              Under POPIA, you have explicit rights regarding your personal information, which you may exercise at any time by contacting our Hammanskraal Information Officer:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The right to request access to any personal information we hold about you.</li>
              <li>The right to request the correction, update, or deletion of your personal data.</li>
              <li>The right to object to the processing of your data on reasonable grounds.</li>
            </ul>
            <p className="pt-2">
              For any privacy inquiries or to file a data removal request, please email our Information Officer at <a href="mailto:info@ndabasattorneys.co.za" className="text-primary hover:underline font-bold">info@ndabasattorneys.co.za</a>.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
