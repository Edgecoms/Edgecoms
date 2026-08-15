import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { BrowserFrame, DashboardSurface } from "@/components/browser-frame";
import { Typewriter } from "@/components/remocn/typewriter";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** 27–32s. */
export const EMBED_DURATION = 150;

const SNAP_FROM = 34;
const NAV_FROM = 74;

const NAV_ITEMS = ["Overview", "Clients", "Reports", "Partners", "Settings"];
const HIGHLIGHTED = "Partners";

export const Embed = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const snap = spring({
		config: { damping: 200 },
		durationInFrames: 36,
		fps,
		frame: frame - SNAP_FROM,
	});
	const nav = spring({
		config: { damping: 200 },
		durationInFrames: 20,
		fps,
		frame: frame - NAV_FROM,
	});

	return (
		<AbsoluteFill>
			<AbsoluteFill className="items-center" style={{ paddingTop: 80 }}>
				<Typewriter
					charsPerSecond={26}
					color={COLOR.ink}
					cursor={false}
					fontSize={84}
					fontWeight={700}
					text="And embed into your app"
				/>
			</AbsoluteFill>

			<AbsoluteFill
				className="items-center justify-center"
				style={{ paddingTop: 120, perspective: 1800 }}
			>
				<div
					style={{
						transform: `translateX(${interpolate(snap, [0, 1], [-260, 0])}px) rotateY(${interpolate(snap, [0, 1], [22, 0])}deg) rotate(${interpolate(snap, [0, 1], [-4, 0])}deg)`,
					}}
				>
					<BrowserFrame height={660} url="agency.example.com" width={1400}>
						<div style={{ display: "flex", height: "100%" }}>
							<div
								style={{
									backgroundColor: "#FBFCFD",
									borderRight: "1px solid #E6EAEF",
									display: "flex",
									flexDirection: "column",
									gap: 8,
									padding: 22,
									width: 280,
								}}
							>
								{NAV_ITEMS.map((item) => {
									const isTarget = item === HIGHLIGHTED;
									return (
										<div
											key={item}
											style={{
												backgroundColor: isTarget
													? `rgba(245, 158, 11, ${nav * 0.14})`
													: "transparent",
												borderRadius: 12,
												color: isTarget ? COLOR.ink : COLOR.inkMuted,
												fontFamily: SANS_STACK,
												fontSize: 24,
												fontWeight: isTarget ? 600 : 500,
												opacity: isTarget ? nav : 1,
												padding: "12px 16px",
												transform: isTarget
													? `translateX(${(1 - nav) * -10}px)`
													: undefined,
											}}
										>
											{item}
										</div>
									);
								})}
							</div>
							<div style={{ flex: 1 }}>
								<DashboardSurface />
							</div>
						</div>
					</BrowserFrame>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
