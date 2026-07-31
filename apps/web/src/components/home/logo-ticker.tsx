import { INTEGRATIONS } from "@/lib/integrations";

/**
 * Both groups must render identical markup and classes: the track animates by
 * exactly -50%, so the halves have to be equal width for the loop point to land
 * on a matching frame. Changing padding on one side alone will make it stutter.
 */
const GROUP_CLASS =
	"flex shrink-0 items-center gap-12 pr-12 sm:gap-20 sm:pr-20";

function IntegrationGroup({ hidden = false }: { hidden?: boolean }) {
	return (
		<ul aria-hidden={hidden || undefined} className={GROUP_CLASS}>
			{INTEGRATIONS.map((integration) => (
				<li
					className="shrink-0 whitespace-nowrap font-medium text-h1 text-secondary-foreground/45 sm:text-display"
					key={integration.name}
				>
					{integration.name}
				</li>
			))}
		</ul>
	);
}

/**
 * The strip under the hero. It answers the first objection a merchant has after
 * the headline — "will this work with what I already run?" — rather than
 * claiming customers we cannot name yet. See `lib/integrations.ts` for the rule
 * every entry has to satisfy, and for how to swap in merchant marks later.
 */
export function LogoTicker() {
	return (
		<section aria-labelledby="ticker-heading" className="w-full py-10 sm:py-12">
			<h2
				className="mb-8 text-center font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em] sm:mb-10"
				id="ticker-heading"
			>
				Works with the stack you already run
			</h2>

			{/* The mask feathers both edges so names fade out instead of clipping.
			    Under reduced motion the animation stops, so the track degrades to a
			    plain horizontally scrollable list rather than a dead, cut-off row. */}
			<div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] motion-reduce:overflow-x-auto">
				{/* Slower than the shared marquee default. The names are set large
				    here, so the same duration would move far more pixels a second and
				    turn a background detail into the loudest thing on the page. */}
				<div className="flex w-max animate-marquee-left [animation-duration:75s] motion-reduce:animate-none hover:[animation-play-state:paused]">
					<IntegrationGroup />
					{/* Visual filler for the seamless loop — hidden from assistive tech
					    so the list is not announced twice. */}
					<IntegrationGroup hidden />
				</div>
			</div>
		</section>
	);
}
