import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getProduct } from "@/lib/products";
import {
	breadcrumbSchema,
	faqSchema,
	jsonLdScriptProps,
	softwareAppSchema,
} from "@/lib/seo";

/**
 * The page itself is a client component, so its metadata and structured data
 * both live here. Every field is derived from the catalog rather than retyped,
 * so what Google reads and what the page renders cannot drift apart.
 */
const product = getProduct("edge-bundles");

const title = product?.seoTitle ?? "Edge apps";

export const metadata: Metadata = {
	title,
	description: product?.description,
	alternates: { canonical: "/products/edge-bundles" },
	openGraph: {
		title,
		description: product?.description,
		type: "website",
		url: "/products/edge-bundles",
	},
};

export default function ProductLayout({ children }: { children: ReactNode }) {
	if (!product) {
		return children;
	}

	return (
		<>
			<script {...jsonLdScriptProps(softwareAppSchema(product))} />
			<script
				{...jsonLdScriptProps(
					breadcrumbSchema([
						{ name: "Home", path: "/" },
						{ name: "Apps", path: "/products" },
						{ name: product.name, path: `/products/${product.slug}` },
					])
				)}
			/>
			{product.faq.length > 0 ? (
				<script {...jsonLdScriptProps(faqSchema(product.faq))} />
			) : null}
			{children}
		</>
	);
}
