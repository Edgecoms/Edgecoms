import type { Metadata } from "next";
import { CaseStudies } from "@/components/home/case-studies";
import { CtaHome } from "@/components/home/cta-home";
import { HeroHome } from "@/components/home/hero-home";
import { JourneyExplorer } from "@/components/home/journey-explorer";
import { LogoTicker } from "@/components/home/logo-ticker";
import { RpvCalculator } from "@/components/home/rpv-calculator";
import { RpvEquation } from "@/components/home/rpv-equation";
import { WhyEdge } from "@/components/home/why-edge";
import { FaqList } from "@/components/marketing/faq-list";
import type { AppFaq } from "@/lib/products";

export const metadata: Metadata = {
	title: "Edge — raise AOV and conversion rate on the traffic you already have",
	description:
		"Seven Shopify apps that move the two numbers your revenue is made of: how many visitors buy, and how much each one spends. Bundles, cart, timer, reviews, currency, subscriptions, and server-side tracking. Free plans on most of them.",
};

const HOME_FAQ: readonly AppFaq[] = [
	{
		question: "Do I need all seven?",
		answer:
			"No, and most merchants do not start that way. Look at your own numbers and pick the weakest one — usually average order value, because it is the one nobody has touched in a year. Add the others once you can see the first one moving.",
	},
	{
		question: "How fast will I see a change?",
		answer:
			"Bundles and cart upsells show up in your Shopify analytics within a couple of weeks at normal traffic. Below roughly a thousand sessions a month, give it a full month before you read anything into the number — at low volume, a good week and a bad week look like a trend and they are not.",
	},
	{
		question: "Will these slow my store down?",
		answer:
			"Everything ships as a Shopify App Block and loads asynchronously, so nothing here blocks your product images from rendering. This is also why we build focused apps rather than one large one: you only load the code for the thing you actually turned on.",
	},
	{
		question: "What happens if I uninstall?",
		answer:
			"Nothing is left behind. No orphaned code in your theme, no broken sections, no leftover snippets you have to find and delete six months later.",
	},
	{
		question: "How does billing work?",
		answer:
			"Through Shopify, on the invoice you already receive. There is no separate checkout and no new card on file, and you cancel from your Shopify admin the same way you cancel any other app.",
	},
	{
		question: "I'm not technical. Is that a problem?",
		answer:
			"No. Everything is configured from a dashboard, and if you would rather not do it yourself, send us your store URL and we will set up the first offer for you.",
	},
];

export default function HomePage() {
	return (
		<main className="flex flex-col">
			<HeroHome />
			{/* Renders nothing until a case study is marked `published`. When one
			    is, it takes the slot above the ticker — a merchant's numbers are
			    stronger proof than a list of integrations. */}
			<CaseStudies />
			<LogoTicker />
			<RpvEquation />
			<JourneyExplorer />
			<RpvCalculator />
			<WhyEdge />
			<FaqList items={HOME_FAQ} title="Questions merchants ask first" />
			<CtaHome />
		</main>
	);
}
