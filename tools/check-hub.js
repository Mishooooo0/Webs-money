#!/usr/bin/env node
/* ============================================================
   check-hub.js — the checks that apply to the hub branch.

       node tools/check-hub.js

   main carries no template pages, so tools/check.js would pass there
   vacuously — sync-static with nothing to sync, an audit with nothing to
   audit. This runs the checks that actually mean something on the hub.

   The one that matters most is #4. Client work is private because no
   client site is ever copied into the published folder. That is a
   property of hub/catalogue.js, and properties drift. So it is asserted
   here and the build fails if it ever stops being true.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const problems = [];
const fail = (msg) => problems.push(msg);
const ok = [];

/* ---- 1. The catalogue parses and is shaped correctly ------------------ */

global.window = {};
try {
  require(path.join(ROOT, 'hub', 'catalogue.js'));
} catch (err) {
  console.error('check-hub: hub/catalogue.js did not parse —', err.message);
  process.exit(1);
}
const C = global.window.CATALOGUE;
if (!C || !Array.isArray(C.templates) || !Array.isArray(C.clients)) {
  console.error('check-hub: catalogue.js must define window.CATALOGUE with templates[] and clients[]');
  process.exit(1);
}
ok.push(`catalogue parses — ${C.templates.length} templates, ${C.clients.length} clients`);

const bilingual = (v) => v && typeof v === 'object' && typeof v.ar === 'string' && typeof v.en === 'string';

for (const tpl of C.templates) {
  for (const field of ['id', 'branch', 'dest', 'number', 'accent']) {
    if (!tpl[field]) fail(`template "${tpl.id || '?'}" is missing ${field}`);
  }
  for (const field of ['name', 'desc', 'fits']) {
    if (!bilingual(tpl[field])) fail(`template "${tpl.id}" needs ${field} as { ar, en }`);
  }
  if (!/^#[0-9a-f]{6}$/i.test(tpl.accent || '')) fail(`template "${tpl.id}" accent must be a #rrggbb hex`);
}

const STATUSES = ['building', 'review', 'live', 'paused'];
for (const c of C.clients) {
  if (!c.id) fail('a client entry is missing id');
  if (!bilingual(c.name)) fail(`client "${c.id}" needs name as { ar, en }`);
  if (!STATUSES.includes(c.status)) fail(`client "${c.id}" status must be one of ${STATUSES.join(', ')}`);
  if (c.from && !C.templates.some((t) => t.id === c.from)) {
    fail(`client "${c.id}" is built on "${c.from}", which is not a template in the catalogue`);
  }
  if (!c.repo && !c.liveUrl) fail(`client "${c.id}" needs a repo or a liveUrl to link to`);
}
if (!problems.length) ok.push('every entry has its required fields');

/* ---- 2. Every template branch named actually exists ------------------- */

let known = '';
try {
  known = execFileSync('git', ['branch', '-a', '--format=%(refname:short)'], { cwd: ROOT }).toString();
} catch (err) { /* not a git checkout — skip rather than fail */ }

if (known) {
  for (const tpl of C.templates) {
    const found = known.split('\n').some((b) => b.trim() === tpl.branch || b.trim() === `origin/${tpl.branch}`);
    if (!found) fail(`template "${tpl.id}" names branch "${tpl.branch}", which does not exist`);
  }
  if (!problems.length) ok.push('every template branch exists');
}

/* ---- 3. The hub page's own files are all present ---------------------- */

for (const f of ['hub/index.html', 'hub/hub.css', 'hub/hub.js', 'hub/gate.js', 'hub/catalogue.js']) {
  if (!fs.existsSync(path.join(ROOT, f))) fail(`missing ${f}`);
}

const page = fs.readFileSync(path.join(ROOT, 'hub', 'index.html'), 'utf8');
for (const src of (page.match(/(?:src|href)="(?!https?:|#)([^"]+)"/g) || [])) {
  const rel = src.match(/"([^"]+)"/)[1];
  if (!fs.existsSync(path.join(ROOT, 'hub', rel))) fail(`hub/index.html links ${rel}, which does not exist`);
}
if (!problems.length) ok.push('hub page and its local links resolve');

/* ---- 4. THE GUARD RAIL: no client entry may be publishable ------------ */

for (const c of C.clients) {
  if (c.dest || c.branch) {
    fail(`client "${c.id}" has ${c.dest ? 'dest' : 'branch'} set. Client work must never be `
       + 'published to the public site — that is the only thing making it private. '
       + 'Remove it, and keep the client in the private repo.');
  }
}

const assemble = fs.readFileSync(path.join(ROOT, '.github', 'pages', 'assemble.sh'), 'utf8');
if (/clients?\//.test(assemble.replace(/^\s*#.*$/gm, ''))) {
  fail('assemble.sh appears to publish a clients/ path. The public site must carry templates only.');
}
if (!problems.length) ok.push('no client entry is publishable, and assemble.sh publishes templates only');

/* ---- Report ------------------------------------------------------------ */

ok.forEach((line) => console.log('✓ ' + line));
if (problems.length) {
  console.log('');
  problems.forEach((p) => console.error('✗ ' + p));
  console.error(`\ncheck-hub: ${problems.length} problem(s).`);
  process.exit(1);
}
console.log('\ncheck-hub: the hub is sound.');
