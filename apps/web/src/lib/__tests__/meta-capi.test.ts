/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import {
	buildCapiPayload,
	capiRequestBody,
	clientIp,
	deriveFbc,
	isSameOrigin,
} from "../meta-capi";
import { CUSTOM_EVENTS, isKnownEvent, STANDARD_EVENTS } from "../meta-events";

/**
 * The Conversions API fails in the worst possible way: silently. A misspelled
 * field is not an error, it is a 200 with the value quietly ignored, and the
 * only symptom is a match-quality score nobody is watching. So the payload
 * shape is asserted field by field here rather than trusted.
 */
describe("buildCapiPayload", () => {
	const nowMs = 1_788_000_000_000;

	test("uses Meta's field names and seconds, not milliseconds", () => {
		const payload = buildCapiPayload(
			{
				name: "Lead",
				eventId: "abc-123-def-456",
				sourceUrl: "https://edgecoms.app/products/edge-cart",
				customData: { content_name: "Book a demo" },
				userData: {
					fbp: "fb.1.123.456",
					fbc: "fb.1.123.CLICKID",
					clientIpAddress: "203.0.113.9",
					clientUserAgent: "Mozilla/5.0",
				},
			},
			nowMs
		);

		expect(payload).toEqual({
			event_name: "Lead",
			event_time: 1_788_000_000,
			event_id: "abc-123-def-456",
			event_source_url: "https://edgecoms.app/products/edge-cart",
			action_source: "website",
			user_data: {
				fbp: "fb.1.123.456",
				fbc: "fb.1.123.CLICKID",
				client_ip_address: "203.0.113.9",
				client_user_agent: "Mozilla/5.0",
			},
			custom_data: { content_name: "Book a demo" },
		});
	});

	test("omits identifiers it does not have rather than sending empties", () => {
		const payload = buildCapiPayload(
			{
				name: "PageView",
				eventId: "id-00000001",
				sourceUrl: "https://edgecoms.app/",
				customData: {},
				userData: { clientUserAgent: "Mozilla/5.0" },
			},
			nowMs
		);

		expect(payload.user_data).toEqual({ client_user_agent: "Mozilla/5.0" });
	});
});

/**
 * The landing view of an ad click is the single most valuable event on the
 * site, and on a consent-gated site it is also the one page view where the
 * `_fbc` cookie cannot exist yet -- `fbevents.js` has only just been allowed to
 * load. Rebuilding the click id from the URL is what stops that event arriving
 * anonymous.
 */
describe("deriveFbc", () => {
	test("rebuilds the click id from fbclid in Meta's documented format", () => {
		expect(
			deriveFbc("https://edgecoms.app/?fbclid=IwAR0abc123", 1_788_000_000_000)
		).toBe("fb.1.1788000000000.IwAR0abc123");
	});

	test("a visit with no ad click yields nothing", () => {
		expect(deriveFbc("https://edgecoms.app/products", 1)).toBeUndefined();
		expect(deriveFbc("https://edgecoms.app/?utm_source=x", 1)).toBeUndefined();
	});

	test("a malformed URL is not an exception", () => {
		expect(deriveFbc("not a url", 1)).toBeUndefined();
	});
});

/**
 * `/api/meta/events` is a public POST endpoint. The allowlist is what stops a
 * stranger posting invented conversions into the dataset the ad spend is
 * judged against.
 */
describe("isKnownEvent", () => {
	test("accepts exactly the events the site fires", () => {
		for (const name of [...STANDARD_EVENTS, ...CUSTOM_EVENTS]) {
			expect(isKnownEvent(name)).toBe(true);
		}
	});

	test("refuses anything else, including real Meta events we never send", () => {
		for (const name of [
			"Purchase",
			"InitiateCheckout",
			"Subscribe",
			"",
			"constructor",
			"__proto__",
		]) {
			expect(isKnownEvent(name)).toBe(false);
		}
	});
});

/**
 * `/api/meta/events` answers 204 to everything, success or refusal, so from
 * outside the two are indistinguishable. That makes these guards the only
 * place the refusals are observable -- and the only place a regression in them
 * would ever be noticed.
 */
describe("the endpoint's guards", () => {
	const valid = {
		name: "Lead",
		params: { content_name: "Book a demo" },
		eventId: "11111111-2222-3333-4444-555555555555",
		sourceUrl: "https://edgecoms.app/",
	};

	test("accepts what the site actually sends", () => {
		expect(capiRequestBody.safeParse(valid).success).toBe(true);
	});

	test("refuses events the site never fires", () => {
		expect(
			capiRequestBody.safeParse({ ...valid, name: "Purchase" }).success
		).toBe(false);
	});

	test("refuses a body that would break deduplication or attribution", () => {
		// Too short to be a real event id -- would collide across visitors.
		expect(capiRequestBody.safeParse({ ...valid, eventId: "x" }).success).toBe(
			false
		);
		// No source URL means no fbclid to recover and nowhere to attribute to.
		expect(
			capiRequestBody.safeParse({ ...valid, sourceUrl: "nonsense" }).success
		).toBe(false);
	});

	test("params default to empty rather than failing a valid event", () => {
		const parsed = capiRequestBody.safeParse({
			name: "PageView",
			eventId: "11111111-2222-3333-4444-555555555555",
			sourceUrl: "https://edgecoms.app/",
		});

		expect(parsed.success).toBe(true);
		expect(parsed.success && parsed.data.params).toEqual({});
	});
});

describe("isSameOrigin", () => {
	test("accepts the site's own pages", () => {
		expect(isSameOrigin("https://edgecoms.app", "edgecoms.app")).toBe(true);
		expect(isSameOrigin("http://localhost:3001", "localhost:3001")).toBe(true);
	});

	test("refuses another site posting invented conversions", () => {
		expect(isSameOrigin("https://evil.example", "edgecoms.app")).toBe(false);
		// The lookalike: a subdomain is a different host.
		expect(isSameOrigin("https://x.edgecoms.app", "edgecoms.app")).toBe(false);
		// A different port is a different origin.
		expect(isSameOrigin("http://localhost:9999", "localhost:3001")).toBe(false);
	});

	test("refuses a request with no Origin at all -- curl, not a browser", () => {
		expect(isSameOrigin(null, "edgecoms.app")).toBe(false);
		expect(isSameOrigin("https://edgecoms.app", null)).toBe(false);
		expect(isSameOrigin("garbage", "edgecoms.app")).toBe(false);
	});
});

describe("clientIp", () => {
	test("takes the client hop, not the proxies behind it", () => {
		expect(clientIp("203.0.113.9, 70.41.3.18, 150.172.238.178", null)).toBe(
			"203.0.113.9"
		);
	});

	test("falls back to x-real-ip, then to nothing", () => {
		expect(clientIp(null, "203.0.113.9")).toBe("203.0.113.9");
		expect(clientIp("", "203.0.113.9")).toBe("203.0.113.9");
		expect(clientIp(null, null)).toBeUndefined();
	});
});
