import { normalizeShopDomain } from "@edgecoms/billing/partner-api";
import type { Database } from "@edgecoms/db";
import { merchants } from "@edgecoms/db/schema/merchants";
import { eq } from "drizzle-orm";
import { ATTEMPT_LIMIT, recentAttemptCount } from "./attempts";
import { type ResolvedCode, validateCode } from "./codes";
import {
	isAppGrandfathered,
	type OfferPayload,
	previewGrantAvailability,
	termsFrom,
	toOffer,
} from "./grants";

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
			/**
			 * What this app would apply if the merchant committed now. An estimate,
			 * not a reservation: the allocation is only claimed under a lock at
			 * bind, so a slot shown here can be taken by another store first.
			 */
			offer: OfferPayload | null;
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

	const offer = await resolveOffer(
		db,
		shopDomain,
		validation.code,
		input.appSlug
	);

	return {
		ok: true,
		valid: true,
		partner: {
			id: validation.code.partnerId,
			name: validation.code.partnerName,
		},
		offer,
		perk: { usageAllowanceUsd: validation.code.perkUsageAllowanceUsd },
	};
}

/**
 * What this app would apply, without writing anything.
 *
 * An already-bound store reads its FROZEN grant rather than the code's current
 * terms — otherwise the preview would show a merchant something different from
 * what their second and third app installs will actually get. An unbound store
 * gets the code's terms, if the partner's allocation still has room.
 */
async function resolveOffer(
	db: Database,
	shopDomain: string,
	code: ResolvedCode,
	appSlug?: string | null
): Promise<OfferPayload | null> {
	const existingRows = await db
		.select({
			id: merchants.id,
			partnerId: merchants.partnerId,
			discountKind: merchants.discountKind,
			discountBps: merchants.discountBps,
			discountAmountMinor: merchants.discountAmountMinor,
			discountCurrency: merchants.discountCurrency,
			discountCycles: merchants.discountCycles,
		})
		.from(merchants)
		.where(eq(merchants.shopDomain, shopDomain))
		.limit(1);
	const existing = existingRows[0];

	if (existing) {
		// Another partner's store: the bind will be refused, so promise nothing.
		if (existing.partnerId !== code.partnerId) {
			return null;
		}
		if (appSlug && (await isAppGrandfathered(db, existing.id, appSlug))) {
			return null;
		}
		return toOffer(termsFrom(existing));
	}

	return toOffer(await previewGrantAvailability(db, code.partnerId, code));
}
