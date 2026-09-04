/**
 * GA4, if it is there.
 *
 * This site does not install Google Analytics today. It is loaded by tag
 * managers, consent tools and hosting platforms often enough that a landing
 * page taking paid traffic should report its conversion into it when it does
 * exist, and the cost of that is this file.
 *
 * The guard is the entire point: `window.gtag` is absent on every page load
 * right now, and a conversion handler that throws on a missing analytics
 * global would break the form submit it is attached to. Nothing here is
 * allowed to be load-bearing.
 */

type GtagFn = (
	command: "event",
	eventName: string,
	params?: Record<string, unknown>
) => void;

declare global {
	interface Window {
		gtag?: GtagFn;
	}
}

export function trackGa4Event(
	name: string,
	params: Record<string, unknown> = {}
): void {
	if (typeof window === "undefined" || typeof window.gtag !== "function") {
		return;
	}

	try {
		window.gtag("event", name, params);
	} catch {
		// Analytics is never worth an error surface. Same rule as the pixel.
	}
}
