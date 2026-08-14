import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Partner login · Edge",
	description:
		"Sign in to the Edge partner portal to track your merchants, earnings, and payouts.",
};

export default function AuthPageLayout({ children }: { children: ReactNode }) {
	return children;
}
