import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Partner login",
	description:
		"Sign in to the Edge partner portal to track your merchants, earnings, and payouts.",
	alternates: { canonical: "/login" },
	robots: { follow: false, index: false },
};

export default function AuthPageLayout({ children }: { children: ReactNode }) {
	return children;
}
