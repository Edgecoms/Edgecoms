import { decimalStringToMinorUnits } from "./money";
import type { EarningPage, EarningSource, NormalizedEarning } from "./types";

/**
 * THE SHOPIFY BOUNDARY. All Partner-API-shaped code lives here. Everything else
 * consumes the normalized `NormalizedEarning`. Billing runs on the stable,
 * GA `transactions` Partner API — not the 2026-07 RC subscription APIs. When
 * those reach GA, only this file changes (CLAUDE.md "Shopify boundary").
 */

const SCHEME_PATTERN = /^[a-z]+:\/\//;
const LEADING_WWW_PATTERN = /^www\./;
const MYSHOPIFY_SUFFIX = ".myshopify.com";

/**
 * Normalizes any store reference (URL, bare handle, custom domain) to a
 * canonical, lowercased `<store>.myshopify.com` domain. This is the dedup key
 * for merchants — call it before insert (CLAUDE.md "Attribution"). Used by both
 * ingestion and partner merchant registration.
 */
export function normalizeShopDomain(input: string): string {
	let value = input.trim().toLowerCase();
	value = value.replace(SCHEME_PATTERN, "");
	value = value.split("/")[0] ?? value;
	value = value.split("?")[0] ?? value;
	value = value.replace(LEADING_WWW_PATTERN, "");

	if (value === "") {
		throw new Error("Empty shop domain");
	}
	if (value.endsWith(MYSHOPIFY_SUFFIX)) {
		return value;
	}
	// A bare handle becomes the canonical myshopify domain.
	if (!value.includes(".")) {
		return `${value}${MYSHOPIFY_SUFFIX}`;
	}
	// A custom/primary domain is kept as-is; the unique constraint still dedups.
	return value;
}

// ── Raw Partner API shapes (do not leak outside this file) ──────────────────

interface RawMoney {
	amount: string;
	currencyCode: string;
}

interface RawPartnerTransaction {
	__typename: string;
	app?: { id: string } | null;
	createdAt: string;
	grossAmount?: RawMoney | null;
	id: string;
	netAmount: RawMoney;
	shop?: { myshopifyDomain: string } | null;
	shopifyFee?: RawMoney | null;
}

/** Maps a Partner API transaction `__typename` to our stored transaction type. */
const TRANSACTION_TYPE_BY_TYPENAME: Record<string, string> = {
	AppSubscriptionSale: "app_subscription",
	AppOneTimeSale: "app_one_time",
	AppUsageSale: "app_usage",
	AppSaleAdjustment: "app_sale_adjustment",
	AppSaleCredit: "app_sale_credit",
};

const ZERO_MONEY: RawMoney = { amount: "0", currencyCode: "USD" };

/**
 * Converts one raw Partner API transaction into a normalized earning. The
 * currency comes from the net amount; gross/fee default to zero when Shopify
 * omits them. All conversions use integer money math (no float).
 */
export function normalizeTransaction(
	raw: RawPartnerTransaction
): NormalizedEarning {
	const currency = raw.netAmount.currencyCode;
	const gross = raw.grossAmount ?? ZERO_MONEY;
	const fee = raw.shopifyFee ?? ZERO_MONEY;

	return {
		shopifyTransactionId: raw.id,
		shopDomain: raw.shop ? normalizeShopDomain(raw.shop.myshopifyDomain) : "",
		appPartnerApiGid: raw.app?.id ?? null,
		grossAmountMinor: decimalStringToMinorUnits(gross.amount, currency),
		shopifyFeeAmountMinor: decimalStringToMinorUnits(fee.amount, currency),
		netAmountMinor: decimalStringToMinorUnits(raw.netAmount.amount, currency),
		currency,
		transactionType:
			TRANSACTION_TYPE_BY_TYPENAME[raw.__typename] ?? raw.__typename,
		occurredAt: new Date(raw.createdAt),
	};
}

// ── Live Partner API source (GraphQL over HTTPS) ────────────────────────────

export interface PartnerApiConfig {
	accessToken: string;
	apiVersion?: string;
	/** Override the endpoint (tests/staging). */
	endpointUrl?: string;
	fetchImpl?: typeof fetch;
	organizationId: string;
	/** Page size, default 100 (Partner API max). */
	pageSize?: number;
}

const DEFAULT_API_VERSION = "2026-04";
const DEFAULT_PAGE_SIZE = 100;

// The app-revenue transaction fields. They live on each CONCRETE sale type
// (which implement Node + Transaction) — there is no shared `AppCharge` type
// to fragment on, so the selection is spread per type via inline fragments.
// Validated against the Partner API schema (objects/AppSaleCredit etc.).
const TXN_FIELDS = `
          id
          createdAt
          netAmount { amount currencyCode }
          grossAmount { amount currencyCode }
          shopifyFee { amount currencyCode }
          app { id }
          shop { myshopifyDomain }`;

const APP_SALE_TYPES = [
	"AppSubscriptionSale",
	"AppOneTimeSale",
	"AppUsageSale",
	"AppSaleAdjustment",
	"AppSaleCredit",
] as const;

const TRANSACTIONS_QUERY = `
query EdgeTransactions($cursor: String, $first: Int!) {
  transactions(
    first: $first
    after: $cursor
    types: [APP_SUBSCRIPTION_SALE, APP_ONE_TIME_SALE, APP_USAGE_SALE, APP_SALE_ADJUSTMENT, APP_SALE_CREDIT]
  ) {
    pageInfo { hasNextPage }
    edges {
      cursor
      node {
        __typename
${APP_SALE_TYPES.map((type) => `        ... on ${type} {${TXN_FIELDS}\n        }`).join("\n")}
      }
    }
  }
}`;

interface TransactionsResponse {
	data?: {
		transactions: {
			pageInfo: { hasNextPage: boolean };
			edges: { cursor: string; node: RawPartnerTransaction }[];
		};
	};
	errors?: { message: string }[];
}

/**
 * The live Partner API earning source. Pages through the GA `transactions`
 * stream and normalizes each node at the boundary.
 */
export function createPartnerApiSource(
	config: PartnerApiConfig
): EarningSource {
	const apiVersion = config.apiVersion ?? DEFAULT_API_VERSION;
	const pageSize = config.pageSize ?? DEFAULT_PAGE_SIZE;
	const doFetch = config.fetchImpl ?? fetch;
	const endpoint =
		config.endpointUrl ??
		`https://partners.shopify.com/${config.organizationId}/api/${apiVersion}/graphql.json`;

	return {
		async fetchPage(cursor: string | null): Promise<EarningPage> {
			const response = await doFetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Shopify-Access-Token": config.accessToken,
				},
				body: JSON.stringify({
					query: TRANSACTIONS_QUERY,
					variables: { cursor, first: pageSize },
				}),
			});

			if (!response.ok) {
				throw new Error(
					`Partner API request failed: ${response.status} ${response.statusText}`
				);
			}

			const payload = (await response.json()) as TransactionsResponse;
			if (payload.errors?.length) {
				throw new Error(
					`Partner API errors: ${payload.errors.map((e) => e.message).join("; ")}`
				);
			}

			const connection = payload.data?.transactions;
			const edges = connection?.edges ?? [];

			return {
				earnings: edges.map((edge) => normalizeTransaction(edge.node)),
				nextCursor: edges.at(-1)?.cursor ?? cursor,
				hasNextPage: connection?.pageInfo.hasNextPage ?? false,
			};
		},
	};
}
