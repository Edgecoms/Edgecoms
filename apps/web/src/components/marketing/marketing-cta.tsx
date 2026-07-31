import { ButtonLink } from "@edgecoms/ui/components/button";
import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import type { ReactNode } from "react";
import { PanelTexture } from "@/components/home/panel-texture";
import { Highlight } from "@/components/ui/highlight";

export interface CtaAction {
	href: string;
	label: string;
}

export interface CtaRailItem {
	icon: LucideIcon;
	label: string;
}

interface MarketingCtaProps {
	body: string;
	/** Rendered under the panel — a nudge toward the other audience, not a second CTA. */
	footnote?: ReactNode;
	heading: string;
	primary: CtaAction;
	/** Marquee rail along the bottom edge. Omit to drop the rail entirely. */
	railItems?: readonly CtaRailItem[];
	secondary?: CtaAction;
	/** Decorative tiles scattered down both margins. Six reads best. */
	stickers?: readonly LucideIcon[];
}

/* The tiles sit in the clear margin either side of a fixed 42rem copy column,
   which on a 7xl panel is ~22% each side — so every position stays inside 15%,
   and the whole set is gated to xl where that margin exists. */
const STICKER_POSITIONS = [
	"left-[13%] top-[9%] rotate-6",
	"left-[4%] top-[26%] -rotate-12",
	"left-[15%] top-[40%] -rotate-6",
	"right-[9%] top-[9%] rotate-12",
	"right-[4%] top-[28%] rotate-6",
	"right-[14%] top-[42%] -rotate-6",
] as const;

/* Both marquee halves must render identical markup: the track animates to
   exactly -50%, so unequal halves would make the loop visibly jump. */
const STRIP_GROUP_CLASS = "flex shrink-0 items-center gap-12 pr-12";

function StripGroup({
	hidden = false,
	items,
}: {
	hidden?: boolean;
	items: readonly CtaRailItem[];
}) {
	return (
		<ul aria-hidden={hidden || undefined} className={STRIP_GROUP_CLASS}>
			{items.map((item) => {
				const Icon = item.icon;
				return (
					<li
						className="flex shrink-0 items-center gap-2.5 text-[15px] text-white"
						key={item.label}
					>
						<Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
						{item.label}
					</li>
				);
			})}
		</ul>
	);
}

/**
 * The closing brand panel, shared by every marketing page. Copy and actions are
 * props so each page ends on its own message without a second implementation of
 * the texture, glow, and rail.
 */
export function MarketingCta({
	heading,
	body,
	primary,
	secondary,
	railItems,
	stickers,
	footnote,
}: MarketingCtaProps) {
	return (
		<section aria-labelledby="cta-heading" className="w-full px-6 pb-24">
			<div className="relative isolate mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] bg-brand">
				<PanelTexture />
				{/* Warm glow: a bright narrow core anchored just past the bottom edge,
				    plus a wider soft halo. When a rail is present the glow stops at its
				    exact height, so it rises off the rail rather than washing out the
				    white text sitting on it. */}
				<div
					aria-hidden="true"
					className={`pointer-events-none absolute inset-x-0 h-1/2 bg-[radial-gradient(ellipse_34%_78%_at_50%_108%,rgba(255,232,178,0.95),transparent_68%),radial-gradient(ellipse_62%_62%_at_50%_112%,rgba(255,198,138,0.5),transparent_72%)] ${railItems ? "bottom-14" : "bottom-0"}`}
				/>

				{stickers ? (
					<div
						aria-hidden="true"
						className="pointer-events-none hidden xl:block"
					>
						{stickers.slice(0, STICKER_POSITIONS.length).map((Icon, index) => (
							<span
								className={`absolute grid size-16 place-items-center rounded-2xl border border-white/25 border-dashed bg-white/[0.06] ${STICKER_POSITIONS[index]}`}
								key={STICKER_POSITIONS[index]}
							>
								<Icon className="size-6 text-white/55" strokeWidth={1.5} />
							</span>
						))}
					</div>
				) : null}

				<div className="relative flex flex-col items-center gap-5 px-6 py-20 text-center sm:py-24">
					<h2
						className="max-w-3xl text-balance font-medium text-display text-white sm:text-display-lg"
						id="cta-heading"
					>
						<Highlight>{heading}</Highlight>
					</h2>

					<p className="max-w-2xl text-pretty text-body-lg text-white leading-relaxed">
						{body}
					</p>

					<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
						<ButtonLink
							className="h-11 rounded-full bg-white px-6 text-[15px] text-neutral-900 hover:bg-white/90 active:bg-white/90"
							href={primary.href as Route}
							size="xl"
							variant="secondary"
						>
							{primary.label}
						</ButtonLink>
						{secondary ? (
							<ButtonLink
								className="h-11 rounded-full border border-white/40 bg-white/10 px-6 text-[15px] text-white hover:bg-white/20 active:bg-white/20"
								href={secondary.href as Route}
								size="xl"
								variant="tertiary"
							>
								{secondary.label}
							</ButtonLink>
						) : null}
					</div>
				</div>

				{railItems ? (
					/* No scrim here, to match the reference where the rail is the same
					   fill as the panel. Consequence: white at 15px sits at 3.06:1 on
					   raw #ff5e1f, under the 4.5:1 AA bar for text this size. */
					<div className="relative overflow-hidden border-white/25 border-t py-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto">
						<div className="flex w-max animate-marquee-left motion-reduce:animate-none hover:[animation-play-state:paused]">
							<StripGroup items={railItems} />
							<StripGroup hidden items={railItems} />
						</div>
					</div>
				) : null}
			</div>

			{footnote ? (
				<p className="mx-auto mt-8 max-w-7xl text-pretty text-center text-body-sm text-secondary-foreground">
					{footnote}
				</p>
			) : null}
		</section>
	);
}
