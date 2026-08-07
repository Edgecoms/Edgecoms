import {
	BadgePercent,
	BarChart3,
	CalendarClock,
	Coins,
	Globe,
	Layers,
	Package,
	Repeat,
	ShoppingCart,
	Star,
	Timer,
	Truck,
} from "lucide-react";
import type { ComponentType } from "react";

/**
 * The capability field: everything the suite does, laid out as a grid with the
 * promise sitting in the middle of it.
 *
 * Deliberately wider than the frame. It is masked at both edges instead of
 * being made to fit, because a field that visibly continues past the cut reads
 * as "and more" without a line of copy saying so — and because shrinking it to
 * fit 375px would put twelve labels at six pixels.
 */
interface Tile {
	icon: ComponentType<{ className?: string }>;
	label: string;
	/** 0-based cell in the 7×5 grid. */
	slot: number;
	tone: string;
}

const TILES: readonly Tile[] = [
	{ icon: CalendarClock, label: "Scheduling", slot: 2, tone: "#F97316" },
	{ icon: Timer, label: "Countdown", slot: 3, tone: "#F97316" },
	{ icon: Layers, label: "Volume tiers", slot: 9, tone: "#16A34A" },
	{ icon: Package, label: "Bundles", slot: 10, tone: "#16A34A" },
	{ icon: Truck, label: "Free shipping bar", slot: 11, tone: "#16A34A" },
	{ icon: ShoppingCart, label: "Cart upsells", slot: 15, tone: "#7C3AED" },
	{ icon: Globe, label: "Multi-currency", slot: 19, tone: "#7C3AED" },
	{ icon: Star, label: "Photo reviews", slot: 23, tone: "#F97316" },
	{ icon: Repeat, label: "Auto refill", slot: 24, tone: "#F97316" },
	{ icon: BarChart3, label: "Offer analytics", slot: 25, tone: "#16A34A" },
	{ icon: BadgePercent, label: "Free plans", slot: 30, tone: "#a3a3a3" },
	{ icon: Coins, label: "Server-side events", slot: 31, tone: "#a3a3a3" },
];

const CELLS = 35;
const CENTRE_SLOT = 17;

export function AppsField() {
	return (
		<div className="relative overflow-hidden py-10">
			<div className="mx-auto grid w-[860px] grid-cols-7 gap-3 px-4 [mask-image:radial-gradient(ellipse_62%_78%_at_50%_50%,black_45%,transparent)]">
				{Array.from({ length: CELLS }, (_, index) => {
					const tile = TILES.find((item) => item.slot === index);

					if (index === CENTRE_SLOT) {
						return (
							<div
								className="flex h-[68px] items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.25)]"
								key="centre"
							>
								<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 font-semibold text-[11px] text-white">
									E
								</span>
								<span className="whitespace-nowrap font-medium text-[13px] text-neutral-900">
									Higher AOV
								</span>
							</div>
						);
					}

					if (!tile) {
						return (
							<div
								className="h-[68px] rounded-lg border border-neutral-200/70"
								key={`empty-${index}`}
							/>
						);
					}

					const Icon = tile.icon;

					return (
						<div
							className="flex h-[68px] flex-col items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-1"
							key={tile.label}
						>
							<Icon aria-hidden="true" className="size-4" />
							<span className="text-center text-[11px] text-neutral-600 leading-tight">
								{tile.label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
