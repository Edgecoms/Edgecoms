import { Star } from "lucide-react";
import Image from "next/image";
import { Container, cx, Section, SectionHeading } from "@/components/ui";
import {
	AUTHORITY_POINTS,
	aggregateRating,
	EDGE_APPS,
	MAX_RATING,
	REAL_TESTIMONIAL_COUNT,
	type Testimonial,
	VISIBLE_TESTIMONIALS,
} from "@/lib/social-proof";

/**
 * A rating out of five.
 *
 * The number is exposed once, in text, for screen readers; the stars themselves
 * are decorative. Reading out "star, star, star, star, star" is noise.
 */
function Stars({ rating }: { rating: number }) {
	return (
		<p className="flex items-center gap-0.5">
			<span className="sr-only">
				{rating} out of {MAX_RATING}
			</span>
			{Array.from({ length: MAX_RATING }, (_, index) => (
				<Star
					aria-hidden="true"
					className={cx(
						"size-4",
						index < Math.round(rating)
							? "fill-accent text-accent"
							: "text-muted-dark"
					)}
					key={index}
				/>
			))}
		</p>
	);
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
	return (
		<figure className="flex flex-col justify-between gap-5 rounded-2xl border border-ink-border bg-ink-raised p-6">
			<div className="flex flex-col gap-4">
				{testimonial.rating === null ? null : (
					<Stars rating={testimonial.rating} />
				)}
				<blockquote className="text-pretty text-paper/90 text-sm leading-relaxed">
					&ldquo;{testimonial.quote}&rdquo;
				</blockquote>
			</div>

			<figcaption className="flex items-center gap-3">
				{testimonial.avatar ? (
					<Image
						alt=""
						className="size-9 shrink-0 rounded-full object-cover"
						height={72}
						src={testimonial.avatar}
						width={72}
					/>
				) : null}
				<span className="text-xs leading-snug">
					{/* The name only renders once there is a real one. An unnamed quote
					    reads as anonymous, which is honest; an invented name does not. */}
					{testimonial.name ? (
						<span className="block font-semibold text-paper">
							{testimonial.name}
						</span>
					) : null}
					<span className="block text-muted-dark">{testimonial.role}</span>
				</span>
			</figcaption>
		</figure>
	);
}

/**
 * WHAT THE SECTION SHOWS BEFORE ANYONE HAS TAKEN THE COURSE.
 *
 * The honest answer to "a new course has no testimonials" is not an empty
 * space, and it is certainly not an invented one. It is to say so, and to put
 * the proof that does exist in its place: this is built by people who ship
 * Shopify apps for a living, which is checkable in a way a student count is
 * not.
 *
 * Framing newness as an opening is also simply true — early members shape what
 * gets made — and it gives the page something to convert on while the real
 * quotes are being collected.
 */
function FoundingMembers() {
	return (
		<Section>
			<Container>
				<SectionHeading
					eyebrow="Why trust this"
					lead="This course is new, so there are no student results to show you yet. Rather than borrow someone else's, here is what we can actually stand behind."
					title="No testimonials yet. Here's the honest version."
				/>

				<div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
					<div className="flex flex-col gap-4 rounded-2xl border border-accent/40 bg-accent/[0.07] p-6 sm:p-8">
						<h3 className="font-bold text-lg text-paper">
							Who is actually behind it
						</h3>
						<ul className="flex flex-col gap-3">
							{AUTHORITY_POINTS.map((point) => (
								<li
									className="flex items-start gap-3 text-paper/90 text-sm leading-relaxed"
									key={point}
								>
									<span
										aria-hidden="true"
										className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
									/>
									{point}
								</li>
							))}
						</ul>
					</div>

					<div className="flex flex-col gap-4 rounded-2xl border border-ink-border bg-ink-raised p-6 sm:p-8">
						<h3 className="font-bold text-lg text-paper">The apps we build</h3>
						<p className="text-pretty text-muted text-sm leading-relaxed">
							Real products on real storefronts. The thinking in this course is
							the thinking that went into them.
						</p>
						<ul className="flex flex-wrap gap-2">
							{EDGE_APPS.map((app) => (
								<li
									className="rounded-full border border-ink-border px-3 py-1 text-paper/80 text-xs"
									key={app}
								>
									{app}
								</li>
							))}
						</ul>
					</div>
				</div>

				<p className="mx-auto mt-8 max-w-xl text-balance text-center text-muted text-sm leading-relaxed">
					When people finish the course and tell us what changed, we will
					publish what they say here — with their name on it, and their
					permission.
				</p>
			</Container>
		</Section>
	);
}

/**
 * The social proof section.
 *
 * Shows real, permissioned quotes when they exist and the honest founding-member
 * panel when they do not. It never renders nothing, and it never renders
 * something invented: `VISIBLE_TESTIMONIALS` only contains placeholders in a
 * development build, and `REAL_TESTIMONIAL_COUNT` is what decides which of the
 * two versions a visitor to the live site actually gets.
 */
export function SocialProof() {
	if (REAL_TESTIMONIAL_COUNT === 0 && VISIBLE_TESTIMONIALS.length === 0) {
		return <FoundingMembers />;
	}

	const rating = aggregateRating();

	return (
		<Section>
			<Container>
				<SectionHeading eyebrow="From students" title="What people took away" />

				{rating ? (
					<div className="mt-6 flex flex-col items-center gap-2">
						<Stars rating={rating.average} />
						<p className="text-muted text-sm">
							{rating.average} out of {MAX_RATING}, from {rating.count} reviews
						</p>
					</div>
				) : null}

				<div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{VISIBLE_TESTIMONIALS.map((testimonial) => (
						<TestimonialCard key={testimonial.id} testimonial={testimonial} />
					))}
				</div>

				{REAL_TESTIMONIAL_COUNT === 0 ? (
					<p className="mt-8 text-center font-mono text-accent/70 text-xs">
						Development only — no permissioned testimonials yet, so a production
						build shows the founding-members panel instead.
					</p>
				) : null}
			</Container>
		</Section>
	);
}
