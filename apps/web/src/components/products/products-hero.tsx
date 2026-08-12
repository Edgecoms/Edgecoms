import { Repeat, ShoppingBag, TrendingUp } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame, GridField } from "@/components/landing/frame";

/**
 * THE CONSTELLATION.
 *
 * The reference this borrows from tiles a wall of other people's results and
 * drops your own card into the middle of it. That works when the product is a
 * network — it says "look how many, and here is where you would sit".
 *
 * Edge is not a network, it is seven apps, so the wall is the apps and the card
 * in the middle is the store they act on. The dashed slot around the mark is
 * the whole argument in one detail: the apps already exist and are already
 * arranged, and the only thing missing is the merchant.
 *
 * Nothing here is interactive and nothing needs state, so it stays a server
 * component. The drift is CSS, disabled wholesale under `motion-reduce`.
 */

/* Hand-placed rather than distributed by formula, and placed against the 1080px
   frame rather than the viewport — the percentages below are of the column, so
   the field stays inside the rules at every width instead of drifting out past
   them on a wide screen.

   The card is 330px on a 1080px column, so the centre band from roughly 35% to
   65% is kept clear. No two icons share a row, which is what stops a scatter
   reading as a grid that went wrong.

   `delay` and `duration` are varied per icon for one reason: seven objects
   drifting on the same clock pulse in unison and read as a single breathing
   blob instead of seven separate things. */
const CONSTELLATION = [
	{
		delay: 0,
		duration: 7,
		left: "3%",
		size: 52,
		slug: "edge-bundles",
		top: "20%",
	},
	{
		delay: 1.4,
		duration: 8,
		left: "12%",
		size: 46,
		slug: "edge-cart",
		top: "60%",
	},
	{
		delay: 0.7,
		duration: 6.5,
		left: "22%",
		size: 50,
		slug: "edge-timer",
		top: "10%",
	},
	{
		delay: 2.1,
		duration: 7.5,
		left: "25%",
		size: 42,
		slug: "edge-reviews",
		top: "78%",
	},
	{
		delay: 0.3,
		duration: 8.5,
		left: "70%",
		size: 50,
		slug: "edge-currency",
		top: "14%",
	},
	{
		delay: 1.8,
		duration: 6.8,
		left: "78%",
		size: 52,
		slug: "edge-subscriptions",
		top: "66%",
	},
	{
		delay: 1.1,
		duration: 7.8,
		left: "89%",
		size: 46,
		slug: "trackproof",
		top: "30%",
	},
] as const;

/* Illustrative. These are the shape of a merchant's own dashboard, not a claim
   about Edge — but they are still numbers on a marketing page, so they live in
   one named list rather than inline in the markup. Swap them for a real
   (permissioned) store's readings, or leave them as the obvious mock they are. */
const STORE_STATS = [
	{
		icon: ShoppingBag,
		label: "Average order value",
		path: "M2 19 C 14 21, 22 9, 34 12 S 54 20, 66 11 S 86 5, 98 6",
		tone: "#F97316",
		value: "$62.40",
	},
	{
		icon: TrendingUp,
		label: "Revenue per visitor",
		path: "M2 15 C 16 7, 26 20, 38 15 S 58 5, 70 10 S 88 15, 98 4",
		tone: "#16A34A",
		value: "$1.94",
	},
	{
		icon: Repeat,
		label: "Repeat purchase rate",
		path: "M2 20 C 16 18, 24 11, 36 14 S 56 9, 68 14 S 86 7, 98 5",
		tone: "#7C3AED",
		value: "31%",
	},
] as const;

function StoreCard() {
	return (
		<div className="w-[300px] rounded-2xl border border-neutral-200 bg-white p-3 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.28)] sm:w-[330px]">
			{/* The banner is the three pillar accents in one sweep — the same orange,
			    green and purple the sections downstream are keyed to. */}
			<div className="h-[92px] w-full rounded-xl bg-[linear-gradient(110deg,#F97316_0%,#FBBF24_28%,#16A34A_58%,#7C3AED_100%)]" />

			<div className="relative -mt-7 flex items-end gap-2 px-1">
				{/* The empty slot, borrowed from the second reference: a dashed ring
				    around a mark that is not there yet. */}
				<span className="rounded-2xl border-2 border-neutral-300 border-dashed p-1">
					<span className="flex size-11 items-center justify-center rounded-xl bg-neutral-900 font-semibold text-[17px] text-white">
						E
					</span>
				</span>
				<span className="mb-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 font-medium text-[12px] text-neutral-900 shadow-sm">
					Your store
				</span>
			</div>

			<div className="mt-3 px-1">
				<p className="font-semibold text-[18px] text-neutral-900 tracking-tight">
					Your store
				</p>
				<p className="text-[12px] text-neutral-500">yourstore.myshopify.com</p>
			</div>

			<dl className="mt-3 divide-y divide-neutral-100 rounded-xl bg-neutral-50/70 px-3">
				{STORE_STATS.map((stat) => {
					const Icon = stat.icon;

					return (
						<div className="flex items-center gap-3 py-2.5" key={stat.label}>
							<span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500">
								<Icon aria-hidden="true" className="size-3.5" />
							</span>
							<span className="flex min-w-0 flex-col">
								<dt className="text-[11px] text-neutral-500">{stat.label}</dt>
								<dd className="font-semibold text-[14px] text-neutral-900">
									{stat.value}
								</dd>
							</span>
							<svg
								aria-hidden="true"
								className="ml-auto h-6 w-[76px] shrink-0"
								fill="none"
								viewBox="0 0 100 24"
							>
								<path
									d={stat.path}
									stroke={stat.tone}
									strokeLinecap="round"
									strokeWidth="2"
								/>
							</svg>
						</div>
					);
				})}
			</dl>
		</div>
	);
}

export function ProductsHero() {
	return (
		<section className="relative isolate w-full overflow-hidden bg-white">
			<GridField className="opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />

			<Frame>
				<div className="mx-auto flex w-full max-w-[820px] flex-col items-center gap-5 px-4 pt-16 pb-16 text-center sm:gap-6 sm:px-6 sm:pt-24 sm:pb-20">
					{/* Eyebrow pill */}
					<div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 shadow-2xs">
						<Image
							alt=""
							className="size-4 rounded object-contain"
							height={32}
							src="/app-icons/edge-bundles.webp"
							width={32}
						/>
						<span className="font-medium text-neutral-800 text-xs">
							Edge Apps
						</span>
					</div>

					{/* Headline */}
					<h1 className="text-balance font-semibold text-3xl text-neutral-900 leading-[1.15] tracking-tight sm:text-[48px] sm:leading-[1.1] lg:text-[56px]">
						Every app here
						<br />
						moves one number
					</h1>

					{/* Subhead */}
					<p className="max-w-md text-pretty text-neutral-500 text-sm leading-relaxed sm:max-w-[620px] sm:text-base sm:leading-normal">
						Revenue per visitor is conversion rate times average order value.
						Six of these lift one side of it, and the seventh proves it moved.{" "}
						<strong className="font-semibold text-neutral-900">
							Most have a free plan.
						</strong>
					</p>

					{/* CTA Button */}
					<div className="mt-2 sm:mt-3">
						<Link
							className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 font-medium text-white text-xs shadow-2xs transition-colors hover:bg-neutral-800 sm:px-5 sm:py-2.5 sm:text-sm"
							href={"/#apps" as Route}
						>
							Start with one app
						</Link>
					</div>
				</div>
			</Frame>

			{/* The stage lives inside the frame, not across the viewport. Bleeding
			    past the rules put icons out in the margin where the page has no
			    other content, and the field stopped reading as belonging to this
			    section at all. `overflow-hidden` is what actually enforces it: the
			    icons are positioned in percentages of this box, so anything that
			    rounds past an edge is clipped at the rule rather than crossing it. */}
			<Frame className="relative h-[380px] overflow-hidden sm:h-[460px]">
				{/* No grid of its own. The section's `GridField` already covers the top
				    of this box before its radial mask fades it out, and two grids on
				    different origins at different opacities read as a misprint rather
				    than as one surface. */}

				{/* Hidden below `md`: at 375px the icons would sit under the card
				    rather than around it, and a scatter with no room to scatter in is
				    just clutter behind the thing you are meant to read. */}
				<ul className="pointer-events-none absolute inset-0 hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] md:block">
					{CONSTELLATION.map((item) => (
						<li
							className="absolute animate-drift motion-reduce:animate-none"
							key={item.slug}
							style={{
								animationDelay: `${item.delay}s`,
								animationDuration: `${item.duration}s`,
								left: item.left,
								top: item.top,
							}}
						>
							<Image
								alt=""
								className="rounded-[22%] border border-neutral-200/70 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.28)]"
								height={128}
								src={`/app-icons/${item.slug}.webp`}
								style={{ height: item.size, width: item.size }}
								width={128}
							/>
						</li>
					))}
				</ul>

				<div className="absolute inset-0 flex items-start justify-center pt-6">
					<StoreCard />
				</div>
			</Frame>
		</section>
	);
}
