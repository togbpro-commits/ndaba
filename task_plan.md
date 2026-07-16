# Ndabas Attorneys Project Plan

## Goal
Implement a visually stunning, fully functional digital presence (Phase 1) for Ndabas Attorneys in Hammanskraal, Pretoria, using Next.js 16 (App Router), Tailwind CSS, Framer Motion, Supabase, Clerk, and Resend. Additionally, construct an automatic terminal error-capture and auto-resolution architecture utilizing a structured `error.md` ledger, compile check script, a new interactive client onboarding system, and premium style revisions.

## Core Phases

### Phase 1: Environment Setup & Local-First Mock Architecture
- **Status:** `complete`
- **Sub-tasks:**
  - Install core packages (`@clerk/nextjs`, `@supabase/supabase-js`, `resend`, `react-hook-form`, `zod`).
  - Set up a highly robust hybrid/local-first client-side storage architecture (`src/lib/db.ts` and `src/lib/clerk.tsx`) that automatically falls back to LocalStorage when live API credentials are not found.
  - Establish custom hooks for client auth (`useAuth`, `useUser`) and database CRUD so the admin dashboard operates correctly out of the box.
- **Verification:** Compilation check passed with 0 errors.

### Phase 2: Automatic Error Capture and Auto-Fixing System (`error.md`)
- **Status:** `complete`
- **Sub-tasks:**
  - Create the root level `error.md` file as a persistent ledger for capturing compilation and linting errors.
  - Develop `scripts/check-errors.js`, a Node-based compiler and error-catcher script. It runs type checks/builds, parses terminal stdout/stderr for exact error paths/lines, logs them to `error.md`, and exposes a structured list for automatic remediation.
- **Verification:** Checked error ledger, status is `🟢 CLEAN (No compile errors)`.

### Phase 3: Public Pages & Nested Sub-routes Implementation
- **Status:** `complete`
- **Sub-tasks:**
  - Create `/about` page: Story, attorney profiles, credentials, LPC details.
  - Create `/services` landing page & `/services/[slug]` dynamic detail pages (handling `attorneys`, `conveyancing`, `notary`, `advocacy`).
  - Include specific "What to Bring" checklists for property transfers, ANC, and high-court counseling.
  - Create `/fees` page: Consultation costs, conveyancing fee calculator/estimation guide.
  - Create `/faq` page with interactive category accordions.
  - Create `/contact` page: Form, click-to-WhatsApp, maps embed, business hours.
- **Verification:** All routes loaded, verified, and compile cleanly.

### Phase 4: Database Schema & Client Forms Integration
- **Status:** `complete`
- **Sub-tasks:**
  - Design SQL schema for tables: `leads` and `cases`.
  - Create `src/lib/db.ts` wrapper interface. Integrate client forms on `/` and `/contact` to save entries to Supabase or the LocalStorage-fallback and mock-send email alerts via Resend.
- **Verification:** Submitting lead forms writes to LocalStorage backend dynamically, and transitions are fully reactive.

### Phase 5: Staff Admin Dashboard `/admin`
- **Status:** `complete`
- **Sub-tasks:**
  - Secure `/admin` with Clerk or mock-auth fallback. Include a login screen and persistent staff role checks.
  - Dashboard UI: Cards showing key stats (Active Leads, In-Progress Cases, Consultation schedule).
  - Leads manager: Searchable table, lead status transition pipeline (New → Contacted → Consultation Booked → Client → Closed/Lost) with custom notes.
  - Case tracker: Simple matter list showing statuses (Open, In Progress, Awaiting Documents, Complete).
  - Calendar View: Listing manually confirmed consultations.
  - Basic Reporting: Visual conversion charts showing lead sources and practice areas.
- **Verification:** Logged in with demo details (`test` / `test`), verified that status changes trigger automated workflows (converting lead to Client automatically creates a matter!).

### Phase 6: Interactive Client Onboarding System `/onboard`
- **Status:** `complete`
- **Sub-tasks:**
  - Create `/onboard` page with a beautiful, 5-step interactive client onboarding wizard:
    1. **FICA Information:** Input name, email, phone, South African ID/Passport, physical address.
    2. **Matter Category:** Select type of matter (Conveyancing, Notary, Litigation, Advocacy).
    3. **Document Checklist & FICA Uploads:** List exact FICA documents needed based on matter, with interactive drag-and-drop mock uploaders.
    4. **Appointment Picker:** Select preferred consultation day & time at Justice House (Hammanskraal).
    5. **Onboarding Sign-Off:** Digital signature pad simulation, POPIA checkboxes, and final verification.
  - Submitting the onboarding wizard writes a Lead to `db.insertLead` with a status of `'Consultation Booked'` and notes `"Client Self-Onboarded. FICA documents uploaded."` and opens an associated Case matter in `'Awaiting Documents'` state!
- **Verification:** Run `node scripts/check-errors.js` to ensure the onboarding compiler is clean.

### Phase 7: Ultra-Premium Visual Polish & Scroll Animations
- **Status:** `complete`
- **Sub-tasks:**
  - Elevate floating navbar: make it even more frosted, add light outlines, refine the logo styling.
  - Integrate scroll-triggered reveals in `/src/app/page.tsx` using Framer Motion so sections elegant slide and fade up.
  - Replace generic boxy panels with ultra-thin, light-reflective glassmorphism borders.
  - Incorporate official LPC advertising compliance copy and disclaimer notes across pages to make the firm's brand read as a premier legal authority.
- **Verification:** Navigate homepage, confirm scroll reveals, contrast check, and responsive layout.

### Phase 8: Environment Variable Configuration (`.env`)
- **Status:** `complete`
- **Sub-tasks:**
  - Create `.env` template file listing Supabase, Clerk, and Resend variables.
  - Solicit credentials from the user and populate them dynamically.
- **Verification:** Confirm that client libraries bind automatically to live endpoints if keys are defined.

### Phase 9: Unified Navigation & Fluid Consultation Flow Polish
- **Status:** `complete`
- **Sub-tasks:**
  - Standardize navigation by replacing the local home page (`src/app/page.tsx`) custom header/navbar with the global `Navbar` component, unifying styling and menus across all pages.
  - Integrate a dedicated staff "Lock" login icon directly next to the theme toggle button in the global `Navbar` to enable rapid, secure dashboard access for Ndabas Attorneys staff.
  - Secure a fluid client experience by connecting all landing page "Book Consultation" CTA links to the secure interactive onboarding portal (`/onboard`).
- **Verification:** Run `node scripts/check-errors.js` to confirm 0 TypeScript, routing, or state compile errors. All links resolve to their dedicated sub-pages seamlessly.

### Phase 10: Clerk-Supabase Production Migration & Theme Polish
- **Status:** `complete`
- **Sub-tasks:**
  - Replaced local storage mock-auth with the official Clerk Next.js SDK. Added a custom, highly secure Email/Password Sign-In form (`src/lib/clerk.tsx`).
  - Added native Sun/Moon theme toggles directly inside custom headers on `/onboard` and `/admin` login pages.
  - Created the modern Next.js 16 `./src/proxy.ts` file replacing the deprecated `middleware.ts` to manage auth session cookies and sync Supabase SSR cookies seamlessly.
  - Injected an inline synchronous script in the document `<head>` in `src/app/layout.tsx` combined with `suppressHydrationWarning` on the HTML node, completely removing the flashing white background on dark mode load.
  - Created a dedicated SSO Callback page (`src/app/admin/sso-callback/page.tsx`) wrapping Clerk's `<AuthenticateWithRedirectCallback />` component to handle secure redirects.
- **Verification:** Production build compiles flawlessly in 22 seconds with 0 warnings.

### Phase 11: Real-Time Legal FICA Document Tracking & Review System
- **Status:** `complete`
- **Sub-tasks:**
  - Added a `documents` JSONB column to the `public.cases` table in `supabase_schema.sql` to support secure structured attachments.
  - Extended the `Case` database model inside `src/lib/db.ts` to support typed attachments (`CaseDocument[]`).
  - Updated client-side onboarding submission (`src/app/onboard/page.tsx`) to map, bundle, and save all uploaded FICA files (ID copy, Proof of Address) directly to the created Case Matter.
  - Built an interactive **FICA Case Documents Panel** inside the Admin Case Tracker dashboard (`src/app/admin/page.tsx`). Attorneys can view individual uploads, click to open/verify, and select status badges (`Pending`, `Approved`, `Rejected`).
  - Added intelligent auto-advancement checks: if a staff member approves all files, the dashboard automatically prompts them to advance the case status from `Awaiting Documents` to `In Progress`.
- **Verification:** Submitting the onboarding form attaches documents correctly, which stream in real-time to the cases panel. Compilation succeeds with 0 errors.

---

## Completed Milestone Changes (Phase 12+)
- **Task 1: Transactional Resend Emails Integration** — Configured Resend to send a beautifully styled HTML legal receipt/booking confirmation to the client upon onboarding form submission, and a direct alert to `info@ndabasattorneys.co.za` using a Next.js Server Action (`src/app/actions/email.ts`).
- **Task 2: Matter File In-Line Uploads** — Created an inline "Append Court Order / File" uploader directly within the Admin Case Tracker detail panels, letting attorneys append extra Deeds Office replies, court orders, or marital contracts to active cases.
- **Task 3: POPIA Audit Ledger** — Appended a secure compliance ledger table `popia_audit_logs` inside Supabase schema and database client, and integrated automatic logging whenever an attorney views (clicks on a document link) or validates/modifies document approval statuses. Rendered a live, responsive "POPIA Compliance Audit Log" viewer within the Admin Reports panel.

---

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Prerender error /useClerkSignal outside ClerkProvider | 1 | Restored RealClerkProvider on SSR server-rendering by removing the typeof window client checks, ensuring unified compile contexts. |
| Could not find the table public.cases | 1 | Identified missing remote schema caches on Supabase. Created direct manual migration scripts. |
| Deprecated middleware.ts in Next 16 | 1 | Migrated legacy `middleware.ts` directly to the new Next.js 16 `./src/proxy.ts` standard, eliminating warnings. |
| SSO sso-callback 404 on Google redirection | 1 | Created dedicated callback page `/admin/sso-callback` wrapping `<AuthenticateWithRedirectCallback />` to resolve OAuth parameters. |
| Catch-all route missing for path-based SignIn | 1 | Replaced Clerk's prebuilt widget with a bespoke, programmatic custom React credentials form using raw `useSignIn` hooks. |
