import { db } from "@edgecoms/db";
import {
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@edgecoms/ui/components/portal";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dateTime } from "@/lib/format";
import { contactProfile } from "@/server/queries/contacts";
import { requireAdmin } from "@/server/session";
import { OptOutButton } from "./opt-out-button";

export const metadata: Metadata = { title: "Contact" };

const UUID = /^[0-9a-f-]{36}$/i;

const CATEGORIES = [
	["productUpdates", "Product updates"],
	["education", "Tips & education"],
	["marketing", "Offers & promotions"],
] as const;

export default async function ContactPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await requireAdmin();
	const { id } = await params;
	const profile = UUID.test(id) ? await contactProfile(db, id) : null;
	if (!profile) {
		notFound();
	}
	const { contact, installs, timeline } = profile;
	const name = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
	const anyOptIn = CATEGORIES.some(([key]) => contact[key]);

	return (
		<div className="flex flex-col gap-10">
			<PortalHeader
				action={anyOptIn ? <OptOutButton contactId={contact.id} /> : undefined}
				description={contact.email}
				title={name || contact.email}
			/>

			{contact.suppressedAt ? (
				<p className="rounded-xl border border-border-strong bg-surface p-4 text-body-sm text-secondary-foreground">
					Suppressed after a {contact.suppressionReason ?? "bounce"} on{" "}
					{dateTime(contact.suppressedAt)}. No campaign will reach this address.
				</p>
			) : null}

			<section className="flex flex-col gap-3">
				<h2 className="font-medium text-body text-primary-foreground">
					Installed apps
				</h2>
				<TableShell
					head={
						<>
							<th>Store</th>
							<th>App</th>
							<th>Status</th>
							<th>Plan</th>
							<th>Setup</th>
						</>
					}
				>
					{installs.map((install) => (
						<tr key={`${install.shopDomain}:${install.appName ?? ""}`}>
							<td>{install.shopDomain}</td>
							<td className="text-primary-foreground">
								{install.appName ?? "-"}
							</td>
							<td>
								{install.status ? <StatusBadge status={install.status} /> : "-"}
							</td>
							<td>{install.plan ?? "-"}</td>
							<td>{install.setupCompletedAt ? "Done" : "-"}</td>
						</tr>
					))}
				</TableShell>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="font-medium text-body text-primary-foreground">
					Email preferences
				</h2>
				<ul className="flex flex-col gap-1 text-body-sm">
					<li>Essential account emails: always</li>
					{CATEGORIES.map(([key, label]) => (
						<li key={key}>
							{label}: {contact[key] ? "Subscribed" : "Not subscribed"}
						</li>
					))}
				</ul>
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="font-medium text-body text-primary-foreground">
					Timeline
				</h2>
				{timeline.length === 0 ? (
					<p className="text-body-sm text-secondary-foreground">Nothing yet.</p>
				) : (
					<ol className="flex flex-col gap-2 text-body-sm">
						{timeline.map((item) => (
							<li
								className="flex gap-4"
								key={`${item.kind}:${item.type}:${item.at.toISOString()}`}
							>
								<span className="w-48 shrink-0 text-secondary-foreground tabular-nums">
									{dateTime(item.at)}
								</span>
								<span className="text-primary-foreground">
									{item.type}
									{item.detail ? (
										<span className="text-secondary-foreground">
											{" "}
											· {item.detail}
										</span>
									) : null}
								</span>
							</li>
						))}
					</ol>
				)}
			</section>
		</div>
	);
}
