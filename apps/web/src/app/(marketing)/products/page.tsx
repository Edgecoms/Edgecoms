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
import {
	type CtaRailItem,
	MarketingCta,
} from "@/components/marketing/marketing-cta";
import { BetterTogether } from "@/components/products/better-together";
import { ProductBand } from "@/components/products/product-band";
import { EDGE_PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
	title: "Products — Edge",
	description:
		"Six focused Shopify apps — bundles, cart, reviews, timer, currency, and subscriptions. Each does one job exceptionally well, and they are built to work together.",
};

const STICKERS = [Package, ShoppingCart, Star, Timer, Globe, Repeat] as const;

const RAIL_ITEMS: readonly CtaRailItem[] = [
	{ icon: Store, label: "Billed on the Shopify invoice you already get" },
	{ icon: Zap, label: "Live in minutes" },
	{ icon: Palette, label: "Works with any theme" },
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

				<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 pt-32 pb-24 text-center sm:gap-8">
					<p className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.14em]">
						The Edge suite
					</p>
					<h1 className="text-balance font-medium text-display text-primary-foreground sm:text-display-lg">
						Six apps. One suite. No bloat.
					</h1>
					<p className="max-w-2xl text-pretty text-body-lg text-secondary-foreground leading-relaxed">
						Each one does a single job exceptionally well. Run one or run all
						six — they are built by one team, on one bill, and they know about
						each other.
					</p>
					<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
						<ButtonLink
							className="h-11 rounded-full px-6 text-[15px]"
							href={"/contact" as Route}
							size="xl"
							variant="brand"
						>
							Talk to us
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

			{EDGE_PRODUCTS.map((product, index) => (
				<ProductBand
					flipped={index % 2 === 1}
					key={product.slug}
					product={product}
				/>
			))}

			<BetterTogether />

			<MarketingCta
				body="Start with one app or run the suite. Billed through Shopify, live in minutes, no developer required."
				heading="Give your store the whole edge"
				primary={{ href: "/contact", label: "Talk to us" }}
				railItems={RAIL_ITEMS}
				secondary={{ href: "/partners", label: "Become a partner" }}
				stickers={STICKERS}
			/>
		</>
	);
}
