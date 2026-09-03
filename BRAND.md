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

Both patterns must **tile seamlessly** — any shape crossing an edge has to be
repeated on the opposite edge. Tile scale is set by `--pattern-size` and
`--band-height` in `tokens.css`, not inside the SVGs.

## 4 · Words & data — `assets/js/content.js`

| Key | What to change |
|---|---|
| `brand` | Café name in both scripts, the Latin wordmark line, currency |
| `contact` | Address lines, phone (`phone`, `phoneHref`, `phoneLabel`), email (`email`, `emailHref`), WhatsApp, Instagram, Maps link |
| `hours` | Seven rows. Keep the `key` values — that's how today's row highlights itself |
| `menu` | Categories in display order; `featured: true` lifts an item onto the home page (first three win) |
| `beans` / `merch` | The shop grids |
| `t.*` | Every string on the site, as `{ ar, en }` pairs |
| `t.alt.*` | Alt text for photo slots — update when real photos land |

Adding a drink is one object in `menu[].items`. Never edit HTML for content.

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
| `index.html` | hero | 1600×1000 | The room, wide, natural light |
| `index.html` | counter | 1000×1250 | Barista at the counter, portrait |
| `index.html` | gallery ×4 | 800×800 | Room, cup, sweets, storefront |
| `story.html` | room | 1000×1250 | The room early in the day, portrait |
| `story.html` | counter | 1200×900 | The team behind the bar |
| `visit.html` | map | — | Replace with a Google Maps `<iframe>` once the pin is live |
| `shop.html` | beans, merch | 1000×1250 / 800×800 | Generated per product by `render.js` |
| `index.html` | featured ×3 | 800×800 | Generated per drink by `render.js` |

The generated slots (shop and featured) come from `placeholder()` in
`render.js`. To use real product photography, add an image path to the item in
`content.js` and have `placeholder()` emit an `<img>` when one is present.

Ratios available: `.ph--hero` 16:10 · `.ph--square` 1:1 · `.ph--portrait` 4:5 ·
`.ph--wide` 21:9 · `.ph--tall` 3:4 · `.ph--deep` for a dark ground.

## 7 · Before handover

Run all five checks and the contrast pass from `README.md`, then walk the six
pages in both languages at 375px, 768px and 1440px. Confirm the WhatsApp,
Maps, phone, email and Instagram links all point at the client's real accounts —
they resolve from `contact` in `content.js`, so getting that block right fixes
every link on the site at once.
