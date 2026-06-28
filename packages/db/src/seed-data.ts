/**
 * The canonical Edge app catalog (9 apps). `partnerApiGid` is the Shopify
 * Partner API app GID used to map an incoming `transactions` row back to an Edge
 * app. The values below are PLACEHOLDERS — replace them with the real GIDs from
 * the Partner Dashboard. They can be overridden at seed time without code
 * changes via an env var per app, e.g.:
 *
 *   PARTNER_API_GID_EDGE_BUNDLES="gid://partners/App/123456"
 *
 * (env key = `PARTNER_API_GID_` + slug uppercased with `-` → `_`).
 */
export interface EdgeAppSeed {
	name: string;
	partnerApiGid: string;
	slug: string;
}

export const EDGE_APPS: readonly EdgeAppSeed[] = [
	{
		slug: "edge-bundles",
		name: "Edge Bundles",
		partnerApiGid: "gid://partners/App/1000001",
	},
	{
		slug: "edge-timer",
		name: "Edge Timer",
		partnerApiGid: "gid://partners/App/1000002",
	},
	{
		slug: "edge-reviews",
		name: "Edge Reviews",
		partnerApiGid: "gid://partners/App/1000003",
	},
	{
		slug: "edge-cart",
		name: "Edge Cart",
		partnerApiGid: "gid://partners/App/1000004",
	},
	{
		slug: "edge-currency",
		name: "Edge Currency",
		partnerApiGid: "gid://partners/App/1000005",
	},
	{
		slug: "edge-subscriptions",
		name: "Edge Subscriptions",
		partnerApiGid: "gid://partners/App/1000006",
	},
	{
		slug: "edge-upsell",
		name: "Edge Upsell",
		partnerApiGid: "gid://partners/App/1000007",
	},
	{
		slug: "edge-rewards",
		name: "Edge Rewards",
		partnerApiGid: "gid://partners/App/1000008",
	},
	{
		slug: "edge-search",
		name: "Edge Search",
		partnerApiGid: "gid://partners/App/1000009",
	},
] as const;

/** Returns the env-overridden GID for an app slug, or its catalog default. */
export function resolveAppGid(app: EdgeAppSeed): string {
	const envKey = `PARTNER_API_GID_${app.slug.toUpperCase().replaceAll("-", "_")}`;
	return process.env[envKey] ?? app.partnerApiGid;
}
