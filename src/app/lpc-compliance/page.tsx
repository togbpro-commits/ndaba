import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Scale, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LpcCompliancePage() {
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
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">REGULATORY CODE Compliance</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-foreground leading-tight">
            Legal Practice Council<br />LPC Compliance & Standards
          </h1>
          <div className="h-[2px] w-20 bg-primary mt-4"></div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p className="text-foreground font-medium text-base">
            Ndabas Attorneys is a premier, fully registered South African law firm operating in Gauteng and registered under the statutory regulatory body—the Legal Practice Council (LPC).
          </p>

          <p>
            In terms of Section 34 of the Legal Practice Act 28 of 2014, our legal practitioners operate under strict statutory regulations governing ethical conduct, trust account audits, and LPC practice guidelines. We are fully authorized to render legal representation, litigation support, civil pleadings, notary contract drafting, and conveyancing services.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Professional Indemnity Insurance</h3>
              <p className="text-xs leading-relaxed">
                Our practices are fully backed by professional indemnity coverage through the Legal Practitioners Indemnity Insurance Fund (LPIIF), providing client protection on all transactions.
              </p>
            </div>

            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Strict Auditing Standard</h3>
              <p className="text-xs leading-relaxed">
                Our trust accounts are audited annually by certified external auditors in strict compliance with the Legal Practice Act rules, ensuring funds remain completely segregated and secured.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/60">
            <h3 className="font-serif text-foreground font-bold text-lg">Ethics & Professional Responsibility</h3>
            <p>
              As officers of the High Court of South Africa, our attorneys subscribe to the highest standards of professional ethics. This includes maintaining absolute client confidentiality, avoiding conflicts of interest, and pursuing civil matters with the highest level of diligence and transparency.
            </p>

            <ul className="space-y-2 text-xs font-sans">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>Verification of LPC registration status before engagement</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>Granular mandate agreements specifying fee structures upfront</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>Regular status reports dispatched automatically on active matters</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
