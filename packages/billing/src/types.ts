/**
 * The normalized earning — the ONLY shape the rest of the system sees. All
 * Shopify-specific shapes are confined to partner-api.ts and converted into
 * this type at the boundary (CLAUDE.md "Shopify boundary").
 */
export interface NormalizedEarning {
	/** Partner API app GID, used to map to an Edge app. Null if absent. */
	appPartnerApiGid: string | null;
	/** 3-char ISO currency code. */
	currency: string;
	/** Gross amount in integer minor units. */
	grossAmountMinor: bigint;
	/** Net to Edge in integer minor units — the commission base. */
	netAmountMinor: bigint;
	/** When the charge occurred per Shopify. */
	occurredAt: Date;
	/** Canonical, normalized `<store>.myshopify.com` domain. */
	shopDomain: string;
	/** Shopify's revenue share in integer minor units. */
	shopifyFeeAmountMinor: bigint;
	/** Shopify Partner API transaction id — the idempotency key. */
	shopifyTransactionId: string;
	/** Transaction kind, e.g. "app_subscription", "app_sale_credit". */
	transactionType: string;
}

/** One page of normalized earnings from a source, with its pagination cursor. */
export interface EarningPage {
	earnings: NormalizedEarning[];
	hasNextPage: boolean;
	/** Opaque cursor to resume after this page, or null when exhausted. */
	nextCursor: string | null;
}

/**
 * Abstract earning source. The real implementation is the Partner API adapter;
 * tests inject a fake. Keeps the engine free of any network/Shopify coupling.
 */
export interface EarningSource {
	/** Fetches the page of earnings AFTER `cursor` (null = from the beginning). */
	fetchPage(cursor: string | null): Promise<EarningPage>;
}

export interface ReconcileSummary {
	cursor: string | null;
	earningsInserted: number;
	earningsSeen: number;
	pagesFetched: number;
}

export interface CommissionSummary {
	commissionsCreated: number;
	commissionsSkipped: number;
}

export interface SyncSummary {
	commissions: CommissionSummary;
	error?: string;
	finishedAt: Date;
	reconcile: ReconcileSummary;
	startedAt: Date;
}

/** The single sync_state row key for the Partner API transactions stream. */
export const PARTNER_API_SYNC_SOURCE = "partner-api-transactions";
