"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the visitor has agreed to analytics/advertising cookies.
 *
 * The Meta Pixel reads this and refuses to load until it says `granted`, so
 * this file is the on/off switch for every third-party request the marketing
 * site makes. Two rules it exists to enforce:
 *
 * 1. **Undecided is not consent.** Until somebody clicks, the answer is
 *    `unknown` and nothing loads. No pre-ticked box, no "by continuing to
 *    browse you agree".
 * 2. **Withdrawing is as easy as giving.** `setConsent("denied")` takes effect
 *    on the spot: the pixel unmounts and the loader stops running. It cannot
 *    un-send what already went, which is why the footer link says so plainly.
 *
 * A tiny external store rather than context, because the consumers -- the
 * banner, the footer link, the pixel -- sit in different corners of the tree
 * and none of them owns the others.
 */

export type ConsentState = "granted" | "denied" | "unknown";

const STORAGE_KEY = "edge.consent.analytics.v1";

const listeners = new Set<() => void>();

/**
 * Cached so `getSnapshot` can be called as often as React likes without
 * touching `localStorage` every render -- and so it returns a stable value,
 * which `useSyncExternalStore` requires or it loops forever.
 */
let snapshot: ConsentState = "unknown";
let hydrated = false;

function readStorage(): ConsentState {
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		return stored === "granted" || stored === "denied" ? stored : "unknown";
	} catch {
		/**
		 * Private mode and "block all cookies" both throw here. No storage means
		 * no way to remember a yes, and an unrememberable yes is not consent --
		 * so the visitor stays `unknown` and nothing loads.
		 */
		return "unknown";
	}
}

function emit(): void {
	for (const listener of listeners) {
		listener();
	}
}

export function setConsent(next: "granted" | "denied"): void {
	try {
		window.localStorage.setItem(STORAGE_KEY, next);
	} catch {
		// Unwritable storage: honour the choice for this page view at least.
	}
	snapshot = next;
	hydrated = true;
	emit();
}

function subscribe(listener: () => void): () => void {
	listeners.add(listener);

	if (!hydrated) {
		hydrated = true;
		snapshot = readStorage();
	}

	/**
	 * Another tab answering the banner settles it here too, so a visitor who
	 * declines in one tab is not still tracked in the one behind it.
	 */
	function onStorage(event: StorageEvent) {
		if (event.key !== STORAGE_KEY) {
			return;
		}
		snapshot = readStorage();
		emit();
	}

	window.addEventListener("storage", onStorage);

	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", onStorage);
	};
}

function getSnapshot(): ConsentState {
	return snapshot;
}

/** The server has no idea what this visitor chose, so it assumes nothing. */
function getServerSnapshot(): ConsentState {
	return "unknown";
}

export function useConsent(): ConsentState {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * The non-React read, for the click handler that has to decide *right now*
 * whether an event may be reported. Falls back to storage when no component
 * has subscribed yet.
 */
export function consentGranted(): boolean {
	if (typeof window === "undefined") {
		return false;
	}
	if (!hydrated) {
		hydrated = true;
		snapshot = readStorage();
	}
	return snapshot === "granted";
}
