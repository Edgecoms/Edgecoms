import { ButtonLink } from "@edgecoms/ui/components/button";
import { ArrowUpRight } from "lucide-react";
import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingCta } from "@/components/marketing/marketing-cta";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
import {
	CASE_STUDIES,
	type CaseStudy,
	isCaseStudyVisible,
} from "@/lib/marketing-stats";

interface CaseStudyPageProps {
	params: Promise<{ slug: string }>;
}

/**
 * One merchant, one page.
 *
 * Every narrative section is optional and simply does not render when it is
 * empty, so a study can go live on the two things that are already true and
 * checkable — who the merchant is and which Edge apps their storefront runs —
 * and grow the story later. That beats holding the page back until somebody has
 * time to do an interview.
 */

const SECTIONS = [
	{ id: "overview", key: "overview", label: "Overview" },
	{ id: "challenge", key: "challenge", label: "Challenge" },
	{ id: "solution", key: "solution", label: "Solution" },
	{ id: "results", key: "resultsCopy", label: "Results" },
] as const;

export function generateStaticParams(): { slug: string }[] {
	return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: CaseStudyPageProps): Promise<Metadata> {
	const { slug } = await params;
	const study = CASE_STUDIES[slug];
	if (!study) {
		return { title: "Not found · Edge" };
	}
	return {
		title: `${study.brand} · Edge case study`,
		description:
			study.summary ??
			`${study.brand} runs ${study.apps.join(", ")} on their Shopify store.`,
	};
}

/** The stat cards, or the verifiable app stack until there are stats. */
function BandCards({ study }: { study: CaseStudy }) {
	if (study.results && study.results.length > 0) {
		return study.results.map((result) => (
			<div
				className="flex flex-col gap-4 rounded-2xl bg-page p-6 sm:p-7"
				key={result.label}
			>
				<span className="font-medium text-brand text-display leading-none">
					{result.value}
				</span>
				<span className="text-pretty text-body-sm text-primary-foreground leading-relaxed">
					{result.label}
				</span>
			</div>
		));
	}

	return study.apps.slice(0, 3).map((app) => (
		<div
			className="flex flex-col gap-4 rounded-2xl bg-page p-6 sm:p-7"
			key={app}
		>
			<span className="font-medium text-brand text-h1">{app}</span>
			<span className="text-body-sm text-primary-foreground">
				Running on this store today
			</span>
		</div>
	));
}

function Narrative({
	body,
	id,
	title,
}: {
	body?: string;
	id: string;
	title: string;
}) {
	if (!body) {
		return null;
	}
	return (
		<section className="flex scroll-mt-28 flex-col gap-5" id={id}>
			<h2 className="font-medium text-display text-primary-foreground">
				{title}
			</h2>
			{/* Short paragraphs, split on blank lines. A case study is skimmed
			    before it is read, and a wall of text gets neither. */}
			{body.split("\n\n").map((para) => (
				<p
					className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed"
					key={para.slice(0, 32)}
				>
					{para}
				</p>
			))}
		</section>
	);
}

function Related({ current }: { current: string }) {
	const others = Object.entries(CASE_STUDIES)
		.filter(([slug, study]) => slug !== current && isCaseStudyVisible(study))
		.slice(0, 3);

	if (others.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby="related-heading" className="w-full pb-16">
			<div className="mx-auto w-full max-w-7xl px-6">
				<h2
					className="font-medium text-h1 text-primary-foreground"
					id="related-heading"
				>
					Other stores running Edge
				</h2>
				<div className="mt-8 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
					{others.map(([slug, study]) => (
						<Link
							className="group flex flex-col gap-2 bg-bg p-8 transition-colors hover:bg-page"
							href={`/case-studies/${slug}` as Route}
							key={slug}
						>
							<span className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.1em]">
								{study.category}
							</span>
							<span className="flex items-center gap-1.5 font-medium text-h3 text-primary-foreground">
								{study.brand}
								<ArrowUpRight
									aria-hidden="true"
									className="size-4 text-secondary-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								/>
							</span>
							<span className="text-body-sm text-secondary-foreground">
								{study.apps.length} Edge app
								{study.apps.length === 1 ? "" : "s"}
							</span>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
	const { slug } = await params;
	const study = CASE_STUDIES[slug];

	if (!(study && isCaseStudyVisible(study))) {
		notFound();
	}

	const present = SECTIONS.filter((section) => study[section.key]);

	return (
		<main className="flex flex-col">
			{/* Hero: their wordmark, then their name at display size. */}
			<section className="w-full">
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pt-24 pb-10">
					{study.logo ? (
						<Image
							alt={study.brand}
							className="h-11 w-auto object-contain object-left"
							height={88}
							src={study.logo}
							width={264}
						/>
					) : (
						<span className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]">
							{study.category}
						</span>
					)}
					<h1 className="text-balance font-medium text-display-lg text-primary-foreground">
						{study.brand}
					</h1>
				</div>
			</section>

			{/* Banner with the stat cards sitting on it. */}
			<section className="w-full">
				<div className="mx-auto w-full max-w-7xl px-6">
					<div className="relative isolate overflow-hidden rounded-[2rem] bg-[linear-gradient(140deg,var(--gray-4),var(--gray-6))]">
						{study.banner ? (
							<Image
								alt={`${study.brand} storefront`}
								className="object-cover"
								fill
								sizes="(max-width: 1280px) 100vw, 1216px"
								src={study.banner}
							/>
						) : null}
						{/* Scrim so the white cards read against any photograph. */}
						<div aria-hidden="true" className="absolute inset-0 bg-black/25" />
						<div className="relative grid grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-3">
							<BandCards study={study} />
						</div>
					</div>
				</div>
			</section>

			{/* Sticky section nav and CTA beside the narrative. */}
			<section className="w-full py-14">
				<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
					<aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
						{present.length > 0 ? (
							<nav aria-label="Sections">
								<ul className="flex flex-col">
									{present.map((section) => (
										<li className="border-border border-b" key={section.id}>
											<a
												className="block py-3 text-body text-primary-foreground transition-colors hover:text-brand"
												href={`#${section.id}`}
											>
												{section.label}
											</a>
										</li>
									))}
								</ul>
							</nav>
						) : null}

						<div className="flex flex-col gap-4 rounded-[1.5rem] bg-primary p-6">
							<h2 className="text-balance font-medium text-h3 text-inverted-primary-foreground">
								Find out what your store is leaving on the table
							</h2>
							<p className="text-pretty text-body-sm text-inverted-primary-foreground/75 leading-relaxed">
								Send us your store URL and we will tell you where revenue per
								visitor is leaking.
							</p>
							<ButtonLink
								className="h-10 w-fit rounded-full px-5 text-[14px]"
								href={BOOKING_URL as Route}
								rel="noopener"
								size="xl"
								target="_blank"
								variant="brand"
							>
								{BOOKING_LABEL}
							</ButtonLink>
						</div>

						{study.url ? (
							<a
								className="inline-flex items-center gap-1.5 text-body-sm text-secondary-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary-foreground"
								href={study.url}
								rel="noopener"
								target="_blank"
							>
								Visit {study.brand}
								<ArrowUpRight aria-hidden="true" className="size-3.5" />
							</a>
						) : null}
					</aside>

					<div className="flex flex-col gap-14">
						{study.summary ? (
							<p className="text-pretty text-body-lg text-primary-foreground leading-relaxed sm:text-h3 sm:leading-relaxed">
								{study.summary}
							</p>
						) : null}

						<Narrative body={study.overview} id="overview" title="Overview" />
						<Narrative
							body={study.challenge}
							id="challenge"
							title="Challenge"
						/>
						<Narrative body={study.solution} id="solution" title="Solution" />
						<Narrative body={study.resultsCopy} id="results" title="Results" />

						{study.resultsCopy ? null : (
							<div className="flex flex-col items-start gap-4 rounded-[1.5rem] border border-border border-dashed p-8">
								<p className="max-w-xl text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									We have not published measured results for this store yet.
									Everything above is either verifiable from {study.brand}'s own
									storefront or reasoning you can check for yourself.
								</p>
							</div>
						)}
					</div>
				</div>
			</section>

			<Related current={slug} />

			<MarketingCta
				body="Most apps have a free plan and none of them have a contract. Billing runs through Shopify, and you cancel from your admin like any other app."
				heading="Your traffic is already paid for. Get more out of it."
				primary={{ href: "/products", label: "Browse the apps" }}
				secondary={{ href: BOOKING_URL, label: BOOKING_LABEL }}
			/>
		</main>
	);
}
