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

/**
 * Archived v2 homepage, kept verbatim for side-by-side comparison against the
 * v3 redesign. Not linked from anywhere and excluded from search indexing.
 *
 * Unlike the v1 archive this does NOT fork its components into `components/v2`
 * — every section it renders still lives in `components/home` and nothing in
 * the live homepage imports from there any more, so the copy is already frozen
 * without duplicating fifteen files. `GridMarkers` is the one exception: the
 * shared footer imports it too, so it is not frozen.
 */
export const metadata: Metadata = {
	title: "Homepage v2 (archived) — Edge",
	robots: { index: false, follow: false },
};

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

export default function HomePageV2() {
	return (
		<main className="flex flex-col gap-y-8 sm:gap-y-14">
			<HeroHome />
			<Reveal delay={HERO_SETTLE_SECONDS}>
				<CaseStudies />
			</Reveal>
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
