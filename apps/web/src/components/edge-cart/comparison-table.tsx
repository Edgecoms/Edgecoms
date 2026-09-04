import { cn } from "@edgecoms/ui/lib/utils";
import {
	PRICE_AT_2000_ORDERS,
	USAGE_FEE_AT_2000_ORDERS,
} from "@/lib/edge-cart-pricing";

/**
 * THE COMPARISON TABLE.
 *
 * Every competitor cell below was read off the live Shopify App Store listing
 * on the date in `VERIFIED_ON`, not recalled. The two listings:
 *
 *   • UpCart              https://apps.shopify.com/upcart-cart-builder
 *   • Kaching CartDrawer  https://apps.shopify.com/cart-upsell
 *
 * Rules for whoever edits this next:
 *
 * 1. **Never fill a cell from memory.** App pricing changes without notice.
 *    Open the listing, read the plan selector, type what is on the screen, and
 *    move `VERIFIED_ON` to the day you did it.
 * 2. **"Not listed" is a real answer.** Where a listing does not state
 *    something, the cell says so rather than asserting a "No" we cannot
 *    support. An unfair comparison table is a competitor complaint and an App
 *    Store policy problem, and it is also just wrong.
 * 3. **The price rows stay.** At two thousand orders Edge Cart is not the
 *    cheapest option here, and the table says the number anyway. They sit at
 *    the bottom because price is not what this section claims, not so they are
 *    easy to miss. Do not delete them to make the grid look better.
 */

/** The single source for the footnote date. Move it whenever you re-verify. */
const VERIFIED_ON = "5 September 2026";

/** Used where a listing simply does not say. See rule 2. */
const NOT_LISTED = "Not listed";

interface ComparisonRow {
	edgeCart: string;
	kaching: string;
	label: string;
	shopify: string;
	upcart: string;
}

/**
 * Ordered by what the section is actually claiming.
 *
 * The free-plan row leads because it is the one real, checkable difference:
 * both competitors call a development-store trial a free plan. The price rows
 * are last rather than absent. At two thousand orders Edge Cart is the most
 * expensive option in this table, and a comparison that quietly drops the row
 * it loses is not a comparison, it is an ad with a grid around it.
 */
const ROWS: readonly ComparisonRow[] = [
	{
		edgeCart: "Yes, up to 10 orders a month",
		kaching: "No, development stores only",
		label: "Free plan on a live store",
		shopify: "Included with Shopify",
		upcart: "No, development and partner stores only",
	},
	{
		edgeCart: "Yes",
		kaching: "Yes, plans differ by order volume",
		label: "All features on every plan",
		shopify: "Not applicable",
		upcart: "Yes, plans differ by order volume",
	},
	{
		edgeCart: "Yes",
		kaching: NOT_LISTED,
		label: "Draft and publish workflow",
		shopify: "No",
		upcart: NOT_LISTED,
	},
	{
		edgeCart: "Yes, an MCP server",
		kaching: NOT_LISTED,
		label: "Control from an AI assistant",
		shopify: "No",
		upcart: NOT_LISTED,
	},
	{
		edgeCart: "Yes, on every plan",
		kaching: NOT_LISTED,
		label: "Setup done with you",
		shopify: "No",
		upcart: NOT_LISTED,
	},
	{
		/* $14.99 base + the usage fee for the 1,001 to 3,000 order band. */
		edgeCart: `${PRICE_AT_2000_ORDERS} total`,
		/* Kaching's top tier carries no stated order limit. */
		kaching: "$24.99",
		label: "Monthly price at 2,000 orders",
		shopify: "$0, included with Shopify",
		/* UpCart publishes no tier above 1,000 orders. */
		upcart: "Not published above 1,000 orders",
	},
	{
		edgeCart: `${USAGE_FEE_AT_2000_ORDERS} at 2,000 orders`,
		kaching: "None listed",
		label: "Usage fees on top",
		shopify: "None",
		upcart: "None listed",
	},
] as const;

function Cell({ value }: { value: string }) {
	return (
		<td
			className={cn(
				"px-4 py-3 align-middle",
				value === NOT_LISTED ? "text-neutral-400" : "text-neutral-700"
			)}
		>
			{value}
		</td>
	);
}

export function ComparisonTable() {
	return (
		<div className="mt-10">
			{/* Scrolls inside its own box. Four columns cannot fit at 375px and the
			    page itself must never scroll sideways. */}
			<div className="overflow-x-auto rounded-xl border border-neutral-200">
				<table className="w-full min-w-[720px] text-left text-xs">
					<caption className="sr-only">
						Edge Cart compared with UpCart, Kaching CartDrawer and the Shopify
						default cart on free plans, features and price
					</caption>
					<thead className="border-neutral-200 border-b bg-neutral-50 font-medium text-neutral-500">
						<tr>
							<th className="px-4 py-3 font-medium" scope="col" />
							<th
								className="border-neutral-200 border-x bg-blue-50/70 px-4 py-3 font-bold text-blue-800"
								scope="col"
							>
								Edge Cart
							</th>
							<th className="px-4 py-3 font-medium" scope="col">
								UpCart
							</th>
							<th className="px-4 py-3 font-medium" scope="col">
								Kaching CartDrawer
							</th>
							<th className="px-4 py-3 font-medium" scope="col">
								Shopify default cart
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-neutral-100">
						{ROWS.map((row) => (
							<tr key={row.label}>
								<th
									className="px-4 py-3 text-left font-medium text-neutral-900"
									scope="row"
								>
									{row.label}
								</th>
								<td className="border-neutral-200 border-x bg-blue-50/40 px-4 py-3 font-semibold text-neutral-900">
									{row.edgeCart}
								</td>
								<Cell value={row.upcart} />
								<Cell value={row.kaching} />
								<Cell value={row.shopify} />
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<p className="mt-4 text-neutral-500 text-xs leading-relaxed">
				Competitor pricing verified {VERIFIED_ON} against each app's Shopify App
				Store listing. Check current listings before relying on it. "Not listed"
				means the listing does not say, not that the app cannot do it.
			</p>
		</div>
	);
}
