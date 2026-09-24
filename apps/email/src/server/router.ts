import { adminProcedure, router } from "@edgecoms/api";
import { appsRouter } from "./routers/apps";
import { contactsRouter } from "./routers/contacts";

/**
 * Edge Mail's tRPC router. Every procedure is an `adminProcedure` unless it is
 * the token-gated preferences page: Edge Mail has no partner surface at all.
 */
export const mailRouter = router({
	apps: appsRouter,
	contacts: contactsRouter,
	me: adminProcedure.query(({ ctx }) => ({
		email: ctx.session.user.email,
		name: ctx.session.user.name,
	})),
});

export type MailRouter = typeof mailRouter;
