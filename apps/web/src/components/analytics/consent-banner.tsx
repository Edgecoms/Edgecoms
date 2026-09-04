"use client";

import { Button } from "@edgecoms/ui/components/button";
import { useEffect, useState } from "react";

import { setConsent, useConsent } from "@/lib/consent";

/**
 * The gate in front of the Meta Pixel.
 *
 * Shown only while the answer is `unknown`, and the answer starts unknown --
 * so on a first visit nothing has loaded yet and nothing will until somebody
 * chooses. Declining is a real choice with equal weight, not a link hidden
 * under a paragraph.
 *
 * The `ready` flag is what keeps a returning visitor from seeing this flash
 * past. `useConsent` cannot read `localStorage` during render on the server, so
 * the first paint always says `unknown`; by the time this effect has run the
 * store has re-read storage and an already-answered visitor renders nothing.
 */
export function ConsentBanner() {
	const consent = useConsent();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);

	if (!ready || consent !== "unknown") {
		return null;
	}

	return (
		<div
			aria-label="Cookie choices"
			className="fade-in slide-in-from-bottom-4 fixed inset-x-0 bottom-0 z-50 animate-in px-3 pb-3 duration-300 ease-[var(--ease-out)] motion-reduce:animate-none sm:px-4 sm:pb-4"
			role="dialog"
		>
			<div className="mx-auto max-w-2xl rounded-xl border border-border bg-secondary p-4 shadow-lg sm:p-5">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
					<p className="text-body-sm text-secondary-foreground">
						We use cookies to measure how our ads perform. Nothing loads until
						you choose, and you can change your mind any time from the footer.
					</p>
					<div className="flex shrink-0 items-center gap-2">
						<Button
							onClick={() => setConsent("denied")}
							size="lg"
							variant="secondary"
						>
							Decline
						</Button>
						<Button
							onClick={() => setConsent("granted")}
							size="lg"
							variant="primary"
						>
							Accept
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
