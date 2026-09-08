# SITE.md — the website's own handover notes

`index.html` is the public site for Obsidian-Hub. This file lists what is
still blank in it, and the one thing to know about counting visitors.

---

## 1. ⚠ Blanks you have to fill

Nothing was invented for the contact section. Every value there ships as a
conspicuous dashed placeholder, because a made-up phone number sends a real
customer to somebody else's phone.

| Where | What is missing |
|---|---|
| `index.html` → `#contact` | **WhatsApp number** |
| `index.html` → `#contact` | **Email address** |
| `index.html` → `#contact` | **Instagram handle** |

Each is one `<span class="blank">` to replace. When you replace one, make the
value a real link — `href="https://wa.me/9665…"`, `mailto:`, the profile URL —
so a phone can act on it in one tap.

The three `label` strings beside them are already bilingual in `site.js`
(`labelWhatsapp`, `labelEmail`, `labelInstagram`). The values themselves are
not translated — a phone number reads the same in both languages.

## 2. Claims the site makes about the business

Everything the page asserts is true of the templates as they stand today, and
each one is checkable:

- **Arabic-first, RTL** — the templates are authored `dir="rtl"` with Arabic
  type and spacing, not flipped from an English layout.
- **Two languages, one tap** — the toggle is real, on this page and on all
  three templates.
- **No dependencies, no build step** — `package.json` has no runtime
  dependencies; Playwright is used only by `tools/audit.js`.
- **The files are yours** — the export in the private repo hands over a
  complete folder plus `serve.js`.

**There is no pricing, no turnaround-time promise, no client list and no
testimonial on the page**, because none of those has been established yet.
Add them when they are true. A "our work" section is deliberately absent
rather than present-and-empty — both client sites are still `liveUrl: null`.

## 3. Counting visitors

`analytics.html` reads `/_stats`, which `tools/site-server.js` in the private
repo serves **to loopback only**. Two outcomes, and the page says which:

- **served by Node** → real first-party numbers, no cookies, no IP stored
- **static host** → an honest "nothing is counting here" panel

It never shows zeros in place of data it could not fetch.

### ⚠ Serving this site at the root scores zero

`site-server.js` in multi-site mode takes the **first path segment** as the
site name, and deliberately does not count pages at the root — otherwise
opening the dashboard would count as a visit to itself.

So if you serve this website at `/` it records nothing. Pass the option that
already exists:

```js
createServer({ root: …, singleSite: 'obsidian-hub' })
```

Then every page belongs to one site and is counted.

### ⚠ Opening this page counts as a visit

In `singleSite` mode every page under the root belongs to the site, and
`analytics.html` is one of them — so checking your numbers adds one to them.
The multi-site path avoids this by not counting the root at all, but that is
the same behaviour that scores this site zero, so you cannot have both as
things stand.

It is small and it is consistent, but it is real: treat `index.html` as the
figure that matters and read `analytics.html`'s own row as your own visits.
Fixing it properly means an exclude option in `site-server.js`, which is
shared with every client export and so is a change to make deliberately, not
in passing.

### On a static host instead

Cloudflare Web Analytics covers the GitHub Pages / Cloudflare Pages case. The
tag is already in `index.html`, **commented out and without a token** — a
fabricated token fails silently, which is worse than no analytics.

1. Cloudflare dashboard → Analytics & Logs → Web Analytics
2. Add the site, copy the token
3. Paste it into the tag and uncomment

## 4. How the templates page stays honest

`templates.html` tells a visitor *"this template has these pages"* and *"it
holds these things"*. Both are claims about a branch, and claims about
branches go stale.

So neither is written into the page. Both live in `hub/catalogue.js` as
`pages[]` and `holds[]`, and `tools/check-hub.js` §2b compares them against
the branch on every push:

- every declared page must exist on the branch, **and** every `.html` on the
  branch except `404.html` must be declared — set equality, so an
  undeclared page fails the build just as loudly as a missing one
- every `holds[].key` must be a real top-level key in that branch's
  `assets/js/content.js`

**Add a page to a template and the build fails until you add it to the
catalogue.** That is the point. The page names themselves are copied from
each template's own `t.nav`, so the site describes a template in the
template's own words.

Screenshots follow the same list: `.github/pages/shoot.js` walks `pages[]`
and writes `shots/<id>/<name>.jpg`. A missing shot leaves the accent swatch
in place and breaks nothing.

## 5. Where things live

| | |
|---|---|
| `index.html`, `site.css`, `site.js` | the homepage |
| `templates.html`, `templates.css`, `templates.js` | the templates sub-page |
| `analytics.html`, `analytics.css`, `analytics.js` | owner-only, not linked from the site |
| `hub/catalogue.js` | the one list of templates — both pages render from it |
| `.github/pages/assemble.sh` | builds `_site/`: this site at `/`, templates under their paths |

The site is **self-contained**: it imports nothing from `assets/` and nothing
from a template branch, so a template mid-reskin can never take the front door
down.

To change a template's name, description, "fits" line, page list or contents,
edit `hub/catalogue.js` — nothing else. `assemble.sh`, `tools/check-hub.js`,
`shoot.js` and the private clients server all read the same file.
