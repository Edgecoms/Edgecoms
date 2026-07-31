import Image from "next/image";
import { Highlight } from "@/components/ui/highlight";
import { SHOW_PLACEHOLDER_PROOF } from "@/lib/marketing-stats";
import type { AppFeature } from "@/lib/products";

/**
 * The body of an app page: one full-width block per feature, image alternating
 * sides down the page.
 *
 * This replaces a six-up grid on purpose. A grid asks a merchant to read six
 * things at once and gives each of them a sentence; alternating blocks give
 * each feature a headline, a paragraph and a picture, and let the page be
 * scanned by the eyebrow column alone — which is a column of metrics, so the
 * scan itself does the qualifying.
 */

function FeatureVisual({ feature }: { feature: AppFeature }) {
	// A comp is withheld outside development, dropping the block back to the
	// metric panel in a production build. Assigning to a local rather than
	// testing the property inline is what lets TypeScript narrow it below.
	const withheld = feature.imageIsComp && !SHOW_PLACEHOLDER_PROOF;
	const image = withheld ? undefined : feature.image;

	if (image) {
		return (
			<Image
				alt={feature.title}
				className="h-auto w-full rounded-[2rem] border border-border object-cover"
				height={720}
				sizes="(max-width: 1024px) 100vw, 560px"
				src={image}
				width={960}
			/>
		);
	}

	/* No screenshot yet. The metric set large in an empty panel is a deliberate
	   stand-in rather than a grey box: it keeps the block's proportions honest
	   for layout, and it still says the one thing the block is about. */
	return (
		<div className="relative isolate flex min-h-[300px] items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-page p-10 lg:min-h-[380px] dark:bg-transparent">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_80%)]"
			/>
			<span className="text-balance text-center font-medium text-[var(--gray-8)] text-h1">
				{feature.metric}
			</span>
		</div>
	);
}

export function FeatureSections({
	features,
	title,
}: {
	features: readonly AppFeature[];
	title: string;
}) {
	return (
		<section aria-labelledby="features-heading" className="w-full py-16">
			<div className="mx-auto w-full max-w-7xl px-6">
				<h2
					className="max-w-3xl text-balance font-medium text-display text-primary-foreground"
					id="features-heading"
				>
					{title}
				</h2>

				<div className="mt-12 flex flex-col gap-16 lg:gap-20">
					{features.map((feature, index) => {
						const flipped = index % 2 === 1;
						return (
							<article
								className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
								key={feature.title}
							>
								<div
									className={`flex flex-col gap-4 ${flipped ? "lg:order-2" : ""}`}
								>
									<span className="font-medium font-mono text-brand text-label uppercase tracking-[0.12em]">
										{feature.metric}
									</span>
									<h3 className="max-w-lg text-balance font-medium text-display text-primary-foreground">
										<Highlight>{feature.title}</Highlight>
									</h3>
									<p className="max-w-md text-pretty text-body-lg text-secondary-foreground leading-relaxed">
										{feature.body}
									</p>
								</div>

								<div className={flipped ? "lg:order-1" : ""}>
									<FeatureVisual feature={feature} />
								</div>
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
