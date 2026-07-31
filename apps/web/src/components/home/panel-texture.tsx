import { FlickeringGrid } from "@edgecoms/ui/components/flickering-grid";

/**
 * The animated dot field that textures every orange panel — hero, the "one
 * suite" half of the comparison, and the closing CTA. Kept in one place so the
 * three stay identical; tuning opacity here tunes all of them.
 *
 * Opacity is deliberately low: white body copy sits directly on top of this and
 * already runs close to the contrast floor on raw brand orange.
 */
export function PanelTexture() {
	return (
		<FlickeringGrid
			aria-hidden="true"
			className="pointer-events-none absolute inset-0"
			color="rgb(255, 255, 255)"
			flickerChance={0.2}
			gridGap={6}
			maxOpacity={0.16}
			squareSize={4}
		/>
	);
}
