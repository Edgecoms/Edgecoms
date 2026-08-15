import type { CSSProperties, ReactNode } from "react";
import {
	Easing,
	interpolate,
	interpolateColors,
	useCurrentFrame,
} from "remotion";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

const LAND_FRAMES = 7;
const LAND_RISE = 6;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export interface GhostBuildProps {
	color?: string;
	fontSize?: number;
	fontWeight?: number;
	/** Frame the first word lands on. */
	from?: number;
	ghostColor?: string;
	style?: CSSProperties;
	/** Headline copy. `\n` starts a new line. */
	text: string;
	/** Rendered inline after the last word — e.g. a cycling value. */
	trailing?: ReactNode;
	/** Frames between one word landing and the next. */
	wordStagger?: number;
}

/**
 * The house headline: the whole phrase sits in ghost gray from the first frame
 * so the layout never reflows, then each word darkens into ink in turn. Never a
 * fade — words land, they do not appear.
 */
export const GhostBuild = ({
	text,
	color = COLOR.ink,
	fontSize = 108,
	fontWeight = 700,
	ghostColor = COLOR.inkGhost,
	from = 0,
	wordStagger = 7,
	trailing,
	style,
}: GhostBuildProps) => {
	const frame = useCurrentFrame();
	const lines = text.split("\n").map((line) => line.split(" "));

	let wordIndex = -1;

	return (
		<span
			style={{
				color: ghostColor,
				fontFamily: SANS_STACK,
				fontSize,
				fontWeight,
				letterSpacing: "-0.035em",
				lineHeight: 1.08,
				textAlign: "center",
				...style,
			}}
		>
			{lines.map((words, lineIdx) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: line order is the identity
					key={`line-${lineIdx}`}
					style={{ display: "block", whiteSpace: "pre" }}
				>
					{words.map((word) => {
						wordIndex += 1;
						const local = frame - (from + wordIndex * wordStagger);
						const land = interpolate(local, [0, LAND_FRAMES], [0, 1], {
							easing: EASE,
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						});

						return (
							<span
								key={`${word}-${wordIndex}`}
								style={{
									color: interpolateColors(land, [0, 1], [ghostColor, color]),
									display: "inline-block",
									transform: `translateY(${(1 - land) * LAND_RISE}px)`,
								}}
							>
								{word}
								{" "}
							</span>
						);
					})}
					{lineIdx === lines.length - 1 ? trailing : null}
				</span>
			))}
		</span>
	);
};
