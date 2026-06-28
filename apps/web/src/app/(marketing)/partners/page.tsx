import { ButtonLink } from "@edgecoms/ui/components/button";
import { ArrowRight } from "lucide-react";
import type { Metadata, Route } from "next";
import { PageHeader } from "@/components/marketing/page-header";

export const metadata: Metadata = {
	title: "Partner Program — Edge",
	description:
		"Register the merchants you manage and earn recurring commission for as long as they stay subscribed. No referral links — a real, lifetime partnership.",
};

const steps = [
	{
		step: "01",
		title: "Register your merchants",
		description:
			"You manage Shopify stores. Register the ones running Edge apps from your partner dashboard — no referral links, no tracking codes.",
	},
	{
		step: "02",
		title: "We approve & set your rate",
		description:
			"Edge reviews each merchant and approves you with a commission rate. Apps the store already paid for are grandfathered out — fairly.",
	},
	{
		step: "03",
		title: "Earn recurring commission",
		description:
			"Every month a merchant stays subscribed, you earn a share of Edge's net revenue. Lifetime, automatic, paid out on a clear schedule.",
	},
] as const;

const benefits = [
	{
		title: "Recurring revenue",
		description:
			"Monthly commission that compounds as your book of merchants grows with Edge.",
	},
	{
		title: "Lifetime commissions",
		description:
			"No expiry windows. You earn for as long as the merchant stays subscribed.",
	},
	{
		title: "A dedicated platform",
		description:
			"Register merchants, track every commission, and reconcile payouts from one dashboard.",
	},
	{
		title: "Partner-first support",
		description:
			"Priority help, early access to new apps, and a direct line to the Edge team.",
	},
] as const;

export default function PartnersPage() {
	return (
		<>
			<section className="relative w-full overflow-hidden">
				<div className="mx-auto w-full max-w-7xl px-6 pt-32 pb-20">
					<PageHeader
						eyebrow="Partner program"
						lead="Edge pays the agencies, consultants, and freelancers who bring great merchants to the platform — a recurring share of revenue, every month, for the life of the subscription."
						title="Grow recurring revenue with Edge."
					>
						<ButtonLink
							className="rounded-full"
							href={"/register" as Route}
							size="xl"
							variant="primary"
						>
							Apply to the program
							<ArrowRight aria-hidden="true" />
						</ButtonLink>
						<ButtonLink
							className="rounded-full"
							href={"/login" as Route}
							size="xl"
							variant="secondary"
						>
							Partner login
						</ButtonLink>
					</PageHeader>
				</div>
			</section>

			<section className="relative w-full">
				<div className="mx-auto w-full max-w-7xl px-6 pb-24">
					<div className="flex flex-col gap-3 pb-12">
						<h2 className="font-medium text-h1 text-primary-foreground tracking-tight">
							How it works
						</h2>
						<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
							A real partnership, not a referral link. You register the
							merchants you already manage, and you're paid for the relationship
							over time.
						</p>
					</div>

					<ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
						{steps.map((item) => (
							<li className="flex flex-col gap-4 bg-page p-8" key={item.step}>
								<span className="font-medium font-mono text-amber-500 text-label tracking-[0.1em]">
									{item.step}
								</span>
								<h3 className="font-medium text-h3 text-primary-foreground">
									{item.title}
								</h3>
								<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{item.description}
								</p>
							</li>
						))}
					</ol>
				</div>
			</section>

			<section className="relative w-full">
				<div className="mx-auto w-full max-w-7xl px-6 pb-24">
					<div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
						{benefits.map((benefit) => (
							<div className="flex flex-col gap-2" key={benefit.title}>
								<h3 className="font-semibold text-[13px] text-primary-foreground uppercase tracking-[0.08em]">
									{benefit.title}
								</h3>
								<p className="max-w-md text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{benefit.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="relative w-full">
				<div className="mx-auto w-full max-w-7xl px-6 pb-32">
					<div className="flex flex-col items-start gap-6 rounded-[2rem] border border-border bg-page p-10 sm:p-16">
						<h2 className="max-w-2xl text-balance font-medium text-h1 text-primary-foreground tracking-tight">
							Your edge starts here.
						</h2>
						<p className="max-w-xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
							Apply in minutes. Once approved, register your first merchant and
							start tracking commission the same day.
						</p>
						<ButtonLink
							className="rounded-full"
							href={"/register" as Route}
							size="xl"
							variant="primary"
						>
							Apply to the program
							<ArrowRight aria-hidden="true" />
						</ButtonLink>
					</div>
				</div>
			</section>
		</>
	);
}
