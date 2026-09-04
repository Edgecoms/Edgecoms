/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import { BOOKING_URL } from "../booking";
import {
	eventForOutboundHref,
	isTrackedPath,
	productSlugFromPath,
} from "../meta-pixel";
import { EDGE_PRODUCTS } from "../products";

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
			standard: true,
		});
	});

	test("ordinary internal links report nothing", () => {
		expect(eventForOutboundHref("/products")).toBeNull();
		expect(eventForOutboundHref("https://edgecoms.app/about")).toBeNull();
		expect(eventForOutboundHref("#pricing")).toBeNull();
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
