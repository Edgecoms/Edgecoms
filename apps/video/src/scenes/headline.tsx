import {
	AbsoluteFill,
	Easing,
	interpolate,
	Sequence,
	useCurrentFrame,
} from "remotion";
import { AvatarField } from "@/components/avatar-field";
import { EdgePartnersLockup } from "@/components/edge-partners-lockup";
import { MaskRevealUp } from "@/components/remocn/mask-reveal-up";
import { FIELD_FACES } from "@/faces";
import { COLOR } from "@/theme";

/** Screen 3 — 3–6s. */
export const HEADLINE_DURATION = 90;

/** The lockup carries over from screen 2, shrinking and rising to make room. */
const LOCKUP_FONT_SIZE = 96;
const LOCKUP_SETTLED_SCALE = 0.66;
const LOCKUP_RISE = 175;
const LOCKUP_TRAVEL_FRAMES = 14;
const HEADLINE_START = 8;
const HEADLINE_DROP = 60;

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const Headline = () => {
	const frame = useCurrentFrame();

	const travel = interpolate(frame, [0, LOCKUP_TRAVEL_FRAMES], [0, 1], {
		easing: EASE,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const scale = interpolate(travel, [0, 1], [1, LOCKUP_SETTLED_SCALE]);

	return (
		<AbsoluteFill>
			<AvatarField faces={FIELD_FACES} />

			<AbsoluteFill
				className="items-center justify-center"
				style={{
					transform: `translateY(${-travel * LOCKUP_RISE}px) scale(${scale})`,
				}}
			>
				<EdgePartnersLockup fontSize={LOCKUP_FONT_SIZE} />
			</AbsoluteFill>

			<Sequence
				durationInFrames={HEADLINE_DURATION - HEADLINE_START}
				from={HEADLINE_START}
			>
				<AbsoluteFill style={{ transform: `translateY(${HEADLINE_DROP}px)` }}>
					<MaskRevealUp
						color={COLOR.ink}
						fontSize={96}
						fontWeight={700}
						text={"Grow your revenue\nwith partnerships"}
					/>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
