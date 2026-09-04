import { env } from "@edgecoms/env/server";
import { z } from "zod";

import { isKnownEvent } from "./meta-events";

/**
 * Meta Conversions API — the server-side half of ad attribution.
 *
 * Why this exists at all: a browser pixel is a third-party script, and iOS,
 * Safari's ITP, and ad blockers between them drop a large share of it. Those
 * visits are not lost traffic, only lost *reporting* -- the conversion still
 * happened, Meta just never heard about it, so the campaign that earned it
 * looks worse than it was and the bidding optimises against reality.
 *
 * This module reports the same event a second time, from our own server, where
 * nothing can block it. Both copies carry the same `event_id`, which is how
 * Meta knows they are one event and not two.
 *
 * NOTE: server-side only. It reads `META_CAPI_ACCESS_TOKEN` and must never be
 * imported from a client component.
 */

/** Ninety percent of match quality, without a single piece of PII. */
export interface CapiUserData {
	clientIpAddress?: string;
	clientUserAgent?: string;
	/** Click id, from the `_fbc` cookie or rebuilt from `fbclid`. */
	fbc?: string;
	/** Meta's own browser cookie. The strongest signal we can pass. */
	fbp?: string;
}

export interface CapiEvent {
	customData: Record<string, string | number | boolean>;
	eventId: string;
	name: string;
	sourceUrl: string;
	userData: CapiUserData;
}

export type CapiResult =
	| { ok: true }
	| { ok: false; reason: "not_configured" | "rejected" | "unreachable" };

const FBCLID_PARAM = "fbclid";

/**
 * Meta's documented shape for a click id when the `_fbc` cookie is missing:
 * `fb.<subdomain-index>.<timestamp-ms>.<fbclid>`.
 *
 * Worth rebuilding rather than skipping. The cookie is set by `fbevents.js`,
 * which on a consent-gated site does not exist on the very first page view --
 * and the very first page view *is* the ad click. Without this the single most
 * valuable event on the site would arrive with no click id attached.
 */
export function deriveFbc(
	sourceUrl: string,
	nowMs: number
): string | undefined {
	let fbclid: string | null = null;
	try {
		fbclid = new URL(sourceUrl).searchParams.get(FBCLID_PARAM);
	} catch {
		return;
	}

	return fbclid ? `fb.1.${nowMs}.${fbclid}` : undefined;
}

/**
 * The wire format. Split out from the send so it can be asserted in a test
 * without a network call or a token -- this payload is the whole contract with
 * Meta, and getting a field name wrong fails silently as "0 events received".
 */
export function buildCapiPayload(
	event: CapiEvent,
	nowMs: number
): Record<string, unknown> {
	const userData: Record<string, string> = {};
	if (event.userData.fbp) {
		userData.fbp = event.userData.fbp;
	}
	if (event.userData.fbc) {
		userData.fbc = event.userData.fbc;
	}
	if (event.userData.clientIpAddress) {
		userData.client_ip_address = event.userData.clientIpAddress;
	}
	if (event.userData.clientUserAgent) {
		userData.client_user_agent = event.userData.clientUserAgent;
	}

	return {
		event_name: event.name,
		// Seconds, not milliseconds. Meta rejects anything older than 7 days.
		event_time: Math.floor(nowMs / 1000),
		event_id: event.eventId,
		event_source_url: event.sourceUrl,
		action_source: "website",
		user_data: userData,
		custom_data: event.customData,
	};
}

export async function sendToConversionsApi(
	event: CapiEvent,
	pixelId: string,
	nowMs: number
): Promise<CapiResult> {
	const token = env.META_CAPI_ACCESS_TOKEN;
	if (!token) {
		return { ok: false, reason: "not_configured" };
	}

	const payload = buildCapiPayload(event, nowMs);

	/**
	 * Form-encoded, which is the shape Meta documents, and it keeps the access
	 * token in the request body rather than the URL -- a token in a query string
	 * ends up in every proxy and access log it passes through.
	 */
	const body = new URLSearchParams({
		data: JSON.stringify([payload]),
		access_token: token,
	});

	if (env.META_CAPI_TEST_EVENT_CODE) {
		body.set("test_event_code", env.META_CAPI_TEST_EVENT_CODE);
	}

	const url = `https://graph.facebook.com/${env.META_GRAPH_API_VERSION}/${pixelId}/events`;

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			body,
		});

		return response.ok ? { ok: true } : { ok: false, reason: "rejected" };
	} catch {
		return { ok: false, reason: "unreachable" };
	}
}

/**
 * What `/api/meta/events` will accept.
 *
 * The route is public and answers 204 to everything, so these guards are the
 * only thing standing between a stranger with curl and the dataset the ad
 * spend is judged against. They are here rather than in `route.ts` because a
 * Next route file may only export handlers -- and a guard nobody can unit-test
 * is a guard nobody knows is working.
 */
const paramValue = z.union([z.string().max(500), z.number(), z.boolean()]);

export const capiRequestBody = z.object({
	/** Allowlisted: only the events this site actually fires. */
	name: z.string().max(60).refine(isKnownEvent, "Unknown event"),
	params: z.record(z.string().max(60), paramValue).default({}),
	/** Must match the `eventID` the browser gave `fbq`, or Meta counts two. */
	eventId: z.string().min(8).max(100),
	sourceUrl: z.string().url().max(2000),
});

/**
 * Same-origin only. A browser always sends `Origin` on a POST, so a request
 * without one did not come from this site's pages.
 *
 * Compared against the request's own `Host` rather than a configured URL, so
 * this behaves identically on localhost, a preview deploy and production with
 * no per-environment allowlist to keep in sync.
 */
export function isSameOrigin(
	origin: string | null,
	host: string | null
): boolean {
	if (!(origin && host)) {
		return false;
	}

	try {
		return new URL(origin).host === host;
	} catch {
		return false;
	}
}

/** First hop in `x-forwarded-for` is the client; the rest are proxies. */
export function clientIp(
	forwardedFor: string | null,
	realIp: string | null
): string | undefined {
	const first = forwardedFor?.split(",")[0]?.trim();
	return first || realIp || undefined;
}
