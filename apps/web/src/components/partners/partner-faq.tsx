import { GridMarkers } from "@/components/home/grid-markers";

/* The questions a partner asks before applying. Every answer states the rule
   the platform actually enforces — none of these are aspirational. */
const FAQS = [
	{
		answer:
			"They are grandfathered out. At approval we record every Edge app the store was already subscribed to, and those apps never generate commission, not now and not on future charges for them. You earn on what you bring.",
		question: "What if the store already pays for an Edge app?",
	},
	{
		answer:
			"Your rate is frozen onto each commission at the moment it is generated. Renegotiating changes what you earn going forward and never rewrites unpaid history, in either direction.",
		question: "What happens if my rate changes later?",
	},
	{
		answer:
			"Nothing is clawed back. Commission is generated per charge, so if a merchant cancels you simply stop earning new commission on them. Everything already generated stands.",
		question: "What if a merchant churns?",
	},
	{
		answer:
			"Merchants are keyed on their canonical myshopify.com domain, which is globally unique. The first partner approved for a store holds it, so two partners cannot both claim the same merchant.",
		question: "Can two partners claim the same store?",
	},
	{
		answer:
			"Every commission is itemised against the Shopify charge that produced it, visible in your dashboard as it is generated. You can reconcile a payout line by line rather than trusting a total.",
		question: "How do I know the numbers are right?",
	},
	{
		answer:
			"None. There is no minimum store count, no quota to keep your rate, and no expiry window to stay ahead of. Register one merchant or forty.",
		question: "What are the volume requirements?",
	},
] as const;

export function PartnerFaq() {
	return (
		<section aria-labelledby="faq-heading" className="w-full pb-16">
			<div className="mx-auto w-full max-w-7xl px-6">
				<div className="mx-auto flex max-w-2xl flex-col items-start gap-4 text-left sm:items-center sm:text-center">
					<h2
						className="text-balance font-medium text-h1 text-primary-foreground sm:text-display"
						id="faq-heading"
					>
						Before you apply
					</h2>
					<p className="text-pretty text-body text-secondary-foreground leading-relaxed sm:text-body-lg">
						The awkward questions, answered up front.
					</p>
				</div>

				<div className="relative mt-16">
					<dl className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
						{FAQS.map((faq) => (
							<div
								className="flex flex-col gap-2.5 bg-bg p-8 sm:p-10"
								key={faq.question}
							>
								<dt className="text-balance font-medium text-body text-primary-foreground">
									{faq.question}
								</dt>
								<dd className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{faq.answer}
								</dd>
							</div>
						))}
					</dl>

					<GridMarkers cols={2} rows={3} />
				</div>
			</div>
		</section>
	);
}
