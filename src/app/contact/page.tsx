'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Clock, Phone, MessageSquare, Mail } from 'lucide-react';
import { db } from '@/lib/db';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Attorneys & Litigation',
    message: '',
    popia: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.insertLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        service_type: formData.service,
        message: formData.message
      });
      setIsSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'Attorneys & Litigation',
        message: '',
        popia: false
      });
    } catch (err) {
      console.error('Error submitting contact lead:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Contact Info Column */}
        <div className="space-y-8 font-sans">
          <div className="space-y-3">
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">REACH JUSTICE HOUSE</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground">Contact & Booking Information</h1>
            <div className="h-[1px] w-12 bg-primary mt-3"></div>
          </div>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Please use our direct call, email, or WhatsApp channels below for instant connection to our Hammanskraal practitioners, or fill out our secure form.
          </p>

          <div className="space-y-4 font-mono text-xs text-muted-foreground">
            <div className="flex gap-3.5 items-start bg-card border border-border p-4 rounded-2xl">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-foreground block">PHYSICAL ADDRESS</span>
                <span>2208C Block AA Portion 9, Hammanskraal, Gauteng</span>
              </div>
            </div>

            <div className="flex gap-3.5 items-start bg-card border border-border p-4 rounded-2xl">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-foreground block">BUSINESS HOURS</span>
                <span>Mon - Fri: 08:00 - 16:30 <br />Closed on Weekends & Public Holidays</span>
              </div>
            </div>

            <div className="flex gap-3.5 items-start bg-card border border-border p-4 rounded-2xl">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-foreground block">TELEPHONE CHANNELS</span>
                <span>Office: <a href="tel:0127110427" className="hover:text-primary underline">012 711 0427</a></span>
                <span className="block">Direct cell: 082 490 6285 / 073 478 3775</span>
              </div>
            </div>

            <div className="flex gap-3.5 items-start bg-card border border-border p-4 rounded-2xl">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-foreground block">EMAIL ADDRESS</span>
                <span><a href="mailto:info@ndabasattorneys.co.za" className="hover:text-primary underline">info@ndabasattorneys.co.za</a></span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>

          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto text-lg">✓</div>
              <h3 className="font-serif text-lg font-bold text-foreground">Inquiry Submitted Successfully</h3>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto">
                Thank you for contacting Ndabas Attorneys. Your request has been created in our internal CRM. Our staff will contact you shortly to confirm.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="bg-foreground text-background font-mono text-[10px] tracking-widest font-bold px-6 py-2.5 rounded-full"
              >
                SUBMIT ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-left relative z-10">
              <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                <label>FULL NAME</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                  <label>PHONE NUMBER</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="082 490 6285" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                    required 
                  />
                </div>
                <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                  <label>EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                <label>PRACTICE AREA OF SERVICE</label>
                <select 
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary font-sans"
                >
                  <option>Attorneys & Litigation</option>
                  <option>Conveyancing & Property Transfers</option>
                  <option>Notary Services (Antenuptial Contracts)</option>
                  <option>Advocacy Counsel</option>
                </select>
              </div>

              <div className="space-y-1 font-mono text-[10px] tracking-wider text-muted-foreground">
                <label>MESSAGE / INQUIRY DETAILS</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Describe your case or property transfer query..." 
                  rows={4} 
                  className="w-full bg-background border border-border rounded-xl p-4 text-xs text-foreground focus:outline-none focus:border-primary font-sans resize-none" 
                  required
                ></textarea>
              </div>

              {/* POPIA Consent */}
              <div className="flex gap-2.5 items-start font-sans text-[11px] text-muted-foreground select-none">
                <input 
                  type="checkbox" 
                  checked={formData.popia}
                  onChange={(e) => setFormData({...formData, popia: e.target.checked})}
                  className="mt-0.5 h-3.5 w-3.5" 
                  required 
                  id="popia-contact" 
                />
                <label htmlFor="popia-contact" className="cursor-pointer leading-tight">
                  I consent to Ndabas Attorneys processing my personal information in accordance with the **Protection of Personal Information Act (POPIA)**.
                </label>
              </div>

              <button 
                type="submit"
                className="w-full bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-xs tracking-widest font-bold py-4 rounded-xl hover:opacity-90 transition-opacity"
              >
                SUBMIT REQUEST
              </button>
            </form>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
