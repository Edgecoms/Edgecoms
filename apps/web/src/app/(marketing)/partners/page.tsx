import {
	Infinity as InfinityIcon,
	LayoutDashboard,
	LifeBuoy,
	ReceiptText,
	Unlink,
} from "lucide-react";
import type { Metadata } from "next";
import {
	type CtaRailItem,
	MarketingCta,
} from "@/components/marketing/marketing-cta";
import { EarningsCalculator } from "@/components/partners/earnings-calculator";
import { HowItWorks } from "@/components/partners/how-it-works";
import { PartnerFaq } from "@/components/partners/partner-faq";
import { PartnersHero } from "@/components/partners/partners-hero";
import { ProgramCompare } from "@/components/partners/program-compare";

export const metadata: Metadata = {
	title: "Partner Program — Edge",
	description:
		"Register the merchants you manage and earn recurring commission for as long as they stay subscribed. No referral links, no attribution windows — a real, lifetime partnership.",
};

const RAIL_ITEMS: readonly CtaRailItem[] = [
	{ icon: InfinityIcon, label: "Lifetime — no expiry windows" },
	{ icon: Unlink, label: "No referral links or tracking codes" },
	{ icon: ReceiptText, label: "Your rate frozen onto every commission" },
	{
		icon: LayoutDashboard,
		label: "Every commission itemised in one dashboard",
	},
	{ icon: LifeBuoy, label: "Priority partner support" },
];

export default function PartnersPage() {
	return (
		<>
			<PartnersHero />

			<section aria-labelledby="earnings-heading" className="w-full py-24">
				<div className="mx-auto w-full max-w-7xl px-6">
					<div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
						<h2
							className="text-balance font-medium text-display text-primary-foreground"
							id="earnings-heading"
						>
							What the book is worth
						</h2>
						<p className="text-pretty text-body-lg text-secondary-foreground leading-relaxed">
							Commission is recurring and has no end date, so every merchant you
							register raises a floor that never drops. Move the sliders to see
							the shape of it.
						</p>
					</div>

					<div className="mt-16">
						<EarningsCalculator />
					</div>
				</div>
			</section>

			<ProgramCompare />
			<HowItWorks />
			<PartnerFaq />

			<MarketingCta
				body="Apply in minutes. Once approved, register your first merchant and start tracking commission the same day."
				heading="Start earning with Edge"
				primary={{ href: "/register", label: "Apply to the program" }}
				railItems={RAIL_ITEMS}
				secondary={{ href: "/contact", label: "Talk to us" }}
			/>
		</>
	);
}
