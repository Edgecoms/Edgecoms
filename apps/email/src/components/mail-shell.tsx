"use client";

import { PortalShell } from "@edgecoms/ui/components/portal-shell";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

const NAV = [
	{ href: "/", label: "Dashboard" },
	{ href: "/campaigns", label: "Campaigns" },
	{ href: "/contacts", label: "Contacts" },
	{ href: "/apps", label: "Apps" },
	{ href: "/templates", label: "Templates" },
	{ href: "/automations", label: "Automations" },
	{ href: "/settings", label: "Settings" },
];

export function MailShell({
	children,
	user,
}: {
	children: ReactNode;
	user: { name: string; email: string };
}) {
	const router = useRouter();

	async function handleSignOut() {
		await authClient.signOut();
		router.push("/login" as Route);
		router.refresh();
	}

	return (
		<PortalShell brand="Mail" nav={NAV} onSignOut={handleSignOut} user={user}>
			{children}
		</PortalShell>
	);
}
