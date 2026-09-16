import type { Database } from "@edgecoms/db";
import { commissions } from "@edgecoms/db/schema/earnings";
import { partners } from "@edgecoms/db/schema/partners";
import { partnerBonuses } from "@edgecoms/db/schema/payouts";
import { eq } from "drizzle-orm";
import { toPeriodMonth } from "./commissions";
import {
	evaluatePartnerMilestones,
	MERCHANT_BOUNTY_MINOR,
	MILESTONE_BONUS_CURRENCY,
	MILESTONE_BONUS_MINOR,
	type MilestoneKey,
	merchantBountyKey,
} from "./milestones";

/**
 * AWARD MILESTONE BONUSES.
 *
 * The automatic half of the bonus system. A milestone bonus is owed to every
 * partner who reaches the rung, so this runs unattended and pays without
 * anybody deciding -- which is exactly why the guarantees below matter more
 * than the logic.
 *
 * PAID ONCE, FOREVER. Enforced by the unique index on
 * (partner_id, milestone_key) with `onConflictDoNothing`, not by this function
 * checking first and then inserting. A check-then-insert has a window between
 * the two where a second run pays the same rung again; the index has no window.
 * Re-running this function over the same data is therefore free, which is what
 * makes it safe on a six-hourly cron.
 *
 * RUNS AFTER COMMISSION GENERATION. Four of the six rungs are functions of the
 * commission ledger, so awarding before generating would pay a partner on
 * yesterday's ledger and make them wait a full cycle for a rung they had
 * already cleared.
 *
 * Only `approved` partners accrue. An unapproved partner has no agreed rate and
 * no payout details, matching the same refusal in `admin.partners.issueBonus`.
 */

export interface MilestoneAward {
	amountMinor: string;
	key: MilestoneKey;
	partnerId: string;
}

export interface BountyAward {
	amountMinor: string;
	merchantId: string;
	partnerId: string;
}

export interface AwardMilestonesSummary {
	/** Awards actually written by this run. A re-run over the same data is empty. */
	awarded: MilestoneAward[];
	/** Per-store bounties written by this run. */
	bounties: BountyAward[];
	/** Partners considered. */
	partnersChecked: number;
}

export interface AwardMilestonesOptions {
	now?: () => Date;
}

export async function awardMilestoneBonuses(
	db: Database,
	options: AwardMilestonesOptions = {}
): Promise<AwardMilestonesSummary> {
	const now = options.now ?? (() => new Date());
	const periodMonth = toPeriodMonth(now());

	const eligible = await db
		.select({ id: partners.id })
		.from(partners)
		.where(eq(partners.status, "approved"));

	const summary: AwardMilestonesSummary = {
		awarded: [],
		bounties: [],
		partnersChecked: eligible.length,
	};

	for (const partner of eligible) {
		const ladder = await evaluatePartnerMilestones(db, partner.id);

		for (const rung of ladder.milestones) {
			if (!rung.reached) {
				continue;
			}

			const amount = MILESTONE_BONUS_MINOR[rung.key];
			const inserted = await db
				.insert(partnerBonuses)
				.values({
					amount,
					currency: MILESTONE_BONUS_CURRENCY,
					/* Null issuer: the programme owed this, nobody chose it. */
					issuedBy: null,
					milestoneKey: rung.key,
					partnerId: partner.id,
					periodMonth,
					reason: rung.label,
				})
				.onConflictDoNothing({
					target: [partnerBonuses.partnerId, partnerBonuses.milestoneKey],
				})
				.returning({ id: partnerBonuses.id });

			/* Nothing returned means the index refused it: already awarded. */
			if (inserted[0]) {
				summary.awarded.push({
					amountMinor: amount.toString(),
					key: rung.key,
					partnerId: partner.id,
				});
			}
		}

		/**
		 * THE PER-STORE BOUNTY. Unbounded, unlike the rungs: every store the
		 * partner brought that has generated commission pays once.
		 *
		 * Keyed on the merchant id, so the same unique index that caps a rung at
		 * one award caps each store at one bounty. `merchantId` is stored
		 * alongside purely so the ledger can name the store instead of parsing
		 * it back out of the key.
		 */
		const earners = await db
			.selectDistinct({ merchantId: commissions.merchantId })
			.from(commissions)
			.where(eq(commissions.partnerId, partner.id));

		for (const earner of earners) {
			const inserted = await db
				.insert(partnerBonuses)
				.values({
					amount: MERCHANT_BOUNTY_MINOR,
					currency: MILESTONE_BONUS_CURRENCY,
					issuedBy: null,
					merchantId: earner.merchantId,
					milestoneKey: merchantBountyKey(earner.merchantId),
					partnerId: partner.id,
					periodMonth,
					reason: "A store you brought started paying for Edge",
				})
				.onConflictDoNothing({
					target: [partnerBonuses.partnerId, partnerBonuses.milestoneKey],
				})
				.returning({ id: partnerBonuses.id });

			if (inserted[0]) {
				summary.bounties.push({
					amountMinor: MERCHANT_BOUNTY_MINOR.toString(),
					merchantId: earner.merchantId,
					partnerId: partner.id,
				});
			}
		}
	}

	return summary;
}
