import type { Metadata } from "next";
import { AppsField } from "@/components/landing/apps-field";
import { CtaDark } from "@/components/landing/cta-dark";
import type { Feature } from "@/components/landing/feature-tabs";
import { Hero } from "@/components/landing/hero";
import { Integrations } from "@/components/landing/integrations";
import { LogoCloud } from "@/components/landing/logo-cloud";
import {
	type PillarQuote,
	PillarSection,
} from "@/components/landing/pillar-section";
import { ProductPreview } from "@/components/landing/product-preview";
import { RewardCards } from "@/components/landing/reward-cards";
import { Scale } from "@/components/landing/scale";
import { Statement } from "@/components/landing/statement";
import { Trusted } from "@/components/landing/trusted";
import { Reveal } from "@/components/ui/reveal";
import { HOME_TESTIMONIALS } from "@/lib/marketing-stats";

export const metadata: Metadata = {
	title: "Edge · Turn traffic into revenue",
	description:
		"Edge is the Shopify app suite for higher order value, better conversion rate, and revenue that repeats. Bundles, cart, timer, reviews, currency, subscriptions, and server-side tracking — free plans on most of them.",
};

const APP_FEATURES: readonly Feature[] = [
	{
		body: "Volume tiers and buy-one-get-one offers where the saving visibly grows as the shopper moves up the list.",
		href: "/products/edge-bundles",
		title: "Bundles & volume tiers",
	},
	{
		body: "A slide cart that opens without a page load, with upsells chosen by rule at the one moment the shopper has already said yes.",
		href: "/products/edge-cart",
		title: "Cart upsells",
	},
	{
		body: "Countdowns, photo reviews, local currency and auto-refill — each one a separate app, so you only load what you switched on.",
		href: "/products",
		title: "Five more, each focused",
	},
];

const RESULT_FEATURES: readonly Feature[] = [
	{
		body: "More of the visitors you already have decide to buy, measured in your own Shopify analytics rather than ours.",
		href: "/products/edge-reviews",
		title: "Conversion rate",
	},
	{
		body: "Each of those buyers spends more on the way through, without a discount code touching your hero product's price.",
		href: "/products/edge-bundles",
		title: "Average order value",
	},
	{
		body: "Server-side conversions, so the ad platforms see the sales they actually drove and you switch off the right campaigns.",
		href: "/products/trackproof",
		title: "Attribution you can act on",
	},
];

const PARTNER_FEATURES: readonly Feature[] = [
	{
		body: "Register the merchants you already manage. No referral links, no attribution windows, no cookie to lose.",
		href: "/partners",
		title: "Register, don't refer",
	},
	{
		body: "A recurring share of net Edge revenue for as long as the merchant stays subscribed. There is no expiry.",
		href: "/partners",
		title: "Lifetime commission",
	},
	{
		body: "Your rate is frozen onto every commission when it is generated, so renegotiating applies going forward and never rewrites history.",
		href: "/register",
		title: "Rates you can audit",
	},
];

/* Quotes come from the shared placeholder set rather than being written here,
   so there is exactly one file to empty when the real ones arrive. Every one of
   them is still flagged `invented` at source. */
const [MATATA_QUOTE, VYSSENCE_QUOTE, , KLYRO_QUOTE] = HOME_TESTIMONIALS;

const APP_QUOTE: PillarQuote = {
	attribution: VYSSENCE_QUOTE.attribution,
	logo: "/case-studies/vyssence-logo.png",
	logoAlt: "Vyssence",
	quote: VYSSENCE_QUOTE.quote,
};

const RESULT_QUOTE: PillarQuote = {
	attribution: KLYRO_QUOTE.attribution,
	logo: "/case-studies/klyrolight-logo.png",
	logoAlt: "Klyro Light",
	quote: KLYRO_QUOTE.quote,
};

const PARTNER_QUOTE: PillarQuote = {
	attribution: MATATA_QUOTE.attribution,
	logo: "/case-studies/matataxplore-logo.png",
	logoAlt: "Matata Xplore",
	quote: MATATA_QUOTE.quote,
};

export default function HomePage() {
	return (
		<main className="flex w-full flex-col overflow-x-clip">
			<Hero />
			{/* The hero animates on load; everything under it arrives on scroll.
			    Sections with their own internal sequencing (the three pillars) are
			    left unwrapped so they are not revealed twice. */}
			<Reveal>
				<ProductPreview />
			</Reveal>
			<Reveal>
				<LogoCloud />
			</Reveal>
			{/* Statement is not wrapped: it runs its own scroll-linked choreography
			    and a fade-up on top of that would fight it. */}
			<Statement />

			<PillarSection
				cta="Explore the apps"
				ctaHref="/products"
				description="Seven focused Shopify apps for bundles, carts, countdowns, reviews, currency, subscriptions and tracking. Install the one your numbers are weakest on, then add the rest."
				features={APP_FEATURES}
				pillar="apps"
				quote={APP_QUOTE}
				title="It starts with the offer"
			>
				<AppsField />
			</PillarSection>

			<PillarSection
				cta="See the case studies"
				ctaHref="/case-studies"
				description="Revenue per visitor is conversion rate times average order value. Every app moves one side of that equation, and which side is visible in the reports you already read."
				features={RESULT_FEATURES}
				pillar="results"
				quote={RESULT_QUOTE}
				title="Measure what matters"
			/>

			<Reveal>
				<Integrations />
			</Reveal>

			<PillarSection
				cta="Explore Partners"
				ctaHref="/partners"
				description="Register the merchants you manage, get approved with a commission rate, and earn a recurring share of Edge revenue every month for as long as they stay subscribed."
				features={PARTNER_FEATURES}
				pillar="partners"
				quote={PARTNER_QUOTE}
				title="Grow with partnerships"
			>
				<RewardCards />
			</PillarSection>

			<Reveal>
				<Scale />
			</Reveal>
			<Reveal>
				<Trusted />
			</Reveal>
			<Reveal>
				<CtaDark />
			</Reveal>
		</main>
	);
}
