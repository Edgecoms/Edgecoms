"use client";

import type { Route } from "next";
import { authClient } from "@/lib/auth-client";

/** Where a signed-in user's dashboard lives, by role. */
export function portalPathForRole(role: string | undefined): Route {
	return (role === "admin" ? "/admin" : "/partner") as Route;
}

/**
 * What the header's account action should say, and where it should point.
 *
 * The session is read on the client rather than passed down from a server
 * layout on purpose. Every marketing page is statically rendered, and calling
 * `auth.api.getSession` in the layout would make all of them dynamic in order
 * to personalise a single link. The trade is that the first paint shows the
 * signed-out label and swaps once the session resolves.
 *
 * A hook rather than a component because the two headers wrap this in
 * differently styled buttons, and the only thing they actually share is the
 * destination and the word on it.
 */
export function usePortalLink(): { href: Route; label: string } {
	const { data } = authClient.useSession();

	if (!data) {
		return { href: "/login" as Route, label: "Partner login" };
	}

	const role = (data.user as { role?: string } | undefined)?.role;

	return { href: portalPathForRole(role), label: "Dashboard" };
}
