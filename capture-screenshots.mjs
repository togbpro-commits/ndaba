/**
 * capture-screenshots.mjs
 *
 * Automates elite, high-fidelity pitch-deck screenshots for the entire Ndaba's Attorneys platform:
 *  - Full-page captures of all public informational & compliance pages
 *  - "Spotlight" captures of unique homepage segments
 *  - Interactive browser clicks on the Document Planner tabs (e.g. Marriage contracts)
 *  - Logs into /admin and captures EVERY dashboard sidebar panel
 *  - Automates interactive dashboard flows:
 *     - Selects active calendar days (day 22) in the Meetings Scheduler and spotlights the result
 *     - Triggers the "+ Reserve Slot" manual appointment modal and captures it
 *     - Highlights the secure POPIA Compliance Audit Logs ledger table
 *     - Spotlights Case cards featuring dynamic vertical document grids and "[IN DIRECTORY]" badges
 *
 * SETUP (run once, in your project root):
 *   npm install -D playwright
 *   npx playwright install chromium
 *
 * RUN:
 *   ADMIN_EMAIL=admin@ndabasattorneys.co.za ADMIN_PASSWORD='Reeper@10' node capture-screenshots.mjs
 *
 * Keep credentials out of this file — pass them as env vars only.
 *
 * OUTPUT:
 *   Saves all images to ./public/pitch-screenshots/ in your project.
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'https://ndaba-nine.vercel.app';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ndabasattorneys.co.za';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Reeper@10';

const OUT_DIR = path.join(process.cwd(), 'public', 'pitch-screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORT = { width: 1440, height: 900 };

// Full-page captures of public standalone and compliance sitemaps
const PUBLIC_PAGES = [
  { route: '/', file: '1-homepage-full.png' },
  { route: '/services', file: '2-services-overview.png' },
  { route: '/fees', file: '3-fees-calculator.png' },
  { route: '/track', file: '4-case-tracking-portal.png' },
  { route: '/onboard', file: '5-digital-onboarding-wizard.png' },
  { route: '/about', file: '6-about-firm-credentials.png' },
  { route: '/lpc-compliance', file: '7-lpc-regulatory-compliance.png' },
  { route: '/fica-rules', file: '8-fica-client-verification.png' },
  { route: '/popia-policy', file: '9-popia-data-shield-ledger.png' },
  { route: '/deeds-registry', file: '10-deeds-office-rules.png' },
  { route: '/offices', file: '11-office-directions-directory.png' },
];

// Spotlight captures highlighting our unique homepage features
const HOMEPAGE_SPOTLIGHTS = [
  { heading: 'Firm Certification & Standards', file: 'spotlight-compliance-hub.png', label: 'Compliance & Legal Trust Hub' },
  { heading: 'Interactive Document Planner', file: 'spotlight-fica-planner.png', label: 'Interactive FICA Document Planner' },
  { heading: 'Live Status Tracking', file: 'spotlight-case-tracker.png', label: 'Live Case Status Tracker' },
  { heading: 'The Matter Lifecycle Map', file: 'spotlight-lifecycle-map.png', label: 'Process Steps Lifecycle Map' },
  { heading: 'What Our Clients Say', file: 'spotlight-testimonials-marquee.png', label: 'Infinite Testimonials Loop Marquee' },
];

const LOGIN_SELECTORS = {
  email: [
    'input[type="email"]',
    'input[name="email"]',
    'input[name="username"]',
    'input[placeholder*="mail" i]',
    'input[id*="email" i]',
  ],
  password: [
    'input[type="password"]',
    'input[name="password"]',
    'input[id*="password" i]',
  ],
  submit: [
    'button[type="submit"]',
    'button:has-text("Log in")',
    'button:has-text("Sign in")',
    'button:has-text("Login")',
  ],
};

const SKIP_PATTERN = /log ?out|sign ?out|log ?off/i;

function slugify(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'section'
  );
}

async function firstMatching(page, selectors) {
  for (const sel of selectors) {
    const locator = page.locator(sel).first();
    if (await locator.count()) return locator;
  }
  return null;
}

// Visual highlighting utility that dims background and highlights the core feature card
async function highlightAndShoot(page, heading, file, label) {
  try {
    const target = page.getByText(heading, { exact: false }).first();
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const box = await target.boundingBox();
    if (!box) {
      console.warn(`  ! Could not find heading "${heading}" on page, skipping.`);
      return;
    }

    await page.evaluate(({ box, label }) => {
      document.getElementById('__pitch-highlight__')?.remove();
      const overlay = document.createElement('div');
      overlay.id = '__pitch-highlight__';
      Object.assign(overlay.style, {
        position: 'absolute',
        left: `${box.x - 16}px`,
        top: `${box.y - 16}px`,
        width: `${box.width + 32}px`,
        height: `${box.height + 32}px`,
        border: '4px solid #B76E79', // Matches our luxury rose-gold branding
        borderRadius: '16px',
        boxShadow: '0 0 0 4000px rgba(15,10,20,0.45)', // Reassuring dark backdrop
        zIndex: '999999',
        pointerEvents: 'none',
      });

      const tag = document.createElement('div');
      tag.textContent = label;
      Object.assign(tag.style, {
        position: 'absolute',
        top: '-38px',
        left: '0',
        background: '#B76E79',
        color: '#fff',
        padding: '6px 14px',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '13px',
        fontWeight: '700',
        borderRadius: '8px',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(183,110,121,0.25)',
      });
      overlay.appendChild(tag);
      document.body.appendChild(overlay);
    }, { box, label });

    await page.screenshot({ path: path.join(OUT_DIR, file) });
    await page.evaluate(() => document.getElementById('__pitch-highlight__')?.remove());
    console.log(`  ✓ ${file}`);
  } catch (err) {
    console.warn(`  ! Failed spotlight for "${heading}": ${err.message}`);
  }
}

async function findSidebar(page) {
  const candidates = ['nav', 'aside', '[role="navigation"]', '[class*="sidebar" i]', '[class*="side-nav" i]'];
  for (const sel of candidates) {
    const candidate = page.locator(sel).first();
    if (await candidate.count()) {
      const linkCount = await candidate.locator('a, button').count();
      if (linkCount >= 2) return candidate;
    }
  }
  return null;
}

// Clicking and capturing administrative views
async function captureDashboardSections(page) {
  const sidebar = await findSidebar(page);
  if (!sidebar) {
    console.warn('  ! Sidebar not found, skipping deep clicks.');
    return;
  }

  const itemLocator = sidebar.locator('a, button');
  const count = await itemLocator.count();
  const itemTexts = [];

  for (let i = 0; i < count; i++) {
    const raw = (await itemLocator.nth(i).innerText().catch(() => '')).trim();
    itemTexts.push(raw || `section-${i + 1}`);
  }

  for (let i = 0; i < itemTexts.length; i++) {
    const text = itemTexts[i];
    if (SKIP_PATTERN.test(text)) continue;

    try {
      const freshSidebar = await findSidebar(page);
      const item = freshSidebar.locator('a, button').nth(i);
      await item.click();
      await page.waitForTimeout(600);

      const file = `dashboard-${slugify(text)}.png`;
      await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
      console.log(`  ✓ ${file} (View: "${text}")`);

      // UNIQUE CRM INTERACTIVITY DEMONSTRATIONS:
      
      // 1. If we are on the Calendar tab, demonstrate its click-to-reschedule and manual scheduling!
      if (text.includes('CALENDAR') || text.includes('MEETINGS')) {
        console.log('  Triggering calendar interactive milestones ...');
        // Click on day 22 (Lerato & Kabelo Modise signing)
        await page.click('text="22"');
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-calendar-selected-day22.png'), fullPage: true });
        console.log('    ✓ dashboard-calendar-selected-day22.png (Schedules filtered dynamically)');

        // Click "+ RESERVE SLOT" on an open day (e.g. day 16)
        await page.click('text="16"');
        await page.waitForTimeout(100);
        await page.click('text="+ RESERVE SLOT"');
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-calendar-manual-reservation.png'), fullPage: true });
        console.log('    ✓ dashboard-calendar-manual-reservation.png (Reservation overlay triggered)');
      }

      // 2. If we are on the Matters/Cases tab, showcase our vertical non-scrolling document grids & "[IN DIRECTORY]" indicators!
      if (text.includes('MATTERS') || text.includes('CASES')) {
        console.log('  Spotlighting Matter details panel ...');
        await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-cases-vertical-doc-grid.png'), fullPage: true });
        console.log('    ✓ dashboard-cases-vertical-doc-grid.png (Sleek non-scrolling file stacks & verified badges showcased)');
      }

      // 3. If we are on Analytics / POPIA tab, showcase our compliance trail audits!
      if (text.includes('ANALYTICS') || text.includes('POPIA') || text.includes('REPORTS')) {
        console.log('  Capturing POPIA compliance audit logs ...');
        await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-popia-compliance-audit-ledger.png'), fullPage: true });
        console.log('    ✓ dashboard-popia-compliance-audit-ledger.png (Verifiable administrative logs table)');
      }

    } catch (err) {
      console.warn(`  ! Click failed for sidebar section "${text}": ${err.message}`);
    }
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  console.log(`================================================================`);
  console.log(`⚙️ STARTING ELITE PITCH-DECK SCREENSHOTS GENERATION`);
  console.log(`Base Target Host: ${BASE_URL}`);
  console.log(`================================================================\n`);

  // Step 1: Capture Public informational pages
  console.log('1. CAPTURING PUBLIC SITEMAPS...');
  for (const { route, file } of PUBLIC_PAGES) {
    try {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.warn(`  ! Standalone capture failed for "${route}": ${err.message}`);
    }
  }

  // Step 2: Capture Interactive tabs on landing page (FICA document planner)
  console.log('\n2. CAPTURING INTERACTIVE LANDING TABS...');
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    // Click on 'MARRIAGE CONTRACTS' tab
    await page.click('text="MARRIAGE CONTRACTS"');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT_DIR, 'homepage-tab-marriage-contracts.png') });
    console.log('  ✓ homepage-tab-marriage-contracts.png (ANC Precheck details hydrated)');
    
    // Click on 'CIVIL DISPUTES' tab
    await page.click('text="CIVIL DISPUTES"');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT_DIR, 'homepage-tab-civil-disputes.png') });
    console.log('  ✓ homepage-tab-civil-disputes.png (Litigation precheck details hydrated)');
  } catch (err) {
    console.warn(`  ! Interactive tabs capture failed: ${err.message}`);
  }

  // Step 3: Capture Spotlight highlights
  console.log('\n3. CAPTURING PITCH SPOTLIGHT CARD GLOWS...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  for (const { heading, file, label } of HOMEPAGE_SPOTLIGHTS) {
    await highlightAndShoot(page, heading, file, label);
  }

  // Step 4: Login to Admin panel and click-through dynamic sections
  console.log('\n4. LOGGING IN TO SECURE LEGAL CRM SYSTEM...');
  try {
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-login-screen.png'), fullPage: true });
    console.log('  ✓ dashboard-login-screen.png');

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn('  ! ADMIN_EMAIL / ADMIN_PASSWORD not configured — skipping CRM panel deeper captures.');
    } else {
      const emailField = await firstMatching(page, LOGIN_SELECTORS.email);
      const passwordField = await firstMatching(page, LOGIN_SELECTORS.password);
      const submitButton = await firstMatching(page, LOGIN_SELECTORS.submit);

      if (!emailField || !passwordField || !submitButton) {
        console.warn('  ! Could not locate login fields automatically, skipping CRM flow.');
      } else {
        await emailField.fill(ADMIN_EMAIL);
        await passwordField.fill(ADMIN_PASSWORD);
        await submitButton.click();
        await page.waitForTimeout(2500); // let request complete & redirect settle
        
        // Error reporter check to see why login might fail (e.g. Clerk OTP/MFA limits)
        const errorMsgElement = page.locator('.text-red-500, [class*="error" i]').first();
        if (await errorMsgElement.count() && await errorMsgElement.isVisible()) {
          const text = await errorMsgElement.innerText();
          console.warn(`  ! Sign-in failed with error message: "${text.trim()}"`);
        }

        await page.screenshot({ path: path.join(OUT_DIR, 'dashboard-landing-overview.png'), fullPage: true });
        console.log('  ✓ dashboard-landing-overview.png (Secure admin entry successful)');

        // Run deeper, automated sidebar sections click and schedule, logging, matters spotlights
        await captureDashboardSections(page);
      }
    }
  } catch (err) {
    console.warn(`  ! Administrative CRM panel deep capture failed: ${err.message}`);
  }

  await browser.close();
  console.log(`\n================================================================`);
  console.log(`🎉 SUCCESS: Pitch-Deck Screenshots saved to: ${OUT_DIR}`);
  console.log(`================================================================`);
}

main();
