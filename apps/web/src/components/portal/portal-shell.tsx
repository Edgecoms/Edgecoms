"use client";

import {
	type PortalNavItem,
	PortalShell as SharedPortalShell,
} from "@edgecoms/ui/components/portal-shell";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

/**
 * The shared shell with this app's sign-out. The layouts are server components
 * and cannot hand a function to a client component, so the handler lives here.
 */
export function PortalShell(props: {
	brand: string;
	children: ReactNode;
	nav: PortalNavItem[];
	user: { name: string; email: string };
}) {
	const router = useRouter();

	async function handleSignOut() {
		await authClient.signOut();
		router.push("/login" as Route);
		router.refresh();
	}

	return <SharedPortalShell {...props} onSignOut={handleSignOut} />;
}
