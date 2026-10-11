/**
 * Store Setup — the offer sold on `/store-setup`.
 *
 * Three things live here because two places have to agree on each of them:
 *
 * 1. **The prices.** The page prints them, and `lib/meta-pixel.ts` reports them
 *    to Meta as the value of a checkout click. One constant, so the number on
 *    the button and the number in Ads Manager cannot drift apart.
 * 2. **The links.** Where "Get Pro", "Get Basic" and "Ask on WhatsApp" lead
 *    comes from the environment, never from this file.
 * 3. **What a button is.** Each button says which one it is with a data
 *    attribute, and that attribute is all the pixel reads. The address the
 *    button leads to means nothing to the tracking, so the payment provider
 *    can change without a line of code changing with it.
 *
 * Clicks on these buttons are reported to the Edgecoms Academy pixel and to no
 * other. See `storeSetupEventsForClick` in `lib/meta-pixel.ts`.
 */

import { env } from "@edgecoms/env/web";

/**
 * Whole US dollars, because that is the unit the buyer is charged in and the
 * unit Meta's `value` expects. These are list prices for a one-off service;
 * they never enter the partner ledger, which is where minor units are the
 * rule.
 */
export const STORE_SETUP_PLANS = {
	pro: { name: "Pro", priceUsd: 497 },
	basic: { name: "Basic", priceUsd: 297 },
} as const;

export type StoreSetupPlan = keyof typeof STORE_SETUP_PLANS;

export const STORE_SETUP_CURRENCY = "USD";

/** The three things a visitor can press: pay for a plan, or ask a question. */
export const STORE_SETUP_CLICKS = ["pro", "basic", "whatsapp"] as const;

export type StoreSetupClick = (typeof STORE_SETUP_CLICKS)[number];

/** How a button on the page says which of the three it is. */
export const STORE_SETUP_CLICK_ATTRIBUTE = "data-store-setup-click";

/** The attribute, ready to spread onto a button. The page's half of the pair. */
export function storeSetupClickProps(
	click: StoreSetupClick
): Record<typeof STORE_SETUP_CLICK_ATTRIBUTE, StoreSetupClick> {
	return { [STORE_SETUP_CLICK_ATTRIBUTE]: click };
}

/**
 * Which Store Setup button an element is, if it is one. The pixel's half.
 *
 * Anything other than the three known values reads as "not one", so a typo in
 * the markup reports nothing rather than something wrong.
 */
export function readStoreSetupClick(element: {
	getAttribute(name: string): string | null;
}): StoreSetupClick | null {
	const value = element.getAttribute(STORE_SETUP_CLICK_ATTRIBUTE);
	return STORE_SETUP_CLICKS.find((click) => click === value) ?? null;
}

/** What WhatsApp opens with, so a lead arrives already saying what it wants. */
export const WHATSAPP_MESSAGE = "Hi, I'd like to know more about Store Setup.";

export interface StoreSetupLinks {
	/** Where "Get Basic" leads: the Basic payment page. */
	basicPay?: string;
	/** Where "Get Pro" leads: the Pro payment page. */
	proPay?: string;
	/** `https://wa.me/<number>?text=…`, ready to use as an href. */
	whatsapp?: string;
	/** The same number as bare digits, for printing in the footer. */
	whatsappNumber?: string;
}

const NON_DIGITS = /\D/g;

/**
 * Turns the three raw settings into what the page can render.
 *
 * A setting that is absent stays absent in the result, and that is the whole
 * contract with the page: an undefined link is drawn as a disabled button, so
 * a deploy with a variable missing shows a control that visibly does nothing
 * rather than one that looks live and leads nowhere.
 *
 * Pure, and separate from the env read below, so the WhatsApp URL can be
 * asserted in a test without a build.
 */
export function resolveStoreSetupLinks(source: {
	basicPay?: string;
	proPay?: string;
	whatsapp?: string;
}): StoreSetupLinks {
	const whatsappNumber = source.whatsapp?.replace(NON_DIGITS, "") || undefined;

	return {
		proPay: source.proPay || undefined,
		basicPay: source.basicPay || undefined,
		whatsappNumber,
		whatsapp: whatsappNumber
			? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
			: undefined,
	};
}

/** An Indian mobile number: country code 91, then ten digits. */
const INDIA_MOBILE = /^91(\d{5})(\d{5})$/;

/**
 * The number as a person would write it, for the footer: `+91 92632 31901`.
 *
 * Only Indian mobile numbers get the grouping, because that is the only
 * convention this page has a number for and a wrong grouping reads as a wrong
 * number. Anything else is printed as `+` and the digits, which is always
 * correct and merely plainer.
 */
export function formatWhatsappNumber(digits: string): string {
	const india = INDIA_MOBILE.exec(digits);
	return india ? `+91 ${india[1]} ${india[2]}` : `+${digits}`;
}

export const STORE_SETUP_LINKS = resolveStoreSetupLinks({
	proPay: env.NEXT_PUBLIC_STORE_SETUP_PRO_PAY_URL,
	basicPay: env.NEXT_PUBLIC_STORE_SETUP_BASIC_PAY_URL,
	whatsapp: env.NEXT_PUBLIC_STORE_SETUP_WHATSAPP,
});
