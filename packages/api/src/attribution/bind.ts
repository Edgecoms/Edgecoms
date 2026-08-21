import { normalizeShopDomain } from "@edgecoms/billing/partner-api";
import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { eq, inArray } from "drizzle-orm";
import { ATTEMPT_LIMIT, recentAttemptCount, recordAttempt } from "./attempts";
import { normalizeCode, validateCode } from "./codes";

/**
 * BINDING A STORE TO A PARTNER — the attribution write.
 *
 * A merchant pastes a code into an Edge app; the app calls this. It is the only
 * path that creates a `code`-sourced merchant row.
 *
 * Invariants this function is responsible for:
 *
 *   • ONE PARTNER PER SHOP, PERMANENT. The unique on `merchants.shop_domain` is
 *     the rule, not a convention checked here — the insert is
 *     conflict-do-nothing and the conflict is then read to decide whether this
 *     is a replay or another partner's store.
 *
 *   • Replays are free. The same shop re-submitting the same partner's code
 *     returns the existing binding rather than erroring, so an app can retry a
 *     failed delivery, and a nightly sweep can re-assert a binding it isn't sure
 *     landed, without a support ticket.
 *
 *   • Nothing earns yet. The row lands `pending`; an admin approves it. That
 *     keeps CLAUDE.md's eligibility gate intact and is what makes amending the
 *     grandfathered set here safe.
 *
 *   • Grandfathered apps are captured from what the APP reports it was already
 *     charging this shop for. Those apps never earn for this merchant, ever. The
 *     set is only touched while `pending`; approval freezes it.
 *
 * No money is computed anywhere in this file, by design. Commission depends on
 * org-wide Partner API transaction data and is generated later, from
 * `earning_events` — see @edgecoms/billing/commissions.
 */

/** Drizzle's transaction handle — narrower than `Database`. */
type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];

const MYSHOPIFY_SUFFIX = /\.myshopify\.com$/;

export interface BindInput {
	/** Which Edge app the bind came through. */
	appSlug: string;
	/** Store contact email, when the app has one. */
	boundByEmail?: string | null;
	/** The code as the merchant typed it. Normalized here. */
	code: string;
	/**
	 * Edge app slugs this shop was ALREADY paying for at bind time. These become
	 * the merchant's grandfathered set and never earn.
	 */
	paidAppSlugs?: string[];
	/** Any store reference; normalized to the canonical myshopify domain. */
	shopDomain: string;
	/** Shopify shop GID, when the app knows it. Needed by Phase 2 credits. */
	shopifyGid?: string | null;
	/** Store display name. Falls back to the store handle. */
	shopName?: string | null;
}

export interface BindSuccess {
	merchantId: string;
	ok: true;
	partner: { id: string; name: string };
	perk: { usageAllowanceUsd: number | null };
	/** `bound` = created now. `already_bound` = the same partner, replayed. */
	status: "bound" | "already_bound";
}

export type BindFailureStatus =
	| "invalid_shop"
	| "invalid_code"
	| "claimed_by_other"
	| "rate_limited";

export interface BindFailure {
	ok: false;
	status: BindFailureStatus;
}

export type BindOutcome = BindSuccess | BindFailure;

/** Store handle from the canonical domain — the name fallback. */
function storeHandle(shopDomain: string): string {
	return shopDomain.replace(MYSHOPIFY_SUFFIX, "");
}

/** Resolve app slugs to catalog ids, dropping anything we don't track. */
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

/**
 * Add app ids to a merchant's grandfathered set.
 *
 * Conflict-do-nothing, so re-reporting the same apps is a no-op. The caller must
 * only invoke this for a `pending` merchant: the set is frozen at approval, and
 * quietly widening it afterwards would retroactively delete commission the
 * partner had already been told they were earning.
 */
async function addGrandfathered(
	tx: Tx,
	merchantId: string,
	appIds: string[]
): Promise<void> {
	for (const appId of appIds) {
		await tx
			.insert(merchantGrandfatheredApps)
			.values({ merchantId, appId })
			.onConflictDoNothing({
				target: [
					merchantGrandfatheredApps.merchantId,
					merchantGrandfatheredApps.appId,
				],
			});
	}
}

export async function bindAttribution(
	db: Database,
	input: BindInput,
	now: Date = new Date()
): Promise<BindOutcome> {
	let shopDomain: string;
	try {
		shopDomain = normalizeShopDomain(input.shopDomain);
	} catch {
		// No usable shop key means nothing to rate-limit against and nothing to
		// record an attempt for. Refuse before touching the database.
		return { ok: false, status: "invalid_shop" };
	}

	const code = normalizeCode(input.code);

	const attempts = await recentAttemptCount(db, shopDomain, now);
	if (attempts >= ATTEMPT_LIMIT) {
		await recordAttempt(
			db,
			{
				code,
				shopDomain,
				appSlug: input.appSlug,
				outcome: "rate_limited",
				reason: `${attempts} attempts in window`,
			},
			now
		);
		return { ok: false, status: "rate_limited" };
	}

	const validation = await validateCode(db, code, now);
	if (!validation.valid) {
		await recordAttempt(
			db,
			{
				code,
				shopDomain,
				appSlug: input.appSlug,
				outcome: "invalid",
				reason: validation.detail,
			},
			now
		);
		return { ok: false, status: "invalid_code" };
	}
	const resolved = validation.code;

	const result = await db.transaction(async (tx) => {
		const appIds = await resolveAppIds(tx, input.paidAppSlugs ?? []);

		const inserted = await tx
			.insert(merchants)
			.values({
				partnerId: resolved.partnerId,
				shopDomain,
				name: input.shopName?.trim() || storeHandle(shopDomain),
				email: input.boundByEmail?.trim() || null,
				status: "pending",
				source: "code",
				partnerCodeId: resolved.id,
				sourceCode: resolved.code,
				shopifyGid: input.shopifyGid?.trim() || null,
			})
			.onConflictDoNothing({ target: merchants.shopDomain })
			.returning({ id: merchants.id });

		const fresh = inserted[0];
		if (fresh) {
			await addGrandfathered(tx, fresh.id, appIds);
			return { status: "bound" as const, merchantId: fresh.id };
		}

		// The domain was already claimed. Read who by — that decides whether this
		// is a harmless replay or a store another partner already owns.
		const existingRows = await tx
			.select({
				id: merchants.id,
				partnerId: merchants.partnerId,
				status: merchants.status,
				shopifyGid: merchants.shopifyGid,
			})
			.from(merchants)
			.where(eq(merchants.shopDomain, shopDomain))
			.limit(1);
		const existing = existingRows[0];

		if (!existing || existing.partnerId !== resolved.partnerId) {
			return { status: "claimed_by_other" as const, merchantId: null };
		}

		// Same partner: idempotent replay. Backfill the GID if the first call
		// didn't carry one — pure enrichment, and Phase 2 credits need it.
		if (!existing.shopifyGid && input.shopifyGid?.trim()) {
			await tx
				.update(merchants)
				.set({ shopifyGid: input.shopifyGid.trim() })
				.where(eq(merchants.id, existing.id));
		}
		// Still pending, so the grandfathered set is not yet frozen and a
		// re-report may legitimately add an app the first call missed.
		if (existing.status === "pending") {
			await addGrandfathered(tx, existing.id, appIds);
		}
		return { status: "already_bound" as const, merchantId: existing.id };
	});

	if (result.status === "claimed_by_other") {
		await recordAttempt(
			db,
			{
				code,
				shopDomain,
				appSlug: input.appSlug,
				outcome: "claimed_by_other",
				reason: `already bound to another partner (code partner ${resolved.partnerId})`,
			},
			now
		);
		return { ok: false, status: "claimed_by_other" };
	}

	await recordAttempt(
		db,
		{
			code,
			shopDomain,
			appSlug: input.appSlug,
			outcome: result.status,
			reason: null,
		},
		now
	);

	return {
		ok: true,
		status: result.status,
		merchantId: result.merchantId,
		partner: { id: resolved.partnerId, name: resolved.partnerName },
		perk: { usageAllowanceUsd: resolved.perkUsageAllowanceUsd },
	};
}
