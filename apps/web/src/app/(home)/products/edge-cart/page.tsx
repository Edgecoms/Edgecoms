"use client";

import { cn } from "@edgecoms/ui/lib/utils";
import { Check, Lock, Minus, Plus, ShoppingBag, Truck, X } from "lucide-react";
import { useState } from "react";
import { CartDemo } from "@/components/edge-cart/cart-demo";
import { ComparisonTable } from "@/components/edge-cart/comparison-table";
import {
	EmailDialogProvider,
	SendItToMeButton,
} from "@/components/edge-cart/email-dialog";
import {
	Card,
	Footnote,
	Section,
	SectionHeading,
} from "@/components/edge-cart/section";
import { ThresholdCalculator } from "@/components/edge-cart/threshold-calculator";
import { WalkthroughVideo } from "@/components/edge-cart/walkthrough-video";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { Reveal } from "@/components/ui/reveal";
import { EDGE_CART_APP_STORE_URL } from "@/lib/edge-cart-lead";
import {
	EDGE_CART_PLANS,
	FREE_PLAN_ORDER_CAP,
	VOLUME_BANDS,
} from "@/lib/edge-cart-pricing";
import { getProduct } from "@/lib/products";

/**
 * THE EDGE CART LANDING PAGE.
 *
 * The destination for paid Meta traffic, which is why it is shaped the way it
 * is: the demo in section four is the whole argument, and everything above it
 * exists to get a cold visitor to click "Add to cart" on a fake backpack.
 *
 * Three rules hold across the file, all of them inherited rather than invented:
 *
 * 1. **No outcome claims.** Nothing here states a conversion rate, a revenue
 *    figure or a performance number. The reporting section names the three
 *    metrics and describes what they measure; it does not say what they will
 *    say for you. See `marketing-stats.ts` for why the site is strict about it.
 * 2. **Copy carries no hard numbers except prices and limits.** Those are
 *    facts about what Edge charges, not claims about what a merchant will earn.
 * 3. **Tokens come from `components/edge-cart/section.tsx`.** Nothing on this
 *    page invents a colour, a radius or a type size.
 */

const product = getProduct("edge-cart");

/**
 * Section 3: the three failures of the default cart.
 */
const COST_CARDS = [
	{
		body: "Every redirect is a chance to leave. A drawer keeps them on the product they were already looking at.",
		title: "A page load between add and checkout",
	},
	{
		body: "The cart is the cheapest place in your store to sell a second product. Most stores leave it blank.",
		title: "No offer at peak intent",
	},
	{
		body: "If a shopper cannot see how close they are to free shipping, the threshold is not doing any work.",
		title: "A threshold nobody can see",
	},
] as const;

/** Section 5. */
const LEVERS = [
	{
		body: "Set a threshold above your average order value and the bar fills as they add. Free shipping, a percentage off, a free gift, or a custom reward you write yourself. Stack up to twenty tiers. Edge Cart creates the Shopify automatic discount behind each one, so the reward is real at checkout, not a promise in the drawer.",
		title: "Tiered rewards",
	},
	{
		body: "Trigger on every product, on named products, on a collection, or on a cart value. Set the priority when two rules match the same cart. Show up to ten recommendations under a heading you write.",
		title: "Rule-based upsells",
	},
	{
		body: "Gift wrap, shipping protection, a warranty, a rush option. One toggle for the shopper, one line of margin for you. Separate from upsells, so an add-on never eats an upsell slot.",
		title: "Add-ons",
	},
	{
		body: "A countdown you set in minutes with your own message. Announcements at the top of the drawer for a sale, a shipping cutoff, or a delivery estimate.",
		title: "Urgency you control",
	},
] as const;

/** Section 6. */
const TRIGGERS = [
	{
		fires: "Any cart at all",
		trigger: "Every product",
		use: "One hero accessory that suits everything you sell",
	},
	{
		fires: "Named products are in the cart",
		trigger: "Specific products",
		use: "The known pairing, like balm with a leather bag",
	},
	{
		fires: "Anything from a collection is in the cart",
		trigger: "Collection",
		use: "Category logic without listing every SKU by hand",
	},
	{
		fires: "The cart total crosses an amount you set",
		trigger: "Cart value",
		use: "The premium add-on that only makes sense on a larger basket",
	},
] as const;

/** Section 8: the eleven modules, each independently switchable. */
const MODULES = [
	"Header",
	"Announcements",
	"Tiered rewards",
	"Cart items",
	"Upsells",
	"Countdown timer",
	"Add-ons",
	"Discount codes",
	"Cart summary",
	"Trust badges",
	"Order notes",
] as const;

/** Section 9. */
const SAFETY_STEPS = [
	{
		body: "Changes land in a draft. The live cart is untouched.",
		number: "01",
		title: "Edit",
	},
	{
		body: "Check the draft against your theme before anyone sees it.",
		number: "02",
		title: "Preview",
	},
	{ body: "One click. Reversible.", number: "03", title: "Publish" },
] as const;

/** Section 11. Mechanism only. No figures, by rule 1 at the top of this file. */
const REPORTS = [
	{
		body: "How many shoppers actually opened the cart.",
		title: "Drawer impressions",
	},
	{
		body: "What share of those went through to checkout.",
		title: "Checkout conversion",
	},
	{
		body: "Revenue from upsells and add-ons only. Items already in the cart are excluded.",
		title: "Added revenue",
	},
] as const;

/** Section 14. */
const SETUP_STEPS = [
	"Install the app and enable the theme app extension.",
	"Match the drawer colours to your theme.",
	"Set your first reward tier above your average order value.",
	"Write one upsell rule and publish.",
] as const;

const PRIMARY_BUTTON =
	"inline-flex h-11 items-center justify-center rounded-lg bg-black px-5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800";

const SECONDARY_BUTTON =
	"inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 font-medium text-neutral-900 text-sm shadow-2xs transition-colors hover:bg-neutral-50";

/**
 * SECTION 1 — hero.
 *
 * Headline, badge and subheadline are the ones that were already here, read
 * from the catalog. Only the button row and the pricing line below it are new.
 */
function HeroSection() {
	const [cartCount, setCartCount] = useState(1);
	const [hasUpsell, setHasUpsell] = useState(false);

	const subtotal = 85 + (hasUpsell ? 14 : 0);
	const freeShippingThreshold = 100;
	const progressPercent = Math.min(
		100,
		(subtotal / freeShippingThreshold) * 100
	);

	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-white">
			<Frame className="relative pt-16 pb-12 sm:pt-20 sm:pb-16">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 [mask-image:radial-gradient(ellipse_100%_65%_at_50%_100%,black_30%,transparent_80%)]"
				/>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_85%_65%_at_50%_90%,rgba(59,130,246,0.15),rgba(37,99,235,0.1),transparent_75%)]"
				/>

				<div className="mx-auto max-w-[1080px] px-4 sm:px-6">
					<div className="relative z-20 flex max-w-[540px] flex-col items-start text-left">
						<Reveal>
							<span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 font-semibold text-blue-700 text-xs shadow-2xs">
								<span className="size-2 rounded-full bg-blue-600" />
								{product?.name ?? "Edge Cart"}
							</span>
						</Reveal>

						<Reveal delay={0.08}>
							<h1 className="mt-4 font-bold font-satoshi text-4xl text-neutral-900 leading-[1.08] tracking-tight sm:text-5xl lg:text-[52px]">
								{product?.tagline ??
									"The highest-intent moment in your funnel is doing nothing."}
							</h1>
						</Reveal>

						<Reveal delay={0.16}>
							<p className="mt-4 max-w-[480px] text-neutral-500 text-sm leading-relaxed sm:text-base">
								{product?.heroLead ??
									"A slide cart that opens without a page load, upsells chosen by rule instead of by guess, and free-shipping progress that moves as they add, all at the one moment the shopper has already decided to buy."}
							</p>
						</Reveal>

						<Reveal delay={0.24}>
							<div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
								<SendItToMeButton source="hero" />
								{/* A plain fragment link, deliberately. The smoothness comes
								    from `scroll-smooth` on the scroll container in the route
								    group's layout, which brings `motion-reduce:scroll-auto`
								    with it, so the OS setting is honoured by the browser
								    rather than by a handler that has to remember to ask. It
								    also still works with JavaScript off. */}
								<a className={SECONDARY_BUTTON} href="#live-demo">
									See the live demo
								</a>
							</div>
							<p className="mt-3 text-neutral-500 text-xs">
								Free up to {FREE_PLAN_ORDER_CAP} orders a month. Paid plans
								start at $14.99, and the full price table is on this page.
							</p>
						</Reveal>
					</div>

					{/* The floating drawer mockup. Static on purpose: the working one is
					    section four, and two live drawers on one page compete. */}
					<div className="relative mx-auto mt-10 w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-2xl sm:mt-6">
						<div className="flex items-center justify-between border-neutral-100 border-b pb-3">
							<div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
								<ShoppingBag className="size-4 text-blue-600" />
								<span>
									Your Shopping Cart ({cartCount + (hasUpsell ? 1 : 0)})
								</span>
							</div>
							<span aria-hidden="true" className="text-neutral-400">
								<X className="size-4" />
							</span>
						</div>

						<div className="my-4 rounded-xl border border-blue-100/80 bg-blue-50/60 p-3">
							<div className="mb-1.5 flex items-center justify-between font-semibold text-neutral-800 text-xs">
								<span className="flex items-center gap-1.5 text-blue-700">
									<Truck className="size-3.5" />
									{progressPercent >= 100 ? (
										<span className="font-bold text-emerald-700">
											Free shipping unlocked
										</span>
									) : (
										<span>
											Add ${(freeShippingThreshold - subtotal).toFixed(2)} more
											for Free Shipping
										</span>
									)}
								</span>
								<span className="font-mono">
									{Math.round(progressPercent)}%
								</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
								<div
									className="h-full rounded-full bg-blue-600 transition-all duration-300"
									style={{ width: `${progressPercent}%` }}
								/>
							</div>
						</div>

						<div className="flex gap-3 border-neutral-100 border-b py-3">
							<div
								aria-hidden="true"
								className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 font-bold text-neutral-500 text-xs"
							>
								Backpack
							</div>
							<div className="flex flex-1 flex-col justify-between">
								<div className="flex items-start justify-between">
									<span className="font-bold text-neutral-900 text-xs">
										Minimalist Leather Backpack
									</span>
									<span className="font-bold font-mono text-neutral-900 text-xs">
										$85.00
									</span>
								</div>
								<div className="mt-2 flex items-center justify-between">
									<span className="text-[10px] text-neutral-400">
										Color: Charcoal
									</span>
									<div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-2 py-0.5 text-xs">
										<button
											aria-label="Decrease quantity"
											onClick={() => setCartCount(Math.max(1, cartCount - 1))}
											type="button"
										>
											<Minus className="size-3" />
										</button>
										<span className="font-mono font-semibold">{cartCount}</span>
										<button
											aria-label="Increase quantity"
											onClick={() => setCartCount(cartCount + 1)}
											type="button"
										>
											<Plus className="size-3" />
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className="my-3 flex items-center justify-between rounded-2xl border border-amber-200/80 bg-amber-50/40 p-3">
							<div className="flex items-center gap-2.5">
								<div
									aria-hidden="true"
									className="flex size-10 items-center justify-center rounded-lg border border-amber-200 bg-amber-100 text-center font-bold text-[10px] text-amber-800 leading-tight"
								>
									Leather Care
								</div>
								<div>
									<div className="font-bold text-neutral-900 text-xs">
										Premium Leather Balm
									</div>
									<div className="text-[10px] text-neutral-500">
										Frequently bought together, +$14.00
									</div>
								</div>
							</div>
							<button
								className={cn(
									"rounded-lg px-3 py-1 font-semibold text-xs shadow-2xs transition-colors",
									hasUpsell
										? "bg-emerald-600 text-white"
										: "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
								)}
								onClick={() => setHasUpsell(!hasUpsell)}
								type="button"
							>
								{hasUpsell ? "Added" : "Add +"}
							</button>
						</div>

						<div className="mt-4 flex flex-col gap-2.5 border-neutral-200 border-t pt-3">
							<div className="flex items-center justify-between text-xs">
								<span className="text-neutral-500">Subtotal</span>
								<span className="font-bold font-mono text-neutral-900 text-sm">
									${subtotal.toFixed(2)}
								</span>
							</div>
							<button
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A31F4] py-3 font-semibold text-white text-xs shadow-xs transition-colors hover:bg-[#4a28cc]"
								type="button"
							>
								<Lock className="size-3.5" />
								<span>Checkout with Shop Pay</span>
							</button>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

/** SECTION 3 */
function CostSection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="The problem"
				heading="Your cart is the only page where nobody has to be sold."
				lede="They picked the product. They chose the variant. They clicked add. Then Shopify sends them to a page with a line item, a subtotal, and one button out. No offer, no reason to add one more thing, no idea how close they are to free shipping."
			/>
			<div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{COST_CARDS.map((card) => (
					<Card key={card.title}>
						<h3 className="font-bold text-base text-neutral-900 leading-snug">
							{card.title}
						</h3>
						<p className="mt-2 text-neutral-500 text-sm leading-relaxed">
							{card.body}
						</p>
					</Card>
				))}
			</div>
		</Section>
	);
}

/** SECTION 4 */
function DemoSection() {
	return (
		<Section id="live-demo">
			<SectionHeading
				eyebrow="Live demo"
				heading="Click add to cart. This is what your shoppers get."
				lede="Not a screenshot. The real drawer behaviour, running on this page."
			/>
			<CartDemo />
			<Footnote>
				Every module above is a toggle in the app. Turn any of them off.
			</Footnote>
			{/* After the interactive demo, not before it. The headline above tells
			    the reader to click add to cart, and a video between that
			    instruction and the buttons it refers to would break it. */}
			<WalkthroughVideo />
		</Section>
	);
}

/** SECTION 5 */
function LeversSection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="What moves the number"
				heading="Four levers, one drawer."
			/>
			<div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
				{LEVERS.map((lever) => (
					<Card key={lever.title}>
						<h3 className="font-bold text-base text-neutral-900">
							{lever.title}
						</h3>
						<p className="mt-2 text-neutral-500 text-sm leading-relaxed">
							{lever.body}
						</p>
					</Card>
				))}
			</div>
		</Section>
	);
}

/** SECTION 6 */
function RulesSection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="Upsell engine"
				heading="Recommendations chosen by rule, not by guess."
				lede="Most cart apps pick the upsell for you with a black box and no explanation. Edge Cart asks you what you already know about your own catalogue."
			/>
			<div className="mt-10 overflow-x-auto rounded-xl border border-neutral-200">
				<table className="w-full min-w-[560px] text-left text-xs">
					<thead className="border-neutral-200 border-b bg-neutral-50 font-medium text-neutral-500">
						<tr>
							<th className="px-4 py-3" scope="col">
								Trigger
							</th>
							<th className="px-4 py-3" scope="col">
								Fires when
							</th>
							<th className="px-4 py-3" scope="col">
								Use it for
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-neutral-100 text-neutral-700">
						{TRIGGERS.map((row) => (
							<tr key={row.trigger}>
								<th
									className="px-4 py-3 text-left font-medium text-neutral-900"
									scope="row"
								>
									{row.trigger}
								</th>
								<td className="px-4 py-3">{row.fires}</td>
								<td className="px-4 py-3">{row.use}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Footnote>
				When two rules match the same cart, priority decides which one shows.
				You set the priority.
			</Footnote>
		</Section>
	);
}

/** SECTION 7 */
function ThresholdSection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="Merchant math"
				heading="A threshold below your average order value costs you money."
				lede="If your AOV is $62 and free shipping unlocks at $50, you are paying for shipping on orders you had already won. All of them. Set the threshold above AOV and the bar becomes a reason to add one more thing instead of a discount on business you already had."
			/>
			<ThresholdCalculator />
			<Footnote>
				Edge Cart warns you before you save a tier below your AOV. Most cart
				apps just save it.
			</Footnote>
		</Section>
	);
}

/** SECTION 8 */
function DesignSection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="Design"
				heading="It should look like your theme, not like an app."
				lede="Left or right. Narrow, standard, wide, or full. Slide, fade, or no animation at all. Then set background, body text, headings, button, button text, price, compare-at price, border and accent to your own hex values."
			/>
			<ul className="mt-8 flex flex-wrap gap-2">
				{MODULES.map((module) => (
					<li
						className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 font-medium text-neutral-700 text-xs shadow-2xs"
						key={module}
					>
						<Check className="size-3 shrink-0 text-blue-600" />
						{module}
					</li>
				))}
			</ul>
			<Footnote>Eleven modules. Each one on or off, independently.</Footnote>
		</Section>
	);
}

/** SECTION 9 */
function SafetySection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="Safety"
				heading="Change the cart without holding your breath."
				lede="Every edit saves to a draft. Nothing reaches a shopper until you press publish. Duplicate the drawer you are running today, build the Black Friday version beside it, and swap the two in one click when the sale starts. Swap back the same way."
			/>
			<ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
				{SAFETY_STEPS.map((step, index) => (
					<li className="relative" key={step.number}>
						{/* The rule to the NEXT step, drawn inside this one rather than
						    as a single span across the list. The circles are left-aligned
						    in their columns, not centred, so a percentage-based line
						    across the whole row cannot line up with them: it has to start
						    where this circle ends and stop where the next one begins.
						    Absent on the last step, which is what kept the old one
						    running off the right edge. Desktop only, because the list
						    stacks below md and a horizontal rule would point at nothing. */}
						{index < SAFETY_STEPS.length - 1 ? (
							<span
								aria-hidden="true"
								className="pointer-events-none absolute top-5 -right-4 left-12 hidden border-neutral-200 border-t md:block"
							/>
						) : null}
						<span className="relative flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white font-bold font-mono text-neutral-900 text-xs shadow-2xs">
							{step.number}
						</span>
						<h3 className="mt-4 font-bold text-base text-neutral-900">
							{step.title}
						</h3>
						<p className="mt-1.5 text-neutral-500 text-sm leading-relaxed">
							{step.body}
						</p>
					</li>
				))}
			</ol>
		</Section>
	);
}

/** SECTION 10 */
function AgenticSection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="Agentic"
				heading="Run your cart from Claude."
				lede="Edge Cart ships an MCP server. Connect it once and you can ask an AI assistant to read your drawer settings, list your reward tiers, write a new upsell rule, or pull last month's added revenue, in plain English. Writes go to the draft. Publishing stays a decision you make."
			/>
			<div className="mt-10 overflow-x-auto rounded-2xl bg-neutral-950 p-5 shadow-lg sm:p-6">
				<p className="flex gap-3 font-mono text-neutral-100 text-xs leading-relaxed sm:text-sm">
					<span aria-hidden="true" className="shrink-0 text-emerald-400">
						&gt;
					</span>
					<span>
						Add a free gift tier at $120 and show me the drawer before it goes
						live.
					</span>
				</p>
			</div>
			<Footnote>No other cart app on Shopify does this yet.</Footnote>
		</Section>
	);
}

/** SECTION 11 */
function ReportingSection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="Reporting"
				heading="Three numbers, none of them vanity."
			/>
			<div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{REPORTS.map((report) => (
					<Card key={report.title}>
						<h3 className="font-bold text-base text-neutral-900">
							{report.title}
						</h3>
						<p className="mt-2 text-neutral-500 text-sm leading-relaxed">
							{report.body}
						</p>
					</Card>
				))}
			</div>
			<Footnote>
				Added revenue is the honest version. It is what the drawer earned, not
				what your store earned while the drawer happened to be installed.
			</Footnote>
		</Section>
	);
}

/** SECTION 12 */
function ComparisonSection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="Comparison"
				heading="The only free plan here that runs on a live store."
				lede="Both of the cart apps below advertise a free plan. Both of them mean a development store. Edge Cart's free plan runs on the store you actually sell from, with every cart feature on. The price rows are in the table too, because at higher volumes we are not the cheapest option and you should see that before you install rather than after."
			/>
			<ComparisonTable />
		</Section>
	);
}

/**
 * SECTION 13 — pricing.
 *
 * Reads `EDGE_CART_PLANS` and `VOLUME_BANDS`, which are transcribed from the
 * app's own billing screens. The volume table is published in full rather than
 * summarised: Growth is a base fee plus a usage fee, and a base fee shown on
 * its own would be the same half-truth this page criticises elsewhere.
 */
function PricingSection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="Pricing"
				heading="Start free. Pay for the volume you actually do."
				lede="Every plan includes every cart feature. Growth is a base fee plus a usage fee that steps up with your order volume, and the whole table is below, so the number you land on is one you can find before you install."
			/>

			<div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
				{EDGE_CART_PLANS.map((plan) => (
					<Card
						className={cn(
							"h-full",
							plan.popular && "border-blue-300 ring-1 ring-blue-200"
						)}
						key={plan.name}
					>
						<div className="flex items-center justify-between gap-2">
							<h3 className="font-bold text-base text-neutral-900">
								{plan.name} plan
							</h3>
							{plan.popular ? (
								<span className="rounded-full bg-blue-600 px-2 py-0.5 font-semibold text-[10px] text-white">
									Most popular
								</span>
							) : null}
						</div>

						<p className="mt-1 text-neutral-500 text-xs">{plan.tagline}</p>

						<p className="mt-4 font-bold font-satoshi text-3xl text-neutral-900 tracking-tight">
							{plan.price}
							<span className="font-medium font-sans text-base text-neutral-400">
								{plan.priceNote}
							</span>
						</p>
						<p className="mt-1.5 text-neutral-500 text-sm">{plan.includes}</p>
						{plan.note ? (
							<p className="mt-1 font-medium text-neutral-600 text-xs">
								{plan.note}
							</p>
						) : null}

						{/* `flex-1` so the list absorbs the height difference between a
						    three-bullet card and an eight-bullet one, which puts every
						    "Start for free" on the same line at the card floor. */}
						<ul className="mt-5 flex flex-1 flex-col gap-2">
							{plan.features.map((feature) => (
								<li
									className="flex items-start gap-2 text-neutral-600 text-xs leading-relaxed"
									key={feature}
								>
									<Check className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
									{feature}
								</li>
							))}
						</ul>

						<a
							className={cn(PRIMARY_BUTTON, "mt-6 w-full")}
							href={product?.appStoreUrl ?? EDGE_CART_APP_STORE_URL}
							rel="noopener noreferrer"
							target="_blank"
						>
							Start for free
						</a>
					</Card>
				))}
			</div>

			<div className="mt-8 overflow-x-auto rounded-xl border border-neutral-200">
				<table className="w-full min-w-[560px] text-left text-xs">
					<caption className="border-neutral-200 border-b bg-white px-4 py-3 text-left font-bold text-neutral-900 text-sm">
						How does pricing work?
					</caption>
					<thead className="border-neutral-200 border-b bg-neutral-50 font-medium text-neutral-500">
						<tr>
							<th className="px-4 py-3" scope="col">
								Volume of orders
							</th>
							<th className="px-4 py-3" scope="col">
								Base fee
							</th>
							<th className="px-4 py-3" scope="col">
								Usage fee
							</th>
							<th className="px-4 py-3" scope="col">
								Total charged
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-neutral-100 text-neutral-700">
						{VOLUME_BANDS.map((band) => (
							<tr key={band.volume}>
								<th
									className="px-4 py-3 text-left font-medium text-neutral-900"
									scope="row"
								>
									{band.volume}
								</th>
								<td className="px-4 py-3 font-mono">{band.base}</td>
								<td className="px-4 py-3 font-mono">{band.usage}</td>
								<td className="px-4 py-3 font-mono font-semibold text-neutral-900">
									{band.total}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Footnote>Cancel any time, from your Shopify admin.</Footnote>
		</Section>
	);
}

/** SECTION 14 */
function SetupSection() {
	return (
		<Section>
			<SectionHeading
				eyebrow="Getting started"
				heading="Live in an afternoon, and we do it with you."
			/>

			<ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
				{SETUP_STEPS.map((step, index) => (
					<li
						className="flex items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs"
						key={step}
					>
						<span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 font-bold font-mono text-neutral-900 text-xs">
							{(index + 1).toString().padStart(2, "0")}
						</span>
						<p className="text-neutral-700 text-sm leading-relaxed">{step}</p>
					</li>
				))}
			</ol>

			<div className="mt-8 flex flex-col items-start gap-4 rounded-3xl border border-blue-200/80 bg-blue-50/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
				<p className="max-w-[560px] text-neutral-700 text-sm leading-relaxed">
					Or send us your store URL and we will set it up on a call. Setup help
					is included on every plan, including the free one.
				</p>
				<SendItToMeButton className="shrink-0" source="setup-callout" />
			</div>
		</Section>
	);
}

/** SECTION 15 */
function FaqSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const faqItems = product?.faq ?? [];

	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-16 sm:py-20">
				<div className="px-6 text-center sm:px-8">
					<h2 className="font-bold font-satoshi text-3xl text-neutral-900 leading-[1.1] tracking-tight sm:text-4xl">
						Frequently asked questions
					</h2>

					{/* Twelve questions in one column is a long scroll, so they split
					    into two on desktop. The row styling is the one that was already
					    here, unchanged. */}
					<div className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-x-10 text-left lg:max-w-4xl lg:grid-cols-2">
						{faqItems.map((faq, idx) => {
							const isOpen = openIndex === idx;
							return (
								<div
									className="border-neutral-200/80 border-b py-1 first:border-t lg:[&:nth-child(2)]:border-t"
									key={faq.question}
								>
									<button
										aria-expanded={isOpen}
										className="flex w-full items-center justify-between py-3.5 text-left font-medium text-neutral-900 text-xs transition-colors hover:text-neutral-600 sm:text-sm"
										onClick={() => setOpenIndex(isOpen ? null : idx)}
										type="button"
									>
										<span>{faq.question}</span>
										<span className="ml-4 flex size-5 shrink-0 items-center justify-center text-neutral-500">
											{isOpen ? (
												<Minus className="size-3.5 text-neutral-700" />
											) : (
												<Plus className="size-3.5 text-neutral-500" />
											)}
										</span>
									</button>
									{isOpen && (
										<div className="pt-1 pb-4 text-neutral-500 text-xs leading-relaxed sm:text-sm">
											{faq.answer}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</Frame>
		</section>
	);
}

export default function EdgeCartPage() {
	if (!product) {
		return null;
	}

	return (
		<EmailDialogProvider>
			<main className="min-h-screen bg-white">
				<HeroSection />
				<Reveal>
					<LogoCloud />
				</Reveal>
				<Reveal>
					<CostSection />
				</Reveal>
				{/* Not wrapped in `Reveal`: the demo is the section the hero button
				    scrolls to, and an entrance animation on a scroll target fights
				    the scroll that brought the reader there. */}
				<DemoSection />
				<Reveal>
					<LeversSection />
				</Reveal>
				<Reveal>
					<RulesSection />
				</Reveal>
				<Reveal>
					<ThresholdSection />
				</Reveal>
				<Reveal>
					<DesignSection />
				</Reveal>
				<Reveal>
					<SafetySection />
				</Reveal>
				<Reveal>
					<AgenticSection />
				</Reveal>
				<Reveal>
					<ReportingSection />
				</Reveal>
				<Reveal>
					<ComparisonSection />
				</Reveal>
				<Reveal>
					<PricingSection />
				</Reveal>
				<Reveal>
					<SetupSection />
				</Reveal>
				<Reveal>
					<FaqSection />
				</Reveal>
				<CtaDark
					heading="Your cart already has the traffic. Make it earn."
					primaryExternal
					primaryHref={product.appStoreUrl ?? EDGE_CART_APP_STORE_URL}
					primaryLabel="Start for free"
					secondary={
						<SendItToMeButton
							className="h-11 px-6 font-medium text-[15px]"
							source="final-cta"
							tone="dark-outline"
						/>
					}
					sub="Free up to 10 orders a month on a live store, every cart feature included. Paid plans start at $14.99."
				/>
			</main>
		</EmailDialogProvider>
	);
}
