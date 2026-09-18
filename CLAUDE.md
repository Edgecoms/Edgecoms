# Edge Partner Platform — Non-Negotiable Invariants

> This file is **law** for the Edge Partner Platform (the business layer for Edge,
> a studio of Shopify apps: marketing site + partner portal + admin portal).
> It is the money-correctness and authorization contract. If any change pushes
> against an invariant here, **stop and flag it** rather than working around it.
> General code-style standards (Ultracite/Biome) live in `.claude/CLAUDE.md`.

This is a **money system**. A wrong number is a real payout dispute. Build for
correctness and auditability over cleverness.

## Business model (drives correctness)

A partner is given an **attribution code**, which they hand to a merchant they
manage; the merchant enters it inside
an Edge app and the store arrives in the dashboard already bound to that partner.
A partner may also register a store by hand — the same row either way, just a
different `merchants.source`. Partners also have **referral links**, but a link
only TRACKS (see "Referral links"): attribution still comes from a code, never
from a click. An admin approves the partner with a commission
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
- There are **two kinds**, and the difference is whether anything is owed.
- **Discretionary** (`milestone_key` null): an admin issues each one with an
  amount and a reason. Nothing mints these and nothing is owed to a partner who
  has not been given one.
- **Milestone** (`milestone_key` set): a **published promise**. Every partner
  who reaches the rung is owed it whether or not anybody is watching, so the
  amounts are shown on the partner's ladder — a rung that pays but does not say
  so is worse than one that says nothing. The ladder and the awarder read the
  SAME function (`evaluatePartnerMilestones` in `@edgecoms/billing`): a screen
  saying "reached" while nothing was paid is a dispute, so there is one
  definition of reached in the system.
- **Amounts, in minor units of `MILESTONE_BONUS_CURRENCY` (USD).** The rungs are
  $240: first commission $10, first $100 earned $100, three apps on one store
  $10, five stores $50, every app earning $70. On top of that, **$5 for every
  store a partner brings that starts paying** — `MERCHANT_BOUNTY_MINOR`, which
  is UNBOUNDED and so is not a rung.
  Changing an amount changes what FUTURE partners are owed and never rewrites
  what has been paid. Removing a rung stops future awards and leaves past ones.
- **The bounty's trigger is EARNING, not approval.** A store that has generated
  commission has paid Shopify for an Edge app, which cannot be faked without
  actually paying Shopify, so every bounty is backed by revenue Edge received.
  Approval would be unsafe as a trigger: the settling sweep approves clean
  stores by itself, so a bounty on approval lets a partner bind any myshopify
  domain they control and collect five dollars a day later.
- There is deliberately **no "first store" rung**. The bounty already pays for
  the first store, and a rung beside it would pay that store twice.
- One bounty per store, forever, keyed `merchant_earning:<merchantId>` so the
  same unique index that caps a rung caps each store. `merchant_id` is stored
  alongside so the ledger can name the store instead of parsing the key.
- **A milestone pays once per partner, ever**, enforced by the unique index on
  (`partner_id`, `milestone_key`) with `onConflictDoNothing` — a database
  guarantee, not the awarder remembering. Check-then-insert has a window where
  two runs both decide a rung is unpaid; the index has none, which is what makes
  a six-hourly cron safe to re-run.
- The money rung is **measured** in the partner's largest single currency and
  **paid** in USD. It reads commissions only, so a bonus can never advance the
  rung that awarded it.
- Milestone awards run AFTER commission generation in the billing pass: four of
  the six rungs are functions of the commission ledger.
- A partner sees only bonuses actually AWARDED, plus the milestone amounts on
  offer. The portal never forecasts a discretionary bonus, because a forecast of
  a discretionary payment is a promise nobody made.
- Only an `approved` partner may be issued or accrue one. An unapproved partner
  has no agreed rate and no payout details; paying one is a decision to take
  after approving them. This holds for both kinds.
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
- **A partner earns from the day their code was used, never before.**
  `merchants.earningsFromAt` is set when the store is bound, and commission
  generation refuses any charge that occurred before it. Without this bound,
  approving a store paid its partner a share of every charge it had EVER made,
  which with publicly shared codes is a way to harvest existing customers: a
  store already paying Edge directly enters a code it saw posted, and the
  partner collects on the whole history having brought nobody.
  It is its own column rather than `createdAt` because `createdAt` is a generic
  audit timestamp a backfill could reasonably rewrite, and this one decides
  money.
  COMPLEMENTARY to grandfathering, not a replacement: this blocks the PAST for
  every app, grandfathering blocks the FUTURE for apps the store already paid
  for. An app the store used and cancelled last year is caught by this and not
  by that.
- Commission is **lifetime** while the merchant stays subscribed. There is no
  expiry logic; no earning event simply means no commission.
- **Per-app rates:** a partner has a default rate (basis points); an optional
  `partner_app_rates` row overrides it per app.

## Paying a partner

- **Where the money goes is structured and validated**, not free text: an
  account holder name, an account number, and — for a domestic Indian transfer —
  an IFSC (11 characters, fifth always `0`). `payoutDestination` says which
  route applies (`bank_in` or `bank_intl`) and therefore which fields carry
  meaning. `payoutMethod`/`payoutReference` are SUPERSEDED and read by nothing;
  confirm they are empty in production, then drop them.
- **`payoutBlocker` is the single definition of payable.** The partner's
  settings screen, the onboarding checklist and `payouts.pay` all call it, so a
  screen can never say ready while a run would refuse. It re-reads the STORED
  row rather than trusting a form, because rows predate validators.
- **A payout records gross, withheld and net.** India withholds at source —
  commission to a resident under 194H, to a non-resident under 195 — so the
  amount transferred is not the amount earned. Without all three the ledger
  claims a partner was paid in full while their bank shows less.
  `withholdingNote` carries the section, rate and certificate number.
- **There is no FX RATE column, on purpose.** A rate is a ratio, and storing one
  either invites a float into the money path or forces a precision decision
  nobody will remember. `(netAmount, settledAmount + settledCurrency)` says the
  same thing in integers — "we owed $328, we sent ₹27,400" — and the rate is
  derivable whenever anybody wants it.
- **`method` is recorded, not inferred.** Six months on, a payout row should say
  whether it was a domestic transfer, an outward remittance, or an invoice link
  somebody paid by hand, because those reconcile against different evidence.
- **Minimum payout $50** (`MINIMUM_PAYOUT_MINOR`). Below it a transfer fee is a
  meaningful share of the payment, so the group is held and the commissions stay
  `pending` to join next month — the same mechanism a late charge already uses.
  `force` overrides it, for settling a final balance.

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
- **Codes are meant to be spread.** A partner posting theirs publicly is the
  distribution model working, not a leak: whoever enters it, that store is
  theirs. So discovering that a code exists is not a threat, and nothing here
  should add friction to sharing one.
  Rejections still return **one generic reason** — not to stop enumeration, but
  because a caller has no business learning WHY a code failed (disabled vs
  expired vs partner-not-approved is our internal state). The real reason goes
  to `code_redemption_attempts.reason`, never over the wire.
  What public codes DO require is the claim-start rule below: if anybody can
  bind a store by typing a code they saw posted, the partner must not thereby
  earn on that store's past.
- `merchant_events` is **append-only** and idempotent on the app's
  `idempotency_key`. An `uninstalled` event does **not** unbind; commission stops
  simply because no earning events arrive.
- The app→platform endpoints (`/api/v1/codes/validate`, `/attributions`,
  `/shop-events`) are HMAC-signed over `<timestamp>.<raw body>`. They **fail
  closed**: no `EDGE_PARTNERS_SECRET` means 503, never an unsigned write.
- Codes carry **no discount terms** yet. Credit issuance is a later phase; until
  it exists a code must not promise a price cut nothing can honour. When they
  arrive they are integers (basis points / minor units), never a float.

## Referral links (Phase 1: clicks only)

- A link is the second way a partner brings a store, and it changes **nothing**
  about the first. `/r/<code>` works for every approved partner with no row
  anywhere; a `referral_links` row exists only for a vanity address, a
  single-app link, or a channel (`?s=`) a partner wants counted separately.
- **A click is not an attribution.** Nothing under `/r/` binds a store, and one
  partner per shop stays permanent. A store still becomes a partner's through a
  code in an Edge app (and, from Phase 2, a claim checked against that same
  rule).
- A link resolves through the SAME `validateCode` the bind uses, so a
  suspended partner's link stops working exactly as their code does. An address
  that resolves to nothing records no click: a click that can never convert is
  noise, not data.
- **`referral_clicks` is append-only and never holds a raw IP.** The address is
  a salted SHA-256 (`REFERRAL_IP_SALT`, falling back to `BETTER_AUTH_SECRET`);
  with no salt the hash column is left null rather than filled with a
  guessable one. Bots are recorded with `is_bot` and never counted `is_unique`;
  past the hourly ceiling per address nothing is written and the visitor is
  still redirected.
- A visitor counts once per 24 hours per LINK, or per partner for clicks on the
  bare code. Two apps shared with one person therefore count one unique visitor
  unless each has its own link.
- Disabling a link stops new clicks resolving to it and never unbinds a store
  it already brought, the same rule a disabled code follows.

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
- **An invite is claimed only from a verified address.** `invites.accept`
  refuses while `user.emailVerified` is false. The invite is bound to an
  address, but only the verification email proves the person owns that inbox.
  Sign-up sends that email; the partner home claims the invite once the link
  brings them back.
- `requireEmailVerification` is deliberately **off**. Turning it on locks out
  every account that signed up before verification existed, the admin
  included. Gate the specific thing that needs a proven address instead.
- A password reset signs out every session on that account
  (`revokeSessionsOnPasswordReset`).
- All outbound email goes through `@edgecoms/mail` (`send.ts` never throws;
  it skips with a warning when `PARTNER_FROM_EMAIL` or a transport is unset).
  Send only after the transaction commits.
- The sending domain receives no mail. So no email asks the reader to reply:
  every one ends with the contact address as text (`PARTNER_CONTACT_EMAIL`
  in `@edgecoms/mail/contact`) and says replies are not received.
  `PARTNER_REPLY_TO` exists but is deliberately unset.
- A figure in an email is read from the constant that governs it, never
  typed: the invite's expiry comes from `INVITE_TTL_DAYS`, and the bonus
  amounts from the milestone constants.

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
