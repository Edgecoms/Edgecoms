# Hand-off: connect Edge Currency to Edge Mail

Paste this whole file into Claude Code (or hand it to whoever works on this repo), from the root of the **Edge Currency** Shopify app.

---

You are working in the **Edge Currency** Shopify app. Connect it to **Edge Mail**, the internal email platform for the Edge apps at `https://email.edgecoms.app`. The app sends Edge Mail a signed event when something happens to a store; Edge Mail turns those events into the app's lifecycle emails (welcome, setup reminder, "you're live", uninstall feedback, review request) and keeps the partner platform's shop lifecycle in step.

Read the codebase first: find how the app handles OAuth / `afterAuth`, the `app/uninstalled` webhook, billing (`app_subscriptions/update`), where settings are saved, and whether it already sends lifecycle emails or calls the partner platform. Then make the changes below. If something here does not fit how this app works, stop and ask rather than guessing.

## 1. Add the client

Create `app/lib/edge-mail.server.ts` (or the equivalent server-only location in this app) with **exactly** this content. It has no dependencies beyond Node's `crypto`. Do not edit it; its source of truth is `apps/email/clients/edge-mail-client.ts` in the Edgecoms repo.

```ts
/**
 * EDGE MAIL CLIENT. Copy this ONE file into an Edge Shopify app; it has no
 * dependencies beyond Node's own crypto.
 *
 *   const edgeMail = new EdgeMail({
 *     appId: process.env.EDGE_MAIL_APP_ID,      // the app's slug, e.g. "edge-cart"
 *     secret: process.env.EDGE_MAIL_SECRET,     // that app's secret, 32+ chars
 *     endpoint: process.env.EDGE_MAIL_URL,      // https://email.edgecoms.app
 *   });
 *
 *   await edgeMail.track({
 *     event: "app.installed",
 *     eventId: `installed:${shop.id}:${webhookId}`,   // STABLE across retries
 *     store: { domain: shop.myshopifyDomain, name: shop.name },
 *     contact: { email: shop.email, firstName: owner.firstName },
 *     properties: { plan: "free" },
 *   });
 *
 * `eventId` is the dedup key. Derive it from something that repeats when the
 * same thing happens again (a Shopify webhook id), so a redelivered webhook is
 * a no-op in Edge Mail instead of a second welcome email.
 *
 * `track` never throws. A 502 means Edge Mail recorded the event but could not
 * reach Resend yet; it is retried here, and it is safe to retry later with the
 * same `eventId`.
 */
import { createHmac, randomUUID } from "node:crypto";

export type EdgeMailEvent =
	| "app.installed"
	| "app.uninstalled"
	| "app.activated"
	| "app.deactivated"
	| "setup.completed"
	| "plan.started"
	| "plan.changed"
	| "plan.cancelled"
	| "trial.started"
	| "trial.ending"
	| "milestone.first_value"
	| "feature.used";

export interface TrackInput {
	contact?: { email: string; firstName?: string; lastName?: string };
	event: EdgeMailEvent;
	/** Stable per real-world occurrence. Defaults to a random id: no dedup. */
	eventId?: string;
	occurredAt?: Date;
	properties?: Record<string, string | number | boolean | null>;
	store: {
		country?: string;
		currency?: string;
		domain: string;
		name?: string;
		timezone?: string;
	};
}

export type TrackResult =
	| { ok: true; status: "recorded" | "duplicate" }
	| { ok: false; httpStatus: number | null; error: string };

/** The one shape of fetch this needs, so any runtime's fetch fits. */
export type Fetcher = (url: string, init: RequestInit) => Promise<Response>;

export interface EdgeMailConfig {
	appId: string;
	endpoint: string;
	/** For tests. Defaults to the global fetch. */
	fetch?: Fetcher;
	/** Attempts for a network error, 429 or 5xx. Default 3. */
	maxAttempts?: number;
	secret: string;
}

const RETRYABLE = (status: number) => status === 429 || status >= 500;
const BASE_DELAY_MS = 500;

export class EdgeMail {
	readonly #config: Required<EdgeMailConfig>;

	constructor(config: EdgeMailConfig) {
		this.#config = {
			...config,
			// Wrapped, so the global is always called with its own receiver.
			fetch: config.fetch ?? ((url, init) => fetch(url, init)),
			maxAttempts: config.maxAttempts ?? 3,
		};
	}

	async track(input: TrackInput): Promise<TrackResult> {
		const body = JSON.stringify({
			contact: input.contact ?? null,
			event: input.event,
			eventId: input.eventId ?? randomUUID(),
			occurredAt: (input.occurredAt ?? new Date()).toISOString(),
			properties: input.properties ?? {},
			store: input.store,
		});
		const url = new URL("/api/v1/events", this.#config.endpoint).toString();

		let last: TrackResult = { error: "not sent", httpStatus: null, ok: false };
		for (let attempt = 0; attempt < this.#config.maxAttempts; attempt += 1) {
			if (attempt > 0) {
				await new Promise((resolve) =>
					setTimeout(resolve, BASE_DELAY_MS * 2 ** (attempt - 1))
				);
			}
			// Signed per attempt: the timestamp is part of the signature and
			// Edge Mail refuses one more than five minutes old.
			const timestamp = String(Math.floor(Date.now() / 1000));
			const signature = createHmac("sha256", this.#config.secret)
				.update(`${timestamp}.${body}`)
				.digest("hex");
			try {
				const response = await this.#config.fetch(url, {
					body,
					headers: {
						"content-type": "application/json",
						"x-edge-app-id": this.#config.appId,
						"x-edge-signature": signature,
						"x-edge-timestamp": timestamp,
					},
					method: "POST",
				});
				const json = (await response.json().catch(() => ({}))) as {
					error?: string;
					status?: "recorded" | "duplicate";
				};
				if (response.ok) {
					return { ok: true, status: json.status ?? "recorded" };
				}
				last = {
					error: json.error ?? response.statusText,
					httpStatus: response.status,
					ok: false,
				};
				if (!RETRYABLE(response.status)) {
					return last;
				}
			} catch (error) {
				last = { error: String(error), httpStatus: null, ok: false };
			}
		}
		return last;
	}
}
```

Export one shared instance from the same place the app keeps its other server singletons:

```ts
export const edgeMail = new EdgeMail({
  appId: process.env.EDGE_MAIL_APP_ID ?? "edge-currency",
  endpoint: process.env.EDGE_MAIL_URL ?? "https://email.edgecoms.app",
  secret: process.env.EDGE_MAIL_SECRET ?? "",
});
```

If `EDGE_MAIL_SECRET` is empty, skip every call and log one warning at startup. Never send unsigned.

## 2. Environment variables

Add to `.env.example` (no values) and to the app's host (Railway) for **production and any staging**:

| Variable | Value |
| --- | --- |
| `EDGE_MAIL_APP_ID` | `edge-currency` |
| `EDGE_MAIL_URL` | `https://email.edgecoms.app` |
| `EDGE_MAIL_SECRET` | The value of `EDGE_MAIL_SECRET_EDGE_CURRENCY` in the Edge Mail Vercel project. Ask the Edge team for it. **Never commit it.** |

## 3. The events to send

Every call is `await edgeMail.track({ ... })` with:

- `event`: one of the names below.
- `eventId`: **stable for one real occurrence**. It is the dedup key: the same `eventId` twice is a no-op in Edge Mail, so a Shopify webhook retry must produce the same id, and a genuinely new occurrence (a reinstall months later) must produce a new one. Max 128 characters.
- `occurredAt`: when it actually happened (the webhook's own timestamp where there is one), not when you got round to sending. Edge Mail uses it to ignore late, out-of-order deliveries.
- `store`: `{ domain: "<shop>.myshopify.com", name, currency?, country?, timezone? }`.
- `contact`: the store owner, `{ email, firstName? }`. Without it the event is recorded but no email can be sent.
- `properties`: flat string/number/boolean values, at most 30. Always include `plan` (the current plan handle, or `"free"`).

| Event | When to send it for Edge Currency | `eventId` |
| --- | --- | --- |
| `app.installed` | A shop finishes OAuth and did **not** already have an active install (a first install, or a reinstall after an uninstall). NOT on every re-auth or scope update. | `installed:<shop>:<install id or install timestamp ms from your DB>` |
| `setup.completed` | The merchant saves their currency settings for the first time (markets, rounding or switcher placement). Once per install. | `setup_completed:<shop>:<install id>` |
| `app.activated` | The currency switcher or automatic currency detection is live on the storefront, the **first** time in this install. Not again if the merchant switches it off and on. | `activated:<shop>:<install id>` |
| `milestone.first_value` | The first order placed in a currency other than the store's default currency after install. **Once per shop, ever.** | `first_value:<shop>` |
| `plan.started` | An `app_subscriptions/update` webhook with status `ACTIVE` when the shop had **no** active paid plan before. `properties.plan` = the plan handle. | `plan:<X-Shopify-Webhook-Id>` |
| `plan.changed` | `ACTIVE` for a **different** paid plan than the shop had. `properties.plan` = the new handle. | `plan:<X-Shopify-Webhook-Id>` |
| `plan.cancelled` | The shop's active subscription becomes `CANCELLED`, `DECLINED`, `EXPIRED` or `FROZEN` and it is back on the free plan. | `plan:<X-Shopify-Webhook-Id>` |
| `app.uninstalled` | The `app/uninstalled` webhook. | `uninstalled:<X-Shopify-Webhook-Id>` |

What each one sends (Edge Mail owns the copy; you only send the event):

- `app.installed` → **Welcome**, and starts a 24-hour wait: if `setup.completed` has not arrived by then, a **Setup reminder** goes out. So send `setup.completed` as soon as it is true.
- `app.activated` → **"Edge Currency is live on your store"**.
- `milestone.first_value` → **Review request**, which links to the App Store reviews page. This is why it must fire once per shop and only on a real result.
- `app.uninstalled` → **Uninstall feedback**.
- `plan.*` send no email today; they keep the store's plan and status right, and `plan.started`, `plan.changed` and `app.uninstalled` also feed the partner platform.

`app.deactivated`, `trial.started`, `trial.ending` and `feature.used` exist too. Skip them for now.

## 4. Getting the contact

At install, read the owner with the Admin GraphQL API and **store it on the app's shop record**, because after `app/uninstalled` the access token is gone and you still need the address for the uninstall email:

```graphql
{ shop { name email shopOwnerName myshopifyDomain currencyCode ianaTimezone billingAddress { countryCodeV2 } } }
```

`contact.email` is `shop.email` (the owner's address, not `contactEmail`). `firstName` is the first word of `shopOwnerName`; leave it out if empty, and the email says "Hi there".

## 5. The partner platform

If this app already calls `POST https://edgecoms.app/api/v1/shop-events` (signed with `EDGE_PARTNERS_SECRET`), **stop sending** `subscription.activated`, `plan.changed` and `uninstalled` there once the Edge Mail events are live. Edge Mail now forwards `plan.started`, `plan.changed` and `app.uninstalled` to the partner platform itself, and sending both would record every one twice. Leave every other partner call exactly as it is: `/api/v1/codes/validate`, `/api/v1/attributions`, `/api/v1/attributions/resolve`.

## 6. Rules

- **Never break the app for an email.** `track` never throws and retries network errors, 429 and 5xx itself. Do not await it on a path Shopify is timing (webhooks must answer within 5 seconds): respond first, or fire it without awaiting. Log `result.ok === false` with the event name and shop domain only, never the email address.
- **Webhooks retry.** Take `eventId` from `X-Shopify-Webhook-Id` so a redelivery is a duplicate, not a second email.
- If the app already sends any of these emails itself (a welcome, an uninstall survey, a review ask), **do not delete it**. List it in your report so the Edge team can decide, or merchants get two.
- Subscribe to `app_subscriptions/update` in `shopify.app.toml` if the app does not already.
- TypeScript strict, no `any`. Add one small test for the plan-transition logic (none → paid = `plan.started`, paid → other paid = `plan.changed`, active → cancelled = `plan.cancelled`, same plan again = nothing).

## 7. Check it

Edge Mail is in **test mode**: every email goes to the Edge team's test inbox, never to the dev store's owner, so testing on a dev store is safe.

1. Install on a dev store: the log shows `{ ok: true, status: "recorded" }` for `app.installed`, and the team's inbox gets the Edge Currency welcome.
2. Complete the setup step: `setup.completed` is recorded, and no setup reminder arrives 24 hours later.
3. Make it live on the storefront: the "Edge Currency is live" email arrives.
4. Uninstall: `app.uninstalled` is recorded and the uninstall email arrives.
5. Reinstall: a new `app.installed` with a **new** `eventId` (so a new welcome), and replaying any webhook gives `status: "duplicate"`.

## 8. Report back

Reply with: the files you changed; the exact moments you chose for `setup.completed`, `app.activated` and `milestone.first_value` and why; whether the app called `/api/v1/shop-events` before and what you removed; any lifecycle emails the app already sends; and anything above that did not fit this app.
