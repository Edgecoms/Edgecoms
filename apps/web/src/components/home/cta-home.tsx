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
import type { Route } from "next";
import Link from "next/link";
import {
	type CtaRailItem,
	MarketingCta,
} from "@/components/marketing/marketing-cta";

/** One decorative tile per app in the suite. */
const STICKERS = [Package, ShoppingCart, Star, Timer, Globe, Repeat] as const;

const RAIL_ITEMS: readonly CtaRailItem[] = [
	{ icon: Store, label: "Billed on the Shopify invoice you already get" },
	{ icon: Zap, label: "Live in minutes" },
	{ icon: Palette, label: "Works with any theme" },
	{ icon: LifeBuoy, label: "One team, one support inbox" },
	{ icon: Repeat, label: "Start with one app, add the rest anytime" },
];

export function CtaHome() {
	return (
		<MarketingCta
			body="Start with one app or run the suite. Billed through Shopify, live in minutes, no developer required."
			footnote={
				<>
					Manage Shopify stores for a living? Earn recurring commission on every
					merchant you bring to Edge.{" "}
					<Link
						className="text-primary-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
						href={"/partners" as Route}
					>
						See the partner program
					</Link>
				</>
			}
			heading="Give your store the whole edge"
			primary={{ href: "/products", label: "Explore the suite" }}
			railItems={RAIL_ITEMS}
			secondary={{ href: "/contact", label: "Talk to us" }}
			stickers={STICKERS}
		/>
	);
}
