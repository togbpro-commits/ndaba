'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HelpCircle, Info, Landmark, Scale, Calculator, Percent, Coins, Receipt } from 'lucide-react';

export default function Fees() {
  const [purchasePrice, setPurchasePrice] = useState<number>(1200000); // Default R1.2M

  const processSteps = [
    {
      title: "1. Consultation Request",
      desc: "Contact us via call, WhatsApp, or form. We schedule a manual meeting time at Justice House."
    },
    {
      title: "2. Documentation Review",
      desc: "Bring all required documents (ID copies, proof of address, title deeds, etc.) according to our checklists."
    },
    {
      title: "3. Action Plan & Fee Estimate",
      desc: "We analyze your case or deeds and provide a transparent process map and non-binding cost breakdown."
    },
    {
      title: "4. Matter Resolution",
      desc: "Our conveyancing, notary, or trial team executes the legal tasks with consistent weekly status updates."
    }
  ];

  // SOUTH AFRICAN 2026/2027 TRANSFER DUTY (SARS TAX)
  const calculateTransferDuty = (price: number): number => {
    if (price <= 1100000) return 0;
    if (price <= 1512500) return (price - 1100000) * 0.03;
    if (price <= 2117500) return 12375 + (price - 1512500) * 0.06;
    if (price <= 2722500) return 48675 + (price - 2117500) * 0.08;
    if (price <= 12100000) return 97075 + (price - 2722500) * 0.11;
    return 1128600 + (price - 12100000) * 0.13;
  };

  // LPC ATTORNEY PROFESSIONAL CONVEYANCING FEES GUIDELINE
  const calculateProfessionalFee = (price: number): number => {
    if (price <= 200000) return 5500;
    if (price <= 500000) return 5500 + (price - 200000) * 0.015;
    if (price <= 1000000) return 10000 + (price - 500000) * 0.012;
    if (price <= 2000000) return 16000 + (price - 1000000) * 0.010;
    return 26000 + (price - 2000000) * 0.008;
  };

  // DEEDS OFFICE REGISTRATION FEES
  const calculateDeedsFee = (price: number): number => {
    if (price <= 500000) return 600;
    if (price <= 1000000) return 1100;
    if (price <= 2000000) return 1400;
    if (price <= 5000000) return 1900;
    return 2800;
  };

  // CONSTANTS
  const sundryEstimate = 1500; // Postage & Petties estimate
  const professionalFee = calculateProfessionalFee(purchasePrice);
  const transferDuty = calculateTransferDuty(purchasePrice);
  const deedsFee = calculateDeedsFee(purchasePrice);
  const vatRate = 0.15;
  const vatOnFees = (professionalFee + sundryEstimate) * vatRate;
  const totalConveyancingCost = professionalFee + transferDuty + deedsFee + sundryEstimate + vatOnFees;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">TRANSPARENT PROCESS</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-foreground">Fees & Cost Calculator</h1>
          <div className="h-[1px] w-20 bg-primary mx-auto mt-4"></div>
        </div>

        {/* LPC Compliance introduction */}
        <section className="bg-card border border-border rounded-3xl p-6 sm:p-10 flex gap-4 items-start select-none shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>
          <Info className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-foreground text-base tracking-wide">Legal Practice Council compliance</h2>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              In accordance with South African Legal Practice Council guidelines, we do not issue automated, binding quotes on this website. Legal fees vary depending on property values, deeds registry indices, and complex trial litigation hours. Use our interactive estimator below for preliminary planning purposes.
            </p>
          </div>
        </section>

        {/* NEW: INTERACTIVE CONVEYANCING COST CALCULATOR */}
        <section id="calculator" className="space-y-6 pt-6 scroll-mt-32">
          <div className="space-y-1.5">
            <span className="font-mono text-[9px] tracking-widest text-primary font-bold uppercase block">PROPERTY TRANSACTION TOOL</span>
            <h2 className="font-serif text-2xl font-normal text-foreground">Conveyancing & Transfer Duty Cost Estimator</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Left Column: Cost Input Fields */}
            <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm h-full flex flex-col justify-between">
              <div className="space-y-2 font-mono text-[10px] text-muted-foreground">
                <label className="uppercase tracking-widest block font-bold">PROPERTY PURCHASE PRICE (ZAR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm text-foreground">R</span>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              {/* Slider for quick pricing changes */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={100000}
                  max={10000000}
                  step={50000}
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
                  <span>R100K</span>
                  <span>R5.0M</span>
                  <span>R10.0M</span>
                </div>
              </div>

              <div className="border-t border-border/60 pt-4 space-y-3 font-sans text-xs text-muted-foreground leading-relaxed">
                <div className="flex gap-2">
                  <Coins className="h-4.5 w-4.5 text-primary shrink-0" />
                  <p>SARS Transfer Duty is a tax levied on property acquisitions. Any property under **R1.1 Million** is 100% exempt from transfer duty!</p>
                </div>
                <div className="flex gap-2">
                  <Receipt className="h-4.5 w-4.5 text-primary shrink-0" />
                  <p>Our professional rates correspond with the statutory sliding guidelines recommended by the Law Society.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Itemized Cost Card */}
            <div className="bg-foreground text-background dark:bg-card dark:text-foreground border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-md shadow-black/5 relative overflow-hidden h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender/10 to-accent/15 blur-2xl rounded-full"></div>
              
              <div className="border-b border-background/20 dark:border-border/60 pb-4">
                <h3 className="font-serif text-lg font-bold">ZAR Estimation Breakdown</h3>
                <span className="font-mono text-[9px] tracking-wider opacity-60">NON-BINDING PRELIMINARY ESTIMATE</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span>SARS TRANSFER DUTY (TAX)</span>
                  <span className="font-bold">R {transferDuty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>CONVEYANCER'S FEES (EXCL. VAT)</span>
                  <span className="font-bold">R {professionalFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>DEEDS OFFICE REGISTRY FEE</span>
                  <span className="font-bold">R {deedsFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>POSTAGE, COPIES & PETTIES</span>
                  <span className="font-bold">R {sundryEstimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>ESTIMATED VAT (15% ON FEES)</span>
                  <span className="font-bold">R {vatOnFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="border-t border-dashed border-background/20 dark:border-border/60 pt-4 flex justify-between font-sans text-sm sm:text-base font-bold text-primary dark:text-foreground">
                  <span className="font-serif">ESTIMATED TOTAL COSTS</span>
                  <span>R {totalConveyancingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/onboard"
                  className="w-full bg-primary text-primary-foreground dark:bg-foreground dark:text-background font-mono text-[10px] tracking-widest font-bold py-3.5 rounded-full flex items-center justify-center gap-1.5 uppercase hover:opacity-90 transition-all shadow"
                >
                  Onboard With This Matter <Scale className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Process Map */}
        <section className="space-y-6 border-t border-border pt-12">
          <h2 className="font-serif text-2xl font-normal text-foreground">Our Consultation & Work Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {processSteps.map((step, idx) => (
              <div key={idx} className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-2">
                <h3 className="font-serif font-bold text-foreground text-sm tracking-wider">{step.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conveyancing timelines / Fee Guidelines */}
        <section className="space-y-4 border-t border-border pt-12 font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="font-serif text-2xl font-normal text-foreground mb-4">Property Transfer & Deeds Timelines</h2>
          <p>
            Property transfers (conveyancing) in South Africa involve multiple local municipality clearances (Rates Clearance Certificates) and South African Revenue Service (SARS) transfer duty filings before we can lodge the deed at the Pretoria Deeds Registry.
          </p>
          <p>
            The standard registration timeframe ranges from <strong className="text-foreground">6 to 10 weeks</strong> from the date of the signed deed of sale, provided all documentation is correctly compiled.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
