import { createContext } from "@edgecoms/api/context";
import { db } from "@edgecoms/db";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { mailAuth } from "./auth";
import type { ResendSync } from "./events/ingest";
import { eventsRoute } from "./events/route";
import { mailRouter } from "./router";

// ponytail: placeholder until the Resend adapter lands (Phase 3).
const noSync: ResendSync = () => Promise.resolve("skipped");

/**
 * The whole HTTP surface of Edge Mail, mounted at /api by the Next catch-all.
 *
 *   /api/auth/*   Better Auth (admin sign-in; sign-up disabled)
 *   /api/trpc/*   the admin UI's typed API
 *   /api/v1/events  the Edge apps' signed event stream
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
	)
	.route("/v1/events", eventsRoute({ db, sync: noSync }));
