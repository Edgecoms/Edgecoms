"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CaseStudy } from "@/lib/marketing-stats";

export interface CaseStudyCard extends CaseStudy {
	/** The app whose page this card links through to. */
	slug: string;
}

/** Pixels per second. Slow enough to read a card without chasing it. */
const SCROLL_SPEED = 26;

function CardMedia({ card }: { card: CaseStudyCard }) {
	if (card.image) {
		return (
			<Image
				alt={`${card.brand} products`}
				className="object-cover transition-transform duration-500 group-hover:scale-105"
				fill
				sizes="(max-width: 640px) 80vw, 320px"
				src={card.image}
			/>
		);
	}

	/* No photography yet. A tinted panel is honest about that; a stock photo
	   would imply a product this merchant does not sell. */
	return (
		<div
			aria-hidden="true"
			className="absolute inset-0 bg-[linear-gradient(150deg,var(--gray-4),var(--gray-6))]"
		/>
	);
}

function CardBody({ card }: { card: CaseStudyCard }) {
	const headline = card.results[0];

	return (
		<>
			<CardMedia card={card} />

			{/* Scrim. The copy sits on arbitrary photography, so it carries its own
			    contrast rather than hoping the image is dark at the bottom. */}
			<div
				aria-hidden="true"
				className="absolute inset-x-0 bottom-0 h-3/5 bg-[linear-gradient(to_top,rgba(0,0,0,0.88),rgba(0,0,0,0.55)_45%,transparent)]"
			/>

			{/* Unmistakable, and deliberately ugly. If this badge is on screen the
			    numbers below it are invented, and a screenshot of this card can never
			    be mistaken for a screenshot of a real result. */}
			{card.published ? null : (
				<span className="absolute top-4 left-4 rounded-full bg-amber-400 px-2.5 py-1 font-medium font-mono text-[10px] text-black uppercase tracking-[0.1em]">
					Placeholder
				</span>
			)}

			<div className="relative flex flex-col gap-3 p-5">
				<span className="w-fit rounded-full border border-white/25 bg-white/15 px-2.5 py-1 font-medium font-mono text-[10px] text-white uppercase tracking-[0.1em] backdrop-blur-sm">
					{card.category}
				</span>

				<h3 className="font-medium text-h3 text-white">{card.brand}</h3>

				{headline ? (
					<div className="flex items-baseline justify-between gap-4 border-white/25 border-t pt-3">
						<span className="text-caption text-white/75">{headline.label}</span>
						{/* The one thing on the card a merchant is scanning for, so it is
						    the one thing that is not white. */}
						<span className="font-medium text-body-lg text-brand tabular-nums">
							{headline.value}
						</span>
					</div>
				) : null}
			</div>
		</>
	);
}

const CARD_CLASS =
	"group relative flex h-[460px] flex-col justify-end overflow-hidden rounded-[1.75rem] sm:h-[520px]";
const ITEM_CLASS = "w-[78vw] shrink-0 sm:w-[320px]";

function Card({ card }: { card: CaseStudyCard }) {
	return (
		<li className={ITEM_CLASS}>
			<Link className={CARD_CLASS} href={`/products/${card.slug}` as Route}>
				<CardBody card={card} />
			</Link>
		</li>
	);
}

/**
 * The duplicate half of the loop. Rendered as a plain div rather than a link,
 * so the same seven destinations do not appear twice in the tab order or twice
 * to a screen reader.
 */
function CloneCard({ card }: { card: CaseStudyCard }) {
	return (
		<li aria-hidden="true" className={ITEM_CLASS}>
			<div className={CARD_CLASS}>
				<CardBody card={card} />
			</div>
		</li>
	);
}

/**
 * Auto-scrolling proof row.
 *
 * Driven by `scrollLeft` on a real scroll container rather than a CSS transform
 * on a track. A transform would look identical and be less code, but it takes
 * the row out of the scroll model entirely — no swiping on a phone, no
 * trackpad, no keyboard. Animating the scroll position keeps every one of those
 * working and simply moves the position when nobody is driving it.
 *
 * It stops whenever a person is engaged: pointer over the row, keyboard focus
 * inside it, or a finger down on it. Reduced-motion users never start it.
 */
export function CaseStudyTrack({ cards }: { cards: readonly CaseStudyCard[] }) {
	const trackRef = useRef<HTMLUListElement>(null);
	const pausedRef = useRef(false);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) {
			return;
		}
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		let raf = 0;
		let previous = 0;
		// Kept as a float: scrollLeft rounds in some engines, and losing the
		// fraction every frame at this speed stalls the animation completely.
		let position = track.scrollLeft;

		/* The distance from a card to its own clone — one full period of the loop.
		   Measured rather than derived from `scrollWidth / 2`, because scrollWidth
		   also contains the container's left and right padding, which are not part
		   of the repeat. Rewinding by that instead puts the seam ~14px out and the
		   loop visibly hiccups once a lap. Measured once, and again on resize,
		   since reading offsetLeft every frame would force layout every frame. */
		let period = 0;
		const measure = () => {
			const first = track.children[0] as HTMLElement | undefined;
			const clone = track.children[cards.length] as HTMLElement | undefined;
			period = first && clone ? clone.offsetLeft - first.offsetLeft : 0;
		};
		measure();

		const step = (now: number) => {
			const elapsed = previous === 0 ? 0 : now - previous;
			previous = now;

			const canScroll = period > 0 && track.scrollWidth > track.clientWidth;

			if (pausedRef.current || !canScroll) {
				position = track.scrollLeft;
			} else {
				position += (SCROLL_SPEED * elapsed) / 1000;
				if (position >= period) {
					position -= period;
				}
				track.scrollLeft = position;
			}

			raf = requestAnimationFrame(step);
		};

		raf = requestAnimationFrame(step);

		/* Bound here rather than as JSX props. These are not interaction handlers
		   — the list is not interactive, the cards inside it are — they only tell
		   the animation to get out of the way while someone is engaged. Attaching
		   them imperatively keeps the markup honest about that. */
		const pause = () => {
			pausedRef.current = true;
		};
		const resume = () => {
			pausedRef.current = false;
		};

		track.addEventListener("pointerenter", pause);
		track.addEventListener("pointerleave", resume);
		track.addEventListener("focusin", pause);
		track.addEventListener("focusout", resume);
		track.addEventListener("touchstart", pause, { passive: true });
		track.addEventListener("touchend", resume, { passive: true });
		window.addEventListener("resize", measure);

		return () => {
			cancelAnimationFrame(raf);
			track.removeEventListener("pointerenter", pause);
			track.removeEventListener("pointerleave", resume);
			track.removeEventListener("focusin", pause);
			track.removeEventListener("focusout", resume);
			track.removeEventListener("touchstart", pause);
			track.removeEventListener("touchend", resume);
			window.removeEventListener("resize", measure);
		};
	}, [cards.length]);

	return (
		<ul
			className="mt-12 flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
			ref={trackRef}
		>
			{cards.map((card) => (
				<Card card={card} key={card.slug} />
			))}
			{cards.map((card) => (
				<CloneCard card={card} key={`clone-${card.slug}`} />
			))}
		</ul>
	);
}
