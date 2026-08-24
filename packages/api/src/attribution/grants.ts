import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partners } from "@edgecoms/db/schema/partners";
import { and, count, eq, isNotNull, ne, sql } from "drizzle-orm";

/**
 * DISCOUNT GRANTS — who gets a price cut, and on what terms.
 *
 * A code may carry a discount on the Enterprise plan. Only the first N merchants
 * a partner refers receive it; after that the code still binds and still earns
 * commission, it just stops discounting. See docs/partner-plan-discounts.md.
 *
 * Three rules shape this file:
 *
 *   • THE COUNTER IS PER PARTNER, NOT PER CODE. `maxRedemptions` caps one code
 *     and a partner may hold several; counting there would let three codes yield
 *     three times the allocation. The count reads `merchants.partnerId`.
 *
 *   • IT IS RESOLVED UNDER A LOCK. Two shops binding at the same instant would
 *     otherwise both read "9 used" and both take slot 10. The partner row is
 *     locked FOR UPDATE before the count, inside the bind transaction.
 *
 *   • TERMS ARE FROZEN ONTO THE MERCHANT. Nothing reads a grant live from the
 *     code afterwards, so editing a code cannot retroactively change what an
 *     already-bound store was promised.
 *
 * No money is computed here. These are terms an Edge app hands to Shopify; the
 * platform never calls `appSubscriptionCreate` itself.
 */

/** Drizzle's transaction handle — narrower than `Database`. */
export type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];

/** Either handle, for reads that work the same inside or outside a transaction. */
export type Reader = Database | Tx;

/** The only plan a discount may touch. Usage plans have no Shopify discount. */
export const DISCOUNT_APPLIES_TO = "enterprise" as const;

export type GrantKind = "percentage" | "fixed" | "free_cycles";

/** Resolved discount terms. `kind` decides which other fields are meaningful. */
export interface GrantTerms {
	amountMinor: bigint | null;
	bps: number | null;
	currency: string | null;
	cycles: number | null;
	kind: GrantKind;
}

/** The discount columns, as they appear on either a code or a merchant row. */
export interface DiscountColumns {
	discountAmountMinor: bigint | null;
	discountBps: number | null;
	discountCurrency: string | null;
	discountCycles: number | null;
	discountKind: "none" | GrantKind;
}

/**
 * Read discount terms off a row. `none` — the Phase 1 default — is not a grant,
 * so it reads as null rather than as an empty discount.
 */
export function termsFrom(row: DiscountColumns): GrantTerms | null {
	if (row.discountKind === "none") {
		return null;
	}
	return {
		kind: row.discountKind,
		bps: row.discountBps,
		amountMinor: row.discountAmountMinor,
		currency: row.discountCurrency,
		cycles: row.discountCycles,
	};
}

/**
 * How much of a partner's allocation is spent.
 *
 * Counted from merchant rows rather than stored, for the same reason redemptions
 * are: the merchant row IS the grant, so no second number can disagree with it.
 *
 * A `rejected` merchant releases its slot. It does NOT recover the discount —
 * the app already applied it to a live Shopify subscription and rejecting here
 * cannot cancel that. See the known gap in docs/partner-plan-discounts.md.
 */
export async function countGrantsUsed(
	reader: Reader,
	partnerId: string
): Promise<number> {
	const rows = await reader
		.select({ value: count() })
		.from(merchants)
		.where(
			and(
				eq(merchants.partnerId, partnerId),
				isNotNull(merchants.discountGrantedAt),
				ne(merchants.status, "rejected")
			)
		);
	return rows[0]?.value ?? 0;
}

/**
 * Decide whether this bind earns a discount, and on what terms.
 *
 * MUST be called inside the bind transaction: it takes a row lock on the partner
 * so concurrent binds cannot both claim the last slot. Returns null when the
 * code grants nothing or the allocation is spent.
 *
 * A null `grantLimit` means unlimited, matching `maxRedemptions` and `expiresAt`.
 */
export async function resolveGrantForBind(
	tx: Tx,
	partnerId: string,
	code: DiscountColumns & { discountGrantLimit: number | null }
): Promise<GrantTerms | null> {
	const terms = termsFrom(code);
	if (!terms) {
		return null;
	}

	// Serializes concurrent binds for THIS partner. Without it the count below is
	// a read-then-write race and the allocation overruns.
	await tx.execute(
		sql`select ${partners.id} from ${partners} where ${partners.id} = ${partnerId} for update`
	);

	if (code.discountGrantLimit === null) {
		return terms;
	}
	const used = await countGrantsUsed(tx, partnerId);
	return used >= code.discountGrantLimit ? null : terms;
}

/**
 * Would a NEW bind on this code earn a discount? Read-only, no lock — this backs
 * the preview, where an approximate answer is correct and a lock would be a
 * denial-of-service surface.
 */
export async function previewGrantAvailability(
	db: Database,
	partnerId: string,
	code: DiscountColumns & { discountGrantLimit: number | null }
): Promise<GrantTerms | null> {
	const terms = termsFrom(code);
	if (!terms || code.discountGrantLimit === null) {
		return terms;
	}
	const used = await countGrantsUsed(db, partnerId);
	return used >= code.discountGrantLimit ? null : terms;
}

/**
 * Is the asking app one this store was already paying for?
 *
 * A grandfathered app never earns commission and must never be discounted
 * either: the store is not new business, and Shopify cannot discount a live
 * subscription in place anyway — it would need a new one for the merchant to
 * re-approve. The merchant-level grant survives for the apps that ARE new.
 */
export async function isAppGrandfathered(
	reader: Reader,
	merchantId: string,
	appSlug: string
): Promise<boolean> {
	const slug = appSlug.trim().toLowerCase();
	if (!slug) {
		return false;
	}
	const rows = await reader
		.select({ value: count() })
		.from(merchantGrandfatheredApps)
		.innerJoin(apps, eq(apps.id, merchantGrandfatheredApps.appId))
		.where(
			and(
				eq(merchantGrandfatheredApps.merchantId, merchantId),
				eq(apps.slug, slug)
			)
		);
	return (rows[0]?.value ?? 0) > 0;
}

/** The wire shape. Stable across kinds so an app can switch on `kind`. */
export interface OfferPayload {
	amountMinor: string | null;
	appliesTo: typeof DISCOUNT_APPLIES_TO;
	bps: number | null;
	currency: string | null;
	cycles: number | null;
	kind: GrantKind;
}

/** Serialize terms for the HTTP response. bigint goes out as a string. */
export function toOffer(terms: GrantTerms | null): OfferPayload | null {
	if (!terms) {
		return null;
	}
	return {
		kind: terms.kind,
		bps: terms.bps,
		amountMinor:
			terms.amountMinor === null ? null : terms.amountMinor.toString(),
		currency: terms.currency,
		cycles: terms.cycles,
		appliesTo: DISCOUNT_APPLIES_TO,
	};
}
