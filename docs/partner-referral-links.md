# Partner referral links — state and app-side handoff

**Status:** platform side live (PRs #20, #21). App side written for `edge-cart`
only, and not yet pushed. Discounts deliberately untouched; see
[`partner-plan-discounts.md`](./partner-plan-discounts.md).

Companion documents: [`partner-attribution-codes.md`](./partner-attribution-codes.md)
is the code path this sits beside and never changes. `CLAUDE.md` holds the
invariants; this file holds the shape of the integration.

---

## What links add, and what they do not

A code is typed by a merchant INSIDE an Edge app. A link is clicked on the open
web before the app is installed. Both end at the same row: a `merchants` record
bound to one partner, `pending` until an admin approves it.

What links add is the part the code path never sees: the click, the channel it
came through, and a way to credit a partner the merchant never types a code for.

**A click is not an attribution.** Nothing under `/r/` binds a store.

## Live on the platform

| Piece | Where |
| --- | --- |
| `/r/<code>` and `/r/<code>/<app-slug>`, plus custom slugs | `apps/web/src/app/r/[...ref]/` |
| Link rows, clicks, claims | `packages/db/src/schema/referrals.ts`, migrations `0013`, `0014` |
| Resolution rules, self-referral block | `packages/api/src/referrals/resolve.ts` |
| Claims (30 days, newest wins) | `packages/api/src/referrals/claims.ts` |
| Admin: links per partner, suggested-match queue | `admin/partners/[partnerId]`, `admin/referrals` |
| Install-time endpoint | `apps/web/src/app/api/v1/attributions/resolve/route.ts` |

## The contract an app implements

`POST https://www.edgecoms.app/api/v1/attributions/resolve`, signed the same way
as the existing code-entry calls: HMAC-SHA256 hex over
`timestamp + "." + rawBody` with `EDGE_PARTNERS_SECRET`, sent as
`X-Edge-Signature` / `X-Edge-Timestamp`.

```jsonc
// request
{ "appSlug": "edge-cart",          // required
  "shop": "store.myshopify.com",   // required
  "paidAppSlugs": ["edge-cart"],   // what this shop already pays for
  "ipHash": "a1b2…" }              // optional, see rule 5

// response, always 200
{ "ok": true, "status": "attributed",
  "partner": { "id": "…", "name": "Acme Agency", "code": "ACMEAGENCY" },
  "merchantId": "…" }
```

| `status` | Meaning | What the app does |
| --- | --- | --- |
| `existing` | The shop already belongs to a partner | Store the row if it has none |
| `attributed` | A claim was honoured; store is now pending approval | Store the row, already synced |
| `suggested` | An address matched a click; an admin will judge | Nothing |
| `none` | No partner | Nothing; the code box still applies |
| `self_referral` | The claim was the partner's own store, refused | Nothing |

400 is an invalid body or an unusable shop domain; 401 an absent or bad
signature; 503 a platform with no secret configured. Every real answer is 200,
because an app that installed successfully must not see a failure just because
nobody referred the store.

## Five rules, each one a real failure mode

1. **Ask once per shop, behind a marker column.** `edge-cart` added
   `Shop.partnerResolvedAt` and stamps it only after a definitive answer, so an
   unreachable platform is retried and "no partner" is not asked twice. The
   layout loader runs on every admin route; an ungated call would hit the
   platform on every page load.
2. **Not an `afterAuth` hook.** With expiring offline tokens it fires on every
   token exchange, not once per install, and it receives no request, so there is
   no IP.
3. **Write the local row already synced.** The platform created the attribution,
   so this is a confirmation, not a bind. A row left `syncedAt = null` is picked
   up by `sweepUnsyncedAttributions`, pushed to `/attributions` without a code,
   refused, and **deleted** — losing the referral silently.
4. **Write nothing for a non-answer.** `none`, `suggested` and `self_referral`
   must leave the table alone: the attribution table is unique per shop, so a
   placeholder row consumes the only slot and makes the in-app code box answer
   "already bound" for ever.
5. **The IP hash is optional, shared-salt, and never stored.** It only powers
   the admin suggestion queue, and matches only when the app hashes with the
   same salt the platform uses (`EDGE_PARTNERS_IP_SALT` app-side,
   `REFERRAL_IP_SALT` platform-side). The app privacy policies say no location
   data is kept; computing, sending and forgetting the hash keeps that true.

## Reference implementation

Branch `feat/partner-link-resolve` (worktree `~/edge-cart-referrals`), one
commit, not pushed.

| File | What it does |
| --- | --- |
| `app/services/partners.server.ts` | `resolveAttribution()` and `hashInstallIp()`, over the existing signed `post()` (HMAC, 5s timeout, never throws, env gate) |
| `app/routes/app.tsx` | The gate: resolve when `!shop.partnerResolvedAt`, then stamp |
| `app/models/shop.server.ts` | `markPartnerResolved()` |
| `prisma/schema.prisma` + `…_add_partner_resolved_at` | One nullable column; applied by `prisma migrate deploy` on container start |
| `partners-platform/src/{api,server}.js` | The bundled fake platform answers the route, for interop tests |
| `app/services/partners.server.test.js` | 14 tests; the synced stamp and the write guard are mutation-checked |

## Per-app state

Each app is its own repo under `~/`, with its own remote and its own drift.
Fetch and compare before branching.

| Repo | Partner client | Next step |
| --- | --- | --- |
| `edge-cart` | Full | Push and deploy the branch above |
| `edge-subscription` | Has one | Port the five rules; it already owns `appSubscriptionCreate` |
| `edge-bundles` | Partial | Check what exists; uncommitted billing work was in that checkout |
| `trackproof`, `edge-currency`, `Edge-Reviews`, `Edge-Timer`, `edge-audit`, `edge-convert` | None | Port the client from `edge-cart` first, then the hook |

## Settings

- `EDGE_PARTNERS_URL` — `https://www.edgecoms.app`. Already set wherever the
  in-app code box works.
- `EDGE_PARTNERS_SECRET` — the shared signing secret; must match the platform.
  Unset means every partner call no-ops and the UI hides the code card.
- `EDGE_PARTNERS_IP_SALT` — optional, must equal the platform's
  `REFERRAL_IP_SALT` or the suggestion queue can never match.

## Testing on a dev store

1. Copy a partner's main link from admin (`/r/<CODE>`), or `/r/<CODE>/edge-cart`.
2. Open it: the page names the partner and a click row is written.
3. Type the dev store's address and continue: a `referral_claims` row appears,
   pending, for 30 days.
4. Install the app from the listing, then open it once in the store's admin.
5. The store appears in Edge admin under that partner, `pending`, with source
   `link`.

A dev store is `ineligible` for commission by the app's own eligibility rule.
That is intended: the attribution is recorded, the commission is not.

## Known gaps

- The suggestion queue only fills when app and platform share the IP salt.
  Without it the answer is simply `none`.
- An all-apps link sends the merchant to the product index after submitting,
  because no app has been chosen yet. An app picker is the obvious improvement.
- Claims are not expired by a job; every read filters on the expiry instead.
- Unique visitors dedupe per link, and per partner for the bare code, so two
  apps shared with one person count one visitor unless each has its own link.
- Analytics, roll-ups and the partner "my links" page are not built. The plan is
  a daily Vercel schedule plus a "rebuild stats" action in admin.
- The billing pass that creates commissions and awards bonuses still runs only
  from the admin "Run sync now" button.
