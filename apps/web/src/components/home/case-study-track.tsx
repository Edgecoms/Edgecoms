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

function CardBody({ card }: { card: CaseStudyCard }) {
	/* One figure per card. Three of them on a card 340px wide is a scoreboard,
	   and a reader skimming a moving row takes nothing from a scoreboard. */
	const metric = card.metric?.value;

	return (
		<>
			{/* Landscape image area with the copy beneath, rather than a portrait
			    crop with the copy over it. These are wide storefront photographs;
			    cropping them to portrait slices the subject through the middle. */}
			<div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[linear-gradient(150deg,var(--gray-4),var(--gray-6))]">
				{card.banner ? (
					<Image
						alt={`${card.brand} storefront`}
						className="object-cover transition-transform duration-300 ease-[var(--ease-out-strong)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
						fill
						sizes="(max-width: 640px) 80vw, 340px"
						src={card.banner}
					/>
				) : null}
			</div>

			{/* Three tiers, and the spacing is what says which is which. The store
			    is the one thing the card is about. The metric is the payoff. The
			    stack is proof, pushed to the bottom edge behind a rule so it reads
			    as a separate register rather than as a third line of the same block.
			    The uniform `gap-3` was the whole problem: even spacing tells the eye
			    everything matters equally, which is the same as saying nothing
			    does. */}
			<div className="flex flex-1 flex-col p-5">
				<div>
					{card.logo ? (
						<Image
							alt={card.brand}
							className="h-8 w-auto max-w-[70%] object-contain object-left"
							height={72}
							src={card.logo}
							width={220}
						/>
					) : (
						<span className="font-medium text-h3 text-primary-foreground">
							{card.brand}
						</span>
					)}
				</div>

				{metric ? (
					<span className="mt-3 font-medium text-brand text-h2">{metric}</span>
				) : null}

				{/* Pinned under the metric, not to the bottom of the card. `mt-auto`
				    let the rule float to wherever the pills happened to end, so a
				    store running six apps drew its separator a row higher than the one
				    next to it. Everything above it is fixed-height, so anchoring it
				    here lines the rules up across the row and lets the pills spill
				    into the slack instead. */}
				<div className="mt-4 flex flex-wrap gap-1.5 border-border border-t pt-3.5">
					{card.apps.map((app) => (
						<span
							className="rounded-full bg-brand/10 px-2.5 py-1 font-medium text-[12px] text-brand"
							key={app}
						>
							{app}
						</span>
					))}
				</div>
			</div>
		</>
	);
}

/* `transition-colors` named no properties worth animating and left the press
   with no feedback at all. Naming transform explicitly and adding the scale
   makes the card answer the finger; 150ms is inside the 100–160ms window a
   press wants. Hover is gated so a tap on a phone does not latch it on. */
const CARD_CLASS =
	"group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-page transition-[transform,background-color,border-color] duration-150 ease-[var(--ease-out-strong)] active:scale-[0.985] motion-reduce:transition-none motion-reduce:active:scale-100 [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--gray-7)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-bg";
const ITEM_CLASS = "w-[78vw] shrink-0 sm:w-[340px]";

function Card({ card }: { card: CaseStudyCard }) {
	return (
		<li className={ITEM_CLASS}>
			<Link className={CARD_CLASS} href={`/case-studies/${card.slug}` as Route}>
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
