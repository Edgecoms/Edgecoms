import type { Database } from "@edgecoms/db";
import { generateCommissions } from "./commissions";
import { reconcile } from "./reconcile";
import type { EarningSource, SyncSummary } from "./types";

export interface RunBillingSyncDeps {
	db: Database;
	now?: () => Date;
	source: EarningSource;
	sourceKey?: string;
}

/**
 * A full billing pass: ingest the latest earnings (checkpointed, idempotent)
 * then generate any missing commissions. Pure orchestration over `reconcile`
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

	const commissionSummary = await generateCommissions(deps.db, { now });

	return {
		startedAt,
		finishedAt: now(),
		reconcile: reconcileSummary,
		commissions: commissionSummary,
	};
}
