#!/usr/bin/env node
/* ============================================================
   sync-static.js — stamp content.js's Arabic into the HTML.

   WHY THIS EXISTS
   The Arabic copy is written directly into the HTML so the site is
   readable and crawlable with JavaScript off, while content.js holds the
   same strings for the language toggle. Two copies of the same text drift
   apart — and on a reskin, the HTML would still be showing the previous
   client's words to anyone without JavaScript.

   So content.js is the single source of truth and the HTML is a generated
   mirror of it. After editing content.js, run:

       node tools/sync-static.js            # rewrite the HTML
       node tools/sync-static.js --check    # report drift, change nothing

   --check exits 1 when the HTML is stale, which makes it usable in CI.

   Zero dependencies — Node built-ins only, matching the rest of the
   project. It only ever rewrites text that is already bound with a
   data-i18n / data-site attribute, so it cannot touch layout or markup.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LANG = 'ar';                    // the language written into the HTML
const CHECK_ONLY = process.argv.includes('--check');

/* ---- Load content.js without a module system ------------------------- */

global.window = {};
require(path.join(ROOT, 'assets', 'js', 'content.js'));
const SITE = global.window.SITE;
if (!SITE) {
  console.error('sync-static: assets/js/content.js did not define window.SITE');
  process.exit(1);
}

const resolve = (root, p) =>
  String(p).split('.').reduce((n, k) => (n && typeof n === 'object') ? n[k] : undefined, root);

/* Unwrap an { ar, en } pair; pass anything else through. */
function pick(value) {
  if (value && typeof value === 'object' && !Array.isArray(value) && ('ar' in value || 'en' in value)) {
    return value[LANG];
  }
  return value;
}

const missing = [];

function lookup(root, p, where) {
  const value = pick(resolve(root, p));
  if (value === undefined || value === null || typeof value === 'object') {
    missing.push(`${where}: ${p}`);
    return null;
  }
  return String(value);
}

const escText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = s => escText(s).replace(/"/g, '&quot;');

/* ---- Rewrite one file ------------------------------------------------- */

function syncFile(file) {
  const original = fs.readFileSync(file, 'utf8');
  const name = path.basename(file);
  let html = original;

  /* 1. Attributes: data-i18n-attr="alt:alt.hero,title:nav.home"
        and its data-site-attr twin. Rewrite the opening tag in place. */
  html = html.replace(/<([a-zA-Z][\w-]*)\b([^>]*)>/g, (full, tag, attrs) => {
    let out = attrs;

    for (const [binding, root] of [['data-i18n-attr', SITE.t], ['data-site-attr', SITE]]) {
      const found = out.match(new RegExp(binding + '="([^"]*)"'));
      if (!found) continue;

      for (const pair of found[1].split(',')) {
        const [target, key] = pair.split(':').map(s => s && s.trim());
        if (!target || !key) continue;

        const value = lookup(root, key, name);
        if (value === null) continue;

        const attrRe = new RegExp('(\\s' + target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=")([^"]*)(")');
        out = attrRe.test(out)
          ? out.replace(attrRe, (m, a, _old, c) => a + escAttr(value) + c)
          : out + ' ' + target + '="' + escAttr(value) + '"';
      }
    }
    return out === attrs ? full : `<${tag}${out}>`;
  });

  /* 2. Text content: data-i18n="nav.home" / data-site="brand.primary".
        Bound elements are always leaves, so the lazy match to the first
        matching close tag is safe. */
  for (const [binding, root] of [['data-i18n', SITE.t], ['data-site', SITE]]) {
    // negative lookahead keeps data-i18n from also matching data-i18n-attr
    const re = new RegExp(
      '(<([a-zA-Z][\\w-]*)\\b[^>]*\\b' + binding + '="([^"]+)"[^>]*>)([\\s\\S]*?)(<\\/\\2>)', 'g');

    html = html.replace(re, (full, open, tag, key, inner, close) => {
      const value = lookup(root, key, name);
      if (value === null) return full;
      const text = escText(value);

      /* Keep the file's own indentation: if the original content sat on
         its own line, put the new text there too. */
      const block = inner.match(/^(\s*\n)([ \t]*)[\s\S]*?(\n[ \t]*)$/);
      return block ? open + block[1] + block[2] + text + block[3] + close
                   : open + text + close;
    });
  }

  const changed = html !== original;
  if (changed && !CHECK_ONLY) fs.writeFileSync(file, html, 'utf8');
  return changed;
}

/* ---- Run --------------------------------------------------------------- */

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
const stale = files.filter(f => syncFile(path.join(ROOT, f)));

if (missing.length) {
  console.error('sync-static: keys not found in content.js —');
  [...new Set(missing)].forEach(m => console.error('  ' + m));
}

if (CHECK_ONLY) {
  if (stale.length) {
    console.error(`sync-static: ${stale.length} file(s) out of sync with content.js — ${stale.join(', ')}`);
    console.error('Run: node tools/sync-static.js');
    process.exit(1);
  }
  console.log(`sync-static: all ${files.length} pages match content.js.`);
} else {
  console.log(stale.length
    ? `sync-static: updated ${stale.length} of ${files.length} pages — ${stale.join(', ')}`
    : `sync-static: all ${files.length} pages were already in sync.`);
}

if (missing.length) process.exit(1);
