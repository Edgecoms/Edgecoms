import {
	AbsoluteFill,
	Easing,
	interpolate,
	Sequence,
	useCurrentFrame,
} from "remotion";
import { EdgePartnersLockup } from "@/components/edge-partners-lockup";
import { MaskRevealUp } from "@/components/remocn/mask-reveal-up";
import { CLOSE } from "@/content";
import { MONO_STACK, SANS_STACK } from "@/fonts";
import { CANVAS, COLOR } from "@/theme";

/** Screen 8 — 27–33s. */
export const CLOSE_DURATION = 150;

const INK_PANEL = "#0A0A0A";
const PANEL_FRAMES = 20;
const LOCKUP_FROM = 8;
const HEADLINE_FROM = 18;
const SUBLINE_FROM = 44;
const URL_FROM = 62;

/** Height of the tongue, scaled from the site's 1440×72 divider. */
const TONGUE_HEIGHT = Math.round((72 / 1440) * CANVAS.width);
const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1);

const useEnter = (from: number, frames: number) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [from, from + frames], [0, 1], {
		easing: EASE_OUT,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
};

export const Close = () => {
	const frame = useCurrentFrame();

	const rise = interpolate(frame, [0, PANEL_FRAMES], [CANVAS.height, 0], {
		easing: EASE_OUT,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const lockup = useEnter(LOCKUP_FROM, 20);
	const subline = useEnter(SUBLINE_FROM, 18);
	const url = useEnter(URL_FROM, 16);

	return (
		<AbsoluteFill>
			{/* The dark panel climbs over the light grid the whole video has sat on. */}
			<AbsoluteFill
				style={{
					backgroundColor: INK_PANEL,
					transform: `translateY(${rise}px)`,
				}}
			>
				{/* A dark echo of the grid, so the panel is not a flat black card. */}
				<AbsoluteFill
					style={{
						backgroundImage:
							"linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
						backgroundSize: "180px 180px",
						maskImage:
							"radial-gradient(ellipse 60% 55% at 50% 50%, black 20%, transparent 92%)",
					}}
				/>
				<AbsoluteFill
					style={{
						backgroundImage:
							"radial-gradient(ellipse 55% 45% at 50% 118%, rgba(147, 51, 234, 0.26), transparent)",
					}}
				/>

				{/*
				 * The site's closing divider: the light page surface continuing down
				 * into the dark panel. Drawn rather than rounded, because the curve
				 * eases in and out of the flat edge on both sides.
				 */}
				<svg
					aria-hidden="true"
					preserveAspectRatio="none"
					style={{
						height: TONGUE_HEIGHT,
						left: 0,
						position: "absolute",
						top: 0,
						width: "100%",
					}}
					viewBox="0 0 1440 72"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M0 0 H520 C570 0 570 72 620 72 H820 C870 72 870 0 920 0 H1440 V0 Z"
						fill={COLOR.canvas}
					/>
				</svg>

				<AbsoluteFill
					style={{
						alignItems: "center",
						fontFamily: SANS_STACK,
						justifyContent: "center",
					}}
				>
					<div
						style={{
							opacity: lockup,
							transform: `translateY(${(1 - lockup) * 18}px)`,
						}}
					>
						<EdgePartnersLockup color="#FFFFFF" fontSize={54} />
					</div>

					<div
						style={{
							height: 300,
							marginTop: 30,
							position: "relative",
							width: "100%",
						}}
					>
						<Sequence durationInFrames={CLOSE_DURATION} from={HEADLINE_FROM}>
							<MaskRevealUp
								color="#FFFFFF"
								fontSize={88}
								fontWeight={700}
								text={CLOSE.headline}
							/>
						</Sequence>
					</div>

					<div
						style={{
							color: "#94A3B8",
							fontSize: 32,
							lineHeight: 1.45,
							opacity: subline,
							textAlign: "center",
							transform: `translateY(${(1 - subline) * 16}px)`,
							whiteSpace: "pre-line",
						}}
					>
						{CLOSE.subline}
					</div>

					<div
						style={{
							color: "#64748B",
							fontFamily: MONO_STACK,
							fontSize: 30,
							letterSpacing: "0.02em",
							marginTop: 78,
							opacity: url,
						}}
					>
						{CLOSE.url}
					</div>
				</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
