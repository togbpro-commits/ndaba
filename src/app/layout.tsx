import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@/lib/clerk";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Production-grade SEO Metadata Config for South African Legal Search Engines
export const metadata: Metadata = {
  metadataBase: new URL("https://ndabasattorneys.co.za"),
  title: {
    default: "Ndaba's Attorneys | Conveyancers & Notaries Pretoria",
    template: "%s | Ndaba's Attorneys"
  },
  description: "Ndaba's Attorneys (Justice House, Hammanskraal) is a premier law firm specializing in property conveyancing deeds, antenuptial notary public contracts, and High Court civil litigation across Pretoria and Gauteng. Book secure digital onboarding and track your case live.",
  keywords: [
    "Ndaba's Attorneys",
    "Ndabas Attorneys",
    "Conveyancers Hammanskraal",
    "Notary Public Pretoria",
    "Antenuptial Contract ANC Pretoria",
    "Deeds Registry Property Transfer",
    "Justice House Hammanskraal",
    "High Court Advocates Pretoria",
    "Bilingual lawyers Pretoria",
    "LPC compliant lawyers Gauteng",
    "South African FICA verification",
    "POPIA data protection legal file"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Ndaba's Attorneys | Expert Property Transfers & Notary Public Pretoria",
    description: "Secure digital legal onboarding, real-time conveyancing tracking, and professional notary public registrations at Justice House, Hammanskraal.",
    url: "https://ndabasattorneys.co.za",
    siteName: "Ndaba's Attorneys CRM",
    type: "website",
    locale: "en_ZA",
    images: [
      {
        url: "/next.svg", // Fallback, would be a beautifully designed OG card image in production
        width: 1200,
        height: 630,
        alt: "Ndaba's Attorneys - Justice House Pretoria"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Ndaba's Attorneys | Conveyancers & Notaries Pretoria",
    description: "Secure digital legal onboarding and real-time conveyancing tracking at Justice House, Hammanskraal.",
    images: ["/next.svg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Production JSON-LD LocalBusiness (LegalService) structured schema markup
  const legalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Ndaba's Attorneys",
    "image": "https://ndabasattorneys.co.za/next.svg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2208C Block AA Portion 9",
      "addressLocality": "Hammanskraal",
      "addressRegion": "Gauteng",
      "postalCode": "0400",
      "addressCountry": "ZA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-25.396839",
      "longitude": "28.279812"
    },
    "telephone": "+27127110427",
    "email": "info@ndabasattorneys.co.za",
    "url": "https://ndabasattorneys.co.za",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "16:30"
      }
    ],
    "priceRange": "$$",
    "legalName": "Ndaba's Attorneys Incorporated",
    "foundingDate": "2011",
    "knowsAbout": [
      "Property Law & Conveyancing Deeds",
      "Notary Public Acts & Antenuptial Contracts (ANC)",
      "High Court Trial Advocacy & Civil Litigation",
      "LPC & FICA Compliance Auditing"
    ],
    "location": {
      "@type": "Place",
      "name": "Justice House Chambers",
      "hasMap": "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d9082.111169207259!2d28.27981265033269!3d-25.396839162782015!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjXCsDIzJzU2LjQiUyAyOMKwMTYnNTcuNyJF!5e0!3m2!1sen!2sza!4v1784263716857!5m2!1sen!2sza"
    }
  };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking script to prevent theme flashing on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ndaba_theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && systemDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Structured JSON-LD LocalBusiness Schema Markup for top Google search placements */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(legalServiceSchema)
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ClerkProvider>
          {children}
        </ClerkProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}