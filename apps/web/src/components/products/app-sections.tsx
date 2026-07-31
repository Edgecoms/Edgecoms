import { Quote, Star } from "lucide-react";
import { type CaseStudy, isCaseStudyVisible } from "@/lib/marketing-stats";
import type { AppStep, AppTestimonial } from "@/lib/products";

export function HowItWorks({
	steps,
	title,
}: {
	steps: readonly AppStep[];
	title: string;
}) {
	return (
		<section aria-labelledby="how-heading" className="w-full py-24">
			<div className="mx-auto w-full max-w-7xl px-6">
				<h2
					className="max-w-2xl text-balance font-medium text-display text-primary-foreground"
					id="how-heading"
				>
					{title}
				</h2>

				<ol className="mt-14 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
					{steps.map((step, index) => (
						<li
							className="flex flex-col gap-3 bg-bg p-8 sm:p-10"
							key={step.title}
						>
							<span className="grid size-8 place-items-center rounded-full bg-brand/12 font-medium font-mono text-[13px] text-brand tabular-nums">
								{index + 1}
							</span>
							<h3 className="text-balance font-medium text-h3 text-primary-foreground">
								{step.title}
							</h3>
							<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
								{step.body}
							</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}

export function WorksWith({ items }: { items: readonly string[] }) {
	return (
		<section aria-labelledby="works-with-heading" className="w-full pb-24">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-border border-t px-6 pt-12 sm:flex-row sm:items-center sm:gap-10">
				<h2
					className="shrink-0 font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]"
					id="works-with-heading"
				>
					Works with
				</h2>
				<ul className="flex flex-wrap items-center gap-2">
					{items.map((item) => (
						<li
							className="rounded-full border border-border bg-page px-3.5 py-1.5 text-body-sm text-secondary-foreground"
							key={item}
						>
							{item}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

/**
 * Hidden in production until `published` is flipped; visible in development so
 * the layout can be worked on. See `SHOW_PLACEHOLDER_PROOF` in
 * `marketing-stats.ts`.
 */
export function ResultsBand({ study }: { study: CaseStudy }) {
	if (!isCaseStudyVisible(study)) {
		return null;
	}

	return (
		<section aria-labelledby="results-heading" className="w-full pb-24">
			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="relative flex flex-col gap-6 rounded-[2rem] border border-border bg-page p-8 sm:p-12">
					{study.published ? null : (
						<span className="absolute top-5 right-5 rounded-full bg-amber-400 px-2.5 py-1 font-medium font-mono text-[10px] text-black uppercase tracking-[0.1em]">
							Placeholder
						</span>
					)}
					<span className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.12em]">
						{study.brand} · {study.category} · {study.timeframe}
					</span>
					<h2
						className="max-w-2xl text-balance font-medium text-h1 text-primary-foreground"
						id="results-heading"
					>
						{study.title}
					</h2>
					<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
						{study.summary}
					</p>

					<dl className="mt-2 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
						{study.results.map((result) => (
							<div className="flex flex-col gap-1 bg-bg p-5" key={result.label}>
								<dt className="text-caption text-secondary-foreground">
									{result.label}
								</dt>
								<dd className="font-medium text-h1 text-primary-foreground tabular-nums">
									{result.value}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
}

/**
 * Only rendered where a real review exists. There are no placeholder quotes on
 * this site: an invented testimonial attributed to a named person is a
 * fabricated review, and the empty space costs less than getting caught.
 */
export function TestimonialBlock({
	testimonial,
}: {
	testimonial: AppTestimonial;
}) {
	return (
		<section aria-labelledby="testimonial-heading" className="w-full pb-24">
			<h2 className="sr-only" id="testimonial-heading">
				What merchants say
			</h2>
			<div className="mx-auto w-full max-w-7xl px-6">
				<figure className="flex flex-col gap-5 rounded-[2rem] border border-border bg-bg p-8 sm:p-12">
					<Quote
						aria-hidden="true"
						className="size-6 text-brand"
						strokeWidth={1.5}
					/>
					<blockquote className="max-w-3xl text-balance text-body-lg text-primary-foreground leading-relaxed">
						{testimonial.quote}
					</blockquote>
					<figcaption className="flex flex-col gap-2">
						<span className="flex items-center gap-2.5">
							<span className="font-medium text-body-sm text-primary-foreground">
								{testimonial.name}
							</span>
							<span className="text-body-sm text-secondary-foreground">
								{testimonial.location}
							</span>
							{/* `role="img"` so the row is announced once, as a rating, rather
							    than as five unlabelled decorations. */}
							<span
								aria-label={`${testimonial.rating} out of 5 stars`}
								className="flex items-center gap-0.5"
								role="img"
							>
								{Array.from({ length: testimonial.rating }, (_, index) => (
									<Star
										aria-hidden="true"
										className="size-3.5 fill-brand text-brand"
										key={`star-${testimonial.name}-${index + 1}`}
									/>
								))}
							</span>
						</span>
						{testimonial.disclosure ? (
							<span className="text-caption text-secondary-foreground">
								{testimonial.disclosure}
							</span>
						) : null}
					</figcaption>
				</figure>
			</div>
		</section>
	);
}
