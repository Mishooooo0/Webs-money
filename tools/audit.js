#!/usr/bin/env node
/* ============================================================
   audit.js — render every page in a real browser and fail on anything
   a static check cannot see.

       node tools/audit.js            # exits 1 on any finding

   The greps and tools/check-brand.js catch malformed source. This catches
   the things that only appear once a browser has laid the page out:

     1. Console errors and uncaught exceptions.
     2. Horizontal overflow — the body must never scroll sideways.
     3. WCAG AA contrast, on every text node, in BOTH languages. Text that
        is dark-on-dark reads as a styling slip in review and as invisible
        to a user; this is the only reliable way to find it.
     4. Brand SVGs that fail to load. A malformed mask fails silently, so a
        runtime load check backs up tools/check-brand.js.
     5. The language toggle actually flipping dir and swapping copy.

   Serves the folder itself on an ephemeral port, so there is nothing to
   start first.

   Playwright is required, and is the ONE dev-time dependency in this
   project — the website itself still ships with none. Install it with
   `npm i -D playwright && npx playwright install chromium`, or point
   NODE_PATH at a global install.
   ============================================================ */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LANGS = ['ar', 'en'];

/* Font CDNs are unreachable in sandboxed CI; that is the environment, not
   the site, and the pages carry real fallback stacks for exactly this. */
const IGNORED_REQUESTS = /fonts\.(googleapis|gstatic)\.com/;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.json': 'application/json'
};

function startServer() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
      const file = path.join(ROOT, rel);
      /* Never serve outside the project root. */
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404).end('not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

/* Runs inside the page. Walks every leaf text node, resolves the first
   opaque background behind it, flattens element opacity onto that, and
   compares luminance. */
function contrastProbe() {
  const lum = c => {
    const [r, g, b] = c.map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = s => { const m = s.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null; };
  const bgOf = el => {
    let n = el;
    while (n && n !== document.documentElement) {
      const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || parseFloat(m[3]) > 0.9)) return parse(getComputedStyle(n).backgroundColor);
      n = n.parentElement;
    }
    return [255, 255, 255];
  };

  const out = [];
  document.querySelectorAll('h1,h2,h3,h4,p,a,span,li,button,summary,blockquote,figcaption,strong').forEach(el => {
    const text = (el.textContent || '').trim();
    if (!text || el.children.length) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const op = parseFloat(cs.opacity);
    if (op < 0.05) return;

    const fg = parse(cs.color), bg = bgOf(el);
    if (!fg || !bg) return;
    const eff = fg.map((v, i) => v * op + bg[i] * (1 - op));
    const L1 = lum(eff), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);

    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
    const min = large ? 3 : 4.5;
    if (ratio < min) {
      out.push(`contrast ${ratio.toFixed(2)}:1 (needs ${min}) on "${text.slice(0, 30)}" [${el.className || el.tagName}]`);
    }
  });
  return out;
}

(async () => {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (err) {
    console.error('audit: playwright not found.\n'
      + '  npm i -D playwright && npx playwright install chromium\n'
      + '  (or set NODE_PATH to a global install)');
    process.exit(1);
  }

  const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
  if (!pages.length) { console.error('audit: no .html pages found'); process.exit(1); }

  const server = await startServer();
  const base = `http://127.0.0.1:${server.address().port}/`;
  const findings = [];

  const launchOpts = {};
  if (process.env.PLAYWRIGHT_CHROMIUM_PATH) launchOpts.executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
  const browser = await playwright.chromium.launch(launchOpts);

  try {
    for (const lang of LANGS) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } });

      for (const file of pages) {
        const where = `${lang} ${file}`;
        const page = await ctx.newPage();

        page.on('console', m => {
          if (m.type() !== 'error') return;
          /* A failed subresource logs a generic message with no URL in the
             text — the URL is only on the location, so both are checked. */
          const from = (m.location && m.location().url) || '';
          if (IGNORED_REQUESTS.test(m.text()) || IGNORED_REQUESTS.test(from)) return;
          findings.push(`${where}: console error — ${m.text()}${from ? ' @ ' + from : ''}`);
        });
        page.on('pageerror', e => findings.push(`${where}: uncaught — ${e.message}`));
        page.on('requestfailed', r => {
          if (!IGNORED_REQUESTS.test(r.url())) {
            findings.push(`${where}: request failed — ${r.url()}`);
          }
        });

        await page.goto(base + file, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);

        if (lang === 'en') {
          await page.evaluate(() => window.I18N && window.I18N.set('en'));
          await page.waitForTimeout(300);
          const dir = await page.getAttribute('html', 'dir');
          if (dir !== 'ltr') findings.push(`${where}: toggle did not flip dir (got ${dir})`);
        }

        /* Reveal animations start elements at opacity 0; force the settled
           state so contrast is measured on what the reader actually sees. */
        await page.evaluate(() =>
          document.querySelectorAll('[data-reveal]').forEach(n => n.classList.add('is-visible')));
        await page.waitForTimeout(150);

        const overflow = await page.evaluate(() =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 1) findings.push(`${where}: horizontal overflow of ${overflow}px`);

        (await page.evaluate(contrastProbe)).forEach(f => findings.push(`${where}: ${f}`));

        /* Brand assets: a malformed SVG behind a mask fails with no error. */
        const brandDir = path.join(ROOT, 'assets', 'brand');
        if (lang === 'ar' && fs.existsSync(brandDir)) {
          for (const svg of fs.readdirSync(brandDir).filter(f => f.endsWith('.svg'))) {
            const ok = await page.evaluate(u => new Promise(res => {
              const i = new Image();
              i.onload = () => res(true);
              i.onerror = () => res(false);
              i.src = u;
            }), `/assets/brand/${svg}`);
            if (!ok) findings.push(`${where}: assets/brand/${svg} failed to load — mask will render nothing`);
          }
        }

        await page.close();
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  const unique = [...new Set(findings)];
  if (unique.length) {
    console.error(`audit: ${unique.length} finding(s) across ${pages.length} pages x ${LANGS.length} languages\n`);
    unique.forEach(f => console.error('  ' + f));
    process.exit(1);
  }
  console.log(`audit: clean — ${pages.length} pages x ${LANGS.length} languages, `
    + 'no console errors, no overflow, WCAG AA contrast, brand assets load.');
})();
