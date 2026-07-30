import {
	Blocks,
	type LucideIcon,
	ReceiptText,
	Repeat,
	ShieldCheck,
	Store,
	Unlink,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

const INLINE_LINK_CLASS =
	"text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current";

interface Feature {
	description: ReactNode;
	icon: LucideIcon;
	title: string;
}

const FEATURES: readonly Feature[] = [
	{
		icon: Repeat,
		title: "Lifetime commissions",
		description: (
			<>
				No expiry windows. Partners earn for as long as the merchant stays
				subscribed — see the{" "}
				<Link className={INLINE_LINK_CLASS} href={"/partners" as Route}>
					partner program
				</Link>
				.
			</>
		),
	},
	{
		icon: Unlink,
		title: "No referral links",
		description:
			"Register the merchants you already manage. No tracking codes, no attribution windows to babysit.",
	},
	{
		icon: ShieldCheck,
		title: "Grandfathered, fairly",
		description:
			"Apps a store already paid for are excluded at approval, so nobody earns on revenue they didn't bring.",
	},
	{
		icon: Blocks,
		title: "Focused apps, no bloat",
		description: (
			<>
				Each app does one job exceptionally well. Run one or run{" "}
				<Link className={INLINE_LINK_CLASS} href={"/products" as Route}>
					the whole suite
				</Link>{" "}
				— they are built to work better together.
			</>
		),
	},
	{
		icon: Store,
		title: "Billed through Shopify",
		description:
			"Merchants pay on the Shopify invoice they already get. No separate checkout, no new payment method.",
	},
	{
		icon: ReceiptText,
		title: "Auditable by design",
		description:
			"Rates are frozen onto each commission when it is generated, so renegotiating never rewrites unpaid history.",
	},
] as const;

/* Line intersections for the 3x2 desktop grid. Markers are decorative and only
   render at lg, where the column count is known — below that the grid reflows
   to 2 or 1 columns and these percentages would no longer sit on the lines. */
const MARKER_X = ["0%", "33.3333%", "66.6667%", "100%"] as const;
const MARKER_Y = ["0%", "50%", "100%"] as const;

function FeatureCell({ feature }: { feature: Feature }) {
	const Icon = feature.icon;
	return (
		<div className="flex flex-col gap-3 bg-bg p-8 sm:p-10">
			<Icon
				aria-hidden="true"
				className="size-6 text-primary-foreground"
				strokeWidth={1.5}
			/>
			<h3 className="font-medium text-body text-primary-foreground">
				{feature.title}
			</h3>
			<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
				{feature.description}
			</p>
		</div>
	);
}

export function FeaturesHome() {
	return (
		<section
			aria-labelledby="features-heading"
			className="relative w-full pb-24"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a3)_1px,transparent_1px)] [background-size:22px_22px]"
			/>

			<h2 className="sr-only" id="features-heading">
				Why build on Edge
			</h2>

			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="relative">
					<div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
						{FEATURES.map((feature) => (
							<FeatureCell feature={feature} key={feature.title} />
						))}
					</div>

					{/* Small squares pinned to each line crossing, matching the
					    blueprint-style corner markers in the reference. */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 hidden lg:block"
					>
						{MARKER_X.map((x) =>
							MARKER_Y.map((y) => (
								<span
									className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 border border-border bg-bg"
									key={`${x}-${y}`}
									style={{ left: x, top: y }}
								/>
							))
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
