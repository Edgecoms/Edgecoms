import { adminProcedure, router } from "@edgecoms/api";
import { apps } from "@edgecoms/db/schema/apps";
import {
	mailCampaigns,
	mailCampaignType,
	mailEmailEvents,
} from "@edgecoms/db/schema/mail";
import { RESEND_UNSUBSCRIBE_URL } from "@edgecoms/mail/render";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { fromHeader, identityOf, listAppsWithSettings } from "../apps/identity";
import {
	audienceSchema,
	type Category,
	resolveRecipients,
} from "../campaigns/audience";
import { resendGateway } from "../campaigns/gateway";
import {
	advanceSend,
	type CampaignGateway,
	cancelCampaign,
	renderCampaign,
	type StartOutcome,
	startSend,
} from "../campaigns/send";
import { sendTestEmail } from "../resend";

type CampaignType = (typeof mailCampaignType.enumValues)[number];

/**
 * The category follows from the type, on the server. An admin never picks it,
 * so a discount cannot be labelled a product update to reach merchants who
 * opted in to updates only.
 */
export const CATEGORY_FOR_TYPE: Record<CampaignType, Category> = {
	announcement: "product_updates",
	cross_sell: "marketing",
	discount: "marketing",
	education: "education",
	marketing: "marketing",
	product_update: "product_updates",
	winback: "marketing",
};

const WEB_ADDRESS = /^https:\/\/\S+$/i;

const optionalText = (max: number) =>
	z
		.string()
		.trim()
		.max(max)
		.transform((value) => (value === "" ? null : value));

export const campaignFields = z.object({
	appId: z.uuid(),
	audience: audienceSchema,
	body: z.string().trim().min(1).max(5000),
	ctaLabel: optionalText(60),
	ctaUrl: z
		.string()
		.trim()
		.max(500)
		.refine((value) => value === "" || WEB_ADDRESS.test(value), {
			message: "Must start with https://",
		})
		.transform((value) => (value === "" ? null : value)),
	eyebrow: optionalText(60),
	headline: z.string().trim().min(1).max(200),
	name: z.string().trim().min(1).max(120),
	preheader: z.string().trim().max(200),
	subject: z.string().trim().min(1).max(200),
	type: z.enum(mailCampaignType.enumValues),
});

const START_ERRORS: Record<
	Exclude<StartOutcome, { ok: true }>["reason"],
	{ code: TRPCError["code"]; message: string }
> = {
	bad_schedule: {
		code: "BAD_REQUEST",
		message: "Schedule it at least a minute from now.",
	},
	count_changed: {
		code: "CONFLICT",
		message: "The audience changed since you confirmed. Review the new count.",
	},
	needs_test: {
		code: "PRECONDITION_FAILED",
		message: "Send a test after your last change first.",
	},
	no_recipients: {
		code: "PRECONDITION_FAILED",
		message: "Nobody matches this audience.",
	},
	no_sender: {
		code: "PRECONDITION_FAILED",
		message: "Configure the app's sender on the Apps page first.",
	},
	no_test_inbox: {
		code: "PRECONDITION_FAILED",
		message: "Test mode is on but EDGE_MAIL_TEST_RECIPIENT is not set.",
	},
	not_draft: { code: "CONFLICT", message: "This campaign is already sending." },
	not_found: { code: "NOT_FOUND", message: "Unknown campaign." },
};

async function configuredApp(
	db: Parameters<typeof listAppsWithSettings>[0],
	appId: string
) {
	const app = (await listAppsWithSettings(db)).find(
		(row) => row.appId === appId
	);
	if (!app?.settings) {
		throw new TRPCError({
			code: "PRECONDITION_FAILED",
			message: "Configure the app's sender on the Apps page first.",
		});
	}
	return { ...app, settings: app.settings };
}

/** The router over a gateway, so tests can drive it without Resend. */
export function createCampaignsRouter(gateway: CampaignGateway) {
	return router({
		options: adminProcedure.query(async ({ ctx }) => ({
			apps: (await listAppsWithSettings(ctx.db)).map((app) => ({
				appId: app.appId,
				configured: app.settings !== null,
				identity: identityOf(app),
				name: app.name,
				slug: app.slug,
			})),
			/** Shown in the send dialog: whether this send reaches real merchants. */
			testMode: gateway.testMode(),
		})),

		list: adminProcedure.query(({ ctx }) =>
			ctx.db
				.select({
					appName: apps.name,
					id: mailCampaigns.id,
					name: mailCampaigns.name,
					recipientCount: mailCampaigns.recipientCount,
					scheduledAt: mailCampaigns.scheduledAt,
					sentAt: mailCampaigns.sentAt,
					sentInTestMode: mailCampaigns.sentInTestMode,
					status: mailCampaigns.status,
					type: mailCampaigns.type,
					updatedAt: mailCampaigns.updatedAt,
				})
				.from(mailCampaigns)
				.innerJoin(apps, eq(apps.id, mailCampaigns.appId))
				.orderBy(desc(mailCampaigns.updatedAt))
				.limit(100)
		),

		get: adminProcedure
			.input(z.object({ id: z.uuid() }))
			.query(async ({ ctx, input }) => {
				const [campaign] = await ctx.db
					.select()
					.from(mailCampaigns)
					.where(eq(mailCampaigns.id, input.id))
					.limit(1);
				if (!campaign) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Unknown campaign.",
					});
				}
				const stats = await ctx.db
					.select({
						count: sql<number>`count(distinct coalesce(${mailEmailEvents.resendEmailId}, ${mailEmailEvents.svixId}))::int`,
						type: mailEmailEvents.type,
					})
					.from(mailEmailEvents)
					.where(eq(mailEmailEvents.campaignId, campaign.id))
					.groupBy(mailEmailEvents.type);
				return {
					campaign,
					stats: Object.fromEntries(stats.map((row) => [row.type, row.count])),
				};
			}),

		audienceCount: adminProcedure
			.input(
				z.object({
					appId: z.uuid(),
					audience: audienceSchema,
					type: z.enum(mailCampaignType.enumValues),
				})
			)
			.query(async ({ ctx, input }) => ({
				count: (
					await resolveRecipients(ctx.db, {
						appId: input.appId,
						audience: input.audience,
						category: CATEGORY_FOR_TYPE[input.type],
					})
				).length,
			})),

		create: adminProcedure
			.input(campaignFields)
			.mutation(async ({ ctx, input }) => {
				await configuredApp(ctx.db, input.appId);
				const [row] = await ctx.db
					.insert(mailCampaigns)
					.values({
						...input,
						category: CATEGORY_FOR_TYPE[input.type],
						// App clock, like every later stamp compared with it.
						contentUpdatedAt: new Date(),
						createdBy: ctx.session.user.id,
					})
					.returning({ id: mailCampaigns.id });
				return { id: row?.id ?? "" };
			}),

		update: adminProcedure
			.input(campaignFields.extend({ id: z.uuid() }))
			.mutation(async ({ ctx, input }) => {
				const { id, ...fields } = input;
				await configuredApp(ctx.db, fields.appId);
				// Any change invalidates the last test: contentUpdatedAt moves past it.
				const rows = await ctx.db
					.update(mailCampaigns)
					.set({
						...fields,
						category: CATEGORY_FOR_TYPE[fields.type],
						contentUpdatedAt: new Date(),
					})
					.where(
						and(eq(mailCampaigns.id, id), eq(mailCampaigns.status, "draft"))
					)
					.returning({ id: mailCampaigns.id });
				if (!rows[0]) {
					throw new TRPCError({
						code: "CONFLICT",
						message: "Only a draft can be edited.",
					});
				}
				return { ok: true };
			}),

		sendTest: adminProcedure
			.input(z.object({ id: z.uuid() }))
			.mutation(async ({ ctx, input }) => {
				const [campaign] = await ctx.db
					.select()
					.from(mailCampaigns)
					.where(eq(mailCampaigns.id, input.id))
					.limit(1);
				if (campaign?.status !== "draft") {
					throw new TRPCError({
						code: "CONFLICT",
						message: "Only a draft can be tested.",
					});
				}
				const app = await configuredApp(ctx.db, campaign.appId);
				const { html, text } = renderCampaign(campaign, app);
				const to = ctx.session.user.email;
				try {
					// The test goes to the admin who asked; Resend fills the
					// unsubscribe placeholder only in a broadcast.
					await sendTestEmail({
						from: fromHeader(app.settings),
						html: html.replaceAll(RESEND_UNSUBSCRIBE_URL, "#"),
						replyTo: app.settings.replyTo,
						subject: `[Test] ${campaign.subject}`,
						text: text.replaceAll(RESEND_UNSUBSCRIBE_URL, "#"),
						to,
					});
				} catch (error) {
					throw new TRPCError({
						code: "BAD_GATEWAY",
						message: `The test did not send: ${String(error)}`,
					});
				}
				await ctx.db
					.update(mailCampaigns)
					.set({ testSentAt: new Date() })
					.where(eq(mailCampaigns.id, campaign.id));
				return { to };
			}),

		send: adminProcedure
			.input(
				z.object({
					confirmCount: z.number().int().min(1),
					id: z.uuid(),
					scheduledAt: z.iso.datetime({ offset: true }).nullable(),
				})
			)
			.mutation(async ({ ctx, input }) => {
				const outcome = await startSend(ctx.db, gateway, {
					campaignId: input.id,
					confirmCount: input.confirmCount,
					scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
				});
				if (!outcome.ok) {
					const error = START_ERRORS[outcome.reason];
					throw new TRPCError({ code: error.code, message: error.message });
				}
				return { status: outcome.status };
			}),

		advance: adminProcedure
			.input(z.object({ id: z.uuid() }))
			.mutation(async ({ ctx, input }) => ({
				status: await advanceSend(ctx.db, gateway, input.id),
			})),

		cancel: adminProcedure
			.input(z.object({ id: z.uuid() }))
			.mutation(async ({ ctx, input }) => {
				const outcome = await cancelCampaign(ctx.db, gateway, input.id);
				if (outcome !== "cancelled") {
					throw new TRPCError({
						code: outcome === "failed" ? "BAD_GATEWAY" : "CONFLICT",
						message:
							outcome === "failed"
								? "Resend did not cancel the broadcast. Try again."
								: "Only a draft or a scheduled campaign can be cancelled.",
					});
				}
				return { ok: true };
			}),

		duplicate: adminProcedure
			.input(z.object({ id: z.uuid() }))
			.mutation(async ({ ctx, input }) => {
				const [source] = await ctx.db
					.select()
					.from(mailCampaigns)
					.where(eq(mailCampaigns.id, input.id))
					.limit(1);
				if (!source) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Unknown campaign.",
					});
				}
				const [row] = await ctx.db
					.insert(mailCampaigns)
					.values({
						appId: source.appId,
						audience: source.audience,
						body: source.body,
						category: source.category,
						contentUpdatedAt: new Date(),
						createdBy: ctx.session.user.id,
						ctaLabel: source.ctaLabel,
						ctaUrl: source.ctaUrl,
						eyebrow: source.eyebrow,
						headline: source.headline,
						name: `${source.name} (copy)`,
						preheader: source.preheader,
						subject: source.subject,
						type: source.type,
					})
					.returning({ id: mailCampaigns.id });
				return { id: row?.id ?? "" };
			}),
	});
}

export const campaignsRouter = createCampaignsRouter(resendGateway);
