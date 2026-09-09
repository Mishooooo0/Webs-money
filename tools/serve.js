#!/usr/bin/env node
/* ============================================================
   serve.js — build the site and serve it, for looking at it locally.

       node tools/serve.js                 # assemble, then serve on :8000
       node tools/serve.js --port 3000
       node tools/serve.js --shots         # also render the card screenshots
       node tools/serve.js --no-build      # serve the existing _site as-is
       npm run serve

   ── Why not just serve _site ────────────────────────────────
   assemble.sh COPIES the root files into _site, so serving only _site
   means every edit to index.html or site.css needs a rebuild before it
   shows. That is a bad loop to design in.

   So a request is resolved against the REPO first and _site second:

     /index.html, /site.css, /work.js …   repo root   — edits are live
     /hub/catalogue.js                    repo root   — edits are live
     /cafe/…, /services/…, /retail/…      _site       — from their branches
     /shots/…                             _site       — rendered by shoot.js

   Nothing collides except the root files, and those are exactly the ones
   that should come from the working copy. Reload and you see your edit.

   ── What it refuses ─────────────────────────────────────────
   The repo root holds things the published site never does — tools/,
   .github/, node_modules/, the handover notes. A denylist keeps them out
   so what you test resembles what deploys.

   Zero dependencies, like everything else here. HTTP only; this is a
   local tool and is bound to loopback unless you say otherwise.
   ============================================================ */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, '_site');

const arg = (name, fallback) => {
  const i = process.argv.indexOf('--' + name);
  return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1] : fallback;
};

const PORT = Number(arg('port', 8000));
const HOST = arg('host', '127.0.0.1');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8'
};

/* Present in the repo, absent from a deploy. Serving them would make the
   local site a poor rehearsal of the real one. */
const REFUSED = /^(tools|node_modules|\.github)\/|^package(-lock)?\.json$|\.md$/;

function send(res, code, type, body) {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}
const notFound = (res) => send(res, 404, 'text/plain; charset=utf-8', 'not found');

/* ---- Build ------------------------------------------------------------ */

function assemble() {
  console.log('  building _site …');
  /* assemble.sh writes to ./_site, so it has to run from the repo root. */
  const out = spawnSync('bash', ['.github/pages/assemble.sh'], { cwd: ROOT, encoding: 'utf8' });
  if (out.status !== 0) {
    console.error('\nserve: assemble.sh failed\n');
    console.error(out.stderr || out.stdout);
    process.exit(1);
  }
  const built = (out.stdout.match(/^publish /gm) || []).length;
  const skipped = (out.stdout.match(/^skip /gm) || []).length;
  console.log(`  ${built} template(s) published${skipped ? `, ${skipped} skipped` : ''}`);
}

/* Optional, and slow: ~15 pages through a real browser. Without it every
   card and gallery thumbnail 404s and falls back to its accent swatch —
   correct behaviour, but eighteen red lines in the console is a poor way
   to spend a reader's attention while they are testing something else. */
function shoot() {
  console.log('  rendering screenshots (this takes a minute) …');
  const out = spawnSync('node', ['.github/pages/shoot.js'], { cwd: ROOT, encoding: 'utf8' });
  if (out.status !== 0) {
    /* Never fatal. The swatches are a complete fallback, and the Pages
       workflow treats a failure here the same way. */
    console.log('  screenshots failed — cards keep their colour swatches');
    return;
  }
  console.log(`  ${(out.stdout.match(/\.jpg \(/g) || []).length} screenshot(s) rendered`);
}

/* ---- Counting ---------------------------------------------------------
   Just enough for analytics.html to have something to render locally.

   This is NOT the production counter — that is site-server.js in the
   clients repo, which hashes visitors against a daily salt and persists.
   This one is in memory and dies with the process, which is the right
   amount of machinery for a page you are looking at on localhost. */

const stats = {
  since: new Date().toISOString(),
  views: 0, pages: {}, lastSeen: null
};

function record(rel) {
  /* Looking at your own numbers should not change them — the same
     exclusion the production counter cannot express yet (see SITE.md). */
  if (rel === 'analytics.html') return;
  stats.views += 1;
  stats.pages[rel] = (stats.pages[rel] || 0) + 1;
  stats.lastSeen = new Date().toISOString();
}

function summary() {
  return {
    since: stats.since,
    generatedAt: new Date().toISOString(),
    sites: {
      'obsidian-hub': {
        views: stats.views,
        /* One browser on loopback is one visitor. Saying anything else
           would be inventing a number. */
        visits: stats.views ? 1 : 0,
        todayViews: stats.views,
        todayVisits: stats.views ? 1 : 0,
        lastSeen: stats.lastSeen,
        pages: stats.pages
      }
    }
  };
}

/* ---- Resolve ---------------------------------------------------------- */

/* Repo first, then _site. Returns an absolute path, or null. */
function resolve(rel) {
  for (const base of [ROOT, SITE]) {
    const file = path.resolve(base, rel);
    /* path.resolve collapses ../ before this check, so it cannot be walked
       past. */
    if (file !== base && !file.startsWith(base + path.sep)) continue;
    if (base === ROOT && REFUSED.test(rel)) continue;
    try {
      if (fs.statSync(file).isFile()) return file;
    } catch (err) { /* try the next base */ }
  }
  return null;
}

function isDir(rel) {
  for (const base of [ROOT, SITE]) {
    try {
      if (fs.statSync(path.resolve(base, rel)).isDirectory()) return true;
    } catch (err) { /* try the next base */ }
  }
  return false;
}

/* ---- Server ----------------------------------------------------------- */

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, 'text/plain; charset=utf-8', 'method not allowed');
  }

  let pathname;
  try {
    pathname = decodeURIComponent(req.url.split('?')[0]);
  } catch (err) {
    return send(res, 400, 'text/plain; charset=utf-8', 'bad request');
  }

  if (pathname === '/_stats') {
    return send(res, 200, 'application/json; charset=utf-8',
      JSON.stringify(summary(), null, 2));
  }

  let rel = pathname.replace(/^\/+/, '');

  /* Dotfiles in any segment, always. */
  if (rel.split('/').some((seg) => seg.startsWith('.'))) return notFound(res);

  /* A directory must redirect before it is served. Serving /cafe as if it
     were /cafe/index.html leaves the browser resolving "assets/css/…"
     against the root, and the page arrives unstyled. */
  if (rel === '' || isDir(rel)) {
    if (rel !== '' && !pathname.endsWith('/')) {
      res.writeHead(301, { Location: pathname + '/' });
      return res.end();
    }
    rel = rel ? rel + 'index.html' : 'index.html';
  }

  const file = resolve(rel);
  if (!file) return notFound(res);

  const ext = path.extname(file).toLowerCase();
  const stat = fs.statSync(file);

  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Content-Length': stat.size,
    /* No caching: the point of this server is seeing an edit on reload. */
    'Cache-Control': 'no-store'
  });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);

  if (ext === '.html') record(rel);
});

/* ---- Start ------------------------------------------------------------ */

if (!process.argv.includes('--no-build')) {
  assemble();
  if (process.argv.includes('--shots')) shoot();
} else if (!fs.existsSync(SITE)) {
  console.error('\nserve: --no-build was given but _site does not exist yet.');
  console.error('       Run once without it.\n');
  process.exit(1);
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nserve: port ${PORT} is already in use — try --port ${PORT + 1}\n`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, HOST, () => {
  const base = `http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`;
  const pages = [
    ['/', 'homepage'],
    ['/templates.html', 'templates'],
    ['/work.html', 'our work'],
    ['/analytics.html', 'visitor counts']
  ];

  console.log('\n  \x1b[1mObsidian-Hub\x1b[0m — serving locally\n');
  for (const [p, label] of pages) console.log(`    ${(base + p).padEnd(38)} ${label}`);

  /* The template demos come from _site, so only list the ones the build
     actually produced. A branch that did not exist is not a broken link
     the reader should have to discover. */
  let listed = 0;
  try {
    global.window = {};
    delete require.cache[require.resolve(path.join(ROOT, 'hub', 'catalogue.js'))];
    require(path.join(ROOT, 'hub', 'catalogue.js'));
    for (const t of global.window.CATALOGUE.templates) {
      if (fs.existsSync(path.join(SITE, t.dest, 'index.html'))) {
        if (!listed++) console.log('');
        console.log(`    ${(base + '/' + t.dest + '/').padEnd(38)} ${t.name.en}`);
      }
    }
  } catch (err) { /* the catalogue is check-hub's problem, not the server's */ }

  if (!fs.existsSync(path.join(SITE, 'shots'))) {
    console.log('\n  no screenshots — cards show their accent swatch, and every');
    console.log('  thumbnail 404s in the console. --shots renders them (~1 min).');
  }

  console.log('\n  edits to index.html, site.css, work.js … show on reload');
  console.log('  templates need a restart (they are rebuilt from their branches)');
  console.log('\n  ctrl-c to stop\n');
});
