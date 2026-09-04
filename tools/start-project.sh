#!/usr/bin/env bash
# ============================================================
# start-project.sh — start a client project from a template.
#
#   tools/start-project.sh <template-id> <client-slug> ["Client Name"] [--multi-location]
#   tools/start-project.sh retail al-nakheel "عطور النخيل"
#   tools/start-project.sh cafe qahwa-co "قهوة" --multi-location
#
# --multi-location seeds a locations[] array for a business with more than one
# branch. The engine renders a card per branch wherever an address appears —
# no extra page, no extra markup. Leave it off for a single location.
#
# Run it from a checkout of the PRIVATE clients repo (web-clients).
# It fetches the chosen template branch from the templates remote, creates
# the client branch from it, stamps the name in, writes a CLIENT.md
# checklist, and verifies the result.
#
# It deliberately does NOT push, and does NOT edit the hub catalogue.
# Both are decisions; it prints exactly what to do for each instead.
# ============================================================
set -euo pipefail

TEMPLATES_REMOTE_NAME="templates"
TEMPLATES_REMOTE_URL="https://github.com/Mishooooo0/Webs-money.git"

die() { printf '\nstart-project: %s\n' "$1" >&2; exit 1; }

MULTI_LOCATION=false
ARGS=()
for arg in "$@"; do
  if [ "$arg" = "--multi-location" ]; then MULTI_LOCATION=true; else ARGS+=("$arg"); fi
done
set -- "${ARGS[@]+"${ARGS[@]}"}"

TEMPLATE="${1:-}"
SLUG="${2:-}"
DISPLAY="${3:-}"

[ -n "$TEMPLATE" ] && [ -n "$SLUG" ] || die 'usage: tools/start-project.sh <template-id> <client-slug> ["Client Name"] [--multi-location]'
[[ "$SLUG" =~ ^[a-z0-9][a-z0-9-]*$ ]] || die "client slug must be lowercase letters, digits and dashes — got '$SLUG'"
git rev-parse --git-dir >/dev/null 2>&1 || die 'not inside a git repository'
[ -z "$(git status --porcelain)" ] || die 'working tree is not clean — commit or stash first'

# ---- Wire up the templates remote, then read the catalogue from it -------
if ! git remote get-url "$TEMPLATES_REMOTE_NAME" >/dev/null 2>&1; then
  echo "adding remote '$TEMPLATES_REMOTE_NAME' -> $TEMPLATES_REMOTE_URL"
  git remote add "$TEMPLATES_REMOTE_NAME" "$TEMPLATES_REMOTE_URL"
fi
echo "fetching templates…"
git fetch --quiet "$TEMPLATES_REMOTE_NAME"

# The catalogue on the templates repo is the authority on what exists.
CATALOGUE=$(git show "$TEMPLATES_REMOTE_NAME/main:hub/catalogue.js" 2>/dev/null) \
  || die "could not read hub/catalogue.js from $TEMPLATES_REMOTE_NAME/main"

BRANCH=$(node -e '
  global.window = {};
  const src = require("fs").readFileSync(0, "utf8");
  new Function(src).call(global);
  const t = (window.CATALOGUE.templates || []).find(x => x.id === process.argv[1]);
  if (!t) {
    console.error("unknown template. Available: " +
      window.CATALOGUE.templates.map(x => x.id).join(", "));
    process.exit(1);
  }
  process.stdout.write(t.branch);
' "$TEMPLATE" <<<"$CATALOGUE") || die "template '$TEMPLATE' is not in the catalogue"

git rev-parse --verify --quiet "refs/heads/$SLUG" >/dev/null && die "branch '$SLUG' already exists"

# ---- Branch from the template -------------------------------------------
echo "creating '$SLUG' from $TEMPLATES_REMOTE_NAME/$BRANCH…"
git checkout -q -b "$SLUG" "$TEMPLATES_REMOTE_NAME/$BRANCH"

# ---- Stamp the client's name where the site reads it --------------------
if [ -n "$DISPLAY" ]; then
  LATIN=$(printf '%s' "$SLUG" | tr 'a-z-' 'A-Z ' )
  node -e '
    const fs = require("fs");
    const [display, latin] = process.argv.slice(1);
    const f = "assets/js/content.js";
    let s = fs.readFileSync(f, "utf8");
    s = s.replace(/(primary:\s*\{\s*ar:\s*)'"'"'[^'"'"']*'"'"'/, `$1'"'"'${display}'"'"'`);
    s = s.replace(/(secondary:\s*)'"'"'[^'"'"']*'"'"'/, `$1'"'"'${latin}'"'"'`);
    fs.writeFileSync(f, s);
  ' "$DISPLAY" "$LATIN"
  node tools/sync-static.js >/dev/null
  echo "stamped brand name: $DISPLAY / $LATIN"
fi

# ---- Optional: scaffold a multi-branch business -------------------------
if $MULTI_LOCATION; then
  node -e '
    const fs = require("fs");
    const f = "assets/js/content.js";
    let s = fs.readFileSync(f, "utf8");
    const block = `
  /* ---- Locations -----------------------------------------------------
     One entry per branch. Present = the engine renders a card per branch
     wherever an address appears (visit page, home page, footer). Delete
     this array entirely to go back to the single contact.addressLines. */
  locations: [
    { name: { ar: "الفرع الأول", en: "First branch" },
      addressLines: { ar: ["المدينة – اسم الحي"], en: ["City – District"] },
      phoneLabel: "+966 50 000 0000",
      phoneHref:  "tel:+966500000000",
      hoursNote:  { ar: "", en: "" },
      maps: "https://maps.google.com/" },
    { name: { ar: "الفرع الثاني", en: "Second branch" },
      addressLines: { ar: ["المدينة – اسم الحي"], en: ["City – District"] },
      phoneLabel: "+966 50 000 0000",
      phoneHref:  "tel:+966500000000",
      hoursNote:  { ar: "", en: "" },
      maps: "https://maps.google.com/" }
  ],
`;
    // Insert just before the hours block, which every template carries.
    const anchor = s.indexOf("  /* ---- Opening hours");
    if (anchor === -1) { console.error("could not find the hours block to anchor locations[]"); process.exit(1); }
    s = s.slice(0, anchor) + block.replace(/^\n/, "") + "\n" + s.slice(anchor);
    fs.writeFileSync(f, s);
  ' || die 'could not seed locations[]'
  echo "seeded locations[] — two branches, edit them in assets/js/content.js"
fi

# ---- The handover checklist ---------------------------------------------
cat > CLIENT.md <<EOF
# ${DISPLAY:-$SLUG}

Client project, started from **$TEMPLATE** (\`$BRANCH\`).
Read \`README.md\` for how the site works and \`BRAND.md\` for the reskin
checklist. This file tracks what is real and what is still a placeholder.

## Confirmed

_Nothing yet. Move a line up from below as the client confirms it._

## ⚠ Placeholder — must be replaced before launch

Each of these is one edit in \`assets/js/content.js\`.

| What | Where | Note |
|---|---|---|
| Phone / WhatsApp | \`contact.phone\`, \`phoneHref\`, \`phoneLabel\`, \`whatsapp\` | Every order and call link on the site resolves from here. |
| Email | \`contact.email\`, \`emailHref\` | |
| Address | $( $MULTI_LOCATION && echo '\`locations[]\` — one entry per branch' || echo '\`contact.addressLines\`, \`contact.maps\`' ) | |
| Opening hours | \`hours[]\` | Keep the \`key\` values — they drive today's highlight. |
| Prices and items | the catalogue arrays | Never invent prices on a real client's site. |
| Photography | \`assets/photos/\` | Slots ship filled with the brand mark; see BRAND.md §6. |
| Brand marks | \`assets/brand/*.svg\` | Drop in the client's real logo. |
| Palette and type | \`assets/css/tokens.css\` | |
| Page meta | \`<title>\` and og tags on each page | |

## Before launch

\`\`\`bash
node tools/check.js      # six static checks
node tools/audit.js      # WCAG AA both languages, console errors, overflow
\`\`\`

## Picking up engine fixes from the templates repo

\`\`\`bash
git fetch $TEMPLATES_REMOTE_NAME
git merge $TEMPLATES_REMOTE_NAME/main
\`\`\`
EOF

git add -A
git commit -q -m "Start ${DISPLAY:-$SLUG} from the $TEMPLATE template

Branched from $TEMPLATES_REMOTE_NAME/$BRANCH. CLIENT.md lists everything
still holding a placeholder; none of it may ship as-is."

# ---- Verify -------------------------------------------------------------
echo
node tools/check.js || die 'the new branch does not pass its own checks'

cat <<EOF

────────────────────────────────────────────────────────────
  '$SLUG' is ready, from the $TEMPLATE template.

  Next:
    1. Fill in CLIENT.md's placeholder table. Start with the phone
       number — every order button is dead until it is set.
    2. Preview:  python3 -m http.server 8000
    3. Push:     git push -u origin $SLUG

  To show it on the hub, add this to hub/catalogue.js in the
  TEMPLATES repo, under clients[] — note there is no 'dest', because
  client work is never published to the public site:

    {
      id: '$SLUG',
      from: '$TEMPLATE',
      accent: '#6d5c4c',
      status: 'building',
      name: { ar: '${DISPLAY:-$SLUG}', en: '${DISPLAY:-$SLUG}' },
      location: { ar: '', en: '' },
      repo: 'https://github.com/Mishooooo0/web-clients/tree/$SLUG',
      liveUrl: null
    }
────────────────────────────────────────────────────────────
EOF
