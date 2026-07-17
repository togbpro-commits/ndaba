# Ndaba's Attorneys Incorporated — Legal CRM & Client Portal

A visually stunning, high-density, and fully integrated legal CRM, administrative dashboard, and client onboarding portal for **Ndaba's Attorneys Incorporated** trading from the historic **"Justice House"** in Hammanskraal, Pretoria. 

This platform leverages modern web standards to fast-track property conveyancing transfers, automate antenuptial notary contracts, and manage High Court civil litigation briefs across Pretoria and Gauteng.

---

## ⚖️ Executive Project Overview

Ndaba's Attorneys departs from the cold, unapproachable "navy-and-gold" branding of legacy legal firms. It introduces a luxury, reassuring, and responsive design system built on **rose gold, lavender, warm ivory, and dark charcoal**.

The system merges a comprehensive public legal resource sitemap with an integrated, highly interactive back-office CRM, providing South African clients with absolute transparency, bilingual accessibility (Sotho, Tswana, Zulu, English), and real-time case milestone tracking.

---

## 🚀 Key Functional Systems

### 1. Secure Client Onboarding Wizard (`/onboard`)
A highly structured, multi-step digital wizard that collects client information and FICA documentation programmatically before their first physical consultation at Justice House.
* **Dual Onboarding Pathways:**
  * **General Onboarding Path:** Accessible generally from the site. Defaults the matter type to `General Legal Inquiry / Other` and only requests standard FICA files (Certified ID smart card and Proof of Address statement) to bypass specialized requirements.
  * **Pre-Checklist Onboarding Path:** Seamlessly accessed from the FICA pre-check document planner on the landing page (e.g. `/onboard?matter=conveyancing` or `/onboard?matter=notary`). Automatically hydrates the state and locks in the specific checklist required for that legal division.
* **Layout-Stable Checklist Cards:** Checklist cards are structured as a horizontal flex row with a locked height boundary (`h-10`) for the action slots. Uploading files displays individual progress loaders and success badges **without causing any layout shifting or vertical jumping**.
* **Touchscreen Canvas Signature Pad:** Integrates specialized touch event listeners (`onTouchStart`, `onTouchMove`, and `onTouchEnd`) with page-scroll blocking (`e.preventDefault()`), allowing clients to draw legal signatures using their fingers smoothly on mobile phones and tablets.

### 2. Live Digital Case Tracker Portal (`/track`)
Clients can query their active cases instantly by entering their Case ID (e.g. `case-1`) or Matter Number (e.g. `NDB-2026-1001`).
* **Supabase Live Sync:** Fetches real-time status direct from Postgres.
* **Visual Milestones Progress:** Animates through critical legal gates: *File Opened*, *FICA Approved*, *In Progress*, and *Completed*.
* **Audited Files Access:** Displays verified document lists and milestones notes.

### 3. Administrative Control Panel (`/admin`)
A comprehensive, secure dashboard for Advocate Ndaba and Justice House practitioners to manage the entire legal lifecycle:
* **Leads Pipeline:** Lists incoming client inquiries with active filters, contact conversions, and automated, beautiful transactional emails (powered by Resend).
* **Case Matters Directory:** Allows admins to update matter milestones, upload new documents to case cards, and approve or reject client-submitted FICA files.
* **Interactive Meetings Scheduler:**
  * **Visual Month Grid (July 2026):** Highlighted cards indicate active consultation days. Selecting a day updates focus and filters the schedules dynamically.
  * **matters Brief Panel:** Renders current schedules, time, and details for the selected day.
  * **CRUD Operations & Reminders:** Allows admins to manually reserve slots (`+ RESERVE SLOT` with inline forms), dispatch client reminders (`[✉️ REMINDER]` with Toast feedback), or reschedule appointments (`[CLOCK RESCHEDULE]` with input validators), dynamically updating the calendar grid.
  * **Client Directory Sync (`[ADD DIRECTORY]`):** Case cards automatically scan contacts. If the client is already registered as a Contact, it displays a green checkmark **`[IN DIRECTORY]`** badge; otherwise, it offers an instant one-click contact creation button.
* **POPIA Security Audit Log:** Renders full-spectrum compliance logs ledger tracking all administrative data actions (`Viewed`, `Approved`, `Rejected`, `Uploaded`) under strict POPIA rules.

### 4. Interactive Conveyancing Cost Calculator (`/fees`)
A production-grade South African property transfer cost estimator:
* **SARS Transfer Duty Tax Brackets:** Calculates exact statutory duties including the R1,100,000 exemption threshold.
* **Deeds Office Statutory Fees:** Fits the latest South African Deeds Registry tariff schedules.
* **LPC Professional Fees:** Automatically approximates recommended professional fees based on purchase brackets.
* **Symmetrical Sizing:** Re-aligned using Tailwind Flexbox `items-stretch` so the input fields card on the left and the breakdown card on the right share identical vertical heights.

---

## 🛠️ Technology Stack

* **Framework:** Next.js 16 (App Router) compiled under **Turbopack** for rapid local increments.
* **Aesthetics & Styling:** Tailwind CSS + Lucide Icons + Framer Motion.
* **Identity & Authentication:** Clerk programmatically secured.
* **Database & Live Sync:** Supabase (PostgreSQL Database Client & Cloud Storage Buckets).
* **Job Processor Queue:** Inngest durable background executors.
* **Email System:** Resend Transactional Email Server API.

---

## 🎯 Production Search Engine Optimization (SEO)

We implement a complete, rock-solid SEO strategy inside Next.js 16 to dominate local legal Google Searches across Pretoria and Gauteng:
1. **Metadata Configurations (`src/app/layout.tsx`):** Complete layout metadata including canonical alternates, localized keywords, search crawler instructions (`robots`), OpenGraph share cards, and summary Twitter cards.
2. **JSON-LD LegalService Schema (`src/app/layout.tsx`):** A fully structured JSON-LD local business schema inside the layout `<head>`. Maps coordinates (`-25.396839, 28.279812`), telephone (`+27127110427`), and hours, securing top Google map and rich-search card placements.
3. **Dynamic XML Sitemap (`src/app/sitemap.ts`):** Automatically compiles all 16 legal compliance and resource routes for search engine indexing.
4. **Crawl Rules (`public/robots.txt`):** Instructs search crawlers to scan all public legal resource routes while blocking them from sensitive administrative folders (`/admin/`, `/api/`).

---

## 📱 Mobile Usability & Styling Compliance

Our platform is meticulously tailored to mobile and tablet screen viewports:
* **Edge-to-Edge Navbar:** Replaced container constraints, borders, and card blurs with a flat, transparent, spacious edge-to-edge layout on mobile, keeping the premium frosted pill layout intact for desktops.
* **Scroll-Leak Prevention:** Open mobile menus apply `overflow: hidden` and `touch-action: none` on both `html` (`documentElement`) and `body` nodes, freezing background scrolling and preventing mobile address bar resizing.
* **Dynamic Viewport Heights:** The sliding drawer container uses `h-[100dvh]` to lock the height precisely to the active visible viewport, preventing drifting or vertical clipping.
* **Top-Right Toasts:** Repositioned Toast Alerts to float at the top-right (`top-6 right-6`) of mobile viewports, avoiding any overlaps with bottom navigation bars.
* **Non-Scrolling Case Documents:** Case cards display attached documents as a vertical grid of slim rows (`max-h-[160px] overflow-y-auto custom-card-scrollbar`) instead of horizontal sliders. Displays all documents at once, scrolling with an elegant, custom-designed 4px rose gold scrollbar.

---

## 📱 WhatsApp Chatbot CRM Integration (Future Setup)

Our complete architectural blueprint for the WhatsApp Business API chatbot is located at **`whatsapp.md`** in the project root folder. It outlines:
* Meta developer account setup and ngrok proxy tunneling during local development.
* API Webhook handshake and webhook POST payload parsing.
* Chatbot dialog flows (Matter tracker queries, outstanding FICA lists, and direct media-picture uploads to Supabase storage folders).

---

## 💻 Local Development Setup

To boot and run the unified dev stack locally, execute the following commands concurrently:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start local Next.js Web Server (Turbopack)
```bash
npm run dev
```
The server will boot under: `http://localhost:3000`

### 3. Start local Inngest Job Queue
```bash
npm run inngest
```
Runs `npx inngest-cli@latest dev` under port `8288` to process background queues.

### 4. Compile Check / Type-Safety Verification
```bash
node scripts/check-errors.js
```
Triggers `npx tsc --noEmit` and checks the sitemap files, updating the `error.md` compile ledger automatically.
