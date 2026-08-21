import type { Metadata } from "next";
import { CtaHome } from "@/components/v1/cta-home";
import { HeroHome } from "@/components/v1/hero-home";
import { ManifestoHome } from "@/components/v1/manifesto-home";
import { PartnerHome } from "@/components/v1/partner-home";
import { ProductsHome } from "@/components/v1/products-home";

/**
 * Archived v1 homepage, kept verbatim for side-by-side comparison against the
 * redesign. Not linked from anywhere and excluded from search indexing.
 */
export const metadata: Metadata = {
	title: "Homepage v1 (archived) · Edge",
	robots: { index: false, follow: false },
};

export default function HomePageV1() {
	return (
		<main className="flex flex-col">
			<section className="container mx-auto px-6 sm:max-w-7xl">
				<HeroHome />
			</section>
			<ManifestoHome />
			<ProductsHome />
			<PartnerHome />
			<CtaHome />
		</main>
	);
}
