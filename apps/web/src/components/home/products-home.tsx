import BundleFlowDiagram from "@/components/home/products/edge-bundles";
import CartDiagram from "@/components/home/products/edge-cart";
import CurrencyDiagram from "@/components/home/products/edge-currency";
import ReviewsDiagram from "@/components/home/products/edge-reviews";
import SubscriptionsDiagram from "@/components/home/products/edge-subscriptions";
import TimerDiagram from "@/components/home/products/edge-timer";
import { ProductCard } from "@/components/home/products/product-card";

const BUNDLES_SCALE = 0.34;

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
				<BundleFlowDiagram />
			</div>
		</div>
	);
}

export function ProductsHome() {
	return (
		<section className="relative w-full overflow-hidden">
			<div className="mx-auto flex min-h-[calc(100svh-var(--header-height))] w-full max-w-7xl flex-col justify-center px-6 py-20">
				{/* header */}
				<div className="grid items-start gap-y-6 lg:grid-cols-2 lg:gap-x-16">
					<div className="flex flex-col gap-5">
						<h2 className="text-balance font-medium text-display text-primary-foreground">
							Built for modern commerce.
						</h2>
					</div>

					<div className="flex lg:items-center lg:justify-end">
						<p className="max-w-md text-pretty text-body-lg text-secondary-foreground leading-relaxed">
							A growing suite of thoughtfully crafted Shopify apps designed to
							help merchants sell more, convert better, and grow with
							confidence.
						</p>
					</div>
				</div>

				{/* product grid — Vercel-style band: visuals up top, content below */}
				<div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
					<ProductCard
						description="Increase average order value with curated, ready-to-buy product bundles."
						diagram={<BundlesDiagram />}
						index={0}
						title="Edge Bundles"
					/>

					<ProductCard
						description="Create urgency naturally with countdowns that turn browsers into buyers."
						diagram={<TimerDiagram />}
						index={1}
						title="Edge Timer"
					/>

					<ProductCard
						description="Build trust with social proof from real, verified customer reviews."
						diagram={<ReviewsDiagram />}
						index={2}
						title="Edge Reviews"
					/>

					<ProductCard
						description="A faster cart experience that removes friction on the way to checkout."
						diagram={<CartDiagram />}
						index={3}
						title="Edge Cart"
					/>

					<ProductCard
						description="Sell globally with automatic local pricing and currency conversion."
						diagram={<CurrencyDiagram />}
						index={4}
						title="Edge Currency"
					/>

					<ProductCard
						description="Grow recurring revenue with flexible, merchant-friendly subscriptions."
						diagram={<SubscriptionsDiagram />}
						index={5}
						title="Edge Subscriptions"
					/>
				</div>
			</div>
		</section>
	);
}
