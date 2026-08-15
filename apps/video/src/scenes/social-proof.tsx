import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { GhostBuild } from "@/components/ghost-build";
import { TESTIMONIALS } from "@/content";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** 37–43s. */
export const SOCIAL_PROOF_DURATION = 180;

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** Collage slots — each drifts on its own phase and sits at a slight tilt. */
const SLOTS = [
	{ h: 240, left: 90, tilt: -3, top: 120, w: 420 },
	{ h: 200, left: 120, tilt: 2, top: 430, w: 380 },
	{ h: 260, left: 60, tilt: -2, top: 700, w: 440 },
	{ h: 220, left: 1420, tilt: 3, top: 110, w: 430 },
	{ h: 250, left: 1400, tilt: -2, top: 400, w: 460 },
	{ h: 210, left: 1440, tilt: 4, top: 720, w: 400 },
] as const;

/**
 * A testimonial card. Renders as an empty surface until real tweets, payout
 * emails or earnings screenshots are supplied.
 */
const CollageCard = ({ index }: { index: number }) => {
	const frame = useCurrentFrame();
	const slot = SLOTS[index];
	const entry = TESTIMONIALS[index];

	const appear = interpolate(frame - index * 6, [0, 22], [0, 1], {
		easing: EASE,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const float = Math.sin((frame / 110 + index) * Math.PI) * 9;

	return (
		<div
			style={{
				backgroundColor: "#FFFFFF",
				border: "1px solid #E6EAEF",
				borderRadius: 22,
				boxShadow: "0 26px 60px -22px rgba(15, 23, 42, 0.16)",
				height: slot.h,
				left: slot.left,
				opacity: appear * 0.96,
				padding: 28,
				position: "absolute",
				top: slot.top,
				transform: `translateY(${float + (1 - appear) * 20}px) rotate(${slot.tilt}deg)`,
				width: slot.w,
			}}
		>
			{entry ? (
				<>
					<div
						style={{
							color: COLOR.ink,
							fontFamily: SANS_STACK,
							fontSize: 24,
							lineHeight: 1.4,
						}}
					>
						{entry.quote}
					</div>
					<div
						style={{
							color: COLOR.inkMuted,
							fontFamily: SANS_STACK,
							fontSize: 20,
							marginTop: 16,
						}}
					>
						{entry.handle}
					</div>
				</>
			) : null}
		</div>
	);
};

export const SocialProof = () => (
	<AbsoluteFill>
		{SLOTS.map((slot, i) => (
			<CollageCard index={i} key={`${slot.left}-${slot.top}`} />
		))}

		<AbsoluteFill className="items-center justify-center">
			<GhostBuild
				fontSize={104}
				from={20}
				text={"Your merchants and partners\nwill love it"}
				wordStagger={8}
			/>
		</AbsoluteFill>
	</AbsoluteFill>
);
