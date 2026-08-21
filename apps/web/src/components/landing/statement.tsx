"use client";

import {
	BadgeDollarSign,
	Globe,
	LineChart,
	MousePointerClick,
	Package,
	Percent,
	Repeat,
	ShoppingCart,
	Star,
	Tags,
	Timer,
	Wallet,
} from "lucide-react";
import {
	AnimatePresence,
	type MotionValue,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
	useTransform,
} from "motion/react";
import Image from "next/image";
import { Fragment, type RefObject, useEffect, useRef, useState } from "react";
import {
	DottedField,
	Frame,
	PILLARS,
	type PillarKey,
} from "@/components/landing/frame";
import { REVEAL_EASE } from "@/components/ui/reveal";
import { APP_RESULT_BADGES } from "@/lib/marketing-stats";

const INK = "#171717";
/* Light enough to read as "not yet arrived", dark enough to still be legible —
   the unlit words are part of the sentence, not a loading state. */
const UNLIT = "#a3a3a3";

/**
 * The sentence, in segments, each owned by the pillar whose accent lights its
 * words as the sweep passes. Written as data rather than as JSX because the
 * tint is per word: the renderer has to be able to count them.
 */
interface Segment {
	/** Renders the pillar's icon after this segment's last word. */
	chip?: true;
	pillar: PillarKey;
	/** Punctuation that must stay welded to the last word (and its chip). */
	suffix?: string;
	text: string;
}

const SENTENCE: readonly Segment[] = [
	{ pillar: "apps", text: "Edge is a studio of focused Shopify apps for" },
	{ chip: true, pillar: "apps", suffix: ",", text: "offers" },
	{ pillar: "results", text: "better" },
	{ chip: true, pillar: "results", text: "conversion" },
	{ pillar: "partners", text: "and revenue that" },
	{ chip: true, pillar: "partners", suffix: ",", text: "repeats" },
	{ pillar: "partners", text: "all on the traffic you already pay for." },
];

const WORDS = SENTENCE.flatMap((segment) => {
	const parts = segment.text.split(" ");

	return parts.map((word, index) => {
		const isLast = index === parts.length - 1;

		return {
			accent: PILLARS[segment.pillar].accent,
			/* The icon and any punctuation ride on the segment's last word, so a
			   line break can never separate "offers" from its chip. */
			chip: segment.chip === true && isLast ? segment.pillar : null,
			suffix: isLast ? (segment.suffix ?? "") : "",
			word,
		};
	});
});

/* Where the sweep starts and ends, as a fraction of the viewport height: 0 when
   the section's top is 90% of the way down the screen, 1 when its bottom has
   risen to 40%. */
const ENTER_AT = 0.9;
const EXIT_AT = 0.4;

/**
 * Scroll progress through `ref`'s section, measured from the element's own
 * rectangle rather than from a scroll offset.
 *
 * `useScroll` was the obvious tool and it reported nothing here: it listens on
 * the window, while this page scrolls inside `ScrollableContainer` with Lenis
 * driving it. A rect is true no matter which element is doing the scrolling, or
 * whether the movement comes from a real scrollTop or from Lenis interpolating
 * one — so this measures that instead, on a rAF loop that only runs while the
 * section is on screen.
 */
function useSectionProgress(
	ref: RefObject<HTMLElement | null>,
	enabled: boolean
): MotionValue<number> {
	const progress = useMotionValue(0);

	useEffect(() => {
		const element = ref.current;
		if (!(element && enabled)) {
			return;
		}

		let frame = 0;

		const measure = () => {
			const rect = element.getBoundingClientRect();
			const enter = window.innerHeight * ENTER_AT;
			const distance = rect.height + enter - window.innerHeight * EXIT_AT;
			const travelled = enter - rect.top;

			progress.set(
				distance > 0 ? Math.min(1, Math.max(0, travelled / distance)) : 0
			);
			frame = requestAnimationFrame(measure);
		};

		/* Off screen the loop is dead weight — the sentence is either not yet lit
		   or already fully lit, and neither state needs measuring. */
		const observer = new IntersectionObserver(
			([entry]) => {
				cancelAnimationFrame(frame);
				if (entry.isIntersecting) {
					frame = requestAnimationFrame(measure);
					return;
				}
				progress.set(entry.boundingClientRect.top < 0 ? 1 : 0);
			},
			{ rootMargin: "100px 0px" }
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [enabled, progress, ref]);

	return progress;
}

/* The sweep finishes at 0.82 rather than 1 so the sentence is fully lit while
   the reader is still looking at it, not as it leaves the top of the screen.
   0.22 of travel per word is the overlap — several words are mid-transition at
   any moment, which is what makes it read as a wash rather than as a row of
   switches flipping. */
const SWEEP_END = 0.82;
const WORD_WINDOW = 0.22;

/**
 * The floating cards, three pairs, one per pillar, swapped as the sweep reaches
 * that pillar's clause. Every figure comes from `APP_RESULT_BADGES` — the cards
 * are decorative, the numbers on them are not, and they carry their provenance
 * with them.
 */
const STAGES = [
	{
		icons: { left: [Package, Tags], right: [Timer, Percent] },
		left: "edge-bundles",
		right: "edge-timer",
	},
	{
		icons: {
			left: [ShoppingCart, MousePointerClick],
			right: [Star, LineChart],
		},
		left: "edge-cart",
		right: "edge-reviews",
	},
	{
		icons: { left: [Repeat, Wallet], right: [Globe, BadgeDollarSign] },
		left: "edge-subscriptions",
		right: "edge-currency",
	},
] as const;

/* Two slots a side, held constant across stages so the tiles read as the same
   pieces of furniture being re-labelled rather than as new objects flying in.
   Percentages rather than fixed offsets: the section's height changes with the
   sentence's wrap. */
const TILE_SLOTS = {
	left: ["top-[26%] left-[8.5rem] -rotate-6", "top-[38%] left-1 rotate-3"],
	right: ["top-[26%] right-[8.5rem] rotate-6", "top-[38%] right-1 -rotate-3"],
} as const;

function Word({
	accent,
	chip,
	index,
	progress,
	suffix,
	total,
	word,
}: {
	accent: string;
	chip: PillarKey | null;
	index: number;
	progress: MotionValue<number>;
	suffix: string;
	total: number;
	word: string;
}) {
	const start = (index / total) * SWEEP_END;
	const end = start + WORD_WINDOW;
	const color = useTransform(
		progress,
		[start, (start + end) / 2, end],
		[UNLIT, accent, INK]
	);

	return (
		<motion.span className="whitespace-nowrap" style={{ color }}>
			{word}
			{chip ? <ChipIcon pillar={chip} /> : null}
			{suffix}
		</motion.span>
	);
}

function ChipIcon({ pillar }: { pillar: PillarKey }) {
	return (
		<Image
			alt=""
			className="ml-1.5 inline-block size-[0.8em] translate-y-[-0.05em] rounded-[4px] align-middle"
			height={64}
			src={PILLARS[pillar].icon}
			width={64}
		/>
	);
}

function FloatCard({
	badge,
	className,
}: {
	badge: keyof typeof APP_RESULT_BADGES;
	className?: string;
}) {
	const stat = APP_RESULT_BADGES[badge];

	return (
		<div
			className={`flex w-[190px] flex-col gap-0.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.15)] ${className ?? ""}`}
		>
			<span className="text-[11px] text-neutral-500">{stat.label}</span>
			<span className="font-medium text-[15px] text-neutral-900">
				{stat.value}
			</span>
		</div>
	);
}

/** One side's pair of cards, crossfading as the stage changes. */
function CardColumn({
	side,
	stage,
}: {
	side: "left" | "right";
	stage: number;
}) {
	const badge = STAGES[stage][side];
	const other = STAGES[(stage + 1) % STAGES.length][side];
	const tilt = side === "left" ? "-rotate-3" : "rotate-3";
	const drift =
		side === "left" ? "translate-x-6 rotate-2" : "-translate-x-6 -rotate-2";

	return (
		<div
			className={`pointer-events-none absolute inset-y-0 hidden w-[190px] lg:block ${side === "left" ? "left-6" : "right-6"}`}
		>
			{/* Absolutely positioned so the outgoing pair and the incoming one
			    overlap during the crossfade instead of pushing each other around. */}
			<AnimatePresence initial={false}>
				<motion.div
					animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
					className="absolute inset-y-0 left-0 w-full"
					exit={{ filter: "blur(6px)", opacity: 0, y: -18 }}
					initial={{ filter: "blur(6px)", opacity: 0, y: 18 }}
					key={`${badge}-${other}`}
					transition={{ duration: 0.5, ease: REVEAL_EASE }}
				>
					<div className="flex h-full flex-col justify-center gap-6">
						<FloatCard badge={badge} className={tilt} />
						<FloatCard badge={other} className={drift} />
					</div>

					{/* Empty icon tiles, the smallest furniture on the page. They carry
					    no data — their whole job is to make the cards look like part of a
					    scattered set rather than two lonely rectangles. */}
					{STAGES[stage].icons[side].map((Icon, index) => (
						<span
							className={`absolute flex size-9 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-[0_6px_20px_-8px_rgba(0,0,0,0.15)] ${TILE_SLOTS[side][index]}`}
							key={`${badge}-tile-${index.toString()}`}
						>
							<Icon aria-hidden="true" className="size-4 text-neutral-400" />
						</span>
					))}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

export function Statement() {
	const sectionRef = useRef<HTMLElement>(null);
	const reduced = useReducedMotion();
	const [stage, setStage] = useState(0);

	/* Measured against the viewport rather than against a pinned section: the
	   sentence lights up as it crosses the middle of the screen and is done
	   before it reaches the top. Nothing is scroll-jacked — the page keeps
	   moving at the speed the reader chose. */
	const scrollYProgress = useSectionProgress(sectionRef, !reduced);

	useMotionValueEvent(scrollYProgress, "change", (value) => {
		const next = Math.floor(value * STAGES.length);
		setStage(Math.min(STAGES.length - 1, Math.max(0, next)));
	});

	return (
		<section
			className="relative w-full overflow-hidden border-neutral-200 border-b bg-white"
			ref={sectionRef}
		>
			<Frame className="relative overflow-hidden py-20 sm:py-28">
				<DottedField />

				{/* Hidden below `lg`: at 375px they would sit on top of the sentence
				    they are supposed to decorate. */}
				<CardColumn side="left" stage={stage} />
				<CardColumn side="right" stage={stage} />

				<div className="relative mx-auto flex max-w-[520px] flex-col gap-8 px-6 text-[26px] leading-[1.35] tracking-[-0.02em] sm:text-[30px]">
					<p className="font-medium text-neutral-900">
						Ecommerce isn&apos;t just about traffic.
						<br />
						It&apos;s about outcomes.
					</p>

					<p>
						{WORDS.map((entry, index) =>
							reduced ? (
								<Fragment key={`${entry.word}-${index.toString()}`}>
									<span className="whitespace-nowrap text-neutral-900">
										{entry.word}
										{entry.chip ? <ChipIcon pillar={entry.chip} /> : null}
										{entry.suffix}
									</span>{" "}
								</Fragment>
							) : (
								<Fragment key={`${entry.word}-${index.toString()}`}>
									<Word
										accent={entry.accent}
										chip={entry.chip}
										index={index}
										progress={scrollYProgress}
										suffix={entry.suffix}
										total={WORDS.length}
										word={entry.word}
									/>{" "}
								</Fragment>
							)
						)}
					</p>

					<p className="text-neutral-400">
						They install in minutes. They leave nothing behind. And most of them
						have a free plan.
					</p>
				</div>
			</Frame>
		</section>
	);
}
