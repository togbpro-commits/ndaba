# Ndabas Attorneys Findings

## Project Baseline Analysis
- **Tech Stack:** Next.js 16 (App Router) + Tailwind CSS + Lucide Icons + Framer Motion.
- **Existing Page Structure:** The root landing page (`src/app/page.tsx`) contains an elegant modern layout with a floating pill navbar, hero section, practice areas grid, why-choose-us details, a standard client request form, and contact card. However, there are no nested sitemap pages fully implemented, no database connections, no authentication integration, and no admin dashboard functionalities.
- **Client Signage/Assets:**
  - Firm name: Ndabas Attorneys ("Justice House")
  - Address: 2208C Block AA Portion 9, Hammanskraal, Gauteng
  - Contact: 012 711 0427 / 082 490 6285 / 073 478 3775 / info@ndabasattorneys.co.za

## Hybrid/Mock Architecture Strategy
- To provide a fully functional, out-of-the-box demo without forcing immediate live credentials, we will create a lightweight hybrid bridge (`db.ts` / `auth.ts`) which:
  1. Detects `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
  2. If missing, automatically binds all operations to a robust `LocalStorage` implementation on the browser.
  3. This ensures that form submissions, lead pipelines, admin dashboards, case trackers, and auth screens function flawlessly during client demonstrations.

## Phase 12+ Specialized Technical Findings
1. **Immutable process.env in Next.js Serverless/Edge Environments:** Attempting to programmatically delete or override loaded environment variables in the Next.js execution context (e.g., `delete process.env.INNGEST_SIGNING_KEY`) fails silently because `process.env` is proxied or compiled as read-only. Specifying parameters explicitly on the constructor options (e.g., `signingKey: process.env.NODE_ENV === "development" ? "" : process.env.INNGEST_SIGNING_KEY` on `new Inngest`) is the correct, robust pattern.
2. **Normalization of Contact Details on Matters:** Relying on fuzzy name matching between the `cases` table and `leads` table to extract client contact details is unstable (e.g., during self-onboarding or manual client generation). Extending the `cases` table to carry `client_email` and `client_phone` directly ensures total data integrity, enables accurate multi-channel notifications (Email/WhatsApp), and secures the WhatsApp bot verification loop.
3. **AnimatePresence & Layout Jumps:** Instant state-driven rendering changes on lists feel abrupt to users. Wrapping mapped items in Framer Motion's `<AnimatePresence mode="popLayout">` and assigning a `layout` attribute to the container items creates highly refined fluid transitions as cards dynamically exit or re-arrange.
