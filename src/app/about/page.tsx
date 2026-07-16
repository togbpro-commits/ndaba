'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, Shield, Landmark, Scale, MapPin } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">OUR HISTORY & FOUNDATION</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">Firm Story & Credentials</h1>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Firm story */}
        <section className="space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground font-sans selection:bg-primary/30">
          <p>
            Established in the heart of Hammanskraal, Gauteng, <strong className="text-foreground font-semibold">Ndabas Attorneys</strong> trading from the famous <strong className="text-foreground font-semibold">"Justice House"</strong> is a specialized law firm committed to delivering premier property law, conveyancing, notary acts, and advocacy.
          </p>
          <p>
            Unlike the traditional navy-and-gold legal conglomerates, we embrace a modern, transparent, and approachable client care model. Our warm ivory, lavender, and rose gold palette represents our core corporate values: <strong className="text-foreground font-semibold">integrity, calm authority, and precise execution</strong>.
          </p>
        </section>

        {/* Credentials Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center space-y-3">
            <Shield className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-serif font-bold text-foreground text-sm tracking-wide">POPIA COMPLIANT</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              We strictly process personal information following South African privacy legislation.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center space-y-3">
            <Landmark className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-serif font-bold text-foreground text-sm tracking-wide">LPC REGISTERED</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Our admitted practitioners are fully registered with the Legal Practice Council.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center space-y-3">
            <Award className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-serif font-bold text-foreground text-sm tracking-wide">ADVOCACY FORCE</h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Equipped with in-house advocates for complex high-court trials.
            </p>
          </div>
        </section>

        {/* Profiles */}
        <section className="space-y-6 border-t border-border pt-12">
          <h2 className="font-serif text-2xl font-normal text-foreground">Meet Our Practitioners</h2>
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center">
            {/* Mock Avatar */}
            <div className="w-24 h-24 bg-border/40 rounded-full flex items-center justify-center font-serif text-2xl text-primary font-bold shrink-0">
              ND
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-serif font-bold text-foreground text-lg">Adv. Ndaba, admitted Advocate & Conveyancer</h3>
              <span className="font-mono text-[9px] tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">DIRECTOR & NOTARY</span>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed pt-2">
                A native of Hammanskraal with over 15 years of litigation, property, and conveyancing experience. Oversees all property deeds registrations, antenuptial notary acts, and High Court advocacy briefs at Justice House.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
