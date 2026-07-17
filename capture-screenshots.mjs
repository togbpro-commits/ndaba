/**
 * capture-screenshots.mjs
 *
 * Automates pitch-deck screenshots for the Ndabas Attorneys site:
 *  - Full-page captures of key public pages
 *  - "Spotlight" captures of specific features on the homepage
 *    (dims the rest of the page, puts a red outline + label on the feature)
 *  - Logs into /admin and captures EVERY view reachable from the dashboard
 *    sidebar, clicking each link/button in turn and screenshotting the
 *    resulting content
 *
 * SETUP (run once, in your project root):
 *   npm install -D playwright
 *   npx playwright install chromium
 *
 * RUN:
 *   ADMIN_EMAIL=admin@ndabasattorneys.co.za ADMIN_PASSWORD='Reeper@10' node capture-screenshots.mjs
 *
 * Or with a .env file (npm install -D dotenv, then uncomment the dotenv import below):
 *   BASE_URL=https://ndaba-nine.vercel.app
 *   ADMIN_EMAIL=admin@ndabasattorneys.co.za
 *   ADMIN_PASSWORD=Reeper@10
 *
 * Keep credentials out of this file — pass them as env vars only.
 *
 * OUTPUT:
 *   Saves all images to ./public/pitch-screenshots/ in your project.
 *
 * NOTE ON SELECTORS:
 *   I haven't seen the actual /admin markup, so both the login form and the
 *   dashboard sidebar are auto-detected using common patterns. The script
 *   logs exactly what it found (or didn't) at each step. If auto-detection
 *   fails, set LOGIN_SELECTORS / DASHBOARD_SIDEBAR_SELECTOR below to the
 *   exact selectors from your real markup (inspect element in a browser).
 */

// import 'dotenv/config'; // uncomment if using a .env file

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'https://ndaba-nine.vercel.app';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Optional manual override if auto-detection can't find the dashboard sidebar
const DASHBOARD_SIDEBAR_SELECTOR = process.env.DASHBOARD_SIDEBAR_SELECTOR || null;

const OUT_DIR = path.join(process.cwd(), 'public', 'pitch-screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORT = { width: 1440, height: 900 };

// Full-page captures of standalone public routes
const PUBLIC_PAGES = [
  { route: '/', file: 'homepage-full.png' },
  { route: '/services', file: 'services.png' },
  { route: '/fees', file: 'fees-calculator.png' },
  { route: '/track', file: 'case-tracking-portal.png' },
  { route: '/onboard', file: 'digital-onboarding.png' },
  { route: '/about', file: 'about.png' },
];

// Spotlight captures on the homepage
const HOMEPAGE_SPOTLIGHTS = [
  { heading: 'Interactive Document Planner', file: 'feature-fica-planner.png', label: 'Interactive FICA Document Planner' },
  { heading: 'Live Status Tracking', file: 'feature-case-tracker.png', label: 'Live Case Tracking Portal' },
  { heading: 'Firm Certification & Standards', file: 'feature-compliance-hub.png', label: 'Compliance & Trust Hub' },
  { heading: 'The Matter Lifecycle Map', file: 'feature-lifecycle-map.png', label: 'Matter Lifecycle Map' },
  { heading: 'Practice Areas', file: 'feature-practice-areas.png', label: 'Practice Areas' },
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

// Candidate selectors for the dashboard's sidebar nav, tried in order.
// The first one that resolves to 2+ links/buttons is used.
const SIDEBAR_CANDIDATES = [
  'nav',
  'aside',
  '[role="navigation"]',
  '[class*="sidebar" i]',
  '[class*="side-nav" i]',
  '[id*="sidebar" i]',
];

// Never click anything matching this — avoids logging ourselves out mid-run
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

async function highlightAndShoot(page, heading, file, label) {
  try {
    const target = page.getByText(heading, { exact: false }).first();
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const box = await target.boundingBox();
    if (!box) {
      console.warn(`  ! Could not find "${heading}" on the page, skipping.`);
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
        border: '4px solid #E11D48',
        borderRadius: '14px',
        boxShadow: '0 0 0 4000px rgba(0,0,0,0.35)',
        zIndex: '999999',
        pointerEvents: 'none',
      });

      const tag = document.createElement('div');
      tag.textContent = label;
      Object.assign(tag.style, {
        position: 'absolute',
        top: '-38px',
        left: '0',
        background: '#E11D48',
        color: '#fff',
        padding: '5px 12px',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
        fontWeight: '700',
        borderRadius: '6px',
        whiteSpace: 'nowrap',
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
  if (DASHBOARD_SIDEBAR_SELECTOR) {
    const manual = page.locator(DASHBOARD_SIDEBAR_SELECTOR).first();
    if (await manual.count()) return manual;
    console.warn(`  ! DASHBOARD_SIDEBAR_SELECTOR "${DASHBOARD_SIDEBAR_SELECTOR}" found nothing, falling back to auto-detect.`);
  }

  for (const sel of SIDEBAR_CANDIDATES) {
    const candidate = page.locator(sel).first();
    if (await candidate.count()) {
      const linkCount = await candidate.locator('a, button').count();
      if (linkCount >= 2) {
        console.log(`  Using sidebar selector: "${sel}" (${linkCount} nav items found)`);
        return candidate;
      }
    }
  }
  return null;
}

async function captureDashboardSections(page) {
  console.log('Capturing every dashboard sidebar section ...');

  const sidebar = await findSidebar(page);
  if (!sidebar) {
    console.warn('  ! Could not auto-detect the dashboard sidebar. Set DASHBOARD_SIDEBAR_SELECTOR env var to the real selector (e.g. ".dashboard-nav") and re-run.');
    return;
  }

  const itemLocator = sidebar.locator('a, button');
  const count = await itemLocator.count();

  // Read all labels up front (before any clicks change the DOM)
  const itemTexts = [];
  for (let i = 0; i < count; i++) {
    const raw = (await itemLocator.nth(i).innerText().catch(() => '')).trim();
    itemTexts.push(raw || `section-${i + 1}`);
  }
  console.log(`  Found ${count} sidebar items: ${itemTexts.join(', ')}`);

  for (let i = 0; i < itemTexts.length; i++) {
    const text = itemTexts[i];

    if (SKIP_PATTERN.test(text)) {
      console.log(`  - Skipping "${text}" (looks like logout)`);
      continue;
    }

    try {
      // Re-resolve the sidebar + item fresh each loop — the DOM may have
      // re-rendered after the previous click (active states, content swap, etc)
      const currentSidebar = await findSidebar(page);
      const item = currentSidebar.locator('a, button').nth(i);

      await item.click();
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(500); // let client-side transitions settle

      const file = `dashboard-${slugify(text)}.png`;
      await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
      console.log(`  ✓ ${file}  (sidebar item: "${text}")`);
    } catch (err) {
      console.warn(`  ! Failed to capture "${text}": ${err.message}`);
    }
  }
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  console.log(`Capturing public pages from ${BASE_URL} ...`);
  for (const { route, file } of PUBLIC_PAGES) {
    try {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
      console.log(`  ✓ ${file}`);
    } catch (err) {
      console.warn(`  ! Failed ${route}: ${err.message}`);
    }
  }

  console.log('Capturing feature spotlights on the homepage ...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  for (const { heading, file, label } of HOMEPAGE_SPOTLIGHTS) {
    await highlightAndShoot(page, heading, file, label);
  }

  console.log('Logging into admin ...');
  try {
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(OUT_DIR, 'admin-login.png'), fullPage: true });
    console.log('  ✓ admin-login.png');

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn('  ! ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping login and dashboard capture.');
    } else {
      const emailField = await firstMatching(page, LOGIN_SELECTORS.email);
      const passwordField = await firstMatching(page, LOGIN_SELECTORS.password);
      const submitButton = await firstMatching(page, LOGIN_SELECTORS.submit);

      if (!emailField || !passwordField || !submitButton) {
        console.warn('  ! Could not find login fields automatically. Update LOGIN_SELECTORS at the top of this script with the real selectors from /admin.');
      } else {
        await emailField.fill(ADMIN_EMAIL);
        await passwordField.fill(ADMIN_PASSWORD);
        await Promise.all([
          page.waitForLoadState('networkidle'),
          submitButton.click(),
        ]);

        const file = 'dashboard-home.png';
        await page.screenshot({ path: path.join(OUT_DIR, file), fullPage: true });
        console.log(`  ✓ ${file}`);

        // Click through every sidebar link/button and screenshot each view
        await captureDashboardSections(page);
      }
    }
  } catch (err) {
    console.warn(`  ! Admin capture failed: ${err.message}`);
  }

  await browser.close();
  console.log(`\nDone. Screenshots saved to: ${OUT_DIR}`);
}

main();
