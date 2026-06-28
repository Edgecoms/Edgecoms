import type { Database } from "@edgecoms/db";
import { apps } from "@edgecoms/db/schema/apps";
import { earningEvents } from "@edgecoms/db/schema/earnings";
import { merchants } from "@edgecoms/db/schema/merchants";
import { syncState } from "@edgecoms/db/schema/sync";
import { eq } from "drizzle-orm";
import {
	type EarningSource,
	type NormalizedEarning,
	PARTNER_API_SYNC_SOURCE,
	type ReconcileSummary,
} from "./types";

export interface ReconcileOptions {
	/** Safety bound on pages per run (prevents an unbounded loop). */
	maxPages?: number;
	now?: () => Date;
	source: EarningSource;
	sourceKey?: string;
}

const DEFAULT_MAX_PAGES = 10_000;

/**
 * Checkpointed ingestion of the earnings stream into the append-only
 * `earning_events` ledger. Idempotent on `shopifyTransactionId`
 * (conflict-do-nothing): re-running, or re-fetching the last page after a
 * crash, inserts ZERO duplicates. The cursor is checkpointed after every page,
 * so a failed run resumes where it left off. `merchantId`/`appId` are resolved
 * best-effort at ingest as a convenience snapshot — commission generation
 * re-resolves on the stable keys, so this never affects correctness and the row
 * is never updated afterward.
 */
export async function reconcile(
	db: Database,
	options: ReconcileOptions
): Promise<ReconcileSummary> {
	const sourceKey = options.sourceKey ?? PARTNER_API_SYNC_SOURCE;
	const now = options.now ?? (() => new Date());
	const maxPages = options.maxPages ?? DEFAULT_MAX_PAGES;

	const state = await db.query.syncState.findFirst({
		where: eq(syncState.id, sourceKey),
	});
	let cursor = state?.cursor ?? null;
	let lastEventAt = state?.lastEventAt ?? null;

	await writeSyncState(db, sourceKey, { lastRunStartedAt: now() });

	const appByGid = await loadAppsByGid(db);
	const merchantByDomain = new Map<string, string | null>();

	let pagesFetched = 0;
	let earningsSeen = 0;
	let earningsInserted = 0;

	try {
		for (let page = 0; page < maxPages; page++) {
			const result = await options.source.fetchPage(cursor);
			pagesFetched++;

			for (const earning of result.earnings) {
				earningsSeen++;
				const inserted = await insertEarning(
					db,
					earning,
					appByGid,
					merchantByDomain
				);
				if (inserted) {
					earningsInserted++;
				}
				if (!lastEventAt || earning.occurredAt > lastEventAt) {
					lastEventAt = earning.occurredAt;
				}
			}

			cursor = result.nextCursor;
			await writeSyncState(db, sourceKey, { cursor, lastEventAt });

			if (!result.hasNextPage) {
				break;
			}
		}

		const finishedAt = now();
		await writeSyncState(db, sourceKey, {
			cursor,
			lastEventAt,
			lastRunFinishedAt: finishedAt,
			lastSuccessAt: finishedAt,
			lastError: null,
		});

		return { pagesFetched, earningsSeen, earningsInserted, cursor };
	} catch (error) {
		await writeSyncState(db, sourceKey, {
			lastRunFinishedAt: now(),
			lastError: error instanceof Error ? error.message : String(error),
		});
		throw error;
	}
}

async function loadAppsByGid(db: Database): Promise<Map<string, string>> {
	const rows = await db
		.select({ id: apps.id, gid: apps.partnerApiGid })
		.from(apps);
	return new Map(rows.map((row) => [row.gid, row.id]));
}

async function resolveMerchantId(
	db: Database,
	shopDomain: string,
	cache: Map<string, string | null>
): Promise<string | null> {
	const cached = cache.get(shopDomain);
	if (cached !== undefined) {
		return cached;
	}
	const merchant = await db.query.merchants.findFirst({
		columns: { id: true },
		where: eq(merchants.shopDomain, shopDomain),
	});
	const id = merchant?.id ?? null;
	cache.set(shopDomain, id);
	return id;
}

async function insertEarning(
	db: Database,
	earning: NormalizedEarning,
	appByGid: Map<string, string>,
	merchantByDomain: Map<string, string | null>
): Promise<boolean> {
	const appId = earning.appPartnerApiGid
		? (appByGid.get(earning.appPartnerApiGid) ?? null)
		: null;
	const merchantId = await resolveMerchantId(
		db,
		earning.shopDomain,
		merchantByDomain
	);

	const inserted = await db
		.insert(earningEvents)
		.values({
			shopifyTransactionId: earning.shopifyTransactionId,
			shopDomain: earning.shopDomain,
			merchantId,
			appId,
			appPartnerApiGid: earning.appPartnerApiGid,
			grossAmount: earning.grossAmountMinor,
			shopifyFeeAmount: earning.shopifyFeeAmountMinor,
			netAmount: earning.netAmountMinor,
			currency: earning.currency,
			transactionType: earning.transactionType,
			occurredAt: earning.occurredAt,
		})
		.onConflictDoNothing({ target: earningEvents.shopifyTransactionId })
		.returning({ id: earningEvents.id });

	return inserted.length > 0;
}

type SyncStatePatch = Partial<{
	cursor: string | null;
	lastEventAt: Date | null;
	lastRunStartedAt: Date;
	lastRunFinishedAt: Date;
	lastSuccessAt: Date;
	lastError: string | null;
}>;

async function writeSyncState(
	db: Database,
	sourceKey: string,
	patch: SyncStatePatch
): Promise<void> {
	await db
		.insert(syncState)
		.values({ id: sourceKey, ...patch })
		.onConflictDoUpdate({ target: syncState.id, set: patch });
}
