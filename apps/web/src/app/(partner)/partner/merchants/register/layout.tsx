import type { Metadata } from "next";
import type { ReactNode } from "react";

/* Fills the `%s · Edge Partners` template on the group layout, so the
   browser tab and history name the screen rather than the portal. */
export const metadata: Metadata = {
	title: "Register a merchant",
};

export default function PartnerRegisterMerchantLayout({
	children,
}: {
	children: ReactNode;
}) {
	return children;
}
