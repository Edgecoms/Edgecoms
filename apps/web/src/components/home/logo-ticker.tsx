/**
 * PLACEHOLDER DATA — invented names standing in for real customer logos, so the
 * strip renders while the real assets are sourced. Swap for <Image> marks from
 * /public and replace the heading with a figure you can substantiate before
 * this goes near production.
 */
const PLACEHOLDER_BRANDS = [
	"Northwind",
	"Lumen",
	"Atlas Supply",
	"Harbor Goods",
	"Verdant",
	"Foundry",
	"Meridian",
	"Kite & Co",
] as const;

/**
 * Both groups must render identical markup and classes: the track animates by
 * exactly -50%, so the halves have to be equal width for the loop point to land
 * on a matching frame. Changing padding on one side alone will make it stutter.
 */
const GROUP_CLASS =
	"flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16";

function BrandGroup({ hidden = false }: { hidden?: boolean }) {
	return (
		<ul aria-hidden={hidden || undefined} className={GROUP_CLASS}>
			{PLACEHOLDER_BRANDS.map((brand) => (
				<li
					className="shrink-0 font-medium text-h3 text-secondary-foreground/70"
					key={brand}
				>
					{brand}
				</li>
			))}
		</ul>
	);
}

export function LogoTicker() {
	return (
		<section aria-labelledby="ticker-heading" className="w-full pb-24">
			<h2
				className="mb-10 text-center font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]"
				id="ticker-heading"
			>
				Trusted by growing Shopify brands
			</h2>

			{/* The mask feathers both edges so items fade out instead of clipping.
			    Under reduced motion the animation stops, so the track degrades to a
			    plain horizontally scrollable list rather than a dead, cut-off row. */}
			<div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] motion-reduce:overflow-x-auto">
				<div className="flex w-max animate-marquee-left motion-reduce:animate-none hover:[animation-play-state:paused]">
					<BrandGroup />
					{/* Visual filler for the seamless loop — hidden from assistive
					    tech so the brand list is not announced twice. */}
					<BrandGroup hidden />
				</div>
			</div>
		</section>
	);
}
