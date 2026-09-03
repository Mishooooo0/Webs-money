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
| Tagline | «مكان يرحّب بك» — the café's own bio line |
| Voice | «هلا بك في رهوة», «قهوة، تفاصيل صغيرة، وطلبات تُصنع بحب» |
| District | الرياض – حي الملقا |
| Instagram | `@rahwa.sa` |
| Maps pin | the café's own `maps.app.goo.gl` link |
| Coffee lot | **La Palma** — Colombia, anaerobic; grape, pear, pomegranate |
| Merch | hoodie, tee, cap, and the stamped clay cups they serve in |

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
| Opening hours | `hours[]` | A plausible Riyadh pattern with the late Thursday and the Friday-prayer gap. Not confirmed. |
| Prices | `menu[].price`, `beans[].price`, `merch[].price` | Plausible for Riyadh specialty. Not confirmed. |
| Email | `contact.email`, `emailHref` | `hello@rahwa.sa` is assumed, not verified. |

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

Every photo slot is filled with the Rahwah badge on the star-lattice ground,
so the site looks finished before a single photograph exists. `BRAND.md` has
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
