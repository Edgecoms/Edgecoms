import { ButtonLink } from "@edgecoms/ui/components/button";
import {
	Database,
	Gauge,
	LayoutDashboard,
	LifeBuoy,
	type LucideIcon,
	Repeat,
	Rocket,
	ShieldCheck,
	Sparkles,
	Unlink,
	Wallet,
} from "lucide-react";
import type { Route } from "next";

/* Decorative floating tiles echoing the scattered arrangement in the reference.
   The copy column is a fixed 42rem, so on a 7xl panel it leaves ~22% of clear
   margin each side — every tile therefore stays inside 15% to avoid colliding
   with the text, and the whole set is gated to xl where that margin exists. */
const STICKERS: readonly { icon: LucideIcon; className: string }[] = [
	{ icon: Wallet, className: "left-[13%] top-[9%] rotate-6" },
	{ icon: Database, className: "left-[4%] top-[26%] -rotate-12" },
	{ icon: Rocket, className: "left-[15%] top-[40%] -rotate-6" },
	{ icon: Gauge, className: "right-[9%] top-[9%] rotate-12" },
	{ icon: ShieldCheck, className: "right-[4%] top-[28%] rotate-6" },
	{ icon: Sparkles, className: "right-[14%] top-[42%] -rotate-6" },
];

const STRIP_ITEMS: readonly { icon: LucideIcon; label: string }[] = [
	{ icon: Repeat, label: "Recurring commission, every month" },
	{ icon: ShieldCheck, label: "Lifetime — no expiry windows" },
	{ icon: Unlink, label: "No referral links or tracking codes" },
	{ icon: LayoutDashboard, label: "One dashboard for merchants and payouts" },
	{ icon: LifeBuoy, label: "Priority partner support" },
];

/* Both marquee halves must render identical markup: the track animates to
   exactly -50%, so unequal halves would make the loop visibly jump. */
const STRIP_GROUP_CLASS = "flex shrink-0 items-center gap-12 pr-12";

function StripGroup({ hidden = false }: { hidden?: boolean }) {
	return (
		<ul aria-hidden={hidden || undefined} className={STRIP_GROUP_CLASS}>
			{STRIP_ITEMS.map((item) => {
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

export function CtaHome() {
	return (
		<section aria-labelledby="cta-heading" className="w-full px-6 pb-24">
			<div className="relative isolate mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] bg-brand">
				{/* Fine woven mesh — two 1px gratings at 4px pitch, which reads as
				    texture rather than as visible dots. */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:4px_4px]"
				/>
				{/* Warm glow: a bright narrow core anchored just past the bottom edge,
				    plus a wider soft halo. Kept low and tight so it lifts off the
				    bottom rail instead of washing out the brand fill. */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_34%_78%_at_50%_108%,rgba(255,232,178,0.95),transparent_68%),radial-gradient(ellipse_62%_62%_at_50%_112%,rgba(255,198,138,0.5),transparent_72%)]"
				/>

				<div aria-hidden="true" className="pointer-events-none hidden xl:block">
					{STICKERS.map(({ icon: Icon, className }) => (
						<span
							className={`absolute grid size-16 place-items-center rounded-2xl border border-white/25 border-dashed bg-white/[0.06] ${className}`}
							key={className}
						>
							<Icon className="size-6 text-white/55" strokeWidth={1.5} />
						</span>
					))}
				</div>

				<div className="relative flex flex-col items-center gap-5 px-6 py-20 text-center sm:py-24">
					<h2
						className="max-w-3xl text-balance font-medium text-display text-white sm:text-display-lg"
						id="cta-heading"
					>
						Start earning with Edge
					</h2>

					<p className="max-w-2xl text-pretty text-body-lg text-white leading-relaxed">
						Join the agencies and consultants earning recurring commission on
						every merchant they bring to Edge — no referral links, no tracking
						codes.
					</p>

					<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
						<ButtonLink
							className="h-11 rounded-full bg-white px-6 text-[15px] text-neutral-900 hover:bg-white/90 active:bg-white/90"
							href={"/register" as Route}
							size="xl"
							variant="secondary"
						>
							Apply to the program
						</ButtonLink>
						<ButtonLink
							className="h-11 rounded-full border border-white/40 bg-white/10 px-6 text-[15px] text-white hover:bg-white/20 active:bg-white/20"
							href={"/contact" as Route}
							size="xl"
							variant="tertiary"
						>
							Talk to us
						</ButtonLink>
					</div>
				</div>

				{/* No scrim here, to match the reference where the rail is the same
				    fill as the panel. Consequence: white at 15px sits at 3.06:1 on
				    raw #ff5e1f, under the 4.5:1 AA bar for text this size. */}
				<div className="relative overflow-hidden border-white/25 border-t py-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto">
					<div className="flex w-max animate-marquee-left motion-reduce:animate-none hover:[animation-play-state:paused]">
						<StripGroup />
						<StripGroup hidden />
					</div>
				</div>
			</div>
		</section>
	);
}
