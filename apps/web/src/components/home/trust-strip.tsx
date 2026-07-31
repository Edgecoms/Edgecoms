/* Claims here must stay provable — this strip sits directly under the fold and
   is the first thing a merchant checks us on. No customer counts, no revenue
   multiples, nothing we cannot point at. */
const CLAIMS = [
	"Built on Shopify",
	"Billed on your Shopify invoice",
	"Works with any theme",
	"Live in minutes",
] as const;

export function TrustStrip() {
	return (
		<section aria-label="What Edge guarantees" className="w-full px-6">
			<ul className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-x-10 gap-y-3 border-border border-y py-5 sm:flex-row sm:flex-wrap">
				{CLAIMS.map((claim) => (
					<li
						className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.12em]"
						key={claim}
					>
						{claim}
					</li>
				))}
			</ul>
		</section>
	);
}
