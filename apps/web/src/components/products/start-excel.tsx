import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";

/*
  The 7 unique Edge Apps, positioned with generous spacing.
  Plain white tile, zero padding, 48px size.
*/
const UNIQUE_EDGE_APPS = [
	{
		icon: "/app-icons/edge-bundles.webp",
		left: "64%",
		name: "Edge Bundles",
		top: "12%",
	},
	{
		icon: "/app-icons/edge-cart.webp",
		left: "24%",
		name: "Edge Cart",
		top: "28%",
	},
	{
		icon: "/app-icons/edge-timer.webp",
		left: "46%",
		name: "Edge Timer",
		top: "28%",
	},
	{
		icon: "/app-icons/edge-subscriptions.webp",
		left: "76%",
		name: "Edge Subscriptions",
		top: "28%",
	},
	{
		icon: "/app-icons/trackproof.webp",
		left: "34%",
		name: "Trackproof",
		top: "50%",
	},
	{
		icon: "/app-icons/edge-reviews.webp",
		left: "66%",
		name: "Edge Reviews",
		top: "50%",
	},
	{
		icon: "/app-icons/edge-currency.webp",
		left: "50%",
		name: "Edge Currency",
		top: "72%",
	},
] as const;

export function StartExcel() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-neutral-50/70 overflow-hidden">
			<Frame className="relative min-h-[440px] sm:min-h-[480px]">
				{/* Right-side radial masked grid background */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[60%] bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]"
				/>

				<div className="relative z-10 grid grid-cols-1 items-center px-6 py-14 sm:px-8 sm:py-20 md:grid-cols-12 min-h-[440px] sm:min-h-[480px] gap-8">
					{/* Left Column: Headline and CTA button */}
					<div className="flex flex-col justify-center items-start md:col-span-5 z-20">
						<h2 className="font-bold font-satoshi text-3xl text-neutral-900 leading-[1.1] tracking-tight sm:text-4xl">
							Start where great
							<br />
							companies excel
						</h2>
						<p className="mt-3 text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-sm">
							Kickstart your partner program on the platform trusted by the
							world's fastest-growing companies.
						</p>

						{/* Black CTA Pill Button */}
						<div className="mt-6">
							<Link
								className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2.5 font-medium text-xs text-white shadow-xs transition-all hover:bg-neutral-800 hover:shadow-md sm:text-sm"
								href={"/#apply" as Route}
							>
								Apply now
							</Link>
						</div>
					</div>

					{/* Right Column: 7 Unique Edge App Icons (48px size, no duplicates, zero padding) */}
					<div className="relative h-[340px] sm:h-[380px] w-full md:col-span-7">
						{UNIQUE_EDGE_APPS.map((app) => (
							<div
								className="absolute transition-transform duration-300 hover:scale-110 cursor-pointer z-10"
								key={app.name}
								style={{
									left: app.left,
									top: app.top,
								}}
							>
								<div className="size-14 sm:size-[65px] rounded-[16px] bg-white p-0 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.18)] border border-neutral-200/80 overflow-hidden flex items-center justify-center">
									<Image
										alt={app.name}
										className="size-full object-cover rounded-[16px]"
										height={48}
										src={app.icon}
										width={48}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</Frame>
		</section>
	);
}
