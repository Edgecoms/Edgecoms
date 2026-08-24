# Partner plan discounts — Phase 2

**Status:** design agreed 2026-08-24. Supersedes the deferred discount section of
[`partner-attribution-codes.md`](./partner-attribution-codes.md), which shipped
Phase 1 with `offer: null` precisely so a code would not promise a price cut
nothing could honour. This is the pass that makes the promise honourable.

Companion document: the `edge-bundles` app-side plan. Half of this contract is
app-side and **nothing here is merchant-visible until that half lands.**

---

## What changes

A partner's attribution code stops being purely an attribution fact and starts
carrying a **discount grant**: the first N merchants a partner refers get the
**Enterprise plan free for 6 billing cycles**, on every Edge app that offers one.

One string still does both jobs. The merchant pastes the code into an Edge app,
the store binds to the partner, and the Enterprise plan comes back free.

## Decisions taken

| Decision | Choice |
| --- | --- |
| Which plan is discounted | **Enterprise (fixed recurring) only.** Never usage-based. |
| Discount size | 100% off |
| Duration | **6 billing cycles**, then full price |
| Who qualifies | The **first 10 merchants per partner**, counted across all their codes |
| App scope | **Every Edge app with an Enterprise plan.** One store, three grants. |
| Grandfathered stores | **No discount.** Already paying is not new business. |
| Commission during the free period | **None.** No charge, no earning event, no commission. |
| Grant lifetime | **Frozen onto the merchant at bind.** Never read live from the code. |

### Why Enterprise only

Shopify's `AppRecurringPricingInput` carries a `discount`
(percentage-as-decimal or fixed amount, plus `durationLimitInIntervals`).
`AppUsagePricingInput` carries **no discount field at all** — only `terms` and
`cappedAmount`. Discounting usage would mean every app implementing and honouring
its own allowance suppression, which is exactly the app-side work that has left
`perkUsageAllowanceUsd` inert since Phase 1.

Scoping to Enterprise means the discount is applied by **Shopify**, not by our
metering code. That is the difference between a shippable phase and an open one.

### Why the commission goes to zero, and why that is correct

Enterprise is a flat fee. 100% off means Shopify raises no charge, so no
transaction enters the Partner API stream, so no `earning_events` row exists, so
no commission is generated. There is no code to write for this — it is what the
ledger already does.

The alternative considered and **rejected**: paying the partner on the
undiscounted list price. That requires a notional commission base divorced from
`netAmount`, and would let commissions exceed revenue. `net` means one thing
everywhere in this ledger, and that is what makes a payout reconcilable line by
line. We are not breaking it for a promo.

**The consequence must be stated in the partner portal, not buried.** A partner
who closes ten stores in month one sees nothing from them until month seven.
Merchants 11+ pay full price and earn from their first charge.

### Exposure

Forgone revenue per partner = `grantLimit x appsWithEnterprise x price x cycles`.
At ten merchants, three apps, and six cycles that is **180 x the Enterprise
monthly price, per partner**. Sanity-check this against the acquisition budget
before the grant limit is raised.

---

## Step 0 — de-risk before building

`durationLimitInIntervals: 6` with `percentage: 1.0` expresses the requirement
exactly, but **Shopify does not document a maximum discount percentage** and 100%
is unverified. Two candidate mechanisms, and the plan branches on which works:

1. **`discount { percentage: 1.0, durationLimitInIntervals: 6 }`** — exact, six
   billing cycles, reverts to full price automatically. Preferred **if accepted**.
2. **`trialDays: 180`** — documented, unambiguous, but approximates six months in
   days and drifts against real month lengths.

**Action: create a test Enterprise subscription on a dev store with a 1.0
percentage before any schema work.** Do not stack the two — per Shopify, adding a
discount during a trial ends the trial immediately.

---

## Schema

### `partner_codes` additions

Integers only, per CLAUDE.md "Money correctness". No floats, ever — the
bps-to-decimal conversion for Shopify happens in the adapter and nowhere else.

| Column | Notes |
| --- | --- |
| `discount_kind` | `none` \| `percentage` \| `fixed` \| `free_cycles`. Default `none`. |
| `discount_bps` | `10000` = 100%. Integer. Null unless `percentage`. |
| `discount_amount_minor` + `discount_currency` | Integer minor units. Null unless `fixed`. |
| `discount_cycles` | Billing intervals the discount survives. Null = indefinite. |
| `discount_grant_limit` | How many of the partner's merchants get it. Counted **per partner**, not per code. |

`discount_grant_limit` is deliberately not `max_redemptions`. That field caps one
code; a partner may hold several. The grant counter resolves against
`merchants.partner_id` so three codes cannot yield thirty discounted stores.

### `merchants` additions — the frozen grant

| Column | Notes |
| --- | --- |
| `discount_kind` | Copied from the code **at bind**, then immutable |
| `discount_bps` / `discount_amount_minor` / `discount_currency` | Frozen |
| `discount_cycles` | Frozen |
| `discount_granted_at` | Null = no grant |

Frozen for the same reason the commission rate and the grandfathered set are
frozen: editing a code must never rewrite what an already-bound store was
promised. Reading the grant live would make a code edit retroactively change a
merchant's bill, which is the same class of bug as rewriting unpaid history.

Application per app is audited through the existing append-only `merchant_events`
(`discount.applied`, idempotent on `idempotency_key`). No new table.

---

## Domain logic — `packages/api/src/attribution/`

**`grants.ts` (new)** — `resolveGrant(tx, partnerId, code)`:

- Returns no grant when `discount_kind = 'none'`, when the partner's grant count
  has reached `discount_grant_limit`, or when the app is in the merchant's
  grandfathered set.
- The count is `merchants WHERE partner_id = ? AND discount_granted_at IS NOT
  NULL AND status <> 'rejected'` — a rejected merchant releases its slot.
- **Resolved inside the bind transaction, with `SELECT ... FOR UPDATE` on the
  partner row.** Without the lock, two shops binding concurrently both read
  "9 used" and both take slot 10.

**`bind.ts`** — call `resolveGrant` and write the frozen columns. A replay by the
same partner returns the **existing** grant unchanged; it never re-resolves and
never consumes a second slot.

**`preview.ts`** — return the grant the merchant *would* receive, so the app can
show "Enterprise free for 6 months" before they commit. Read-only, consumes
nothing.

---

## HTTP surface

No new endpoints. Two response bodies grow:

`POST /api/v1/codes/validate` and `POST /api/v1/attributions` replace the
Phase 1 `offer: null` with:

```jsonc
"offer": {
  "kind": "percentage",   // none | percentage | fixed | free_cycles
  "bps": 10000,           // integer; 10000 = 100%
  "cycles": 6,            // billing intervals
  "appliesTo": "enterprise"
}
```

`offer: null` remains the response when no grant applies — an exhausted limit, a
grandfathered app, or a code with `discount_kind = 'none'`. Apps must handle it.

**Running out of allocation is not a rejection.** The bind still succeeds and the
store still earns commission; only the price cut is withheld. Nothing about the
generic-rejection rule changes, because no rejection occurs.

`discountAmount` crosses the wire as a decimal STRING (`"5.00"`) and is converted
to integer minor units server-side by `decimalStringToMinorUnits`, which is
string arithmetic and throws rather than truncating. JSON has no bigint, and
`Number()` on a money field is how precision gets lost.

---

## The app-side contract

For each of the three apps with an Enterprise plan:

1. On code entry, call `/codes/validate` and show the merchant what they get.
2. On confirm, call `/attributions`, read `offer`, and pass it into
   `appSubscriptionCreate` on the **Enterprise line only**. Usage lines are never
   touched.
3. `POST /shop-events` with `discount.applied` and a stable `idempotency_key`.
4. `offer: null` means charge full price. Never assume a grant.

**A store already on a paid Enterprise subscription cannot be discounted in
place** — Shopify requires a new subscription for the merchant to re-approve.
Such a store is also grandfathered, so it gets no grant anyway. The two rules
agree; the app should not offer the discount at all in that case.

---

## Admin + partner UI

- **Issue-code dialog:** replace "Fee-free allowance" with a discount block —
  kind, value, cycles, grant limit. The current help text promises a usage-fee
  waiver nothing honours and must go.
- **Codes table:** show `grant used / limit` per partner alongside redemptions.
- **Partner dashboard:** state the drought plainly — "your first 10 merchants get
  6 months free; you earn from them once billing starts."
- **Admin merchants list:** show whether a merchant holds a grant and how many
  cycles remain.
- Wire up `admin.codes.update` for terms editing. It already accepts them; the
  page only wires the status toggle, so an expiry cannot be extended today.

---

## Tests

Money paths and authorization boundaries, per CLAUDE.md.

- Grant resolves for merchants 1-10 of a partner and is absent for the 11th.
- The counter spans **all** of a partner's codes, not one.
- Concurrent binds cannot both take the last slot.
- A rejected merchant releases its slot; an approved one does not.
- A grandfathered app yields `offer: null`.
- Replay returns the identical frozen grant and consumes no second slot.
- Editing a code's discount does not alter an already-bound merchant's grant.
- An exhausted grant limit withholds the DISCOUNT, not the binding: the store
  still attributes to the partner and still earns commission at full price.
- A discounted merchant generates **no** commission while no charge arrives, and
  commission resumes on the first real charge at the partner's frozen rate.

---

## Built

Platform side is complete and green (`bun run check`, `check-types`, and 16 new
tests in `packages/api/src/__tests__/grants.test.ts`):

- Migration `0002_sturdy_baron_zemo.sql` — additive, no backfill needed.
- `packages/api/src/attribution/grants.ts` — allocation, locking, freezing.
- `bind.ts` / `preview.ts` — grant resolution and per-app suppression.
- Both v1 endpoints return `offer`.
- Admin issue-code dialog carries the discount block; the inert "fee-free
  allowance" field is gone from the UI (the column and API field remain, so no
  app contract breaks).
- The partner card states the commission drought in plain words.

Still app-side, and nothing is merchant-visible until it lands: reading `offer`
and passing it to `appSubscriptionCreate`, plus Step 0's 1.0-percentage check.

**Note on the concurrency test.** PGlite is a single in-process connection, so
transactions cannot truly overlap and the test does not exercise `FOR UPDATE`.
It proves concurrently-issued binds never exceed the allocation; the lock is what
makes that hold on real Postgres. Verify against Railway before the promo opens.

## Out of scope, deliberately

- Usage-plan discounts. Shopify offers no mechanism; revisit only if
  `appCreditCreate` is adopted, which was explicitly rejected for this phase.
- Per-app discount configuration. Every Enterprise plan is covered or none is.
- Automatic cancellation of a grant when a merchant is rejected — see below.

## Known gap: a rejected merchant keeps their free months

The grant is applied by the app at bind, before an admin approves. Rejecting the
merchant here does not cancel their Shopify subscription, so a rejected store
keeps six free cycles. The slot is released for the partner, but the revenue is
not recovered.

Closing this needs an app-side cancellation path driven by a new
`attribution.revoked` shop event. Called out rather than faked. Until it exists,
the abuse ceiling per partner is `grantLimit x appsWithEnterprise` free
subscriptions, which is the same number the promo already budgets for.
