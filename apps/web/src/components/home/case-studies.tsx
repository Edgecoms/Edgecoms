import type { Route } from "next";
import Link from "next/link";
import {
	type CaseStudyCard,
	CaseStudyTrack,
} from "@/components/home/case-study-track";
import { CASE_STUDIES, isCaseStudyVisible } from "@/lib/marketing-stats";
import { EDGE_PRODUCTS } from "@/lib/products";

/**
 * The proof row: one card per merchant, each carrying the single number that
 * moved. Selection happens here on the server; the scrolling track is the only
 * part that has to be a client component.
 *
 * Unpublished studies render in development and are excluded from production
 * builds — see `SHOW_PLACEHOLDER_PROOF` in `marketing-stats.ts`.
 */

/* flatMap rather than map-then-filter so there is no intermediate null to
   narrow back out — the hidden ones simply never enter the list. */
function visibleCards(): CaseStudyCard[] {
	return EDGE_PRODUCTS.flatMap((product) => {
		const study = CASE_STUDIES[product.slug];
		if (!(study && isCaseStudyVisible(study))) {
			return [];
		}
		return [{ ...study, slug: product.slug }];
	});
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
						The numbers, from real stores.
					</h2>
				</div>
				<Link
					className="shrink-0 text-body-sm text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
					href={"/products" as Route}
				>
					See which app did it
				</Link>
			</div>

			<CaseStudyTrack cards={cards} />
		</section>
	);
}
