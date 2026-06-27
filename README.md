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

2. **Configure environment** — populate `apps/web/.env` with your database connection and auth secrets.

3. **Start PostgreSQL** — spin up the local database container (defined in `packages/db/docker-compose.yml`):

   ```bash
   bun run db:start
   ```

4. **Apply the schema** to the database:

   ```bash
   bun run db:push
   ```

5. **Run the dev server:**

   ```bash
   bun run dev
   ```

   Open [http://localhost:3001](http://localhost:3001) to view the app.

## Project Structure

```
edgecoms/
├── apps/
│   └── web/          # Next.js full-stack application
└── packages/
    ├── ui/           # Shared shadcn/ui components & design tokens
    ├── api/          # tRPC routers / business logic
    ├── auth/         # Better Auth configuration
    ├── db/           # Drizzle schema, queries & local DB compose
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
