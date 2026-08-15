import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** The four dots from the site's PartnersIcon, inheriting the current colour. */
export const PartnersDots = ({ size }: { size: number }) => (
	<svg
		aria-hidden="true"
		fill="none"
		style={{ height: size, width: size }}
		viewBox="0 0 32 32"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="26" cy="16" fill="currentColor" r="4.5" />
		<circle cx="6" cy="16" fill="currentColor" r="4.5" />
		<circle cx="16" cy="26" fill="currentColor" r="4.5" />
		<circle cx="16" cy="6" fill="currentColor" r="4.5" />
	</svg>
);

/** The Edge Partners mark — the dots on the brand square. */
const PartnersMark = ({ scale, size }: { scale: number; size: number }) => (
	<span
		className="inline-flex shrink-0 items-center justify-center rounded-[22%] border border-black/5"
		style={{
			backgroundColor: COLOR.accent,
			/* White dots: slate ones went muddy once the square turned purple. */
			color: "#FFFFFF",
			height: size,
			transform: `scale(${scale})`,
			width: size,
		}}
	>
		<PartnersDots size={size * 0.62} />
	</span>
);

export interface EdgePartnersLockupProps {
	/** Characters of "Edge Partners" revealed so far. */
	charsVisible?: number;
	/** Wordmark colour. The mark stays amber on any ground. */
	color?: string;
	fontSize: number;
	/** 0 → mark absent, 1 → mark at full size. */
	markScale?: number;
}

export const EdgePartnersLockup = ({
	fontSize,
	markScale = 1,
	charsVisible,
	color = COLOR.ink,
}: EdgePartnersLockupProps) => {
	const wordmark = "Edge Partners";
	const shown =
		charsVisible === undefined ? wordmark : wordmark.slice(0, charsVisible);

	return (
		<div
			className="flex items-center"
			style={{ gap: fontSize * 0.32, letterSpacing: "-0.04em" }}
		>
			<PartnersMark scale={markScale} size={fontSize * 1.28} />
			<span
				style={{
					color,
					fontFamily: SANS_STACK,
					fontSize,
					fontWeight: 700,
					whiteSpace: "pre",
				}}
			>
				{shown}
			</span>
		</div>
	);
};
