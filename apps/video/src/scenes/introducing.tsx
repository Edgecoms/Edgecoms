import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SoftBlurIn } from "@/components/remocn/soft-blur-in";
import { COLOR } from "@/theme";

/** Screen 1 — 0–2s. */
export const INTRODUCING_DURATION = 60;

/** The word lifts and fades out over the last half-second, handing off to the lockup. */
const EXIT_START = 44;
const EXIT_FRAMES = 16;
const EXIT_RISE = 70;

const EASE = Easing.bezier(0.4, 0, 1, 1);

export const Introducing = () => {
	const frame = useCurrentFrame();

	const exit = interpolate(
		frame,
		[EXIT_START, EXIT_START + EXIT_FRAMES],
		[0, 1],
		{
			easing: EASE,
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	return (
		<AbsoluteFill
			style={{
				filter: `blur(${exit * 10}px)`,
				opacity: 1 - exit,
				transform: `translateY(${-exit * EXIT_RISE}px)`,
			}}
		>
			<SoftBlurIn
				color={COLOR.ink}
				fontSize={112}
				fontWeight={700}
				text="Introducing"
			/>
		</AbsoluteFill>
	);
};
