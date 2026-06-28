import { protectedProcedure, publicProcedure, router } from "../index";
import { adminRouter } from "./admin";
import { partnerRouter } from "./partner";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => "OK"),
	privateData: protectedProcedure.query(({ ctx }) => ({
		message: "This is private",
		user: ctx.session.user,
	})),
	partner: partnerRouter,
	admin: adminRouter,
});

export type AppRouter = typeof appRouter;
