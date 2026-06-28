import { auth } from "@edgecoms/auth";
import { db } from "@edgecoms/db";
import type { NextRequest } from "next/server";

/**
 * Per-request tRPC context. `session` is resolved from the Better Auth cookies;
 * `db` is the shared Drizzle client. Authorization (role checks, tenant scoping)
 * is layered on top of this in the procedure hierarchy — see ./index.ts.
 */
export async function createContext(req: NextRequest) {
	const session = await auth.api.getSession({
		headers: req.headers,
	});

	return {
		db,
		session,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
