'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, Shield, Landmark, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between relative">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-4xl mx-auto space-y-12 select-none">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">OUR HISTORY & FOUNDATION</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">Firm Story & Credentials</h1>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </motion.div>

        {/* Firm story */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground font-sans selection:bg-primary/30 text-left"
        >
          <p>
            Established in the heart of Hammanskraal, Gauteng, <strong className="text-foreground font-semibold">Ndabas Attorneys</strong> trading from the famous <strong className="text-foreground font-semibold">"Justice House"</strong> is a specialized law firm committed to delivering premier property law, conveyancing, notary acts, and advocacy.
          </p>
          <p>
            Unlike the traditional navy-and-gold legal conglomerates, we embrace a modern, transparent, and approachable client care model. Our warm ivory, lavender, and rose gold palette represents our core corporate values: <strong className="text-foreground font-semibold">integrity, calm authority, and precise execution</strong>.
          </p>
        </motion.section>

        {/* Credentials Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left"
        >
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center space-y-3 hover:border-primary/20 transition-all duration-300">
            <Shield className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-serif font-bold text-foreground text-sm tracking-wide">POPIA COMPLIANT</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-sans">
              We strictly process personal information following South African privacy legislation.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center space-y-3 hover:border-primary/20 transition-all duration-300">
            <Landmark className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-serif font-bold text-foreground text-sm tracking-wide">LPC REGISTERED</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-sans">
              Our admitted practitioners are fully registered with the Legal Practice Council.
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-center space-y-3 hover:border-primary/20 transition-all duration-300">
            <Award className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-serif font-bold text-foreground text-sm tracking-wide">ADVOCACY FORCE</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-sans">
              Equipped with in-house advocates for complex high-court trials.
            </p>
          </div>
        </motion.section>

        {/* Profiles */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6 border-t border-border pt-12 text-left"
        >
          <h2 className="font-serif text-2xl font-normal text-foreground">Meet Our Practitioners</h2>
          
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start shadow-sm hover:border-primary/10 transition-colors duration-300">
            
            {/* Professional Portrait */}
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" 
              alt="Advocate Ndaba"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-border shadow-sm shrink-0"
            />

            <div className="space-y-2 text-center sm:text-left flex-grow font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                <h3 className="font-serif font-bold text-foreground text-lg">Advocate Ndaba</h3>
                <span className="font-mono text-[9px] tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded w-fit mx-auto sm:mx-0 font-bold uppercase">DIRECTOR & FOUNDER</span>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed pt-2 font-sans">
                A native of Hammanskraal with over 15 years of litigation, property, and conveyancing experience. Advocate Ndaba coordinates all property deeds registrations, antenuptial notary acts, and High Court advocacy briefs at Justice House. Highly skilled in bilingual trial representation (Sotho, Tswana, Zulu, English).
              </p>
            </div>

          </div>
        </motion.section>

      </main>

      <Footer />
    </div>
  );
}