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

  /* templates.html renders both of these, so a malformed entry is a hole in
     a published page rather than a quiet no-op. */
  if (!Array.isArray(tpl.pages) || !tpl.pages.length) {
    fail(`template "${tpl.id}" needs a pages[] listing the pages on its branch`);
  } else {
    for (const pg of tpl.pages) {
      if (!pg.file || !bilingual(pg)) fail(`template "${tpl.id}" has a pages[] entry without file/ar/en`);
    }
  }
  if (!Array.isArray(tpl.holds) || !tpl.holds.length) {
    fail(`template "${tpl.id}" needs a holds[] naming what its content file drives`);
  } else {
    for (const h of tpl.holds) {
      if (!h.key || !bilingual(h)) fail(`template "${tpl.id}" has a holds[] entry without key/ar/en`);
    }
  }
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

  /* The hub is the index of the whole thing, so it must not also be sitting
     inside the things it indexes. A template branch is main plus its own
     pages, so hub/ arrives there purely by inheritance — it was deleted on
     each branch, and this is what notices if a later merge puts it back. */
  let strays = 0;
  for (const tpl of C.templates) {
    for (const ref of [tpl.branch, `origin/${tpl.branch}`]) {
      let listing = '';
      try {
        listing = execFileSync('git', ['ls-tree', '--name-only', ref, 'hub/'],
          { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      } catch (err) { continue; }
      if (listing) {
        strays += 1;
        fail(`branch "${ref}" contains hub/. The hub is the index, not something `
           + 'that lives inside a template. Remove it there:\n'
           + `           git checkout ${tpl.branch} && git rm -r --cached -q hub && git commit -m "drop the inherited hub"`);
      }
    }
  }
  if (!strays) ok.push('no template branch carries a copy of the hub');

  /* ---- 2b. THE CLAIMS templates.html MAKES ARE TRUE -------------------
     The page tells a visitor "this template has these pages" and "it holds
     these things". Both are read from the catalogue, and a catalogue is a
     promise about a branch — promises drift the first time someone adds a
     page and forgets. So both are compared against the branch itself, in
     BOTH directions: an undeclared page is as wrong as a declared one that
     does not exist. */

  const showFrom = (branch, file) => {
    for (const ref of [`origin/${branch}`, branch]) {
      try {
        return execFileSync('git', ['show', `${ref}:${file}`],
          { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
      } catch (err) { /* try the next ref */ }
    }
    return null;
  };
  const treeOf = (branch) => {
    for (const ref of [`origin/${branch}`, branch]) {
      try {
        return execFileSync('git', ['ls-tree', '--name-only', ref],
          { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().split('\n');
      } catch (err) { /* try the next ref */ }
    }
    return null;
  };

  let drift = 0;
  for (const tpl of C.templates) {
    if (!Array.isArray(tpl.pages) || !Array.isArray(tpl.holds)) continue;

    /* 404.html is never a page a visitor is sent to, so it is excluded on
       both sides rather than listed on the site. */
    const onBranch = treeOf(tpl.branch);
    if (onBranch) {
      const actual = onBranch.filter((f) => f.endsWith('.html') && f !== '404.html');
      const declared = tpl.pages.map((pg) => pg.file);
      for (const f of declared) {
        if (!actual.includes(f)) {
          drift += 1;
          fail(`template "${tpl.id}" declares page ${f}, which is not on branch "${tpl.branch}"`);
        }
      }
      for (const f of actual) {
        if (!declared.includes(f)) {
          drift += 1;
          fail(`branch "${tpl.branch}" has ${f}, which hub/catalogue.js does not declare — `
             + 'add it to that template\'s pages[] so the site lists it');
        }
      }
    }

    /* holds[].key names a top-level key of the branch's content.js. Matched
       by its two-space indentation rather than by evaluating the file: the
       checker should not run branch code to validate branch data. */
    const content = showFrom(tpl.branch, 'assets/js/content.js');
    if (content) {
      const keys = (content.match(/^ {2}([A-Za-z_$][\w$]*)\s*:/gm) || [])
        .map((m) => m.trim().replace(/\s*:$/, ''));
      for (const h of tpl.holds) {
        if (!keys.includes(h.key)) {
          drift += 1;
          fail(`template "${tpl.id}" claims to hold "${h.key}", which is not in `
             + `assets/js/content.js on branch "${tpl.branch}"`);
        }
      }
    }
  }
  if (!drift) ok.push('every template\'s declared pages and contents match its branch');
}

/* ---- 3. The website's own files are all present ----------------------- */

const PAGES = ['index.html', 'templates.html', 'work.html', 'analytics.html'];
for (const f of PAGES.concat(['site.css', 'site.js', 'templates.css', 'templates.js',
                              'work.css', 'work.js',
                              'analytics.css', 'analytics.js', 'hub/catalogue.js'])) {
  if (!fs.existsSync(path.join(ROOT, f))) fail(`missing ${f}`);
}

/* Every local src/href on every page must resolve from the repo root, which
   is also where assemble.sh lays the published site out. A link that only
   works locally is a 404 the moment it deploys. */
const destPrefix = new RegExp(`^(${C.templates.map((t) => t.dest).join('|')})/`);
for (const file of PAGES) {
  if (!fs.existsSync(path.join(ROOT, file))) continue;
  const page = fs.readFileSync(path.join(ROOT, file), 'utf8');
  for (const src of (page.match(/(?:src|href)="(?!https?:|#|mailto:)([^"]+)"/g) || [])) {
    const rel = src.match(/"([^"]+)"/)[1];
    /* Template paths are produced by assemble.sh from other branches, so
       they are absent from this checkout by design — section 2 already
       verified those branches exist and carry the pages named. */
    if (destPrefix.test(rel)) continue;
    if (!fs.existsSync(path.join(ROOT, rel))) fail(`${file} links ${rel}, which does not exist`);
  }
}
if (!problems.length) ok.push('every page and its local links resolve');

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
