import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Scale, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

export default function DeedsRegistryPage() {
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
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">CONVEYANCING & REGISTRY GUIDELINES</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-foreground leading-tight">
            Deeds Registry &<br />Property Transfer Rules
          </h1>
          <div className="h-[2px] w-20 bg-primary mt-4"></div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p className="text-foreground font-medium text-base">
            Conveyancing is a specialized branch of law in South Africa. It dictates how real estate, land portions, and sectional titles are legally registered and transferred.
          </p>

          <p>
            Our certified conveyancing practitioners manage property transfers directly through the Pretoria Deeds Registry (Deeds Office), ensuring compliance with the Deeds Registries Act 47 of 1937 and Section 34 of the Sectional Titles Act 95 of 1986.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Contract of Sale Drafting</h3>
              <p className="text-xs leading-relaxed">
                Reviewing, drafting, and validating the legally binding Offer to Purchase (OTP) containing absolute suspensive conditions (like bond approvals or beetle/electrical compliance checks).
              </p>
            </div>

            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Deeds Office Lodgement</h3>
              <p className="text-xs leading-relaxed">
                Collating and lodging physical deeds and title certificates with the Pretoria Registrar of Deeds, coordinating the legal transfer timeline in approximately 10 to 12 weeks.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/60">
            <h3 className="font-serif text-foreground font-bold text-lg">Standard Property Transfer Steps</h3>
            <p>
              The property transfer process requires meticulous coordination between the buyer, seller, transferring attorney, bond attorney, and bond cancellation attorney. Key required items include:
            </p>

            <ul className="space-y-2 text-xs font-sans">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>SARS Transfer Duty receipt or VAT exemption clearance</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>Municipal Rates Clearance certificate valid for 120 days</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>Electrical, Gas, and Electric Fence compliance certifications</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>FICA verification of both contracting parties under South African law</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
