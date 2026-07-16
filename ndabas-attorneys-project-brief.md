# Ndabas Attorneys ("Justice House") — Full Build Prompt

> Copy this whole document into your AI coding tool (Claude Code, v0, etc.) as the build brief. Section 11 lists the few real-world details still needed from the client before launch.

## 0. Client Snapshot (from signage)
- **Firm:** Ndabas Attorneys, trading as/from "Justice House"
- **Address:** 2208C Block AA Portion 9, Hammanskraal, Gauteng
- **Contact:** Tel 012 711 0427 · Cell 082 490 6285 / 073 478 3775 · info@ndabasattorneys.co.za
- **Services offered:** Attorneys, Conveyancers, Notaries, Advocates
- **Context:** Small local firm, currently relying on signage/word of mouth. Goal is a credible, modern digital presence plus a lightweight internal tool to manage leads and cases — not a full legal-practice-management system.

---

## 1. Design Direction

**Vibe:** modern, premium, calm authority — not the navy-and-gold legal cliché.

- **Palette**
  - Light mode: warm ivory base (`#FAF8F6`), lavender accent (`#C3B1E1`), rose gold accent (`#B76E79` → `#E8C4C0` gradient for CTAs, dividers, icons), charcoal text (`#2A2530`)
  - Dark mode: deep plum-charcoal base (`#1A1620`), lavender-tinted surface panels, rose gold accents (they pop more on dark — use for CTAs and active states)
- **Typography:** elegant serif for headings (Fraunces or Playfair Display) paired with a clean sans for body/UI (Plus Jakarta Sans or Inter)
- **Visual language:** soft glassmorphism cards, subtle rose-gold-to-lavender gradients, generous whitespace, thin metallic-toned dividers, restrained micro-interactions (Framer Motion) — nothing gimmicky, this still needs to read as *trustworthy*
- **Theme toggle:** persistent (remembers choice), defaults to system preference, smooth cross-fade transition, accessible contrast in both modes

**Visual reference (Ambrook-style hero):** the client-approved reference has a specific, replicable anatomy — build the hero to match this structure, just re-skinned into the rose gold/lavender palette instead of Ambrook's full rainbow:

- A **floating pill-shaped navbar**: frosted/glassmorphic (backdrop-blur, semi-transparent dark or light fill depending on theme), fully rounded corners, sitting with margin from the top edge rather than flush — not a traditional full-width bar
- A **soft prismatic glow behind the hero**: a large, heavily-blurred gradient blob/mesh sitting at the top of the page behind a near-white canvas — swap Ambrook's rainbow for a restrained rose-gold → lavender → warm-peach blend so it stays elegant rather than playful
- A **small pill-shaped eyebrow badge** above the headline (e.g. "LEGAL SERVICES"), tiny uppercase tracked-out text
- A **large two-line headline** mostly in charcoal, with one or two words per line rendered in a rose-gold-to-lavender gradient fill — mirrors how Ambrook colors individual words ("al", "your", "ork") rather than whole lines
- A **short one-to-two-line subhead** in muted gray, centered, well below the headline
- A **single dark, pill-shaped primary CTA button** with a small trailing arrow icon — no secondary button crowding the hero itself
- Below the fold of the hero: a **horizontal rail of rounded-corner image cards**, each with a small uppercase label sitting above it — see Section 4 for how this maps to practice areas instead of Ambrook's industries

---

## 2. Tech Stack

- **Framework:** Next.js 16 (App Router), TypeScript
- **Styling:** Tailwind CSS + shadcn/ui, theme via CSS variables for light/dark
- **Animation:** Framer Motion (subtle — page transitions, hover states, section reveals)
- **Auth (dashboard only):** Clerk
- **Database:** Supabase (Postgres + Storage + Row Level Security)
- **Forms/validation:** React Hook Form + Zod
- **Transactional email:** Resend (booking confirmations, new-lead alerts)
- **File storage:** Supabase Storage (ID copies, POA, deed documents — Phase 2)
- **Maps:** Google Maps embed
- **Analytics:** Vercel Analytics or Plausible (privacy-friendly — relevant under POPIA)
- **Hosting:** Vercel
- **WhatsApp:** `wa.me` click-to-chat links (not the Business API yet — see Phase 2). This matters more than a contact form here: the signage itself leads with two cell numbers, which signals WhatsApp/call is the real primary channel for this audience.

---

## 3. Sitemap

**Public**
- `/` — Home
- `/about` — Firm story, attorney profiles, credentials
- `/services` — Overview, linking to:
  - `/services/attorneys`
  - `/services/conveyancing`
  - `/services/notary`
  - `/services/advocacy`
- `/fees` — General consultation/process info (guidance only, not binding quotes)
- `/faq`
- `/contact`
- `/legal-insights` (optional, Phase 2 — blog for local SEO)

**Private**
- `/admin` — staff dashboard, Clerk-gated
- `/portal` — client case-status portal (Phase 2, not v1)

---

## 4. Landing Page — Section by Section

1. **Hero** — built to the visual reference above:
   - Floating glass pill navbar: logo left, nav links (Services / About / Fees / Contact) center, "Book Consultation" pill button right
   - Blurred rose-gold/lavender glow at the top of the page behind the content
   - Small pill eyebrow badge: "ATTORNEYS · CONVEYANCERS · NOTARIES · ADVOCATES"
   - Two-line headline, one key word per line in the gradient fill — e.g. "Legal guidance **worthy** of your trust" (or similar, client to approve final copy)
   - One-line subhead: what the firm does and where ("Ndabas Attorneys brings property law, notarial services, and litigation together for Hammanskraal and beyond")
   - Single dark pill CTA: "Book a Consultation →". Keep phone/WhatsApp as a smaller secondary link near it, not a second competing button
   - Directly below the hero: horizontal rail of rounded image cards with small uppercase labels above each — use this rail *as* the services section (see below), replacing a separate boxy services grid

2. **Practice area rail** (replaces a plain services grid, styled like the reference's industry strip)
   - Labeled rounded-corner photo cards in a horizontal row: **ATTORNEYS · CONVEYANCING · NOTARY SERVICES · ADVOCACY**, optionally split into two groups of two with a subtle rose-gold decorative divider between them (echoing the botanical accent in the reference, but abstract — e.g. a thin flowing line or scale-of-justice line art, not literal flowers)
   - Each card links through to its `/services/[slug]` detail page

3. **Trust bar** — years in practice, Legal Practice Council membership, areas served

4. **Why this firm** — local presence in Hammanskraal, personal service, language accessibility, transparent process

5. **Team preview** — photo(s), credentials, admission status, link to full `/about`

6. **How it works** — 3–4 step visual (Contact → Consultation → Case Handled → Resolved/Registered), especially useful for setting expectations on conveyancing timelines

7. **Testimonials** — carousel, only with written client consent to publish (POPIA)

8. **FAQ accordion** — per service line (e.g. "How long does a property transfer take?")

9. **Contact section** — form (name, phone, email, service needed, message) that creates a Lead in the dashboard, sends a Resend email notification, embedded map, click-to-call, click-to-WhatsApp, business hours

10. **Footer** — nav, social, "this site does not constitute legal advice" disclaimer, privacy policy (POPIA), practice/registration number if supplied

---

## 5. Client-Facing Features (deliberately minimal)

- **Consultation request form** — not a live calendar sync. It creates a "Booking Request" in the dashboard; staff confirm manually by phone/WhatsApp. A synced calendar is unnecessary complexity for a firm this size right now.
- **WhatsApp click-to-chat** as the primary lead channel
- **Contact form with service-type dropdown** — auto-tags the lead by practice area
- **"What to bring" checklists** per service (e.g. documents needed for a property transfer) — cuts down back-and-forth calls

---

## 6. Admin Dashboard — the real value-add

This is a lean CRM for a small firm, **not** a full legal practice management system.

- **Auth:** Clerk, a handful of staff logins, simple admin/staff roles
- **Dashboard home:** snapshot — new leads this week, upcoming consultations, anything overdue for follow-up
- **Leads table:** from contact + booking forms, pipeline status (New → Contacted → Consultation Booked → Client → Closed/Lost), notes, source tag, service tag
- **Lightweight case tracker:** one record per client matter — status (Open / In Progress / Awaiting Documents / Complete), practice area, key dates. Intentionally *not* a full matter-management module.
- **Client directory:** basic contact records for converted leads
- **Calendar view:** manually-confirmed consultations
- **Basic reporting:** leads by source/practice area, month-over-month conversion — useful for the firm to see if the site/marketing is working
- **Notifications:** email (and optionally WhatsApp) alert on new lead

**Phase 2, not v1:** document inbox for client-uploaded files, client-facing case-status portal, WhatsApp Business API automation.

---

## 7. Explicit Non-Goals (keep it simple)

- No trust accounting / billing software — that's a job for dedicated legal practice management tools, not a website build
- No e-signature or e-filing integration in v1
- No multi-branch/multi-tenant architecture
- No public client login in v1 — validate the lead/case-tracker workflow first, then decide if a portal is worth building

---

## 8. South Africa–Specific Compliance Notes

- **POPIA:** privacy policy, consent checkbox on all forms, secure storage for any personal documents
- **Legal Practice Council advertising rules:** avoid superlative or misleading claims ("best attorneys in Gauteng"), no guaranteed-outcome language, include practice/registration number in the footer once the client supplies it
- Dashboard availability depends on the client's own internet/power — the public site on Vercel is unaffected by local load-shedding

---

## 9. Delivery Phasing

- **Phase 1:** full landing page (all sections above), contact + booking forms, admin dashboard v1 (leads, calendar, lead-lite case tracker, basic reporting)
- **Phase 2:** client portal, document upload/inbox, `/legal-insights` blog for SEO, WhatsApp Business API automation

---

## 10. Still Needed From the Client Before Build

- Confirmed firm name and any logo/brand assets they already have
- Attorney bios, photos, admission numbers
- Practice number / Legal Practice Council registration details
- High-resolution premises photos (or schedule a shoot)
- Written testimonial consent from any clients to be quoted
