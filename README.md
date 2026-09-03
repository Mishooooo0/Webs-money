# Café Site Template

A bilingual (Arabic-first, RTL) brochure website for a coffee shop, built to be
**re-dressed for a new client in about ten minutes**.

No build step. No dependencies. No framework. Six HTML pages, six stylesheets,
four scripts. Open `index.html` and it runs.

```
git clone <repo> && cd <repo>
python3 -m http.server 8000     # → http://localhost:8000
```

---

## What makes it a template

Everything a client changes is separated from everything they don't. Three
files carry 100% of the brand:

| ★ | File | Holds |
|---|------|-------|
| 1 | `assets/css/tokens.css` | Every colour, typeface, radius, shadow and spacing value |
| 2 | `assets/js/content.js` | Every word in the site, in Arabic **and** English, plus the menu and shop data |
| 3 | `assets/brand/*.svg` | Logo, icon mark, house pattern, divider band, favicon |

Nothing else needs editing. That is enforced, not merely intended — the
checks in **Verifying** below prove it, and the `rahwah` branch demonstrates it:
a complete visual reskin that touches only these three surfaces.

## Reskinning, start to finish

1. **Colour** — open `tokens.css` and change the six palette roles at the top
   (`--c-deep`, `--c-mid`, `--c-soft`, `--c-accent`, `--c-accent-2`,
   `--c-ground`). The rest of the site follows automatically.
2. **Type** — change the `@import` URL and the `--ff-latin` / `--ff-arabic`
   stacks in the same file. Font loading lives in `tokens.css` on purpose, so
   swapping type is one edit rather than six.
3. **Words** — open `content.js`. Replace `brand`, `contact`, `hours`, and
   every `{ ar, en }` pair under `t`. Adding a drink is one entry in
   `menu[].items` — never HTML. Then run `node tools/sync-static.js` to
   stamp the new Arabic into the HTML (see below).
4. **Marks** — replace the five SVGs in `assets/brand/`. They are rendered
   through CSS masks, so only the *silhouette* matters; colour comes from your
   tokens. Keep `logo.svg` and `mark.svg` square.
5. **Meta** — set `<title>` and the description/OG tags at the top of each of
   the six HTML files. This is the only per-page edit.
6. **Photos** — see `BRAND.md` for the slot inventory and sizes.

Then run the checks in **Verifying**.

## How the three mechanisms work

**One stylesheet, both directions.** Every directional rule uses CSS *logical*
properties (`margin-inline-start`, `inset-inline-end`, `border-block-end`).
Flipping `<html dir>` mirrors the whole site — no `[dir=rtl]` override blocks,
no second stylesheet. A `margin-left` anywhere in `assets/css/` is a bug.

**Arabic is the static default.** The Arabic copy is written directly into the
HTML, so the site is readable and crawlable with JavaScript off. `i18n.js` only
swaps text when a visitor picks English. The choice persists in `localStorage`
and survives navigation.

The Arabic in the HTML is therefore a **generated mirror** of `content.js`,
not a second copy to maintain by hand. `tools/sync-static.js` rewrites it, and
`--check` fails if the two have drifted — run it after every content edit:

```bash
node tools/sync-static.js            # rewrite the HTML from content.js
node tools/sync-static.js --check    # report drift, change nothing (exit 1 if stale)
```

It only ever rewrites text already bound with a `data-i18n` / `data-site`
attribute, so it cannot touch layout or markup.

**Content renders from data.** Menu categories, bean and merch grids, opening
hours and the address are built by `render.js` from `content.js`, and redraw on
a language change. Those specific sections need JavaScript; a `<noscript>` note
covers the case. Page titles and meta stay static, which is what crawlers weigh
most. If you later want the menu in the HTML source too, prerender it — the
renderers are pure functions of `SITE`.

### Binding attributes

Any element, anywhere in the markup:

```html
<span data-i18n="nav.home">…</span>                 <!-- text from SITE.t.nav.home -->
<img  data-i18n-attr="alt:alt.hero">                <!-- attribute from SITE.t.alt.hero -->
<span data-site="brand.primary">…</span>            <!-- text from SITE.brand.primary -->
<a    data-site-attr="href:contact.maps">…</a>      <!-- attribute from SITE.contact.maps -->
```

`data-site` reads the top level of `SITE` and auto-unwraps an `{ ar, en }` pair,
so brand names, phone numbers and links resolve from `content.js` too.

## Files

```
index.html  menu.html  story.html  shop.html  visit.html  404.html
assets/
  css/  tokens.css ★   reset.css  base.css  layout.css  components.css  pages.css
  js/   content.js ★   i18n.js    render.js  app.js
tools/  sync-static.js   check-brand.js
  brand/ logo.svg ★  mark.svg ★  pattern-primary.svg ★  pattern-band.svg ★  favicon.svg ★
```

`base.css` owns typography and the direction rules, `layout.css` the header /
drawer / footer / grids, `components.css` the buttons, cards, menu rows and
image slots, `pages.css` the hero variants. `tokens.css` must load first.

## Verifying

```bash
# 1. No raw colour may live outside tokens.css — prints nothing if clean
grep -rnE '#[0-9a-fA-F]{3,8}|rgba?\(' assets/css --include='*.css' | grep -v tokens.css

# 2. No physical directional properties — they break RTL. Prints nothing if clean
grep -rnE '(margin|padding)-(left|right)|(^|[^-])\b(left|right):' assets/css --include='*.css'

# 3. The brand SVGs are well-formed — a malformed one fails SILENTLY,
#    the mask just renders nothing and the logo or pattern disappears
node tools/check-brand.js

# 4. The HTML still matches content.js
node tools/sync-static.js --check

# 5. No stray script characters in the copy — an Arabic string with a
#    Hebrew or Syriac letter silently corrupts a word and renders as noise
node -e "global.window={};require('./assets/js/content.js');
const s=JSON.stringify(window.SITE);const bad=[...s].filter(c=>{const p=c.codePointAt(0);
return (p>=0x0590&&p<=0x05FF)||(p>=0x0700&&p<=0x074F)});
console.log(bad.length?'STRAY SCRIPT CHARS: '+[...new Set(bad)].join(' '):'Copy is clean.')"

# 6. Every binding key actually resolves
node -e "global.window={};require('./assets/js/content.js');const S=window.SITE,fs=require('fs');
const g=(r,p)=>p.split('.').reduce((n,k)=>n&&typeof n==='object'?n[k]:undefined,r);let bad=[];
for(const f of fs.readdirSync('.').filter(x=>x.endsWith('.html'))){const h=fs.readFileSync(f,'utf8');
for(const m of h.matchAll(/data-i18n=\"([^\"]+)\"/g))if(g(S.t,m[1])===undefined)bad.push(f+' '+m[1]);
for(const m of h.matchAll(/data-site=\"([^\"]+)\"/g))if(g(S,m[1])===undefined)bad.push(f+' '+m[1]);}
console.log(bad.length?'UNRESOLVED: '+bad.join(', '):'All binding keys resolve.')"
```

By hand, on every page: Arabic loads by default and reads right-to-left; the
toggle flips direction and swaps every string; the choice survives a reload and
a navigation; the mobile drawer opens, closes, and its X stays clickable; no
console errors. Check 375px, 768px and 1440px.

The template ships passing **WCAG AA** contrast on all six pages in both
languages. If you darken or lighten `--c-accent`, re-check it — that one token
drives buttons, prices, links and eyebrows.

## Deploying

It is a folder of static files. Drag it into Netlify, or point GitHub Pages /
Cloudflare Pages / Vercel at the repo root. No build command, no output
directory. `404.html` is picked up automatically by all of them.

One external request: the Google Fonts stylesheet imported at the top of
`tokens.css`. To drop it entirely, download the `.woff2` files into
`assets/fonts/`, replace the `@import` with `@font-face` rules, and the site
becomes fully self-hosted.

## Branches

- **`main`** — this template, unbranded.
- **`rahwah`** — a worked example: the same code dressed as a real Riyadh café.
  `git diff main..rahwah --stat` shows precisely what a reskin costs.
