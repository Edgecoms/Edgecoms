# Edge Mail: implementation plan

Internal email platform for the Edge Shopify apps at `email.edgecoms.app`.
Edge Mail owns the merchant, store, install and preference data, the segmentation
and the campaign config. Resend handles delivery, automations, broadcasts,
scheduling and tracking.

## Settled decisions

| Decision | Choice |
|---|---|
| Where | `apps/email` in this monorepo, deployed as its **own Vercel project** |
| Server | Next.js 16 App Router + **Hono** owning `/api/*` (`hono/vercel` catch-all) |
| Admin UI ↔ server | **tRPC mounted inside Hono** (`@hono/trpc-server`), reusing `adminProcedure` |
| Runtime | Bun for install/dev/test; **Node runtime** on Vercel (Bun runtime is beta: one line in `vercel.json` later). Dev port 3006 |
| ORM / DB | Drizzle via `@edgecoms/db`, same Postgres, new `mail_*` tables |
| Auth | Better Auth via `@edgecoms/auth`, same user table, admin role only |
| UI | shadcn from `@edgecoms/ui` (base-nova). The portal shell and helpers (`PortalHeader`, `StatCard`, `TableShell`, ...) moved there from apps/web so both portals share them. No new components were needed: native `<select>` and `datetime-local` cover the forms |
| Email layout | **`@edgecoms/mail/minimal`**, a clean dub.co-style layout (white page, bordered wordmark, centred heading, black pill button, sign-off), on the same content model, escaping and link rules as the partner card layout in `@edgecoms/mail/render`. Partner email keeps the card |
| Event stream | **One ingest:** apps call only `POST /api/v1/events`; lifecycle events are also recorded into `merchant_events` via the existing `recordShopEvent()` |
| Apps in scope | 6: edge-cart, edge-bundles, edge-subscriptions, edge-timer, edge-reviews, edge-currency. Trackproof is in the catalog but left out for now (no secret configured, so its calls get a 401) |

## Architecture

```text
Shopify apps ──HMAC (per-app secret)──▶ apps/email  /api/v1/events ──▶ mail_* tables
                                            │                     └──▶ merchant_events (recordShopEvent)
                                            ▼
                                   src/server/resend.ts  ◀── the ONLY file that imports `resend`
                                            │
                                         Resend ── automations, broadcasts, tracking
                                            │
                          /api/webhooks/resend ──▶ mail_email_events, suppression, topic sync
```

```ts
// apps/email/src/app/api/[[...route]]/route.ts
import { handle } from "hono/vercel";
import { api } from "@/server/api";

export const GET = handle(api);
export const POST = handle(api);
```

```ts
// apps/email/src/server/api.ts
export const api = new Hono()
	.basePath("/api")
	.on(["GET", "POST"], "/auth/*", (c) => auth.handler(c.req.raw))
	.use("/trpc/*", trpcServer({ endpoint: "/api/trpc", router: mailRouter, createContext }))
	.route("/v1/events", events) // per-app HMAC middleware
	.route("/webhooks/resend", resendWebhooks); // Svix signature
```

Hono's `app.request()` lets `bun test` hit every route directly, with no Next
server, which makes the authorization-boundary tests cheap.

## What is reused vs new

**Reused, not rebuilt:** `apps` catalog, `normalizeShopDomain`, `hmac.ts`
(`verifySignature`, `signPayload`, same `X-Edge-Signature`/`X-Edge-Timestamp`
scheme the apps already implement), `recordShopEvent`, `adminProcedure`,
Better Auth, `@edgecoms/env`, `@edgecoms/ui`, the pglite `db-harness` for tests.

**Small changes to shared code:**
- `createAuth({ disableSignUp })`: the mail instance must not allow sign-ups,
  because the sign-up hook would mint partner rows.
- `createContext` accepts a `Request` rather than a `NextRequest` (it only reads headers).
- `PortalShell` and the portal helpers moved into `@edgecoms/ui`; the shell takes
  an `onSignOut` prop because each app owns its auth client.
- `@edgecoms/mail/render` takes an optional `brand`, so an Edge app's email carries
  its own name and accent while partner email keeps rendering exactly as before.

**Why stores are not `merchants`:** `merchants.partner_id` is NOT NULL.
That table holds partner-attributed stores and belongs to the money system.
Edge Mail tracks every store that installs any app, so it has its own
`mail_stores`, and it **never writes** to `merchants` or anything money-related.

## Cuts from the V1 brief

| Brief | Plan | Add when |
|---|---|---|
| Segments page | Audience filter inline in the campaign composer | the same filter gets rebuilt repeatedly |
| "Add App" generates secrets stored in DB | One env var per app: `EDGE_MAIL_SECRET_<SLUG>` (same pattern as `PARTNER_API_GID_<SLUG>`) | app churn makes env edits painful |
| Published SDK package | One zero-dependency file (`clients/edge-mail-client.ts`: sign + fetch + retry) the apps vendor. The name `@edgecoms/mail` is already the platform's mail package | the client changes a second time |
| Scheduling | Resend `scheduledAt` on the broadcast, no cron of ours | never, unless Resend's scheduling falls short |
| Prisma | Drizzle | n/a |
| Snake_case event body | camelCase, matching the existing `/api/v1` bodies | n/a |

## Data model (`packages/db/src/schema/mail.ts`)

All tables are prefixed `mail_`, so the boundary is visible in SQL and generic names never collide.

```text
mail_app_settings    app_id PK→apps.id (restrict), sender_name, sender_email, reply_to,
                     brand_color, logo_url, app_url, support_url, review_url
mail_contacts        id, email UNIQUE (lowercased), first_name, last_name, resend_contact_id,
                     product_updates, marketing, education (bool, DEFAULT FALSE), preferences_set_at,
                     suppressed_at, suppression_reason ('bounced'|'complained')
mail_stores          id, shop_domain UNIQUE (normalized), name, country, currency, timezone
mail_contact_stores  (contact_id, store_id) PK
mail_installations   id, (store_id, app_id) UNIQUE, status (installed|active|inactive|uninstalled),
                     plan, installed_at, activated_at, setup_completed_at, uninstalled_at,
                     last_active_at, status_changed_at, plan_changed_at
mail_events          id, event_id UNIQUE, app_id, store_id, contact_id, type, payload jsonb,
                     occurred_at, received_at, resend_synced_at
mail_campaigns       id, name, type, category (product_updates|marketing|education), app_id,
                     subject, preheader, eyebrow, headline, body, hero_image, cta_label, cta_url,
                     audience jsonb (zod-typed), status (draft|importing|scheduled|sent|failed|cancelled),
                     content_updated_at, test_sent_at, recipient_count, resend_segment_id,
                     resend_import_id, resend_broadcast_id, scheduled_at, sent_at, sent_in_test_mode,
                     failure_reason, created_by→user.id
mail_campaign_recipients  (campaign_id, contact_id) PK, store_id
mail_email_events    id, svix_id UNIQUE, resend_email_id, type, email, contact_id, campaign_id, app_id,
                     payload jsonb, occurred_at, received_at
```

Rules the schema enforces:
- **Opt-in defaults to false.** An install never implies marketing consent.
- A campaign **cannot be `essential`**, so a campaign can never bypass an opt-out.
- `mail_events.event_id` unique with conflict-do-nothing makes a redelivery a no-op.
- `mail_email_events.svix_id` unique makes a webhook redelivery a no-op.
- `mail_campaign_recipients` PK on contact means one email per person per campaign, even if they own several stores.

## Event API: `POST /api/v1/events`

Headers: `X-Edge-App-ID: edge-cart`, `X-Edge-Timestamp`, `X-Edge-Signature` (HMAC-SHA256
over `<timestamp>.<raw body>` with that app's secret). The app is identified by the
**authenticated header**, never by the body.

```json
{
	"eventId": "uuid",
	"event": "app.installed",
	"occurredAt": "2026-09-23T12:00:00Z",
	"store": { "domain": "brand.myshopify.com", "name": "Brand" },
	"contact": { "email": "john@brand.com", "firstName": "John" },
	"properties": { "plan": "free" }
}
```

Processing, in order:
1. Verify HMAC against `EDGE_MAIL_SECRET_<SLUG>`. An unknown app, a missing secret or a bad signature all get one uniform 401.
2. Validate with zod (`event` is a closed enum of the 12 standard events).
3. Insert `mail_events` (conflict-do-nothing). On a duplicate where `resend_synced_at` is already set, return 200 `duplicate`.
4. In one transaction, upsert contact, store, contact_store and installation. An installation status only moves if
   `occurredAt > status_changed_at`, so an out-of-order or late delivery can't regress state.
5. Forward lifecycle events to `recordShopEvent()` with `idempotencyKey = eventId`:
   `app.uninstalled → uninstalled`, `plan.changed → plan.changed`, `plan.started → subscription.activated` *(confirm; see Open questions)*.
6. Sync to Resend (contact + properties, then event). On success set `resend_synced_at`.
   **On a Resend failure answer 502**: the app retries, step 3 sees an unsynced duplicate and re-runs the sync. No cron is needed.

`/api/v1/shop-events` stays live until every app has migrated, then gets removed.

## Resend SDK findings (Phase 0)
Checked against the type declarations of the installed SDK (`resend@6.26.0`), not
against the live API: making real calls would have written to the production
Resend account.

| Question | Answer |
|---|---|
| Trigger an automation | `resend.events.send({ event, email, payload })`. Event names and schemas can be registered with `events.create`. **No idempotency key** on this call (only `emails.send`/`batch` take one), so the ingest marks `resend_synced_at` right after the call; a crash in between can double-trigger once |
| Contacts | Global, one per email. `contacts.create` accepts `properties`, `segments`, `topics`; `contacts.update` takes `properties`. Properties must exist first (`contactProperties.create`, `string`/`number` only) |
| Topics | `topics.create({ defaultSubscription })`, `contacts.topics.update`, `contacts.topics.list` |
| Segment membership | `contacts.segments.add` is **one contact per call**. For a campaign use **`contacts.imports.create`** (CSV blob + `segments`), which is asynchronous (`queued → in_progress → completed/failed`), so a send is a small state machine that polls the import |
| Broadcasts | `broadcasts.create({ segmentId, topicId, from, replyTo, subject, previewText, html, text, send, scheduledAt })`; `send(id, { scheduledAt })`; `cancel(id)` exists |
| Webhooks | `resend.webhooks.verify({ payload, headers: { id, timestamp, signature }, webhookSecret })`, Svix headers. No extra dependency |
| Attributing an email | Webhook email data carries `broadcast_id`, `template_id` and `tags`. Campaign emails attribute by `broadcast_id` |
| `contact.updated` webhook | Carries `unsubscribed` and `segment_ids` but **not topics**. A topic opt-out made on Resend's page is read back with `contacts.topics.list` |

Still to verify live, on the first real send in test mode:
- Whether automation `Send Email` steps can tag emails (for per-app analytics of automation mail).
- `contacts.imports` with `onConflict: "upsert"` and only an `email` column adds the contact to the segment without touching its other fields.

## Resend boundary (`apps/email/src/server/resend.ts`)

Same rule as the Shopify adapter: the only file that imports `resend`.

- Event sync (`createResendSync`), topic sync, webhook verification, template upsert, setup, and the
  campaign calls (segment, CSV import, broadcast create/send/cancel, test email).
- **Test mode lives here and only here** (`deliveryAddress`). On unless `EDGE_MAIL_TEST_MODE` is
  exactly `off`. While on, every outbound address becomes `EDGE_MAIL_TEST_RECIPIENT`; with no inbox set,
  nothing reaches Resend at all. Real merchants are never created as Resend contacts in test mode.
- Live mode with no `RESEND_API_KEY` makes the event sync FAIL (502), so apps retry rather than
  losing automation triggers.
- Topics (created opt-out by default): `edge_product_updates`, `edge_marketing`, `edge_education`.
- Contact properties, only what automations branch on: `shop_domain`, `edge_app_count`,
  `<slug>_status`, `<slug>_plan`.

## Campaign send (the safety rail)

A state machine in `src/server/campaigns/send.ts`; every transition is a conditional `UPDATE`:

```text
draft ──send──▶ importing ──advance──▶ sent | scheduled ──cancel──▶ cancelled
                    └───────────────────▶ failed (any Resend error; terminal, "Duplicate as draft")
```

1. `send` refuses unless a test was sent after the last content change (`test_sent_at >= content_updated_at`),
   the app has a sender, the schedule is at least a minute out, and **the count the admin confirmed equals
   the count now**. The category comes from the campaign type on the server, never from the form.
2. One transaction claims `draft → importing` and snapshots `mail_campaign_recipients`.
3. A per-campaign Resend segment is filled with ONE CSV import (opting the rows into the category topic).
4. The UI polls `advance`. The broadcast is created at most once (claimed with a sentinel) and sent at most
   once (status claimed before the call). A creation interrupted for 10 minutes is marked failed.

## Build status

All phases are implemented on branch `feat/edge-mail`. Every phase passed typecheck, lint and its
tests before committing (66 tests in `apps/email`, plus render tests in `@edgecoms/mail`).

| Phase | What shipped |
|---|---|
| 1 Scaffold | `apps/email` (port 3006), Hono `/api/*`, Better Auth (sign-up off), admin tRPC, shared `PortalShell` |
| 2 Ingest | `mail_*` schema (migration 0015), `POST /api/v1/events` with per-app HMAC, idempotency, forwarding to `merchant_events` |
| 3 Resend | Adapter, test mode, `/api/webhooks/resend`, suppression, `resend:setup` |
| 4 Templates | Brand option on `@edgecoms/mail/render`, 5 lifecycle templates, `/templates`, `resend:push-templates` |
| 5 Admin UI | Dashboard, Contacts (+ profile, opt-out), Apps (settings, secret status), Templates |
| 6 Campaigns | Audience, composer with live preview, test send, guarded send/schedule/cancel (migration 0016) |
| 7 Automations | Built in Resend's dashboard; the Templates page shows each template's trigger and alias |
| 8 Preferences | `/preferences/<token>`, consent timestamp `preferences_set_at` (migration 0017) |
| 9 Client | `apps/email/clients/edge-mail-client.ts`, the one file each Shopify app copies, tested end to end |

### Decisions made during the build

- **Sending goes through `resend.ts`, not `@edgecoms/mail/send`.** CLAUDE.md routes the partner
  platform's transactional email through `@edgecoms/mail`. Edge Mail needs broadcasts, automations and
  per-app senders, which that package does not do, so it reuses the package's LAYOUT and keeps its own
  transport boundary. Confirm this reading of the rule.
- **An admin can opt a contact out, never in.** Opting in happens only on the merchant's preferences page,
  which stamps `preferences_set_at`.
- **A layout is not an auth boundary.** Every server page that reads data calls `requireAdmin()` itself.
- **No new shadcn components** were needed; native `<select>`, `datetime-local` and checkboxes cover it.

## Go-live runbook

1. Deploy `apps/web` first: its production build applies migrations 0015-0017 (it is the only migrator).
2. Create the Vercel project for `apps/email` (root `apps/email`, domain `email.edgecoms.app`) with the
   environment below. Leave `EDGE_MAIL_TEST_MODE` unset (test mode on) and set `EDGE_MAIL_TEST_RECIPIENT`.
3. `bun run resend:setup` in `apps/email` (topics, contact properties, event names).
4. In Resend, add a webhook to `https://email.edgecoms.app/api/webhooks/resend` for email, contact and
   suppression events; put its signing secret in `RESEND_WEBHOOK_SECRET`.
5. Fill in each app on the Apps page, then `bun run resend:push-templates`.
6. Build the five automations in Resend: trigger on the event the Templates page shows, send the
   template alias it shows, and filter on the `app_slug` payload field. In each Send Email step, map
   `GREETING_NAME` from `event.first_name` and `PREFERENCES_URL` from `event.preferences_url`.
7. Edge Cart first: copy `clients/edge-mail-client.ts` into it, set `EDGE_MAIL_APP_ID=edge-cart`,
   `EDGE_MAIL_SECRET` (and the same value as `EDGE_MAIL_SECRET_EDGE_CART` here), `EDGE_MAIL_URL`.
   Walk the brief's section 43 checklist with test mode ON. Verify the two open SDK points above.
8. Set `EDGE_MAIL_TEST_MODE=off`. Then connect the other five apps.

## Environment (`apps/email` Vercel project)

See `apps/email/.env.example`.

```text
DATABASE_URL, BETTER_AUTH_SECRET          same values as apps/web
BETTER_AUTH_URL, CORS_ORIGIN, EDGE_MAIL_URL   https://email.edgecoms.app
RESEND_API_KEY                            full-access key, exists ONLY in this project
RESEND_WEBHOOK_SECRET
EDGE_MAIL_TEST_MODE                       on unless literally "off"
EDGE_MAIL_TEST_RECIPIENT
EDGE_MAIL_PREFERENCES_SECRET              32+ chars
EDGE_MAIL_SECRET_<SLUG>                   one per app, 32+ chars
```

Migrations stay owned by `apps/web`'s production build (`scripts/deploy-migrate.sh`), so two builds never
race `drizzle-kit migrate`. A mail schema change ships **migration-first**.

## Open questions

1. **Consent source.** Where does product-update / marketing / education consent come from today?
   Until a merchant opts in on the preferences page every flag is false, so **release and marketing
   campaigns reach nobody**. Lifecycle automations are unaffected.
2. **`plan.started` → `subscription.activated`.** The ingest records `plan.started` into
   `merchant_events` as `subscription.activated` (the partner portal reads it as "live"). One constant in
   `src/server/events/ingest.ts`; confirm before any app is connected.
3. **Sending domain.** Broadcasts from `updates@edgecoms.app`, or a subdomain such as
   `updates.edgecoms.app` so marketing reputation cannot hurt the root domain? Set per app on the Apps page.
4. **The `@edgecoms/mail` rule** (see Decisions above).
