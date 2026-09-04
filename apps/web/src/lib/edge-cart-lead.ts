import { z } from "zod";

/**
 * The Edge Cart playbook lead — the one shape the form and the endpoint agree on.
 *
 * Shared rather than duplicated because the client and the server validate the
 * same submission for different reasons: the client so the visitor gets an
 * error next to the field they typed in, the server because a client-side
 * check is a courtesy and not a control. The server never trusts the first.
 */

/** Which button opened the dialog. Tells paid traffic which surface converted. */
export const LEAD_SOURCES = ["hero", "setup-callout", "final-cta"] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

/**
 * Long enough for any real address, short enough that the endpoint is not a
 * place to post a megabyte. Same reasoning for the store URL.
 */
const MAX_EMAIL_LENGTH = 254;
const MAX_STORE_URL_LENGTH = 255;

/**
 * The honeypot. A field no human sees, so anything in it is a bot.
 *
 * Named `company` because that is a field name a naive form-filler recognises
 * and fills in. Kept in the schema rather than stripped at the edge so the
 * route's contract states plainly that it exists.
 */
export const HONEYPOT_FIELD = "company";

export const leadSchema = z.object({
	[HONEYPOT_FIELD]: z.string().max(MAX_STORE_URL_LENGTH).optional(),
	email: z
		.email("Enter a valid work email address.")
		.max(MAX_EMAIL_LENGTH, "That email address is too long."),
	source: z.enum(LEAD_SOURCES),
	/**
	 * Free text on purpose. A merchant types "acme.com", "www.acme.com" or the
	 * full myshopify domain, and refusing two of those three to enforce a shape
	 * we do not need costs more leads than it saves. It is optional, it is only
	 * ever read by a human writing the teardown, and it is never used to key
	 * anything, so it does not carry the canonical-domain rules the attribution
	 * system does.
	 */
	storeUrl: z
		.string()
		.trim()
		.max(MAX_STORE_URL_LENGTH, "That store URL is too long.")
		.optional(),
});

export type Lead = z.infer<typeof leadSchema>;

/** Where the playbook email sends people to install. */
export const EDGE_CART_APP_STORE_URL = "https://apps.shopify.com/edgecart";
