import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
} from "remotion";
import { Typewriter } from "@/components/remocn/typewriter";
import { MERCHANTS } from "@/content";
import { COLOR } from "@/theme";

/** 43–47s. */
export const LOGOS_DURATION = 120;

const GRID_FROM = 30;
const TILE_STAGGER = 6;
const GRID_SLOTS = 9;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

const LogoTile = ({ index }: { index: number }) => {
	const frame = useCurrentFrame();
	const merchant = MERCHANTS[index];

	const appear = interpolate(
		frame - (GRID_FROM + index * TILE_STAGGER),
		[0, 18],
		[0, 1],
		{ easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
	);

	return (
		<div
			style={{
				alignItems: "center",
				backgroundColor: "#FFFFFF",
				border: "1px solid #E6EAEF",
				borderRadius: 20,
				display: "flex",
				height: 150,
				justifyContent: "center",
				opacity: appear,
				transform: `translateY(${(1 - appear) * 4}px)`,
			}}
		>
			{merchant ? (
				<Img
					alt={merchant.name}
					src={staticFile(`case-studies/${merchant.logo}`)}
					style={{ maxHeight: 66, maxWidth: 240, objectFit: "contain" }}
				/>
			) : null}
		</div>
	);
};

export const Logos = () => (
	<AbsoluteFill>
		<AbsoluteFill className="items-center" style={{ paddingTop: 150 }}>
			<Typewriter
				charsPerSecond={26}
				color={COLOR.ink}
				cursor={false}
				fontSize={78}
				fontWeight={700}
				text="Shops already running on Edge"
			/>
		</AbsoluteFill>

		<AbsoluteFill className="items-center justify-center">
			<div
				style={{
					display: "grid",
					gap: 24,
					gridTemplateColumns: "repeat(3, 300px)",
					marginTop: 120,
				}}
			>
				{Array.from({ length: GRID_SLOTS }, (_, i) => (
					<LogoTile index={i} key={`tile-${i + 1}`} />
				))}
			</div>
		</AbsoluteFill>
	</AbsoluteFill>
);
