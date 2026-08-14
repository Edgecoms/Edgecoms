import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getProduct } from "@/lib/products";

/**
 * The page itself is a client component, so its metadata has to live here.
 * Both fields are derived from the catalog rather than retyped, so the tab
 * title and the page's own H1 can never drift apart.
 */
const product = getProduct("edge-cart");

export const metadata: Metadata = {
	title: product ? `${product.name} · ${product.tagline}` : "Edge apps",
	description: product?.description,
};

export default function ProductLayout({ children }: { children: ReactNode }) {
	return children;
}
