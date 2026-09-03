# Services & Booking Template

A bilingual (Arabic-first, RTL) website for a business that sells appointments —
salons, barbershops, clinics, gyms, spas, studios — built to be **re-dressed for
a new client in about ten minutes**.

Booking is a WhatsApp deep link rather than a calendar, because that is what
small businesses here actually use. Every such link resolves from `contact`
in `content.js`. See `BRAND.md` for retargeting the copy to a different
vertical without touching a line of code.

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
index.html  services.html  team.html  story.html  book.html  404.html
assets/
  css/  tokens.css ★   reset.css  base.css  layout.css  components.css  pages.css
  js/   content.js ★   i18n.js    render.js  app.js
tools/  check.js  audit.js  sync-static.js  check-brand.js
.github/ workflows/{ci,pages}.yml   pages/{assemble.sh,index.html}
  brand/ logo.svg ★  mark.svg ★  pattern-primary.svg ★  pattern-band.svg ★  favicon.svg ★
```

`base.css` owns typography and the direction rules, `layout.css` the header /
drawer / footer / grids, `components.css` the buttons, cards, menu rows and
image slots, `pages.css` the hero variants. `tokens.css` must load first.

## Verifying

Two commands cover everything, and both run in CI on every push to every branch:

```bash
node tools/check.js     # 6 static checks — no dependencies, about a second
node tools/audit.js     # renders every page in Chromium, in both languages
```

`check.js` enforces the invariants that make a reskin cheap. Each exists
because breaking it produced a real bug that reading the diff did not catch:

1. No raw colour outside `tokens.css` — this is what keeps a reskin a one-file edit.
2. No physical directional properties — `margin-left` breaks Arabic RTL while looking fine in English.
3. Brand SVGs well-formed — a malformed one fails *silently* and its artwork simply disappears.
4. The static Arabic matches `content.js` — otherwise a no-JS visitor reads the previous client's words.
5. No stray-script characters — a Hebrew letter inside an Arabic word looks almost right and renders as noise.
6. Every `data-i18n` / `data-site` key resolves — no element silently keeps stale text.

`audit.js` catches what only appears once a browser has laid the page out:
console errors and uncaught exceptions, horizontal overflow, **WCAG AA contrast
on every text node in both languages**, brand SVGs that fail to load behind a
mask, and the language toggle actually flipping `dir`.

By hand, still worth doing before handover: walk the pages at 375px, 768px and
1440px, confirm the mobile drawer opens and its X stays clickable, and check
every contact link points at the client's real accounts.

### The one dependency

The **websites** have none — that is the point, and it is what keeps hosting
free and maintenance nil. `tools/audit.js` needs Playwright to drive a browser,
declared in `package.json` under `devDependencies`. It is never needed to build,
serve or deploy a site:

```bash
npm install && npx playwright install chromium   # only to run the audit
```

## Continuous integration

`.github/workflows/ci.yml` runs both commands on **every branch** — templates
and client deliveries alike. A client branch that quietly breaks the engine
fails here rather than in front of the client.

`.github/workflows/pages.yml` publishes everything to one GitHub Pages site,
assembled by `.github/pages/assemble.sh` from several branches:

```
/                  the gallery
/cafe/             café + restaurant template   (main)
/services/         services + booking template  (template-services)
/clients/rahwah/   Rahwah                       (rahwah)
```

Adding a client is one line at the bottom of `assemble.sh`. Every path inside
a site is relative, so each one works unchanged under its sub-path.

## Deploying

It is a folder of static files. Drag it into Netlify, or point GitHub Pages /
Cloudflare Pages / Vercel at the repo root. No build command, no output
directory. `404.html` is picked up automatically by all of them.

One external request: the Google Fonts stylesheet imported at the top of
`tokens.css`. To drop it entirely, download the `.woff2` files into
`assets/fonts/`, replace the `@import` with `@font-face` rules, and the site
becomes fully self-hosted.

## Branches

Branch per business. Templates are the standard product; a branch named after
a business is a real delivery for that client.

- **`main`** — café + restaurant template, and the shared engine every branch inherits.
- **`template-services`** — services + booking template (salons, clinics, gyms).
- **`rahwah`** — client delivery for RAHWAH, a café in Al Malqa, Riyadh.

Fixes to the engine land on `main` and merge outward. Client branches never
touch shared code, which `git diff` proves:

```bash
git diff main --name-only -- assets/css/base.css assets/css/layout.css \
  assets/css/components.css assets/js/i18n.js assets/js/render.js assets/js/app.js
# prints nothing on a client branch
```
