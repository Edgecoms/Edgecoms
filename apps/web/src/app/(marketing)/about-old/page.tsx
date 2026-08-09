import type { Metadata } from "next";
import { GridMarkers } from "@/components/home/grid-markers";
import { MarketingCta } from "@/components/marketing/marketing-cta";
import { Highlight } from "@/components/ui/highlight";

export const metadata: Metadata = {
	title: "About · Edge",
	description:
		"Edge is a studio of seven Shopify apps built by one team, and a partner program that pays the people who grow great merchants. Built for correctness and auditability.",
};

const VALUES = [
	{
		description:
			"Every app does one job exceptionally well. No feature bloat, no dark patterns. Software that respects the merchant and the shopper.",
		title: "Craft over clutter",
	},
	{
		description:
			"Partners earn when merchants succeed. We win together, over the long term, or not at all.",
		title: "Aligned incentives",
	},
	{
		description:
			"We move deliberately and build for durability. The boring guarantees, correctness and clarity and trust, are the ones that matter.",
		title: "Calm and considered",
	},
] as const;

/* These are the platform's actual invariants, not aspirations — each one is
   enforced in the data layer. Stated here because a company that moves other
   people's money should be legible about how it handles it. */
const GUARANTEES = [
	{
		description:
			"Every amount is stored as an integer in minor units with its currency code. No floating-point arithmetic ever touches money, not in conversion and not in commission.",
		label: "Money is never a float",
	},
	{
		description:
			"Commissions are immutable and the rate is frozen onto each one when it is generated. Renegotiating a partner's rate applies going forward and never rewrites unpaid history.",
		label: "History is never rewritten",
	},
	{
		description:
			"The earnings ledger is append-only and ingestion is idempotent on the Shopify transaction id. Re-running a sync is a no-op; exactly one commission exists per earning event.",
		label: "Nobody is ever paid twice",
	},
	{
		description:
			"Every commission traces back to the specific Shopify charge that produced it. A payout can be reconciled line by line instead of taken on trust.",
		label: "Every number has a source",
	},
] as const;

export default function AboutPage() {
	return (
		<>
			<section className="relative isolate w-full overflow-hidden">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_40%,black_25%,transparent_78%)]"
				/>
				<div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-6 px-6 pt-24 pb-16 text-left sm:items-center sm:gap-8 sm:text-center">
					<p className="font-medium text-body-sm text-brand">About Edge</p>
					<h1 className="text-balance font-medium text-display text-primary-foreground sm:text-display-lg">
						<Highlight>
							One team, seven apps, and a program that pays for the long term
						</Highlight>
					</h1>
				</div>
			</section>

			<section aria-labelledby="why-heading" className="w-full pb-16">
				<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 border-border border-t px-6 pt-16 lg:grid-cols-3 lg:gap-16">
					<h2
						className="font-medium text-h1 text-primary-foreground lg:sticky lg:top-24 lg:self-start"
						id="why-heading"
					>
						Why Edge exists
					</h2>
					<div className="flex flex-col gap-6 lg:col-span-2">
						<p className="text-pretty text-body-lg text-primary-foreground leading-relaxed">
							A growing Shopify store ends up running six apps from six vendors.
							Six subscriptions, six support inboxes, six scripts in the theme,
							six things that break the next time the theme changes. Every one
							of them was reasonable on its own. Together they are a tax, and
							that tax is why most stores stop installing anything at all.
						</p>
						<p className="text-pretty text-body-lg text-secondary-foreground leading-relaxed">
							Edge is the other answer. One team building the apps a store
							actually needs, from bundles and cart to urgency, reviews,
							currency, subscriptions, and the server-side tracking that tells
							you whether any of it worked, so they share a design language, a
							bill, and a single place to get help. Nothing you install makes
							the storefront look stitched together, because it was not stitched
							together.
						</p>
						<p className="text-pretty text-body-lg text-secondary-foreground leading-relaxed">
							We build them in the order our own stores needed them. Every app
							here exists because a number we were watching would not move, and
							the thing that would have moved it either did not exist or came
							bundled with forty settings we did not want.
						</p>
						<p className="text-pretty text-body-lg text-secondary-foreground leading-relaxed">
							The second half is the partner program. The agencies and
							consultants who run these stores are the reason merchants find
							good software at all, and most programs pay them for a click and
							then stop. We pay a share of revenue for as long as the merchant
							stays. No referral links, no attribution windows, no expiry.
						</p>
					</div>
				</div>
			</section>

			<section aria-labelledby="values-heading" className="w-full pb-16">
				<div className="mx-auto w-full max-w-7xl px-6">
					<div className="mx-auto flex max-w-2xl flex-col items-start gap-4 text-left sm:items-center sm:text-center">
						<h2
							className="text-balance font-medium text-h1 text-primary-foreground sm:text-display"
							id="values-heading"
						>
							What we believe
						</h2>
					</div>

					<div className="relative mt-16">
						<div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
							{VALUES.map((value) => (
								<div
									className="flex flex-col gap-3 bg-bg p-8 sm:p-10"
									key={value.title}
								>
									<h3 className="font-medium text-h3 text-primary-foreground">
										{value.title}
									</h3>
									<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
										{value.description}
									</p>
								</div>
							))}
						</div>

						<GridMarkers cols={3} rows={1} />
					</div>
				</div>
			</section>

			<section
				aria-labelledby="guarantees-heading"
				className="relative w-full pb-16"
			>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a3)_1px,transparent_1px)] [background-size:22px_22px]"
				/>
				<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 pt-24 lg:grid-cols-3 lg:gap-16">
					<div className="flex flex-col items-start gap-4 lg:sticky lg:top-24 lg:self-start">
						<h2
							className="text-balance font-medium text-h1 text-primary-foreground"
							id="guarantees-heading"
						>
							How we build
						</h2>
						<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
							Edge decides what partners get paid, so a wrong number is a real
							dispute rather than a rounding error. These are the rules the
							platform enforces, not the ones it intends to.
						</p>
					</div>

					<div className="relative lg:col-span-2">
						<dl className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
							{GUARANTEES.map((guarantee) => (
								<div
									className="flex flex-col gap-2.5 bg-bg p-8"
									key={guarantee.label}
								>
									<dt className="text-balance font-medium text-body text-primary-foreground">
										{guarantee.label}
									</dt>
									<dd className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
										{guarantee.description}
									</dd>
								</div>
							))}
						</dl>

						<GridMarkers cols={2} rows={2} />
					</div>
				</div>
			</section>

			<MarketingCta
				body="Explore the suite, or join the agencies and consultants earning recurring commission on every merchant they bring to Edge."
				heading="Your edge starts here"
				primary={{ href: "/products", label: "Explore the suite" }}
				secondary={{ href: "/partners", label: "Become a partner" }}
			/>
		</>
	);
}
