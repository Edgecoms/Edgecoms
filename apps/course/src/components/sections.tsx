import { Check, X } from "lucide-react";
import { SlotImage } from "@/components/slot-image";
import { Container, CtaLink, Section, SectionHeading } from "@/components/ui";
import {
	COURSE_AUDIENCE,
	COURSE_COMPARISON,
	COURSE_INCLUSIONS,
	COURSE_MODULES,
	COURSE_PAIN_POINTS,
	INSTRUCTOR_CREDENTIALS,
} from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { COURSE_NAME } from "@/lib/site";

/**
 * The logo strip, directly under the hero.
 *
 * Renders only the slots that have a real logo. An unearned logo wall is the
 * fastest way to lose the trust the rest of the page is building, so an empty
 * slot shows the placeholder in development and simply disappears in
 * production rather than shipping a grey box that implies a relationship.
 */
const TRUST_KEYS = [
	"trust-logo-1",
	"trust-logo-2",
	"trust-logo-3",
	"trust-logo-4",
	"trust-logo-5",
] as const;

export function TrustStrip() {
	const anyReal = TRUST_KEYS.some((key) => IMAGES[key].src !== null);

	// Nothing to show and not worth a placeholder band in production.
	if (!(anyReal || process.env.NODE_ENV === "development")) {
		return null;
	}

	return (
		<section className="w-full border-ink-border border-b bg-ink py-10">
			<Container>
				<p className="text-center font-semibold text-muted-dark text-xs uppercase tracking-[0.18em]">
					Built by the team behind
				</p>
				<div className="mt-6 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-5">
					{TRUST_KEYS.map((key) => (
						<div className="flex items-center justify-center" key={key}>
							<SlotImage
								className="max-h-10 w-auto opacity-60"
								imageKey={key}
								rounded="lg"
							/>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}

/**
 * A look inside. Three real screenshots do more for a course page than any
 * amount of prose about what the course contains — this is the section that
 * answers "what am I actually getting".
 */
const PREVIEWS = [
	{
		body: "Every module is a short, plain-English lesson you can watch on a phone.",
		imageKey: "preview-lesson",
		title: "The lessons",
	},
	{
		body: "Fill in your own numbers and the templates tell you where the money is leaking.",
		imageKey: "preview-template",
		title: "The templates",
	},
	{
		body: "We pull real stores apart and mark up exactly what we would change.",
		imageKey: "preview-teardown",
		title: "The teardowns",
	},
] as const;

export function CoursePreview() {
	return (
		<Section>
			<Container>
				<SectionHeading
					eyebrow="A look inside"
					lead="No mystery about what you are signing up for. This is the actual course."
					title="See it before you sign up"
				/>

				<div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
					{PREVIEWS.map((preview) => (
						<figure className="flex flex-col gap-4" key={preview.title}>
							<div className="rounded-2xl border border-ink-border bg-ink-raised p-2">
								<SlotImage
									imageKey={preview.imageKey}
									sizes="(max-width: 1024px) 100vw, 33vw"
								/>
							</div>
							<figcaption className="flex flex-col gap-1">
								<h3 className="font-bold text-base text-paper">
									{preview.title}
								</h3>
								<p className="text-pretty text-muted text-sm leading-relaxed">
									{preview.body}
								</p>
							</figcaption>
						</figure>
					))}
				</div>
			</Container>
		</Section>
	);
}

/** The qualifier, on the pale mint break. Written as the reader's own thoughts. */
export function PainPoints() {
	return (
		<Section tone="wash">
			<Container narrow>
				<SectionHeading
					eyebrow="Sound familiar?"
					lead="Most of this comes down to a handful of decisions. The hard part is knowing which one to make first."
					title="If you have ever thought…"
					tone="wash"
				/>

				<ul className="mt-10 flex flex-col gap-3">
					{COURSE_PAIN_POINTS.map((point) => (
						<li
							className="flex items-start gap-3 rounded-xl bg-white/70 px-5 py-4 text-base text-ink/80 leading-relaxed"
							key={point}
						>
							<span
								aria-hidden="true"
								className="mt-2 size-2 shrink-0 rounded-full bg-ink/25"
							/>
							{point}
						</li>
					))}
				</ul>

				<p className="mt-8 text-balance text-center font-semibold text-ink text-lg">
					Said yes to more than a couple? That is exactly the ground{" "}
					{COURSE_NAME} covers.
				</p>
			</Container>
		</Section>
	);
}

/** What actually arrives. Emoji-led cards, matching the page's louder register. */
export function Inclusions() {
	return (
		<Section>
			<Container>
				<SectionHeading
					eyebrow="What you get"
					lead="Everything below is included. Nothing is an upsell, and none of it costs anything."
					title="Inside the course"
				/>

				<div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{COURSE_INCLUSIONS.map((item) => (
						<div
							className="flex flex-col gap-3 rounded-2xl border border-ink-border bg-ink-raised p-6 transition-colors hover:border-accent/40"
							key={item.title}
						>
							<span aria-hidden="true" className="text-3xl">
								{item.emoji}
							</span>
							<h3 className="font-bold text-lg text-paper">{item.title}</h3>
							<p className="text-pretty text-muted text-sm leading-relaxed">
								{item.body}
							</p>
						</div>
					))}
				</div>

				{/* The community, shown rather than described. Nobody believes "a
				    supportive community" as a bullet; a thread of real questions is
				    the only version of that claim that lands. */}
				<figure className="mt-10 flex flex-col gap-4">
					<div className="rounded-2xl border border-ink-border bg-ink-raised p-2 sm:p-3">
						<SlotImage
							imageKey="community-preview"
							sizes="(max-width: 1024px) 100vw, 1024px"
						/>
					</div>
					<figcaption className="text-center text-muted text-sm">
						Ask a question, post your numbers, get an answer from someone
						solving the same problem.
					</figcaption>
				</figure>
			</Container>
		</Section>
	);
}

/**
 * The curriculum. A plain numbered list rather than an accordion: the sequence
 * is the argument, and hiding nine of ten summaries behind a click makes the
 * course look thinner than it is.
 */
export function Curriculum() {
	return (
		<Section id="curriculum">
			<Container narrow>
				<SectionHeading
					eyebrow="The curriculum"
					lead="Each module builds on the equation taught in the first. You can skip ahead, but the sequence is the point."
					title="Ten modules, in the order they matter"
				/>

				<ol className="mt-12 flex flex-col gap-3">
					{COURSE_MODULES.map((module, index) => (
						<li
							className="grid grid-cols-[auto_1fr] gap-x-5 rounded-2xl border border-ink-border bg-ink-raised p-5 sm:p-6"
							key={module.title}
						>
							<span className="font-bold text-accent text-lg tabular-nums">
								{String(index + 1).padStart(2, "0")}
							</span>

							<div className="flex flex-col gap-2">
								<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
									<h3 className="font-bold text-lg text-paper">
										{module.title}
									</h3>
									<span className="text-muted-dark text-xs tabular-nums">
										{module.lessons} lessons
									</span>
								</div>
								<p className="text-pretty text-muted text-sm leading-relaxed">
									{module.summary}
								</p>
							</div>
						</li>
					))}
				</ol>

				<div className="mt-10 flex justify-center">
					<CtaLink href="#get-access">Get all ten, free</CtaLink>
				</div>
			</Container>
		</Section>
	);
}

export function Audience() {
	return (
		<Section tone="wash">
			<Container>
				<SectionHeading
					eyebrow="Who it's for"
					lead="The through-line is the same everywhere: you own a number, and you want a defensible way to move it."
					title="Built for people who own the number"
					tone="wash"
				/>

				<div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{COURSE_AUDIENCE.map((item) => (
						<div
							className="flex flex-col gap-2 rounded-2xl bg-white/70 p-6"
							key={item.title}
						>
							<h3 className="font-bold text-ink text-lg">{item.title}</h3>
							<p className="text-pretty text-ink/60 text-sm leading-relaxed">
								{item.body}
							</p>
						</div>
					))}
				</div>
			</Container>
		</Section>
	);
}

/**
 * Who is teaching. Deliberately about the company rather than a named person —
 * inventing credentials for a real individual is the same liability as
 * inventing a statistic. See the TODO in `content.ts`.
 */
export function Instructor() {
	return (
		<Section>
			<Container>
				<div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
					{/* A real face is the highest-trust element on a page like this,
					    which is why it gets its own column rather than a thumbnail. */}
					<div className="mx-auto w-full max-w-sm lg:mx-0">
						<SlotImage
							imageKey="instructor-portrait"
							sizes="(max-width: 1024px) 24rem, 32vw"
						/>
					</div>

					<div className="flex flex-col gap-5">
						<p className="font-semibold text-accent text-xs uppercase tracking-[0.18em]">
							Who's teaching
						</p>
						<h2 className="text-balance font-bold text-section">
							The team behind Edge
						</h2>
						<p className="text-pretty text-muted leading-relaxed sm:text-lg">
							Edgecoms builds the Edge suite — focused Shopify apps for bundles,
							cart upsells, reviews, subscriptions and attribution. This course
							is the reasoning underneath that work, written down in the order
							it is actually useful.
						</p>
						<p className="text-pretty text-muted leading-relaxed sm:text-lg">
							We are not teaching this from a conference talk. We had to answer
							these questions to build the products, and the answers turned out
							to be worth more than the tactics.
						</p>

						<ul className="mt-2 flex flex-col gap-3">
							{INSTRUCTOR_CREDENTIALS.map((line) => (
								<li
									className="flex items-start gap-3 rounded-xl border border-ink-border bg-ink-raised px-5 py-4 text-paper/90 text-sm leading-relaxed"
									key={line}
								>
									<Check
										aria-hidden="true"
										className="mt-0.5 size-4 shrink-0 text-accent"
									/>
									{line}
								</li>
							))}
						</ul>
					</div>
				</div>
			</Container>
		</Section>
	);
}

/**
 * The side-by-side. The left column describes the category rather than naming a
 * competitor — a table that names names invites a reply, and every line in it
 * then has to be defensible about somebody else's product.
 */
export function Comparison() {
	return (
		<Section>
			<Container>
				<SectionHeading
					eyebrow="The honest comparison"
					title="Why this one is different"
				/>

				<div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
					<div className="flex flex-col gap-4 rounded-2xl border border-ink-border bg-ink-raised p-6 sm:p-8">
						<h3 className="font-semibold text-muted-dark text-sm uppercase tracking-wider">
							Most ecommerce courses
						</h3>
						<ul className="flex flex-col gap-3">
							{COURSE_COMPARISON.theirs.map((line) => (
								<li
									className="flex items-start gap-3 text-muted text-sm leading-relaxed"
									key={line}
								>
									<X
										aria-hidden="true"
										className="mt-0.5 size-4 shrink-0 text-muted-dark"
									/>
									{line}
								</li>
							))}
						</ul>
					</div>

					<div className="flex flex-col gap-4 rounded-2xl border border-accent/40 bg-accent/[0.07] p-6 sm:p-8">
						<h3 className="font-semibold text-accent text-sm uppercase tracking-wider">
							{COURSE_NAME}
						</h3>
						<ul className="flex flex-col gap-3">
							{COURSE_COMPARISON.ours.map((line) => (
								<li
									className="flex items-start gap-3 text-paper/90 text-sm leading-relaxed"
									key={line}
								>
									<Check
										aria-hidden="true"
										className="mt-0.5 size-4 shrink-0 text-accent"
									/>
									{line}
								</li>
							))}
						</ul>
					</div>
				</div>
			</Container>
		</Section>
	);
}
