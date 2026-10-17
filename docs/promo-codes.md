# Promo codes

A promo code is a discount Edge hands out itself: an admin issues it at `/admin/promo-codes`, it is
shared however we like, and a merchant pastes it into any Edge app's billing page to get the offer.

It is **not** an attribution code. Redeeming one creates no `merchants` row, binds the store to
nobody and earns nobody commission. A store a partner already referred can redeem one; a store that
redeemed one can still be referred by a partner later.

## Rules

- **One namespace with partner codes.** A merchant pastes both into the same box, so the admin
  router refuses a promo code that matches a partner code and vice versa.
- **The offer is fixed at issue.** Redemptions don't freeze a copy of the terms, so the terms are
  not editable; status, label, store cap and redeem-by date are. To change an offer, disable the
  code and issue a new one.
- **Any paid plan, any app.** The offer goes out with `appliesTo: "all"`. Partner grants keep
  `"enterprise"`.
- **Per app, counted per store.** A store redeems separately in each app it uses (one
  `promo_redemptions` row per code, shop and app). `maxRedemptions` caps distinct STORES, so one
  store in four apps uses one slot.
- **Redeem-by date.** `expiresAt` is checked on every app's redemption, so a store that redeemed in
  one app before the date and installs another after it gets nothing in the second. A replay from an
  app that already redeemed returns the offer even after expiry or disabling: that store was
  promised it.
- **Rejections look identical** and share the per-shop attempt budget with partner codes
  (`code_redemption_attempts`, outcome `invalid`, with the real reason in `reason`).

## The app contract

`POST /api/v1/promos/redeem`, HMAC-signed like the other `/api/v1` endpoints.

```json
{ "code": "EDGE3FREE", "shopDomain": "acme.myshopify.com", "appSlug": "edge-cart" }
```

| Status | Body |
|---|---|
| 200 | `{ "ok": true, "status": "redeemed" \| "already_redeemed", "offer": { "kind", "bps", "amountMinor", "currency", "cycles", "appliesTo": "all" } }` |
| 422 | `{ "ok": false, "reason": "invalid" }` — any reason, always the same |
| 429 | `{ "ok": false, "reason": "rate_limited" }` |
| 400 | bad body or shop domain |

`offer` has the same shape as a partner grant's. "3 months free" is
`{ "kind": "free_cycles", "cycles": 3 }`, applied as a 100% discount for 3 intervals on the
recurring line (`AppRecurringPricingInput.discount`).

**Call order in the app's code box:** call `/api/v1/codes/validate` first. If it says invalid, call
`/api/v1/promos/redeem`. Validate records nothing, but a miss here spends one of the shop's five
attempts, so the other order would burn the budget on every partner code a merchant pastes.

**Before an app ships this**, it must accept `appliesTo: "all"`. Edge Currency's
`partnerOfferSnapshot` throws on anything but `"enterprise"` today.
