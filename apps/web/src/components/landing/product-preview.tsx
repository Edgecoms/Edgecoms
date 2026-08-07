"use client";

import { cn } from "@edgecoms/ui/lib/utils";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PILLARS, type PillarKey } from "@/components/landing/frame";

const TABS: readonly PillarKey[] = ["apps", "results", "partners"];

export function ProductPreview() {
	const [active, setActive] = useState<PillarKey>("apps");

	return (
		<section className="relative isolate overflow-hidden border-neutral-200 border-b bg-neutral-50">
			{/* Faint wash on the right, so the panel is not a flat grey rectangle. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_100%_40%,rgba(22,163,74,0.05),transparent)]"
			/>

			{/* The shelf: the white page surface above hanging down into this panel
			    to hold the pills. Same trick as the closing panel's curved edge,
			    inverted — a fixed-width SVG centred over a transparent strip, rather
			    than a full-bleed one, because the flat section between the two curves
			    has to stay wide enough for three pills at every viewport. Below `sm`
			    it is dropped entirely: at 375px the curves would eat the pills. */}
			<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-16 justify-center sm:flex">
				<svg
					className="h-full w-[740px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.05)]"
					preserveAspectRatio="none"
					role="presentation"
					viewBox="0 0 740 64"
				>
					<path
						d="M0 0 H70 C120 0 120 64 170 64 H570 C620 64 620 0 670 0 H740 V0 Z"
						fill="#ffffff"
					/>
				</svg>
			</div>

			<div className="relative flex justify-center px-6 pt-4 pb-16 sm:pb-20">
				<div className="flex flex-wrap items-center justify-center gap-2">
					{TABS.map((key) => {
						const pillar = PILLARS[key];
						const isActive = key === active;

						return (
							<button
								aria-pressed={isActive}
								className={cn(
									"flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium text-caption transition-colors",
									isActive
										? "border border-neutral-200 bg-white text-neutral-900 shadow-sm"
										: "border border-transparent bg-neutral-100 text-neutral-500 hover:text-neutral-900"
								)}
								key={key}
								onClick={() => setActive(key)}
								type="button"
							>
								<Image
									alt=""
									className="size-4 rounded-[5px]"
									height={64}
									src={pillar.icon}
									width={64}
								/>
								{pillar.label}
							</button>
						);
					})}
				</div>
			</div>

			<div className="relative mx-auto w-full max-w-[1080px] px-6 pb-20">
				{/* Placeholder. Swap the inner box for the real dashboard shot when
				    there is one — the frame, the ratio and the banner overlap all stay
				    as they are. */}
				<div className="rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]">
					<div className="aspect-[16/9] w-full rounded-xl bg-neutral-200" />
				</div>

				{/* Overlapping the shot rather than sitting under it: the banner is an
				    interruption, and one that clears the artwork entirely reads as the
				    next section instead. */}
				<Link
					className="absolute bottom-28 left-1/2 flex w-[calc(100%-6rem)] max-w-[820px] -translate-x-1/2 flex-col gap-4 rounded-xl bg-neutral-900 px-5 py-4 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] transition-colors hover:bg-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:px-6"
					href={"/partners" as Route}
				>
					<span className="flex items-center gap-4">
						<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 font-semibold text-body-sm text-white">
							%
						</span>
						<span className="flex flex-col">
							<span className="font-medium text-body-sm text-white">
								Edge Partner Program
							</span>
							<span className="text-caption text-neutral-400">
								Register the merchants you manage and earn a recurring share of
								Edge revenue, every month
							</span>
						</span>
					</span>
					<span className="shrink-0 self-start rounded-lg bg-white px-4 py-2 font-medium text-caption text-neutral-900 sm:self-auto">
						Learn more
					</span>
				</Link>
			</div>
		</section>
	);
}
