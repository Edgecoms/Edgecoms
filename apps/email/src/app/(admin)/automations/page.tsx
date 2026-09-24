import { PortalHeader, TableShell } from "@edgecoms/ui/components/portal";
import type { Metadata } from "next";
import {
	LIFECYCLE_NAMES,
	LIFECYCLE_TEMPLATES,
	LIFECYCLE_TRIGGERS,
	LIFECYCLE_VARIABLES,
} from "@/emails/templates";
import { requireAdmin } from "@/server/session";

export const metadata: Metadata = { title: "Automations" };

/**
 * The automations RUN in Resend: they are built in its dashboard, not here.
 * This page is the contract between the two: which event starts each flow and
 * which template alias each step sends.
 */
export default async function AutomationsPage() {
	await requireAdmin();
	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Built and run in Resend. Edge Mail sends the events that start them and pushes the templates they send."
				title="Automations"
			/>
			<TableShell
				head={
					<>
						<th>Automation</th>
						<th>Trigger</th>
						<th>Template alias</th>
					</>
				}
			>
				{LIFECYCLE_TEMPLATES.map((template) => (
					<tr key={template}>
						<td className="text-primary-foreground">
							{LIFECYCLE_NAMES[template]}
						</td>
						<td>
							<code className="font-mono text-[12px]">
								{LIFECYCLE_TRIGGERS[template]}
							</code>
						</td>
						<td>
							<code className="font-mono text-[12px]">
								{"<app-slug>"}-{template}
							</code>
						</td>
					</tr>
				))}
			</TableShell>
			<section className="flex flex-col gap-3">
				<h2 className="font-medium text-body text-primary-foreground">
					Template variables
				</h2>
				<p className="max-w-3xl text-body-sm text-secondary-foreground">
					Every lifecycle template declares these. In each automation's Send
					Email step, map them from the event exactly as below.
				</p>
				<TableShell
					head={
						<>
							<th>Variable</th>
							<th>Map from</th>
							<th>Fallback</th>
						</>
					}
				>
					{LIFECYCLE_VARIABLES.map((variable) => (
						<tr key={variable.key}>
							<td>
								<code className="font-mono text-[12px]">{variable.key}</code>
							</td>
							<td>
								<code className="font-mono text-[12px]">
									{`{ "var": "${variable.from}" }`}
								</code>
							</td>
							<td>{variable.fallback ?? "the app's support page"}</td>
						</tr>
					))}
				</TableShell>
			</section>
			<section className="flex max-w-3xl flex-col gap-3 text-body-sm text-secondary-foreground">
				<h2 className="font-medium text-body text-primary-foreground">
					Building one in Resend
				</h2>
				<ol className="list-decimal space-y-2 pl-5">
					<li>
						Run <code className="font-mono">bun run resend:setup</code> once,
						then{" "}
						<code className="font-mono">bun run resend:push-templates</code>{" "}
						after configuring each app.
					</li>
					<li>
						In Resend, create an automation per app, triggered by the event
						above. Filter on the <code className="font-mono">app_slug</code>{" "}
						payload field so Edge Cart's install only starts Edge Cart's
						welcome.
					</li>
					<li>
						Setup reminder: after the welcome email, wait up to 24 hours for{" "}
						<code className="font-mono">setup.completed</code>; if it does not
						arrive, send{" "}
						<code className="font-mono">{"<app-slug>"}-setup-reminder</code>.
					</li>
					<li>
						Review request: trigger on{" "}
						<code className="font-mono">milestone.first_value</code>, so the ask
						only comes after the merchant has seen results.
					</li>
				</ol>
			</section>
		</div>
	);
}
