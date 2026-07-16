import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Scale, ShieldCheck, History, CheckCircle2 } from 'lucide-react';

export default function PopiaPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between font-sans">
      {/* Minimal Header */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between select-none">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold tracking-wide">
          <Scale className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">NDABAS</span>
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
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">PRIVACY & INFORMATION PROTECTION</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-foreground leading-tight">
            POPIA Data Regulation &<br />Compliance Audit Ledger
          </h1>
          <div className="h-[2px] w-20 bg-primary mt-4"></div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p className="text-foreground font-medium text-base">
            The Protection of Personal Information Act (POPIA) 4 of 2013 safeguards the right to privacy of all South African citizens by regulating how personal data is collected, stored, and managed.
          </p>

          <p>
            Law firms process highly sensitive personal information, including identity numbers, property deed registries, family law assets, financial bank letters, and litigation pleadings. Under POPIA, we are legally mandated to act as the &quot;Responsible Party,&quot; deploying the highest level of physical, administrative, and technological security to prevent data breaches.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Encrypted Storage</h3>
              <p className="text-xs leading-relaxed">
                All client FICA documents, IDs, and deeds records uploaded to our database are stored under industry-standard SSL encryption and secured by strict Row-Level Security (RLS) policies.
              </p>
            </div>

            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <History className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Cryptographic Compliance Ledger</h3>
              <p className="text-xs leading-relaxed">
                Our database automatically writes an immutable audit record to the `popia_audit_logs` ledger every time an operator accesses, views, uploads, or modifies client file details.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/60">
            <h3 className="font-serif text-foreground font-bold text-lg">Your Privacy Rights Under POPIA</h3>
            <p>
              Under POPIA regulations, clients have concrete rights regarding their personal records processed by Ndabas Attorneys:
            </p>

            <ul className="space-y-2 text-xs font-sans">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong>The Right of Access:</strong> You can log into our secure tracking portal at any time to view exactly what files we store on your active FICA matter profile.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong>The Right of Rectification:</strong> You can submit updated, certified documents directly through our Web Portal or WhatsApp assistant to correct stale records.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong>The Right to Object/Destruction:</strong> Once your legal matter is complete and any statutory storage requirements have elapsed, you can formally request the deletion of your digital FICA records.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
