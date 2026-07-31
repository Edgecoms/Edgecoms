import { Check } from "lucide-react";
import { DIAGRAMS } from "@/components/home/products/diagrams";
import type { EdgeProduct } from "@/lib/products";

/**
 * One full-width band per app: illustration on one side, copy on the other,
 * alternating direction down the page.
 *
 * The illustrations are drawn at ~250px for grid cells, so they are scaled up
 * with a transform here rather than redrawn — they are DOM and SVG, so they
 * stay crisp, and the band reserves enough height that nothing clips.
 */
export function ProductBand({
	flipped,
	product,
}: {
	flipped: boolean;
	product: EdgeProduct;
}) {
	return (
		<section
			aria-labelledby={`${product.slug}-heading`}
			className="w-full scroll-mt-24 border-border border-t"
			id={product.slug}
		>
			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-20">
				<div className={`flex flex-col gap-5 ${flipped ? "lg:order-2" : ""}`}>
					<span className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.1em]">
						{product.category}
					</span>
					<h2
						className="font-medium text-h1 text-primary-foreground"
						id={`${product.slug}-heading`}
					>
						{product.name}
					</h2>
					<p className="text-pretty text-body-lg text-primary-foreground leading-relaxed">
						{product.tagline}
					</p>
					<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
						{product.description}
					</p>

					<ul className="mt-2 flex flex-col gap-2.5">
						{product.capabilities.map((capability) => (
							<li className="flex items-start gap-2.5" key={capability}>
								<span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-brand/12">
									<Check
										aria-hidden="true"
										className="size-3 text-brand"
										strokeWidth={2.5}
									/>
								</span>
								<span className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{capability}
								</span>
							</li>
						))}
					</ul>
				</div>

				<div
					className={`relative isolate flex min-h-[420px] items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-bg ${flipped ? "lg:order-1" : ""}`}
				>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_80%)]"
					/>
					<div className="scale-110 sm:scale-125 lg:scale-[1.35]">
						{DIAGRAMS[product.slug]}
					</div>
				</div>
			</div>
		</section>
	);
}
