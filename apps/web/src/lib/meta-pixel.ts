/**
 * Meta (Facebook) Pixel — what the browser reports back to Meta Ads.
 *
 * Everything about the pixel lives here and in `components/analytics/
 * meta-pixel.tsx`. The rules this file encodes:
 *
 * 1. **Nothing fires without consent.** Every report goes through `report()`,
 *    which asks `lib/consent.ts` first. No consent, no pixel, no server call.
 * 2. **Nothing fires without an id.** A pixel with no id configured is never
 *    initialised and never sent anything. Local dev and preview deploys are
 *    silent by default.
 * 3. **The signed-in portal is never tracked.** A partner reading their own
 *    earnings is not ad traffic, and their dashboard URLs are none of Meta's
 *    business. Attribution ends at the marketing site.
 * 4. **The mapping from a click to an event is a pure function.** "Get a demo"
 *    sits on ~20 surfaces and every app page links to the App Store; wiring a
 *    handler into each one would rot the first time somebody adds a button.
 *    One delegated listener asks this file what an href means instead.
 * 5. **Every event is reported twice, with one id.** Once from the browser and
 *    once from our own server (see `api/meta/events`). Meta collapses the pair
 *    on `event_id`, so the count is unchanged -- but when a browser blocks the
 *    pixel outright, the server copy is the only one that arrives.
 * 6. **Every event names the one pixel it is for.** There are two (see
 *    `PIXELS` in `meta-events.ts`), and `fbq('track')` reaches every pixel
 *    initialised on the page. So nothing here calls it: each report is a
 *    `trackSingle` to one id. The Academy pixel hears from `/store-setup`
 *    and from nowhere else, and the site pixel never hears a Store Setup
 *    click.
 */

import { env } from "@edgecoms/env/web";

import { consentGranted } from "./consent";
import {
	type AcademyEvent,
	type CustomEvent,
	isAcademyPath,
	type PixelKey,
	type PixelParams,
	type StandardEvent,
} from "./meta-events";
import {
	STORE_SETUP_CURRENCY,
	STORE_SETUP_PLANS,
	type StoreSetupClick,
} from "./store-setup";

export const META_PIXEL_ID = env.NEXT_PUBLIC_META_PIXEL_ID;
export const META_ACADEMY_PIXEL_ID = env.NEXT_PUBLIC_META_ACADEMY_PIXEL_ID;

const PIXEL_IDS: Record<PixelKey, string | undefined> = {
	site: META_PIXEL_ID,
	academy: META_ACADEMY_PIXEL_ID,
};

interface FbqStub {
	callMethod?: (...args: unknown[]) => void;
	queue?: unknown[][];
	(...args: unknown[]): void;
}

declare global {
	interface Window {
		fbq?: FbqStub;
	}
}

/**
 * Where the server-side copy of each event goes. A first-party path on our own
 * domain on purpose: the blockers that drop `connect.facebook.net` do not drop
 * this, which is the entire reason the server leg exists.
 */
const CAPI_ENDPOINT = "/api/meta/events";

/**
 * Every pixel call funnels through here so there is exactly one place that
 * knows the pixel might not be loaded. A dropped event is always better than
 * a thrown one -- an ad tag must never be able to break the page.
 */
function callFbq(...args: unknown[]): void {
	if (typeof window === "undefined" || !window.fbq) {
		return;
	}
	window.fbq(...args);
}

/**
 * Cookies `fbevents.js` writes: the browser id and the click id.
 *
 * Cleared on withdrawal because "stop sending events" is only half of honouring
 * a no -- leaving Meta's identifiers sitting in the browser means the next site
 * that loads the pixel picks the same person straight back up.
 */
const META_COOKIES = ["_fbp", "_fbc"] as const;

function clearMetaCookies(): void {
	for (const name of META_COOKIES) {
		// biome-ignore lint/suspicious/noDocumentCookie: expiring a cookie, not setting one -- and CookieStore is still absent in Safari, where this has to work
		document.cookie = `${name}=; Max-Age=0; path=/`;
		/**
		 * `_fbp` is written on the registrable domain, so the host-only delete
		 * above misses it. Browsers ignore a domain they do not match, which makes
		 * this safe to fire unconditionally.
		 */
		// biome-ignore lint/suspicious/noDocumentCookie: same
		document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}`;
	}
}

/**
 * Tell an already-loaded pixel what the visitor decided.
 *
 * Unmounting our `<Script>` does not unload `fbevents.js` -- once it is in the
 * page it stays there. So withdrawing consent has to say so in Meta's own
 * vocabulary rather than just going quiet on our side.
 *
 * The `grant` direction matters for exactly one case: someone who revoked and
 * then changed their mind again without reloading. A fresh page load starts
 * granted by default, so this is not needed there.
 */
export function setPixelConsent(granted: boolean): void {
	if (typeof window === "undefined") {
		return;
	}

	callFbq("consent", granted ? "grant" : "revoke");

	if (!granted) {
		clearMetaCookies();
	}
}

function newEventId(): string {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}
	return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * The server leg. `keepalive` matters more than it looks: the biggest event on
 * this site -- clicking "Get a demo" -- navigates the tab away to Calendly
 * milliseconds later, and a normal fetch would be cancelled in flight.
 *
 * Failure is swallowed. An unreachable endpoint must not surface an unhandled
 * rejection in a visitor's console over an analytics ping.
 */
function reportToServer(body: {
	eventId: string;
	name: string;
	params: PixelParams;
	pixel: PixelKey;
	sourceUrl: string;
}): void {
	try {
		fetch(CAPI_ENDPOINT, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
			keepalive: true,
		}).catch(() => {
			// Analytics is never worth an error surface.
		});
	} catch {
		// Same: a browser that refuses the call must not break the page.
	}
}

/**
 * Whether the Academy pixel has been initialised on this page load.
 *
 * Module state rather than React state because `fbevents.js` is itself a page
 * singleton: it outlives every component, and initialising one id twice makes
 * it log a duplicate-pixel warning.
 */
let academyPixelReady = false;

/**
 * Bring the Academy pixel up, the first time it is needed.
 *
 * Initialising it is not enough to keep it to `/store-setup`, because once a
 * pixel is initialised `fbevents.js` talks to it without being asked:
 *
 * - On every client-side navigation it sends an automatic `PageView` to every
 *   initialised pixel, and the Academy pixel stays initialised when a visitor
 *   moves on to another page of the site. `trackSingleOnly` is what stops
 *   that: a pixel carrying it is skipped by everything except a `trackSingle`
 *   addressed to it by id.
 * - With automatic setup on (the default for a new dataset) it also reports
 *   button clicks and page metadata on its own, on whichever page the visitor
 *   is on. `autoConfig` off removes those. It has to be set before `init`.
 *
 * Together these mean the Academy pixel hears exactly what `report()` sends
 * it and nothing else.
 */
function ensureAcademyPixel(pixelId: string): void {
	if (academyPixelReady || !window.fbq) {
		return;
	}

	window.fbq("set", "autoConfig", false, pixelId);
	window.fbq("init", pixelId);
	window.fbq("set", "trackSingleOnly", true, pixelId);
	academyPixelReady = true;
}

function report(
	pixel: PixelKey,
	name: string,
	params: PixelParams,
	standard: boolean
): void {
	const pixelId = PIXEL_IDS[pixel];
	if (typeof window === "undefined" || !(pixelId && consentGranted())) {
		return;
	}

	if (pixel === "academy") {
		/**
		 * The one gate every Academy event passes, browser leg and server leg
		 * alike. Checked against the address bar at the moment of sending rather
		 * than trusted from the caller, so no call site can get this wrong.
		 */
		if (!isAcademyPath(window.location.pathname)) {
			return;
		}
		ensureAcademyPixel(pixelId);
	}

	/**
	 * One id, both legs. This is what stops the server copy from being counted
	 * as a second conversion.
	 */
	const eventId = newEventId();

	callFbq(
		standard ? "trackSingle" : "trackSingleCustom",
		pixelId,
		name,
		params,
		{ eventID: eventId }
	);

	reportToServer({
		pixel,
		name,
		params,
		eventId,
		sourceUrl: window.location.href,
	});
}

export function trackStandard(
	event: StandardEvent,
	params: PixelParams = {}
): void {
	report("site", event, params, true);
}

export function trackCustom(
	event: CustomEvent,
	params: PixelParams = {}
): void {
	report("site", event, params, false);
}

/** Report to the Academy pixel. Sends nothing unless the page is `/store-setup`. */
export function trackAcademy(
	event: AcademyEvent,
	params: PixelParams = {}
): void {
	report("academy", event, params, true);
}

/**
 * Route prefixes the pixel is deliberately blind to: the authenticated portal
 * and the admin console. See rule 3 at the top of this file.
 */
const UNTRACKED_PREFIXES = ["/partner", "/admin"] as const;

export function isTrackedPath(pathname: string): boolean {
	return !UNTRACKED_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
	);
}

const PRODUCT_PATH = /^\/products\/([a-z0-9-]+)\/?$/;

/**
 * A single app page -- `/products/edge-cart`, not the `/products` index.
 * Returns the slug so `ViewContent` can say *which* app was looked at, which
 * is the difference between "ads drive traffic" and "ads drive traffic to
 * Edge Cart".
 */
export function productSlugFromPath(pathname: string): string | null {
	return PRODUCT_PATH.exec(pathname)?.[1] ?? null;
}

export interface OutboundEvent {
	name: StandardEvent | CustomEvent;
	params: PixelParams;
	/** The one dataset this event is for. */
	pixel: PixelKey;
	/** Standard events use `trackSingle`; custom ones use `trackSingleCustom`. */
	standard: boolean;
}

const APP_STORE_SLUG = /apps\.shopify\.com\/([a-z0-9-]+)/;

/**
 * What a click on an outbound link means to the site pixel, in Meta's
 * vocabulary.
 *
 * These are the three ways somebody leaves the marketing site with intent:
 *
 * - **Calendly** — the demo booking. This is the money event; it is the one
 *   worth optimising campaigns for. Fired as `Lead` (the click) rather than
 *   `Schedule`, because the booking itself completes on Calendly's domain and
 *   we cannot see it. Calling a click a completed booking would overstate it.
 * - **mailto:** — sales or support. `Contact` is the standard event for it.
 *   The address recorded is Edge's own inbox, never the visitor's.
 * - **apps.shopify.com** — an install click. Custom rather than standard,
 *   because the install completes on Shopify and none of Meta's purchase-shaped
 *   standard events would be honest about a click.
 *
 * The Store Setup buttons are deliberately absent. They belong to the Academy
 * pixel, and they are recognised by what they are rather than by where they
 * lead; see `storeSetupEventsForClick`.
 */
export function eventForOutboundHref(href: string): OutboundEvent | null {
	if (href.startsWith("mailto:")) {
		return {
			name: "Contact",
			params: { contact_address: href.slice("mailto:".length) },
			pixel: "site",
			standard: true,
		};
	}

	if (href.includes("calendly.com")) {
		return {
			name: "Lead",
			params: { content_name: "Book a demo" },
			pixel: "site",
			standard: true,
		};
	}

	const appSlug = APP_STORE_SLUG.exec(href)?.[1];
	if (appSlug) {
		return {
			name: "AppStoreClick",
			params: { app: appSlug },
			pixel: "site",
			standard: false,
		};
	}

	return null;
}

/**
 * What a click on one of the Store Setup buttons means, to the Academy pixel.
 *
 * Each click is two events, because the Store Setup campaigns read two things
 * from it:
 *
 * - **"Get Pro" / "Get Basic"** — `InitiateCheckout` and `Lead`, both valued
 *   at the plan's price. The payment completes on the payment provider's own
 *   page, where we cannot see it, so this is the start of a checkout and never
 *   a `Purchase`.
 * - **WhatsApp** — `Contact` and `Lead`. No value: nothing has been priced
 *   yet when somebody asks a question.
 *
 * All of it is addressed to the Academy pixel. The site pixel's `Lead` means
 * "Get a demo" and the Edge apps campaigns optimise on it, so a Store Setup
 * click must never be one.
 *
 * The argument is which button was pressed, read off the button itself. The
 * address it leads to is not consulted, so moving to another payment provider
 * changes nothing here.
 */
export function storeSetupEventsForClick(
	click: StoreSetupClick
): OutboundEvent[] {
	if (click === "whatsapp") {
		const params: PixelParams = { content_name: "Store Setup WhatsApp" };
		return [
			{ name: "Contact", params, pixel: "academy", standard: true },
			{ name: "Lead", params, pixel: "academy", standard: true },
		];
	}

	const plan = STORE_SETUP_PLANS[click];
	const params: PixelParams = {
		content_name: `Store Setup ${plan.name}`,
		currency: STORE_SETUP_CURRENCY,
		value: plan.priceUsd,
	};
	return [
		{ name: "InitiateCheckout", params, pixel: "academy", standard: true },
		{ name: "Lead", params, pixel: "academy", standard: true },
	];
}

/** A link somebody clicked, as far as the pixel is concerned. */
export interface ClickedLink {
	href: string;
	/** Which Store Setup button it is, if the link is marked as one. */
	storeSetupClick: StoreSetupClick | null;
}

/**
 * Everything one click on a link reports, given the page it happened on.
 *
 * On `/store-setup` a Store Setup button is answered here and the site
 * pixel's mapping is never consulted, which is what keeps those clicks out of
 * the site dataset whatever the link happens to look like. Everywhere else
 * the button's mark is ignored, which is half of what keeps the Academy pixel
 * to its one page (`report()` enforces the other half).
 */
export function eventsForOutboundClick(
	link: ClickedLink,
	pathname: string
): OutboundEvent[] {
	if (link.storeSetupClick && isAcademyPath(pathname)) {
		return storeSetupEventsForClick(link.storeSetupClick);
	}

	const site = eventForOutboundHref(link.href);
	return site ? [site] : [];
}

export function trackOutbound(event: OutboundEvent): void {
	report(event.pixel, event.name, event.params, event.standard);
}
