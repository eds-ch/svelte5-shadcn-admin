#!/usr/bin/env bash
set -euo pipefail

# CalVer release helper: YYYY.0M.MICRO
# Usage:
#   pnpm release          — auto-increment MICRO for current month
#   pnpm release 2026.03.0 — set exact version

CURRENT=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT"

if [ -n "${1:-}" ]; then
  NEXT="$1"
else
  YEAR=$(date +%Y)
  MONTH=$(date +%m)
  PREFIX="$YEAR.$MONTH"

  if [[ "$CURRENT" == "$PREFIX."* ]]; then
    MICRO="${CURRENT##*.}"
    NEXT="$PREFIX.$((MICRO + 1))"
  else
    NEXT="$PREFIX.0"
  fi
fi

echo "Next version:    $NEXT"
echo ""

# Check for uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Error: uncommitted changes. Commit or stash first."
  exit 1
fi

# Check CHANGELOG has an entry for this version
if ! grep -q "## $NEXT" CHANGELOG.md; then
  echo "Error: CHANGELOG.md has no entry for $NEXT"
  echo "Add a '## $NEXT' section before releasing."
  exit 1
fi

# Bump version in package.json
npm pkg set version="$NEXT"

# Commit and tag
git add package.json
git commit -m "release: $NEXT"
git tag "v$NEXT"

echo ""
echo "Done. Tagged v$NEXT"
echo "Push with: git push && git push --tags"
