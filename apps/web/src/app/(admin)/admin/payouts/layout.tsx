import type { Metadata } from "next";
import type { ReactNode } from "react";

/* Fills the `%s · Admin · Edge` template on the group layout, so the
   browser tab and history name the screen rather than the portal. */
export const metadata: Metadata = {
	title: "Payouts",
};

export default function AdminPayoutsLayout({
	children,
}: {
	children: ReactNode;
}) {
	return children;
}
