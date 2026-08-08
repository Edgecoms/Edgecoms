import type { Metadata } from "next";
import { MigrationGrid } from "@/components/home/migration-grid";
import { ProductsHero } from "@/components/products/products-hero";
import { ScaleConfidence } from "@/components/products/scale-confidence";

export const metadata: Metadata = {
	title: "Edge Apps · Every app here moves one number",
	description:
		"Revenue per visitor is conversion rate times average order value. Six of these lift one side of it, and the seventh proves it moved. Most have a free plan.",
};

export default function ProductsPage() {
	return (
		<main>
			<ProductsHero />
			<MigrationGrid />
			<ScaleConfidence />
		</main>
	);
}
