import {
	AbsoluteFill,
	Easing,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { GhostBuild } from "@/components/ghost-build";
import { NumberWheel } from "@/components/remocn/number-wheel";
import { LEADERBOARD, LEADERBOARD_SLOTS, STAT_SLOTS, STATS } from "@/content";
import { MONO_STACK, SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** 12–18s. */
export const PAYOUTS_DURATION = 180;

const STATS_FROM = 24;
const PILL_FROM = 54;
const ROWS_FROM = 70;
const ROW_STAGGER = 12;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** A value slot with no signed-off figure yet — never a made-up number. */
const PendingValue = ({ width }: { width: number }) => (
	<div
		style={{
			backgroundColor: "#EEF1F5",
			borderRadius: 8,
			height: 34,
			width,
		}}
	/>
);

const StatCard = ({ index, label }: { index: number; label: string }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const settle = spring({
		config: { damping: 200 },
		durationInFrames: 26,
		fps,
		frame: frame - (STATS_FROM + index * 8),
	});
	const figure = STATS[index];

	return (
		<div
			style={{
				backgroundColor: "#FFFFFF",
				border: "1px solid #E6EAEF",
				borderRadius: 20,
				flex: 1,
				opacity: settle,
				padding: "26px 30px",
				transform: `translateY(${(1 - settle) * 24}px)`,
			}}
		>
			<div
				style={{
					color: COLOR.inkMuted,
					fontFamily: SANS_STACK,
					fontSize: 24,
					fontWeight: 500,
				}}
			>
				{label}
			</div>
			<div style={{ marginTop: 10 }}>
				{figure ? (
					<NumberWheel
						color={COLOR.ink}
						fontSize={52}
						from={0}
						to={figure.value}
					/>
				) : (
					<PendingValue width={190} />
				)}
			</div>
		</div>
	);
};

const LeaderboardRow = ({ index }: { index: number }) => {
	const frame = useCurrentFrame();
	const local = frame - (ROWS_FROM + index * ROW_STAGGER);
	const entry = LEADERBOARD[index];

	const appear = interpolate(local, [0, 16], [0, 1], {
		easing: EASE,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				alignItems: "center",
				backgroundColor: "#FFFFFF",
				border: "1px solid #E6EAEF",
				borderRadius: 18,
				display: "flex",
				gap: 20,
				opacity: appear,
				padding: "20px 26px",
				transform: `translateY(${(1 - appear) * 16}px)`,
			}}
		>
			<div
				style={{
					backgroundColor: "#EEF1F5",
					borderRadius: "50%",
					height: 52,
					width: 52,
				}}
			/>
			{entry ? (
				<>
					<span
						style={{
							color: COLOR.ink,
							flex: 1,
							fontFamily: SANS_STACK,
							fontSize: 30,
							fontWeight: 600,
						}}
					>
						{entry.name}
					</span>
					<span
						style={{
							color: COLOR.ink,
							fontFamily: MONO_STACK,
							fontSize: 30,
						}}
					>
						{entry.amount}
					</span>
				</>
			) : (
				<>
					<div style={{ flex: 1 }}>
						<PendingValue width={220} />
					</div>
					<PendingValue width={110} />
				</>
			)}
		</div>
	);
};

const PayoutPill = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const settle = spring({
		config: { damping: 200 },
		durationInFrames: 22,
		fps,
		frame: frame - PILL_FROM,
	});

	return (
		<div
			style={{
				alignItems: "center",
				alignSelf: "center",
				backgroundColor: COLOR.ink,
				borderRadius: 999,
				boxShadow: "0 22px 50px -16px rgba(15, 23, 42, 0.35)",
				color: "#FFFFFF",
				display: "inline-flex",
				gap: 18,
				opacity: settle,
				padding: "20px 34px",
				transform: `scale(${interpolate(settle, [0, 1], [0.92, 1])})`,
			}}
		>
			<span style={{ fontFamily: SANS_STACK, fontSize: 30, fontWeight: 600 }}>
				Payout
			</span>
			{STATS[1] ? (
				<span style={{ fontFamily: MONO_STACK, fontSize: 30 }}>
					{STATS[1].value}
				</span>
			) : (
				<div
					style={{
						backgroundColor: "rgba(255,255,255,0.18)",
						borderRadius: 8,
						height: 30,
						width: 110,
					}}
				/>
			)}
		</div>
	);
};

export const Payouts = () => (
	<AbsoluteFill>
		<div style={{ left: 120, position: "absolute", top: 320, width: 780 }}>
			<GhostBuild
				fontSize={92}
				from={6}
				style={{ textAlign: "left" }}
				text={
					"Effortless payouts\nitemised per charge\nand lifetime attribution"
				}
				wordStagger={6}
			/>
		</div>

		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 22,
				left: 1010,
				position: "absolute",
				top: 150,
				width: 790,
			}}
		>
			<div style={{ display: "flex", gap: 22 }}>
				{STAT_SLOTS.map((label, i) => (
					<StatCard index={i} key={label} label={label} />
				))}
			</div>

			<PayoutPill />

			{Array.from({ length: LEADERBOARD_SLOTS }, (_, i) => (
				<LeaderboardRow index={i} key={`row-${i + 1}`} />
			))}
		</div>
	</AbsoluteFill>
);
