import { createContext } from "@edgecoms/api/context";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { mailAuth } from "./auth";
import { mailRouter } from "./router";

/**
 * The whole HTTP surface of Edge Mail, mounted at /api by the Next catch-all.
 *
 *   /api/auth/*   Better Auth (admin sign-in; sign-up disabled)
 *   /api/trpc/*   the admin UI's typed API
 */
export const api = new Hono()
	.basePath("/api")
	.on(["GET", "POST"], "/auth/*", (c) => mailAuth.handler(c.req.raw))
	.use(
		"/trpc/*",
		trpcServer({
			endpoint: "/api/trpc",
			router: mailRouter,
			createContext: (_opts, c) => createContext(c.req.raw),
		})
	);
