import type { Metadata } from "next";
import { MigrationGrid } from "@/components/home/migration-grid";
import { CtaDark } from "@/components/landing/cta-dark";
import { AppsStack } from "@/components/products/apps-stack";
import { FaqSection } from "@/components/products/faq-section";
import { HaapstaTestimonial } from "@/components/products/haapsta-testimonial";
import { ProductsHero } from "@/components/products/products-hero";
import { ScaleConfidence } from "@/components/products/scale-confidence";
import { StartExcel } from "@/components/products/start-excel";
import { Reveal } from "@/components/ui/reveal";
import { EDGE_PRODUCTS } from "@/lib/products";
import { breadcrumbSchema, itemListSchema, jsonLdScriptProps } from "@/lib/seo";

export const metadata: Metadata = {
	title: "Edge Apps · Every app here moves one number",
	description:
		"Revenue per visitor is conversion rate times average order value. Six of these lift one side of it, and the seventh proves it moved. Most have a free plan.",
	alternates: { canonical: "/products" },
	openGraph: { type: "website", url: "/products" },
};

export default function ProductsPage() {
	return (
		<main>
			<script
				{...jsonLdScriptProps(
					breadcrumbSchema([
						{ name: "Home", path: "/" },
						{ name: "Apps", path: "/products" },
					])
				)}
			/>
			<script
				{...jsonLdScriptProps(
					itemListSchema(
						EDGE_PRODUCTS.map((product) => ({
							name: product.name,
							path: `/products/${product.slug}`,
						}))
					)
				)}
			/>
			{/* The hero and the two sections that sequence themselves are left
			    unwrapped; everything else arrives as a block on scroll. */}
			<ProductsHero />
			<Reveal>
				<MigrationGrid />
			</Reveal>
			<ScaleConfidence />
			<AppsStack />
			<Reveal>
				<HaapstaTestimonial />
			</Reveal>
			<Reveal>
				<StartExcel />
			</Reveal>
			<Reveal>
				<FaqSection />
			</Reveal>
			<Reveal>
				<CtaDark />
			</Reveal>
		</main>
	);
}
