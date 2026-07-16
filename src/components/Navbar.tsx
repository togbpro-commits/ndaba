'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Menu, X, Sun, Moon, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="fixed top-4 left-0 right-0 z-50 px-4 max-w-4xl mx-auto font-mono text-xs select-none">
      <nav className="backdrop-blur-md bg-card/75 dark:bg-card/45 border border-border px-6 py-3 rounded-full flex items-center justify-between shadow-sm">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 font-serif text-lg font-bold tracking-wide">
          <Scale className="h-5 w-5 text-primary" />
          <span className="bg-gradient-to-r from-primary to-lavender bg-clip-text text-transparent">NDABAS</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-5 tracking-widest text-muted-foreground font-bold">
          <a href="/services" className="hover:text-foreground transition-colors">SERVICES</a>
          <a href="/about" className="hover:text-foreground transition-colors">ABOUT</a>
          <a href="/fees" className="hover:text-foreground transition-colors">FEES</a>
          <a href="/faq" className="hover:text-foreground transition-colors">FAQ</a>
          <a href="/track" className="hover:text-primary transition-colors text-primary font-black">PORTAL</a>
          <a href="/contact" className="hover:text-foreground transition-colors">CONTACT</a>
        </div>

        {/* Theme, Lock, & CTA */}
        <div className="flex items-center gap-2.5">
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
            className="hidden sm:inline-flex bg-foreground text-background dark:bg-foreground dark:text-background tracking-widest font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            BOOK CONSULTATION
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-card/90 border border-border rounded-full text-muted-foreground"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 p-4 bg-card border border-border rounded-3xl flex flex-col gap-3 shadow-lg text-center tracking-widest"
          >
            <a href="/services" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:bg-border/20 rounded-xl">SERVICES</a>
            <a href="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:bg-border/20 rounded-xl">ABOUT</a>
            <a href="/fees" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:bg-border/20 rounded-xl">FEES</a>
            <a href="/faq" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:bg-border/20 rounded-xl">FAQ</a>
            <a href="/track" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:bg-primary/20 rounded-xl font-bold text-primary">PORTAL</a>
            <a href="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:bg-border/20 rounded-xl">CONTACT</a>
            <a href="/admin" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:bg-border/20 rounded-xl font-bold text-accent">STAFF LOGIN</a>
            <a href="/onboard" onClick={() => setMobileMenuOpen(false)} className="bg-foreground text-background font-bold py-3 rounded-full mt-2">BOOK CONSULTATION</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
