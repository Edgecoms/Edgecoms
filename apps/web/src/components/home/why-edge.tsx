import type { LucideIcon } from "lucide-react";
import { Check, ReceiptText, Shapes, Share2 } from "lucide-react";
import { GridMarkers } from "@/components/home/grid-markers";
import { PanelTexture } from "@/components/home/panel-texture";
import { Highlight } from "@/components/ui/highlight";

/* Left panel: what running six point solutions actually feels like. The pile
   is built from normal flow — each card only tilts and shifts off centre — so
   it cannot collide with the heading or need re-tuning per breakpoint. */
const FRICTIONS: readonly { label: string; note?: string; tilt: string }[] = [
	{
		label: "Theme update broke the cart drawer",
		note: "Unresolved",
		tilt: "-rotate-2 sm:-translate-x-5",
	},
	{
		label: "5 invoices, 5 renewal dates",
		tilt: "rotate-1 sm:translate-x-6",
	},
	{
		label: "Which vendor owns this bug?",
		tilt: "-rotate-1 sm:-translate-x-2",
	},
	{
		label: "Six app scripts on every page load",
		tilt: "rotate-2 sm:translate-x-4",
	},
	{
		label: "Review widget doesn't match the brand",
		tilt: "-rotate-1 sm:-translate-x-6",
	},
	{
		label: "4 support inboxes, 4 different SLAs",
		note: "Waiting",
		tilt: "rotate-2 sm:translate-x-3",
	},
] as const;

const PILLARS: readonly {
	description: string;
	icon: LucideIcon;
	title: string;
}[] = [
	{
		icon: ReceiptText,
		title: "One dashboard, seven apps",
		description:
			"One login, one bill on the Shopify invoice you already get, one support thread. No separate checkout, no new card on file, no vendor emailing you about a failed payment method.",
	},
	{
		icon: Shapes,
		title: "No theme surgery",
		description:
			"Everything ships as a Shopify App Block. Install it, drag it where you want it, done. Uninstalling leaves zero code behind in your theme.",
	},
	{
		icon: Share2,
		title: "Built by operators, not an app studio",
		description:
			"We run our own Shopify stores. Every feature here shipped because our own average order value needed it first, which is also why none of them ship with forty settings nobody uses.",
	},
] as const;

export function WhyEdge() {
	return (
		<section aria-labelledby="why-heading" className="relative w-full pb-10">
			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="mx-auto flex max-w-2xl flex-col items-start gap-4 text-left sm:items-center sm:text-center">
					<h2
						className="text-balance font-medium text-h1 text-primary-foreground sm:text-display"
						id="why-heading"
					>
						<Highlight>Why merchants install the second one</Highlight>
					</h2>
					<p className="text-pretty text-body text-secondary-foreground leading-relaxed sm:text-body-lg">
						Every app you add is another script, another subscription, another
						inbox, and another thing that breaks the next time you change
						themes. That tax is why most stores stop at one. Edge is one team's
						answer to it.
					</p>
				</div>

				{/* Before / after. Equal halves so neither side reads as the aside. */}
				<div className="mt-10 grid grid-cols-1 overflow-hidden rounded-[2rem] border border-border lg:grid-cols-2">
					{/* before — mirrors the "after" half exactly: dotted texture,
					    centred heading, one stack of cards underneath. */}
					<div className="relative isolate flex min-h-[420px] flex-col items-center justify-center gap-8 bg-bg p-8 sm:p-10 lg:min-h-[560px]">
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:20px_20px]"
						/>

						<h3 className="relative text-balance text-center font-medium text-h1 text-primary-foreground">
							Six apps from six vendors
						</h3>

						<ul className="relative flex w-full max-w-sm flex-col gap-2">
							{FRICTIONS.map((friction) => (
								<li
									className={`rounded-xl border border-border bg-page px-3.5 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.04)] ${friction.tilt}`}
									key={friction.label}
								>
									<div className="flex items-start gap-2">
										<span
											aria-hidden="true"
											className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
										/>
										<div className="flex flex-col gap-0.5">
											<span className="text-caption text-primary-foreground leading-snug">
												{friction.label}
											</span>
											{friction.note ? (
												<span className="font-medium text-[10px] text-secondary-foreground uppercase tracking-[0.1em]">
													{friction.note}
												</span>
											) : null}
										</div>
									</div>
								</li>
							))}
						</ul>
					</div>

					{/* after */}
					<div className="relative isolate flex min-h-[420px] flex-col items-center justify-center gap-8 overflow-hidden bg-brand p-8 sm:p-10 lg:min-h-[560px]">
						<PanelTexture />
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_40%_80%_at_50%_112%,rgba(255,232,178,0.9),transparent_70%)]"
						/>

						<h3 className="relative text-balance text-center font-medium text-h1 text-white">
							One Edge suite
						</h3>

						<ul className="relative flex w-full max-w-sm flex-col gap-2">
							{[
								"One invoice, one renewal date",
								"One team on the hook for every bug",
								"One support inbox, one SLA",
								"One design language across every surface",
							].map((line) => (
								<li
									className="flex items-center gap-2.5 rounded-xl border border-white/25 bg-white/10 px-3.5 py-2.5 text-[13px] text-white"
									key={line}
								>
									<Check aria-hidden="true" className="size-4 shrink-0" />
									{line}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Supporting pillars, hairline grid with the blueprint markers. */}
				<div className="relative mt-16">
					<div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
						{PILLARS.map((pillar) => {
							const Icon = pillar.icon;
							return (
								<div
									className="flex flex-col gap-3 bg-bg p-8 sm:p-10"
									key={pillar.title}
								>
									<Icon
										aria-hidden="true"
										className="size-6 text-primary-foreground"
										strokeWidth={1.5}
									/>
									<h3 className="text-balance font-medium text-body text-primary-foreground">
										{pillar.title}
									</h3>
									<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
										{pillar.description}
									</p>
								</div>
							);
						})}
					</div>

					<GridMarkers cols={3} rows={1} />
				</div>
			</div>
		</section>
	);
}
