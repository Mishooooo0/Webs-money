#!/usr/bin/env node
/* ============================================================
   check-brand.js — validate the five files in assets/brand/.

       node tools/check-brand.js        # exits 1 on any failure

   These SVGs are loaded through CSS masks. When one is malformed the
   browser does not warn, does not log, and does not fall back — the mask
   simply resolves to nothing and the logo, pattern or divider disappears.
   A reskin can therefore ship with half its brand invisible and no error
   anywhere. This is the check that catches that.

   WHAT IT LOOKS FOR

   1. A double hyphen inside an XML comment. This is illegal in XML and
      makes the ENTIRE file unparseable. It is very easy to hit, because
      the natural thing to write in a comment is the name of the CSS token
      that colours the file — and every custom property starts with two
      hyphens. Write "the deep token" rather than "--c-deep".
   2. An unescaped bare & — same consequence.
   3. A missing viewBox. Mask sizing (contain / cover) needs the aspect
      ratio it provides.
   4. A non-square viewBox on logo.svg or mark.svg. The hero badge and
      every .ph slot size them with aspect-ratio: 1, so a rectangular
      viewBox letterboxes the artwork.
   5. Artwork that reaches the SVG in a way a mask cannot use: for the four
      masked files, some fill or stroke must be present, otherwise the mask
      is empty and nothing renders.

   Zero dependencies — Node built-ins only, like the rest of the project.
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const BRAND = path.join(__dirname, '..', 'assets', 'brand');
const MASKED = ['logo.svg', 'mark.svg', 'pattern-primary.svg', 'pattern-band.svg'];
const SQUARE = ['logo.svg', 'mark.svg'];
const ALL = [...MASKED, 'favicon.svg'];

const problems = [];
const fail = (file, msg) => problems.push(`${file}: ${msg}`);

for (const name of ALL) {
  const file = path.join(BRAND, name);

  if (!fs.existsSync(file)) { fail(name, 'missing from assets/brand/'); continue; }
  const svg = fs.readFileSync(file, 'utf8');

  /* 1. Double hyphen inside a comment — fatal, and invisible at a glance. */
  for (const comment of svg.match(/<!--[\s\S]*?-->/g) || []) {
    const body = comment.slice(4, -3);
    if (body.includes('--')) {
      const offender = (body.match(/\S*--\S*/) || ['--'])[0];
      fail(name, `"--" inside an XML comment (${offender}) makes the whole file `
                 + 'unparseable, so the mask renders nothing. Name the token without its hyphens.');
    }
  }

  /* 2. Bare ampersand. */
  if (/&(?!(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);)/.test(svg)) {
    fail(name, 'unescaped "&" — use &amp;');
  }

  /* 3 & 4. viewBox present, and square where the layout assumes it. */
  const viewBox = svg.match(/viewBox="\s*([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s*"/);
  if (!viewBox) {
    fail(name, 'no viewBox — mask sizing needs one');
  } else if (SQUARE.includes(name)) {
    const [w, h] = [parseFloat(viewBox[3]), parseFloat(viewBox[4])];
    if (Math.abs(w - h) > 0.01) {
      fail(name, `viewBox is ${w}x${h}; this file is sized with aspect-ratio: 1, so it must be square`);
    }
  }

  /* 5. Something to actually mask with. */
  if (MASKED.includes(name) && !/\b(fill|stroke)="(?!none)[^"]+"/.test(svg)) {
    fail(name, 'no fill or stroke found — a mask built from this would be empty');
  }
}

if (problems.length) {
  console.error(`check-brand: ${problems.length} problem(s) in assets/brand/\n`);
  problems.forEach(p => console.error('  ' + p));
  process.exit(1);
}
console.log(`check-brand: all ${ALL.length} brand files are well-formed.`);
