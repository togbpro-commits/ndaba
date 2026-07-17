'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Clock, Phone, Mail, ShieldCheck } from 'lucide-react';
import { db } from '@/lib/db';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden flex flex-col justify-between relative">
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-5xl mx-auto w-full space-y-12 select-none">
        
        {/* Top Section: Grid for Info and Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Column: Contact Info Card Container */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 font-sans"
          >
            <div className="space-y-3">
              <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">REACH JUSTICE HOUSE</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-foreground">Contact & Booking Information</h1>
              <div className="h-[1px] w-12 bg-primary mt-3"></div>
            </div>

            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              Please use our direct call, email, or WhatsApp channels below for instant connection to our Hammanskraal practitioners, or fill out our secure form.
            </p>

            {/* Information Cards Stack */}
            <div className="space-y-4 font-mono text-[11px] text-muted-foreground">
              
              {/* Address card */}
              <div className="flex gap-3.5 items-start bg-card border border-border p-4 rounded-2xl shadow-sm hover:border-primary/20 transition-colors">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1 font-sans">
                  <span className="font-bold text-foreground block text-[12px] font-sans">PHYSICAL ADDRESS</span>
                  <span className="leading-relaxed block text-muted-foreground">2208C Block AA Portion 9, Hammanskraal, Gauteng</span>
                </div>
              </div>

              {/* Hours card */}
              <div className="flex gap-3.5 items-start bg-card border border-border p-4 rounded-2xl shadow-sm hover:border-primary/20 transition-colors">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1 font-sans">
                  <span className="font-bold text-foreground block text-[12px] font-sans">BUSINESS HOURS</span>
                  <span className="leading-relaxed block text-muted-foreground">
                    Mon - Fri: 08:00 - 16:30 <br />
                    <span className="text-[10px] text-primary font-mono block mt-0.5">CLOSED ON WEEKENDS & PUBLIC HOLIDAYS</span>
                  </span>
                </div>
              </div>

              {/* Telephones card */}
              <div className="flex gap-3.5 items-start bg-card border border-border p-4 rounded-2xl shadow-sm hover:border-primary/20 transition-colors">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1 font-sans">
                  <span className="font-bold text-foreground block text-[12px] font-sans">TELEPHONE CHANNELS</span>
                  <span className="leading-relaxed block text-muted-foreground">
                    Office line: <a href="tel:0127110427" className="hover:text-primary underline font-mono text-[11px]">012 711 0427</a>
                    <span className="block mt-0.5">Cell / WhatsApp: <span className="font-mono text-[11px] text-foreground font-bold">082 490 6285</span> / <span className="font-mono text-[11px]">073 478 3775</span></span>
                  </span>
                </div>
              </div>

              {/* Email card */}
              <div className="flex gap-3.5 items-start bg-card border border-border p-4 rounded-2xl shadow-sm hover:border-primary/20 transition-colors">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1 font-sans">
                  <span className="font-bold text-foreground block text-[12px] font-sans">EMAIL ADDRESS</span>
                  <span className="leading-relaxed block text-muted-foreground">
                    <a href="mailto:info@ndabasattorneys.co.za" className="hover:text-primary underline font-mono text-[11px]">info@ndabasattorneys.co.za</a>
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Right Column: Contact Inquiry Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-card border border-border p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden h-full flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender/5 to-accent/10 blur-xl rounded-full"></div>

            {isSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in relative z-10 flex-grow flex flex-col justify-center items-center h-full">
                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-lg">✓</div>
                <h3 className="font-serif text-lg font-bold text-foreground">Inquiry Submitted Successfully</h3>
                <p className="text-muted-foreground text-xs leading-relaxed max-w-xs mx-auto font-sans">
                  Thank you for contacting Ndabas Attorneys. Your request has been created in our internal CRM system. Our administrative staff will contact you shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-[10px] tracking-widest font-bold px-6 py-2.5 rounded-full hover:scale-102 active:scale-98 transition-all cursor-pointer shadow-md"
                >
                  SUBMIT ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left relative z-10 flex-grow flex flex-col justify-between h-full">
                
                {/* Full name input */}
                <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground">
                  <label>FULL LEGAL NAME</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Sipho Doe" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Phone number input */}
                  <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground">
                    <label>PHONE NUMBER</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="082 490 6285" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans" 
                      required 
                    />
                  </div>

                  {/* Email input */}
                  <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground">
                    <label>EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john.doe@gmail.com" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans" 
                      required 
                    />
                  </div>

                </div>

                {/* Service Select options */}
                <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground">
                  <label>PRACTICE AREA OF SERVICE</label>
                  <select 
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans cursor-pointer"
                  >
                    <option>Attorneys & Litigation</option>
                    <option>Conveyancing & Property Transfers</option>
                    <option>Notary Services (Antenuptial Contracts)</option>
                    <option>Advocacy Counsel</option>
                  </select>
                </div>

                {/* Message text area */}
                <div className="space-y-1.5 font-mono text-[10px] tracking-wider text-muted-foreground">
                  <label>MESSAGE / INQUIRY DETAILS</label>
                  <textarea 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Describe your case or property transfer query..." 
                    rows={4} 
                    className="w-full bg-background border border-border rounded-xl p-4 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans resize-none" 
                    required
                  ></textarea>
                </div>

                {/* POPIA Consent box */}
                <div className="flex gap-2.5 items-start font-sans text-[11.5px] text-muted-foreground select-none pt-1">
                  <input 
                    type="checkbox" 
                    checked={formData.popia}
                    onChange={(e) => setFormData({...formData, popia: e.target.checked})}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary" 
                    required 
                    id="popia-contact" 
                  />
                  <label htmlFor="popia-contact" className="cursor-pointer leading-tight">
                    I consent to Ndabas Attorneys processing my personal information in accordance with the **Protection of Personal Information Act (POPIA)** of South Africa.
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-foreground text-background dark:bg-foreground dark:text-background font-mono text-[11px] tracking-widest font-bold py-4 rounded-xl hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-foreground/5 cursor-pointer"
                >
                  SUBMIT REQUEST
                </button>
              </form>
            )}
          </motion.div>

        </div>

        {/* Bottom Section: Map Embed Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="space-y-2 font-sans">
            <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">INTERACTIVE MAP</span>
            <h3 className="font-serif text-xl font-normal text-foreground">Find Us at Justice House</h3>
            <div className="h-[1px] w-8 bg-primary"></div>
          </div>

          <div className="border border-border/80 bg-card rounded-3xl overflow-hidden shadow-sm h-[320px] sm:h-[420px] relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d9082.111169207259!2d28.27981265033269!3d-25.396839162782015!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDIzJzU2LjQiUyAyOMKwMTYnNTcuNyJF!5e0!3m2!1sen!2sza!4v1784263716857!5m2!1sen!2sza" 
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="bg-card border border-border p-4 rounded-2xl flex gap-3.5 items-start text-xs max-w-xl mx-auto shadow-xs leading-normal">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-muted-foreground font-sans">
              <strong className="text-foreground">GPS Location Guidelines:</strong> 
              Our offices are located at <strong className="text-foreground">Justice House</strong>, Pretoria. GPS Coordinates: <code className="font-mono bg-background px-1.5 py-0.5 border border-border/60 rounded text-[11px] text-foreground">25°23'56.4"S 28°16'57.7"E</code>. Ample, secure client parking is available directly inside the premises.
            </div>
          </div>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}