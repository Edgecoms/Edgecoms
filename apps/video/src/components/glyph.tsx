import { COLOR } from "@/theme";

/** Line-art glyphs, drawn inline so the video adds no icon dependency. */
export const GLYPH = {
	commission:
		"M12 2 14 4.4 17.1 4l.4 3.1L20 9l-1.6 2.7L20 14l-2.5 1.9-.4 3.1-3.1-.4L12 21l-2-2.4-3.1.4-.4-3.1L4 14l1.6-2.7L4 9l2.5-1.9.4-3.1 3.1.4ZM10 10h.01M14 14h.01M14.5 9.5l-5 5",
	payout:
		"M2 6h20v12H2zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M5.5 9v6M18.5 9v6",
	store: "M3 9.5 4.5 4h15L21 9.5M3 9.5h18M3 9.5v10h18v-10M8 19.5v-6h4v6",
	partner:
		"M9 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 18a7 7 0 0 1 11-5.7M17 14v6M14 17h6",
} as const;

export interface GlyphProps {
	path: string;
	/** Corner radius. Defaults to a circle. */
	radius?: number | string;
	/** Box size in px. */
	size?: number;
}

export const Glyph = ({ path, size = 60, radius = "50%" }: GlyphProps) => (
	<span
		style={{
			alignItems: "center",
			border: "1px solid #E6EAEF",
			borderRadius: radius,
			color: COLOR.ink,
			display: "flex",
			flexShrink: 0,
			height: size,
			justifyContent: "center",
			width: size,
		}}
	>
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.7}
			style={{ height: size * 0.46, width: size * 0.46 }}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d={path} />
		</svg>
	</span>
);
