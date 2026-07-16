import React from 'react';
import { Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 dark:bg-card/25 py-12 px-4 font-mono text-[10px] tracking-widest text-muted-foreground text-center sm:text-left select-none">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2 font-serif text-sm font-bold text-foreground">
            <Scale className="h-4 w-4 text-primary" />
            <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">NDABAS ATTORNEYS</span>
          </div>
          <span>Trading from &quot;Justice House&quot; in Hammanskraal, Gauteng</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-bold">
          <a href="/lpc-compliance" className="hover:text-foreground transition-colors">LPC COMPLIANCE</a>
          <a href="/deeds-registry" className="hover:text-foreground transition-colors">DEEDS OFFICE RULES</a>
          <a href="/fica-rules" className="hover:text-foreground transition-colors">FICA VERIFICATION</a>
          <a href="/popia-policy" className="hover:text-foreground transition-colors">POPIA DATA LEDGER</a>
          <a href="/offices" className="hover:text-foreground transition-colors">OFFICES</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto border-t border-border/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px]">
        <div className="space-y-1 sm:space-y-0.5">
          <span>© 2026 Ndabas Attorneys. All rights reserved. Registered under the Legal Practice Council.</span>
          <div className="flex justify-center sm:justify-start gap-3 mt-1 text-primary">
            <a href="/privacy" className="hover:text-foreground transition-colors font-bold">PRIVACY POLICY</a>
            <span>·</span>
            <a href="/terms" className="hover:text-foreground transition-colors font-bold">TERMS OF SERVICE</a>
            <span>·</span>
            <a href="/disclaimer" className="hover:text-foreground transition-colors font-bold">LEGAL DISCLAIMER</a>
          </div>
        </div>
        <span className="text-center sm:text-right max-w-sm leading-normal">
          This website is for informational purposes and does not constitute formal legal advice. POPIA Compliant.
        </span>
      </div>
    </footer>
  );
}
