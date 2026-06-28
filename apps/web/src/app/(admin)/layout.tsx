import { auth } from "@edgecoms/auth";
import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/portal-shell";

const ADMIN_NAV = [
	{ href: "/admin", label: "Dashboard" },
	{ href: "/admin/partners", label: "Partners" },
	{ href: "/admin/merchants", label: "Merchants" },
	{ href: "/admin/commissions", label: "Commissions" },
	{ href: "/admin/payouts", label: "Payouts" },
];

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect("/login" as Route);
	}
	if (session.user.role !== "admin") {
		redirect("/partner" as Route);
	}

	return (
		<PortalShell
			brand="Admin"
			nav={ADMIN_NAV}
			user={{ name: session.user.name, email: session.user.email }}
		>
			{children}
		</PortalShell>
	);
}
