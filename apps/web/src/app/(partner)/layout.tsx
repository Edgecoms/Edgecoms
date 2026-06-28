import { auth } from "@edgecoms/auth";
import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/portal-shell";

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
