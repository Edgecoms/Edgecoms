"use client";

import { cn } from "@edgecoms/ui/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { PILLARS, type PillarKey } from "@/components/landing/frame";

/* One screenshot per pillar, all of them our own app UI. The partner tab shows
   the subscriptions dashboard because the partner portal has no shot yet —
   swap it the moment there is one, but never for a competitor's feature image:
   that is their copyright and a claim their UI is ours. */
const TABS: readonly {
	alt: string;
	key: PillarKey;
	src: string;
}[] = [
	{
		alt: "Building a volume-tier bundle offer in the Edge Bundles dashboard",
		key: "apps",
		src: "/app-shots/bundles-builder.avif",
	},
	{
		alt: "Per-offer revenue and conversion reporting in Edge Bundles",
		key: "results",
		src: "/app-shots/bundles-analytics.avif",
	},
	{
		alt: "Recurring revenue and subscriber analytics in Edge Subscriptions",
		key: "partners",
		src: "/app-shots/subs-analytics.png",
	},
];

export function ProductPreview() {
	const [active, setActive] = useState<PillarKey>("apps");
	const tab = TABS.find((item) => item.key === active) ?? TABS[0];

	return (
		<section className="relative bg-white pb-20">
			{/* The pill row overlaps the panel below it, which is what stops the
			    switcher reading as a toolbar floating in its own band. */}
			<div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-center gap-2 px-6">
				{TABS.map((item) => {
					const pillar = PILLARS[item.key];
					const isActive = item.key === active;

					return (
						<button
							aria-pressed={isActive}
							className={cn(
								"flex items-center gap-2 rounded-lg border px-3.5 py-2 font-medium text-[14px] transition-colors",
								isActive
									? "border-neutral-200 bg-white text-neutral-900 shadow-sm"
									: "border-transparent text-neutral-500 hover:text-neutral-900"
							)}
							key={item.key}
							onClick={() => setActive(item.key)}
							type="button"
						>
							<Image
								alt=""
								className="size-[18px] rounded-[5px]"
								height={64}
								src={pillar.icon}
								width={64}
							/>
							{pillar.label}
						</button>
					);
				})}
			</div>

			<div className="mx-auto mt-8 w-full max-w-[1080px] px-6">
				<div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-[0_16px_50px_-20px_rgba(0,0,0,0.2)]">
					<div className="flex items-center gap-2 border-neutral-200 border-b bg-white px-4 py-3">
						<span className="size-2.5 rounded-full bg-neutral-200" />
						<span className="size-2.5 rounded-full bg-neutral-200" />
						<span className="size-2.5 rounded-full bg-neutral-200" />
						<span className="mx-auto rounded-md bg-neutral-100 px-3 py-1 text-[12px] text-neutral-500">
							admin.shopify.com
						</span>
					</div>

					<div className="relative aspect-[16/9] w-full">
						<Image
							alt={tab.alt}
							className="object-cover object-top"
							fill
							priority
							sizes="(max-width: 1080px) 100vw, 1080px"
							src={tab.src}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
