import { GridMarkers } from "@/components/home/grid-markers";

const STEPS = [
	{
		description:
			"You already manage Shopify stores. Register the ones running Edge apps from your partner dashboard. No referral links, no tracking codes, nothing to place in a theme.",
		step: "01",
		title: "Register your merchants",
	},
	{
		description:
			"Edge reviews each merchant and approves you at an agreed rate. Apps the store was already paying for are recorded and excluded, so nobody earns on revenue they did not bring.",
		step: "02",
		title: "We approve and set your rate",
	},
	{
		description:
			"Every month a merchant stays subscribed, you earn a share of what Edge nets on their apps. Generated automatically, itemised per charge, paid on a clear schedule.",
		step: "03",
		title: "Earn for as long as they stay",
	},
] as const;

export function HowItWorks() {
	return (
		<section aria-labelledby="how-heading" className="relative w-full py-16">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a3)_1px,transparent_1px)] [background-size:22px_22px]"
			/>

			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-3 lg:gap-16">
				<div className="flex flex-col items-start gap-4 lg:sticky lg:top-24 lg:self-start">
					<h2
						className="text-balance font-medium text-h1 text-primary-foreground"
						id="how-heading"
					>
						How it works
					</h2>
					<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
						A real partnership, not a referral link. You register the merchants
						you already manage, and you are paid for the relationship over time.
					</p>
				</div>

				<div className="relative lg:col-span-2">
					<ol className="grid grid-cols-1 gap-px border border-border bg-border">
						{STEPS.map((item) => (
							<li
								className="flex flex-col gap-3 bg-bg p-8 sm:p-10"
								key={item.step}
							>
								<span className="font-medium text-body-sm text-brand">
									{item.step}
								</span>
								<h3 className="font-medium text-h3 text-primary-foreground">
									{item.title}
								</h3>
								<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{item.description}
								</p>
							</li>
						))}
					</ol>

					<GridMarkers cols={1} rows={3} />
				</div>
			</div>
		</section>
	);
}
