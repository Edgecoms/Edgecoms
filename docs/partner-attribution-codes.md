# Partner attribution codes — platform side

**Status:** plan agreed 2026-08-17. Phase 1 = this document. Scope confirmed:
**Edgecoms platform only.** No Edge app is touched; nothing can redeem a code
until an app-side pass lands.

Companion document: the `edge-bundles` app-side plan
("Edge Partners — attribution codes & agency commissions"). This is the other
half of that contract — the endpoints it calls and the tables behind them.

---

## What changes

Partners stop registering merchants by hand. A partner gets a **code**. The
merchant pastes it into the Edge app they're installing, and the store shows up
in the Edge dashboard already bound to that partner.

The code is an **attribution code, not a discount code**. Shopify never sees it;
it is a row in our database. Entering one records a fact. Every price effect
after that is an API call we choose to make later (Phase 2).

## Decisions taken

| Decision | Choice |
| --- | --- |
| Merchant status on bind | `pending`. Admin approves in one click. |
| Grandfathered apps | Pre-filled at bind from what the app reports; admin amends; frozen at approval. |
| Perk terms | Carried on the code, served by `/codes/validate`. Apps consume them later. |
| Discount / credit terms | **Not modelled in Phase 1.** See below. |
| Commission duration | Lifetime, per CLAUDE.md. No expiry logic. |

### Why no discount columns yet

The bundles plan puts `offerType` / `offerValue` / `offerCycles` on the code.
Phase 1 has no credit-issuance path, so a code that promises 20% off would
promise a merchant something nothing can honour — worse than a code that
promises nothing. `/codes/validate` returns `offer: null` and says so in a
comment. Phase 2 adds the columns as **integers** (basis points for a
percentage, minor units + currency for a fixed amount) — never `Decimal`,
never a float, per CLAUDE.md "Money correctness".

### Three notes against CLAUDE.md

1. **"Partners do not use referral links. A partner registers a merchant they
   manage."** Codes become the primary registration path; manual registration
   stays as a fallback. This is the requested change, so CLAUDE.md's
   "Business model" section gets amended rather than worked around.

2. **"Grandfathered apps … Captured once, in the approval flow."** With a code,
   the *app* knows what the shop was already paying for and reports it at bind —
   strictly better data than an admin reconstructing it later. Capture becomes:
   proposed at bind, amendable by the admin, **frozen at approval**. The
   invariant that matters — grandfathered apps never earn, ever — is untouched,
   and nothing can earn before approval anyway.

3. **The bundles plan recommends a 24-month commission duration.** CLAUDE.md
   says lifetime with no expiry logic. Lifetime wins here; no expiry is built.
   Whether to cap it is a commercial decision, not a code one — flagging it,
   not deciding it.

### Not ported: the flat `eligibility` field

The bundles plan carries `eligibility: eligible | ineligible` per shop.
`merchant_grandfathered_apps` already does that job **per app**, which is
better: a store already paying for Edge Subscription but not Edge Bundles
should still earn on Bundles. A per-shop flag would forfeit that.

---

## Schema

### `partner_codes` — in `schema/partners.ts`, beside `partner_app_rates`

| Column | Notes |
| --- | --- |
| `id` | uuid pk |
| `partner_id` | → `partners.id`, **restrict** (a code is audit history) |
| `code` | unique, normalised upper-case. Merchant-facing, **rate-free** |
| `label` | internal only (`Alex30`). Never shown to a merchant |
| `status` | `active` \| `disabled` |
| `max_redemptions` | nullable = unlimited |
| `expires_at` | nullable = never |
| `perk_usage_allowance_usd` | the instant perk an app applies on bind |

Redemption count is `count(merchants where partner_code_id = …)` — no separate
redemptions table, so there is exactly one source of truth for "who redeemed
this".

**Never parse the rate out of the code string.** The rate is read from the
`partners` row. `label` exists so the team can still call it `Alex30`
internally.

### `merchants` additions

| Column | Notes |
| --- | --- |
| `partner_code_id` | → `partner_codes.id`, **restrict** — revoking a code must never orphan a binding |
| `source_code` | denormalised, so a row reads without a join |
| `source` | `manual` \| `code`, default `manual` |
| `shopify_gid` | captured now; Phase 2 credits need it |

### `merchant_events` — append-only

Idempotency + audit for `/shop-events`. `idempotency_key` unique,
conflict-do-nothing — the same discipline as `earning_events`. An `uninstalled`
event **does not unbind**: revoking a code, or a merchant leaving, never
transfers a partner's book.

### `code_redemption_attempts` — rate limit + abuse log

There is no Redis in this repo, and a table is the better artefact anyway: it is
the audit trail for code-enumeration attempts. Indexed on
`(shop_domain, created_at)`.

---

## Domain logic — `packages/api/src/attribution/`

Pure functions over `db`, no Next import, so they test under PGlite.

- **`hmac.ts`** — verify `X-Edge-Signature` / `X-Edge-Timestamp`: HMAC-SHA256
  over `` `${timestamp}.${rawBody}` ``, timing-safe compare, reject clock skew
  over 5 minutes. Same shape as Shopify's webhook signing.
- **`codes.ts`** — `normalizeCode`, `validateCode`. Wrong / disabled / expired /
  exhausted all return **one generic reason**, so codes can't be enumerated.
- **`bind.ts`** — one transaction: normalise the domain, validate the code,
  insert the merchant `pending`, resolve reported paid-app slugs into
  `merchant_grandfathered_apps`, log the attempt.
  - Replay with the same domain and the same partner → returns the existing
    binding, `ok: true`.
  - A different partner's code on a claimed domain → **conflict**. One partner
    per shop, permanent; the unique on `shop_domain` is the rule.
- **`events.ts`** — append-only `recordShopEvent`, conflict-do-nothing.

## HTTP surface — `apps/web/src/app/api/v1/*/route.ts`

Three thin handlers. Each reads the **raw body text** before parsing (HMAC is
over the raw bytes), verifies the signature, zod-parses, and calls the domain
function.

```
POST /api/v1/codes/validate   read-only, hard rate-limited
POST /api/v1/attributions     creates the binding
POST /api/v1/shop-events      lifecycle: subscription.activated | plan.changed | uninstalled
```

With `EDGE_PARTNERS_SECRET` unset the endpoints answer **503**, so a
misconfigured deploy fails closed instead of accepting unsigned writes.

`validate` returns `{ valid, reason?, partner: {id, name}, offer: null, perk: { usageAllowanceUsd } }`.

## tRPC + UI

- `admin.codes.list / create / update` — status, max redemptions, expiry, perk,
  with redemption counts.
- Admin merchants list gains `source` + `source_code`; the approve dialog
  pre-checks the app-reported grandfathered set.
- `partner.codes.list` — the partner's own codes, scoped by `ctx.partner.id`.
- `/admin/codes` page + nav entry; a copyable code card in the partner portal.

## Tests

Money paths and authorization boundaries, per CLAUDE.md.

- HMAC: valid, bad signature, tampered body, stale timestamp, missing headers.
- Bind: creates a `pending` merchant bound to the code's partner; replay is a
  no-op; another partner's code on a claimed domain conflicts; grandfathered
  pre-fill resolves slugs.
- Codes: disabled / expired / exhausted all yield the same generic reason.
- Rate limit trips at 5 attempts per shop per hour.
- Shop events are idempotent; `uninstalled` does not unbind.
- Authz: a partner cannot read another partner's codes.

---

## Out of scope, deliberately

- App-side code entry (edge-subscription and the rest) — the other half.
- Credit issuance, `appCreditCreate`, `CreditGrant` — Phase 2, blocked on
  granting **View financials** to the Partner API client and confirming how long
  a charge stays pending.
- `meterUnitsFor` / `usageAllowanceUsd` threading — app-side.
- Reconciliation sweep against apps — needs an app reporting first.

## Known gap: self-referral

The bundles plan says to reject when the shop domain matches a store the partner
owns. We don't model partner-owned stores, so there is no signal to check
against. Implemented instead: a partner re-submitting a domain already bound to
them is an idempotent no-op, and every attempt is logged. True self-referral
blocking needs a partner-owned-domains list — a small addition, called out
rather than faked.
