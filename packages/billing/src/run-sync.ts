import type { Database } from "@edgecoms/db";
import { autoApproveSettledMerchants } from "./auto-approve";
import { awardMilestoneBonuses } from "./award-milestones";
import { generateCommissions } from "./commissions";
import { reconcile } from "./reconcile";
import type { EarningSource, SyncSummary } from "./types";

export interface RunBillingSyncDeps {
	db: Database;
	now?: () => Date;
	/** Overrides the sweep's settling window. Defaults to 24 hours. */
	settlingHours?: number;
	source: EarningSource;
	sourceKey?: string;
}

/**
 * A full billing pass: ingest the latest earnings (checkpointed, idempotent),
 * approve the stores that have settled with nothing to decide, then generate
 * any missing commissions.
 *
 * The approval step runs BEFORE generation on purpose, so a store approved by
 * this pass starts earning in the same pass rather than waiting six hours for
 * the next one. Pure orchestration over `reconcile`
 * and `generateCommissions` — the SAME function the worker cron and the admin
 * "Run sync now" mutation both call. Errors propagate to the caller (the
 * reconcile step has already persisted the error to sync_state).
 */
export async function runBillingSync(
	deps: RunBillingSyncDeps
): Promise<SyncSummary> {
	const now = deps.now ?? (() => new Date());
	const startedAt = now();

	const reconcileSummary = await reconcile(deps.db, {
		source: deps.source,
		sourceKey: deps.sourceKey,
		now,
	});

	const autoApproval = await autoApproveSettledMerchants(deps.db, {
		now,
		settlingHours: deps.settlingHours,
	});

	const commissionSummary = await generateCommissions(deps.db, { now });

	/* AFTER generation: four of the six rungs are functions of the commission
	   ledger, so awarding first would pay on yesterday's ledger and make a
	   partner wait a cycle for a rung they had already cleared. */
	const milestones = await awardMilestoneBonuses(deps.db, { now });

	return {
		startedAt,
		finishedAt: now(),
		autoApproval,
		milestones,
		reconcile: reconcileSummary,
		commissions: commissionSummary,
	};
}
