import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { EdgePartnersLockup } from "@/components/edge-partners-lockup";
import { GhostBuild } from "@/components/ghost-build";
import { RolodexFlip } from "@/components/remocn/rolodex-flip";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** 2–8s. */
export const HOOK_DURATION = 180;

const DOCK_Y = -238;
const DOCK_SCALE = 0.46;
const LOCKUP_FONT_SIZE = 96;
const HEADLINE_FROM = 26;
const WORD_STAGGER = 7;
const CYCLE_FROM = 82;

const TILE = 132;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** Positions ring the type; the centre column is left clear for the headline. */
const TILES = [
	{ blur: 0, depth: 1, src: "p1.jpg", x: 536, y: 62 },
	{ blur: 0, depth: 0.7, src: "p2.jpg", x: 1795, y: 62 },
	{ blur: 8, depth: 0.4, src: "p3.jpg", x: 60, y: 190 },
	{ blur: 0, depth: 0.9, src: "p4.jpg", x: 1320, y: 180 },
	{ blur: 7, depth: 0.5, src: "p5.jpg", x: 300, y: 300 },
	{ blur: 0, depth: 1.1, src: "p6.jpg", x: 180, y: 425 },
	{ blur: 6, depth: 0.5, src: "p7.jpg", x: 1620, y: 425 },
	{ blur: 0, depth: 0.8, src: "p8.jpg", x: 300, y: 545 },
	{ blur: 7, depth: 0.4, src: "p9.jpg", x: 1740, y: 545 },
	{ blur: 0, depth: 1, src: "p10.jpg", x: 1620, y: 665 },
	{ blur: 0, depth: 0.9, src: "p11.jpg", x: 300, y: 880 },
	{ blur: 0, depth: 1.2, src: "p4.jpg", x: 1380, y: 880 },
	{ blur: 5, depth: 0.6, src: "p6.jpg", x: 1740, y: 880 },
	{ blur: 0, depth: 1.1, src: "p9.jpg", x: 1020, y: 995 },
] as const;

/** Slow z-push: the whole field creeps toward camera, near tiles faster. */
const TileField = () => {
	const frame = useCurrentFrame();
	const push = frame / HOOK_DURATION;

	return (
		<AbsoluteFill>
			{TILES.map((tile, i) => {
				const local = frame - (6 + i * 2.5);
				const opacity = interpolate(local, [0, 18], [0, 1], {
					easing: EASE,
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				const blur = interpolate(local, [0, 18], [tile.blur + 12, tile.blur], {
					easing: EASE,
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				const scale = 1 + push * 0.09 * tile.depth;
				const drift = Math.sin((frame / 90 + i) * Math.PI) * 5 * tile.depth;

				return (
					<Img
						alt=""
						key={`${tile.src}-${tile.x}-${tile.y}`}
						src={staticFile(`avatars/${tile.src}`)}
						style={{
							borderRadius: 18,
							filter: `blur(${blur}px)`,
							height: TILE,
							left: tile.x - TILE / 2,
							objectFit: "cover",
							opacity,
							position: "absolute",
							top: tile.y - TILE / 2,
							transform: `translateY(${drift}px) scale(${scale})`,
							width: TILE,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

export const Hook = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const dock = spring({
		config: { damping: 200 },
		durationInFrames: 24,
		fps,
		frame,
	});

	return (
		<AbsoluteFill>
			<TileField />

			<AbsoluteFill className="items-center justify-center">
				<div
					style={{
						transform: `translateY(${dock * DOCK_Y}px) scale(${interpolate(
							dock,
							[0, 1],
							[1, DOCK_SCALE]
						)})`,
					}}
				>
					<EdgePartnersLockup fontSize={LOCKUP_FONT_SIZE} />
				</div>
			</AbsoluteFill>

			<AbsoluteFill className="items-center justify-center">
				<div style={{ marginTop: 92 }}>
					<GhostBuild
						fontSize={112}
						from={HEADLINE_FROM}
						text={"The modern way to\npartner with"}
						trailing={
							<RolodexFlip
								from={CYCLE_FROM}
								interval={26}
								items={[
									"agencies",
									"consultants",
									"freelancers",
									"communities",
								]}
								style={{
									color: COLOR.ink,
									fontFamily: SANS_STACK,
									fontSize: 112,
									fontWeight: 700,
									letterSpacing: "-0.035em",
								}}
							/>
						}
						wordStagger={WORD_STAGGER}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
