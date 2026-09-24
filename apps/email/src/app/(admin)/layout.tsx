import { EmptyState } from "@edgecoms/ui/components/portal";
import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { MailShell } from "@/components/mail-shell";
import { mailAuth } from "@/server/auth";

/**
 * Admin only. This is a page guard for a clean redirect, NOT the security
 * boundary: every tRPC procedure asserts the admin role itself.
 */
export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const session = await mailAuth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect("/login" as Route);
	}
	if (session.user.role !== "admin") {
		return (
			<div className="mx-auto max-w-md px-6 py-24">
				<EmptyState
					description="Edge Mail is for Edge admins. Sign in with an admin account."
					title="No access"
				/>
			</div>
		);
	}

	return (
		<MailShell user={{ name: session.user.name, email: session.user.email }}>
			{children}
		</MailShell>
	);
}
