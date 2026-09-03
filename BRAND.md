# Reskin checklist

Every knob that changes the brand, and nothing that doesn't. Work top to
bottom; each section is independent.

---

## 1 · Palette — `assets/css/tokens.css`

Six roles carry the identity. Everything else in the file is derived and can
usually be left alone.

| Token | Role | Where it shows |
|---|---|---|
| `--c-deep` | Darkest brand tone | Hero ground, footer, headings, logo mark |
| `--c-mid` | Mid tone | Secondary text, deep gradients |
| `--c-soft` | Muted tone | Logo inside empty photo slots |
| `--c-accent` | **Primary action** | Buttons, prices, links, eyebrows, active nav |
| `--c-accent-2` | Secondary accent | Tags, feature icons on dark, today's hours row |
| `--c-ground` | Page background | Everything behind the content |

Derived, adjust only if something looks off: `--c-surface`, `--c-surface-alt`,
`--c-ink`, `--c-ink-soft`, `--c-line`, `--c-on-deep`, `--c-on-accent`.

Alpha values live in `--a-*` so that no `rgba()` ever escapes into another
stylesheet. `--a-pattern` sets how strongly the house pattern shows through
photo slots; `--a-veil` dims the page behind the mobile drawer.

> **Contrast.** `--c-accent` is the risky one: it carries white button text
> *and* sits as coloured text on light grounds. It needs ≥ 4.5:1 both ways. If
> your brand colour is light, keep it for `--c-accent-2` and pick a darker
> shade for `--c-accent`. Re-run the contrast pass in `README.md` after any
> palette change.

## 2 · Type — `assets/css/tokens.css`

```css
@import url('https://fonts.googleapis.com/css2?family=…');   /* line 1 */
--ff-latin:   'Jost', Helvetica, Arial, sans-serif;          /* LTR body + all Latin */
--ff-arabic:  'IBM Plex Sans Arabic', Tahoma, sans-serif;    /* RTL body + Arabic headings */
--ff-display: var(--ff-latin);                               /* Latin headings */
```

Font loading is deliberately in `tokens.css`, not the HTML, so type is a
one-file change. Always keep a real fallback stack after the webfont — the
pages must stay legible if Google Fonts is blocked or slow.

`--ls-wide` (0.22em) is the wide letterspacing on the Latin wordmark and
eyebrows. Arabic doesn't letterspace, so `base.css` already zeroes it under
`html[dir='rtl']`.

## 3 · Marks — `assets/brand/`

| File | Shape | Used by |
|---|---|---|
| `logo.svg` | **square** | Hero badge, empty photo slots |
| `mark.svg` | **square** | Header/footer wordmark, feature icons, small slots |
| `pattern-primary.svg` | **seamless tile** | Hero, page banners, photo slot wash |
| `pattern-band.svg` | **seamless horizontally** | The divider bands between sections |
| `favicon.svg` | any | Browser tab |

The first four are rendered through **CSS masks**, so only the silhouette
matters — solid fill is visible, transparent is hidden, and the colour comes
from your palette. Draw them as flat black shapes on a transparent ground.

`favicon.svg` is the exception: it renders as a real image and carries its own
colours. Match them to `--c-deep` and `--c-ground`.

> **The one rule that will bite you.** An XML comment may not contain a
> double hyphen — and every CSS custom property starts with one. Writing
> `--c-deep` in a comment inside an SVG makes the whole file unparseable, and
> a malformed mask fails *silently*: no console error, no fallback, the logo
> or pattern simply vanishes. Write "the deep token" instead, and run
> `node tools/check-brand.js` after touching these files. It also checks the
> viewBox is present, that `logo.svg` and `mark.svg` are square, and that
> there is artwork for the mask to use.

Both patterns must **tile seamlessly** — any shape crossing an edge has to be
repeated on the opposite edge. Tile scale is set by `--pattern-size` and
`--band-height` in `tokens.css`, not inside the SVGs.

## 4 · Words & data — `assets/js/content.js`

| Key | What to change |
|---|---|
| `brand` | Store name in both scripts, the Latin wordmark line, currency |
| `contact` | Address lines, phone (`phone`, `phoneHref`, `phoneLabel`), email (`email`, `emailHref`), WhatsApp, Instagram, Maps link |
| `hours` | Seven rows. Keep the `key` values — that's how today's row highlights itself |
| `catalog` | Groups in display order; each item takes `price`, optional `tags`, `image`, `ratio`; `featured: true` lifts it onto the home page (first three win) |
| `collections` | Curated sets — same card shape, rendered as a flat grid |
| `faq` | `q` / `a` pairs, rendered as `<details>` so they open without JavaScript |
| `t.*` | Every string on the site, as `{ ar, en }` pairs |
| `t.alt.*` | Alt text for photo slots — update when real photos land |

Adding a product is one object in `catalog[].items`. Never edit HTML for content.

Both grids are drawn by the **generic** renderers, which take their data source
from the markup — so you can point them at any array you add:

```html
<div data-render="catalog" data-source="catalog"></div>
<div data-render="cards"   data-source="collections"></div>
```

### Retargeting the vertical

The default copy is written for a **perfume and oud house**, the highest-margin
small retail in this market. Nothing in the page structure, the CSS or the
engine assumes it. To sell this to another kind of shop, edit `content.js`
alone:

| Change | To |
|---|---|
| `catalog[]` groups | Abayas / gifts / flowers / accessories / jewellery |
| `tags` | Sizes · colours · materials · stem counts |
| `collections[]` | Seasons · occasions · price bands |
| `faq[]` | Alterations · same-day delivery · sizing · care |
| `t.hero.*`, `t.story.*` | The shop's own voice |

The five pages, the WhatsApp ordering flow and every check stay as they are.

**After every edit here, run `node tools/sync-static.js`.** The Arabic sitting
in the HTML is a generated mirror of this file — it exists so the site reads
correctly with JavaScript off. Skip the sync and a no-JS visitor still sees the
*previous* brand's words. `node tools/sync-static.js --check` will tell you.

Watch for stray script characters when typing Arabic — a Hebrew or Syriac
letter slipped into an Arabic word looks almost right and renders as noise.
Check 4 in `README.md` catches it.

## 5 · Page meta — the six HTML files

The only per-page edit. At the top of each: `<title>`, `<meta name="description">`,
`og:title`, `og:description`. These stay static because crawlers weigh them
most, and they can't come from `content.js` without costing SEO.

## 6 · Photos

Every slot ships **filled with the logo** on a patterned brand ground, so an
un-photographed site still looks finished. Replace a slot by swapping the whole
element:

```html
<!-- before -->
<div class="ph ph--hero" role="img" aria-label="…"><span class="ph__mark"></span></div>
<!-- after -->
<img class="ph-img" src="assets/photos/hero.jpg" alt="…" width="1600" height="1000">
```

### Slot inventory

| Page | Slot | Size | Subject |
|---|---|---|---|
| `index.html` | hero | 1600×1000 | The store, wide, warm light |
| `index.html` | counter | 1000×1250 | The scale and blending table, portrait |
| `index.html` | gallery ×4 | 800×800 | Testing corner, scale, gift box, storefront |
| `index.html` | featured ×3 | 1000×1250 | Generated per product by `render.js` |
| `shop.html` | catalogue | 1000×1250 | Generated per product by `render.js` |
| `collections.html` | sets | 800×800 | Generated per set (`ratio: 'ph--square'`) |
| `story.html` | room | 1000×1250 | The testing corner, portrait |
| `visit.html` | map | — | Replace with a Google Maps `<iframe>` once the pin is live |

**Generated slots need no code at all.** Anything rendered from data — featured
drinks, beans, merch, team members — takes an optional `image` (and optional
per-item `alt`) in `content.js`, and `media()` in `render.js` emits a real
`<img>` when it finds one, falling back to the branded placeholder when it does
not. Adding photography is a content edit:

```js
{ price: '18',
  image: 'assets/photos/latte.jpg',
  alt:   { ar: 'كوب لاتيه على الطاولة', en: 'A latte on the table' },
  name:  { ar: 'لاتيه', en: 'Latte' },
  desc:  { ar: '…', en: '…' } }
```

Put files under `assets/photos/`. The intrinsic size is taken from the slot
ratio, so a photo and its placeholder reserve the same box and nothing shifts
as the image loads.

Ratios available: `.ph--hero` 16:10 · `.ph--square` 1:1 · `.ph--portrait` 4:5 ·
`.ph--wide` 21:9 · `.ph--tall` 3:4 · `.ph--deep` for a dark ground.

## 7 · Before handover

Run all five checks and the contrast pass from `README.md`, then walk the six
pages in both languages at 375px, 768px and 1440px. Confirm the WhatsApp,
Maps, phone, email and Instagram links all point at the client's real accounts —
they resolve from `contact` in `content.js`, so getting that block right fixes
every link on the site at once.
