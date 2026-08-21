import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Apply to the Edge Partner Program",
	description:
		"Apply to the Edge Partner Program and earn a recurring share of revenue from the Shopify merchants you manage.",
	alternates: { canonical: "/register" },
	openGraph: { type: "website", url: "/register" },
};

export default function AuthPageLayout({ children }: { children: ReactNode }) {
	return children;
}
