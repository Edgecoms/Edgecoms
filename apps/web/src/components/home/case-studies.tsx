import type { Route } from "next";
import Link from "next/link";
import {
	type CaseStudyCard,
	CaseStudyTrack,
} from "@/components/home/case-study-track";
import { CASE_STUDIES } from "@/lib/marketing-stats";

/**
 * The proof row: one card per merchant, each carrying the single number that
 * moved. Selection happens here on the server; the scrolling track is the only
 * part that has to be a client component.
 */

export function CaseStudies() {
	/* Keyed by merchant, not by app: a store runs several Edge apps, so one card
	   per merchant is the honest unit. */
	const cards: CaseStudyCard[] = Object.entries(CASE_STUDIES).map(
		([key, study]) => ({ ...study, slug: key })
	);

	if (cards.length === 0) {
		return null;
	}

	return (
		<section
			aria-labelledby="case-studies-heading"
			className="w-full pt-4 pb-10 sm:pt-6"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 sm:flex-row sm:items-end sm:justify-between">
				<div className="flex flex-col gap-3">
					<h2
						className="text-balance font-medium text-h1 text-primary-foreground"
						id="case-studies-heading"
					>
						Trusted by brands focused on profitable growth.
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
