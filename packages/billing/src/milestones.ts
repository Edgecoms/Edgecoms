import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { commissions } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { count, eq, sql } from "drizzle-orm";

/**
 * THE MILESTONE LADDER, and what each rung pays.
 *
 * This file is the single source of both. It lives in the billing package, not
 * in the API, because two callers must never disagree about it: the partner's
 * screen, which tells them a rung is reached, and the awarder, which pays for
 * it. A ladder that says "done" while nothing was paid is a dispute, so they
 * read the same function.
 *
 * THESE AMOUNTS ARE A PROMISE. Unlike a discretionary bonus, a milestone bonus
 * is owed to every partner who reaches the rung, whether or not anybody is
 * watching. Changing an amount changes what future partners are owed; it does
 * not rewrite what has already been paid, because a paid bonus is history like
 * a paid commission. Removing a rung stops future awards and leaves past ones
 * alone.
 *
 * Paid ONCE per partner per rung, ever. That is enforced in the database by a
 * unique index on (partner_id, milestone_key), not by this code remembering.
 */

/**
 * Milestone bonuses are quoted in one currency, because they are a property of
 * the programme rather than of a partner's store. A partner earning in euros
 * still gets a dollar bonus, which rides the dollar payout -- `groupable`
 * lists bonus-only groups precisely so that payout exists.
 */
export const MILESTONE_BONUS_CURRENCY = "USD";

/** $100.00 in minor units. The money rung's threshold. */
const MONEY_TARGET_MINOR = 10_000n;

export type MilestoneKey =
	| "first_commission"
	| "first_store"
	| "five_stores"
	| "money"
	| "three_apps"
	| "whole_suite";

/** What reaching each rung pays, in minor units of MILESTONE_BONUS_CURRENCY. */
export const MILESTONE_BONUS_MINOR: Record<MilestoneKey, bigint> = {
	first_commission: 1000n,
	first_store: 500n,
	five_stores: 5000n,
	money: 10_000n,
	three_apps: 1000n,
	whole_suite: 7000n,
};

export interface MilestoneReading {
	/** What reaching this rung pays, in minor units. */
	bonusMinor: string;
	/** Count rungs carry these. */
	current?: number;
	/** The money rung carries these instead. */
	currentMinor?: string;
	key: MilestoneKey;
	label: string;
	reached: boolean;
	target?: number;
	targetMinor?: string;
}

export interface PartnerMilestones {
	/**
	 * The currency the MONEY rung is measured in: the partner's largest single
	 * currency, never a sum across them. The bonus itself is still paid in
	 * MILESTONE_BONUS_CURRENCY.
	 */
	currency: string;
	milestones: MilestoneReading[];
}

/**
 * Read one partner's ladder.
 *
 * Every rung is a count or a sum of rows that exist, so a rung cannot report
 * progress the partner could not verify on another screen.
 */
export async function evaluatePartnerMilestones(
	db: Database,
	partnerId: string
): Promise<PartnerMilestones> {
	const storeRows = await db
		.select({ value: count() })
		.from(merchants)
		.where(eq(merchants.partnerId, partnerId));
	const storeCount = storeRows[0]?.value ?? 0;

	const commissionRows = await db
		.select({ value: count() })
		.from(commissions)
		.where(eq(commissions.partnerId, partnerId));
	const commissionCount = commissionRows[0]?.value ?? 0;

	/* Grouped, never summed across currencies. */
	const byCurrency = await db
		.select({
			currency: commissions.currency,
			total: sql<string>`coalesce(sum(${commissions.commissionAmount}), 0)`,
		})
		.from(commissions)
		.where(eq(commissions.partnerId, partnerId))
		.groupBy(commissions.currency);

	let bestCurrency = MILESTONE_BONUS_CURRENCY;
	let bestTotal = 0n;
	for (const row of byCurrency) {
		const total = BigInt(row.total);
		if (total > bestTotal) {
			bestTotal = total;
			bestCurrency = row.currency;
		}
	}

	const earningPairs = await db
		.selectDistinct({
			appId: commissions.appId,
			merchantId: commissions.merchantId,
		})
		.from(commissions)
		.where(eq(commissions.partnerId, partnerId));

	const appsPerStore = new Map<string, Set<string>>();
	const appsAnywhere = new Set<string>();
	for (const pair of earningPairs) {
		appsAnywhere.add(pair.appId);
		const forStore = appsPerStore.get(pair.merchantId) ?? new Set<string>();
		forStore.add(pair.appId);
		appsPerStore.set(pair.merchantId, forStore);
	}
	const deepestStore = Math.max(
		0,
		...[...appsPerStore.values()].map((set) => set.size)
	);

	const catalogRows = await db.select({ value: count() }).from(apps);
	const catalogSize = catalogRows[0]?.value ?? 0;

	return {
		currency: bestCurrency,
		milestones: [
			{
				bonusMinor: MILESTONE_BONUS_MINOR.first_store.toString(),
				current: storeCount,
				key: "first_store",
				label: "First store on your code",
				reached: storeCount >= 1,
				target: 1,
			},
			{
				bonusMinor: MILESTONE_BONUS_MINOR.first_commission.toString(),
				current: commissionCount,
				key: "first_commission",
				label: "First commission earned",
				reached: commissionCount >= 1,
				target: 1,
			},
			{
				bonusMinor: MILESTONE_BONUS_MINOR.money.toString(),
				currentMinor: bestTotal.toString(),
				key: "money",
				/* A fallback only: the client composes this label from
				   `targetMinor` and the currency, because the same integer means
				   different money in different currencies. */
				label: "Your first hundred earned",
				reached: bestTotal >= MONEY_TARGET_MINOR,
				targetMinor: MONEY_TARGET_MINOR.toString(),
			},
			{
				bonusMinor: MILESTONE_BONUS_MINOR.three_apps.toString(),
				current: deepestStore,
				key: "three_apps",
				label: "Three Edge apps earning on one store",
				reached: deepestStore >= 3,
				target: 3,
			},
			{
				bonusMinor: MILESTONE_BONUS_MINOR.five_stores.toString(),
				current: storeCount,
				key: "five_stores",
				label: "Five stores on your code",
				reached: storeCount >= 5,
				target: 5,
			},
			{
				bonusMinor: MILESTONE_BONUS_MINOR.whole_suite.toString(),
				current: appsAnywhere.size,
				key: "whole_suite",
				label: "Every Edge app earning somewhere",
				reached: catalogSize > 0 && appsAnywhere.size >= catalogSize,
				target: catalogSize,
			},
		],
	};
}
