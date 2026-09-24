import { z } from "zod";

/**
 * The body an Edge app POSTs to /api/v1/events.
 *
 * Bounded on every string, like the attribution bodies: HMAC proves the caller
 * holds an app's secret, it does not make the body trustworthy. The app is NOT
 * named here; it is the authenticated `X-Edge-App-ID` header.
 */

export const MAIL_EVENT_TYPES = [
	"app.installed",
	"app.uninstalled",
	"app.activated",
	"app.deactivated",
	"setup.completed",
	"plan.started",
	"plan.changed",
	"plan.cancelled",
	"trial.started",
	"trial.ending",
	"milestone.first_value",
	"feature.used",
] as const;

export type MailEventType = (typeof MAIL_EVENT_TYPES)[number];

const SHORT = z.string().trim().min(1).max(255);

export const mailEventBody = z.object({
	/** The app's own id for this delivery, and the dedup key. */
	eventId: z.string().min(1).max(128),
	event: z.enum(MAIL_EVENT_TYPES),
	occurredAt: z.iso.datetime({ offset: true }),
	store: z.object({
		domain: SHORT,
		name: SHORT.nullish(),
		country: z.string().trim().max(64).nullish(),
		currency: z.string().trim().max(8).nullish(),
		timezone: z.string().trim().max(64).nullish(),
	}),
	/** Optional: a usage event may carry no person. */
	contact: z
		.object({
			email: z.email().max(320),
			firstName: z.string().trim().max(120).nullish(),
			lastName: z.string().trim().max(120).nullish(),
		})
		.nullish(),
	/** Free-form, but small: it is stored, and forwarded to Resend as the event payload. */
	properties: z
		.record(
			z.string().max(64),
			z.union([z.string().max(1000), z.number(), z.boolean(), z.null()])
		)
		.refine((value) => Object.keys(value).length <= 30, {
			message: "At most 30 properties",
		})
		.default({}),
});

export type MailEventBody = z.infer<typeof mailEventBody>;
