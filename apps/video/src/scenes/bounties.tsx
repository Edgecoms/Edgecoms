import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { MaskRevealUp } from "@/components/remocn/mask-reveal-up";
import { Odometer } from "@/components/remocn/number-wheel";
import { BOUNTY } from "@/content";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** Screen 6 — 17–22s. */
export const BOUNTIES_DURATION = 150;

const CARD_WIDTH = 860;
const PANEL_HEIGHT = 340;
const BORDER = "1px solid #E6EAEF";
const GREEN = "#16A34A";
const GREEN_TINT = "#F0FDF4";
const GREEN_LINE = "#BBF7D0";

const SUBLINE_FROM = 14;
const CARD_FROM = 26;
/** The bar fills, then the badge lands the moment it tops out. */
const FILL_FROM = 46;
const FILL_TO = 106;
const BADGE_FROM = 104;

const EASE_IN_OUT = Easing.inOut(Easing.cubic);

const Heart = ({ scale }: { scale: number }) => (
	<svg
		aria-hidden="true"
		style={{
			filter: "drop-shadow(0 12px 18px rgba(220, 38, 38, 0.32))",
			height: 130,
			transform: `scale(${scale})`,
			width: 130,
		}}
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.2 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9Z"
			fill="#EF4444"
		/>
	</svg>
);

const Card = ({ children }: { children: React.ReactNode }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const rise = spring({
		config: { damping: 200 },
		durationInFrames: 26,
		fps,
		frame: frame - CARD_FROM,
	});

	return (
		<div
			style={{
				opacity: rise,
				padding: "0 46px",
				transform: `translateY(${(1 - rise) * 46}px)`,
				width: CARD_WIDTH,
			}}
		>
			{children}
		</div>
	);
};

/** The bounty: a goal bar filling to its target, then the reward badge landing. */
const BountyCard = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const fill = interpolate(frame, [FILL_FROM, FILL_TO], [0, 1], {
		easing: EASE_IN_OUT,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const badge = spring({
		config: { damping: 14, mass: 0.7, stiffness: 180 },
		fps,
		frame: frame - BADGE_FROM,
	});

	/* One beat of the heart as the reward lands. */
	const pulse =
		1 +
		0.16 *
			interpolate(
				frame,
				[BADGE_FROM, BADGE_FROM + 8, BADGE_FROM + 22],
				[0, 1, 0],
				{
					easing: EASE_IN_OUT,
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				}
			);

	return (
		<>
			<div
				style={{
					alignItems: "center",
					backgroundColor: GREEN_TINT,
					border: `1px solid ${GREEN_LINE}`,
					borderRadius: 26,
					display: "flex",
					height: PANEL_HEIGHT,
					justifyContent: "center",
					position: "relative",
				}}
			>
				<div
					style={{
						alignItems: "center",
						backgroundColor: "#DCFCE7",
						border: `1px solid ${GREEN_LINE}`,
						borderRadius: 999,
						color: "#166534",
						display: "flex",
						fontSize: 24,
						fontWeight: 700,
						gap: 10,
						opacity: badge,
						padding: "10px 22px",
						position: "absolute",
						top: 24,
						transform: `scale(${badge})`,
					}}
				>
					<span
						style={{
							alignItems: "center",
							backgroundColor: GREEN,
							borderRadius: "50%",
							color: "#FFFFFF",
							display: "flex",
							fontSize: 16,
							height: 26,
							justifyContent: "center",
							width: 26,
						}}
					>
						✓
					</span>
					{BOUNTY.badge}
				</div>

				<Heart scale={pulse} />
			</div>

			<h3
				style={{
					fontSize: 34,
					fontWeight: 700,
					letterSpacing: "-0.02em",
					margin: "30px 0 0",
				}}
			>
				{BOUNTY.title}
			</h3>

			<div
				style={{
					backgroundColor: "#EEF1F5",
					borderRadius: 999,
					height: 14,
					marginTop: 24,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						backgroundColor: GREEN,
						borderRadius: 999,
						height: "100%",
						width: `${fill * 100}%`,
					}}
				/>
			</div>

			<div
				style={{
					alignItems: "baseline",
					display: "flex",
					fontSize: 28,
					gap: 10,
					marginTop: 18,
				}}
			>
				<Odometer
					color={COLOR.ink}
					current={fill * BOUNTY.goal}
					fontSize={28}
				/>
				<span style={{ color: COLOR.inkMuted }}>
					{`of ${BOUNTY.goal.toLocaleString("en-US")} ${BOUNTY.unit}`}
				</span>
			</div>
		</>
	);
};

export const Bounties = () => {
	const frame = useCurrentFrame();

	const subline = interpolate(
		frame,
		[SUBLINE_FROM, SUBLINE_FROM + 16],
		[0, 1],
		{
			easing: EASE_IN_OUT,
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	return (
		<AbsoluteFill style={{ color: COLOR.ink, fontFamily: SANS_STACK }}>
			<AbsoluteFill
				style={{ alignItems: "center", bottom: "auto", height: 210 }}
			>
				<MaskRevealUp
					color={COLOR.ink}
					fontSize={80}
					fontWeight={700}
					text={BOUNTY.headline}
				/>
			</AbsoluteFill>

			<div
				style={{
					color: COLOR.inkMuted,
					fontSize: 32,
					fontWeight: 500,
					left: 0,
					lineHeight: 1.45,
					opacity: subline,
					position: "absolute",
					textAlign: "center",
					top: 236,
					transform: `translateY(${(1 - subline) * 18}px)`,
					whiteSpace: "pre-line",
					width: "100%",
				}}
			>
				{BOUNTY.subline}
			</div>

			{/* The site's border grid, kept so the screen reads as the same surface. */}
			<div
				style={{
					borderTop: BORDER,
					left: 210,
					opacity: subline,
					position: "absolute",
					right: 210,
					top: 424,
				}}
			/>

			<div
				style={{
					display: "flex",
					justifyContent: "center",
					left: 0,
					position: "absolute",
					top: 480,
					width: "100%",
				}}
			>
				<Card>
					<BountyCard />
				</Card>
			</div>
		</AbsoluteFill>
	);
};
