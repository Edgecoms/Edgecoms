"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/* Expo-out, no overshoot. Almost all of the distance is covered in the first
   third of the duration and the rest is a long glide into place — that tail is
   the whole difference between "it moved" and "it arrived". A spring here would
   read as bounce, which is a different, chattier personality. */
export const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;
/* Long enough to be watched rather than noticed. Under ~0.6s the eye reads the
   whole thing as a flicker no matter how good the curve is. */
export const REVEAL_DURATION = 0.8;

/**
 * Fades a section up once, the first time it comes into view.
 *
 * Deliberately restrained: 24px, 8px of blur, 0.8s. A section that slides a
 * long way makes the page feel like it is assembling itself while the reader
 * waits, and on a long marketing page that happens nine times. The blur is what
 * makes a movement this short readable — it says "arriving" without needing the
 * distance to say it.
 *
 * `once` matters as much as the distance — re-animating on the way back up
 * turns scrolling into a light show.
 */
export function Reveal({
	children,
	className,
	delay = 0,
}: {
	children: ReactNode;
	/**
	 * For when the wrapper lands in a layout that was addressing the child
	 * directly — a grid cell, a flex row. `grid` is usually the fix: it makes
	 * the wrapped element fill the cell the way it did before it was wrapped.
	 */
	className?: string;
	delay?: number;
}) {
	const reduced = useReducedMotion();

	if (reduced) {
		return children;
	}

	return (
		<motion.div
			className={className}
			initial={{ filter: "blur(8px)", opacity: 0, y: 24 }}
			transition={{ delay, duration: REVEAL_DURATION, ease: REVEAL_EASE }}
			viewport={{ amount: 0.15, margin: "0px 0px -80px 0px", once: true }}
			whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
		>
			{children}
		</motion.div>
	);
}

/**
 * Variants for a section whose children arrive one at a time — a card grid,
 * where the whole block fading in at once tells the reader nothing about how
 * many things are in it.
 *
 * Shorter and shallower than `Reveal`: a card is a small object, and a small
 * object that travels as far as a whole section reads as flying in. 70ms apart
 * is the smallest gap that still resolves as a sequence rather than a shimmer.
 *
 * Nest a container inside a container to get "header, then the cards": the
 * parent staggers its own children, and the grid it contains staggers its.
 */
export const STAGGER_CONTAINER: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.07 } },
};

const STAGGER_ITEM: Variants = {
	hidden: { filter: "blur(6px)", opacity: 0, y: 16 },
	show: {
		filter: "blur(0px)",
		opacity: 1,
		transition: { duration: 0.55, ease: REVEAL_EASE },
		y: 0,
	},
};

const STAGGER_ITEM_REDUCED: Variants = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { duration: 0.4 } },
};

/** The item variants, minus the travel and the blur when the OS asks for it. */
export function useStaggerItem(): Variants {
	return useReducedMotion() ? STAGGER_ITEM_REDUCED : STAGGER_ITEM;
}

/** Fire once, as soon as the top of the block is properly in view. */
export const STAGGER_VIEWPORT = {
	amount: 0.1,
	margin: "0px 0px -80px 0px",
	once: true,
} as const;
