import {
	AbsoluteFill,
	interpolate,
	interpolateColors,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { BrowserFrame, DashboardSurface } from "@/components/browser-frame";
import { Typewriter } from "@/components/remocn/typewriter";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** 24–27s. */
export const CUSTOMIZE_DURATION = 90;

const PANEL_FROM = 26;
const SHIFT_FROM = 46;

/** Swatches the partner can brand the dashboard header with. */
const SWATCHES = ["#0F172A", "#F59E0B", "#2563EB", "#059669", "#DB2777"];
const CHOSEN = 1;

export const Customize = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const push = spring({
		config: { damping: 200 },
		durationInFrames: 60,
		fps,
		frame,
	});
	const panel = spring({
		config: { damping: 200 },
		durationInFrames: 24,
		fps,
		frame: frame - PANEL_FROM,
	});
	const shift = spring({
		config: { damping: 200 },
		durationInFrames: 26,
		fps,
		frame: frame - SHIFT_FROM,
	});

	const headerColor = interpolateColors(
		shift,
		[0, 1],
		["#F7F8FA", SWATCHES[CHOSEN]]
	);

	return (
		<AbsoluteFill>
			<AbsoluteFill className="items-center" style={{ paddingTop: 90 }}>
				<Typewriter
					charsPerSecond={26}
					color={COLOR.ink}
					cursor={false}
					fontSize={84}
					fontWeight={700}
					text="Easily customize"
				/>
			</AbsoluteFill>

			<AbsoluteFill
				className="items-center justify-center"
				style={{
					transform: `scale(${interpolate(push, [0, 1], [1, 1.35])}) translateY(${interpolate(push, [0, 1], [60, 150])}px)`,
				}}
			>
				<div style={{ position: "relative" }}>
					<BrowserFrame height={620} url="partners.edgecoms.com" width={1180}>
						<div
							style={{
								backgroundColor: headerColor,
								borderBottom: "1px solid #E6EAEF",
								height: 96,
							}}
						/>
						<DashboardSurface />
					</BrowserFrame>

					<div
						style={{
							backgroundColor: "#FFFFFF",
							border: "1px solid #E6EAEF",
							borderRadius: 20,
							boxShadow: "0 30px 70px -20px rgba(15, 23, 42, 0.22)",
							opacity: panel,
							padding: 24,
							position: "absolute",
							right: -60,
							top: 150,
							transform: `translateY(${(1 - panel) * 18}px)`,
						}}
					>
						<div
							style={{
								color: COLOR.inkMuted,
								fontFamily: SANS_STACK,
								fontSize: 20,
								fontWeight: 500,
								marginBottom: 16,
							}}
						>
							Brand color
						</div>
						<div style={{ display: "flex", gap: 14 }}>
							{SWATCHES.map((swatch, i) => (
								<div
									key={swatch}
									style={{
										backgroundColor: swatch,
										borderRadius: 12,
										boxShadow:
											i === CHOSEN
												? `0 0 0 3px #FFFFFF, 0 0 0 5px ${swatch}`
												: undefined,
										height: 46,
										transform: `scale(${i === CHOSEN ? 1 + shift * 0.08 : 1})`,
										width: 46,
									}}
								/>
							))}
						</div>
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
