import { Plus } from "lucide-react";
import type { AppFaq } from "@/lib/products";

/**
 * Native `<details>` rather than a JS accordion: it is keyboard-operable and
 * screen-reader-correct for free, it works before hydration, and the answers
 * are in the DOM for search engines whether or not anyone opens them.
 */
export function FaqList({
	items,
	title = "Questions people ask first",
}: {
	items: readonly AppFaq[];
	title?: string;
}) {
	return (
		<section aria-labelledby="faq-heading" className="w-full py-24">
			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-3 lg:gap-16">
				<h2
					className="text-balance font-medium text-h1 text-primary-foreground lg:sticky lg:top-24 lg:self-start"
					id="faq-heading"
				>
					{title}
				</h2>

				<div className="flex flex-col border-border border-t lg:col-span-2">
					{items.map((item) => (
						<details
							className="group border-border border-b"
							key={item.question}
						>
							<summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-pretty py-5 font-medium text-body text-primary-foreground marker:content-none hover:text-brand focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
								{item.question}
								<Plus
									aria-hidden="true"
									className="mt-0.5 size-4 shrink-0 text-secondary-foreground transition-transform duration-200 group-open:rotate-45"
									strokeWidth={1.5}
								/>
							</summary>
							<p className="max-w-2xl text-pretty pb-6 text-body-sm text-secondary-foreground leading-relaxed">
								{item.answer}
							</p>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}
