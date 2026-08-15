"use client";

import { Globe } from "@edgecoms/ui/components/globe";
import { CreditCard, Package, Repeat } from "lucide-react";
import { Frame } from "@/components/landing/frame";
import { SCALE_STATS } from "@/lib/marketing-stats";

/* A mock of the event stream a merchant sees, not a live feed. The amounts are
   illustrative order values — the only numbers on this page that are not
   sourced from `marketing-stats`, because they are part of a drawn UI rather
   than a claim about Edge. */
const EVENTS = [
	{ detail: "🇺🇸 United States", icon: Package, label: "Bundle added" },
	{ detail: "🇩🇪 Germany", icon: Repeat, label: "Subscription started" },
	{ amount: "$184.00", icon: CreditCard, label: "New order" },
	{ amount: "$96.40", icon: CreditCard, label: "New order" },
] as const;

export function Scale() {
	return (
		<section className="relative w-full overflow-hidden border-neutral-200 border-b bg-[#F8FAFC]">
			<Frame>
				<div className="grid grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-4">
							<h2 className="font-medium text-[36px] text-neutral-900 leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
								Built to scale
							</h2>
							<p className="max-w-[400px] text-pretty text-[17px] text-neutral-500 leading-relaxed">
								Edge apps render on every product page, every cart and every
								checkout, for storefronts selling in every timezone. The
								infrastructure behind them is built for your best day, not your
								average one.
							</p>
						</div>

						<dl className="flex flex-col gap-6">
							{SCALE_STATS.map((stat) => (
								<div className="flex flex-col gap-1" key={stat.label}>
									<dt className="font-medium text-label text-neutral-400 uppercase tracking-widest">
										{stat.label}
									</dt>
									<dd className="font-medium font-mono text-[#F97316] text-h2 leading-none tracking-tight sm:text-h1">
										{stat.value}
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div className="relative hidden min-h-[520px] items-center justify-center lg:flex lg:justify-end">
						{/* 3D Magic UI Globe - Larger Size */}
						<div className="absolute top-1/2 right-0 flex size-[560px] -translate-y-1/2 items-center justify-center opacity-95 sm:-right-8 sm:size-[680px]">
							<Globe
								className="cursor-grab active:cursor-grabbing"
								config={{
									baseColor: [0.97, 0.97, 0.98],
									dark: 0,
									devicePixelRatio: 2,
									diffuse: 0.6,
									glowColor: [1, 1, 1],
									height: 1400,
									mapBrightness: 1.4,
									mapSamples: 24_000,
									markerColor: [249 / 255, 115 / 255, 22 / 255],
									markers: [
										{ location: [40.7128, -74.006], size: 0.08 },
										{ location: [51.5074, -0.1278], size: 0.08 },
										{ location: [35.6762, 139.6503], size: 0.08 },
										{ location: [1.3521, 103.8198], size: 0.08 },
										{ location: [-33.8688, 151.2093], size: 0.08 },
										{ location: [25.2048, 55.2708], size: 0.08 },
										{ location: [-23.5505, -46.6333], size: 0.08 },
									],
									phi: 0,
									theta: 0.2,
									width: 1400,
								}}
							/>
						</div>

						{/* Live Event Stream Stack (Overlaying Foreground - Shifted Lower) */}
						<div className="relative z-10 flex w-[210px] select-none flex-col gap-2.5 pt-16 pb-4 sm:pt-20">
							{EVENTS.map((event) => (
								<div
									className="flex select-none flex-col gap-1 rounded-xl border border-neutral-200 bg-white/95 p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md"
									key={
										"amount" in event
											? `${event.label}-${event.amount}`
											: `${event.label}-${event.detail}`
									}
								>
									<span className="flex items-center gap-1.5 font-medium text-label text-neutral-400">
										<event.icon
											aria-hidden="true"
											className="size-3 text-neutral-400"
										/>
										{event.label}
									</span>
									{"amount" in event ? (
										<div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-semibold text-caption text-neutral-900">
											<span className="size-1.5 rounded-full bg-[#F97316]" />
											{event.amount}
										</div>
									) : (
										<div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-medium text-caption text-neutral-800">
											{event.detail}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}
