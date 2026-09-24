import { db } from "@edgecoms/db";
import { Input } from "@edgecoms/ui/components/input";
import {
	EmptyState,
	PortalHeader,
	TableShell,
} from "@edgecoms/ui/components/portal";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { ago } from "@/lib/format";
import { listContacts } from "@/server/queries/contacts";
import { requireAdmin } from "@/server/session";

export const metadata: Metadata = { title: "Contacts" };

function optIn(on: boolean): string {
	return on ? "Subscribed" : "-";
}

export default async function ContactsPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}) {
	await requireAdmin();
	const { q = "" } = await searchParams;
	const contacts = await listContacts(db, q);

	return (
		<div className="flex flex-col gap-6">
			<PortalHeader
				description="One row per person, across every store and every Edge app."
				title="Contacts"
			/>
			<form action="/contacts" className="max-w-md" method="get">
				<label className="sr-only" htmlFor="contact-search">
					Search contacts
				</label>
				<Input
					defaultValue={q}
					id="contact-search"
					name="q"
					placeholder="Search by email or store domain"
					type="search"
				/>
			</form>
			{contacts.length === 0 ? (
				<EmptyState
					description={
						q
							? "Nobody matches that search."
							: "Contacts appear when an Edge app sends its first event."
					}
					title="No contacts"
				/>
			) : (
				<TableShell
					head={
						<>
							<th>Contact</th>
							<th>Store</th>
							<th>Apps</th>
							<th>Last active</th>
							<th>Updates</th>
							<th>Marketing</th>
						</>
					}
				>
					{contacts.map((contact) => (
						<tr key={contact.id}>
							<td>
								<Link
									className="text-primary-foreground underline-offset-4 hover:underline"
									href={`/contacts/${contact.id}` as Route}
								>
									{[contact.firstName, contact.lastName]
										.filter(Boolean)
										.join(" ") || contact.email}
								</Link>
								<div className="text-caption text-secondary-foreground">
									{contact.email}
									{contact.suppressedAt ? " · suppressed" : ""}
								</div>
							</td>
							<td>{contact.shopDomain ?? "-"}</td>
							<td className="tabular-nums">{contact.appCount}</td>
							<td>{ago(contact.lastActiveAt)}</td>
							<td>{optIn(contact.productUpdates)}</td>
							<td>{optIn(contact.marketing)}</td>
						</tr>
					))}
				</TableShell>
			)}
		</div>
	);
}
