import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PARTNER_FAQS } from "@/components/partners/partner-faq";
import { breadcrumbSchema, faqSchema, jsonLdScriptProps } from "@/lib/seo";

export const metadata: Metadata = {
	title: "Edge Partners · Recurring commission for agencies",
	description:
		"Register the Shopify merchants you already manage and earn recurring commission for as long as they stay subscribed. No referral links, no expiry.",
	alternates: { canonical: "/partners" },
	openGraph: { type: "website", url: "/partners" },
};

export default function PartnersLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<script
				{...jsonLdScriptProps(
					breadcrumbSchema([
						{ name: "Home", path: "/" },
						{ name: "Partners", path: "/partners" },
					])
				)}
			/>
			<script {...jsonLdScriptProps(faqSchema(PARTNER_FAQS))} />
			{children}
		</>
	);
}
