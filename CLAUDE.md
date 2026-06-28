# Edge Partner Platform — Non-Negotiable Invariants

> This file is **law** for the Edge Partner Platform (the business layer for Edge,
> a studio of Shopify apps: marketing site + partner portal + admin portal).
> It is the money-correctness and authorization contract. If any change pushes
> against an invariant here, **stop and flag it** rather than working around it.
> General code-style standards (Ultracite/Biome) live in `.claude/CLAUDE.md`.

This is a **money system**. A wrong number is a real payout dispute. Build for
correctness and auditability over cleverness.

## Business model (drives correctness)

Partners do **not** use referral links. A partner registers a merchant they
manage. An admin approves the partner with a commission percentage and approves
the merchant. Shopify bills the merchant for the Edge apps they use, Edge
receives the subscription revenue, and Edge pays the partner a recurring share of
it every month, for as long as the merchant stays subscribed.

## Money correctness

- Store every monetary amount as an **integer in minor units** (bigint), never a
  float. A 3-char currency code accompanies every amount. No floating-point math
  ever touches money, including conversion and commission calculation.
- The commission base is the app's **net** earning (what Edge receives after
  Shopify's revenue share), not gross.

## The earnings ledger

- `earning_events` is **append-only**, a mirror of the Shopify Partner API
  `transactions` stream. Ingestion is **idempotent on the Shopify transaction id**
  (unique constraint, conflict-do-nothing). Re-pulling a charge is a no-op.

## Commissions

- Commissions are **immutable**. The rate is **frozen onto each row** at
  generation time and never read live, so renegotiating a partner's rate applies
  going forward and never rewrites unpaid history.
- **Exactly one commission per earning event** (unique FK, conflict-do-nothing).
  Generation can run any number of times and never double-pays.

## Eligibility (the program rules)

- A partner earns on an earning event only if (a) the merchant is `approved`,
  and (b) the earning's app is **not** in that merchant's grandfathered set.
- **Grandfathered apps** = apps the store was already paying for at approval.
  Captured once, in the approval flow. They never earn, ever, even on future
  charges for that app.
- Commission is **lifetime** while the merchant stays subscribed. There is no
  expiry logic; no earning event simply means no commission.
- **Per-app rates:** a partner has a default rate (basis points); an optional
  `partner_app_rates` row overrides it per app.

## Multi-tenant authorization

- Tenant isolation is enforced at the **data layer**, not the UI. A `partner`
  procedure derives `partnerId` from the **session**, never from client input,
  and asserts it on every query. A partner can **never** read or write another
  partner's merchants, earnings, or commissions.
- An `admin` procedure asserts the admin role on every admin operation.

## Attribution

- Merchants are keyed by their **canonical `<store>.myshopify.com` domain**,
  which is globally unique. Normalize before insert. The unique constraint is the
  dedup rule: two partners cannot both claim one store.

## Shopify boundary

- All Shopify-shaped code lives in **one file** (`@edgecoms/billing` partner-api
  adapter). Everything else sees a normalized earning type. Billing runs on the
  **stable `transactions` Partner API** (GA), not the 2026-07 RC subscription
  APIs. When those reach GA, only the adapter changes.

## Railway cron

- The billing-sync job **must terminate and close its DB pool** when done.
  Railway skips the next scheduled run if the process is still alive.

## Auth/user link

- **Better Auth owns the user table.** `role` (`admin` | `partner`) is an
  additional field on Better Auth's user. `partners.userId` points at Better
  Auth's `user.id`. There is no parallel hand-rolled users table.

## Tech & process

- Monorepo: Turborepo + Bun workspaces. Packages under the `@edgecoms/*` scope.
- Next.js (App Router), React 19, TypeScript **strict** everywhere — no `any`.
  Share types across packages.
- tRPC end-to-end typed; Drizzle over PostgreSQL (Railway); Better Auth.
- No hardcoded secrets — everything sensitive comes from env.
- After each phase: typecheck + lint + the phase's tests, then commit
  (conventional commits, small and scoped).
- Write tests for **every money path** and **every authorization boundary**.
  These are where a silent bug is expensive — do not skip them.
- If a task is ambiguous or conflicts with this file, **ask before improvising**.
  A wrong guess in a money system is worse than a question.
