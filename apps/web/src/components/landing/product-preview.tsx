import type { Route } from "next";
import Link from "next/link";
import { Frame, PartnersIcon, PILLARS } from "@/components/landing/frame";

/**
 * The Edge Partners clip, and the banner that reads through to the programme.
 *
 * This was a three-tab switcher until the other two tabs were dropped. With one
 * panel there is no state left to hold, so it renders on the server and the pill
 * is a label rather than a button — a tab that cannot be switched is a control
 * that lies about being one.
 */
const VIDEO = "/videos/edge-partners.mp4";

export function ProductPreview() {
	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-neutral-50">
			{/* Faint wash on the right, so the panel is not a flat grey rectangle. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_100%_40%,rgba(124,58,237,0.05),transparent)]"
			/>

			{/* The shelf: the white page surface above hanging down into this panel
			    to hold the pill. Same trick as the closing panel's curved edge,
			    inverted — a fixed-width SVG centred over a transparent strip, rather
			    than a full-bleed one. The flat section between the two curves is
			    sized to the single pill it now carries. Below `sm` it is dropped
			    entirely: at 375px the curves would eat the pill. */}
			<div className="pointer-events-none absolute inset-x-0 top-0 hidden h-16 justify-center sm:flex">
				<svg
					className="h-full w-[440px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.05)]"
					preserveAspectRatio="none"
					role="presentation"
					viewBox="0 0 440 64"
				>
					<path
						d="M0 0 H40 C90 0 90 64 140 64 H300 C350 64 350 0 400 0 H440 V0 Z"
						fill="#ffffff"
					/>
				</svg>
			</div>

			<Frame className="relative flex flex-col items-center gap-12 px-4 pt-4 pb-16 sm:px-6 sm:pb-20">
				<span className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-medium text-caption text-neutral-900 shadow-sm">
					<PartnersIcon className="size-4" />
					{PILLARS.partners.label}
				</span>

				<div className="flex w-full flex-col">
					{/* Dashboard Preview Box */}
					<div className="mask-b-from-55% relative w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]">
						<video
							autoPlay
							className="aspect-[4/3] w-full rounded-xl bg-neutral-200 object-cover sm:aspect-[16/9]"
							loop
							muted
							playsInline
							preload="metadata"
							src={VIDEO}
						>
							<track kind="captions" />
						</video>
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
