# RAHWAH · رهوة — handover

This branch is the template on `main`, dressed as **RAHWAH**, a specialty
coffee shop in Al Malqa, Riyadh ([@rahwa.sa](https://instagram.com/rahwa.sa)).

Read `README.md` for how the site works and `BRAND.md` for the reskin
checklist. This file covers only what is specific to Rahwah.

---

## What the reskin actually cost

```bash
git diff main..rahwah --stat
```

Five brand SVGs, `tokens.css`, `content.js`, and the `<title>`/meta on six
pages. Not one line of `reset.css`, `base.css`, `layout.css`,
`components.css`, `pages.css`, `i18n.js`, `render.js`, `app.js` or `tools/`
changed. That is the whole argument for the template — verify it yourself:

```bash
git diff main --name-only -- assets/css/base.css assets/css/layout.css \
  assets/css/components.css assets/css/pages.css assets/js/i18n.js \
  assets/js/render.js assets/js/app.js      # prints nothing
```

## What is taken from the café

Confirmed from Rahwah's own channels:

| | |
|---|---|
| Name | رهوة · RAHWAH |
| **What it means** | «رهوة كلمة عربية تعني مكان التجمع، ويُقال *رهوة آل فلان* للدلالة على مكان يجتمع فيه أفراد العائلة، وأنتم عائلتنا ورهوة هي مكانكم دائمًا» — the café's own words, now the spine of the story page and its pull quote |
| Tagline | «مكان يرحّب بك» — the café's own bio line |
| Voice | «هلا بك في رهوة», «قهوة، تفاصيل صغيرة، وطلبات تُصنع بحب» |
| District | الرياض – حي الملقا |
| Instagram | `@rahwa.sa` |
| Maps pin | `maps.app.goo.gl/KcsFkwFw1d4gZxm7A` |
| **Drinks menu** | Complete — 18 items across hot and cold, in the café's own grouping (espresso / filter / no-coffee), with their real prices |
| **Opening hours** | Confirmed — Sat–Wed 6am–12am, Thu 6am–1am, Fri 12pm–1am |
| Photography | One real photo: the filter carafe and Rahwah cup on the Sadu cushion |
| Coffee lot | **La Palma** — Colombia, anaerobic; grape, pear, pomegranate |
| Merch | hoodie, tee, cap, and the stamped clay cups they serve in |

An earlier draft had رهوة meaning "openness and calm". That was a guess and it
was wrong — the café's own story gives it as a **gathering place**. Corrected
throughout.

Palette and motifs are read off the shop's own photographs: espresso brown
from the timber and the badge, warm cream from the walls and cups, terracotta
from the shopfront sign and the Sadu cushion, sage from the patio table. The
house pattern is the eight-point Najdi star from the floor tile; the divider
band is the Sadu weave.

## ⚠ What is a placeholder

Do not launch before replacing these. Each is a single edit in
`assets/js/content.js`, and there is a comment block at the top of that file
saying the same thing.

| What | Where | Note |
|---|---|---|
| Phone / WhatsApp | `contact.phone`, `phoneHref`, `phoneLabel`, `whatsapp` | Deliberately written as `5X XXX XXXX` so nobody mistakes it for a real number. Every phone and WhatsApp link on the site resolves from here. |
| **Sweets menu** | `menu[]` | The café has a الحلويات highlight but does not publish prices. The category is **left out rather than invented** — paste it in with the same shape as the drinks categories and it renders itself. The menu page eyebrow says المشروبات only until then. |
| Bean & merch prices | `beans[].price`, `merch[].price` | Plausible for Riyadh specialty, not confirmed. The La Palma lot's origin, process and tasting notes ARE real. |
| Email | `contact.email`, `emailHref` | `hello@rahwa.sa` is assumed, not verified. |
| More photography | `assets/photos/` | Only one real photo so far. Every other slot still carries the branded placeholder. |

## The logo

`assets/brand/logo.svg` is a **stand-in**: the sprig mark over a drawn
`RAHWAH` wordmark in a ring. Drop the café's real logo file in over it — keep
the viewBox square and the artwork a flat silhouette, since it is rendered
through a CSS mask and takes its colour from `tokens.css`.

The Arabic **رهوة** is deliberately *not* drawn in the SVG. It renders as live
HTML text in the header and footer wordmark, so it stays crisp at any size and
remains selectable, searchable and translatable. Latin letterforms in the
badge are drawn as paths rather than set as `<text>` because webfonts do not
load inside a masked SVG and system fonts differ per platform.

## Photos

One real photograph is in: the filter carafe beside a Rahwah cup on the Sadu
cushion, at `assets/photos/rahwah-filter-sadu.jpg` (900×1232, 144 KB). It sits
in the portrait slot on the home page and on the story page.

It is deliberately **not** used in the three-card featured strip: one real photo
among two placeholders reads as an unfinished page, whereas one large photo
paired with text reads as a deliberate layout. When more photos arrive, add
`image:` to the menu items and the strip fills in properly.

Every remaining slot is filled with the Rahwah badge on the star-lattice ground,
so the site looks finished before the rest of the photography exists. `BRAND.md` has
the full slot inventory with sizes and intended subjects. Swap one like this:

```html
<!-- before -->
<div class="ph ph--hero" role="img" aria-label="…"><span class="ph__mark"></span></div>
<!-- after -->
<img class="ph-img" src="assets/photos/hero.jpg" alt="…" width="1600" height="1000">
```

On `visit.html` the map slot is where a Google Maps `<iframe>` goes once the
pin is embedded.

## Before launch

```bash
node tools/check-brand.js          # brand SVGs well-formed
node tools/sync-static.js --check  # HTML matches content.js
```

Plus the rest of the verification list in `README.md`. This branch currently
passes WCAG AA contrast on all six pages in both languages, with no console
errors and no horizontal overflow at 375 / 768 / 1440px.

> Built from public material on the café's Instagram as a proposal. Rahwah has
> not commissioned or reviewed it — confirm the placeholders above with the
> owners before publishing anything under their name.
