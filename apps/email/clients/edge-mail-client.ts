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
