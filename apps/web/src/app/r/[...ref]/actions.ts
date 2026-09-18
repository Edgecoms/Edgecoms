"use server";

import {
	createClaim,
	normalizeClaimDomain,
} from "@edgecoms/api/referrals/claims";
import { normalizeSubId, resolveReferral } from "@edgecoms/api/referrals/links";
import { db } from "@edgecoms/db";
import type { Route } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
	appStoreUrlFor,
	PRODUCTS_PATH,
	REF_COOKIE,
	REF_COOKIE_MAX_AGE,
	withUtms,
} from "./shared";

/**
 * The merchant typed their store address and pressed the button.
 *
 * The partner is resolved AGAIN here from the address in the path, never taken
 * from the form: a posted `partnerId` would let anybody credit anybody. The
 * claim that comes out of this is an intent with an expiry, and it cannot move
 * a store that already belongs to a partner: that is checked at install time
 * (see @edgecoms/api/referrals/resolve).
 */

export interface ClaimState {
	error: string | null;
}

export async function claimStore(
	_previous: ClaimState,
	form: FormData
): Promise<ClaimState> {
	const ref = String(form.get("ref") ?? "");
	const appSlug = String(form.get("appSlug") ?? "") || null;
	const subId = normalizeSubId(String(form.get("subId") ?? ""));
	const clickId = String(form.get("clickId") ?? "") || null;
	const shop = String(form.get("shop") ?? "");

	if (shop.trim() === "") {
		return { error: "Enter your store address." };
	}
	const shopDomain = normalizeClaimDomain(shop);
	if (!shopDomain) {
		return {
			error:
				"That does not look like a store address. Try mystore.myshopify.com.",
		};
	}

	const resolved = await resolveReferral(db, { appSlug, ref, subId });
	if (!resolved) {
		/* The link stopped working between the page load and the submit. */
		redirect(PRODUCTS_PATH as Route);
	}

	const claim = await createClaim(db, {
		appSlug: resolved.appSlug,
		clickId,
		linkId: resolved.link?.id ?? null,
		partnerId: resolved.partnerId,
		shopDomain,
	});
	if (!claim) {
		return { error: "We could not save that. Try again in a moment." };
	}

	const jar = await cookies();
	jar.set({
		httpOnly: true,
		maxAge: REF_COOKIE_MAX_AGE,
		name: REF_COOKIE,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		value: `${resolved.code}:${resolved.link?.id ?? ""}:${clickId ?? ""}`,
	});

	/* An absolute App Store URL, which `typedRoutes` types as an internal
	   path. The cast is the documented escape hatch, as it is for an external
	   `href`. */
	redirect(
		withUtms(
			appStoreUrlFor(resolved.appSlug),
			resolved.code,
			resolved.subId ?? resolved.appSlug ?? "all-apps"
		) as Route
	);
}
