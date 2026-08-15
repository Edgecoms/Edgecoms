"use client";

import { cn } from "@edgecoms/ui/lib/utils";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
	Frame,
	PartnersIcon,
	PILLARS,
	type PillarKey,
} from "@/components/landing/frame";

const TABS: readonly PillarKey[] = ["apps", "results", "partners"];

/* One clip per pillar. A pillar with no entry keeps the grey plate — the box is
   a placeholder until there is something true to show in it. */
const VIDEOS: Partial<Record<PillarKey, string>> = {
	partners: "/videos/edge-partners.mp4",
	results: "/videos/trackproof.mp4",
};

export function ProductPreview() {
	const [active, setActive] = useState<PillarKey>("apps");

	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-neutral-50">
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

			<Frame className="relative flex flex-col items-center gap-12 px-4 pt-4 pb-16 sm:px-6 sm:pb-20">
				{/* Responsive tab pills - 1 top / 2 bottom on mobile matching Image 2, single row on desktop */}
				<div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
					{/* Mobile: 1 centered pill on top */}
					<div className="flex justify-center sm:hidden">
						{(() => {
							const pillar = PILLARS.partners;
							const isActive = active === "partners";
							return (
								<button
									aria-pressed={isActive}
									className={cn(
										"flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-caption transition-colors",
										isActive
											? "border border-neutral-200 bg-white text-neutral-900 shadow-sm"
											: "border border-transparent bg-neutral-100 text-neutral-500 hover:text-neutral-900"
									)}
									onClick={() => setActive("partners")}
									type="button"
								>
									<PartnersIcon className="size-4" />
									{pillar.label}
								</button>
							);
						})()}
					</div>

					{/* Mobile: 2 pills side-by-side on bottom */}
					<div className="flex items-center gap-2 sm:hidden">
						{(["apps", "results"] as const).map((key) => {
							const pillar = PILLARS[key];
							const isActive = key === active;
							return (
								<button
									aria-pressed={isActive}
									className={cn(
										"flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-caption transition-colors",
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

					{/* Desktop: All tabs in a single row */}
					<div className="hidden items-center gap-2 sm:flex">
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
									{key === "partners" ? (
										<PartnersIcon className="size-4" />
									) : (
										<Image
											alt=""
											className="size-4 rounded-[5px]"
											height={64}
											src={pillar.icon}
											width={64}
										/>
									)}
									{pillar.label}
								</button>
							);
						})}
					</div>
				</div>

				<div className="flex w-full flex-col">
					{/* Dashboard Preview Box */}
					<div className="mask-b-from-55% relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]">
						{VIDEOS[active] ? (
							// Keyed on the tab so switching remounts the element: changing the
							// `src` attribute alone leaves the old clip on screen until the
							// browser is told to load again.
							<video
								autoPlay
								className="aspect-[4/3] w-full rounded-xl bg-neutral-200 object-cover sm:aspect-[16/9]"
								key={active}
								loop
								muted
								playsInline
								preload="metadata"
								src={VIDEOS[active]}
							>
								<track kind="captions" />
							</video>
						) : (
							<div className="aspect-[4/3] w-full rounded-xl bg-neutral-200 sm:aspect-[16/9]" />
						)}
					</div>

					{/* Rides up into the box's faded bottom edge rather than sitting over
				    the middle of the frame: the clip reads to the end, and the banner
				    still overlaps enough to belong to it. */}
					<Link
						className="relative z-10 -mt-10 flex w-full flex-col rounded-xl bg-neutral-900 p-5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] transition-colors hover:bg-neutral-800 sm:mx-auto sm:-mt-12 sm:max-w-[820px] sm:px-6 sm:py-4"
						href={"/partners" as Route}
					>
						{/* Mobile view (< sm): Centered Title, Centered Description, Full-Width "Learn more" button (Image 2) */}
						<div className="flex flex-col items-center gap-2.5 text-center sm:hidden">
							<span className="font-semibold text-base text-white">
								Edge Partner Program
							</span>
							<p className="max-w-[280px] text-neutral-300 text-xs leading-relaxed">
								Register the merchants you manage and earn a recurring share of
								Edge revenue, every month
							</p>
							<span className="mt-1.5 flex h-10 w-full items-center justify-center rounded-xl bg-white font-semibold text-neutral-900 text-xs transition-colors hover:bg-neutral-100">
								Learn more
							</span>
						</div>

						{/* Desktop view (sm and above): Horizontal row layout with icon, text, and button */}
						<div className="hidden sm:flex sm:w-full sm:items-center sm:justify-between">
							<span className="flex items-center gap-4">
								<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 font-semibold text-body-sm text-white">
									%
								</span>
								<span className="flex flex-col text-left">
									<span className="font-medium text-body-sm text-white">
										Edge Partner Program
									</span>
									<span className="text-caption text-neutral-400">
										Register the merchants you manage and earn a recurring share
										of Edge revenue, every month
									</span>
								</span>
							</span>
							<span className="shrink-0 rounded-lg bg-white px-4 py-2 font-medium text-caption text-neutral-900 transition-colors hover:bg-neutral-100">
								Learn more
							</span>
						</div>
					</Link>
				</div>
			</Frame>
		</section>
	);
}
