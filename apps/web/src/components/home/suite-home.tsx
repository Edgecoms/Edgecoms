import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { GridMarkers } from "@/components/home/grid-markers";
import BundlesDiagramFull from "@/components/home/products/edge-bundles";
import CartDiagram from "@/components/home/products/edge-cart";
import CurrencyDiagram from "@/components/home/products/edge-currency";
import ReviewsDiagram from "@/components/home/products/edge-reviews";
import SubscriptionsDiagram from "@/components/home/products/edge-subscriptions";
import TimerDiagram from "@/components/home/products/edge-timer";
import { EDGE_PRODUCTS } from "@/lib/products";

/* The bundles diagram is drawn at a fixed 615×665 and is the only one that
   needs scaling down to sit in a cell. Wrapper reserves the scaled box so it
   does not overlap the copy underneath. */
const BUNDLES_SCALE = 0.3;

function BundlesDiagram() {
	return (
		<div
			className="relative shrink-0"
			style={{ width: 615 * BUNDLES_SCALE, height: 665 * BUNDLES_SCALE }}
		>
			<div
				className="absolute top-0 left-0 origin-top-left"
				style={{ transform: `scale(${BUNDLES_SCALE})` }}
			>
				<BundlesDiagramFull />
			</div>
		</div>
	);
}

const DIAGRAMS: Record<string, ReactNode> = {
	"edge-bundles": <BundlesDiagram />,
	"edge-cart": <CartDiagram />,
	"edge-reviews": <ReviewsDiagram />,
	"edge-timer": <TimerDiagram />,
	"edge-currency": <CurrencyDiagram />,
	"edge-subscriptions": <SubscriptionsDiagram />,
};

export function SuiteHome() {
	return (
		<section aria-labelledby="suite-heading" className="relative w-full py-24">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a3)_1px,transparent_1px)] [background-size:22px_22px]"
			/>

			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-3 lg:gap-16">
				{/* Left rail. Sticks through the three rows of cards rather than
				    scrolling away at the top of a very tall grid. */}
				<div className="flex flex-col items-start gap-4 lg:sticky lg:top-24 lg:self-start">
					<h2
						className="text-balance font-medium text-h1 text-primary-foreground"
						id="suite-heading"
					>
						Six apps. One suite.
					</h2>
					<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
						No mega-app with forty half-finished features. Every Edge app is
						focused, fast, and native to your theme — and every one of them
						knows the others exist.
					</p>
					<Link
						className="text-body-sm text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
						href={"/products" as Route}
					>
						See what each app does in detail
					</Link>
				</div>

				<div className="relative lg:col-span-2">
					<div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2">
						{EDGE_PRODUCTS.map((product) => (
							<article className="flex flex-col" key={product.slug}>
								{/* Visual band sits on the page fill, copy sits on the
								    lighter surface — the two-tone is what separates the
								    mockup from its caption without another hairline. */}
								<div className="flex h-[260px] items-center justify-center overflow-hidden bg-bg px-6 py-8">
									{DIAGRAMS[product.slug]}
								</div>
								<div className="flex flex-1 flex-col gap-2 border-border border-t bg-page px-7 py-7">
									<h3 className="font-medium text-body text-primary-foreground">
										{product.name}
									</h3>
									<p className="text-pretty text-body-sm text-secondary-foreground leading-relaxed">
										{product.description}
									</p>
								</div>
							</article>
						))}
					</div>

					<GridMarkers cols={2} rows={3} />
				</div>
			</div>
		</section>
	);
}
