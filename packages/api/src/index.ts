import { partners } from "@edgecoms/db/schema/partners";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure;

/**
 * Authenticated: a valid Better Auth session must exist. Narrows `ctx.session`
 * to non-null for downstream procedures.
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Authentication required",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});

/**
 * Admin only. Asserts the admin role on every admin operation (CLAUDE.md
 * "Multi-tenant authorization").
 */
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
	if (ctx.session.user.role !== "admin") {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Admin role required",
		});
	}
	return next({ ctx });
});

/**
 * Partner only, with tenant isolation enforced at the data layer. The caller's
 * `partner` row is resolved FROM THE SESSION (never from client input) and
 * injected into the context. Every partner-scoped query must filter by
 * `ctx.partner.id` — a partner can never read or write another partner's data
 * (CLAUDE.md "Multi-tenant authorization").
 */
export const partnerProcedure = protectedProcedure.use(
	async ({ ctx, next }) => {
		if (ctx.session.user.role !== "partner") {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Partner role required",
			});
		}

		const partner = await ctx.db.query.partners.findFirst({
			where: eq(partners.userId, ctx.session.user.id),
		});

		if (!partner) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "No partner profile for this account",
			});
		}

		return next({
			ctx: {
				...ctx,
				partner,
			},
		});
	}
);
