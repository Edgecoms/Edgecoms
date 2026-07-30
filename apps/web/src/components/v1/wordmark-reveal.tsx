"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * OPTIONAL ENHANCEMENT — elastic "rubber" ease on the footer wordmark as the
 * curtain reveals it. The core reveal is pure CSS (sticky footer + opaque
 * content layer) and works without this. To remove the effect entirely, drop
 * this wrapper in the footer and render <WordMark /> directly.
 */

function findScrollParent(start: HTMLElement | null): HTMLElement | null {
	let node = start?.parentElement ?? null;
	while (node) {
		const overflowY = getComputedStyle(node).overflowY;
		if (overflowY === "auto" || overflowY === "scroll") {
			return node;
		}
		node = node.parentElement;
	}
	return null;
}

// easeOutBack gives the slight overshoot that reads as an elastic settle.
function easeOutBack(x: number): number {
	const c1 = 1.701_58;
	const c3 = c1 + 1;
	return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
}

const MAX_OFFSET = 48; // px the wordmark drifts up as it is uncovered
const LERP = 0.12; // smoothing factor toward the scroll target

export function WordmarkReveal({ children }: { children: ReactNode }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		const scroller = findScrollParent(el);
		const layer = el.closest<HTMLElement>("[data-reveal-layer]") ?? el;
		if (!scroller) {
			return;
		}

		let raf = 0;
		let current = 0;
		let target = 0;
		let running = false;

		const apply = (value: number) => {
			const y = (1 - easeOutBack(value)) * MAX_OFFSET;
			el.style.transform = `translate3d(0, ${y}px, 0)`;
		};

		const tick = () => {
			current += (target - current) * LERP;
			if (Math.abs(target - current) < 0.0005) {
				current = target;
				running = false;
			}
			apply(current);
			if (running) {
				raf = requestAnimationFrame(tick);
			}
		};

		const start = () => {
			if (!running) {
				running = true;
				raf = requestAnimationFrame(tick);
			}
		};

		const measure = () => {
			const revealHeight = layer.offsetHeight || 1;
			const distanceFromBottom =
				scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop;
			target = Math.min(Math.max(1 - distanceFromBottom / revealHeight, 0), 1);
			start();
		};

		// Settle to the initial scroll position without a jump.
		measure();
		current = target;
		apply(current);

		scroller.addEventListener("scroll", measure, { passive: true });
		window.addEventListener("resize", measure);
		const resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(layer);

		return () => {
			cancelAnimationFrame(raf);
			scroller.removeEventListener("scroll", measure);
			window.removeEventListener("resize", measure);
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div className="will-change-transform" ref={ref}>
			{children}
		</div>
	);
}
