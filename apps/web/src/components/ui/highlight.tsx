import type { ReactNode } from "react";

/**
 * Highlights the metric vocabulary inside a string, the way a reader would run
 * a marker over the words that matter.
 *
 * Done by dictionary rather than by hand-wrapping words in the copy, for two
 * reasons: the copy stays plain strings in `products.ts` and friends, so no
 * markup leaks into data; and a headline written next month gets highlighted
 * without anybody remembering to do it.
 *
 * Use it on headlines and short leads only. Density is what makes a highlighter
 * work — run it over a whole paragraph and it stops meaning "this is the
 * important bit" and starts meaning nothing.
 */

/**
 * Longest first. The regex alternates in order, so "average order value" has to
 * come before "order value", or the shorter phrase wins and the highlight lands
 * on half the term.
 */
const TERMS = [
	"revenue per visitor",
	"average order value",
	"cost per acquisition",
	"product page conversion",
	"international conversion",
	"recurring revenue",
	"conversion rate",
	"lifetime value",
	"reported ROAS",
	"attach rate",
	"match rate",
	"order value",
	"subscribers",
	"ad spend",
	"AOV",
	"CVR",
	"RPV",
	"LTV",
	"MRR",
	"ROAS",
	"CAC",
	"traffic",
	"churn",
	"margin",
] as const;

function escapeForRegex(term: string): string {
	return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* Built once at module scope. A regex literal rebuilt per render would be
   recompiled on every headline on the page. */
const TERM_PATTERN = new RegExp(
	`\\b(${TERMS.map(escapeForRegex).join("|")})\\b`,
	"gi"
);

export function Highlight({ children }: { children: string }): ReactNode {
	const parts = children.split(TERM_PATTERN);

	if (parts.length === 1) {
		return children;
	}

	return parts.map((part, index) => {
		// `split` on a capturing group puts the matches at the odd indices.
		const isTerm = index % 2 === 1;
		const key = `${index}-${part}`;

		if (!isTerm) {
			return <span key={key}>{part}</span>;
		}

		return (
			/* The fill is a rotated pseudo-element rather than the mark's own
			   background, because a transform does nothing on a non-replaced inline
			   box — tilting the mark itself would have to tilt the text with it.
			   Square corners and the horizontal overhang are what read as a swipe of
			   tape rather than a rounded UI chip.

			   `inline-block` is the cost: a multi-word term now moves to the next
			   line whole instead of wrapping mid-phrase. On headlines that is the
			   better break anyway, and the terms are three words at most. */
			<mark
				className="relative isolate inline-block bg-transparent text-inherit before:absolute before:inset-x-[-0.15em] before:inset-y-[0.05em] before:-z-10 before:-rotate-[1.5deg] before:bg-brand/20 before:content-['']"
				key={key}
			>
				{part}
			</mark>
		);
	});
}
