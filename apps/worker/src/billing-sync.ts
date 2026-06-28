import { createPartnerApiSource } from "@edgecoms/billing/partner-api";
import { runBillingSync } from "@edgecoms/billing/run-sync";
import { db, pool } from "@edgecoms/db";
import { env } from "@edgecoms/env/server";

// Railway CRON entrypoint for the billing-sync job (schedule "0 */6 * * *").
//
// CRITICAL (CLAUDE.md "Railway cron"): this process MUST close its DB pool and
// exit when done. If it stays alive, Railway skips the next scheduled run.

function logLine(
	level: "info" | "error",
	message: string,
	fields: Record<string, unknown> = {}
): void {
	const entry = {
		level,
		message,
		time: new Date().toISOString(),
		job: "billing-sync",
		...fields,
	};
	process.stdout.write(`${JSON.stringify(entry)}\n`);
}

async function main(): Promise<void> {
	if (!(env.PARTNER_API_ORGANIZATION_ID && env.PARTNER_API_ACCESS_TOKEN)) {
		throw new Error(
			"PARTNER_API_ORGANIZATION_ID and PARTNER_API_ACCESS_TOKEN must be set"
		);
	}

	logLine("info", "billing-sync started");

	const source = createPartnerApiSource({
		organizationId: env.PARTNER_API_ORGANIZATION_ID,
		accessToken: env.PARTNER_API_ACCESS_TOKEN,
		apiVersion: env.PARTNER_API_VERSION,
	});

	const summary = await runBillingSync({ db, source });

	logLine("info", "billing-sync complete", {
		durationMs: summary.finishedAt.getTime() - summary.startedAt.getTime(),
		pagesFetched: summary.reconcile.pagesFetched,
		earningsSeen: summary.reconcile.earningsSeen,
		earningsInserted: summary.reconcile.earningsInserted,
		commissionsCreated: summary.commissions.commissionsCreated,
		commissionsSkipped: summary.commissions.commissionsSkipped,
		cursor: summary.reconcile.cursor,
	});
}

main()
	.then(() => pool.end())
	.then(() => process.exit(0))
	.catch((error) => {
		logLine("error", "billing-sync failed", {
			error: error instanceof Error ? error.message : String(error),
		});
		pool.end().finally(() => process.exit(1));
	});
