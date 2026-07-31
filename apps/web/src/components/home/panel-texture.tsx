import { FlickeringGrid } from "@edgecoms/ui/components/flickering-grid";

/**
 * The animated dot field that textures every orange panel — hero, the "one
 * suite" half of the comparison, and the closing CTA. Kept in one place so the
 * three stay identical; tuning opacity here tunes all of them.
 *
 * The mask fades the field out towards the top, so the grid is densest along
 * the bottom edge where the warm glow sits and clears away behind the
 * headline — which is what keeps a 0.25 opacity readable under white type.
 */
export function PanelTexture() {
	return (
		<FlickeringGrid
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_top,black_5%,transparent_88%)]"
			color="rgb(255, 255, 255)"
			flickerChance={0.2}
			gridGap={5}
			maxOpacity={0.25}
			squareSize={2}
		/>
	);
}
