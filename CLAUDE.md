# Edge Partner Platform — Non-Negotiable Invariants

> This file is **law** for the Edge Partner Platform (the business layer for Edge,
> a studio of Shopify apps: marketing site + partner portal + admin portal).
> It is the money-correctness and authorization contract. If any change pushes
> against an invariant here, **stop and flag it** rather than working around it.
> General code-style standards (Ultracite/Biome) live in `.claude/CLAUDE.md`.

This is a **money system**. A wrong number is a real payout dispute. Build for
correctness and auditability over cleverness.

## Business model (drives correctness)

Partners do **not** use referral links. A partner is given an **attribution
code**, which they hand to a merchant they manage; the merchant enters it inside
an Edge app and the store arrives in the dashboard already bound to that partner.
A partner may also register a store by hand — the same row either way, just a
different `merchants.source`. An admin approves the partner with a commission
percentage and approves the merchant. Shopify bills the merchant for the Edge
apps they use, Edge receives the subscription revenue, and Edge pays the partner
a recurring share of it every month, for as long as the merchant stays
subscribed.

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

## Bonuses

- A **bonus** is money for a partner with no earning event behind it. It lives in
  `partner_bonuses` and **never** as a commission row:
  `commissions.earning_event_id` is NOT NULL and there is exactly one commission
  per event, so a bonus would break both, and the append-only ledger that
  mirrors the Partner API must keep mirroring only that.
- **Issued by a person, always.** Nothing mints a bonus. Nothing is owed to a
  partner who has not been given one, which is what keeps a bonus discretionary
  rather than a published promise owed to everybody who reaches the same number.
  A partner sees only bonuses actually AWARDED — the portal never forecasts one,
  because a forecast is the promise.
- Only an `approved` partner may be issued one. An unapproved partner has no
  agreed rate and no payout details; paying one is a decision to take after
  approving them.
- Integers in minor units with a currency, like every other amount here. The
  admin form takes a decimal string and converts it with the same integer
  conversion the rest of the money system uses.
- A bonus **rides the monthly payout.** `payouts.pay` sums bonuses alongside
  commissions for the same (partner, period, currency), so the partner gets one
  payment and the payout total is the whole of what they were paid. A bonus in
  another currency waits for that currency's payout; nothing is converted.
  `payouts.groupable` lists bonus-only groups too, or a bonus with no commission
  beside it could never be paid.
- **Immutable once issued.** There is no update path. A bonus given in error is
  `revoked` while still `pending`; a paid bonus is history. A revoked bonus is
  never shown to the partner — learning of one by watching it disappear is worse
  than never knowing.

## Eligibility (the program rules)

- A partner earns on an earning event only if (a) the merchant is `approved`,
  and (b) the earning's app is **not** in that merchant's grandfathered set.
- **Grandfathered apps** = apps the store was already paying for when the partner
  acquired it. They never earn, ever, even on future charges for that app.
  Proposed at **bind** from what the Edge app reports it was already charging the
  shop for (the app knows; an admin reconstructing it later is guessing), and
  **frozen at approval** from the admin's explicit selection, which may amend the
  proposal. Amending before approval is safe because a `pending` merchant earns
  nothing; widening the set afterwards is forbidden, because it would
  retroactively delete commission the partner was already told they had earned.
  This is why approval is never decided at bind time: freezing after the FIRST
  app reported would stop the second app a store installs from ever adding
  itself, and a shop already paying for that app would earn the partner
  commission on revenue that predates them.
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

## Attribution codes

See `docs/partner-attribution-codes.md` for the full design.

- **One partner per shop, permanent.** A code redemption on a claimed domain is
  refused, never reassigned. A replay by the same partner is a no-op that returns
  the existing binding.
- A code redemption creates the merchant `pending`. **A code never bypasses the
  approval gate.**
- **Approval may be automatic, but only where there is nothing to decide.** The
  settling sweep (`autoApproveSettledMerchants` in `@edgecoms/billing`, run from
  the billing cron before commission generation) approves a merchant only when
  ALL of: it is `pending`, `source` is `code`, it has been pending longer than
  the settling window (24h by default), its grandfathered set is **empty**, and
  its partner is still `approved`. Every condition is re-asserted inside the
  updating transaction, and the row is stamped `auto_approved` so a sweep
  approval is distinguishable from a person's in a dispute.
  The gate itself is unchanged: a store that was already paying for an Edge app
  has a non-empty set, fails the test, and waits for a human — which is the only
  case where a human was deciding anything. What the sweep removes is the wait
  for stores where the answer was never in question.
- **Never parse a rate out of a code string.** The rate is read from the partner
  row (or `partner_app_rates`). Merchant-facing codes must be rate-free;
  `partner_codes.label` is the internal note and is never returned to a partner.
- **Disabling a code stops new redemptions only.** It never unbinds stores
  already referred — a partner loses the ability to acquire, not their book.
  Enforced by `restrict` FKs, so a code with redemptions cannot be deleted.
- Every rejection (unknown, disabled, expired, exhausted, partner not approved)
  returns **one generic reason**, so codes cannot be enumerated. The real reason
  goes to `code_redemption_attempts.reason`, never over the wire.
- `merchant_events` is **append-only** and idempotent on the app's
  `idempotency_key`. An `uninstalled` event does **not** unbind; commission stops
  simply because no earning events arrive.
- The app→platform endpoints (`/api/v1/codes/validate`, `/attributions`,
  `/shop-events`) are HMAC-signed over `<timestamp>.<raw body>`. They **fail
  closed**: no `EDGE_PARTNERS_SECRET` means 503, never an unsigned write.
- Codes carry **no discount terms** yet. Credit issuance is a later phase; until
  it exists a code must not promise a price cut nothing can honour. When they
  arrive they are integers (basis points / minor units), never a float.

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
