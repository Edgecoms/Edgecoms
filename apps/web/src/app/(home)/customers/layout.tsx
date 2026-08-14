import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Customers · Shopify brands running Edge",
	description:
		"The stores running the Edge app suite, what they sell, and which apps they use. Browse by category or read the full case studies.",
};

export default function CustomersLayout({ children }: { children: ReactNode }) {
	return children;
}
