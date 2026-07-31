import Image from "next/image";
import { INTEGRATIONS, type Integration } from "@/lib/integrations";

/** The height every mark is optically sized against. */
const LOGO_HEIGHT = 40;

/**
 * The official mark once it exists, the brand name until then. The fallback is
 * deliberate rather than a placeholder to be ashamed of: a wordmark set in our
 * own type is honest, whereas a traced or approximated logo misrepresents
 * somebody else's brand and looks it.
 */
function Mark({ integration }: { integration: Integration }) {
	if (integration.logo) {
		return (
			/* `size-9` rather than `h-9 w-auto`. Every file in `public/logos` is a
			   24×24 glyph with no width or height of its own, so `w-auto` left the
			   browser to infer each one's width and they came out unequal. Pinning
			   both axes makes the boxes identical; `object-contain` keeps the glyph
			   inside its own aspect rather than stretching it to fill the square. */
			<Image
				alt={integration.name}
				className="size-9 object-contain opacity-50 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
				height={LOGO_HEIGHT}
				src={integration.logo}
				unoptimized
				width={integration.width ?? LOGO_HEIGHT}
			/>
		);
	}

	return (
		/* Sized to sit level with the glyph marks rather than at display size — a
		   wordmark next to icons reads far larger than its cap height suggests,
		   because it is wide as well as tall. */
		<span className="whitespace-nowrap font-medium text-h2 text-secondary-foreground/45">
			{integration.name}
		</span>
	);
}

/**
 * The strip under the hero. It answers the first objection a merchant has after
 * the headline — "will this work with what I already run?" — rather than
 * claiming customers we cannot name yet. See `lib/integrations.ts` for the rule
 * every entry has to satisfy.
 *
 * A static row rather than a marquee. Five marks fit on one line at every
 * width, so scrolling them bought nothing and cost the edge mask, the
 * reduced-motion branch and the duplicate copies a loop needs. It wraps rather
 * than overflows on narrow screens.
 */
export function LogoTicker() {
	return (
		<section aria-labelledby="ticker-heading" className="w-full py-10">
			<h2
				className="mb-8 text-center font-medium text-body-sm text-secondary-foreground sm:mb-10"
				id="ticker-heading"
			>
				Works with the stack you already run
			</h2>

			<ul className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-x-14 gap-y-8 px-6 sm:gap-x-24">
				{/* Each item is the same fixed-height box, so a wide short glyph and a
				    tall narrow one still sit on one line rather than each setting its
				    own row height. */}
				{INTEGRATIONS.map((integration) => (
					<li
						className="flex h-10 items-center justify-center"
						key={integration.name}
					>
						<Mark integration={integration} />
					</li>
				))}
			</ul>
		</section>
	);
}
