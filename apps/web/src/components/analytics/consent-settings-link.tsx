"use client";

import { setConsent, useConsent } from "@/lib/consent";

/**
 * The withdrawal path, sat in the footer next to the copyright.
 *
 * GDPR wants taking consent back to be as easy as giving it, so this is a
 * plain always-visible control rather than something behind a settings modal.
 * Declining here takes effect immediately -- the pixel unmounts and stops
 * loading -- though it cannot recall what was already sent, which is why the
 * label changes to reflect the current answer rather than pretending the
 * choice was never made.
 */
export function ConsentSettingsLink() {
	const consent = useConsent();

	if (consent === "granted") {
		return (
			<button
				className="underline underline-offset-2 transition-opacity hover:opacity-70"
				onClick={() => setConsent("denied")}
				type="button"
			>
				Cookies: on — turn off
			</button>
		);
	}

	if (consent === "denied") {
		return (
			<button
				className="underline underline-offset-2 transition-opacity hover:opacity-70"
				onClick={() => setConsent("granted")}
				type="button"
			>
				Cookies: off — turn on
			</button>
		);
	}

	/* Undecided: the banner is already asking, so the footer stays quiet. */
	return null;
}
