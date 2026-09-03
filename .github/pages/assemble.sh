#!/usr/bin/env bash
# Assemble every template and client site into one publishable folder.
#
#   /                  the gallery
#   /cafe/             café + restaurant template   (main)
#   /services/         services + booking template  (template-services)
#   /retail/           retail + boutique template   (template-retail)
#   /clients/rahwah/   Rahwah                       (rahwah)
#
# Adding a client is one line at the bottom of this file.
set -euo pipefail

OUT=_site
rm -rf "$OUT"
mkdir -p "$OUT"

publish() {
  local branch="$1" dest="$2" label="$3"

  # A branch named here may not exist yet — skip rather than fail the deploy.
  local ref=""
  for candidate in "origin/$branch" "$branch"; do
    if git rev-parse --verify --quiet "$candidate^{commit}" >/dev/null; then ref="$candidate"; break; fi
  done
  if [ -z "$ref" ]; then
    echo "skip   $label — branch '$branch' does not exist yet"
    return 0
  fi

  mkdir -p "$OUT/$dest"
  git archive "$ref" | tar -x -C "$OUT/$dest"

  # Ship the website, not the workshop.
  rm -rf "$OUT/$dest/.github" "$OUT/$dest/tools" "$OUT/$dest/node_modules"
  rm -f  "$OUT/$dest"/*.md "$OUT/$dest/package.json" "$OUT/$dest/package-lock.json" "$OUT/$dest/.gitignore"

  echo "publish $label — $ref -> /$dest"
}

publish main              cafe            "Café & restaurant template"
publish template-services services        "Services & booking template"
publish template-retail   retail          "Retail & boutique template"
publish rahwah            clients/rahwah  "Rahwah (client)"

cp .github/pages/index.html "$OUT/index.html"
touch "$OUT/.nojekyll"

echo
echo "assembled:"
find "$OUT" -maxdepth 3 -name index.html | sort | sed 's|^|  |'
