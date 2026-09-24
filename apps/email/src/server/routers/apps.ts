import { adminProcedure, router } from "@edgecoms/api";
import { apps } from "@edgecoms/db/schema/apps";
import { mailAppSettings } from "@edgecoms/db/schema/mail";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const appSettingsInput = z.object({
	appId: z.uuid(),
	senderName: z.string().trim().min(1).max(80),
	senderEmail: z.email().max(320),
});

export const appsRouter = router({
	saveSettings: adminProcedure
		.input(appSettingsInput)
		.mutation(async ({ ctx, input }) => {
			const [app] = await ctx.db
				.select({ id: apps.id })
				.from(apps)
				.where(eq(apps.id, input.appId))
				.limit(1);
			if (!app) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Unknown app" });
			}
			const { appId, ...settings } = input;
			await ctx.db
				.insert(mailAppSettings)
				.values({ appId, ...settings })
				.onConflictDoUpdate({ target: mailAppSettings.appId, set: settings });
			return { ok: true };
		}),
});
