/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import {
	buildCapiPayload,
	capiRequestBody,
	capiTargetFor,
	clientIp,
	deriveFbc,
	isSameOrigin,
	pixelAcceptsEvent,
	sendToConversionsApi,
} from "../meta-capi";
import {
	ACADEMY_EVENTS,
	CUSTOM_EVENTS,
	isEventForPixel,
	isKnownEvent,
	STANDARD_EVENTS,
} from "../meta-events";

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
			"AddToCart",
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

	test("an event with no pixel named is for the site dataset", () => {
		const parsed = capiRequestBody.safeParse(valid);

		expect(parsed.success && parsed.data.pixel).toBe("site");
	});

	test("refuses a pixel that does not exist", () => {
		expect(
			capiRequestBody.safeParse({ ...valid, pixel: "somebody-elses" }).success
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

/**
 * The Academy dataset belongs to one page. The browser already refuses to send
 * it anything from anywhere else, and this is the same rule held a second time
 * on the server, so that a mistake in one place cannot quietly feed the Store
 * Setup campaigns traffic from the rest of the site -- or feed the site's
 * campaigns a Store Setup click.
 */
describe("the Academy dataset", () => {
	const fromStoreSetup = {
		pixel: "academy",
		name: "Lead",
		params: { content_name: "Store Setup Pro", currency: "USD", value: 497 },
		eventId: "11111111-2222-3333-4444-555555555555",
		sourceUrl: "https://edgecoms.app/store-setup",
	};

	test("accepts each of its events from /store-setup", () => {
		for (const name of ACADEMY_EVENTS) {
			expect(
				capiRequestBody.safeParse({ ...fromStoreSetup, name }).success
			).toBe(true);
		}
	});

	/**
	 * The checkout click is the one event here that carries money, so its
	 * numeric `value` has to survive the guard as a number. Meta reads a string
	 * value as no value at all.
	 */
	test("a checkout click keeps its value as a number", () => {
		const parsed = capiRequestBody.safeParse({
			...fromStoreSetup,
			name: "InitiateCheckout",
		});

		expect(parsed.success).toBe(true);
		expect(parsed.success && parsed.data.pixel).toBe("academy");
		expect(parsed.success && parsed.data.params.value).toBe(497);
		expect(parsed.success && parsed.data.params.currency).toBe("USD");
	});

	test("accepts the page however an ad link decorates it", () => {
		for (const sourceUrl of [
			"https://edgecoms.app/store-setup?fbclid=IwAR0abc123",
			"https://edgecoms.app/store-setup#options",
			"https://edgecoms.app/store-setup/",
			"https://www.edgecoms.app/store-setup?utm_source=meta&utm_campaign=oct",
		]) {
			expect(
				capiRequestBody.safeParse({ ...fromStoreSetup, sourceUrl }).success
			).toBe(true);
		}
	});

	test("refuses Academy events from every other page", () => {
		for (const sourceUrl of [
			"https://edgecoms.app/",
			"https://edgecoms.app/products",
			"https://edgecoms.app/products/edge-cart",
			"https://edgecoms.app/partners",
			// Near misses: a prefix match would let all three through.
			"https://edgecoms.app/store-setup-old",
			"https://edgecoms.app/store-setup/thanks",
			"https://edgecoms.app/blog/store-setup",
			// The path named only in the query string or the fragment.
			"https://edgecoms.app/products?next=/store-setup",
			"https://edgecoms.app/#/store-setup",
		]) {
			for (const name of ACADEMY_EVENTS) {
				expect(
					capiRequestBody.safeParse({ ...fromStoreSetup, name, sourceUrl })
						.success
				).toBe(false);
			}
		}
	});

	test("refuses events the Academy pixel never fires, even from /store-setup", () => {
		for (const name of [
			"ViewContent",
			"CompleteRegistration",
			"AppStoreClick",
			"Purchase",
		]) {
			expect(
				capiRequestBody.safeParse({ ...fromStoreSetup, name }).success
			).toBe(false);
		}
	});

	/**
	 * The other direction. A checkout only starts on the Store Setup page, so
	 * one addressed to the site dataset is a mistake, from whichever page.
	 */
	test("the site dataset refuses a Store Setup checkout", () => {
		for (const sourceUrl of [
			"https://edgecoms.app/store-setup",
			"https://edgecoms.app/",
		]) {
			expect(
				capiRequestBody.safeParse({
					...fromStoreSetup,
					pixel: "site",
					name: "InitiateCheckout",
					sourceUrl,
				}).success
			).toBe(false);
		}

		expect(isEventForPixel("site", "InitiateCheckout")).toBe(false);
		expect(isEventForPixel("academy", "InitiateCheckout")).toBe(true);
	});

	test("the site dataset still takes everything it took before", () => {
		for (const name of [...STANDARD_EVENTS, ...CUSTOM_EVENTS]) {
			if (name === "InitiateCheckout") {
				continue;
			}
			expect(isEventForPixel("site", name)).toBe(true);
			expect(
				pixelAcceptsEvent({
					pixel: "site",
					name,
					sourceUrl: "https://edgecoms.app/products/edge-cart",
				})
			).toBe(true);
		}
	});

	test("a malformed page address is refused, not an exception", () => {
		expect(
			pixelAcceptsEvent({ pixel: "academy", name: "Lead", sourceUrl: "nope" })
		).toBe(false);
	});
});

/**
 * Which dataset an event is sent to, and with which token. The ids come from
 * the `test` script.
 */
describe("capiTargetFor", () => {
	test("each pixel resolves to its own dataset id", () => {
		expect(capiTargetFor("site").pixelId).toBe("000000000000001");
		expect(capiTargetFor("academy").pixelId).toBe("000000000000002");
	});

	/**
	 * A test event code is issued per dataset. The one in the environment is the
	 * site dataset's, so it must never ride along on an Academy event.
	 */
	test("the Academy target never carries the site's test event code", () => {
		expect("testEventCode" in capiTargetFor("academy")).toBe(false);
	});

	test("with no token the server leg does nothing at all", async () => {
		const realFetch = globalThis.fetch;
		let requests = 0;
		globalThis.fetch = (() => {
			requests += 1;
			return Promise.resolve(new Response(null, { status: 200 }));
		}) as unknown as typeof fetch;

		try {
			const event = {
				name: "Lead",
				eventId: "11111111-2222-3333-4444-555555555555",
				sourceUrl: "https://edgecoms.app/store-setup",
				customData: { content_name: "Store Setup Pro" },
				userData: {},
			};

			/**
			 * The Academy dataset before its token is added: an id and nothing
			 * else. Spelled out rather than read from the environment, so a
			 * developer's local `.env` cannot change what this asserts.
			 */
			expect(
				await sendToConversionsApi(
					event,
					{ accessToken: undefined, pixelId: "000000000000002" },
					1
				)
			).toEqual({ ok: false, reason: "not_configured" });

			// And a token with no id is no better.
			expect(
				await sendToConversionsApi(
					event,
					{ accessToken: "token", pixelId: undefined },
					1
				)
			).toEqual({ ok: false, reason: "not_configured" });

			expect(requests).toBe(0);
		} finally {
			globalThis.fetch = realFetch;
		}
	});

	test("with both, the event goes to that dataset and no other", async () => {
		const realFetch = globalThis.fetch;
		const requests: { body: URLSearchParams; url: string }[] = [];
		globalThis.fetch = ((url: string, init: { body: URLSearchParams }) => {
			requests.push({ url: String(url), body: init.body });
			return Promise.resolve(new Response(null, { status: 200 }));
		}) as unknown as typeof fetch;

		try {
			const result = await sendToConversionsApi(
				{
					name: "InitiateCheckout",
					eventId: "11111111-2222-3333-4444-555555555555",
					sourceUrl: "https://edgecoms.app/store-setup",
					customData: { currency: "USD", value: 497 },
					userData: {},
				},
				{ accessToken: "academy-token", pixelId: "000000000000002" },
				1_788_000_000_000
			);

			expect(result).toEqual({ ok: true });
			expect(requests).toHaveLength(1);
			expect(requests[0]?.url.endsWith("/000000000000002/events")).toBe(true);
			expect(requests[0]?.body.get("access_token")).toBe("academy-token");
			expect(requests[0]?.body.has("test_event_code")).toBe(false);

			const [sent] = JSON.parse(requests[0]?.body.get("data") ?? "[]");
			expect(sent.event_name).toBe("InitiateCheckout");
			expect(sent.custom_data).toEqual({ currency: "USD", value: 497 });
		} finally {
			globalThis.fetch = realFetch;
		}
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
