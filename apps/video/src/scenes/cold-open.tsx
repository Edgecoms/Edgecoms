import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { EdgePartnersLockup } from "@/components/edge-partners-lockup";
import { Typewriter } from "@/components/remocn/typewriter";
import { COLOR } from "@/theme";

/** 0–2s. */
export const COLD_OPEN_DURATION = 60;

const INTRO_EXIT = 26;
const LOCKUP_START = 32;
const MARK_START = 46;
const WORDMARK_CPS = 26;

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const ColdOpen = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const exit = interpolate(frame, [INTRO_EXIT, INTRO_EXIT + 12], [0, 1], {
		easing: EASE,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const charsVisible = Math.max(
		0,
		Math.floor(((frame - LOCKUP_START) / fps) * WORDMARK_CPS)
	);

	const markScale = spring({
		config: { damping: 200 },
		durationInFrames: 14,
		fps,
		frame: frame - MARK_START,
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill
				className="items-center justify-center"
				style={{
					opacity: 1 - exit,
					transform: `translateY(${exit * -28}px)`,
				}}
			>
				<Typewriter
					charsPerSecond={24}
					color={COLOR.ink}
					cursor={false}
					fontSize={114}
					fontWeight={700}
					text="Introducing"
				/>
			</AbsoluteFill>

			<AbsoluteFill
				className="items-center justify-center"
				style={{ opacity: frame >= LOCKUP_START ? 1 : 0 }}
			>
				<EdgePartnersLockup
					charsVisible={charsVisible}
					fontSize={96}
					markScale={markScale}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
