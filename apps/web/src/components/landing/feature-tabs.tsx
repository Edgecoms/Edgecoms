"use client";

import { cn } from "@edgecoms/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { PILLARS, type PillarKey } from "@/components/landing/frame";

export interface Feature {
	body: string;
	href: string;
	title: string;
}

/**
 * The three-up feature row under each section's graphic.
 *
 * Only one column is ever at full contrast. That is the whole idea of the
 * pattern: three equally-loud columns is a specification sheet, and the reader
 * skims it. Muting two of them turns the row into one thing being said, with
 * two more available — and the accent rule on the left says which section's
 * colour you are still inside.
 *
 * State is per-row and hover-driven, so it costs nothing on touch (where the
 * first column simply stays active) and needs no scroll listener.
 */
export function FeatureTabs({
	features,
	pillar,
}: {
	features: readonly Feature[];
	pillar: PillarKey;
}) {
	const [active, setActive] = useState(0);
	const { accent } = PILLARS[pillar];

	return (
		<ul className="grid grid-cols-1 divide-neutral-200 border-neutral-200 border-t sm:grid-cols-3 sm:divide-x">
			{features.map((feature, index) => {
				const isActive = index === active;

				return (
					<li className="relative" key={feature.title}>
						{/* The whole column is the link, not just the "Learn more" line.
						    That is what lets the hover and focus handlers sit on an
						    interactive element — and it is the better target anyway, since
						    the reader's pointer is already somewhere in the paragraph by
						    the time they decide to click. */}
						<Link
							className="flex flex-col gap-3 px-6 py-8"
							href={feature.href as Route}
							onFocus={() => setActive(index)}
							onMouseEnter={() => setActive(index)}
						>
							{/* Always rendered and only changing colour, so the text never
							    shifts by a pixel when the active column moves. */}
							<span
								aria-hidden="true"
								className="absolute inset-y-0 left-0 hidden w-px transition-colors duration-200 sm:block"
								style={{ background: isActive ? accent : "transparent" }}
							/>

							<h3
								className={cn(
									"font-medium text-[15px] transition-colors duration-200",
									isActive ? "text-neutral-900" : "text-neutral-400"
								)}
							>
								{feature.title}
							</h3>
							<p
								className={cn(
									"text-[14px] leading-relaxed transition-colors duration-200",
									isActive ? "text-neutral-500" : "text-neutral-400"
								)}
							>
								{feature.body}
							</p>
							<span
								className="mt-1 inline-flex items-center gap-0.5 font-medium text-[14px] transition-colors duration-200"
								style={{ color: isActive ? accent : "#a3a3a3" }}
							>
								Learn more
								<ChevronRight aria-hidden="true" className="size-3.5" />
							</span>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
