/**
 * EDGE CART PRICING, AS THE APP ACTUALLY BILLS IT.
 *
 * Transcribed from the app's own plan selector and its "How does pricing work?"
 * table, which is the billing contract the merchant agrees to. Everything on
 * the marketing page reads from here so the landing page and the invoice
 * cannot disagree.
 *
 * The shape matters, because it is not the shape a cart app usually has:
 *
 *   • Free is a real plan on a live store, capped at 10 orders a month.
 *   • Growth is a $14.99 base fee PLUS a usage fee that steps up with order
 *     volume. The first 100 orders each cycle carry no usage fee.
 *   • Enterprise is the only fixed-price plan: $299 a month, no usage fee.
 *
 * So Edge Cart is NOT flat-priced below Enterprise, and it does charge usage
 * fees. Any copy that says otherwise is false, and this file exists partly so
 * that nobody writes it again. See `volumeBands` for the exact steps.
 */

export interface EdgeCartPlan {
	/** Bullet list on the card. */
	features: readonly string[];
	/** The line under the price, from the app's own card. */
	includes: string;
	name: string;
	/** Second line under the price, where the plan has one. */
	note?: string;
	popular?: boolean;
	price: string;
	priceNote: string;
	/** The one-line positioning under the plan name. */
	tagline: string;
}

/** The features every plan carries, in the app's own words and order. */
const CART_FEATURES = [
	"High converting cart drawer",
	"Flexible and customizable design",
	"Rewards bar with tiers, free shipping, discounts and more",
	"Custom rewards based on cart items",
	"Upsells and add-ons on every purchase",
	"Custom CSS/HTML for highly tailored carts",
	"Discount codes",
	"Cart notes",
] as const;

export const EDGE_CART_PLANS: readonly EdgeCartPlan[] = [
	{
		features: CART_FEATURES,
		includes: "Up to 10 orders each month",
		name: "Free",
		price: "$0.00",
		priceNote: "/ per month",
		tagline: "for stores still finding their feet",
	},
	{
		features: CART_FEATURES,
		includes: "First 100 orders included each cycle",
		name: "Growth",
		note: "plus order volume based usage fees",
		popular: true,
		price: "$14.99",
		priceNote: "/ per month",
		tagline: "for stores past the free plan",
	},
	{
		features: [
			"Everything in Growth, plus:",
			"Priority support in app",
			"Priority support via email",
		],
		includes: "Unlimited orders, for larger stores",
		name: "Enterprise",
		note: "fixed price, no usage fees",
		price: "$299.00",
		priceNote: "/ per month",
		tagline: "for stores that want one number",
	},
] as const;

export interface VolumeBand {
	base: string;
	total: string;
	usage: string;
	volume: string;
}

/**
 * The full billing table. Published rather than summarised, because a base fee
 * quoted without its usage fee is the exact thing this page criticises other
 * apps for, and a merchant at three thousand orders should be able to find
 * their own number without asking.
 */
export const VOLUME_BANDS: readonly VolumeBand[] = [
	{
		base: "$0.00",
		total: "$0.00",
		usage: "$0.00",
		volume: "0 to 10 orders (Free plan)",
	},
	{
		base: "$14.99",
		total: "$14.99",
		usage: "$0.00",
		volume: "0 to 100 orders",
	},
	{
		base: "$14.99",
		total: "$29.99",
		usage: "$15.00",
		volume: "101 to 500 orders",
	},
	{
		base: "$14.99",
		total: "$44.99",
		usage: "$30.00",
		volume: "501 to 1,000 orders",
	},
	{
		base: "$14.99",
		total: "$59.99",
		usage: "$45.00",
		volume: "1,001 to 3,000 orders",
	},
	{
		base: "$14.99",
		total: "$129.99",
		usage: "$115.00",
		volume: "3,001 to 10,000 orders",
	},
	{
		base: "$14.99",
		total: "$199.99",
		usage: "$185.00",
		volume: "10,001+ orders",
	},
	{
		base: "$299.00",
		total: "$299.00",
		usage: "$0.00",
		volume: "Enterprise plan",
	},
] as const;

/**
 * What a store doing two thousand orders a month actually pays, which is the
 * band the comparison section is anchored on. Derived rather than retyped so
 * the two sections cannot drift.
 */
const TWO_THOUSAND_ORDER_BAND = VOLUME_BANDS.find(
	(band) => band.volume === "1,001 to 3,000 orders"
);

export const PRICE_AT_2000_ORDERS = TWO_THOUSAND_ORDER_BAND?.total ?? "$59.99";
export const USAGE_FEE_AT_2000_ORDERS =
	TWO_THOUSAND_ORDER_BAND?.usage ?? "$45.00";

/** The free plan's order cap, quoted in the hero and the closing panel. */
export const FREE_PLAN_ORDER_CAP = 10;
