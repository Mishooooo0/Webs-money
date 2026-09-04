#!/usr/bin/env bash
# ============================================================
# bootstrap-clients-repo.sh — move client work into the private repo.
#
#   tools/bootstrap-clients-repo.sh                  # move and verify
#   tools/bootstrap-clients-repo.sh --delete-source  # …then remove the
#                                                    #   public branch
#
# Run this once, from a checkout of THIS repo, after creating
# https://github.com/Mishooooo0/web-money-clients as a PRIVATE repository
# with no README, no .gitignore and no licence (it must start empty).
#
# It seeds the clients repo's main with its README and tooling, pushes every
# client branch across with full history, and verifies each one arrived
# byte-identical before anything is deleted anywhere.
#
# Deleting the public copy is opt-in, and only ever runs after the
# verification passes.
# ============================================================
set -euo pipefail

CLIENTS_URL="https://github.com/Mishooooo0/web-money-clients.git"
TEMPLATES_URL="https://github.com/Mishooooo0/Webs-money.git"
CLIENT_BRANCHES=(rahwah)
DELETE_SOURCE=false
[ "${1:-}" = "--delete-source" ] && DELETE_SOURCE=true

die() { printf '\nbootstrap: %s\n' "$1" >&2; exit 1; }
say() { printf '\n\033[1m%s\033[0m\n' "$1"; }

cd "$(git rev-parse --show-toplevel)"
[ -z "$(git status --porcelain)" ] || die 'working tree is not clean — commit or stash first'

say "1. Checking the private repo exists and is reachable"
git ls-remote "$CLIENTS_URL" >/dev/null 2>&1 || die \
"cannot reach $CLIENTS_URL

Create it first, then re-run:
  · https://github.com/new
  · Name:       web-money-clients
  · Visibility: Private
  · Do NOT add a README, .gitignore or licence — it must start empty."

if ! git remote get-url clients >/dev/null 2>&1; then
  git remote add clients "$CLIENTS_URL"
fi
git fetch --quiet clients || true

say "2. Seeding the clients repo's main"
if git rev-parse --verify --quiet clients/main >/dev/null; then
  echo "   already seeded — leaving it alone"
else
  WORK=$(mktemp -d)
  mkdir -p "$WORK/tools" "$WORK/.github/workflows"
  cp tools/start-project.sh "$WORK/tools/"
  cp .github/workflows/ci.yml "$WORK/.github/workflows/"
  printf 'node_modules/\n_site/\n.DS_Store\n*.log\n' > "$WORK/.gitignore"

  cat > "$WORK/README.md" <<'MD'
# web-money-clients

Client website projects. **Private on purpose** — this is the only thing
keeping client work off the public web.

Each client is a branch, started from a template in the public
[Webs-money](https://github.com/Mishooooo0/Webs-money) repo.

## Start a client

```bash
tools/start-project.sh cafe al-nakheel "عطور النخيل"
```

Templates: `cafe` · `services` · `retail`. The script branches from that
template, stamps the name in, writes a `CLIENT.md` listing every placeholder
that must be replaced, and runs the checks.

## Pick up engine fixes

The templates repo is wired in as a remote. Fixes to the shared engine flow
downstream:

```bash
git fetch templates
git merge templates/main
```

## Before handing a site over

```bash
node tools/check.js     # six static checks
node tools/audit.js     # WCAG AA both languages, console errors, overflow
```

Read `CLIENT.md` on the branch — nothing in its placeholder table may ship.
The phone number matters most: every order button is dead until it is set.

## Publishing

GitHub Pages on a private repo needs a paid plan, so nothing is published from
here. Preview locally with `python3 -m http.server 8000`, and deploy to the
client's own hosting when they go live. Then set `liveUrl` on their entry in
`hub/catalogue.js` in the templates repo, and the hub card links there.
MD

  git -C "$WORK" init -q -b main
  git -C "$WORK" add -A
  git -C "$WORK" -c user.email="$(git config user.email)" -c user.name="$(git config user.name)" \
      commit -q -m "Seed the private clients repo

Client website projects, branched from the templates in Webs-money. Private
because that is the only thing actually keeping client work off the public web
— the passphrase on the public hub is a doormat, not a lock."
  git -C "$WORK" remote add origin "$CLIENTS_URL"
  git -C "$WORK" push -q -u origin main
  rm -rf "$WORK"
  echo "   seeded"
fi

say "3. Moving client branches across, with history"
for BR in "${CLIENT_BRANCHES[@]}"; do
  git rev-parse --verify --quiet "origin/$BR" >/dev/null \
    || { echo "   $BR: not on the public repo — already moved?"; continue; }
  git push clients "refs/remotes/origin/$BR:refs/heads/$BR"
  echo "   $BR: pushed"
done

say "4. Verifying each branch arrived intact"
git fetch --quiet clients
ALL_GOOD=true
for BR in "${CLIENT_BRANCHES[@]}"; do
  git rev-parse --verify --quiet "origin/$BR" >/dev/null || continue
  SRC_TREE=$(git rev-parse "origin/$BR^{tree}")
  DST_TREE=$(git rev-parse "clients/$BR^{tree}" 2>/dev/null || echo missing)
  SRC_N=$(git rev-list --count "origin/$BR")
  DST_N=$(git rev-list --count "clients/$BR" 2>/dev/null || echo 0)
  if [ "$SRC_TREE" = "$DST_TREE" ] && [ "$SRC_N" = "$DST_N" ]; then
    echo "   $BR: identical — tree ${SRC_TREE:0:8}, $SRC_N commits"
  else
    echo "   $BR: MISMATCH — src ${SRC_TREE:0:8}/$SRC_N vs dst ${DST_TREE:0:8}/$DST_N"
    ALL_GOOD=false
  fi
done
$ALL_GOOD || die 'verification failed — nothing was deleted. Investigate before retrying.'

say "5. Wiring the templates remote into the clients repo"
echo "   Run this once inside your clone of web-money-clients:"
echo "     git remote add templates $TEMPLATES_URL"

if $DELETE_SOURCE; then
  say "6. Removing the public copies"
  for BR in "${CLIENT_BRANCHES[@]}"; do
    git rev-parse --verify --quiet "origin/$BR" >/dev/null || continue
    git push origin --delete "$BR"
    echo "   $BR: deleted from the public repo"
  done
  echo
  echo "   Note: these branches were public until now. Deleting stops further"
  echo "   exposure but does not unpublish what is already out there. For a"
  echo "   paying client, start in the private repo from the beginning."
else
  say "6. Public copies left in place"
  echo "   Verified above. To remove them, re-run with --delete-source."
fi

say "Done."
