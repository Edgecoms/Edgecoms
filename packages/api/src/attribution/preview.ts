import { normalizeShopDomain } from "@edgecoms/billing/partner-api";
import type { Database } from "@edgecoms/db";
import { ATTEMPT_LIMIT, recentAttemptCount } from "./attempts";
import { validateCode } from "./codes";

/**
 * The read-only half of code entry: "is this code good, and whose is it?"
 *
 * Exists as a domain function rather than route logic for two reasons. It keeps
 * the Shopify domain-normalization boundary inside the packages that own it
 * (`apps/web` has no business importing the Partner API adapter), and it puts
 * the rate-limit decision in the same place for the preview and the write, so
 * the two cannot drift apart.
 *
 * Records NOTHING — not even an attempt row. A merchant clicking "check" must
 * not be able to spend the five tries they need for the real thing. The limit is
 * still read, so the preview can't be used as a free enumeration oracle.
 */

export interface CodePreviewInput {
	appSlug?: string | null;
	code: string;
	shopDomain: string;
}

export type CodePreview =
	| {
			ok: true;
			valid: true;
			partner: { id: string; name: string };
			/** Always null in Phase 1 — no discount terms exist yet. */
			offer: null;
			perk: { usageAllowanceUsd: number | null };
	  }
	| { ok: true; valid: false }
	| { ok: false; status: "invalid_shop" | "rate_limited" };

export async function previewCode(
	db: Database,
	input: CodePreviewInput,
	now: Date = new Date()
): Promise<CodePreview> {
	let shopDomain: string;
	try {
		shopDomain = normalizeShopDomain(input.shopDomain);
	} catch {
		return { ok: false, status: "invalid_shop" };
	}

	if ((await recentAttemptCount(db, shopDomain, now)) >= ATTEMPT_LIMIT) {
		return { ok: false, status: "rate_limited" };
	}

	const validation = await validateCode(db, input.code, now);
	if (!validation.valid) {
		// The detail stays here. Outward, every rejection looks the same.
		return { ok: true, valid: false };
	}

	return {
		ok: true,
		valid: true,
		partner: {
			id: validation.code.partnerId,
			name: validation.code.partnerName,
		},
		offer: null,
		perk: { usageAllowanceUsd: validation.code.perkUsageAllowanceUsd },
	};
}
