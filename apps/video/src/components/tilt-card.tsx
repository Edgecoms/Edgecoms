import type { CSSProperties, ReactNode } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface TiltCardProps {
	children: ReactNode;
	/** Resting depth — smaller sits further back. */
	depth?: number;
	/** Frame the card starts flying in. */
	from: number;
	/** Where it comes from, in px relative to its resting place. */
	offset: { x: number; y: number };
	style?: CSSProperties;
	/** Resting rotation, degrees. */
	tilt?: number;
}

/**
 * The house card entrance: flies in from off-frame on a 3D tilt, settles to its
 * resting depth on a critically-damped spring. No bounce, soft long shadow.
 */
export const TiltCard = ({
	children,
	from,
	offset,
	tilt = 0,
	depth = 1,
	style,
}: TiltCardProps) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const settle = spring({
		config: { damping: 200 },
		durationInFrames: 30,
		fps,
		frame: frame - from,
	});

	const x = (1 - settle) * offset.x;
	const y = (1 - settle) * offset.y;
	const rotate = tilt + (1 - settle) * 12;
	const rotateY = (1 - settle) * -18;

	return (
		<div
			style={{
				boxShadow: `0 ${28 * depth}px ${70 * depth}px -${18 * depth}px rgba(15, 23, 42, 0.16)`,
				opacity: settle,
				perspective: 1400,
				transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) rotateY(${rotateY}deg) scale(${depth})`,
				...style,
			}}
		>
			{children}
		</div>
	);
};
