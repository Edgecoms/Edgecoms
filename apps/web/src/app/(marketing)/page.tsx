import type { Metadata } from "next";
import { CtaHome } from "@/components/home/cta-home";
import { HeroHome } from "@/components/home/hero-home";
import { SuiteHome } from "@/components/home/suite-home";
import { TrustStrip } from "@/components/home/trust-strip";
import { WhyEdge } from "@/components/home/why-edge";

export const metadata: Metadata = {
	title: "Edge",
	description:
		"Six focused Shopify apps from one team — bundles, cart, reviews, subscriptions, currency, and urgency. One bill, one design language, one place to get help.",
};

export default function HomePage() {
	return (
		<main className="flex flex-col">
			<HeroHome />
			<TrustStrip />
			<SuiteHome />
			<WhyEdge />
			<CtaHome />
		</main>
	);
}
