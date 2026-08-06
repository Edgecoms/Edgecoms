import { ButtonLink } from "@edgecoms/ui/components/button";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import {
	type BeforeAfterStat,
	FEATURED_STORIES,
	type FeaturedStory,
} from "@/lib/marketing-stats";

/**
 * The before/after pair. The "after" figure carries the weight — it is the
 * number the merchant is being sold — so the "before" is set at body size next
 * to it rather than matching it. Two equal figures with an arrow between them
 * make the reader work out which way round it goes.
 */
function StatRow({ stat }: { stat: BeforeAfterStat }) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-caption text-secondary-foreground">
				{stat.label}
			</span>
			<div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
				<span className="text-body-lg text-secondary-foreground">
					{stat.before}
				</span>
				<ArrowRight
					aria-hidden="true"
					className="size-4 text-secondary-foreground/60"
				/>
				<span className="font-medium text-h1 text-primary-foreground">
					{stat.after}
				</span>
				<span className="font-medium text-body-sm text-brand">
					{stat.delta}
				</span>
			</div>
		</div>
	);
}

function StoryCard({ story }: { story: FeaturedStory }) {
	return (
		<li className="flex flex-col gap-6 rounded-[1.5rem] border border-border bg-page p-6">
			<h3 className="font-medium text-h3 text-primary-foreground">
				{story.label}
			</h3>

			<div className="flex flex-col gap-5">
				{story.stats.map((stat) => (
					<StatRow key={stat.label} stat={stat} />
				))}
			</div>

			{/* Same pills as the proof row above, deliberately: a merchant scrolling
			    past both should read them as the same kind of fact. */}
			<div className="mt-auto flex flex-col gap-3 border-border border-t pt-5">
				<span className="text-caption text-secondary-foreground">
					Apps used
				</span>
				<div className="flex flex-wrap gap-1.5">
					{story.apps.map((app) => (
						<span
							className="rounded-full bg-brand/10 px-2.5 py-1 font-medium text-[12px] text-brand"
							key={app}
						>
							{app}
						</span>
					))}
				</div>
			</div>

			<ButtonLink
				className="h-11 w-full rounded-full text-[15px]"
				href={`/case-studies/${story.slug}` as Route}
				size="xl"
				variant="secondary"
			>
				Read story
			</ButtonLink>
		</li>
	);
}

/**
 * Three stores, two numbers each, and the app stack that moved them.
 *
 * The proof row above it is breadth — who runs Edge. This is depth, and it is
 * the only place on the homepage that shows a before and an after, which is the
 * shape of the question a merchant is actually asking.
 */
export function FeaturedStories() {
	if (FEATURED_STORIES.length === 0) {
		return null;
	}

	return (
		<section
			aria-labelledby="featured-stories-heading"
			className="w-full py-10 sm:py-14"
		>
			{/* Centred from `sm` up, left below it — same rule as the hero: centred
			    text in a phone-width column gives every line a different left edge. */}
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 sm:items-center sm:text-center">
				<h2
					className="text-balance font-medium text-h1 text-primary-foreground"
					id="featured-stories-heading"
				>
					Growth you can measure.
				</h2>
				<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
					Every number below comes from a real Shopify store using Edge to
					improve revenue, not from a marketing spreadsheet.
				</p>
			</div>

			<ul className="mx-auto mt-10 grid w-full max-w-7xl gap-4 px-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
				{FEATURED_STORIES.map((story) => (
					<StoryCard key={story.slug} story={story} />
				))}
			</ul>
		</section>
	);
}
