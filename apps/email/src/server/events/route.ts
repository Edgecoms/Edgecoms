import {
	SIGNATURE_HEADER,
	TIMESTAMP_HEADER,
	verifySignature,
} from "@edgecoms/api/attribution/hmac";
import type { Database } from "@edgecoms/db";
import { appSecret } from "@edgecoms/env/mail";
import { Hono } from "hono";
import { ingestEvent, type ResendSync } from "./ingest";
import { mailEventBody } from "./schema";

/**
 * POST /api/v1/events: the one endpoint every Edge app calls.
 *
 * Signed like the attribution endpoints (HMAC-SHA256 over `<timestamp>.<raw
 * body>`, `X-Edge-Signature` / `X-Edge-Timestamp`), but with a secret PER APP,
 * chosen by `X-Edge-App-ID`. The header is therefore authenticated: a caller
 * holding Edge Cart's secret can only ever speak as Edge Cart.
 *
 * Every signature problem is one 401 with one message, including an app we
 * have no secret for, so the response never reveals which apps are configured.
 */

export const APP_ID_HEADER = "x-edge-app-id";

const NO_STORE = { "Cache-Control": "no-store" };

export function eventsRoute(deps: { db: Database; sync: ResendSync }) {
	return new Hono().post("/", async (c) => {
		const appSlug = (c.req.header(APP_ID_HEADER) ?? "").trim().toLowerCase();
		const secret = appSlug ? appSecret(appSlug) : null;
		// Read as text BEFORE anything else: the MAC covers these exact bytes.
		const rawBody = await c.req.text();

		const verdict = secret
			? verifySignature({
					secret,
					rawBody,
					signature: c.req.header(SIGNATURE_HEADER) ?? null,
					timestamp: c.req.header(TIMESTAMP_HEADER) ?? null,
				})
			: { ok: false as const };
		if (!verdict.ok) {
			return c.json({ error: "Invalid signature." }, 401, NO_STORE);
		}

		let json: unknown;
		try {
			json = JSON.parse(rawBody);
		} catch {
			return c.json({ error: "Malformed JSON body." }, 400, NO_STORE);
		}
		const parsed = mailEventBody.safeParse(json);
		if (!parsed.success) {
			return c.json({ error: "Invalid request body." }, 400, NO_STORE);
		}

		const outcome = await ingestEvent(
			deps.db,
			{ appSlug, body: parsed.data },
			deps.sync
		);

		if (outcome.ok) {
			// A duplicate is 200, not an error: the right client behaviour on a
			// retry is to stop retrying.
			return c.json({ ok: true, status: outcome.status }, 200, NO_STORE);
		}
		switch (outcome.status) {
			case "invalid_shop":
				return c.json({ error: "Invalid shop domain." }, 400, NO_STORE);
			case "unknown_app":
				return c.json({ error: "Unknown app." }, 400, NO_STORE);
			default:
				// Recorded, but Resend did not take it. 502 makes the app retry,
				// and the retry finishes the sync.
				return c.json({ error: "Upstream unavailable." }, 502, NO_STORE);
		}
	});
}
