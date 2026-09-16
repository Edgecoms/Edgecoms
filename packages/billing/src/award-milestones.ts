import type { Database } from "@edgecoms/db";
import { partners } from "@edgecoms/db/schema/partners";
import { partnerBonuses } from "@edgecoms/db/schema/payouts";
import { eq } from "drizzle-orm";
import { toPeriodMonth } from "./commissions";
import {
	evaluatePartnerMilestones,
	MILESTONE_BONUS_CURRENCY,
	MILESTONE_BONUS_MINOR,
	type MilestoneKey,
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

export interface AwardMilestonesSummary {
	/** Awards actually written by this run. A re-run over the same data is empty. */
	awarded: MilestoneAward[];
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
	}

	return summary;
}
