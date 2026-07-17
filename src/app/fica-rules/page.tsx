import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Scale, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function FicaRulesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between font-sans">
      {/* Minimal Header */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between select-none">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold tracking-wide">
          <Scale className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">NDABA&apos;S</span>
        </Link>
        <Link 
          href="/" 
          className="px-4 py-2 bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground rounded-full shadow-sm transition-all font-mono text-[9px] tracking-widest font-bold"
        >
          BACK HOME
        </Link>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 py-16 space-y-10">
        <div className="space-y-4">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">ANTI-MONEY LAUNDERING ACT COMPLIANCE</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-foreground leading-tight">
            FICA Verification &<br />Identification Requirements
          </h1>
          <div className="h-[2px] w-20 bg-primary mt-4"></div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p className="text-foreground font-medium text-base">
            Under the Financial Intelligence Centre Act (FICA) 38 of 2001, law firms are classified as &quot;Accountable Institutions&quot; and are legally required to verify the identity of all clients before initiating representation.
          </p>

          <p>
            FICA laws are designed to combat money laundering, tax evasion, fraud, and financial terrorism. Before Ndabas Attorneys can open a trust ledger or initiate property transfers, conveyancing deeds, litigation proceedings, or civil actions, we must establish a verified FICA client profile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Identity Verification</h3>
              <p className="text-xs leading-relaxed">
                A high-resolution certified copy of your South African Smart ID (both sides), standard green ID book, or valid international passport is mandatory.
              </p>
            </div>

            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Residential Address Proof</h3>
              <p className="text-xs leading-relaxed">
                A certified utility bill, lease agreement, municipal account, bank statement, or official tax invoice showing your name and physical address (not older than 3 months).
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/60">
            <h3 className="font-serif text-foreground font-bold text-lg">Documents Required by Entity Type</h3>
            <p>
              Depending on whether you are onboarding as an individual, a company, or a trust, different FICA documents are required to initiate compliance verification:
            </p>

            <ul className="space-y-2 text-xs font-sans">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Individuals:</strong> Smart ID Card / Passport, Utility Bill (Proof of Address), and SARS Income Tax number verification.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Companies:</strong> CIPC Registration Document (COR14.3), Proof of Company Address, SARS VAT/Tax letter, and FICA verification of all managing Directors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Trusts:</strong> Copy of the Trust Deed, Letters of Authority from the Master of the High Court, and FICA verification of all Trustees and named Beneficiaries.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
