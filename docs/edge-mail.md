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
| Runtime | Bun for install/dev/test; **Node runtime** on Vercel (Bun runtime is beta: one line in `vercel.json` later) |
| ORM / DB | Drizzle via `@edgecoms/db`, same Postgres, new `mail_*` tables |
| Auth | Better Auth via `@edgecoms/auth`, same user table, admin role only |
| UI | shadcn from `@edgecoms/ui` (base-nova). The portal shell and helpers (`PortalHeader`, `StatCard`, `TableShell`, ...) moved there from apps/web so both portals share them. No new components were needed: native `<select>` and `datetime-local` cover the forms |
| Email layout | **`@edgecoms/mail/render`**, extended with a per-app `brand`, not React Email. CLAUDE.md routes all outbound email through `@edgecoms/mail`, and one layout keeps partner and merchant mail consistent |
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
                     brand_color, logo_url, app_url, support_url, review_url, active
mail_contacts        id, email UNIQUE (lowercased), first_name, last_name, resend_contact_id,
                     product_updates, marketing, education (bool, DEFAULT FALSE),
                     suppressed_at, suppression_reason ('bounced'|'complained')
mail_stores          id, shop_domain UNIQUE (normalized), name, country, currency, timezone
mail_contact_stores  (contact_id, store_id) PK, role, is_primary
mail_installations   id, (store_id, app_id) UNIQUE, status (installed|active|inactive|uninstalled),
                     plan, installed_at, activated_at, setup_completed_at, uninstalled_at,
                     last_active_at, status_changed_at
mail_events          id, event_id UNIQUE, app_id, store_id, contact_id, type, payload jsonb,
                     occurred_at, received_at, resend_synced_at
mail_campaigns       id, name, type, category (product_updates|marketing|education), app_id,
                     subject, preheader, eyebrow, headline, body, hero_image, cta_label, cta_url,
                     audience jsonb (zod-typed), status (draft|scheduled|sending|sent|failed|cancelled),
                     test_sent_at, recipient_count, resend_segment_id, resend_broadcast_id,
                     scheduled_at, sent_at, created_by→user.id
mail_campaign_recipients  (campaign_id, contact_id) PK, store_id
mail_email_events    id, svix_id UNIQUE, resend_email_id, type, contact_id, campaign_id, app_id,
                     payload jsonb, occurred_at
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

## Resend boundary (`apps/email/src/server/resend.ts`)

Same rule as the Shopify adapter: one file, everything else sees plain types.

- `upsertContact`, `setTopics`, `sendEvent`, `syncCampaignSegment`, `createBroadcast`,
  `sendBroadcast`, `sendTest`, `verifyWebhook`.
- **Test mode lives here and only here.** Every outbound address passes through
  one function; while `EDGE_MAIL_TEST_MODE` is on, real merchant contacts are never
  created in Resend. Events fire against `EDGE_MAIL_TEST_RECIPIENT`, and a campaign
  segment contains only that address. Test mode is **on unless the env var is literally `off`**,
  so a misconfigured deploy fails safe.
- Topics: `product_updates → edge_product_updates`, `marketing → edge_marketing`,
  `education → edge_education`.
- Contact properties (only what automation conditions branch on): `first_name`,
  `shop_domain`, `<slug>_status`, `<slug>_plan`, `edge_app_count`.

## Campaign send (the safety rail)

The `campaigns.send` admin mutation:
1. **Atomic claim:** `UPDATE … SET status='sending' WHERE id=? AND status='draft' AND test_sent_at >= updated_at`.
   A double-click, or a send without a test after the last edit, claims nothing.
2. Compute recipients in SQL: audience filter ∧ category opt-in ∧ `suppressed_at IS NULL` ∧ distinct contact.
3. **The client must echo the count it showed** in the confirm modal. If the audience moved, refuse and re-confirm.
4. Insert `mail_campaign_recipients` (the audit trail), then create the Resend segment and broadcast.
   Persist `resend_broadcast_id` *before* sending, so a retry reuses it and never creates a second broadcast.
5. Send now, or pass `scheduledAt`. Recipients are snapshotted at confirm time, not at delivery time.

## Phases

Each phase ends with `check-types` + `ultracite check` + its tests, then a small conventional commit.

### Phase 0: Resend spike: findings
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

### Phase 1: Scaffold
- `apps/email`: Next 16, React 19, Tailwind 4, `@edgecoms/ui/globals.css`, React Compiler, typed routes, port 3002.
- Hono catch-all; Better Auth at `/api/auth/*` (sign-up disabled); admin-only layout (redirect otherwise).
- tRPC mounted; `PortalShell` lifted to `@edgecoms/ui`; nav: Dashboard, Campaigns, Contacts, Apps, Templates, Automations, Settings.
- `packages/env/src/mail.ts`; turbo env lists; `vercel.json`; Vercel project on `email.edgecoms.app` with `turbo-ignore`.
- **Tests:** unauthenticated and partner sessions are refused on every tRPC procedure; admin allowed.

### Phase 2: Schema + event ingest
- `mail.ts` schema + migration; seed `mail_app_settings` for the 6 apps.
- `/api/v1/events` as specified above (Resend sync stubbed behind the adapter).
- **Tests:** per-app HMAC (another app's secret rejected, unknown app 401, stale timestamp 401, unset secret 401);
  duplicate `eventId` is a no-op; out-of-order `occurredAt` does not regress status; lifecycle forwarding lands in
  `merchant_events` exactly once; bad shop domain 400.

### Phase 3: Resend adapter + webhooks
- Real `resend.ts`; contact/property/event sync; unsynced-duplicate retry path.
- `/api/webhooks/resend`: signature verified → `mail_email_events`; `bounced`/`complained` set suppression;
  `contact.updated` writes topic opt-outs back to the DB (DB only, never calls Resend back, so no loop).
- **Tests:** test mode rewrites every outbound address; bad webhook signature 401; webhook redelivery is a no-op;
  a bounce suppresses the contact.

### Phase 4: Templates
- Templates in `apps/email/src/emails/` as `EmailContent` data rendered by `@edgecoms/mail/render` with the
  app's brand (name, accent, support URL, preferences link): welcome, setup-reminder, activation,
  announcement, marketing, uninstall, review-request.
- `/templates` gallery renders each template per app.
- `bun run email:push-templates` renders with Resend variable placeholders and upserts Resend Templates.

### Phase 5: Admin UI
- Dashboard (sent/delivered/open/click/bounce/unsubscribe + per-app table, from `mail_email_events`),
  Contacts (search, profile with installs, preferences, timeline from `mail_events` + `mail_email_events`),
  Apps (edit `mail_app_settings`, contact count), Automations (read-only list: name, trigger, link to Resend),
  Settings (test mode state, last webhook received).
- Server Components for reads, tRPC for mutations.

### Phase 6: Campaigns
- Composer with structured fields and a live preview beside the form (the server renders the same layout the send uses).
- Audience filter (zod): app, install status, plan in [...], NOT installed [apps], uninstalled within N days,
  active within N days. Live recipient count.
- Send test → confirm modal (name, recipients, category, "cannot be undone") → send / schedule.
- **Tests:** unsubscribed, suppressed and wrong-category contacts are excluded; multi-store owner counted once;
  send without test refused; edit after test refused; double send creates one broadcast; count mismatch refused.

### Phase 7: Automations (config in Resend, not code)
- Build the 5 in the Resend dashboard: Welcome (`app.installed`), Setup reminder (wait 24h for
  `setup.completed`), Activation (`app.activated`), Uninstall (`app.uninstalled`), Review request
  (`milestone.first_value`). Record each one's trigger and template in the Automations page's static list.

### Phase 8: Preferences
- `/preferences/[token]`: token = `contactId.hmac(contactId)` with `EDGE_MAIL_PREFERENCES_SECRET`,
  so there's no table and old email links keep working. Saving updates the DB and Resend topics.
- **Tests:** tampered token 404; a token for contact A can't read or change contact B.

### Phase 9: First app (Edge Cart)
- Vendor the client file into Edge Cart, set its secret, run the brief's §43 checklist with test mode **on**,
  then flip test mode off. Connect the other five only after that passes.

## Environment (`apps/email` Vercel project)

```text
DATABASE_URL, BETTER_AUTH_SECRET
BETTER_AUTH_URL=https://email.edgecoms.app   CORS_ORIGIN=https://email.edgecoms.app
RESEND_API_KEY              full-access key, exists ONLY in this project
RESEND_WEBHOOK_SECRET
EDGE_MAIL_SECRET_EDGE_CART … one per app, ≥32 chars
EDGE_MAIL_TEST_MODE         on unless literally "off"
EDGE_MAIL_TEST_RECIPIENT
EDGE_MAIL_PREFERENCES_SECRET
```

Migrations stay owned by `apps/web`'s production build (`scripts/deploy-migrate.sh`), which is the single
migrator, so two builds never race `drizzle-kit migrate`. A mail schema change therefore ships
**migration-first**, in a commit that deploys before the code that reads it.

## Open questions

1. **Consent source.** Where does product-update / marketing / education consent come from (Shopify, an
   onboarding checkbox, an existing list)? Until this is answered every flag defaults to false, which
   means **release and marketing campaigns reach nobody**. This blocks Phase 6 being useful.
2. **Event mapping.** What do the apps currently send to `shop-events` as `subscription.activated`?
   Is it `plan.started`? This blocks the forwarding step in Phase 2.
3. **Sending domain.** Broadcasts from `updates@edgecoms.app`, or from a subdomain such as
   `updates.edgecoms.app` so marketing reputation can't hurt transactional mail from the root domain?
   The subdomain is recommended.
4. **App repos.** Are the six Shopify apps outside this monorepo? That confirms vendoring the client file vs publishing it.
