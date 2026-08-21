"use client";

import { useEffect, useState } from "react";
import type { BlogHeading } from "@/lib/blog";

/**
 * The section rail.
 *
 * The list itself is plain server-rendered HTML in the markup; the only thing
 * this costs on the client is the observer that marks which section you are in,
 * which is what makes a rail on a 3,000-word post worth having at all.
 */
export function TableOfContents({
	headings,
}: {
	headings: readonly BlogHeading[];
}) {
	const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);

	useEffect(() => {
		const elements = headings
			.map((heading) => document.getElementById(heading.id))
			.filter((element): element is HTMLElement => element !== null);

		if (elements.length === 0) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

				if (visible[0]) {
					setActive(visible[0].target.id);
				}
			},
			// Bias the band to the top third: a heading is "current" once it reaches
			// reading position, not once it scrolls off the bottom.
			{ rootMargin: "-88px 0px -66% 0px", threshold: 0 }
		);

		for (const element of elements) {
			observer.observe(element);
		}

		return () => observer.disconnect();
	}, [headings]);

	if (headings.length < 3) {
		return null;
	}

	return (
		<nav aria-label="On this page" className="lg:sticky lg:top-24">
			<p className="font-medium text-[13px] text-neutral-900">On this page</p>
			<ul className="mt-4 flex flex-col gap-2.5 border-neutral-200 border-l">
				{headings.map((heading) => (
					<li key={heading.id}>
						<a
							aria-current={active === heading.id ? "location" : undefined}
							className={`-ml-px block border-l py-0.5 pl-4 text-[13px] leading-snug transition-colors ${
								active === heading.id
									? "border-[#ff5e1f] text-neutral-900"
									: "border-transparent text-neutral-500 hover:text-neutral-900"
							}`}
							href={`#${heading.id}`}
						>
							{heading.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
