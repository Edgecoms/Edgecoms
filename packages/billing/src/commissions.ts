import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { commissions, earningEvents } from "@edgecoms/db/schema/earnings";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partnerAppRates, partners } from "@edgecoms/db/schema/partners";
import { and, eq, isNull } from "drizzle-orm";
import { computeCommissionMinor } from "./money";
import type { CommissionSummary } from "./types";

export interface GenerateOptions {
	now?: () => Date;
}

/** UTC `YYYY-MM` period for an earning's occurrence — the commission period. */
export function toPeriodMonth(date: Date): string {
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, "0");
	return `${year}-${month}`;
}

/**
 * Generates commissions for every eligible earning that does not yet have one.
 *
 * Eligibility (CLAUDE.md "Eligibility"), resolved at generation time on the
 * stable keys so registration order never matters:
 *  - the earning's shop maps to an `approved` merchant (join on shop_domain),
 *  - the earning's app maps to an Edge app (join on partner_api_gid),
 *  - that (merchant, app) is NOT in the grandfathered set,
 *  - no commission exists for that earning yet.
 *
 * Each commission FREEZES its rate (per-app override or the partner default),
 * base (the earning's net), amount, and currency. Amount is integer math only.
 * Insert is conflict-do-nothing on the earning's unique FK, so generation can
 * run any number of times and never double-pays (CLAUDE.md "Commissions").
 */
export async function generateCommissions(
	db: Database,
	_options: GenerateOptions = {}
): Promise<CommissionSummary> {
	const eligible = await db
		.select({
			earningEventId: earningEvents.id,
			netAmount: earningEvents.netAmount,
			currency: earningEvents.currency,
			occurredAt: earningEvents.occurredAt,
			merchantId: merchants.id,
			partnerId: merchants.partnerId,
			appId: apps.id,
			defaultRateBps: partners.defaultRateBps,
			overrideRateBps: partnerAppRates.rateBps,
		})
		.from(earningEvents)
		.innerJoin(
			merchants,
			and(
				eq(merchants.shopDomain, earningEvents.shopDomain),
				eq(merchants.status, "approved")
			)
		)
		.innerJoin(apps, eq(apps.partnerApiGid, earningEvents.appPartnerApiGid))
		.innerJoin(partners, eq(partners.id, merchants.partnerId))
		.leftJoin(
			partnerAppRates,
			and(
				eq(partnerAppRates.partnerId, partners.id),
				eq(partnerAppRates.appId, apps.id)
			)
		)
		.leftJoin(commissions, eq(commissions.earningEventId, earningEvents.id))
		.leftJoin(
			merchantGrandfatheredApps,
			and(
				eq(merchantGrandfatheredApps.merchantId, merchants.id),
				eq(merchantGrandfatheredApps.appId, apps.id)
			)
		)
		.where(and(isNull(commissions.id), isNull(merchantGrandfatheredApps.id)));

	let commissionsCreated = 0;
	let commissionsSkipped = 0;

	for (const row of eligible) {
		// Resolve the rate: an explicit per-app override (including 0) wins over
		// the partner default. Frozen onto the row below.
		const rateBps = row.overrideRateBps ?? row.defaultRateBps;
		const baseAmount = row.netAmount;
		const commissionAmount = computeCommissionMinor(baseAmount, rateBps);

		const inserted = await db
			.insert(commissions)
			.values({
				earningEventId: row.earningEventId,
				partnerId: row.partnerId,
				merchantId: row.merchantId,
				appId: row.appId,
				rateBps,
				baseAmount,
				commissionAmount,
				currency: row.currency,
				periodMonth: toPeriodMonth(row.occurredAt),
				status: "pending",
			})
			.onConflictDoNothing({ target: commissions.earningEventId })
			.returning({ id: commissions.id });

		if (inserted.length > 0) {
			commissionsCreated++;
		} else {
			commissionsSkipped++;
		}
	}

	return { commissionsCreated, commissionsSkipped };
}
