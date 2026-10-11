/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import { BOOKING_URL } from "../booking";
import {
	type ClickedLink,
	eventForOutboundHref,
	eventsForOutboundClick,
	isTrackedPath,
	productSlugFromPath,
	storeSetupEventsForClick,
} from "../meta-pixel";
import { EDGE_PRODUCTS } from "../products";
import { STORE_SETUP_CLICKS, STORE_SETUP_PLANS } from "../store-setup";

/**
 * These tests exist because the pixel fails *silently*. If the demo link moves
 * to a different scheduler, or an app page's store URL changes shape, nothing
 * breaks and no error is logged -- the `Lead` event simply stops arriving and
 * the campaign optimising for it quietly starves. So the assertions below feed
 * the real URLs the site ships, not fixtures: change the source of truth
 * without teaching the pixel about it and this suite goes red.
 */
describe("eventForOutboundHref", () => {
	test("the real booking URL maps to Lead", () => {
		expect(eventForOutboundHref(BOOKING_URL)).toEqual({
			name: "Lead",
			params: { content_name: "Book a demo" },
			pixel: "site",
			standard: true,
		});
	});

	test("every shipped App Store URL maps to an install click", () => {
		let checked = 0;

		for (const product of EDGE_PRODUCTS) {
			const url = product.appStoreUrl;
			if (!url) {
				continue;
			}

			const event = eventForOutboundHref(url);
			expect(event?.name).toBe("AppStoreClick");
			expect(event?.pixel).toBe("site");
			expect(event?.standard).toBe(false);
			expect(typeof event?.params.app).toBe("string");
			checked += 1;
		}

		expect(checked).toBeGreaterThan(0);
	});

	test("a blog CTA's tagged store URL still maps", () => {
		const event = eventForOutboundHref(
			"https://apps.shopify.com/edgecart?utm_source=organic&utm_medium=blog"
		);

		expect(event?.name).toBe("AppStoreClick");
		expect(event?.params.app).toBe("edgecart");
	});

	test("mailto maps to Contact and carries Edge's own inbox", () => {
		expect(eventForOutboundHref("mailto:sales@edgecoms.com")).toEqual({
			name: "Contact",
			params: { contact_address: "sales@edgecoms.com" },
			pixel: "site",
			standard: true,
		});
	});

	test("ordinary internal links report nothing", () => {
		expect(eventForOutboundHref("/products")).toBeNull();
		expect(eventForOutboundHref("https://edgecoms.app/about")).toBeNull();
		expect(eventForOutboundHref("#pricing")).toBeNull();
	});
});

/**
 * The Store Setup page reports to a different pixel from the rest of the site.
 * Two promises are tested here, and both fail silently if broken:
 *
 * - **The site pixel never gets a Store Setup click.** Its `Lead` means "Get a
 *   demo" and the Edge apps campaigns optimise on it. One Store Setup click
 *   counted there and those campaigns start chasing the wrong people.
 * - **The Academy pixel hears from `/store-setup` and nowhere else.**
 *
 * A Store Setup button is recognised by the mark it carries, never by the
 * address it leads to. So the links in these tests are deliberately from no
 * real payment provider: if any of this depended on the address, it would fail.
 */
describe("clicks on the Store Setup page", () => {
	const PAGE = "/store-setup";

	const pro: ClickedLink = {
		href: "https://pay.example/checkout/pro",
		storeSetupClick: "pro",
	};
	const basic: ClickedLink = {
		href: "https://pay.example/checkout/basic",
		storeSetupClick: "basic",
	};
	const whatsapp: ClickedLink = {
		href: "https://wa.me/919800000000?text=Hi",
		storeSetupClick: "whatsapp",
	};
	const buttons = [pro, basic, whatsapp];

	test("Get Pro is a checkout and a lead at the Pro price, for the Academy pixel", () => {
		const params = {
			content_name: "Store Setup Pro",
			currency: "USD",
			value: 497,
		};

		expect(eventsForOutboundClick(pro, PAGE)).toEqual([
			{ name: "InitiateCheckout", params, pixel: "academy", standard: true },
			{ name: "Lead", params, pixel: "academy", standard: true },
		]);
	});

	test("Get Basic is a checkout and a lead at the Basic price, for the Academy pixel", () => {
		const params = {
			content_name: "Store Setup Basic",
			currency: "USD",
			value: 297,
		};

		expect(eventsForOutboundClick(basic, PAGE)).toEqual([
			{ name: "InitiateCheckout", params, pixel: "academy", standard: true },
			{ name: "Lead", params, pixel: "academy", standard: true },
		]);
	});

	/**
	 * The number Meta is told and the number printed on the button are the same
	 * constant. Asserted, because the day they differ every ROAS figure for this
	 * page is quietly wrong and nothing else would notice.
	 */
	test("the value reported is the price the page charges", () => {
		for (const event of storeSetupEventsForClick("pro")) {
			expect(event.params.value).toBe(STORE_SETUP_PLANS.pro.priceUsd);
		}
		for (const event of storeSetupEventsForClick("basic")) {
			expect(event.params.value).toBe(STORE_SETUP_PLANS.basic.priceUsd);
		}
	});

	test("WhatsApp is a contact and a lead, with no value, for the Academy pixel", () => {
		const params = { content_name: "Store Setup WhatsApp" };

		expect(eventsForOutboundClick(whatsapp, PAGE)).toEqual([
			{ name: "Contact", params, pixel: "academy", standard: true },
			{ name: "Lead", params, pixel: "academy", standard: true },
		]);
	});

	/**
	 * Changing payment provider is a change of link and nothing else. The same
	 * button reports the same events whatever address is behind it.
	 */
	test("the events do not depend on where the button leads", () => {
		const expected = storeSetupEventsForClick("pro");

		for (const href of [
			"https://www.paypal.com/ncp/payment/ABCDEFGHIJKLM",
			"https://wise.com/pay/r/abcdefghijklmno",
			"https://buy.stripe.com/test_abcdefg",
			"https://edgecoms.app/checkout/pro",
		]) {
			expect(
				eventsForOutboundClick({ href, storeSetupClick: "pro" }, PAGE)
			).toEqual(expected);
		}
	});

	/**
	 * And the other half of the same rule: an address is never enough. A link
	 * to a payment page that is not marked as a Store Setup button says nothing.
	 */
	test("a payment or WhatsApp link without the mark reports nothing", () => {
		for (const href of [
			pro.href,
			"https://www.paypal.com/ncp/payment/ABCDEFGHIJKLM",
			"https://wise.com/pay/r/abcdefghijklmno",
			"https://wa.me/919800000000",
		]) {
			expect(
				eventsForOutboundClick({ href, storeSetupClick: null }, PAGE)
			).toEqual([]);
		}
	});

	test("the site pixel never gets a Store Setup click", () => {
		for (const button of buttons) {
			const events = eventsForOutboundClick(button, PAGE);

			expect(events.length).toBeGreaterThan(0);
			expect(events.filter((event) => event.pixel === "site")).toEqual([]);
			// And the site pixel's own mapping has nothing to say about it.
			expect(eventForOutboundHref(button.href)).toBeNull();
		}

		// Every kind of Store Setup click there is, checked the same way.
		for (const click of STORE_SETUP_CLICKS) {
			expect(
				storeSetupEventsForClick(click).every(
					(event) => event.pixel === "academy"
				)
			).toBe(true);
		}
	});

	/**
	 * The site mapping matches `calendly.com` anywhere in an href. A payment
	 * link carrying that text must still be a Store Setup click and nothing
	 * else: on this page the button's mark answers first and the site mapping
	 * is never asked.
	 */
	test("not even when the payment link looks like one the site pixel knows", () => {
		const lookalike: ClickedLink = {
			href: "https://pay.example/checkout/pro?ref=calendly.com",
			storeSetupClick: "pro",
		};

		// The site mapping, asked directly, would have called this a demo lead.
		expect(eventForOutboundHref(lookalike.href)?.pixel).toBe("site");

		const events = eventsForOutboundClick(lookalike, PAGE);
		expect(events.map((event) => event.name)).toEqual([
			"InitiateCheckout",
			"Lead",
		]);
		expect(events.every((event) => event.pixel === "academy")).toBe(true);
	});

	test("the Academy pixel hears nothing from any other page", () => {
		const elsewhere = [
			"/",
			"/products",
			"/products/edge-cart",
			"/partners",
			"/blog/store-setup",
			"/store-setup-old",
			"/store-setup/thanks",
		];
		const demo: ClickedLink = { href: BOOKING_URL, storeSetupClick: null };

		for (const path of elsewhere) {
			for (const link of [...buttons, demo]) {
				const events = eventsForOutboundClick(link, path);
				expect(events.filter((event) => event.pixel === "academy")).toEqual([]);
			}
			// A marked button anywhere else means nothing to either pixel.
			for (const button of buttons) {
				expect(eventsForOutboundClick(button, path)).toEqual([]);
			}
		}
	});

	test("a trailing slash is still the Store Setup page", () => {
		expect(
			eventsForOutboundClick(pro, "/store-setup/").map((event) => event.name)
		).toEqual(["InitiateCheckout", "Lead"]);
	});

	test("the site's own links keep reporting to the site pixel from this page", () => {
		expect(
			eventsForOutboundClick({ href: BOOKING_URL, storeSetupClick: null }, PAGE)
		).toEqual([
			{
				name: "Lead",
				params: { content_name: "Book a demo" },
				pixel: "site",
				standard: true,
			},
		]);
	});

	test("in-page links and unknown links report nothing", () => {
		for (const href of ["#options", "", "https://example.com/"]) {
			expect(
				eventsForOutboundClick({ href, storeSetupClick: null }, PAGE)
			).toEqual([]);
		}
	});
});

describe("isTrackedPath", () => {
	test("the marketing site is tracked", () => {
		for (const path of [
			"/",
			"/products",
			"/products/edge-cart",
			"/blog/some-post",
			"/login",
			"/register",
		]) {
			expect(isTrackedPath(path)).toBe(true);
		}
	});

	test("the signed-in portal and admin console are not", () => {
		for (const path of [
			"/partner",
			"/partner/earnings",
			"/partner/merchants",
			"/admin",
			"/admin/payouts",
			"/admin/commissions",
		]) {
			expect(isTrackedPath(path)).toBe(false);
		}
	});

	/**
	 * The trap: `/partners` is a public marketing page and `/partner` is the
	 * private dashboard. A naive `startsWith("/partner")` would blind the pixel
	 * to the single page the partner-recruitment ads point at.
	 */
	test("the public /partners page is not mistaken for the portal", () => {
		expect(isTrackedPath("/partners")).toBe(true);
		expect(isTrackedPath("/partners-s")).toBe(true);
	});
});

describe("productSlugFromPath", () => {
	test("an app page yields its slug", () => {
		expect(productSlugFromPath("/products/edge-cart")).toBe("edge-cart");
		expect(productSlugFromPath("/products/trackproof/")).toBe("trackproof");
	});

	test("the index and everything else yield nothing", () => {
		expect(productSlugFromPath("/products")).toBeNull();
		expect(productSlugFromPath("/")).toBeNull();
		expect(productSlugFromPath("/blog/edge-cart")).toBeNull();
	});
});
