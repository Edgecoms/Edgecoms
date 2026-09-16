import { auth } from "@edgecoms/auth";
import { headers } from "next/headers";
import { EDGE_PRODUCTS } from "@/lib/products";
import { PartnerWelcome } from "./welcome-client";

/** Splits a display name so the greeting can use the first word only. */
const NAME_PARTS = /\s+/;

/**
 * The partner's first screen, assembled on the server.
 *
 * Its job here is to hand the client component two things it should not fetch
 * for itself: the partner's own name, and a SLIM projection of the app catalog.
 *
 * Slim matters. `EDGE_PRODUCTS` carries six features, an FAQ and pricing for
 * each of seven apps, and importing it into a client component would ship all
 * of it to the browser to render seven one-line descriptions. Picking the four
 * fields the portal needs keeps the marketing catalog server-side while still
 * making it the single source of app copy, so the portal and the public site
 * can never describe the same app differently.
 */
export default async function PartnerWelcomePage() {
	const session = await auth.api.getSession({ headers: await headers() });

	const catalog = EDGE_PRODUCTS.map((product) => ({
		/** The metric this app moves, e.g. "Average order value". */
		category: product.category,
		/** What it is, in one line. */
		eyebrow: product.eyebrow,
		listingUrl: product.appStoreUrl ?? null,
		slug: product.slug,
	}));

	return (
		<PartnerWelcome
			catalog={catalog}
			firstName={session?.user.name?.trim().split(NAME_PARTS)[0] ?? null}
		/>
	);
}
