import { adminProcedure, router } from "@edgecoms/api";
import { appsRouter } from "./routers/apps";
import { campaignsRouter } from "./routers/campaigns";
import { contactsRouter } from "./routers/contacts";
import { preferencesRouter } from "./routers/preferences";

/**
 * Edge Mail's tRPC router. Every procedure is an `adminProcedure` unless it is
 * the token-gated preferences page: Edge Mail has no partner surface at all.
 */
export const mailRouter = router({
	apps: appsRouter,
	campaigns: campaignsRouter,
	contacts: contactsRouter,
	preferences: preferencesRouter,
	me: adminProcedure.query(({ ctx }) => ({
		email: ctx.session.user.email,
		name: ctx.session.user.name,
	})),
});

export type MailRouter = typeof mailRouter;
