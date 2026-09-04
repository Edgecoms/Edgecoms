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
 * imports here are dynamic. The pixel id comes from the `test` script rather
 * than from here: `meta-pixel` reads it once at module load, and a sibling test
 * file importing it first would otherwise decide the value before this file
 * ran -- making the suite pass or fail on file order.
 */
interface Calls {
	fbq: unknown[][];
	fetch: string[];
}

function installFakeBrowser(): Calls {
	const store = new Map<string, string>();
	const calls: Calls = { fbq: [], fetch: [] };

	const fakeWindow = {
		localStorage: {
			getItem: (key: string) => store.get(key) ?? null,
			setItem: (key: string, value: string) => {
				store.set(key, value);
			},
		},
		location: { href: "https://edgecoms.app/products/edge-cart" },
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
	globalThis.fetch = ((input: string) => {
		calls.fetch.push(String(input));
		return Promise.resolve(new Response(null, { status: 204 }));
	}) as unknown as typeof fetch;

	return calls;
}

const calls = installFakeBrowser();

const { setConsent, consentGranted } = await import("../consent");
const { trackStandard, trackOutbound, eventForOutboundHref } = await import(
	"../meta-pixel"
);

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

	test("a granted event carries one id across both legs", () => {
		setConsent("granted");
		calls.fbq.length = 0;
		calls.fetch.length = 0;

		const event = eventForOutboundHref(
			"https://calendly.com/anurag-edgecoms/book-a-free-call"
		);
		expect(event).not.toBeNull();
		if (event) {
			trackOutbound(event);
		}

		expect(calls.fbq).toHaveLength(1);
		const [verb, name, params, options] = calls.fbq[0] as [
			string,
			string,
			Record<string, unknown>,
			{ eventID: string },
		];

		expect(verb).toBe("track");
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

		setConsent("denied");
	});
});
