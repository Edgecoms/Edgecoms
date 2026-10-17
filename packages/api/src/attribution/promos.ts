import { normalizeShopDomain } from "@edgecoms/billing/partner-api";
import type { Database } from "@edgecoms/db";
import { promoCodes, promoRedemptions } from "@edgecoms/db/schema/promos";
import { and, countDistinct, eq } from "drizzle-orm";
import { ATTEMPT_LIMIT, recentAttemptCount, recordAttempt } from "./attempts";
import { normalizeCode } from "./codes";
import { type OfferPayload, termsFrom, toOffer } from "./grants";

/**
 * Promo code redemption — a discount with no partner behind it.
 *
 * Unlike a partner code this binds nothing: no `merchants` row, no attribution,
 * no commission. A store already referred by a partner may still redeem one.
 * See packages/db/src/schema/promos.ts and docs/promo-codes.md.
 *
 * Rejections share the partner flow's attempt log and limiter, so guessing at
 * promo codes and at partner codes spends the same per-shop budget, and every
 * rejection looks the same from outside.
 */

/** A promo discount applies to every paid plan, not just Enterprise. */
export type PromoOffer = Omit<OfferPayload, "appliesTo"> & { appliesTo: "all" };

export interface PromoRedeemInput {
	appSlug: string;
	code: string;
	shopDomain: string;
}

export type PromoRedeemOutcome =
	| {
			ok: true;
			/** `already_redeemed` = this store already redeemed it in this app. */
			status: "redeemed" | "already_redeemed";
			offer: PromoOffer;
	  }
	| { ok: false; status: "invalid_shop" | "invalid_code" | "rate_limited" };

/** Why a code can't be redeemed right now, or null when it can. */
function promoProblem(
	row: { status: string; expiresAt: Date | null; discountKind: string },
	now: Date
): string | null {
	if (row.status !== "active") {
		return `promo status ${row.status}`;
	}
	if (row.expiresAt && row.expiresAt.getTime() <= now.getTime()) {
		return `promo expired at ${row.expiresAt.toISOString()}`;
	}
	if (row.discountKind === "none") {
		return "promo carries no discount";
	}
	return null;
}

export async function redeemPromo(
	db: Database,
	input: PromoRedeemInput,
	now: Date = new Date()
): Promise<PromoRedeemOutcome> {
	let shopDomain: string;
	try {
		shopDomain = normalizeShopDomain(input.shopDomain);
	} catch {
		return { ok: false, status: "invalid_shop" };
	}
	const code = normalizeCode(input.code);
	const appSlug = input.appSlug.trim().toLowerCase();
	const attempt = { code, shopDomain, appSlug };

	const attempts = await recentAttemptCount(db, shopDomain, now);
	if (attempts >= ATTEMPT_LIMIT) {
		await recordAttempt(
			db,
			{
				...attempt,
				outcome: "rate_limited",
				reason: `${attempts} attempts in window`,
			},
			now
		);
		return { ok: false, status: "rate_limited" };
	}

	const result = await db.transaction(async (tx) => {
		// Locked so two stores racing for the last slot can't both take it.
		const rows = await tx
			.select()
			.from(promoCodes)
			.where(eq(promoCodes.code, code))
			.for("update");
		const promo = rows[0];
		if (!promo) {
			return { ok: false as const, detail: "unknown promo code" };
		}
		const offer = toOffer(termsFrom(promo));
		if (!offer) {
			return { ok: false as const, detail: "promo carries no discount" };
		}
		const promoOffer: PromoOffer = { ...offer, appliesTo: "all" };

		const mine = await tx
			.select({ appSlug: promoRedemptions.appSlug })
			.from(promoRedemptions)
			.where(
				and(
					eq(promoRedemptions.promoCodeId, promo.id),
					eq(promoRedemptions.shopDomain, shopDomain)
				)
			);

		// A replay from the same app keeps what it was given, even if the code
		// has since expired or been disabled: that store was already promised it.
		if (mine.some((row) => row.appSlug === appSlug)) {
			return {
				ok: true as const,
				status: "already_redeemed" as const,
				offer: promoOffer,
			};
		}

		const problem = promoProblem(promo, now);
		if (problem) {
			return { ok: false as const, detail: problem };
		}

		// A store that already redeemed in another app holds its slot.
		if (mine.length === 0 && promo.maxRedemptions !== null) {
			const used = await tx
				.select({ value: countDistinct(promoRedemptions.shopDomain) })
				.from(promoRedemptions)
				.where(eq(promoRedemptions.promoCodeId, promo.id));
			const stores = used[0]?.value ?? 0;
			if (stores >= promo.maxRedemptions) {
				return {
					ok: false as const,
					detail: `promo exhausted (${stores}/${promo.maxRedemptions} stores)`,
				};
			}
		}

		await tx
			.insert(promoRedemptions)
			.values({ promoCodeId: promo.id, shopDomain, appSlug, createdAt: now })
			.onConflictDoNothing();
		return {
			ok: true as const,
			status: "redeemed" as const,
			offer: promoOffer,
		};
	});

	if (!result.ok) {
		// The detail stays here. Outward, every rejection looks the same.
		await recordAttempt(
			db,
			{ ...attempt, outcome: "invalid", reason: result.detail },
			now
		);
		return { ok: false, status: "invalid_code" };
	}
	return result;
}
