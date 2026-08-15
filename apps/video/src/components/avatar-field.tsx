import {
	Easing,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
} from "remotion";
import { CELL } from "@/components/grid-bg";

export interface Face {
	/** Depth-of-field amount, in px. 0 reads as foreground. */
	blur: number;
	/** Grid cell, counting from the top-left of the frame. */
	col: number;
	/** Frames to wait before this face lands. Negative = already there at frame 0. */
	delay: number;
	row: number;
	src: string;
}

const ENTER_FRAMES = 12;
const RISE = 26;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/**
 * Partner faces snapped into the graph-paper cells, thrown out of focus so they
 * read as depth around the copy rather than as content.
 */
export const AvatarField = ({ faces }: { faces: readonly Face[] }) => {
	const frame = useCurrentFrame();

	return (
		<>
			{faces.map(({ blur, col, delay, row, src }) => {
				const enter = interpolate(frame - delay, [0, ENTER_FRAMES], [0, 1], {
					easing: EASE,
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});

				return (
					<Img
						key={`${col}-${row}`}
						src={staticFile(`avatars/${src}`)}
						style={{
							filter: `blur(${blur}px)`,
							height: CELL,
							left: col * CELL,
							objectFit: "cover",
							opacity: enter,
							position: "absolute",
							top: row * CELL,
							transform: `translateY(${(1 - enter) * RISE}px)`,
							width: CELL,
						}}
					/>
				);
			})}
		</>
	);
};
