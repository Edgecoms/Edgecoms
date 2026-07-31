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
					<p className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]">
						Case studies
					</p>
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
							className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-border bg-page transition-colors hover:bg-bg"
							href={`/case-studies/${slug}` as Route}
							key={slug}
						>
							{/* Landscape image area, so wide storefront photography is not
							    sliced through the middle by a portrait crop. */}
							<div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(150deg,var(--gray-4),var(--gray-6))]">
								{study.banner ? (
									<Image
										alt={`${study.brand} storefront`}
										className="object-cover transition-transform duration-500 group-hover:scale-105"
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
										src={study.banner}
									/>
								) : null}
							</div>

							<div className="flex flex-1 flex-col gap-4 p-6">
								<span className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.1em]">
									{study.category}
								</span>
								{study.logo ? (
									<Image
										alt={study.brand}
										className="h-9 w-auto object-contain object-left"
										height={72}
										src={study.logo}
										width={220}
									/>
								) : (
									<span className="font-medium text-h3 text-primary-foreground">
										{study.brand}
									</span>
								)}
								<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{study.title ?? study.summary}
								</p>
								<div className="mt-auto flex flex-wrap gap-x-2 gap-y-1 border-border border-t pt-4">
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
