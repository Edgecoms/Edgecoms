#!/usr/bin/env bash
# Applies pending migrations (and re-syncs the app catalog) during a Vercel
# PRODUCTION build, immediately before `next build`.
#
# `drizzle-kit migrate` only applies migrations not already recorded in
# drizzle.__drizzle_migrations, so a deploy with nothing pending is a no-op.
#
# This deliberately FAILS the build if a migration fails: shipping code against
# a database whose schema did not apply is how a money system starts writing
# wrong numbers. A failed build leaves the previous deployment serving.
#
# Guarded on VERCEL_ENV so preview deploys never touch the production database,
# even though they hold the same DATABASE_URL.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

skip() { printf '[deploy-migrate] SKIPPED: %s\n' "$1"; exit 0; }

[ "${VERCEL_ENV:-}" = "production" ] || skip "VERCEL_ENV is '${VERCEL_ENV:-unset}', not 'production'"
[ -n "${DATABASE_URL:-}" ] || skip "DATABASE_URL is not set"

# DDL over Neon's pooler can stall, but the app runtime wants the pooled host.
# If DIRECT_DATABASE_URL is set, migrations use it; everything else keeps
# DATABASE_URL. Same split as Prisma's `directUrl`.
MIGRATE_URL="${DIRECT_DATABASE_URL:-$DATABASE_URL}"
case "$MIGRATE_URL" in
  *-pooler.*) printf '[deploy-migrate] NOTE: migrating over a pooled host. Set DIRECT_DATABASE_URL to the non-pooled Neon host if this stalls.\n' ;;
esac

printf '[deploy-migrate] Applying pending migrations...\n'
(cd "$REPO_ROOT/packages/db" && DATABASE_URL="$MIGRATE_URL" bunx drizzle-kit migrate)

# The app catalog is defined in code (packages/db/src/seed-data.ts) and upserts
# on slug, so re-running keeps the deployed catalog in step with the commit.
printf '[deploy-migrate] Syncing Edge app catalog...\n'
(cd "$REPO_ROOT/packages/db" && bun src/seed.ts)

if [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
  printf '[deploy-migrate] Ensuring admin user...\n'
  (cd "$REPO_ROOT/packages/auth" && bun src/create-admin.ts)
else
  printf '[deploy-migrate] ADMIN_EMAIL/ADMIN_PASSWORD unset -- skipping admin.\n'
fi

printf '[deploy-migrate] Done.\n'
