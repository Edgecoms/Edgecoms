import { db } from "@edgecoms/db";
import { EDGE_APPS } from "@edgecoms/db/seed-data";
import { appSecret, isTestMode, env as mailEnv } from "@edgecoms/env/mail";
import { env } from "@edgecoms/env/server";
import { PortalHeader, TableShell } from "@edgecoms/ui/components/portal";
import type { Metadata } from "next";
import { ago } from "@/lib/format";
import { lastReceived } from "@/server/queries/settings";
import { requireAdmin } from "@/server/session";

export const metadata: Metadata = { title: "Settings" };

/** Read-only: every value here comes from the environment, never from a form. */
export default async function SettingsPage() {
	await requireAdmin();
	const received = await lastReceived(db);
	const testMode = isTestMode();

	const checks: [string, string][] = [
		[
			"Test mode",
			testMode
				? `ON: all mail goes to ${mailEnv.EDGE_MAIL_TEST_RECIPIENT ?? "nobody (EDGE_MAIL_TEST_RECIPIENT unset, nothing is sent)"}`
				: "OFF: real merchants receive mail",
		],
		["Resend API key", env.RESEND_API_KEY ? "Set" : "Missing"],
		[
			"Resend webhook secret",
			mailEnv.RESEND_WEBHOOK_SECRET ? "Set" : "Missing: webhook answers 503",
		],
		[
			"Preferences links",
			mailEnv.EDGE_MAIL_PREFERENCES_SECRET && mailEnv.EDGE_MAIL_URL
				? "Enabled"
				: "Disabled: set EDGE_MAIL_PREFERENCES_SECRET and EDGE_MAIL_URL",
		],
		["Last app event", ago(received.event)],
		["Last Resend webhook", ago(received.webhook)],
	];

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Configuration comes from environment variables. Change them in the deployment, not here."
				title="Settings"
			/>
			<TableShell
				head={
					<>
						<th>Setting</th>
						<th>State</th>
					</>
				}
			>
				{checks.map(([label, state]) => (
					<tr key={label}>
						<td className="text-primary-foreground">{label}</td>
						<td>{state}</td>
					</tr>
				))}
			</TableShell>
			<TableShell
				head={
					<>
						<th>App</th>
						<th>Event secret</th>
					</>
				}
			>
				{EDGE_APPS.map((app) => (
					<tr key={app.slug}>
						<td className="text-primary-foreground">{app.name}</td>
						<td>{appSecret(app.slug) ? "Set" : "Not set: events refused"}</td>
					</tr>
				))}
			</TableShell>
		</div>
	);
}
