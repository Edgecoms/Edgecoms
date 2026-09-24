import { db } from "@edgecoms/db";
import { mailContacts } from "@edgecoms/db/schema/mail";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { readPreferencesToken } from "@/server/preferences/token";
import { PreferencesForm } from "./preferences-form";

export const metadata: Metadata = { title: "Email preferences" };

/**
 * PUBLIC: the link in every merchant email. The signed token is the only
 * credential and it proves one contact; a forged or unknown token shows the
 * same message as an expired one and reveals nothing.
 */
export default async function PreferencesPage({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;
	const contactId = readPreferencesToken(decodeURIComponent(token));
	const [contact] = contactId
		? await db
				.select()
				.from(mailContacts)
				.where(eq(mailContacts.id, contactId))
				.limit(1)
		: [];

	return (
		<main className="flex min-h-svh justify-center bg-bg px-6 py-16">
			<div className="flex w-full max-w-md flex-col gap-8">
				<p className="font-medium text-primary-foreground">Edge</p>
				{contact ? (
					<>
						<div className="flex flex-col gap-1">
							<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
								Email preferences
							</h1>
							<p className="text-body-sm text-secondary-foreground">
								{contact.email}
							</p>
						</div>
						<PreferencesForm
							initial={{
								education: contact.education,
								marketing: contact.marketing,
								productUpdates: contact.productUpdates,
							}}
							token={decodeURIComponent(token)}
						/>
					</>
				) : (
					<div className="flex flex-col gap-2">
						<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
							This link is not valid
						</h1>
						<p className="text-body-sm text-secondary-foreground">
							Use the preferences link in any recent email from an Edge app.
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
