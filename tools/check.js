#!/usr/bin/env node
/* ============================================================
   check.js — every static check in one command.

       node tools/check.js        # exits 1 on the first category that fails

   These are the invariants that make the template reskinnable. Each one
   exists because breaking it produced a real bug that review did not catch:

     1. No raw colour outside tokens.css. This is what makes a reskin a
        one-file edit rather than a hunt.
     2. No physical directional properties. `margin-left` silently breaks
        the Arabic RTL layout while looking fine in English.
     3. Brand SVGs well-formed (tools/check-brand.js) — a malformed one
        fails silently and its artwork just disappears.
     4. The static Arabic in the HTML matches content.js
        (tools/sync-static.js) — otherwise a no-JS visitor reads the
        PREVIOUS client's words.
     5. No stray-script characters in the copy. A Hebrew letter inside an
        Arabic word looks almost right and renders as noise.
     6. Every data-i18n / data-site key resolves, so no element silently
        keeps stale hard-coded text.

   Runs the browser-free checks only; tools/audit.js covers the rest.
   Zero dependencies.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const CSS_DIR = path.join(ROOT, 'assets', 'css');
const failures = [];

function report(name, problems) {
  if (problems.length) {
    failures.push(name);
    console.error(`✗ ${name}`);
    problems.slice(0, 20).forEach(p => console.error('    ' + p));
    if (problems.length > 20) console.error(`    …and ${problems.length - 20} more`);
  } else {
    console.log(`✓ ${name}`);
  }
}

/* Comments legitimately mention colours and `margin-left`; strip them so
   prose about a rule is never mistaken for the rule. */
const stripComments = css => css.replace(/\/\*[\s\S]*?\*\//g, '');

function scanCss(label, pattern, skipFiles = []) {
  const problems = [];
  if (!fs.existsSync(CSS_DIR)) return problems;
  for (const file of fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css')).sort()) {
    if (skipFiles.includes(file)) continue;
    stripComments(fs.readFileSync(path.join(CSS_DIR, file), 'utf8'))
      .split('\n')
      .forEach((line, i) => {
        if (pattern.test(line)) problems.push(`${file}:${i + 1}  ${line.trim()}`);
      });
  }
  return problems;
}

/* 1 & 2 — CSS invariants */
report('No raw colour outside tokens.css',
  scanCss('colour', /#[0-9a-fA-F]{3,8}\b|\brgba?\(/, ['tokens.css']));

report('No physical directional properties (they break RTL)',
  scanCss('direction', /(?:margin|padding|border)-(?:left|right)\s*:|(?:^|[^-\w])(?:left|right)\s*:/));

/* 3 & 4 — delegate to the dedicated tools rather than reimplement them */
for (const [name, script, extra] of [
  ['Brand SVGs are well-formed', 'check-brand.js', []],
  ['Static HTML matches content.js', 'sync-static.js', ['--check']]
]) {
  const run = spawnSync(process.execPath, [path.join(ROOT, 'tools', script), ...extra],
                        { cwd: ROOT, encoding: 'utf8' });
  report(name, run.status === 0 ? [] : [(run.stderr || run.stdout || '').trim()]);
}

/* 5 & 6 — content invariants */
global.window = {};
require(path.join(ROOT, 'assets', 'js', 'content.js'));
const SITE = global.window.SITE;

const stray = [...new Set([...JSON.stringify(SITE)].filter(c => {
  const cp = c.codePointAt(0);
  return (cp >= 0x0590 && cp <= 0x05ff) || (cp >= 0x0700 && cp <= 0x074f);
}))];
report('No stray-script characters in the copy',
  stray.length ? [`found: ${stray.join(' ')} — a non-Arabic letter inside an Arabic word`] : []);

const resolve = (root, p) =>
  String(p).split('.').reduce((n, k) => (n && typeof n === 'object') ? n[k] : undefined, root);

const unresolved = [];
for (const file of fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort()) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  for (const [attr, root] of [['data-i18n', SITE.t], ['data-site', SITE]]) {
    for (const m of html.matchAll(new RegExp(`${attr}="([^"]+)"`, 'g'))) {
      if (resolve(root, m[1]) === undefined) unresolved.push(`${file}: ${attr}="${m[1]}"`);
    }
  }
  for (const [attr, root] of [['data-i18n-attr', SITE.t], ['data-site-attr', SITE]]) {
    for (const m of html.matchAll(new RegExp(`${attr}="([^"]+)"`, 'g'))) {
      for (const pair of m[1].split(',')) {
        const key = (pair.split(':')[1] || '').trim();
        if (key && resolve(root, key) === undefined) unresolved.push(`${file}: ${attr} → ${key}`);
      }
    }
  }
}
report('Every binding key resolves in content.js', unresolved);

console.log('');
if (failures.length) {
  console.error(`check: ${failures.length} of 6 checks failed.`);
  process.exit(1);
}
console.log('check: all 6 static checks passed.');
