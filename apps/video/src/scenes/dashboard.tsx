import {
	AbsoluteFill,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { BrowserFrame, DashboardSurface } from "@/components/browser-frame";
import { StrikethroughReplace } from "@/components/remocn/strikethrough-replace";
import { Typewriter } from "@/components/remocn/typewriter";
import { COLOR } from "@/theme";

/** 19–24s. */
export const DASHBOARD_DURATION = 150;

const SWAP_FROM = 46;
const RISE_FROM = 60;

export const Dashboard = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const rise = spring({
		config: { damping: 200 },
		durationInFrames: 46,
		fps,
		frame: frame - RISE_FROM,
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill className="items-center" style={{ paddingTop: 120 }}>
				{frame < SWAP_FROM ? (
					<Typewriter
						charsPerSecond={26}
						color={COLOR.ink}
						cursor={false}
						fontSize={84}
						fontWeight={700}
						text="Offer a beautiful Partner Dashboard"
					/>
				) : (
					<Sequence from={SWAP_FROM}>
						<AbsoluteFill className="items-center">
							<StrikethroughReplace
								color={COLOR.ink}
								fontSize={84}
								fontWeight={700}
								from="Offer a beautiful Partner Dashboard"
								lineColor={COLOR.accent}
								to="Offer a world-class Partner Dashboard"
							/>
						</AbsoluteFill>
					</Sequence>
				)}
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					alignItems: "center",
					justifyContent: "flex-end",
					perspective: 1800,
				}}
			>
				<div
					style={{
						boxShadow: `0 ${60 * rise}px ${120 * rise}px -${30 * rise}px rgba(15, 23, 42, 0.28)`,
						opacity: rise,
						transform: `translateY(${interpolate(rise, [0, 1], [420, 40])}px) rotateX(${interpolate(rise, [0, 1], [34, 6])}deg) scale(${interpolate(rise, [0, 1], [0.86, 1])})`,
						transformOrigin: "50% 100%",
					}}
				>
					<BrowserFrame height={640} url="partners.edgecoms.com" width={1240}>
						<DashboardSurface />
					</BrowserFrame>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
