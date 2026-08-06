import { Check, X } from "lucide-react";
import { PanelTexture } from "@/components/home/panel-texture";

/* Matched pairs, read across. Every Edge row is a rule enforced in the data
   layer, not a promise made in marketing copy. */
const ROWS = [
	{
		edge: "Register the stores you already manage",
		typical: "Referral links to place and babysit",
	},
	{
		edge: "Lifetime, while the merchant stays subscribed",
		typical: "30-day attribution window",
	},
	{
		edge: "Your rate is frozen onto every commission at generation",
		typical: "Rate changes quietly rewrite unpaid history",
	},
	{
		edge: "Every commission itemised in your dashboard",
		typical: "Chase the vendor for payout numbers",
	},
	{
		edge: "Apps the store already paid for are excluded up front",
		typical: "You earn on revenue you did not bring, until they claw it back",
	},
] as const;

export function ProgramCompare() {
	return (
		<section aria-labelledby="compare-heading" className="w-full pb-16">
			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="mx-auto flex max-w-2xl flex-col items-start gap-4 text-left sm:items-center sm:text-center">
					<h2
						className="text-balance font-medium text-h1 text-primary-foreground sm:text-display"
						id="compare-heading"
					>
						Not an affiliate scheme
					</h2>
					<p className="text-pretty text-body text-secondary-foreground leading-relaxed sm:text-body-lg">
						Most programs pay you for a click and stop paying the moment a
						window closes. This one pays you for the relationship you already
						have, and keeps paying.
					</p>
				</div>

				<div className="mt-12 grid grid-cols-1 overflow-hidden rounded-[2rem] border border-border lg:grid-cols-2">
					{/* typical */}
					<div className="relative isolate flex flex-col bg-bg p-8 sm:p-10">
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:20px_20px]"
						/>
						<h3 className="font-medium text-h2 text-primary-foreground">
							A typical affiliate program
						</h3>
						<ul className="mt-8 flex flex-col gap-4">
							{ROWS.map((row) => (
								<li className="flex items-start gap-3" key={row.typical}>
									<span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-border bg-page">
										<X
											aria-hidden="true"
											className="size-3 text-secondary-foreground"
											strokeWidth={2}
										/>
									</span>
									<span className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
										{row.typical}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* edge */}
					<div className="relative isolate flex flex-col overflow-hidden bg-brand p-8 sm:p-10">
						<PanelTexture />
						<div
							aria-hidden="true"
							className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_40%_80%_at_50%_112%,rgba(255,232,178,0.9),transparent_70%)]"
						/>

						<h3 className="relative font-medium text-h2 text-white">
							The Edge partner program
						</h3>
						<ul className="relative mt-8 flex flex-col gap-4">
							{ROWS.map((row) => (
								<li className="flex items-start gap-3" key={row.edge}>
									<span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-white/40 bg-white/15">
										<Check
											aria-hidden="true"
											className="size-3 text-white"
											strokeWidth={2.5}
										/>
									</span>
									<span className="text-pretty text-body-sm text-white leading-relaxed">
										{row.edge}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
