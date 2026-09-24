import { db } from "@edgecoms/db";
import { PortalHeader } from "@edgecoms/ui/components/portal";
import type { ReactNode } from "react";
import { Sparkline } from "@/components/sparkline";
import { count } from "@/lib/format";
import { change, overview, WINDOW_DAYS } from "@/server/queries/dashboard";
import { requireAdmin } from "@/server/session";

/** A label with a dotted underline; hovering it explains the number. */
function Term({ children, hint }: { children: ReactNode; hint: string }) {
	return (
		<span
			className="w-fit border-secondary-foreground/40 border-b border-dotted text-body-sm text-secondary-foreground"
			title={hint}
		>
			{children}
		</span>
	);
}

function Figure({
	hint,
	label,
	value,
}: {
	hint: string;
	label: string;
	value: number;
}) {
	return (
		<div className="flex flex-col gap-1 px-6 py-5">
			<Term hint={hint}>{label}</Term>
			<span className="font-medium text-[22px] text-primary-foreground tabular-nums">
				{count(value)}
			</span>
		</div>
	);
}

function trend(current: number, previous: number): string {
	const percent = change(current, previous);
	if (percent === null) {
		return "—";
	}
	if (percent === 0) {
		return "No change";
	}
	return `${percent > 0 ? "↑" : "↓"} ${Math.abs(percent)}%`;
}

/**
 * Edge Mail's own numbers: the merchants across every Edge app. How email
 * performs (opens, clicks, bounces) is Resend's to show, and its dashboard
 * does.
 */
export default async function DashboardPage() {
	await requireAdmin();
	const stats = await overview(db);

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				description="Your merchants across every Edge app. Email delivery numbers live in Resend."
				title="Dashboard"
			/>

			<section className="overflow-hidden rounded-xl border border-border-strong bg-white shadow-sm">
				<div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:gap-10">
					<div className="flex shrink-0 flex-col gap-1">
						<span className="font-medium text-[34px] text-primary-foreground tabular-nums leading-tight">
							{count(stats.newContacts)}
						</span>
						<Term hint="People Edge Mail heard about for the first time, from any Edge app's install or event.">
							New contacts
						</Term>
						<span className="text-caption text-secondary-foreground">
							{trend(stats.newContacts, stats.previousNewContacts)} vs previous{" "}
							{WINDOW_DAYS} days
						</span>
					</div>
					<div className="min-w-0 flex-1 sm:pb-1">
						<Sparkline
							label={`New contacts per day, last ${WINDOW_DAYS} days`}
							values={stats.series}
						/>
					</div>
				</div>

				<div className="grid border-border-strong border-t sm:grid-cols-3 sm:divide-x sm:divide-border-strong">
					<Figure
						hint="Every person Edge Mail knows, across all stores and apps."
						label="Total contacts"
						value={stats.contacts}
					/>
					<Figure
						hint="Installs that are installed or active right now, across every app."
						label="Live installs"
						value={stats.liveInstalls}
					/>
					<Figure
						hint="Opted in to marketing and not bounced or complained: who a marketing campaign can reach."
						label="Reachable for marketing"
						value={stats.reachable}
					/>
				</div>

				<div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-border-strong border-t bg-bg px-6 py-3">
					<span className="font-medium text-body-sm text-primary-foreground">
						Live installs by app
					</span>
					{stats.byApp.map((app) => (
						<span className="flex items-center gap-2" key={app.name}>
							<Term hint={`Live installs of ${app.name}`}>{app.name}</Term>
							<span className="font-medium text-body-sm text-primary-foreground tabular-nums">
								{count(app.installs)}
							</span>
						</span>
					))}
				</div>
			</section>
		</div>
	);
}
