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
