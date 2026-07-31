import type { Route } from "next";
import Link from "next/link";
import { GridMarkers } from "@/components/home/grid-markers";
import { Highlight } from "@/components/ui/highlight";
import { productsByLever, RPV_LEVERS } from "@/lib/products";

/* The spine of the whole site. It works because it is arithmetic rather than
   marketing: a merchant reads it, audits themselves against it, and arrives at
   the app they need without being sold anything.

   RPV is defined once, here, in half a sentence. Never again after this — a
   store owner doing $8k a month may not know the acronym, and making them
   look it up is a bounce. */
const TERMS = [
	{
		gloss: "what one visit to your store is actually worth",
		symbol: "RPV",
		term: "Revenue per visitor",
	},
	{
		gloss: "how many of them buy",
		symbol: "CVR",
		term: "Conversion rate",
	},
	{
		gloss: "how much each buyer spends",
		symbol: "AOV",
		term: "Average order value",
	},
] as const;

const LEVER_COLUMNS = RPV_LEVERS.filter((lever) => lever.key !== "proof");
const PROOF_APPS = productsByLever("proof");

function Term({
	gloss,
	symbol,
	term,
}: {
	gloss: string;
	symbol: string;
	term: string;
}) {
	return (
		<div className="flex flex-col items-center gap-1.5 text-center">
			<span className="font-medium text-h1 text-primary-foreground tracking-tight sm:text-display">
				{symbol}
			</span>
			<span className="font-medium text-body-sm text-primary-foreground">
				{term}
			</span>
			<span className="max-w-[16ch] text-pretty text-caption text-secondary-foreground leading-relaxed">
				{gloss}
			</span>
		</div>
	);
}

/*
 * The bottom padding only applies once the equation is a row: it lifts the
 * operator off the baseline to sit level with the symbols above the glosses.
 * Stacked on mobile there is nothing to align to, and the padding would leave
 * the operator hanging away from the terms it joins.
 */
function Operator({ children }: { children: string }) {
	return (
		<span
			aria-hidden="true"
			className="font-medium text-[var(--gray-8)] text-h1 sm:pb-14 sm:text-display"
		>
			{children}
		</span>
	);
}

export function RpvEquation() {
	const [rpv, cvr, aov] = TERMS;

	return (
		<section
			aria-labelledby="rpv-heading"
			className="relative w-full scroll-mt-24 py-24"
			id="how-it-adds-up"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a3)_1px,transparent_1px)] [background-size:22px_22px]"
			/>

			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
					<p className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]">
						How a store actually grows
					</p>
					<h2
						className="text-balance font-medium text-display text-primary-foreground"
						id="rpv-heading"
					>
						<Highlight>
							There are only two ways to make a visit worth more
						</Highlight>
					</h2>
					<p className="text-pretty text-body-lg text-secondary-foreground leading-relaxed">
						More of your visitors buy, or the ones who buy spend more. That is
						the entire equation, and every Edge app pulls on one side of it.
					</p>
				</div>

				{/* The equation itself. Screen readers get the sentence; sighted
				    readers get the arithmetic. */}
				<p className="sr-only">
					Revenue per visitor equals conversion rate multiplied by average order
					value.
				</p>

				<div
					aria-hidden="true"
					className="mt-14 flex flex-col items-center gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-center sm:gap-x-9 sm:gap-y-8"
				>
					<Term gloss={rpv.gloss} symbol={rpv.symbol} term={rpv.term} />
					<Operator>=</Operator>
					<Term gloss={cvr.gloss} symbol={cvr.symbol} term={cvr.term} />
					<Operator>×</Operator>
					<Term gloss={aov.gloss} symbol={aov.symbol} term={aov.term} />
				</div>

				<p className="mx-auto mt-12 max-w-2xl text-balance text-center text-body-lg text-primary-foreground leading-relaxed">
					Most stores spend a year optimising the first number and never touch
					the second. That is why their revenue per visitor is flat.
				</p>

				{/* Which app pulls which lever. */}
				<div className="relative mt-16">
					<div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
						{LEVER_COLUMNS.map((lever) => (
							<div
								className="flex flex-col gap-4 bg-bg p-8 sm:p-10"
								key={lever.key}
							>
								<span className="w-fit rounded-full bg-brand/12 px-2.5 py-1 font-medium font-mono text-[11px] text-brand uppercase tracking-[0.1em]">
									{lever.label}
								</span>
								<h3 className="text-balance font-medium text-h3 text-primary-foreground">
									{lever.title}
								</h3>
								<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{lever.description}
								</p>
								<ul className="mt-auto flex flex-col gap-1 pt-2">
									{productsByLever(lever.key).map((product) => (
										<li key={product.slug}>
											<Link
												className="text-body-sm text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
												href={`/products/${product.slug}` as Route}
											>
												{product.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>

					<GridMarkers cols={3} rows={1} />
				</div>

				{/* Proof sits outside the equation on purpose: it does not raise RPV,
				    it tells you whether anything else did. */}
				{PROOF_APPS.map((product) => (
					<div
						className="mt-px flex flex-col gap-3 border border-border bg-page p-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-10"
						key={product.slug}
					>
						<p className="max-w-3xl text-pretty text-body-sm text-secondary-foreground leading-relaxed">
							<span className="font-medium text-primary-foreground">
								And {product.name} tells you which of it was real.
							</span>{" "}
							Server-side conversion tracking for Meta, Google, and TikTok, so
							the numbers you use to decide where the next dollar of ad spend
							goes match what actually happened in your store.
						</p>
						<Link
							className="shrink-0 text-body-sm text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
							href={`/products/${product.slug}` as Route}
						>
							See {product.name}
						</Link>
					</div>
				))}
			</div>
		</section>
	);
}
