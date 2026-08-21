import type { Metadata } from "next";
import type { ReactNode } from "react";
import { breadcrumbSchema, jsonLdScriptProps } from "@/lib/seo";

export const metadata: Metadata = {
	title: "Customers · Shopify brands running Edge",
	description:
		"The stores running the Edge app suite, what they sell, and which apps they use. Browse by category or read the full case studies.",
	alternates: { canonical: "/customers" },
	openGraph: { type: "website", url: "/customers" },
};

export default function CustomersLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<script
				{...jsonLdScriptProps(
					breadcrumbSchema([
						{ name: "Home", path: "/" },
						{ name: "Customers", path: "/customers" },
					])
				)}
			/>
			{children}
		</>
	);
}
