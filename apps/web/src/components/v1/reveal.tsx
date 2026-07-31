"use client";

import { cn } from "@edgecoms/ui/lib/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

/**
 * Reveals its children with a quiet fade-and-rise the first time they scroll
 * into view. Honors prefers-reduced-motion by showing content immediately.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [shown, setShown] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) {
			return;
		}

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setShown(true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setShown(true);
						observer.disconnect();
					}
				}
			},
			{ rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, []);

	return (
		<div
			className={cn(
				"transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
				shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
				className
			)}
			ref={ref}
			style={{ transitionDelay: `${delay}ms` }}
		>
			{children}
		</div>
	);
}
