import type { Route } from "next";
import Link from "next/link";
import {
	type CaseStudyCard,
	CaseStudyTrack,
} from "@/components/home/case-study-track";
import { CASE_STUDIES, isCaseStudyVisible } from "@/lib/marketing-stats";

/**
 * The proof row: one card per merchant, each carrying the single number that
 * moved. Selection happens here on the server; the scrolling track is the only
 * part that has to be a client component.
 *
 * Unpublished studies render in development and are excluded from production
 * builds — see `SHOW_PLACEHOLDER_PROOF` in `marketing-stats.ts`.
 */

/* Keyed by merchant now, not by app: a store runs several Edge apps, so one
   card per merchant is the honest unit. */
function visibleCards(): CaseStudyCard[] {
	return Object.entries(CASE_STUDIES).flatMap(([key, study]) =>
		isCaseStudyVisible(study) ? [{ ...study, slug: key }] : []
	);
}

export function CaseStudies() {
	const cards = visibleCards();

	if (cards.length === 0) {
		return null;
	}

	return (
		<section
			aria-labelledby="case-studies-heading"
			className="w-full pt-4 pb-20 sm:pt-6"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex flex-col gap-3">
					<p className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]">
						Proof
					</p>
					<h2
						className="text-balance font-medium text-display text-primary-foreground"
						id="case-studies-heading"
					>
						Stores running Edge right now.
					</h2>
				</div>
				<Link
					className="shrink-0 text-body-sm text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
					href={"/products" as Route}
				>
					See what each app does
				</Link>
			</div>

			<CaseStudyTrack cards={cards} />
		</section>
	);
}
