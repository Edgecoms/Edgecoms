import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Edge Partners · Recurring revenue for agencies and freelancers",
	description:
		"Register the Shopify merchants you already manage and earn a recurring share of Edge revenue for as long as they stay subscribed. No referral links, no attribution windows.",
};

export default function PartnersLayout({ children }: { children: ReactNode }) {
	return children;
}
