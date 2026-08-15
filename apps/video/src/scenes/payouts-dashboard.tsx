import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	Sequence,
	staticFile,
	useCurrentFrame,
} from "remotion";
import { GLYPH, Glyph } from "@/components/glyph";
import { MaskRevealUp } from "@/components/remocn/mask-reveal-up";
import { Odometer } from "@/components/remocn/number-wheel";
import {
	DEMO_LIFETIME_TOTAL,
	DEMO_MONTH_TOTAL,
	DEMO_ROW_AMOUNTS,
	MERCHANTS,
	PAYOUTS_HEADLINE,
} from "@/content";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** Screen 5 — 11–17s. Dashboard alone, then it slides right to make room for the line. */
export const PAYOUTS_DASHBOARD_DURATION = 180;

const STACK_WIDTH = 880;
const ROW_HEIGHT = 100;
const ROW_GAP = 20;
const VISIBLE_ROWS = 5;

/** One row lands every STEP frames, sliding the list up over SLIDE frames. */
const STEP = 42;
const SLIDE = 16;

/** The dashboard sits centred, then eases across to the right half. */
const SHIFT_FROM = 96;
const SHIFT_FRAMES = 34;
const SHIFT_X = 400;
const HEADLINE_FROM = 108;

const BORDER = "1px solid #E6EAEF";
const EASE_IN_OUT = Easing.inOut(Easing.cubic);
/** Row opacity by distance from the top of the list. */
const ROW_FADE_STOPS = [0, 1, 2, 3, 4];
const ROW_FADE_VALUES = [1, 1, 0.45, 0.14, 0];

const money = (value: number) =>
	`$${Math.round(value).toLocaleString("en-US")}`;

const Stat = ({
	glyph,
	label,
	prefix,
	value,
	width,
}: {
	glyph: string;
	label: string;
	prefix?: string;
	value: number;
	/** Reserved width, so digits appearing as the value counts up shift nothing. */
	width: number;
}) => (
	<div
		style={{
			alignItems: "center",
			display: "flex",
			flex: 1,
			gap: 26,
			padding: "34px 40px",
		}}
	>
		<Glyph path={glyph} radius={16} size={78} />
		<div>
			<div
				style={{
					color: COLOR.inkMuted,
					fontSize: 30,
					fontWeight: 500,
					marginBottom: 6,
				}}
			>
				{label}
			</div>
			<div style={{ alignItems: "baseline", display: "flex", width }}>
				{prefix ? (
					<span style={{ fontSize: 46, fontWeight: 800 }}>{prefix}</span>
				) : null}
				<Odometer color={COLOR.ink} current={value} fontSize={46} />
			</div>
		</div>
	</div>
);

const PayoutPill = ({ value }: { value: number }) => (
	<div
		style={{
			alignItems: "center",
			backgroundColor: COLOR.ink,
			borderRadius: 24,
			color: "#FFFFFF",
			display: "flex",
			gap: 22,
			padding: "22px 34px",
		}}
	>
		<span
			style={{
				alignItems: "center",
				backgroundColor: "#FFFFFF",
				borderRadius: 14,
				color: COLOR.ink,
				display: "flex",
				height: 66,
				justifyContent: "center",
				width: 66,
			}}
		>
			<svg
				aria-hidden="true"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				style={{ height: 32, width: 32 }}
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d={GLYPH.payout} />
			</svg>
		</span>
		<span style={{ fontSize: 40, fontWeight: 600 }}>This month</span>
		<span style={{ alignItems: "baseline", display: "flex", width: 160 }}>
			<span style={{ fontSize: 40, fontWeight: 800 }}>$</span>
			<Odometer color="#FFFFFF" current={value} fontSize={40} />
		</span>
	</div>
);

const LedgerRow = ({
	amount,
	logo,
	name,
	opacity,
}: {
	amount: number;
	logo: string;
	name: string;
	opacity: number;
}) => (
	<div
		style={{
			alignItems: "center",
			backgroundColor: "#FFFFFF",
			border: BORDER,
			borderRadius: 20,
			boxShadow: "0 10px 26px -16px rgba(15, 23, 42, 0.22)",
			display: "flex",
			gap: 24,
			height: ROW_HEIGHT,
			justifyContent: "space-between",
			opacity,
			padding: "0 30px",
		}}
	>
		<div style={{ alignItems: "center", display: "flex", gap: 22 }}>
			<Img
				src={staticFile(`case-studies/${logo}`)}
				style={{
					backgroundColor: "#FFFFFF",
					border: BORDER,
					borderRadius: 14,
					height: 62,
					objectFit: "contain",
					padding: 6,
					width: 62,
				}}
			/>
			<span style={{ fontSize: 36, fontWeight: 600 }}>{name}</span>
		</div>
		<div
			style={{
				alignItems: "center",
				color: COLOR.inkMuted,
				display: "flex",
				gap: 14,
			}}
		>
			<svg
				aria-hidden="true"
				fill="none"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.8}
				style={{ height: 28, width: 28 }}
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d={GLYPH.commission} />
			</svg>
			<span style={{ color: COLOR.ink, fontSize: 36, fontWeight: 700 }}>
				{money(amount)}
			</span>
		</div>
	</div>
);

/** The commission feed: a merchant lands at the top and pushes the list up. */
const Ledger = () => {
	const frame = useCurrentFrame();

	const step = Math.floor(frame / STEP);
	const slide = interpolate(frame % STEP, [0, SLIDE], [0, 1], {
		easing: EASE_IN_OUT,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: ROW_GAP,
				transform: `translateY(${-slide * (ROW_HEIGHT + ROW_GAP)}px)`,
			}}
		>
			{Array.from({ length: VISIBLE_ROWS }, (_unused, i) => {
				const merchant = MERCHANTS[(step + i) % MERCHANTS.length];
				const amount = DEMO_ROW_AMOUNTS[(step + i) % DEMO_ROW_AMOUNTS.length];
				/* Continuous position, so a row fades as it travels rather than snapping. */
				const opacity = interpolate(
					i - slide,
					ROW_FADE_STOPS,
					ROW_FADE_VALUES,
					{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
				);

				return (
					<LedgerRow
						amount={amount}
						key={`${step + i}`}
						logo={merchant.logo}
						name={merchant.name}
						opacity={opacity}
					/>
				);
			})}
		</div>
	);
};

export const PayoutsDashboard = () => {
	const frame = useCurrentFrame();

	const shift = interpolate(
		frame,
		[SHIFT_FROM, SHIFT_FROM + SHIFT_FRAMES],
		[0, SHIFT_X],
		{
			easing: EASE_IN_OUT,
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const enter = interpolate(frame, [0, 20], [0, 1], {
		easing: EASE_IN_OUT,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const counted = interpolate(frame, [6, 74], [0, 1], {
		easing: EASE_IN_OUT,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{ color: COLOR.ink, fontFamily: SANS_STACK }}>
			<AbsoluteFill
				style={{
					alignItems: "center",
					opacity: enter,
					transform: `translateX(${shift}px) translateY(${(1 - enter) * 30}px)`,
				}}
			>
				{/*
				 * The hairline the pill and the list hang off. Absolutely positioned,
				 * so the blocks over it are relative too — otherwise a static sibling
				 * paints underneath a positioned one and the line cuts through them.
				 */}
				<div
					style={{
						backgroundColor: "#E6EAEF",
						height: 620,
						position: "absolute",
						top: 170,
						width: 1,
						zIndex: 0,
					}}
				/>

				<div
					style={{
						backgroundColor: COLOR.canvas,
						border: BORDER,
						borderRadius: 24,
						display: "flex",
						marginTop: 170,
						overflow: "hidden",
						position: "relative",
						width: STACK_WIDTH,
						zIndex: 1,
					}}
				>
					<Stat
						glyph={GLYPH.payout}
						label="Lifetime paid"
						prefix="$"
						value={counted * DEMO_LIFETIME_TOTAL}
						width={210}
					/>
					<div style={{ backgroundColor: "#E6EAEF", width: 1 }} />
					<Stat
						glyph={GLYPH.store}
						label="Merchants earning"
						value={counted * MERCHANTS.length}
						width={80}
					/>
				</div>

				<div style={{ marginTop: 76, position: "relative", zIndex: 1 }}>
					<PayoutPill value={counted * DEMO_MONTH_TOTAL} />
				</div>

				<div
					style={{
						height: 500,
						marginTop: 70,
						overflow: "hidden",
						position: "relative",
						width: STACK_WIDTH + 40,
						zIndex: 1,
					}}
				>
					<Ledger />
				</div>
			</AbsoluteFill>

			<Sequence
				durationInFrames={PAYOUTS_DASHBOARD_DURATION - HEADLINE_FROM}
				from={HEADLINE_FROM}
			>
				{/*
				 * AbsoluteFill hardcodes width:100%, so narrowing it needs an explicit
				 * width — setting `right` alone leaves the column full-bleed and the
				 * copy lands on top of the dashboard.
				 */}
				<AbsoluteFill style={{ right: "auto", width: "46%" }}>
					<MaskRevealUp
						color={COLOR.ink}
						fontSize={84}
						fontWeight={700}
						text={PAYOUTS_HEADLINE}
					/>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};
