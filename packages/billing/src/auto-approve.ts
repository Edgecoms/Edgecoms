import type { Database } from "@edgecoms/db";
import {
	merchantGrandfatheredApps,
	merchants,
} from "@edgecoms/db/schema/merchants";
import { partners } from "@edgecoms/db/schema/partners";
import { and, eq, exists, lte, notExists, sql } from "drizzle-orm";

/**
 * THE SETTLING SWEEP -- approving the stores where there is nothing to decide.
 *
 * Merchant approval exists to do three jobs: freeze the grandfathered set,
 * check that the partner really brought the store, and gate a binding that is
 * permanent and has no undo. For a store that was paying for NOTHING before the
 * partner arrived, the first job is vacuous -- there is no set to freeze and no
 * pre-existing revenue to give away -- and making that store wait on a human is
 * friction in the partner's first week for no protection at all.
 *
 * WHY A SWEEP AND NOT A DECISION AT BIND TIME. The grandfathered set may only
 * be amended while the merchant is `pending` (see the status check in
 * attribution/bind.ts). Approving on the first bind would freeze the set after
 * the FIRST app reported, so the second Edge app a store installs could never
 * add itself -- and if the shop was already paying for that second app, the
 * partner would earn on revenue that predates them, forever. Exactly the
 * giveaway approval is there to prevent.
 *
 * Waiting instead is safe in both directions. A store that settles with an
 * empty proposal is approved automatically. A store where any app reports a
 * prior paid subscription now has a non-empty set, fails the eligibility test,
 * and waits for a person -- which is the only case where a person was ever
 * adding anything.
 *
 * Eligibility is re-asserted INSIDE the per-merchant transaction, so a
 * concurrent admin approval, a rejection, or a late report from an app cannot
 * be raced. Nothing here writes money: it moves a status, and the money follows
 * on the next commission generation.
 */

/** How long a store must sit pending before the sweep will consider it. */
export const DEFAULT_SETTLING_HOURS = 24;

const MS_PER_HOUR = 3_600_000;

export interface AutoApproveOptions {
	now?: () => Date;
	/** Hours a merchant must have been pending. Defaults to 24. */
	settlingHours?: number;
}

export interface AutoApproveSummary {
	/** Merchant ids approved by this run. */
	approved: string[];
	/** Considered and left for a person, with the reason. */
	held: { merchantId: string; reason: string }[];
}

/**
 * Approve every pending, code-bound merchant that has settled with nothing
 * grandfathered and an approved partner behind it.
 */
export async function autoApproveSettledMerchants(
	db: Database,
	options: AutoApproveOptions = {}
): Promise<AutoApproveSummary> {
	const now = options.now ?? (() => new Date());
	const settlingHours = options.settlingHours ?? DEFAULT_SETTLING_HOURS;
	const cutoff = new Date(now().getTime() - settlingHours * MS_PER_HOUR);

	/**
	 * Candidates: pending, bound by a code, old enough, and with no
	 * grandfathered rows. The partner join is deliberate -- `validateCode`
	 * refuses a bind for an unapproved partner, but a partner can be suspended
	 * AFTER their store bound, and a sweep must not quietly approve new earning
	 * for somebody we have stopped working with.
	 */
	const candidates = await db
		.select({ id: merchants.id, partnerStatus: partners.status })
		.from(merchants)
		.innerJoin(partners, eq(partners.id, merchants.partnerId))
		.where(
			and(
				eq(merchants.status, "pending"),
				eq(merchants.source, "code"),
				lte(merchants.createdAt, cutoff)
			)
		);

	const summary: AutoApproveSummary = { approved: [], held: [] };

	for (const candidate of candidates) {
		if (candidate.partnerStatus !== "approved") {
			summary.held.push({
				merchantId: candidate.id,
				reason: `partner is ${candidate.partnerStatus}`,
			});
			continue;
		}

		const outcome = await db.transaction(async (tx) => {
			/* Re-assert every condition under the transaction. A person may have
			   approved or rejected this store, or an app may have reported a
			   prior subscription, since the candidate list was read. */
			const updated = await tx
				.update(merchants)
				.set({
					approvedAt: now(),
					autoApproved: true,
					status: "approved",
				})
				.where(
					and(
						eq(merchants.id, candidate.id),
						eq(merchants.status, "pending"),
						eq(merchants.source, "code"),
						lte(merchants.createdAt, cutoff),
						notExists(
							tx
								.select({ one: sql`1` })
								.from(merchantGrandfatheredApps)
								.where(eq(merchantGrandfatheredApps.merchantId, candidate.id))
						),
						/**
						 * The partner is still approved.
						 *
						 * This was checked against the candidate list read
						 * BEFORE the transaction, which made it the one
						 * condition this function's own contract claimed to
						 * re-assert and did not. A partner suspended while a
						 * sweep was mid-run still had their stores approved,
						 * opening new earning for somebody we had just stopped
						 * working with.
						 */
						exists(
							tx
								.select({ one: sql`1` })
								.from(partners)
								.where(
									and(
										eq(partners.id, merchants.partnerId),
										eq(partners.status, "approved")
									)
								)
						)
					)
				)
				.returning({ id: merchants.id });

			return updated[0]?.id ?? null;
		});

		if (outcome) {
			summary.approved.push(outcome);
		} else {
			summary.held.push({
				merchantId: candidate.id,
				reason: "grandfathered apps reported, or no longer pending",
			});
		}
	}

	return summary;
}
