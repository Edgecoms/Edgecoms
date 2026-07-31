import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { MarketingCta } from "@/components/marketing/marketing-cta";
import { Highlight } from "@/components/ui/highlight";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
import { CASE_STUDIES } from "@/lib/marketing-stats";

export const metadata: Metadata = {
	title: "Case studies · Edge",
	description:
		"Real Shopify stores running Edge apps, the metric each one is working, and what they built to move it.",
};

/**
 * The index. Every card carries the merchant's own photography and wordmark,
 * because a merchant scanning this page is looking for a store like theirs
 * before they read a word of it.
 */
export default function CaseStudiesPage() {
	const studies = Object.entries(CASE_STUDIES);

	return (
		<main className="flex flex-col">
			<section className="relative isolate w-full overflow-hidden">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_35%,black_20%,transparent_78%)]"
				/>
				<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-6 pt-24 pb-12 text-center">
					<p className="font-medium text-body-sm text-brand">Case studies</p>
					<h1 className="text-balance font-medium text-display text-primary-foreground sm:text-display-lg">
						<Highlight>
							Stores running Edge, and the number each one works
						</Highlight>
					</h1>
					<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
						Every store here runs Edge apps on its live storefront. Open any of
						them and view source if you want to check.
					</p>
				</div>
			</section>

			<section aria-labelledby="index-heading" className="w-full pb-16">
				<h2 className="sr-only" id="index-heading">
					All case studies
				</h2>
				{studies.length === 0 ? (
					<div className="mx-auto w-full max-w-2xl px-6 text-center">
						<p className="text-pretty text-body-lg text-secondary-foreground leading-relaxed">
							We are writing these up now. If you want to see what Edge does to
							a store before they are published, send us your URL and we will
							pull yours apart instead.
						</p>
					</div>
				) : null}
				<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
					{studies.map(([slug, study]) => (
						<Link
							className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[1.5rem] border border-border bg-[linear-gradient(150deg,var(--gray-4),var(--gray-6))]"
							href={`/case-studies/${slug}` as Route}
							key={slug}
						>
							{study.banner ? (
								<Image
									alt={`${study.brand} storefront`}
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
									src={study.banner}
								/>
							) : null}

							{/* Progressive blur. One masked `backdrop-blur` would give a
							    constant blur that merely fades in, and the eye reads the
							    point where it starts as an edge. Three layers — each
							    shorter and blurrier than the one below it, each masked to
							    fade out at its own top — make the radius itself ramp, which
							    is what looks like depth rather than a frosted panel.
							    The scrim on top is what actually buys the text its
							    contrast; blur alone does not darken anything. */}
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]"
							>
								<div className="absolute inset-0 backdrop-blur-[2px] [mask-image:linear-gradient(to_bottom,transparent,black_45%)]" />
								<div className="absolute inset-x-0 bottom-0 h-[72%] backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,transparent,black_45%)]" />
								<div className="absolute inset-x-0 bottom-0 h-[44%] backdrop-blur-[14px] [mask-image:linear-gradient(to_bottom,transparent,black_45%)]" />
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />
							</div>

							{/* The brand set as text rather than `study.logo`: the wordmarks
							    are dark-on-transparent and would disappear against this. */}
							<div className="relative flex flex-col gap-2 p-6">
								<span className="font-medium text-body-sm text-white/65">
									{study.category}
								</span>
								<span className="font-medium text-h3 text-white">
									{study.brand}
								</span>
								{(study.title ?? study.summary) ? (
									<p className="line-clamp-2 text-pretty text-body-sm text-white/75 leading-relaxed">
										{study.title ?? study.summary}
									</p>
								) : null}
								<div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 border-white/20 border-t pt-3">
									{(study.results ?? []).slice(0, 3).map((result) => (
										<span
											className="font-medium font-mono text-[11px] text-brand uppercase tracking-[0.08em]"
											key={result.label}
										>
											{result.value}
										</span>
									))}
								</div>
							</div>
						</Link>
					))}
				</div>
			</section>

			<MarketingCta
				body="Most apps have a free plan and none of them have a contract. Billing runs through Shopify, and you cancel from your admin like any other app."
				heading="Your traffic is already paid for. Get more out of it."
				primary={{ href: "/products", label: "Browse the apps" }}
				secondary={{ href: BOOKING_URL, label: BOOKING_LABEL }}
			/>
		</main>
	);
}
