import { auth } from "@edgecoms/auth";
import type { Metadata, Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/portal-shell";

/**
 * One title for every partner-portal screen. The portal is behind auth and must
 * never be indexed, so `robots` is set here rather than relying on the route
 * being unlinked.
 */
export const metadata: Metadata = {
	title: { default: "Partner portal · Edge", template: "%s · Edge Partners" },
	robots: { follow: false, index: false },
};

const PARTNER_NAV = [
	{ href: "/partner", label: "Dashboard" },
	{ href: "/partner/merchants", label: "Merchants" },
	{ href: "/partner/earnings", label: "Earnings" },
	{ href: "/partner/settings", label: "Settings" },
];

export default async function PartnerLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect("/login" as Route);
	}
	if (session.user.role !== "partner") {
		redirect("/admin" as Route);
	}

	return (
		<PortalShell
			brand="Partner"
			nav={PARTNER_NAV}
			user={{ name: session.user.name, email: session.user.email }}
		>
			{children}
		</PortalShell>
	);
}
