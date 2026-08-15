import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	interpolateColors,
	staticFile,
	useCurrentFrame,
} from "remotion";
import { Typewriter } from "@/components/remocn/typewriter";
import { TiltCard } from "@/components/tilt-card";
import { EDGE_APPS, RULE_CARDS } from "@/content";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** 8–12s. */
export const COMMISSION_RULES_DURATION = 120;

const CARDS_FROM = 18;
const CARD_STAGGER = 7;
const LIST_FROM = 30;
const LIST_STAGGER = 9;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** Resting places, offsets and depths for the six rule cards. */
const CARD_LAYOUT = [
	{ depth: 1, left: 980, offset: { x: 620, y: -220 }, tilt: -3, top: 150 },
	{ depth: 0.86, left: 1180, offset: { x: 680, y: 120 }, tilt: 4, top: 360 },
	{ depth: 0.94, left: 1020, offset: { x: 520, y: 420 }, tilt: -2, top: 560 },
	{ depth: 0.8, left: 1240, offset: { x: 700, y: 480 }, tilt: 5, top: 760 },
	{ depth: 0.9, left: 900, offset: { x: -520, y: 460 }, tilt: 3, top: 900 },
	{ depth: 0.76, left: 1420, offset: { x: 640, y: -320 }, tilt: -5, top: 60 },
] as const;

const RuleCard = ({ text }: { text: string }) => (
	<div
		style={{
			backgroundColor: "#FFFFFF",
			border: "1px solid #E6EAEF",
			borderRadius: 22,
			color: COLOR.ink,
			fontFamily: SANS_STACK,
			fontSize: 30,
			fontWeight: 500,
			letterSpacing: "-0.02em",
			padding: "30px 36px",
			width: 470,
		}}
	>
		{text}
	</div>
);

/** Per-app rates: each app name lights in turn to show the rate can differ. */
const AppList = () => {
	const frame = useCurrentFrame();

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
			<span
				style={{
					color: COLOR.inkMuted,
					fontFamily: SANS_STACK,
					fontSize: 26,
					fontWeight: 500,
					marginBottom: 10,
				}}
			>
				A rate per app, if you want one
			</span>
			{EDGE_APPS.map((app, i) => {
				const local = frame - (LIST_FROM + i * LIST_STAGGER);
				const lit = interpolate(local, [0, 8], [0, 1], {
					easing: EASE,
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				const iconFile = `${app.toLowerCase().replace(" ", "-")}.webp`;

				return (
					<div
						key={app}
						style={{
							alignItems: "center",
							backgroundColor: interpolateColors(
								lit,
								[0, 1],
								["rgba(245, 158, 11, 0)", "rgba(245, 158, 11, 0.1)"]
							),
							borderRadius: 14,
							display: "flex",
							gap: 16,
							padding: "12px 18px",
							transform: `translateX(${(1 - lit) * -8}px)`,
						}}
					>
						<Img
							alt=""
							src={staticFile(`app-icons/${iconFile}`)}
							style={{ borderRadius: 10, height: 44, width: 44 }}
						/>
						<span
							style={{
								color: interpolateColors(
									lit,
									[0, 1],
									[COLOR.inkGhost, COLOR.ink]
								),
								fontFamily: SANS_STACK,
								fontSize: 32,
								fontWeight: 600,
								letterSpacing: "-0.02em",
							}}
						>
							{app}
						</span>
					</div>
				);
			})}
		</div>
	);
};

export const CommissionRules = () => (
	<AbsoluteFill>
		<AbsoluteFill>
			{CARD_LAYOUT.map((slot, i) => (
				<div
					key={RULE_CARDS[i]}
					style={{ left: slot.left, position: "absolute", top: slot.top }}
				>
					<TiltCard
						depth={slot.depth}
						from={CARDS_FROM + i * CARD_STAGGER}
						offset={slot.offset}
						tilt={slot.tilt}
					>
						<RuleCard text={RULE_CARDS[i]} />
					</TiltCard>
				</div>
			))}
		</AbsoluteFill>

		<div style={{ left: 120, position: "absolute", top: 150 }}>
			<Typewriter
				charsPerSecond={26}
				color={COLOR.ink}
				cursor={false}
				fontSize={78}
				fontWeight={700}
				text="Your rate, agreed up front"
			/>
		</div>

		<div style={{ left: 120, position: "absolute", top: 330 }}>
			<AppList />
		</div>
	</AbsoluteFill>
);
