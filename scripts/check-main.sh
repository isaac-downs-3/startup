#!/usr/bin/env bash
# Guard the public class repo. Run from the `main` worktree before every push.
#
#   ./scripts/check-main.sh
#
# Scans only TRACKED files: those are what a push publishes. Untracked and
# gitignored files are irrelevant here and are deliberately skipped.
# Written for bash 3.2 (the macOS system bash) — no mapfile, no associative arrays.

set -o pipefail
cd "$(git rev-parse --show-toplevel)" || exit 1

SELF="scripts/check-main.sh"
fail=0

red() { printf '\033[31m%s\033[0m\n' "$1"; }
grn() { printf '\033[32m%s\033[0m\n' "$1"; }
ylw() { printf '\033[33m%s\033[0m\n' "$1"; }
flag() { red "  FAIL: $1"; fail=$((fail+1)); }

TMP=$(mktemp -d) || exit 1
trap 'rm -rf "$TMP"' EXIT

branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "main" ]; then
  ylw "This guard is meant for the public 'main' branch; you are on '$branch'."
  ylw "Continuing anyway — but a push from here may publish live-only code."
  echo
fi

git ls-files > "$TMP/all"
grep -v -x "$SELF" "$TMP/all" > "$TMP/scan"   # don't match our own patterns
echo "Checking $(wc -l < "$TMP/all" | tr -d ' ') tracked files on '$branch'..."

scan_content() {   # scan_content <description> <grep-args...>
  desc="$1"; shift
  [ -s "$TMP/scan" ] || return 0
  hits=$(tr '\n' '\0' < "$TMP/scan" | xargs -0 grep -nEI "$@" 2>/dev/null)
  if [ -n "$hits" ]; then
    flag "$desc"
    printf '%s\n' "$hits" | sed 's/^/        /'
  fi
}

# 1. Live-only and secret-bearing paths must never be tracked.
echo
echo "[1/4] Forbidden paths"
before=$fail
for pattern in \
  'server/market/live' \
  '\.env$' '\.env\.' \
  '\.pem$' '\.key$' '\.p12$' '\.pfx$' \
  'credentials' 'secrets'
do
  hits=$(grep -E "$pattern" "$TMP/all")
  if [ -n "$hits" ]; then
    flag "tracked path matches /$pattern/:"
    printf '%s\n' "$hits" | sed 's/^/        /'
  fi
done
[ $fail -eq $before ] && grn "  ok — no live-only or secret-bearing paths tracked"

# 2. Credential-shaped literals in tracked content.
echo
echo "[2/4] Credential-shaped literals"
before=$fail
scan_content "possible credential in tracked content:" \
  -e '(FINNHUB|FRED|BROKER|ALPACA|IBKR)[A-Z_]*[[:space:]]*[:=][[:space:]]*["'"'"']?[A-Za-z0-9_-]{16,}' \
  -e 'AKIA[0-9A-Z]{16}' \
  -e 'BEGIN [A-Z ]*PRIVATE KEY'
[ $fail -eq $before ] && grn "  ok — no credential-shaped literals"

# 3. The live data source must not be selected in tracked config.
echo
echo "[3/4] MARKET_SOURCE"
before=$fail
scan_content "tracked file selects the live data source:" \
  -e 'MARKET_SOURCE[[:space:]]*[:=][[:space:]]*["'"'"']?live'
[ $fail -eq $before ] && grn "  ok — live source not selected in tracked config"

# 4. These checks read committed content, so flag anything not yet committed.
echo
echo "[4/4] Working tree"
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  ylw "  uncommitted changes to tracked files — commit and re-run to cover them:"
  git status --short --untracked-files=no | sed 's/^/        /'
else
  grn "  ok — working tree clean"
fi

echo
if [ $fail -ne 0 ]; then
  red "BLOCKED: do not push. Resolve the failures above."
  exit 1
fi
grn "PASS: safe to push '$branch'."
