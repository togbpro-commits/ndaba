import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Scale, MapPin, Smartphone, Clock, CheckCircle2 } from 'lucide-react';

export default function OfficesPage() {
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
          <span className="font-mono text-[10px] tracking-[0.25em] text-primary font-bold block">OFFICE DIRECTIONS & OPERATIONS</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-foreground leading-tight">
            Our Pretoria Offices &<br />&quot;Justice House&quot; Location
          </h1>
          <div className="h-[2px] w-20 bg-primary mt-4"></div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p className="text-foreground font-medium text-base">
            Our main practice chambers operate out of &quot;Justice House&quot; in Hammanskraal, Pretoria, providing professional legal services to the communities of northern Gauteng and surrounding regions.
          </p>

          <p>
            Whether you are visiting for property transfer deed signatures, antenuptial contract notary seals, or litigation pleadings review, our offices are fully equipped with dedicated legal consultation suites.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Physical Address</h3>
              <p className="text-xs leading-relaxed font-sans">
                Justice House,<br />
                2208C Block AA Portion 9,<br />
                Hammanskraal, Pretoria, 0400
              </p>
            </div>

            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <Smartphone className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Contact Support</h3>
              <p className="text-xs leading-relaxed font-sans">
                Tel: 012 711 0427<br />
                Email: info@ndabasattorneys.co.za<br />
                WhatsApp: Direct Bot Portal
              </p>
            </div>

            <div className="border border-border/80 bg-background/50 rounded-2xl p-5 space-y-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground text-sm">Operating Hours</h3>
              <p className="text-xs leading-relaxed font-sans">
                Mon - Fri: 08:00 - 16:30<br />
                Sat: By Appointment Only<br />
                Sun: Closed (Compliance Audits)
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/60">
            <h3 className="font-serif text-foreground font-bold text-lg">In-Office Consulting Guidelines</h3>
            <p>
              To ensure compliance with statutory guidelines and protect personal privacy under the POPIA Act, please review the following parameters before your scheduled appointment:
            </p>

            <ul className="space-y-2 text-xs font-sans">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Bring Original Certified IDs:</strong> Photocopied digital scans are permitted for initial online onboarding, but the physical presentation of certified original papers is mandated for notary signing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Deed of Sale Signatures:</strong> All named parties in property transfers must attend in-person to execute deeds of transfer unless prior arrangements have been authorized.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span><strong>Virtual Consultation:</strong> Secure video consultations can be facilitated upon request for clients who are unable to visit our Hammanskraal offices physically.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
