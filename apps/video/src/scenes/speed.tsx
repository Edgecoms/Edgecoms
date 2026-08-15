import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { BrowserFrame, DashboardSurface } from "@/components/browser-frame";
import { StrikethroughReplace } from "@/components/remocn/strikethrough-replace";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** 32–37s. */
export const SPEED_DURATION = 150;

const FIRST_SWAP = 20;
const SECOND_SWAP = 80;
const HEADLINE_SIZE = 78;

const Lead = () => (
	<span
		style={{
			color: COLOR.ink,
			fontFamily: SANS_STACK,
			fontSize: HEADLINE_SIZE,
			fontWeight: 700,
			letterSpacing: "-0.035em",
		}}
	>
		Get your partner program up and running in{" "}
	</span>
);

export const Speed = () => {
	const frame = useCurrentFrame();
	const progress = interpolate(frame, [0, SPEED_DURATION - 20], [0, 1], {
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill
				className="items-center"
				style={{ paddingTop: 250, zIndex: 1 }}
			>
				<div style={{ alignItems: "baseline", display: "flex" }}>
					<Lead />
					<Sequence
						durationInFrames={SECOND_SWAP}
						from={FIRST_SWAP}
						layout="none"
					>
						<StrikethroughReplace
							color={COLOR.ink}
							fontSize={HEADLINE_SIZE}
							fontWeight={700}
							from="weeks"
							lineColor={COLOR.accent}
							to="days"
						/>
					</Sequence>
					<Sequence from={FIRST_SWAP + SECOND_SWAP} layout="none">
						<StrikethroughReplace
							color={COLOR.ink}
							fontSize={HEADLINE_SIZE}
							fontWeight={700}
							from="days"
							lineColor={COLOR.accent}
							to="minutes"
						/>
					</Sequence>
				</div>
			</AbsoluteFill>

			<AbsoluteFill className="items-center justify-center">
				<BrowserFrame
					height={820}
					progress={progress}
					url="partners.edgecoms.com"
					width={1560}
				>
					<DashboardSurface />
				</BrowserFrame>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
