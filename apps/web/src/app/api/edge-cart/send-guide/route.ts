import { markPlaybookSent, saveLead } from "@edgecoms/api/marketing/leads";
import { headers } from "next/headers";

import { sendPlaybook } from "@/lib/edge-cart-email";
import { HONEYPOT_FIELD, type Lead, leadSchema } from "@/lib/edge-cart-lead";
import { allowRequest } from "@/lib/edge-cart-rate-limit";
import { clientIp } from "@/lib/meta-capi";

/**
 * POST /api/edge-cart/send-guide — the Edge Cart playbook form.
 *
 * The destination for paid traffic, which sets the posture: it is public, it
 * sends email, and the only thing standing between it and someone else's
 * mailbox is what is written here.
 *
 * - **Zod on the server, always.** The dialog validates too, so the visitor
 *   sees the error next to the field. That check is a courtesy to a person
 *   using the form; it is not a control, and nothing here reads it.
 * - **The honeypot answers 200.** Telling a bot it was caught teaches whoever
 *   wrote it to stop filling the field. A silent success does not.
 * - **The lead is recorded before the send.** The email is the deliverable but
 *   the address is the asset, so an unreachable Resend must never lose it.
 * - **Failure to send is not failure to submit.** See `sendPlaybook`.
 */

const OK = 200;
const BAD_REQUEST = 400;
const TOO_MANY_REQUESTS = 429;

function json(body: unknown, status: number): Response {
	return Response.json(body, { status });
}

/** The page this form belongs to. Stored so other app pages can share the table. */
const PRODUCT = "edge-cart";

/**
 * Write the lead down, in both places.
 *
 * The database is the store; the log line is the backstop. If the insert fails
 * the visitor still gets their email and we still have the address, because
 * losing a lead we already accepted is the one outcome worth avoiding here.
 *
 * TODO(crm-handoff): forward accepted leads to Klaviyo or HubSpot. The rows in
 * `marketing_leads` are the source to sync FROM; that decision is still open
 * and this route is deliberately not the place it gets made.
 */
async function recordLead(lead: Lead): Promise<string | null> {
	const leadId = await saveLead({
		email: lead.email,
		product: PRODUCT,
		source: lead.source,
		storeUrl: lead.storeUrl,
	});

	console.info(
		JSON.stringify({
			at: new Date().toISOString(),
			email: lead.email,
			event: "edge_cart_lead",
			leadId,
			/* Null means the insert failed and this log line is the only record. */
			persisted: leadId !== null,
			source: lead.source,
			storeUrl: lead.storeUrl || null,
		})
	);

	return leadId;
}

export async function POST(request: Request): Promise<Response> {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: "Send a JSON body." }, BAD_REQUEST);
	}

	const parsed = leadSchema.safeParse(body);
	if (!parsed.success) {
		return json(
			{
				error:
					parsed.error.issues[0]?.message ?? "Check the details and try again.",
			},
			BAD_REQUEST
		);
	}

	const lead = parsed.data;

	/**
	 * Filled by a bot. Answer exactly what a real submission answers, and do
	 * nothing: no email, no lead, no rate-limit slot consumed.
	 */
	if (lead[HONEYPOT_FIELD]) {
		return json({ ok: true }, OK);
	}

	const headerList = await headers();
	const ip =
		clientIp(headerList.get("x-forwarded-for"), headerList.get("x-real-ip")) ??
		"unknown";

	if (!allowRequest(ip)) {
		return json(
			{
				error:
					"That is a few too many requests from here. Try again in an hour, or email anurag@edgecoms.com and I will send it over.",
			},
			TOO_MANY_REQUESTS
		);
	}

	const leadId = await recordLead(lead);

	const outcome = await sendPlaybook(lead.email);
	if (outcome === "sent") {
		if (leadId) {
			await markPlaybookSent(leadId);
		}
	} else {
		/* A lead accepted but not emailed has to be visible. `playbook_sent_at`
		   stays null, which is how you find these rows later. */
		console.warn(
			`edge_cart_lead: playbook not sent (${outcome}) for ${lead.email}`
		);
	}

	return json({ ok: true }, OK);
}
