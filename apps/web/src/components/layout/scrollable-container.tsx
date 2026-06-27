"use client";

import { cn } from "@edgecoms/ui/lib/utils";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";
import { type HTMLProps, useEffect, useRef } from "react";

export type ScrollableContainerProps = HTMLProps<HTMLDivElement> & {
	disableStableGutter?: boolean;
	/** Enable Lenis momentum/inertia smooth scrolling on this container. */
	smooth?: boolean;
};

/**
 * A scrollable container that can be used to wrap content that should be scrollable.
 * This component should be used as the primary scroll container in the app.
 */
export function ScrollableContainer({
	className,
	children,
	disableStableGutter = false,
	smooth = false,
	...props
}: ScrollableContainerProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		const content = contentRef.current;
		if (!(smooth && wrapper && content)) {
			return;
		}
		// Lenis animates real scrollTop, so position:sticky and the curtain
		// reveal keep working. Skip entirely for reduced-motion users.
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		let raf = 0;
		let active = true;
		let lenis: Lenis | null = null;

		import("lenis").then(({ default: LenisCtor }) => {
			if (!active) {
				return;
			}
			lenis = new LenisCtor({ wrapper, content, lerp: 0.1 });
			const loop = (time: number) => {
				lenis?.raf(time);
				raf = requestAnimationFrame(loop);
			};
			raf = requestAnimationFrame(loop);
		});

		return () => {
			active = false;
			cancelAnimationFrame(raf);
			lenis?.destroy();
		};
	}, [smooth]);

	return (
		<div
			className={cn(
				"flex w-full flex-1 flex-col overflow-y-auto",
				"focus:outline-none focus:ring-0",
				!disableStableGutter && "[scrollbar-gutter:stable]",
				className
			)}
			ref={wrapperRef}
			{...props}
		>
			{smooth ? (
				<div className="flex w-full flex-col" ref={contentRef}>
					{children}
				</div>
			) : (
				children
			)}
		</div>
	);
}

ScrollableContainer.displayName = "ScrollableContainer";
