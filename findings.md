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
