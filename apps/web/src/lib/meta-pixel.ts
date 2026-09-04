/**
 * Meta (Facebook) Pixel — what the browser reports back to Meta Ads.
 *
 * Everything about the pixel lives here and in `components/analytics/
 * meta-pixel.tsx`. The rules this file encodes:
 *
 * 1. **Nothing fires without consent.** Every report goes through `report()`,
 *    which asks `lib/consent.ts` first. No consent, no pixel, no server call.
 * 2. **Nothing fires without an id.** No `NEXT_PUBLIC_META_PIXEL_ID` means the
 *    pixel never loads. Local dev and preview deploys are silent by default.
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
 */

import { env } from "@edgecoms/env/web";

import { consentGranted } from "./consent";
import type { CustomEvent, PixelParams, StandardEvent } from "./meta-events";

export const META_PIXEL_ID = env.NEXT_PUBLIC_META_PIXEL_ID;

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
	name: string;
	params: PixelParams;
	eventId: string;
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

function report(name: string, params: PixelParams, standard: boolean): void {
	if (typeof window === "undefined" || !(META_PIXEL_ID && consentGranted())) {
		return;
	}

	/**
	 * One id, both legs. This is what stops the server copy from being counted
	 * as a second conversion.
	 */
	const eventId = newEventId();

	callFbq(standard ? "track" : "trackCustom", name, params, {
		eventID: eventId,
	});

	reportToServer({
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
	report(event, params, true);
}

export function trackCustom(
	event: CustomEvent,
	params: PixelParams = {}
): void {
	report(event, params, false);
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
	/** Standard events use `track`; custom ones use `trackCustom`. */
	standard: boolean;
}

const APP_STORE_SLUG = /apps\.shopify\.com\/([a-z0-9-]+)/;

/**
 * What a click on an outbound link means, in Meta's vocabulary.
 *
 * These are the three ways somebody leaves this site with intent:
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
 */
export function eventForOutboundHref(href: string): OutboundEvent | null {
	if (href.startsWith("mailto:")) {
		return {
			name: "Contact",
			params: { contact_address: href.slice("mailto:".length) },
			standard: true,
		};
	}

	if (href.includes("calendly.com")) {
		return {
			name: "Lead",
			params: { content_name: "Book a demo" },
			standard: true,
		};
	}

	const appSlug = APP_STORE_SLUG.exec(href)?.[1];
	if (appSlug) {
		return {
			name: "AppStoreClick",
			params: { app: appSlug },
			standard: false,
		};
	}

	return null;
}

export function trackOutbound(event: OutboundEvent): void {
	report(event.name, event.params, event.standard);
}
