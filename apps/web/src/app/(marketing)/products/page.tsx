import { ButtonLink } from "@edgecoms/ui/components/button";
import {
	Globe,
	LifeBuoy,
	Package,
	Palette,
	Repeat,
	ShoppingCart,
	Star,
	Store,
	Timer,
	Zap,
} from "lucide-react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import {
	type CtaRailItem,
	MarketingCta,
} from "@/components/marketing/marketing-cta";
import { BetterTogether } from "@/components/products/better-together";
import { ProductBand } from "@/components/products/product-band";
import { AppIcon } from "@/components/ui/app-icon";
import { Highlight } from "@/components/ui/highlight";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
import { APP_RESULT_BADGES } from "@/lib/marketing-stats";
import { EDGE_PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
	title: "Products · Edge",
	description:
		"Seven focused Shopify apps: bundles, cart, timer, reviews, currency, subscriptions, and server-side tracking. Each one owns a single metric, each works on its own, and most of them are free to start.",
};

const STICKERS = [Package, ShoppingCart, Star, Timer, Globe, Repeat] as const;

const RAIL_ITEMS: readonly CtaRailItem[] = [
	{ icon: Store, label: "Billed on the Shopify invoice you already get" },
	{ icon: Zap, label: "Live in minutes, no developer" },
	{ icon: Palette, label: "Works with any OS 2.0 theme" },
	{ icon: LifeBuoy, label: "One team, one support inbox" },
	{ icon: Repeat, label: "Start with one app, add the rest anytime" },
];

export default function ProductsPage() {
	return (
		<>
			<section className="relative isolate w-full overflow-hidden">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--gray-a4)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_40%,black_25%,transparent_78%)]"
				/>

				<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 pt-24 pb-14 text-center sm:gap-8">
					<p className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]">
						The Edge suite
					</p>
					<h1 className="text-balance font-medium text-display text-primary-foreground sm:text-display-lg">
						Pick the lever you need.
					</h1>
					<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
						Seven apps, each one owning a single number. Run one or run all
						seven. They are built by one team, on one bill, and they know about
						each other.
					</p>
					<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
						<ButtonLink
							className="h-11 rounded-full px-6 text-[15px]"
							href={BOOKING_URL as Route}
							rel="noopener"
							size="xl"
							target="_blank"
							variant="brand"
						>
							{BOOKING_LABEL}
						</ButtonLink>
						<ButtonLink
							className="h-11 rounded-full px-6 text-[15px]"
							href={"/products#better-together" as Route}
							size="xl"
							variant="secondary"
						>
							See how they fit together
						</ButtonLink>
					</div>
				</div>
			</section>

			{/* The scannable index. A merchant who already knows which number is
			    their problem should be able to leave for the right app page from
			    here, without scrolling seven bands to find it. */}
			<section aria-labelledby="index-heading" className="w-full pb-16">
				<div className="mx-auto w-full max-w-7xl px-6">
					<h2 className="sr-only" id="index-heading">
						Every app and the metric it owns
					</h2>
					<ul className="flex flex-col border-border border-t">
						{EDGE_PRODUCTS.map((product) => {
							const badge = APP_RESULT_BADGES[product.slug];
							return (
								<li className="border-border border-b" key={product.slug}>
									<Link
										className="group grid grid-cols-1 items-baseline gap-2 py-5 transition-colors hover:bg-page sm:grid-cols-12 sm:gap-6 sm:px-4"
										href={`/products/${product.slug}` as Route}
									>
										<span className="flex items-center gap-2.5 font-medium text-body text-primary-foreground sm:col-span-3">
											<AppIcon product={product} size="sm" />
											<span className="group-hover:underline">
												{product.name}
											</span>
										</span>
										<span className="text-pretty text-body-sm text-secondary-foreground leading-relaxed sm:col-span-7">
											<Highlight>{product.tagline}</Highlight>
										</span>
										<span className="font-medium font-mono text-[11px] text-brand uppercase tracking-[0.08em] sm:col-span-2 sm:text-right">
											{badge?.value ?? product.metric}
										</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</section>

			{EDGE_PRODUCTS.map((product, index) => (
				<ProductBand
					flipped={index % 2 === 1}
					key={product.slug}
					product={product}
				/>
			))}

			<BetterTogether />

			<MarketingCta
				body="Most apps have a free plan and none of them have a contract. Billing runs through Shopify, and you cancel from your admin like any other app."
				heading="Your traffic is already paid for. Get more out of it."
				primary={{ href: BOOKING_URL, label: BOOKING_LABEL }}
				railItems={RAIL_ITEMS}
				secondary={{ href: "/partners", label: "Become a partner" }}
				stickers={STICKERS}
			/>
		</>
	);
}
