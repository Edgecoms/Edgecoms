"use client";

import { useEffect, useState } from "react";
import { Container, CtaLink, PriceTag } from "@/components/ui";

/**
 * A persistent enrol bar, shown once the hero has scrolled away.
 *
 * Two rules, and the second one used to be wrong:
 *
 *   1. Hidden while the hero is still on screen — until then the bar is just a
 *      second copy of the buttons already in front of the reader.
 *   2. Hidden **while the signup form is actually in view**, so it never covers
 *      the thing it points at. The earlier test asked whether the form's top
 *      edge was above the fold, which stays true forever once you scroll past
 *      it — so the bar disappeared at the form and never came back for the
 *      FAQ, the closing CTA or the footer, which is exactly the stretch where a
 *      reader who has finished reading wants it.
 */
export function StickyBar() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			const target = document.getElementById("get-access");
			const pastHero = window.scrollY > window.innerHeight * 0.85;

			// Genuinely overlapping the viewport, not merely "somewhere above".
			let formInView = false;

			if (target) {
				const rect = target.getBoundingClientRect();
				formInView = rect.top < window.innerHeight && rect.bottom > 0;
			}

			setVisible(pastHero && !formInView);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);

		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	return (
		<div
			className={`fixed inset-x-0 bottom-0 z-50 border-ink-border border-t bg-ink/95 backdrop-blur transition-transform duration-300 ease-[var(--ease-out-strong)] motion-reduce:transition-none ${
				visible ? "translate-y-0" : "translate-y-full"
			}`}
			// Inert while off-screen, so a keyboard user cannot tab into a bar they
			// cannot see.
			inert={!visible}
		>
			<Container className="flex items-center justify-between gap-4 py-3">
				<div className="flex items-baseline gap-2.5">
					<PriceTag
						currentClassName="font-bold text-accent text-xl"
						listClassName="font-semibold text-muted-dark text-sm line-through"
					/>
					<span className="hidden text-muted text-sm sm:inline">
						· full course access
					</span>
				</div>

				<CtaLink className="shrink-0" href="#get-access" size="md">
					Get free access
				</CtaLink>
			</Container>
		</div>
	);
}
