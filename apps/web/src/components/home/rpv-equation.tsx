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
	outcome = false,
	symbol,
	term,
}: {
	gloss: string;
	outcome?: boolean;
	symbol: string;
	term: string;
}) {
	/* RPV is the answer, not an input, so it carries the brand fill and the two
	   inputs sit on the page surface. Without that the three read as a list of
	   equals rather than as an equation with a result.

	   The symbol sits in a fixed `h-14` box rather than flowing. That box, plus
	   the shared `py-8`, is what the operators align themselves to — it is the
	   one measurement the whole row agrees on, so `=` and `×` land on the
	   symbols instead of floating at the midpoint of a card whose height depends
	   on how long its gloss happens to be. */
	return (
		<div
			className={`flex flex-col items-center rounded-2xl border px-6 py-8 text-center sm:px-8 ${
				outcome ? "border-brand/30 bg-brand/8" : "border-border bg-page"
			}`}
		>
			<span
				className={`flex h-14 items-center font-medium text-display leading-none tracking-tight ${outcome ? "text-brand" : "text-primary-foreground"}`}
			>
				{symbol}
			</span>
			{/* Name tight to the symbol — they are the same thing said twice. The
			    gloss is a separate register, so it gets the larger step. */}
			<span className="mt-2 font-medium text-body text-primary-foreground">
				{term}
			</span>
			<span className="mt-3 max-w-[20ch] text-pretty text-caption text-secondary-foreground leading-relaxed">
				{gloss}
			</span>
		</div>
	);
}

function Operator({ children }: { children: string }) {
	/* Stretches to the full row height and centres inside it, so the glyph sits
	   on the cards' midline. The row's `items-stretch` is what makes that a real
	   centre now — the cards are all one height, so there is a single midline to
	   sit on. */
	return (
		<span aria-hidden="true" className="flex items-center justify-center">
			<span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-bg font-medium text-[var(--gray-9)] text-h3">
				{children}
			</span>
		</span>
	);
}

export function RpvEquation() {
	const [rpv, cvr, aov] = TERMS;

	return (
		<section
			aria-labelledby="rpv-heading"
			className="relative w-full scroll-mt-24 py-10"
			id="how-it-adds-up"
		>
			{/* Masked to a soft ellipse instead of running edge to edge. At full
			    strength behind the whole section the dots competed with the cards
			    sitting on top of them; faded out at the margins they read as
			    atmosphere and let the equation hold the centre. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a3)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_32%,black,transparent_75%)]"
			/>

			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="mx-auto flex max-w-2xl flex-col items-start gap-4 text-left sm:items-center sm:text-center">
					<p className="font-medium text-body-sm text-brand">
						How a store actually grows
					</p>
					<h2
						className="text-balance font-medium text-h1 text-primary-foreground sm:text-display"
						id="rpv-heading"
					>
						<Highlight>Every Shopify store grows the same way.</Highlight>
					</h2>
					<p className="text-pretty text-body text-secondary-foreground leading-relaxed sm:text-body-lg">
						Revenue doesn’t become unpredictable because there are hundreds of
						metrics. It grows when you improve just a few of them consistently.
					</p>
				</div>

				{/* The equation itself. Screen readers get the sentence; sighted
				    readers get the arithmetic. */}
				<p className="sr-only">
					Revenue per visitor equals conversion rate multiplied by average order
					value.
				</p>

				{/* A grid, not a flex row. `sm:items-stretch` is the fix for the
				    ragged look: under `items-center` each card shrank to its own
				    content, so a one-line gloss made a shorter card than a two-line
				    one and the three tops and bottoms all disagreed. Equal columns
				    with equal heights make it read as arithmetic. */}
				<div
					aria-hidden="true"
					className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch sm:gap-5"
				>
					<Term gloss={rpv.gloss} outcome symbol={rpv.symbol} term={rpv.term} />
					<Operator>=</Operator>
					<Term gloss={cvr.gloss} symbol={cvr.symbol} term={cvr.term} />
					<Operator>×</Operator>
					<Term gloss={aov.gloss} symbol={aov.symbol} term={aov.term} />
				</div>

				<p className="mx-auto mt-14 max-w-2xl text-balance text-left text-body-lg text-primary-foreground leading-relaxed sm:text-center">
					Most merchants spend months buying more traffic before realizing their
					existing visitors were already worth more.
				</p>

				{/* Which app pulls which lever. Held further from the statement above
				    than the statement is from the equation, so the page reads as two
				    blocks rather than three evenly spaced ones. */}
				<div className="relative mt-20">
					<div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
						{LEVER_COLUMNS.map((lever) => (
							<div
								className="flex flex-col gap-4 bg-bg p-8 sm:p-10"
								key={lever.key}
							>
								<span className="w-fit rounded-full bg-brand/12 px-2.5 py-1 font-medium text-[11px] text-brand uppercase tracking-[0.1em]">
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
