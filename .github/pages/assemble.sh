#!/usr/bin/env bash
# ============================================================
# Assemble the published site.
#
#   /                the hub          (hub/ on this branch)
#   /<dest>/         one per template (its branch, per hub/catalogue.js)
#   /shots/          screenshots, added afterwards by shoot.js
#
# The list of what to publish comes from hub/catalogue.js, which the hub
# page and tools/start-project.sh also read — so they cannot disagree.
#
# ── TEMPLATES ONLY. ─────────────────────────────────────────
# Client work is never copied here. That is the whole of what keeps it
# private: there is no client HTML on the public origin to find. Client
# entries in the catalogue carry no `dest` and are skipped, and
# tools/check-hub.js fails the build if one ever gains one.
# ============================================================
set -euo pipefail

OUT=_site
rm -rf "$OUT"
mkdir -p "$OUT"

# Read the publishable entries: templates only, one "branch<TAB>dest<TAB>label" per line.
ENTRIES=$(node -e '
  global.window = {};
  require("./hub/catalogue.js");
  for (const t of window.CATALOGUE.templates) {
    process.stdout.write([t.branch, t.dest, t.name.en].join("\t") + "\n");
  }
')

publish() {
  local branch="$1" dest="$2" label="$3"

  # A branch named in the catalogue may not exist yet — skip rather than
  # fail the whole deploy.
  local ref=""
  for candidate in "origin/$branch" "$branch"; do
    if git rev-parse --verify --quiet "$candidate^{commit}" >/dev/null; then ref="$candidate"; break; fi
  done
  if [ -z "$ref" ]; then
    echo "skip    $label — branch '$branch' does not exist yet"
    return 0
  fi

  mkdir -p "$OUT/$dest"
  git archive "$ref" | tar -x -C "$OUT/$dest"

  # Ship the website, not the workshop.
  rm -rf "$OUT/$dest/.github" "$OUT/$dest/tools" "$OUT/$dest/hub" "$OUT/$dest/node_modules"
  rm -f  "$OUT/$dest"/*.md "$OUT/$dest/package.json" "$OUT/$dest/package-lock.json" "$OUT/$dest/.gitignore"

  echo "publish $label — $ref -> /$dest"
}

while IFS=$'\t' read -r branch dest label; do
  [ -n "$branch" ] && publish "$branch" "$dest" "$label"
done <<< "$ENTRIES"

# The website becomes the site root. It owns every file it references, so
# this is a straight copy — nothing is pulled in from a template branch.
#
# hub/catalogue.js goes with it: index.html renders the template cards from
# it at runtime, so it has to be fetchable at the same path the page asks
# for. Keeping it under hub/ means assemble.sh, check-hub.js, shoot.js and
# the private clients server all still read it from one place.
cp index.html site.css site.js \
   templates.html templates.css templates.js \
   analytics.html analytics.css analytics.js favicon.svg "$OUT/"
mkdir -p "$OUT/hub"
cp hub/catalogue.js "$OUT/hub/"
touch "$OUT/.nojekyll"

echo
echo "assembled:"
find "$OUT" -maxdepth 3 -name index.html | sort | sed 's|^|  |'
