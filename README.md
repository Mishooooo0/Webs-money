# Webs-money — the hub

Bilingual (Arabic-first, RTL) website templates for small businesses, and the
shelf you pick one from.

This branch is **the hub**, not a website. It carries the shelf page, the shared
engine every template inherits, and the tooling. The templates live on their own
branches; client work lives in a separate private repo.

```
main                the hub + the shared engine
├── template-cafe       01 · Café & Restaurant
├── template-services   02 · Services & Booking
└── template-retail     03 · Retail & Boutique
```

```bash
bash .github/pages/assemble.sh          # build the site into _site/
node .github/pages/shoot.js             # add card screenshots (optional)
python3 -m http.server --directory _site 8000
```

---

## Starting a client project

Client work is **not** in this repo. It lives in the private
`Mishooooo0/web-money-clients`, and is never published to the public site.

From a checkout of that repo:

```bash
tools/start-project.sh cafe al-nakheel "عطور النخيل"
```

That branches from the chosen template, stamps the name in, writes a `CLIENT.md`
listing everything still holding a placeholder, and verifies the result. It does
not push and does not touch the catalogue — it prints what to do for both.

To pick up engine fixes on a client branch later:

```bash
git fetch templates && git merge templates/main
```

## What keeps client work private

Worth being exact, because the design depends on it.

The passphrase on the hub's client shelf is **not** access control. It is served
to every visitor of a public page, the hash is readable in devtools, and the
check runs in the visitor's own browser. It is a doormat.

The privacy is structural instead:

- **No client site is ever published here.** `assemble.sh` copies template
  branches only. There is no client HTML on the public origin to find, with or
  without the passphrase.
- **The client cards link to the private repo**, where GitHub enforces access —
  someone without it gets a 404 from GitHub, not from us.
- **`tools/check-hub.js` fails the build** if a client entry ever gains a `dest`,
  or if `assemble.sh` grows a `clients/` path. The guarantee is asserted, not
  remembered.

Changing the passphrase:

```bash
node tools/set-hub-password.js "the new one"
```

GitHub Pages on a private repo needs a paid plan, so client sites have no live
URL until they are deployed to the client's own hosting. At that point set
`liveUrl` on their catalogue entry and the card links there instead.

## The catalogue

`hub/catalogue.js` is the one list of what exists. The hub page renders from it,
`assemble.sh` publishes from it, and `start-project.sh` validates against it — so
they cannot drift apart.

A template entry has `branch` and `dest` and gets published. A client entry has
neither, on purpose.

## Files

```
hub/          index.html · hub.css · hub.js · gate.js · catalogue.js · favicon.svg
assets/       the shared engine, and a vertical-neutral base every template overrides
  css/        reset · base · layout · components · pages   (engine)
              tokens.css                                   ★ per-template
  js/         i18n · render · app                          (engine)
              content.js                                   ★ per-template
  brand/      five SVGs                                    ★ per-template
tools/        check · check-brand · check-hub · sync-static · audit
              start-project.sh · set-hub-password.js
.github/      ci.yml · pages.yml · pages/assemble.sh · pages/shoot.js
```

`BRAND.md` is the reskin checklist — the three files that carry 100% of a brand,
and how to change them.

## Checks

`ci.yml` picks the right set from the shape of the checkout, so a renamed branch
cannot skip its checks:

```bash
node tools/check-hub.js    # on this branch: catalogue, links, and the privacy guard
node tools/check.js        # on a template branch: the six static checks
node tools/audit.js        # on a template branch: WCAG AA, console errors, overflow
```

## Adding a template

Branch from `main`, add your pages, and override `tokens.css`, `content.js` and
`assets/brand/`. Then add an entry to `hub/catalogue.js` and a line to the
`branches:` list in `.github/workflows/pages.yml`.

The engine needs no changes: `render.js` renders from `data-render` mounts with a
`data-source`, so a new template usually needs no new renderer at all. Three
templates share it unmodified.
