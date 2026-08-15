import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { GLYPH, Glyph } from "@/components/glyph";
import { ValueSwap } from "@/components/remocn/value-swap";
import { TiltCard } from "@/components/tilt-card";
import { EARN_PREFIX, EARN_TRIGGERS, PAYOUT_CARDS } from "@/content";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** Screen 4 — 6–11s. */
export const PAID_FOR_EVERY_DURATION = 150;

/** A slow push in once the cards have landed, so the screen never sits still. */
const ZOOM_FROM = 22;
const ZOOM_TO = 1.09;

const CARD_WIDTH = 560;
const WORD_SIZE = 84;
const CARDS_FROM = 4;
const CARD_STAGGER = 5;
/** Frames the noun rolls over. Sized so the last word holds for half a second. */
const SWAP_AT = [50, 98];
const SWAP_FRAMES = 12;
const SWAP_TRAVEL = 52;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/**
 * Resting places for the six cards. The middle band stays clear of the line,
 * which runs roughly x 470–1450 at this font size.
 */
const CARD_LAYOUT = [
	{ depth: 1, left: 680, offset: { x: 0, y: -320 }, tilt: 0, top: 10 },
	{ depth: 0.95, left: -200, offset: { x: -520, y: 0 }, tilt: -4, top: 290 },
	{ depth: 0.95, left: 1470, offset: { x: 560, y: 0 }, tilt: -3, top: 250 },
	{ depth: 0.9, left: -220, offset: { x: -520, y: 180 }, tilt: 3, top: 720 },
	{ depth: 0.95, left: 700, offset: { x: 0, y: 320 }, tilt: 0, top: 900 },
	{ depth: 0.9, left: 1490, offset: { x: 560, y: 200 }, tilt: 2, top: 730 },
] as const;

/** Cycled across the cards. */
const GLYPHS = [GLYPH.partner, GLYPH.commission, GLYPH.payout] as const;

const PayoutCard = ({
	after,
	before,
	glyph,
	label,
	mark,
}: {
	after: string;
	before: string;
	glyph: string;
	label: string;
	mark: string;
}) => (
	<div
		style={{
			backgroundColor: "#FFFFFF",
			border: "1px solid #E6EAEF",
			borderRadius: 24,
			fontFamily: SANS_STACK,
			padding: "26px 32px 30px",
			width: CARD_WIDTH,
		}}
	>
		<div
			style={{
				alignItems: "center",
				display: "flex",
				justifyContent: "space-between",
			}}
		>
			<Glyph path={glyph} size={60} />
			<span
				style={{
					backgroundColor: "#F1F5F9",
					borderRadius: 999,
					color: COLOR.inkMuted,
					fontSize: 22,
					fontWeight: 600,
					padding: "9px 18px",
				}}
			>
				{label}
			</span>
		</div>
		<p
			style={{
				color: COLOR.ink,
				fontSize: 29,
				fontWeight: 500,
				letterSpacing: "-0.02em",
				lineHeight: 1.35,
				margin: "26px 0 0",
			}}
		>
			{before}
			<span style={{ color: COLOR.highlight, fontWeight: 700 }}>{mark}</span>
			{after}
		</p>
	</div>
);

export const PaidForEvery = () => {
	const frame = useCurrentFrame();

	const enter = interpolate(frame, [0, 18], [0, 1], {
		easing: EASE,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const zoom = interpolate(
		frame,
		[ZOOM_FROM, PAID_FOR_EVERY_DURATION],
		[1, ZOOM_TO],
		{
			easing: Easing.out(Easing.quad),
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	return (
		<AbsoluteFill style={{ transform: `scale(${zoom})` }}>
			<AbsoluteFill>
				{CARD_LAYOUT.map((slot, i) => (
					<div
						key={PAYOUT_CARDS[i].label}
						style={{ left: slot.left, position: "absolute", top: slot.top }}
					>
						<TiltCard
							depth={slot.depth}
							from={CARDS_FROM + i * CARD_STAGGER}
							offset={slot.offset}
							tilt={slot.tilt}
						>
							<PayoutCard
								{...PAYOUT_CARDS[i]}
								glyph={GLYPHS[i % GLYPHS.length]}
							/>
						</TiltCard>
					</div>
				))}
			</AbsoluteFill>

			<AbsoluteFill className="items-center justify-center">
				<div
					style={{
						color: COLOR.ink,
						filter: `blur(${(1 - enter) * 8}px)`,
						fontFamily: SANS_STACK,
						fontSize: WORD_SIZE,
						fontWeight: 700,
						letterSpacing: "-0.04em",
						opacity: enter,
						transform: `translateY(${(1 - enter) * 26}px)`,
						whiteSpace: "nowrap",
					}}
				>
					{`${EARN_PREFIX} `}
					<ValueSwap
						at={SWAP_AT}
						direction="up"
						distance={SWAP_TRAVEL}
						duration={SWAP_FRAMES}
						values={[...EARN_TRIGGERS]}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
