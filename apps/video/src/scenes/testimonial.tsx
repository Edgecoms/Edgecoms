import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	staticFile,
	useCurrentFrame,
} from "remotion";
import { PartnersDots } from "@/components/edge-partners-lockup";
import { TESTIMONIAL } from "@/content";
import { SANS_STACK } from "@/fonts";
import { COLOR } from "@/theme";

/** Screen 7 — 22–27s. */
export const TESTIMONIAL_DURATION = 165;

const TAG_FROM = 4;
const QUOTE_FROM = 16;
const LINE_STAGGER = 6;
const LINE_FRAMES = 22;
const AUTHOR_FROM = 76;

const QUOTE_SIZE = 56;
const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** Fade + rise + defocus, the same entrance the headline screens use. */
const useEnter = (from: number, frames: number) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [from, from + frames], [0, 1], {
		easing: EASE,
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
};

const QuoteLine = ({ index, text }: { index: number; text: string }) => {
	const enter = useEnter(QUOTE_FROM + index * LINE_STAGGER, LINE_FRAMES);
	const isMarkLine = index === TESTIMONIAL.markLine;

	return (
		<div
			style={{
				filter: `blur(${(1 - enter) * 6}px)`,
				opacity: enter,
				transform: `translateY(${(1 - enter) * 22}px)`,
			}}
		>
			{index === 0 ? "“" : null}
			{text}
			{isMarkLine ? (
				<span style={{ color: COLOR.highlight }}>{TESTIMONIAL.mark}</span>
			) : null}
			{index === TESTIMONIAL.lines.length - 1 ? "”" : null}
		</div>
	);
};

export const Testimonial = () => {
	const tag = useEnter(TAG_FROM, 18);
	const author = useEnter(AUTHOR_FROM, 20);

	return (
		<AbsoluteFill
			style={{
				alignItems: "center",
				color: COLOR.ink,
				fontFamily: SANS_STACK,
				justifyContent: "center",
			}}
		>
			{/* The site's own eyebrow pill: purple-50 on purple-200, purple-700 type. */}
			<div
				style={{
					alignItems: "center",
					backgroundColor: "#FAF5FF",
					border: "1px solid #E9D5FF",
					borderRadius: 999,
					color: "#7E22CE",
					display: "flex",
					fontSize: 26,
					fontWeight: 600,
					gap: 10,
					opacity: tag,
					padding: "12px 26px",
					transform: `translateY(${(1 - tag) * 16}px)`,
				}}
			>
				<PartnersDots size={24} />
				{TESTIMONIAL.tag}
			</div>

			<div
				style={{
					fontSize: QUOTE_SIZE,
					fontWeight: 600,
					letterSpacing: "-0.025em",
					lineHeight: 1.35,
					marginTop: 62,
					textAlign: "center",
				}}
			>
				{TESTIMONIAL.lines.map((text, i) => (
					<QuoteLine index={i} key={text} text={text} />
				))}
			</div>

			<div
				style={{
					alignItems: "center",
					display: "flex",
					flexDirection: "column",
					marginTop: 64,
					opacity: author,
					transform: `translateY(${(1 - author) * 18}px)`,
				}}
			>
				<Img
					src={staticFile(`avatars/${TESTIMONIAL.avatar}`)}
					style={{
						borderRadius: "50%",
						height: 84,
						objectFit: "cover",
						width: 84,
					}}
				/>
				<div style={{ fontSize: 32, fontWeight: 600, marginTop: 18 }}>
					{TESTIMONIAL.name}
				</div>
				<div style={{ color: COLOR.inkMuted, fontSize: 28, marginTop: 6 }}>
					{TESTIMONIAL.role}
				</div>
			</div>
		</AbsoluteFill>
	);
};
