import { cn } from "@edgecoms/ui/lib/utils";
import { CalendarDays } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";

/**
 * PLACEHOLDER CHANGELOG. Same rule as `marketing-stats.ts`: nothing below has
 * shipped on these dates, and this list exists so the section can be laid out
 * now. Replace it with the real release history — or delete the section — before
 * launch. A changelog is the one block on a marketing page a developer will
 * actually check against the App Store listing.
 */
const RELEASES = [
	{ date: "Jul 30, 2026", title: "Per-app partner commission rates" },
	{ date: "Jul 10, 2026", title: "Bundle offers with a built-in countdown" },
	{ date: "Jul 6, 2026", title: "Server-side conversions for TikTok" },
	{ date: "Jun 22, 2026", title: "Free-shipping progress in the cart drawer" },
	{ date: "Jun 11, 2026", title: "Photo reviews with moderation queue" },
] as const;

export function ShipFast() {
	return (
		<section className="bg-white">
			<Frame className="border-neutral-200 border-t">
				<div className="grid grid-cols-1 lg:grid-cols-2">
					<div className="flex flex-col gap-5 px-6 py-16 lg:py-24">
						<h2 className="font-medium text-[36px] text-neutral-900 italic leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
							We ship fast
						</h2>
						<p className="max-w-[380px] text-pretty text-[17px] text-neutral-500 leading-relaxed">
							Always improving, adding features and functionality.
						</p>
						<Link
							className="mt-2 inline-flex h-10 w-fit items-center rounded-lg border border-neutral-200 bg-white px-5 font-medium text-[15px] text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
							href={"/products" as Route}
						>
							Full changelog
						</Link>
					</div>

					{/* The rail is drawn on the list rather than per item, so it is one
					    continuous line instead of five stacked segments with hairline
					    gaps where the rows meet. */}
					<ol className="relative border-neutral-200 lg:border-l">
						<span
							aria-hidden="true"
							className="absolute top-12 bottom-12 left-[calc(1.5rem+1.25rem)] w-px bg-neutral-200"
						/>

						{RELEASES.map((release, index) => (
							<li
								className={cn(
									"relative flex items-center gap-4 px-6 py-6 transition-colors hover:bg-neutral-50",
									index > 2 && "opacity-45"
								)}
								key={release.title}
							>
								<span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500">
									<CalendarDays aria-hidden="true" className="size-4" />
								</span>
								<span className="flex flex-col gap-1">
									<span className="font-medium text-[16px] text-neutral-900">
										{release.title}
									</span>
									<span className="text-[13px] text-neutral-500">
										{release.date}
									</span>
								</span>
							</li>
						))}
					</ol>
				</div>
			</Frame>
		</section>
	);
}
