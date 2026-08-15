import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { AvatarField } from "@/components/avatar-field";
import { EdgePartnersLockup } from "@/components/edge-partners-lockup";
import { OPENING_FACES } from "@/faces";

/** Screen 2 — 2–3s. */
export const EDGE_PARTNERS_DURATION = 30;

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const EdgePartners = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const enter = interpolate(frame, [0, 14], [0, 1], {
		easing: EASE,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const markScale = spring({
		config: { damping: 200 },
		durationInFrames: 16,
		fps,
		frame: frame - 2,
	});

	return (
		<AbsoluteFill>
			<AvatarField faces={OPENING_FACES} />

			<AbsoluteFill
				className="items-center justify-center"
				style={{
					filter: `blur(${(1 - enter) * 10}px)`,
					opacity: enter,
					transform: `translateY(${(1 - enter) * 34}px)`,
				}}
			>
				<EdgePartnersLockup fontSize={96} markScale={markScale} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
