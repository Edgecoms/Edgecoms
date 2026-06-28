# Edgecoms

A full-stack TypeScript monorepo for Edgecoms — thoughtfully crafted Shopify apps and the marketing site that fronts them. Built with Next.js, tRPC, Drizzle, and a shared UI package, orchestrated by Turborepo and Bun workspaces.

## Tech Stack

- **[Next.js](https://nextjs.org) 16** — full-stack React 19 framework (App Router)
- **[tRPC](https://trpc.io) 11** — end-to-end type-safe APIs
- **[Drizzle ORM](https://orm.drizzle.team)** — TypeScript-first ORM over **PostgreSQL**
- **[Better Auth](https://better-auth.com)** — authentication
- **[Tailwind CSS](https://tailwindcss.com) v4** — utility-first styling
- **Shared UI package** — shadcn/ui primitives in `packages/ui`
- **[Ultracite](https://github.com/haydenbleasel/ultracite)** — zero-config linting & formatting (Biome under the hood)
- **[Turborepo](https://turbo.build)** — monorepo task runner & caching
- **[Bun](https://bun.sh)** — package manager and runtime

## Prerequisites

- [Bun](https://bun.sh) `1.3+`
- [Docker](https://www.docker.com) — for the local PostgreSQL database (optional if you bring your own)

## Getting Started

1. **Install dependencies** (from the repo root):

   ```bash
   bun install
   ```

2. **Configure environment** — copy `apps/web/.env.example` to `apps/web/.env` and fill in your database connection, auth secrets, and admin bootstrap credentials.

3. **Start PostgreSQL** — spin up the local database container (defined in `packages/db/docker-compose.yml`):

   ```bash
   bun run db:start
   ```

4. **Apply the schema** to the database:

   ```bash
   bun run db:push
   ```

5. **Seed the app catalog and create an admin** (idempotent):

   ```bash
   bun run db:seed
   bun run db:create-admin
   ```

6. **Run the dev server:**

   ```bash
   bun run dev
   ```

   Open [http://localhost:3001](http://localhost:3001) to view the app.

## Project Structure

```
edgecoms/
├── apps/
│   ├── web/          # Next.js app (marketing + partner + admin portals)
│   └── worker/       # Railway cron entrypoint (billing-sync)
└── packages/
    ├── ui/           # Shared shadcn/ui components & design tokens
    ├── api/          # tRPC routers + the authorization layer
    ├── auth/         # Better Auth configuration
    ├── billing/      # Money math, Partner API adapter, reconcile & commissions
    ├── db/           # Drizzle schema, migrations & local DB compose
    ├── env/          # Shared, validated environment variables
    └── config/       # Shared tooling config (TS, Ultracite, etc.)
```

## Scripts

Run all scripts from the repo root.

### Development

| Script | Description |
| --- | --- |
| `bun run dev` | Start all apps in development mode |
| `bun run dev:web` | Start only the web app |
| `bun run build` | Build all apps |
| `bun run check-types` | Type-check across the monorepo |

### Database

| Script | Description |
| --- | --- |
| `bun run db:start` | Start local PostgreSQL (Docker, detached) |
| `bun run db:watch` | Start local PostgreSQL in the foreground |
| `bun run db:stop` | Stop the database container |
| `bun run db:down` | Stop and remove the database container |
| `bun run db:push` | Push schema changes to the database |
| `bun run db:generate` | Generate migration files |
| `bun run db:migrate` | Run pending migrations |
| `bun run db:seed` | Seed the 6 Edge apps (idempotent) |
| `bun run db:create-admin` | Create/promote the admin user (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) |
| `bun run db:studio` | Open Drizzle Studio |

### Code Quality

| Script | Description |
| --- | --- |
| `bun run check` | Lint & format check (Ultracite) |
| `bun run fix` | Auto-fix lint & formatting issues |

## UI & Shared Components

The web app consumes shadcn/ui primitives through `packages/ui`:

- Design tokens and global styles live in `packages/ui/src/styles/globals.css`
- Shared primitives live in `packages/ui/src/components/*`
- shadcn aliases/config live in `packages/ui/components.json` and `apps/web/components.json`

Import shared components like this:

```tsx
import { Button } from "@edgecoms/ui/components/button";
```

### Adding components

Add more primitives to the shared package (run from the repo root):

```bash
bunx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

For app-specific blocks rather than shared primitives, run the shadcn CLI from `apps/web` instead.

## The Partner Platform

This repo is the **Edge Partner Platform** — the business layer for Edge's
Shopify apps. It has three experiences in one Next.js app plus a billing worker:

- **Marketing** (`/`, `/products`, `/partners`, `/about`, `/contact`) — public, on-brand.
- **Partner Portal** (`/partner/*`, role `partner`) — register merchants, track
  commission, manage payout details.
- **Admin Portal** (`/admin/*`, role `admin`) — approve partners (set rate +
  per-app overrides), approve merchants (capturing the grandfathered app set),
  mark commissions paid, and group payouts.

### How the money works

- Every amount is an **integer in minor units** (`bigint`) with a 3-char
  currency — no floating-point math ever touches money.
- `earning_events` is an **append-only** mirror of the Shopify Partner API
  `transactions` stream, idempotent on the Shopify transaction id.
- A commission is generated **once per earning event**, with the partner's
  resolved rate (per-app override or default) **frozen onto the row**. Commission
  is **lifetime** while the merchant stays subscribed.
- A partner earns on an event only if the merchant is **approved** and the app is
  **not grandfathered** for that merchant.

The full invariant set lives in [`CLAUDE.md`](./CLAUDE.md). The money paths and
authorization boundaries are unit/integration tested (`bun run test`) against an
in-process Postgres (PGlite) — no Docker required for tests.

### The billing worker

`apps/worker` is a standalone entrypoint (`bun src/billing-sync.ts`) that runs a
full sync — ingest the Partner API `transactions` stream, then generate any
missing commissions — and then **closes its DB pool and exits**. It logs a
structured JSON run summary. Admins can also trigger the same `runBillingSync`
from the dashboard ("Run sync now").

It needs these (optional everywhere else) env vars:

```
PARTNER_API_ORGANIZATION_ID="..."
PARTNER_API_ACCESS_TOKEN="..."
PARTNER_API_VERSION="2025-01"   # optional
```

## Deployment (Railway)

Deploy **two services from this one repo** against a shared Railway Postgres:

1. **Postgres** — add a Railway Postgres service. Enable **backups** and use its
   **private networking** URL for `DATABASE_URL` on both services below.

2. **Web service** (the Next app)
   - Build: `bun install && bun run build`
   - Start: `bun run --filter web start` (or `cd apps/web && bun run start`)
   - Env: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGIN`,
     and the `PARTNER_API_*` vars (so the admin "Run sync now" works).

3. **Worker service** (the cron job)
   - Start command: `cd apps/worker && bun src/billing-sync.ts`
   - Schedule (Railway cron): `0 */6 * * *` (every 6 hours).
   - Env: `DATABASE_URL` + the `PARTNER_API_*` vars.
   - The job must terminate when done (it does — it closes the pool and exits).
     Railway skips the next scheduled run if the process is still alive.

### First-deploy steps

From a machine with `DATABASE_URL` pointing at the Railway Postgres:

```bash
bun install
bun run db:migrate     # apply migrations (or db:push for the first cut)
bun run db:seed        # seed the 6 Edge apps
bun run db:create-admin # ADMIN_EMAIL / ADMIN_PASSWORD must be set
```

Replace the placeholder Partner API GIDs in the seed with your real app GIDs via
`PARTNER_API_GID_<SLUG>` env vars (see `apps/web/.env.example`), then re-run
`bun run db:seed`.
