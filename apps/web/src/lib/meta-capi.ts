import { env } from "@edgecoms/env/server";
import { env as webEnv } from "@edgecoms/env/web";
import { z } from "zod";

import {
	isAcademyPath,
	isEventForPixel,
	isKnownEvent,
	PIXELS,
	type PixelKey,
} from "./meta-events";

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
 * There are two datasets (see `PIXELS` in `meta-events.ts`), each with its own
 * id and its own token. An event is sent to exactly one of them.
 *
 * NOTE: server-side only. It reads the two access tokens and must never be
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

/** One dataset, and what it takes to write to it. */
export interface CapiTarget {
	accessToken: string | undefined;
	pixelId: string | undefined;
	/** Routes events to that dataset's Test Events tab instead of live data. */
	testEventCode?: string;
}

/**
 * Where an event addressed to this pixel goes.
 *
 * Either half missing means the dataset is not configured and the server leg
 * does nothing, leaving the browser pixel to run alone.
 *
 * The test event code belongs to the site dataset: Events Manager issues one
 * per dataset, and a code sent to a dataset it was not issued for is not a
 * test event there. So Academy events never carry it.
 */
export function capiTargetFor(pixel: PixelKey): CapiTarget {
	if (pixel === "academy") {
		return {
			pixelId: webEnv.NEXT_PUBLIC_META_ACADEMY_PIXEL_ID,
			accessToken: env.META_ACADEMY_CAPI_ACCESS_TOKEN,
		};
	}

	return {
		pixelId: webEnv.NEXT_PUBLIC_META_PIXEL_ID,
		accessToken: env.META_CAPI_ACCESS_TOKEN,
		testEventCode: env.META_CAPI_TEST_EVENT_CODE,
	};
}

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
	target: CapiTarget,
	nowMs: number
): Promise<CapiResult> {
	const { accessToken, pixelId, testEventCode } = target;
	if (!(accessToken && pixelId)) {
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
		access_token: accessToken,
	});

	if (testEventCode) {
		body.set("test_event_code", testEventCode);
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

/**
 * Whether a dataset takes this event from this page.
 *
 * The two pixels are kept apart on the server as well as in the browser, so
 * that a bug in one cannot be papered over by the other:
 *
 * - **The Academy dataset hears from `/store-setup` and nowhere else.** An
 *   Academy event whose page is anything other than that is refused, however
 *   well formed.
 * - **Neither dataset is sent an event it never fires.** A checkout starts on
 *   the Store Setup page only, so one addressed to the site dataset is a
 *   mistake, not a conversion.
 */
export function pixelAcceptsEvent(event: {
	name: string;
	pixel: PixelKey;
	sourceUrl: string;
}): boolean {
	if (!isEventForPixel(event.pixel, event.name)) {
		return false;
	}
	if (event.pixel !== "academy") {
		return true;
	}

	try {
		return isAcademyPath(new URL(event.sourceUrl).pathname);
	} catch {
		return false;
	}
}

export const capiRequestBody = z
	.object({
		/**
		 * Which dataset the event is for. Absent means the site pixel, which is
		 * every event there was before the Academy pixel existed.
		 */
		pixel: z.enum(PIXELS).default("site"),
		/** Allowlisted: only the events this site actually fires. */
		name: z.string().max(60).refine(isKnownEvent, "Unknown event"),
		params: z.record(z.string().max(60), paramValue).default({}),
		/** Must match the `eventID` the browser gave `fbq`, or Meta counts two. */
		eventId: z.string().min(8).max(100),
		sourceUrl: z.string().url().max(2000),
	})
	.refine(pixelAcceptsEvent, "Event not accepted for this pixel");

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
