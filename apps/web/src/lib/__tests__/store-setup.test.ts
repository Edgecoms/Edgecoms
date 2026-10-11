/// <reference types="bun" />
import { describe, expect, test } from "bun:test";

import {
	formatWhatsappNumber,
	readStoreSetupClick,
	resolveStoreSetupLinks,
	STORE_SETUP_CLICK_ATTRIBUTE,
	STORE_SETUP_CLICKS,
	STORE_SETUP_PLANS,
	storeSetupClickProps,
	WHATSAPP_MESSAGE,
} from "../store-setup";

/**
 * `/store-setup` is where ad traffic lands to pay. The page has exactly one
 * rule about its buttons: a link that is not configured is drawn disabled,
 * never as a control that looks live and goes nowhere. That rule rests on this
 * function returning `undefined` for anything absent, so that is what is
 * asserted here.
 */
describe("resolveStoreSetupLinks", () => {
	test("passes the two payment links through untouched", () => {
		const links = resolveStoreSetupLinks({
			proPay: "https://pay.example/pro",
			basicPay: "https://pay.example/basic",
		});

		expect(links.proPay).toBe("https://pay.example/pro");
		expect(links.basicPay).toBe("https://pay.example/basic");
	});

	test("builds the WhatsApp link with the opening message filled in", () => {
		const links = resolveStoreSetupLinks({ whatsapp: "919800000000" });

		expect(links.whatsapp).toBe(
			"https://wa.me/919800000000?text=Hi%2C%20I'd%20like%20to%20know%20more%20about%20Store%20Setup."
		);
		expect(links.whatsappNumber).toBe("919800000000");
	});

	test("the opening message survives the round trip through the URL", () => {
		const { whatsapp } = resolveStoreSetupLinks({ whatsapp: "919800000000" });

		expect(new URL(whatsapp ?? "").searchParams.get("text")).toBe(
			WHATSAPP_MESSAGE
		);
		expect(WHATSAPP_MESSAGE).toBe(
			"Hi, I'd like to know more about Store Setup."
		);
	});

	/**
	 * The env schema already insists on bare digits. This is for the path where
	 * validation is skipped: a number typed the way people write them must not
	 * produce a wa.me link WhatsApp cannot open.
	 */
	test("a number written with a plus and spaces is reduced to digits", () => {
		const links = resolveStoreSetupLinks({ whatsapp: "+91 98000-00000" });

		expect(links.whatsappNumber).toBe("919800000000");
		expect(links.whatsapp?.startsWith("https://wa.me/919800000000?")).toBe(
			true
		);
	});

	test("anything not configured is undefined, which the page draws disabled", () => {
		expect(resolveStoreSetupLinks({})).toEqual({
			proPay: undefined,
			basicPay: undefined,
			whatsapp: undefined,
			whatsappNumber: undefined,
		});
	});

	test("an empty or digitless setting counts as not configured", () => {
		const links = resolveStoreSetupLinks({
			proPay: "",
			basicPay: "",
			whatsapp: "not a number",
		});

		expect(links.proPay).toBeUndefined();
		expect(links.basicPay).toBeUndefined();
		expect(links.whatsapp).toBeUndefined();
		expect(links.whatsappNumber).toBeUndefined();
	});

	test("one missing link does not switch the others off", () => {
		const links = resolveStoreSetupLinks({
			proPay: "https://pay.example/pro",
		});

		expect(links.proPay).toBeDefined();
		expect(links.basicPay).toBeUndefined();
		expect(links.whatsapp).toBeUndefined();
	});
});

/**
 * A Store Setup button is known to the pixel by one attribute and nothing
 * else. The page writes it and the click listener reads it, so the two halves
 * are tested against each other: whatever one produces, the other must
 * understand.
 */
describe("the mark a Store Setup button carries", () => {
	/** An element as the reader sees it: something with attributes. */
	const elementWith = (attributes: Record<string, string>) => ({
		getAttribute: (name: string) => attributes[name] ?? null,
	});

	test("what the page writes is what the pixel reads back", () => {
		for (const click of STORE_SETUP_CLICKS) {
			expect(
				readStoreSetupClick(elementWith(storeSetupClickProps(click)))
			).toBe(click);
		}
	});

	test("a link with no mark is not a Store Setup button", () => {
		expect(readStoreSetupClick(elementWith({}))).toBeNull();
		expect(
			readStoreSetupClick(elementWith({ href: "https://pay.example/pro" }))
		).toBeNull();
	});

	/**
	 * A typo in the markup must report nothing. Reporting the wrong plan would
	 * put the wrong price in the revenue column, which is worse than a gap.
	 */
	test("an unknown value is not a Store Setup button either", () => {
		for (const value of ["", "Pro", "premium", "pro ", "true"]) {
			expect(
				readStoreSetupClick(
					elementWith({ [STORE_SETUP_CLICK_ATTRIBUTE]: value })
				)
			).toBeNull();
		}
	});
});

describe("formatWhatsappNumber", () => {
	test("an Indian mobile number is grouped the way it is written", () => {
		expect(formatWhatsappNumber("919263231901")).toBe("+91 92632 31901");
		expect(formatWhatsappNumber("919800000000")).toBe("+91 98000 00000");
	});

	/**
	 * A grouping guessed for a country it does not fit reads as a wrong number,
	 * so anything else is left as plain digits.
	 */
	test("any other number is printed plainly rather than grouped by guesswork", () => {
		expect(formatWhatsappNumber("14155550123")).toBe("+14155550123");
		expect(formatWhatsappNumber("447700900123")).toBe("+447700900123");
		// Starts with 91 but is not ten digits long after it.
		expect(formatWhatsappNumber("9198000000")).toBe("+9198000000");
	});
});

describe("STORE_SETUP_PLANS", () => {
	test("Pro is $497 and Basic is $297", () => {
		expect(STORE_SETUP_PLANS.pro.priceUsd).toBe(497);
		expect(STORE_SETUP_PLANS.basic.priceUsd).toBe(297);
	});
});
