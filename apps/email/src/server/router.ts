import { adminProcedure, router } from "@edgecoms/api";

/**
 * Edge Mail's tRPC router. Every procedure is an `adminProcedure` unless it is
 * the token-gated preferences page: Edge Mail has no partner surface at all.
 */
export const mailRouter = router({
	me: adminProcedure.query(({ ctx }) => ({
		email: ctx.session.user.email,
		name: ctx.session.user.name,
	})),
});

export type MailRouter = typeof mailRouter;
