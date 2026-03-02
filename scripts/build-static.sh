#!/usr/bin/env bash
# Build static export for Cloudflare Pages (no API routes or admin).
# Temporarily moves app/api and app/admin so they are not included in the export.

set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/src/app"
BAK="$ROOT/.next-static-bak"

cd "$ROOT"

if [ -d "$APP/api" ] || [ -d "$APP/admin" ]; then
  mkdir -p "$BAK"
  [ -d "$APP/api" ]    && mv "$APP/api"    "$BAK/api"
  [ -d "$APP/admin" ]  && mv "$APP/admin"  "$BAK/admin"
  RESTORE=1
fi

STATIC_EXPORT=1 npm run build

if [ -n "$RESTORE" ]; then
  [ -d "$BAK/api" ]    && mv "$BAK/api"    "$APP/api"
  [ -d "$BAK/admin" ]  && mv "$BAK/admin"  "$APP/admin"
  rmdir "$BAK" 2>/dev/null || true
fi

echo "Static build complete. Deploy the 'out' folder to Cloudflare Pages."
