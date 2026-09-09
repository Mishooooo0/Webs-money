# Obsidian-Hub

The public website, and the bilingual (Arabic-first, RTL) website templates it
sells.

**This branch is the website.** `/` is the site a customer lands on; each
template sits under its own path at `/cafe/`, `/services/`, `/retail/` and is
reachable from the homepage. Client work lives in a separate private repo and
is never published here.

The repository is still named `Webs-money` on GitHub — renaming it is a
settings change, and every clone URL in these docs changes with it.

```
main                the website + hub/catalogue.js
├── template-cafe       01 · Café & Restaurant
├── template-services   02 · Services & Booking
└── template-retail     03 · Retail & Boutique
```

## Run it

```bash
npm run serve                  # build and serve on http://localhost:8000
node tools/serve.js --port 3000
node tools/serve.js --shots    # also render the card screenshots (~1 min)
```

That builds the whole published site — homepage and all three template demos,
pulled out of this clone from their own branches — and serves it.

Two things worth knowing:

- **Edits to the root files are live.** `index.html`, `site.css`, `work.js` and
  `hub/catalogue.js` are served from the working copy, not from `_site`, so a
  reload shows your change. Templates come from `_site` and need a restart,
  since they are rebuilt out of their branches.
- **`/_stats` is served too**, so `analytics.html` has real numbers to render
  locally. It is an in-memory counter that dies with the process — the real one
  is `site-server.js` in the clients repo.

Without `--shots` every card thumbnail 404s and falls back to its accent
swatch. That is the designed behaviour, and the server says so on startup.

## What is on this branch

| | |
|---|---|
| `index.html`, `site.css`, `site.js` | the homepage. Self-contained: imports nothing from a template branch |
| `templates.html`, `templates.css`, `templates.js` | what is inside each template — pages, contents, live demo |
| `analytics.html`, `analytics.css`, `analytics.js` | the owner's visitor counts. Not linked from the site |
| `hub/catalogue.js` | **the one list of templates**, down to each one's pages. Four things read it, two of them in the private repo, and `check-hub.js` proves it still matches the branches |
| `SITE.md` | the blanks still to fill, and how counting works |
| `BRAND.md` | the three-file reskin surface for a template |
| `tools/serve.js` | build and serve the whole site locally |
| `tools/` | the checks, and `start-project.sh`, which starts a client build |

## The one rule

Templates are published. **Clients are not.**

A template entry in `hub/catalogue.js` has `branch` and `dest`, and
`assemble.sh` copies it into the site. A client entry has neither, on purpose —
and `tools/check-hub.js` fails the build if one ever gains a `dest`, or if a
template branch is caught carrying a copy of `hub/`. The website itself has no
markup for a client list at all.

What actually keeps client work private is that it is in a private repo and no
client HTML is ever published from here. The catalogue entries exist so the
owner's dashboard in that repo can list them.

## Checks

```bash
node tools/check-hub.js     # this branch: catalogue, links, the privacy guard
node tools/check.js         # a template branch: the six static checks
node tools/audit.js         # browser: console errors, overflow, AA contrast
```

CI picks between the first two by looking for `hub/catalogue.js`, so a renamed
branch cannot skip its checks.

## Starting a client project

From a checkout of the **private** clients repo:

```bash
tools/start-project.sh cafe llabate "لابيت" "Llabate"
```

It fetches the template branch from this remote, creates the client branch from
it, stamps the name in, and writes a `CLIENT.md` listing everything still
missing. Add `--multi-location` if the business has more than one branch.
