import { normalizeShopDomain } from "@edgecoms/billing/partner-api";
import type { Database } from "@edgecoms/db";
import { user } from "@edgecoms/db/schema/auth";
import { partners } from "@edgecoms/db/schema/partners";
import { referralClaims, referralLinks } from "@edgecoms/db/schema/referrals";
import { and, desc, eq, gt } from "drizzle-orm";
import type { Tx } from "../attribution/grants";

/**
 * CLAIMS — a store saying "I am coming, and this partner sent me".
 *
 * A merchant on a partner's landing page types their store address. That is
 * all a claim is: an intent with an expiry. It carries no money, grants
 * nothing, and cannot move a store that already belongs to a partner.
 *
 * Why it exists at all: the App Store is a one-way door. A merchant who clicks
 * a partner's link, installs, and never types a code is revenue the partner
 * really brought and would never be credited for. The store address they type
 * BEFORE they go is the only durable link between the click and the install,
 * because it is the one thing both sides know.
 */

/** A claim that is older than this was not the reason for the install. */
export const CLAIM_TTL_DAYS = 30;
/** How far back an IP match may look when suggesting a claim to an admin. */
export const SUGGESTION_WINDOW_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface ClaimInput {
	appSlug: string | null;
	clickId: string | null;
	linkId: string | null;
	partnerId: string;
	/** Any store reference, as typed. Normalized here. */
	shopDomain: string;
}

export interface Claim {
	expiresAt: Date;
	id: string;
	shopDomain: string;
}

/**
 * The canonical form of what a merchant typed: `mystore`,
 * `mystore.myshopify.com`, `https://shop.brand.com/` all become the key the
 * merchants table uses. Null when there is nothing usable in the input, which
 * the form turns into a message rather than a claim nobody can match.
 */
export function normalizeClaimDomain(input: string): string | null {
	try {
		return normalizeShopDomain(input);
	} catch {
		return null;
	}
}

async function liveClaimForPartner(
	db: Database,
	shopDomain: string,
	partnerId: string,
	now: Date
) {
	const rows = await db
		.select({ expiresAt: referralClaims.expiresAt, id: referralClaims.id })
		.from(referralClaims)
		.where(
			and(
				eq(referralClaims.shopDomain, shopDomain),
				eq(referralClaims.partnerId, partnerId),
				eq(referralClaims.status, "pending"),
				gt(referralClaims.expiresAt, now)
			)
		)
		.limit(1);
	return rows[0] ?? null;
}

/**
 * Record a claim, or refresh the one this partner already holds for this store.
 *
 * Refreshing rather than inserting again keeps a merchant who submits the form
 * twice from appearing twice in the funnel, and lets a second visit through a
 * different channel update which link gets the credit.
 */
export async function createClaim(
	db: Database,
	input: ClaimInput,
	now: Date = new Date()
): Promise<Claim | null> {
	const shopDomain = normalizeClaimDomain(input.shopDomain);
	if (!shopDomain) {
		return null;
	}
	const expiresAt = new Date(now.getTime() + CLAIM_TTL_DAYS * DAY_MS);

	const existing = await liveClaimForPartner(
		db,
		shopDomain,
		input.partnerId,
		now
	);
	if (existing) {
		await db
			.update(referralClaims)
			.set({
				appSlug: input.appSlug,
				clickId: input.clickId,
				expiresAt,
				linkId: input.linkId,
			})
			.where(eq(referralClaims.id, existing.id));
		return { expiresAt, id: existing.id, shopDomain };
	}

	const rows = await db
		.insert(referralClaims)
		.values({
			appSlug: input.appSlug,
			clickId: input.clickId,
			expiresAt,
			linkId: input.linkId,
			partnerId: input.partnerId,
			shopDomain,
		})
		.returning({ id: referralClaims.id });
	const created = rows[0];
	return created ? { expiresAt, id: created.id, shopDomain } : null;
}

export interface LiveClaim {
	appSlug: string | null;
	clickId: string | null;
	id: string;
	linkId: string | null;
	partnerId: string;
}

/**
 * The claim a resolving install should honour: the NEWEST live one.
 *
 * Two partners can both hold a claim on one store, because a merchant may
 * visit two landing pages. The most recent visit wins, which is how referral
 * credit works everywhere and is the reading a merchant would expect. It
 * decides nothing on its own: the caller still refuses if the store already
 * belongs to somebody.
 */
export async function liveClaimFor(
	db: Database,
	shopDomain: string,
	now: Date = new Date()
): Promise<LiveClaim | null> {
	const rows = await db
		.select({
			appSlug: referralClaims.appSlug,
			clickId: referralClaims.clickId,
			id: referralClaims.id,
			linkId: referralClaims.linkId,
			partnerId: referralClaims.partnerId,
		})
		.from(referralClaims)
		.where(
			and(
				eq(referralClaims.shopDomain, shopDomain),
				eq(referralClaims.status, "pending"),
				gt(referralClaims.expiresAt, now)
			)
		)
		.orderBy(desc(referralClaims.createdAt))
		.limit(1);
	return rows[0] ?? null;
}

/** Inside the attributing transaction, so a claim converts exactly once. */
export async function markClaimConverted(
	tx: Tx,
	claimId: string,
	merchantId: string,
	now: Date
): Promise<void> {
	await tx
		.update(referralClaims)
		.set({
			convertedAt: now,
			convertedMerchantId: merchantId,
			status: "converted",
		})
		.where(eq(referralClaims.id, claimId));
}

/** A claim we refuse to honour. Kept, so the refusal is visible to an admin. */
export async function rejectClaim(
	db: Database,
	claimId: string
): Promise<void> {
	await db
		.update(referralClaims)
		.set({ status: "rejected" })
		.where(eq(referralClaims.id, claimId));
}

export interface SuggestionRow {
	appSlug: string | null;
	createdAt: Date;
	id: string;
	linkSlug: string | null;
	partnerId: string;
	partnerName: string;
	shopDomain: string;
	subId: string | null;
}

/**
 * The queue an admin judges: matches we found by hashed address and refused to
 * act on. Newest first, because a suggestion is only useful while the install
 * is recent enough to remember.
 */
export async function listSuggestions(db: Database): Promise<SuggestionRow[]> {
	const rows = await db
		.select({
			appSlug: referralClaims.appSlug,
			company: partners.companyName,
			createdAt: referralClaims.createdAt,
			id: referralClaims.id,
			linkSlug: referralLinks.slug,
			name: user.name,
			partnerId: referralClaims.partnerId,
			shopDomain: referralClaims.shopDomain,
			subId: referralLinks.subId,
		})
		.from(referralClaims)
		.innerJoin(partners, eq(partners.id, referralClaims.partnerId))
		.innerJoin(user, eq(user.id, partners.userId))
		.leftJoin(referralLinks, eq(referralLinks.id, referralClaims.linkId))
		.where(eq(referralClaims.status, "suggested"))
		.orderBy(desc(referralClaims.createdAt));

	return rows.map(({ company, name, ...row }) => ({
		...row,
		partnerName: company ?? name,
	}));
}

/**
 * A claim NOBODY made: the install came from an address that clicked this
 * partner's link within the window. Recorded as `suggested` for an admin to
 * judge and never attributed automatically, because an IP is shared by an
 * office, a household and a coffee shop.
 */
export async function suggestClaim(
	db: Database,
	input: ClaimInput,
	now: Date = new Date()
): Promise<Claim | null> {
	const shopDomain = normalizeClaimDomain(input.shopDomain);
	if (!shopDomain) {
		return null;
	}

	const existing = await db
		.select({ expiresAt: referralClaims.expiresAt, id: referralClaims.id })
		.from(referralClaims)
		.where(
			and(
				eq(referralClaims.shopDomain, shopDomain),
				eq(referralClaims.partnerId, input.partnerId),
				eq(referralClaims.status, "suggested")
			)
		)
		.limit(1);
	const already = existing[0];
	if (already) {
		return { expiresAt: already.expiresAt, id: already.id, shopDomain };
	}

	const expiresAt = new Date(now.getTime() + CLAIM_TTL_DAYS * DAY_MS);
	const rows = await db
		.insert(referralClaims)
		.values({
			appSlug: input.appSlug,
			clickId: input.clickId,
			expiresAt,
			linkId: input.linkId,
			partnerId: input.partnerId,
			shopDomain,
			status: "suggested",
		})
		.returning({ id: referralClaims.id });
	const created = rows[0];
	return created ? { expiresAt, id: created.id, shopDomain } : null;
}
