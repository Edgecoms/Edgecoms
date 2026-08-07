import { Frame } from "@/components/landing/frame";
import { HOUSE_STATS } from "@/lib/marketing-stats";

/* Three, not four. The fourth house stat is a support-response time, which is a
   promise rather than a measure of scale and reads as filler next to two
   figures. EVERY NUMBER HERE IS STILL FLAGGED `invented` in marketing-stats.ts
   — replace them there, not here. */
const STATS = HOUSE_STATS.slice(0, 3);

/* Illustrative order feed. Amounts are small on purpose: a wall of $3,000
   orders would be the least believable thing on the page. */
const ORDERS = [
	{ amount: "$128.40", label: "New order" },
	{ amount: "$74.00", label: "New order" },
	{ amount: "$212.90", label: "New subscription" },
	{ amount: "$59.50", label: "New order" },
] as const;

export function Scale() {
	return (
		<section className="bg-white">
			<Frame className="border-neutral-200 border-t">
				<div className="grid grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-5">
							<h2 className="font-medium text-[36px] text-neutral-900 leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
								Built to scale
							</h2>
							<p className="max-w-[400px] text-pretty text-[17px] text-neutral-500 leading-relaxed">
								Every app runs as a Shopify App Block on the merchant&apos;s own
								storefront, loads asynchronously, and leaves nothing behind when
								it is uninstalled.
							</p>
						</div>

						<dl className="flex flex-col gap-7">
							{STATS.map((stat) => (
								<div className="flex flex-col gap-1" key={stat.label}>
									<dt className="font-medium text-[12px] text-neutral-500 uppercase tracking-[0.12em]">
										{stat.label}
									</dt>
									<dd className="font-mono text-[#F97316] text-[34px] leading-none tracking-[-0.02em] sm:text-[42px]">
										{stat.value}
									</dd>
								</div>
							))}
						</dl>
					</div>

					<div className="relative flex h-[380px] items-center justify-center">
						{/* Dotted sphere: a dot field masked to a circle, with a radial
						    shade so it reads as curved rather than as a flat disc. */}
						<div
							aria-hidden="true"
							className="absolute size-[340px] rounded-full bg-[radial-gradient(#d4d4d4_1.2px,transparent_1.2px)] [background-size:9px_9px] [mask-image:radial-gradient(circle_at_38%_32%,black_20%,rgba(0,0,0,0.35)_62%,transparent_78%)]"
						/>
						<div
							aria-hidden="true"
							className="absolute size-[340px] rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.9),transparent_60%)]"
						/>

						<ul className="relative ml-auto flex w-[210px] flex-col gap-2.5">
							{ORDERS.map((order) => (
								<li
									className="rounded-lg border border-neutral-200 bg-white p-2.5 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.2)]"
									key={order.amount}
								>
									<p className="text-[11px] text-neutral-500">{order.label}</p>
									<p className="mt-1.5 rounded-md border border-neutral-200 px-2 py-1 font-mono text-[13px] text-neutral-900">
										{order.amount}
									</p>
								</li>
							))}
						</ul>
					</div>
				</div>
			</Frame>
		</section>
	);
}
