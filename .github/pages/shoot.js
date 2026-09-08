#!/usr/bin/env node
/* ============================================================
   shoot.js — render a thumbnail of every published template.

       node .github/pages/shoot.js            (after assemble.sh)

   Serves the assembled _site and screenshots every page of every template
   into _site/shots/<id>/<name>.jpg, which the cards and the templates
   gallery fade in over their
   colour swatch. A card that has no shot still reads correctly — the
   swatch stays — so this failing never breaks the deploy.

   Shots are generated, never committed: no binaries churning in git.

   Templates only. Client sites are not in _site at all, by design.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..', '..');
const SITE = path.join(ROOT, '_site');
const SHOTS = path.join(SITE, 'shots');
const PORT = 8099;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json'
};

function serve() {
  return http.createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split('?')[0]);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.join(SITE, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  }).listen(PORT);
}

(async () => {
  global.window = {};
  require(path.join(ROOT, 'hub', 'catalogue.js'));
  const templates = global.window.CATALOGUE.templates
    .filter((t) => fs.existsSync(path.join(SITE, t.dest, 'index.html')));

  if (!templates.length) { console.log('shoot: nothing assembled to shoot'); return; }

  let chromium;
  try { ({ chromium } = require('playwright')); }
  catch (err) { console.log('shoot: playwright unavailable — cards keep their colour swatches'); return; }

  fs.mkdirSync(SHOTS, { recursive: true });
  const server = serve();
  const browser = await chromium.launch();

  /* A card thumbnail wants the top of the page, not fullPage. Rendering at
     0.6 scale gives a 864x540 image — sharp on a card, and small. */
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.6
  });

  /* Every page of every template, not just the home page: templates.html
     shows a gallery of all of them. The list comes from the catalogue, which
     check-hub.js §2b has already proved matches the branch — so a shot that
     404s here means the assembled site is wrong, not the list.

     Shots land at shots/<id>/<name>.jpg. The homepage card reads
     shots/<id>/index.jpg, so it is the same loop that feeds both. */
  for (const t of templates) {
    const pages = (t.pages || []).map((pg) => pg.file);
    if (!pages.length) {
      console.log(`shoot: ${t.id} declares no pages — skipped`);
      continue;
    }
    fs.mkdirSync(path.join(SHOTS, t.id), { recursive: true });

    for (const file of pages) {
      const name = file.replace(/\.html$/, '');
      const out = path.join(SHOTS, t.id, `${name}.jpg`);
      const page = await context.newPage();
      try {
        await page.goto(`http://localhost:${PORT}/${t.dest}/${file}`,
          { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(600);
        /* Reveal animations start hidden; a shot taken mid-animation looks broken. */
        await page.evaluate(() => document.querySelectorAll('[data-reveal]')
          .forEach((n) => n.classList.add('is-visible')));
        await page.waitForTimeout(300);
        await page.screenshot({ path: out, type: 'jpeg', quality: 72 });
        const kb = Math.round(fs.statSync(out).size / 1024);
        console.log(`shoot: ${t.id}/${name}.jpg (${kb} KB)`);
      } catch (err) {
        console.log(`shoot: ${t.id}/${name} failed (${err.message.split('\n')[0]}) — keeps its swatch`);
      }
      await page.close();
    }
  }

  await browser.close();
  server.close();
})();
