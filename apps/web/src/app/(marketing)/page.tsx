import type { Metadata } from "next";
import { CaseStudies } from "@/components/home/case-studies";
import { CtaHome } from "@/components/home/cta-home";
import { FeaturedStories } from "@/components/home/featured-stories";
import { HeroHome } from "@/components/home/hero-home";
import { JourneyExplorer } from "@/components/home/journey-explorer";
import { RpvCalculator } from "@/components/home/rpv-calculator";
import { RpvEquation } from "@/components/home/rpv-equation";
import { Testimonials } from "@/components/home/testimonials";
import { WhyEdge } from "@/components/home/why-edge";
import { FaqList } from "@/components/marketing/faq-list";
import { Reveal } from "@/components/ui/reveal";
import type { AppFaq } from "@/lib/products";

export const metadata: Metadata = {
	title: "Edge · Raise AOV and conversion rate on the traffic you already have",
	description:
		"Seven Shopify apps that move the two numbers your revenue is made of: how many visitors buy, and how much each one spends. Bundles, cart, timer, reviews, currency, subscriptions, and server-side tracking. Free plans on most of them.",
};

/* Roughly when the hero finishes: its last child starts at 0.46s and runs for
   0.9s. Overlapping the tail is deliberate — waiting for the full 1.36s reads
   as a stall. */
const HERO_SETTLE_SECONDS = 0.9;

const HOME_FAQ: readonly AppFaq[] = [
	{
		question: "Do I need all seven?",
		answer:
			"No, and most merchants do not start that way. Look at your own numbers and pick the weakest one, usually average order value, because it is the one nobody has touched in a year. Add the others once you can see the first one moving.",
	},
	{
		question: "How fast will I see a change?",
		answer:
			"Bundles and cart upsells show up in your Shopify analytics within a couple of weeks at normal traffic. Below roughly a thousand sessions a month, give it a full month before you read anything into the number. At low volume, a good week and a bad week look like a trend and they are not.",
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
		/* The rhythm between sections lives here rather than in each section's own
		   padding. Every section still owns its internal spacing, but the distance
		   between any two of them is one number, so a section that sets its padding
		   a notch light cannot collapse into the one below it. */
		<main className="flex flex-col gap-y-8 sm:gap-y-14">
			<HeroHome />
			{/* The hero animates itself on load. Everything below it reveals on
			    scroll — except the journey explorer, whose panel is `position:
			    sticky` and would be scoped to an animating wrapper. */}
			{/* Held back until the hero's stagger has run. On a tall screen the
			    proof row is already inside the viewport at load, so without this it
			    fires at the same moment as the headline and the two animations read
			    as one confused movement. */}
			<Reveal delay={HERO_SETTLE_SECONDS}>
				<CaseStudies />
			</Reveal>
			{/* Not wrapped: these two stagger their own cards in, so an outer
			    fade would animate the block and its contents at the same time. */}
			<FeaturedStories />
			<JourneyExplorer />
			<Reveal>
				<RpvEquation />
			</Reveal>
			<Reveal>
				<RpvCalculator />
			</Reveal>
			<Reveal>
				<WhyEdge />
			</Reveal>
			<Testimonials />
			<Reveal>
				<FaqList items={HOME_FAQ} title="Questions merchants ask first" />
			</Reveal>
			<Reveal>
				<CtaHome />
			</Reveal>
		</main>
	);
}
