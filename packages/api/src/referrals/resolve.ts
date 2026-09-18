import { normalizeShopDomain } from "@edgecoms/billing/partner-api";
import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { user } from "@edgecoms/db/schema/auth";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partners } from "@edgecoms/db/schema/partners";
import { referralClaims, referralClicks } from "@edgecoms/db/schema/referrals";
import { and, desc, eq, gte, inArray } from "drizzle-orm";
import type { Tx } from "../attribution/grants";
import {
	liveClaimFor,
	markClaimConverted,
	rejectClaim,
	SUGGESTION_WINDOW_DAYS,
	suggestClaim,
} from "./claims";
import { activePartnerCode } from "./links";

/**
 * WHO OWNS THIS STORE, ASKED AT INSTALL TIME.
 *
 * An Edge app calls this when a shop installs it. The order is fixed, and the
 * first rule that matches wins:
 *
 *   1. THE STORE ALREADY HAS A PARTNER. Keep it. One partner per shop is
 *      permanent (CLAUDE.md), through uninstall and reinstall, and a claim
 *      never moves it. This rule is first precisely so nothing below can.
 *   2. A LIVE CLAIM FOR THIS STORE. The merchant typed this address on a
 *      partner's landing page within the last 30 days: attribute it, `pending`
 *      like every other new attribution, and convert the claim.
 *   3. NOTHING. The app's own code box is still the fallback, unchanged.
 *   4. An address that clicked this partner's link in the last week is
 *      recorded as a SUGGESTION for an admin to judge. Never attributed
 *      automatically: an IP is shared by an office, a household and a cafe.
 *
 * Self-referral is refused before rule 2 can fire. No money is computed here,
 * and a link-sourced store carries no discount: that is the discount phase.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const MYSHOPIFY_SUFFIX = /\.myshopify\.com$/;
const SCHEME = /^https?:\/\//;
const LEADING_WWW = /^www\./;
const PATH_AFTER_DOMAIN = /\/.*$/;
/**
 * A partner who signed up with a mailbox provider tells us nothing about which
 * stores are theirs, so the store-name comparison skips these. The full-domain
 * comparison still runs, and cannot match a myshopify store anyway.
 */
const MAILBOX_PROVIDERS: readonly string[] = [
	"aol.com",
	"gmail.com",
	"googlemail.com",
	"hotmail.com",
	"icloud.com",
	"live.com",
	"mail.com",
	"outlook.com",
	"proton.me",
	"protonmail.com",
	"yahoo.com",
	"yandex.com",
];

export interface ResolveInput {
	appSlug: string;
	/** The caller's hashed address, for rule 4. Optional. */
	ipHash?: string | null;
	/** Edge app slugs this shop was already paying for, if the app knows. */
	paidAppSlugs?: string[];
	shop: string;
}

export interface ResolvedPartner {
	code: string | null;
	id: string;
	name: string;
}

export type ResolveOutcome =
	| { partner: ResolvedPartner; merchantId: string; status: "existing" }
	| {
			claimId: string;
			partner: ResolvedPartner;
			merchantId: string;
			status: "attributed";
	  }
	| { claimId: string; partner: ResolvedPartner; status: "suggested" }
	| { status: "none" }
	| { status: "invalid_shop" }
	| { partner: ResolvedPartner; status: "self_referral" };

function storeHandle(shopDomain: string): string {
	return shopDomain.replace(MYSHOPIFY_SUFFIX, "");
}

async function describePartner(
	db: Database,
	partnerId: string
): Promise<ResolvedPartner> {
	const rows = await db
		.select({ company: partners.companyName, name: user.name })
		.from(partners)
		.innerJoin(user, eq(user.id, partners.userId))
		.where(eq(partners.id, partnerId))
		.limit(1);
	const row = rows[0];
	return {
		code: await activePartnerCode(db, partnerId),
		id: partnerId,
		name: row?.company ?? row?.name ?? "Edge partner",
	};
}

/**
 * Is this the partner's own store?
 *
 * Matched on the domain a partner already told us about: the email address
 * they signed up with, and their website. A partner referring themselves is
 * not acquisition, and the bounty and commission behind an attribution make it
 * worth refusing rather than reviewing.
 *
 * Deliberately narrow. It cannot catch an agency using an unrelated address,
 * which is what admin approval is still for.
 */
async function isSelfReferral(
	db: Database,
	partnerId: string,
	shopDomain: string
): Promise<boolean> {
	const rows = await db
		.select({ email: user.email, website: partners.website })
		.from(partners)
		.innerJoin(user, eq(user.id, partners.userId))
		.where(eq(partners.id, partnerId))
		.limit(1);
	const row = rows[0];
	if (!row) {
		return false;
	}

	const handle = storeHandle(shopDomain);
	const emailDomain = row.email.split("@")[1]?.toLowerCase() ?? "";
	const website = (row.website ?? "")
		.trim()
		.toLowerCase()
		.replace(SCHEME, "")
		.replace(LEADING_WWW, "")
		.replace(PATH_AFTER_DOMAIN, "");

	const own = [emailDomain, website].filter((value) => value !== "");
	return own.some((domain) => {
		if (domain === shopDomain) {
			return true;
		}
		if (MAILBOX_PROVIDERS.includes(domain)) {
			return false;
		}
		/* `acmeagency.com` against `acmeagency.myshopify.com`. */
		return domain.split(".")[0] === handle;
	});
}

/** Resolve app slugs to catalog ids, dropping anything we do not track. */
async function resolveAppIds(tx: Tx, slugs: string[]): Promise<string[]> {
	const wanted = [
		...new Set(slugs.map((slug) => slug.trim().toLowerCase()).filter(Boolean)),
	];
	if (wanted.length === 0) {
		return [];
	}
	const rows = await tx
		.select({ id: apps.id })
		.from(apps)
		.where(inArray(apps.slug, wanted));
	return rows.map((row) => row.id);
}

interface AttributeInput {
	claimId: string;
	code: string | null;
	/** Slugs the app reported this shop already pays for. */
	paidAppSlugs: string[];
	partnerId: string;
	shopDomain: string;
}

/**
 * Write the attribution. `onConflictDoNothing` on the shop domain is the
 * one-partner-per-shop rule: if another install won the race, nothing is
 * inserted and the existing row stands.
 */
async function attribute(
	db: Database,
	input: AttributeInput,
	now: Date
): Promise<{ merchantId: string; won: boolean }> {
	return await db.transaction(async (tx) => {
		const appIds = await resolveAppIds(tx, input.paidAppSlugs);
		const inserted = await tx
			.insert(merchants)
			.values({
				/* The claim start: a link-referred partner earns from the install,
				   never from the store's past charges (CLAUDE.md). */
				earningsFromAt: now,
				name: storeHandle(input.shopDomain),
				partnerId: input.partnerId,
				shopDomain: input.shopDomain,
				source: "link",
				sourceCode: input.code,
				status: "pending",
			})
			.onConflictDoNothing({ target: merchants.shopDomain })
			.returning({ id: merchants.id });

		const fresh = inserted[0];
		if (!fresh) {
			const existing = await tx
				.select({ id: merchants.id })
				.from(merchants)
				.where(eq(merchants.shopDomain, input.shopDomain))
				.limit(1);
			return { merchantId: existing[0]?.id ?? "", won: false };
		}

		for (const appId of appIds) {
			await tx
				.insert(merchantGrandfatheredApps)
				.values({ appId, merchantId: fresh.id })
				.onConflictDoNothing({
					target: [
						merchantGrandfatheredApps.merchantId,
						merchantGrandfatheredApps.appId,
					],
				});
		}

		await markClaimConverted(tx, input.claimId, fresh.id, now);
		return { merchantId: fresh.id, won: true };
	});
}

async function existingOwner(
	db: Database,
	shopDomain: string
): Promise<{ merchantId: string; partnerId: string } | null> {
	const rows = await db
		.select({ merchantId: merchants.id, partnerId: merchants.partnerId })
		.from(merchants)
		.where(eq(merchants.shopDomain, shopDomain))
		.limit(1);
	const row = rows[0];
	return row ? { merchantId: row.merchantId, partnerId: row.partnerId } : null;
}

/** The most recent partner whose link this address clicked, inside the window. */
async function partnerFromRecentClick(
	db: Database,
	ipHash: string,
	now: Date
): Promise<{
	clickId: string;
	linkId: string | null;
	partnerId: string;
} | null> {
	const rows = await db
		.select({
			clickId: referralClicks.id,
			linkId: referralClicks.linkId,
			partnerId: referralClicks.partnerId,
		})
		.from(referralClicks)
		.where(
			and(
				eq(referralClicks.ipHash, ipHash),
				eq(referralClicks.isBot, false),
				gte(
					referralClicks.createdAt,
					new Date(now.getTime() - SUGGESTION_WINDOW_DAYS * DAY_MS)
				)
			)
		)
		.orderBy(desc(referralClicks.createdAt))
		.limit(1);
	return rows[0] ?? null;
}

interface HonourInput {
	claimId: string;
	paidAppSlugs: string[];
	partnerId: string;
	shopDomain: string;
}

/**
 * Turn one claim into an attribution, with the refusals that go with it.
 *
 * Shared by install-time resolution and by an admin approving a suggested
 * match, so a suggestion approved by hand lands exactly as a claim honoured
 * automatically: `pending`, earning from today, one partner per shop.
 */
async function honourClaim(
	db: Database,
	input: HonourInput,
	now: Date
): Promise<ResolveOutcome> {
	if (await isSelfReferral(db, input.partnerId, input.shopDomain)) {
		await rejectClaim(db, input.claimId);
		return {
			partner: await describePartner(db, input.partnerId),
			status: "self_referral",
		};
	}

	const partner = await describePartner(db, input.partnerId);
	const result = await attribute(
		db,
		{
			claimId: input.claimId,
			code: partner.code,
			paidAppSlugs: input.paidAppSlugs,
			partnerId: input.partnerId,
			shopDomain: input.shopDomain,
		},
		now
	);

	if (!result.won) {
		const raced = await existingOwner(db, input.shopDomain);
		return raced
			? {
					merchantId: raced.merchantId,
					partner: await describePartner(db, raced.partnerId),
					status: "existing",
				}
			: { status: "none" };
	}

	return {
		claimId: input.claimId,
		merchantId: result.merchantId,
		partner,
		status: "attributed",
	};
}

/**
 * An admin approving a suggested match, or honouring a claim by hand.
 *
 * Runs the same refusals install-time resolution does: a store that already
 * belongs to somebody is never moved, and a partner's own store is refused
 * even here. An expired claim is still approvable, because an admin looking at
 * the queue has judged the case themselves.
 */
export async function approveClaim(
	db: Database,
	claimId: string,
	now: Date = new Date()
): Promise<ResolveOutcome> {
	const rows = await db
		.select({
			partnerId: referralClaims.partnerId,
			shopDomain: referralClaims.shopDomain,
			status: referralClaims.status,
		})
		.from(referralClaims)
		.where(eq(referralClaims.id, claimId))
		.limit(1);
	const claim = rows[0];
	if (
		!(claim && (claim.status === "pending" || claim.status === "suggested"))
	) {
		return { status: "none" };
	}

	const owner = await existingOwner(db, claim.shopDomain);
	if (owner) {
		return {
			merchantId: owner.merchantId,
			partner: await describePartner(db, owner.partnerId),
			status: "existing",
		};
	}

	return await honourClaim(
		db,
		{
			claimId,
			paidAppSlugs: [],
			partnerId: claim.partnerId,
			shopDomain: claim.shopDomain,
		},
		now
	);
}

export async function resolveAttribution(
	db: Database,
	input: ResolveInput,
	now: Date = new Date()
): Promise<ResolveOutcome> {
	let shopDomain: string;
	try {
		shopDomain = normalizeShopDomain(input.shop);
	} catch {
		return { status: "invalid_shop" };
	}

	/* 1. Already somebody's. Nothing below may change that. */
	const owner = await existingOwner(db, shopDomain);
	if (owner) {
		return {
			merchantId: owner.merchantId,
			partner: await describePartner(db, owner.partnerId),
			status: "existing",
		};
	}

	/* 2. A live claim. */
	const claim = await liveClaimFor(db, shopDomain, now);
	if (claim) {
		return await honourClaim(
			db,
			{
				claimId: claim.id,
				paidAppSlugs: input.paidAppSlugs ?? [],
				partnerId: claim.partnerId,
				shopDomain,
			},
			now
		);
	}

	/* 4. An address that clicked recently: a suggestion, never an attribution. */
	if (input.ipHash) {
		const recent = await partnerFromRecentClick(db, input.ipHash, now);
		if (recent) {
			const suggestion = await suggestClaim(
				db,
				{
					appSlug: input.appSlug,
					clickId: recent.clickId,
					linkId: recent.linkId,
					partnerId: recent.partnerId,
					shopDomain,
				},
				now
			);
			if (suggestion) {
				return {
					claimId: suggestion.id,
					partner: await describePartner(db, recent.partnerId),
					status: "suggested",
				};
			}
		}
	}

	/* 3. Nothing. The app's code box is still the fallback. */
	return { status: "none" };
}
