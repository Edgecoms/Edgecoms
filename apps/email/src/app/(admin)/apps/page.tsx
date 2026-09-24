import { db } from "@edgecoms/db";
import { appSecret } from "@edgecoms/env/mail";
import { PortalHeader } from "@edgecoms/ui/components/portal";
import type { Metadata } from "next";
import { count } from "@/lib/format";
import { listAppsWithSettings } from "@/server/apps/identity";
import { appCounts } from "@/server/queries/apps";
import { requireAdmin } from "@/server/session";
import { AppSettingsForm } from "./app-settings-form";

export const metadata: Metadata = { title: "Apps" };

function secretVar(slug: string): string {
	return `EDGE_MAIL_SECRET_${slug.toUpperCase().replaceAll("-", "_")}`;
}

export default async function AppsPage() {
	await requireAdmin();
	const [all, counts] = await Promise.all([
		listAppsWithSettings(db),
		appCounts(db),
	]);

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Each app's sending identity and links. An app sends events once its secret is set in the environment, and can be picked for a campaign once it has a sender."
				title="Apps"
			/>
			{all.map((app) => {
				const stats = counts.get(app.appId);
				const connected = appSecret(app.slug) !== null;
				return (
					<section
						className="flex flex-col gap-5 rounded-xl border border-border-strong bg-surface p-6 shadow-sm"
						key={app.appId}
					>
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div className="flex flex-col gap-1">
								<h2 className="font-medium text-body text-primary-foreground">
									{app.name}
								</h2>
								<p className="text-caption text-secondary-foreground">
									{app.slug} · {count(stats?.installs ?? 0)} live installs ·{" "}
									{count(stats?.contacts ?? 0)} contacts
								</p>
							</div>
							<p className="text-caption text-secondary-foreground">
								{connected
									? "Secret set: events accepted"
									: `No secret: set ${secretVar(app.slug)} to accept events`}
							</p>
						</div>
						<AppSettingsForm
							appId={app.appId}
							appName={app.name}
							settings={app.settings}
						/>
					</section>
				);
			})}
		</div>
	);
}
