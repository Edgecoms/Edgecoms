/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

/**
 * The guard this file exists for: **an un-consented visitor must make zero
 * contact with Meta.** Not "a smaller payload", not "PageView only" -- nothing.
 *
 * That guard is invisible when it works, which is exactly why it needs a test.
 * A refactor that reorders one early return would silently start tracking
 * people who declined, and the site would look and behave identically.
 *
 * The browser has to be faked before the module under test is imported, so the
 * imports here are dynamic. The pixel ids come from the `test` script rather
 * than from here: `meta-pixel` reads them once at module load, and a sibling
 * test file importing it first would otherwise decide the values before this
 * file ran -- making the suite pass or fail on file order.
 */
const SITE_PIXEL_ID = "000000000000001";
const ACADEMY_PIXEL_ID = "000000000000002";

interface ServerPost {
	eventId: string;
	name: string;
	params: Record<string, unknown>;
	pixel: string;
	sourceUrl: string;
}

interface Calls {
	fbq: unknown[][];
	fetch: string[];
	/** The parsed body of each server-leg request, in order. */
	posts: ServerPost[];
}

const ORIGIN = "https://edgecoms.app";

const location = {
	href: `${ORIGIN}/products/edge-cart`,
	pathname: "/products/edge-cart",
};

/** Move the fake browser to another page of the site. */
function goTo(pathname: string): void {
	location.pathname = pathname;
	location.href = `${ORIGIN}${pathname}`;
}

function installFakeBrowser(): Calls {
	const store = new Map<string, string>();
	const calls: Calls = { fbq: [], fetch: [], posts: [] };

	const fakeWindow = {
		localStorage: {
			getItem: (key: string) => store.get(key) ?? null,
			setItem: (key: string, value: string) => {
				store.set(key, value);
			},
		},
		location,
		addEventListener: () => {
			// no-op: nothing in these tests dispatches storage events
		},
		removeEventListener: () => {
			// no-op
		},
		fbq: (...args: unknown[]) => {
			calls.fbq.push(args);
		},
	};

	(globalThis as { window?: unknown }).window = fakeWindow;
	globalThis.fetch = ((input: string, init?: { body?: string }) => {
		calls.fetch.push(String(input));
		calls.posts.push(JSON.parse(init?.body ?? "{}") as ServerPost);
		return Promise.resolve(new Response(null, { status: 204 }));
	}) as unknown as typeof fetch;

	return calls;
}

const calls = installFakeBrowser();

function reset(): void {
	calls.fbq.length = 0;
	calls.fetch.length = 0;
	calls.posts.length = 0;
}

const { setConsent, consentGranted } = await import("../consent");
const {
	eventForOutboundHref,
	eventsForOutboundClick,
	trackAcademy,
	trackCustom,
	trackOutbound,
	trackStandard,
} = await import("../meta-pixel");

describe("the consent gate", () => {
	/**
	 * One test walking the three states in order, because the consent store is
	 * a module singleton and the *transitions* are the thing worth proving --
	 * particularly that granting later does not retroactively unblock, and that
	 * withdrawing takes effect immediately rather than at the next page load.
	 */
	test("nothing reaches Meta until consent is granted, and stops when it is withdrawn", () => {
		// 1. Undecided -- the state every first-time visitor starts in.
		expect(consentGranted()).toBe(false);

		trackStandard("PageView");
		trackStandard("ViewContent", { content_ids: "edge-cart" });
		trackOutbound({
			name: "Lead",
			params: { content_name: "Book a demo" },
			pixel: "site",
			standard: true,
		});

		expect(calls.fbq).toHaveLength(0);
		expect(calls.fetch).toHaveLength(0);

		// 2. Declined -- an explicit no is at least as binding as no answer.
		setConsent("denied");
		expect(consentGranted()).toBe(false);

		trackStandard("PageView");
		expect(calls.fbq).toHaveLength(0);
		expect(calls.fetch).toHaveLength(0);

		// 3. Granted -- and only now does anything move.
		setConsent("granted");
		expect(consentGranted()).toBe(true);

		trackStandard("PageView");
		expect(calls.fbq).toHaveLength(1);
		expect(calls.fetch).toHaveLength(1);

		// 4. Withdrawn -- effective on the spot, not on the next page load.
		setConsent("denied");
		trackStandard("PageView");
		expect(calls.fbq).toHaveLength(1);
		expect(calls.fetch).toHaveLength(1);
	});

	/**
	 * The Academy pixel is a second route to Meta, so it gets the same proof:
	 * being on its own page is not a substitute for a yes.
	 */
	test("the Academy pixel obeys the same gate, even on its own page", () => {
		reset();
		goTo("/store-setup");

		setConsent("denied");
		trackAcademy("PageView");
		trackOutbound({
			name: "Lead",
			params: { content_name: "Store Setup Pro" },
			pixel: "academy",
			standard: true,
		});

		expect(calls.fbq).toHaveLength(0);
		expect(calls.fetch).toHaveLength(0);

		goTo("/products/edge-cart");
	});

	test("a granted event carries one id across both legs", () => {
		setConsent("granted");
		reset();

		const event = eventForOutboundHref(
			"https://calendly.com/anurag-edgecoms/book-a-free-call"
		);
		expect(event).not.toBeNull();
		if (event) {
			trackOutbound(event);
		}

		expect(calls.fbq).toHaveLength(1);
		const [verb, pixelId, name, params, options] = calls.fbq[0] as [
			string,
			string,
			string,
			Record<string, unknown>,
			{ eventID: string },
		];

		/**
		 * `trackSingle`, addressed to the site pixel by id. A bare `track` would
		 * also reach the Academy pixel whenever that one is initialised.
		 */
		expect(verb).toBe("trackSingle");
		expect(pixelId).toBe(SITE_PIXEL_ID);
		expect(name).toBe("Lead");
		expect(params).toEqual({ content_name: "Book a demo" });
		/**
		 * The whole point of the pair. Without a shared id Meta counts the
		 * browser copy and the server copy as two separate conversions and every
		 * reported number doubles.
		 */
		expect(typeof options.eventID).toBe("string");
		expect(options.eventID.length).toBeGreaterThan(7);

		expect(calls.fetch).toEqual(["/api/meta/events"]);
		expect(calls.posts[0]?.eventId).toBe(options.eventID);
		expect(calls.posts[0]?.pixel).toBe("site");

		setConsent("denied");
	});
});

/**
 * Two pixels share one `fbevents.js`, and `fbq('track')` reaches every pixel
 * initialised on the page. These tests pin the three things that keep the two
 * datasets apart, each of which fails without a sound if it breaks:
 *
 * 1. the site pixel is only ever addressed by id, never broadcast to;
 * 2. the Academy pixel is sent nothing unless the page is `/store-setup`;
 * 3. a Store Setup click reaches the Academy pixel and never the site pixel.
 *
 * They run in order and share the module's state on purpose: the Academy pixel
 * is initialised once per page load, and "once" is part of what is asserted.
 */
describe("the two pixels", () => {
	/**
	 * The three buttons, as the click listener sees them: an address, and the
	 * mark saying which button it is. The addresses belong to no real provider
	 * on purpose, because nothing may depend on them.
	 */
	const buttons = [
		{
			link: {
				href: "https://pay.example/checkout/pro",
				storeSetupClick: "pro",
			},
			names: ["InitiateCheckout", "Lead"],
			params: { content_name: "Store Setup Pro", currency: "USD", value: 497 },
		},
		{
			link: {
				href: "https://pay.example/checkout/basic",
				storeSetupClick: "basic",
			},
			names: ["InitiateCheckout", "Lead"],
			params: {
				content_name: "Store Setup Basic",
				currency: "USD",
				value: 297,
			},
		},
		{
			link: {
				href: "https://wa.me/919800000000?text=Hi",
				storeSetupClick: "whatsapp",
			},
			names: ["Contact", "Lead"],
			params: { content_name: "Store Setup WhatsApp" },
		},
	] as const;

	const verbs = () => calls.fbq.map((call) => call[0]);
	const addressedTo = (pixelId: string) =>
		calls.fbq.filter((call) => call.includes(pixelId));

	test("the Academy pixel is sent nothing from any other page", () => {
		setConsent("granted");
		reset();

		for (const path of ["/", "/products/edge-cart", "/store-setup-old"]) {
			goTo(path);

			trackAcademy("PageView");
			// Even an event explicitly addressed to it is dropped off its page.
			trackOutbound({
				name: "Lead",
				params: { content_name: "Store Setup Pro" },
				pixel: "academy",
				standard: true,
			});
		}

		// Not initialised, not tracked, and no server copy either.
		expect(calls.fbq).toHaveLength(0);
		expect(calls.fetch).toHaveLength(0);
	});

	test("every site event is addressed to the site pixel by id", () => {
		reset();
		goTo("/products/edge-cart");

		trackStandard("PageView");
		trackStandard("ViewContent", { content_ids: "edge-cart" });
		trackCustom("AppStoreClick", { app: "edgecart" });

		expect(verbs()).toEqual([
			"trackSingle",
			"trackSingle",
			"trackSingleCustom",
		]);
		expect(addressedTo(SITE_PIXEL_ID)).toHaveLength(3);
		expect(addressedTo(ACADEMY_PIXEL_ID)).toHaveLength(0);
		expect(calls.posts.map((post) => post.pixel)).toEqual([
			"site",
			"site",
			"site",
		]);
	});

	test("on /store-setup the Academy pixel is set up once, then sent its page view", () => {
		reset();
		goTo("/store-setup");

		trackAcademy("PageView");

		/**
		 * Order matters. `autoConfig` has to be switched off before `init`, and
		 * `trackSingleOnly` can only be set on a pixel that exists. Between them
		 * they stop `fbevents.js` sending this pixel anything it was not asked
		 * to: automatic page views on navigation, and automatic button events.
		 */
		expect(calls.fbq.slice(0, 3)).toEqual([
			["set", "autoConfig", false, ACADEMY_PIXEL_ID],
			["init", ACADEMY_PIXEL_ID],
			["set", "trackSingleOnly", true, ACADEMY_PIXEL_ID],
		]);

		const [verb, pixelId, name, , options] = calls.fbq[3] as [
			string,
			string,
			string,
			unknown,
			{ eventID: string },
		];
		expect([verb, pixelId, name]).toEqual([
			"trackSingle",
			ACADEMY_PIXEL_ID,
			"PageView",
		]);
		expect(calls.fbq).toHaveLength(4);

		// The server copy: same id, the Academy dataset, this page.
		expect(calls.posts).toHaveLength(1);
		expect(calls.posts[0]).toMatchObject({
			pixel: "academy",
			name: "PageView",
			eventId: options.eventID,
			sourceUrl: `${ORIGIN}/store-setup`,
		});

		// A second event does not initialise the pixel a second time.
		reset();
		trackAcademy("PageView");
		expect(verbs()).toEqual(["trackSingle"]);
	});

	test("the site pixel's own page view on /store-setup still goes only to the site pixel", () => {
		reset();
		goTo("/store-setup");

		trackStandard("PageView");

		expect(calls.fbq).toHaveLength(1);
		expect(calls.fbq[0]?.slice(0, 3)).toEqual([
			"trackSingle",
			SITE_PIXEL_ID,
			"PageView",
		]);
		expect(calls.posts[0]?.pixel).toBe("site");
	});

	test("a Store Setup click reaches the Academy pixel and never the site pixel", () => {
		goTo("/store-setup");

		for (const button of buttons) {
			reset();

			for (const event of eventsForOutboundClick(
				button.link,
				location.pathname
			)) {
				trackOutbound(event);
			}

			// Browser leg: two events, both to the Academy pixel by id.
			expect(
				calls.fbq.map((call) => [call[0], call[1], call[2], call[3]])
			).toEqual(
				button.names.map((name) => [
					"trackSingle",
					ACADEMY_PIXEL_ID,
					name,
					button.params,
				])
			);
			expect(addressedTo(SITE_PIXEL_ID)).toHaveLength(0);

			// Server leg: the same two, the same ids, the Academy dataset.
			expect(calls.posts.map((post) => [post.pixel, post.name])).toEqual(
				button.names.map((name) => ["academy", name])
			);
			expect(calls.posts.map((post) => post.eventId)).toEqual(
				calls.fbq.map((call) => (call[4] as { eventID: string }).eventID)
			);
			// Each of the two events is its own conversion, with its own id.
			expect(new Set(calls.posts.map((post) => post.eventId)).size).toBe(2);
		}
	});

	test("the same click on another page reports to neither pixel", () => {
		reset();
		goTo("/products/edge-cart");

		for (const button of buttons) {
			for (const event of eventsForOutboundClick(
				button.link,
				location.pathname
			)) {
				trackOutbound(event);
			}
		}

		expect(calls.fbq).toHaveLength(0);
		expect(calls.fetch).toHaveLength(0);
	});

	/**
	 * The Academy pixel stays initialised after a client-side navigation away
	 * from its page. What keeps it quiet from then on is that nothing is ever
	 * broadcast: across everything this suite did, no call was a bare `track`.
	 */
	test("after leaving /store-setup the site keeps reporting, and only to the site pixel", () => {
		reset();
		goTo("/products/edge-cart");

		trackStandard("PageView");
		const demo = eventForOutboundHref(
			"https://calendly.com/anurag-edgecoms/book-a-free-call"
		);
		if (demo) {
			trackOutbound(demo);
		}

		expect(verbs()).toEqual(["trackSingle", "trackSingle"]);
		expect(addressedTo(SITE_PIXEL_ID)).toHaveLength(2);
		expect(addressedTo(ACADEMY_PIXEL_ID)).toHaveLength(0);
		expect(verbs()).not.toContain("track");
		expect(verbs()).not.toContain("trackCustom");

		setConsent("denied");
	});
});
