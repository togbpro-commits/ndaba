'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Menu, X, Sun, Moon, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock background body scroll when mobile drawer is open to prevent mobile overscroll
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (mobileMenuOpen) {
        window.document.body.style.overflow = 'hidden';
      } else {
        window.document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.document.body.style.overflow = '';
      }
    };
  }, [mobileMenuOpen]);

  // Initialize theme from localStorage on client-side mount (hydration-safe)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem('ndaba_theme');
      if (savedTheme === 'dark') {
        setTheme('dark');
      } else if (savedTheme === 'light') {
        setTheme('light');
      } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemPrefersDark ? 'dark' : 'light');
      }
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ndaba_theme', nextTheme);
    }
  };

  return (
    <>
      {/* 1. DESKTOP MAIN HEADER (Clean, non-squishing container) */}
      <header className="fixed top-4 left-0 right-0 z-30 px-4 max-w-4xl mx-auto font-mono text-xs select-none">
        <nav className="backdrop-blur-md bg-card/75 dark:bg-card/45 border border-border px-6 py-3 rounded-full flex items-center justify-between shadow-sm">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 font-serif text-lg font-bold tracking-wide">
            <Scale className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">NDABAS</span>
          </a>

          {/* Desktop Nav Links (Hidden on mobile, plenty of breathing room on tablet/desktop) */}
          <div className="hidden md:flex items-center gap-5 tracking-widest text-muted-foreground font-bold">
            <a href="/services" className="hover:text-foreground transition-colors">SERVICES</a>
            <a href="/about" className="hover:text-foreground transition-colors">ABOUT</a>
            <a href="/fees" className="hover:text-foreground transition-colors">FEES</a>
            <a href="/faq" className="hover:text-foreground transition-colors">FAQ</a>
            <a href="/track" className="hover:text-primary transition-colors text-primary font-black">PORTAL</a>
            <a href="/contact" className="hover:text-foreground transition-colors">CONTACT</a>
          </div>

          {/* Desktop Theme, Lock, & CTA (Hidden on mobile to avoid overlapping) */}
          <div className="hidden md:flex items-center gap-2.5">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-card/90 border border-border rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <a 
              href="/admin"
              className="p-2 hover:bg-card/90 border border-border rounded-full text-muted-foreground hover:text-foreground transition-colors"
              title="Staff Admin Dashboard"
            >
              <Lock className="h-4 w-4" />
            </a>

            <a 
              href="/onboard" 
              className="bg-foreground text-background dark:bg-foreground dark:text-background tracking-widest font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              BOOK CONSULTATION
            </a>
          </div>

          {/* Mobile Hamburger Toggle (Perfectly aligned on the right inside the nav bar container) */}
          <div className="md:hidden flex items-center z-50">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="h-9 w-9 bg-zinc-100 dark:bg-zinc-900 border border-border/80 rounded-full flex items-center justify-center text-zinc-950 dark:text-white cursor-pointer hover:scale-105 active:scale-95 transition-all focus:outline-none shadow-sm"
              title="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* 2. SLIDING NAVIGATION DRAWER FROM THE RIGHT */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Scrim */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/45 backdrop-blur-sm z-30 cursor-default"
            />

            {/* Sliding Drawer Container */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 210 }}
              className="md:hidden fixed inset-y-0 right-0 z-40 w-72 h-full bg-white dark:bg-zinc-950 border-l border-border shadow-2xl flex flex-col justify-between p-6 pt-24 font-mono text-xs select-none"
            >
              {/* Drawer Links Stack */}
              <div className="flex flex-col gap-4 text-center tracking-widest text-muted-foreground font-bold">
                <a href="/" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:bg-border/20 rounded-xl hover:text-foreground transition-all">HOME</a>
                <a href="/services" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:bg-border/20 rounded-xl hover:text-foreground transition-all">SERVICES</a>
                <a href="/about" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:bg-border/20 rounded-xl hover:text-foreground transition-all">ABOUT</a>
                <a href="/fees" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:bg-border/20 rounded-xl hover:text-foreground transition-all">FEES</a>
                <a href="/faq" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:bg-border/20 rounded-xl hover:text-foreground transition-all">FAQ</a>
                <a href="/track" onClick={() => setMobileMenuOpen(false)} className="py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl font-black">PORTAL</a>
                <a href="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:bg-border/20 rounded-xl hover:text-foreground transition-all">CONTACT</a>
                <a href="/admin" onClick={() => setMobileMenuOpen(false)} className="py-2.5 hover:bg-border/20 border border-border/40 rounded-xl font-bold text-accent">STAFF LOGIN</a>
              </div>

              {/* Drawer Bottom Controls */}
              <div className="space-y-4 pt-6 border-t border-border/50">
                {/* Theme Toggle Button */}
                <button 
                  onClick={toggleTheme}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 dark:bg-zinc-900 border border-border rounded-xl text-muted-foreground hover:text-foreground font-bold transition-all cursor-pointer"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span>{theme === 'dark' ? 'LIGHT THEME' : 'DARK THEME'}</span>
                </button>

                {/* Main Action Call */}
                <a 
                  href="/onboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-black py-3.5 rounded-full flex items-center justify-center tracking-widest text-[10px] hover:opacity-90 transition-all shadow-md"
                >
                  BOOK CONSULTATION
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}