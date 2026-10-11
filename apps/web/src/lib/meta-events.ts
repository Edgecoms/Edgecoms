/**
 * The event vocabulary, shared by the browser pixel and the server endpoint.
 *
 * Its own module because the two halves live in different worlds: `meta-pixel`
 * is client-side and reaches for the consent store, `api/meta/events` is
 * server-side and must not pull any of that into its bundle. This file has no
 * imports at all, so both can depend on it and neither drags the other along.
 *
 * The lists double as the endpoint's allowlist. `/api/meta/events` is a public
 * route -- anything not named here is refused, so a stranger cannot invent
 * events and pollute the dataset the ad spend is judged on.
 */

/**
 * Meta's standard events. Using the standard names (rather than custom ones)
 * is what lets a campaign optimise for the event directly in Ads Manager --
 * a custom event has to be wrapped in a Custom Conversion first.
 */
export const STANDARD_EVENTS = [
	"CompleteRegistration",
	"Contact",
	"InitiateCheckout",
	"Lead",
	"PageView",
	"ViewContent",
] as const;

/** Events with no honest standard equivalent. See `eventForOutboundHref`. */
export const CUSTOM_EVENTS = ["AppStoreClick"] as const;

export type StandardEvent = (typeof STANDARD_EVENTS)[number];
export type CustomEvent = (typeof CUSTOM_EVENTS)[number];

export type PixelParams = Record<string, string | number | boolean>;

export function isKnownEvent(name: string): boolean {
	return (
		STANDARD_EVENTS.includes(name as StandardEvent) ||
		CUSTOM_EVENTS.includes(name as CustomEvent)
	);
}

/**
 * The two Meta datasets this site reports to.
 *
 * - `site` is the Edge apps pixel, on every marketing page. Its `Lead` means
 *   "Get a demo", and the Edge apps campaigns optimise on that event.
 * - `academy` is the Edgecoms Academy pixel. It hears from `/store-setup` and
 *   from nowhere else, and the Store Setup campaigns optimise on its events.
 *
 * They are separate so that neither campaign's signal is diluted by the
 * other's: a Store Setup click counted as a site `Lead` would teach the Edge
 * apps campaigns to chase the wrong people.
 */
export const PIXELS = ["site", "academy"] as const;

export type PixelKey = (typeof PIXELS)[number];

/** The one page the Academy pixel may hear from. */
export const ACADEMY_PATH = "/store-setup";

export function isAcademyPath(pathname: string): boolean {
	return pathname === ACADEMY_PATH || pathname === `${ACADEMY_PATH}/`;
}

/**
 * What the Academy pixel is sent: the page view, and what a click on one of
 * the Store Setup buttons means.
 */
export const ACADEMY_EVENTS = [
	"Contact",
	"InitiateCheckout",
	"Lead",
	"PageView",
] as const satisfies readonly StandardEvent[];

export type AcademyEvent = (typeof ACADEMY_EVENTS)[number];

/**
 * A checkout only ever starts on the Store Setup page, so it is the one known
 * event the site pixel has no business receiving.
 */
const ACADEMY_ONLY_EVENTS: readonly string[] = ["InitiateCheckout"];

/**
 * Whether a dataset is ever sent this event. Narrower than `isKnownEvent`: an
 * event can be real and still be addressed to the wrong pixel.
 */
export function isEventForPixel(pixel: PixelKey, name: string): boolean {
	if (pixel === "academy") {
		return ACADEMY_EVENTS.includes(name as AcademyEvent);
	}
	return isKnownEvent(name) && !ACADEMY_ONLY_EVENTS.includes(name);
}
