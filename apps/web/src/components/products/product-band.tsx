import { ArrowRight, Check } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { DIAGRAMS } from "@/components/home/products/diagrams";
import { AppIcon } from "@/components/ui/app-icon";
import { Highlight } from "@/components/ui/highlight";
import { APP_RESULT_BADGES } from "@/lib/marketing-stats";
import type { EdgeProduct } from "@/lib/products";

/** Four is enough to show the shape of the app without previewing its whole page. */
const BULLET_COUNT = 4;

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
	const badge = APP_RESULT_BADGES[product.slug];
	const bullets = product.features.slice(0, BULLET_COUNT);

	return (
		<section
			aria-labelledby={`${product.slug}-heading`}
			className="w-full scroll-mt-24 border-border border-t"
			id={product.slug}
		>
			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-20">
				<div className={`flex flex-col gap-5 ${flipped ? "lg:order-2" : ""}`}>
					<div className="flex flex-wrap items-center gap-2">
						<span className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.1em]">
							{product.category}
						</span>
						{badge ? (
							<span className="rounded-full bg-brand/12 px-2.5 py-1 font-medium font-mono text-[11px] text-brand uppercase tracking-[0.08em]">
								{badge.value}
							</span>
						) : null}
					</div>

					<h2
						className="flex items-center gap-3 font-medium text-h1 text-primary-foreground"
						id={`${product.slug}-heading`}
					>
						<AppIcon product={product} size="md" />
						{product.name}
					</h2>

					<p className="text-pretty text-body-lg text-primary-foreground leading-relaxed">
						<Highlight>{product.tagline}</Highlight>
					</p>
					<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
						{product.heroLead}
					</p>

					<ul className="mt-2 flex flex-col gap-2.5">
						{bullets.map((feature) => (
							<li className="flex items-start gap-2.5" key={feature.title}>
								<span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-brand/12">
									<Check
										aria-hidden="true"
										className="size-3 text-brand"
										strokeWidth={2.5}
									/>
								</span>
								<span className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
									{feature.title}
									<span className="text-secondary-foreground">
										{" "}
										— {feature.metric}
									</span>
								</span>
							</li>
						))}
					</ul>

					<Link
						className="group mt-2 inline-flex w-fit items-center gap-1.5 text-body-sm text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
						href={`/products/${product.slug}` as Route}
					>
						See {product.name} in full
						<ArrowRight
							aria-hidden="true"
							className="size-3.5 transition-transform group-hover:translate-x-0.5"
						/>
					</Link>
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
