"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * Fades a section up the first time it scrolls into view.
 *
 * The animation itself lives in `globals.css`, not here, and this component
 * only flips a data attribute. That split is deliberate — it is what lets the
 * page survive three cases the previous Motion-based version got wrong:
 *
 *   - **No JavaScript.** Motion's `initial` prop is serialised into the SSR
 *     HTML as `style="opacity:0"`, so a blocked bundle left the entire page
 *     blank. Nothing here writes an inline style, and the CSS only hides
 *     content under `.js`.
 *   - **Reduced motion.** The old version branched on `useReducedMotion()`,
 *     which is `null` on the server and resolved on the client, so the two
 *     renders disagreed. React hydrated the div, kept the server's
 *     `opacity: 0`, and never patched it — leaving reduced-motion visitors on
 *     a permanently invisible page. The preference is now handled entirely by
 *     a CSS media query, which the server never has to guess at.
 *   - **Hydration.** Server and client render byte-identical markup.
 *
 * `once` is implicit: the observer disconnects on the first intersection.
 * Re-animating on the way back up turns a long page into a light show.
 */
export function Reveal({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;

		if (!el) {
			return;
		}

		// Belt and braces: the CSS media query already neutralises the hidden
		// state, but there is no point running an observer for an animation that
		// cannot play.
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						el.dataset.reveal = "in";
						observer.disconnect();
					}
				}
			},
			{ rootMargin: "0px 0px -80px 0px", threshold: 0.12 }
		);

		observer.observe(el);

		return () => observer.disconnect();
	}, []);

	return (
		<div className={className} data-reveal="" ref={ref}>
			{children}
		</div>
	);
}
