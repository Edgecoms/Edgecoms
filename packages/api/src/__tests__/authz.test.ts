import { describe, expect, test } from "bun:test";
import type { Context } from "../context";
import { createCallerFactory } from "../index";
import { appRouter } from "../routers/index";

const createCaller = createCallerFactory(appRouter);

type PartnerRow = { id: string; userId: string } | undefined;

interface CallerOptions {
	merchants?: unknown[];
	partnerRow?: PartnerRow;
	partnersList?: unknown[];
	session?: unknown;
}

/**
 * Builds a tRPC caller over a FAKE context. No real DB: the partner middleware's
 * `partners.findFirst` and the routers' list queries are stubbed, so these tests
 * exercise pure authorization logic.
 */
function makeCaller(options: CallerOptions) {
	const fakeDb = {
		query: {
			partners: {
				findFirst: () => Promise.resolve(options.partnerRow),
				findMany: () => Promise.resolve(options.partnersList ?? []),
			},
			merchants: {
				findMany: () => Promise.resolve(options.merchants ?? []),
			},
		},
	};

	const ctx = {
		db: fakeDb,
		session: options.session ?? null,
	} as unknown as Context;

	return createCaller(ctx);
}

const partnerSession = (userId: string) => ({
	user: { id: userId, role: "partner" },
	session: { userId },
});

const adminSession = (userId = "admin-1") => ({
	user: { id: userId, role: "admin" },
	session: { userId },
});

/** Resolves to the thrown tRPC error code, or "NO_ERROR" if it didn't throw. */
async function errorCode(promise: Promise<unknown>): Promise<string> {
	try {
		await promise;
		return "NO_ERROR";
	} catch (error) {
		return (error as { code?: string }).code ?? "UNKNOWN";
	}
}

describe("public + protected procedures", () => {
	test("healthCheck is public", async () => {
		const caller = makeCaller({ session: null });
		expect(await caller.healthCheck()).toBe("OK");
	});

	test("protected procedure rejects an anonymous caller", async () => {
		const caller = makeCaller({ session: null });
		expect(await errorCode(caller.privateData())).toBe("UNAUTHORIZED");
	});
});

describe("adminProcedure", () => {
	test("rejects an anonymous caller", async () => {
		const caller = makeCaller({ session: null });
		expect(await errorCode(caller.admin.ping())).toBe("UNAUTHORIZED");
	});

	test("rejects a non-admin (partner) caller", async () => {
		const caller = makeCaller({
			session: partnerSession("user-A"),
			partnerRow: { id: "partner-A", userId: "user-A" },
		});
		expect(await errorCode(caller.admin.ping())).toBe("FORBIDDEN");
	});

	test("allows an admin caller", async () => {
		const caller = makeCaller({ session: adminSession() });
		expect(await caller.admin.ping()).toBe("admin-ok");
	});
});

describe("partnerProcedure — tenant isolation", () => {
	test("rejects an admin (wrong role) caller", async () => {
		const caller = makeCaller({ session: adminSession() });
		expect(await errorCode(caller.partner.me())).toBe("FORBIDDEN");
	});

	test("rejects a partner-role user with no partner profile", async () => {
		const caller = makeCaller({
			session: partnerSession("user-orphan"),
			partnerRow: undefined,
		});
		expect(await errorCode(caller.partner.me())).toBe("FORBIDDEN");
	});

	test("resolves the partner from the session", async () => {
		const caller = makeCaller({
			session: partnerSession("user-A"),
			partnerRow: { id: "partner-A", userId: "user-A" },
		});
		const me: { id: string; userId: string } = await caller.partner.me();
		expect(me).toEqual({ id: "partner-A", userId: "user-A" });
	});

	test("derives scope from the session and IGNORES a forged input id", async () => {
		const caller = makeCaller({
			session: partnerSession("user-A"),
			partnerRow: { id: "partner-A", userId: "user-A" },
		});

		// Caller forges another partner's id in the input.
		const result = await caller.partner.scope({ partnerId: "partner-B" });

		// The resolved scope is ALWAYS the session's partner, never the input.
		expect(result.resolvedPartnerId).toBe("partner-A");
		expect(result.ignoredInputPartnerId).toBe("partner-B");
	});

	test("nested merchants.list is gated: an admin is rejected before any query", async () => {
		const caller = makeCaller({ session: adminSession() });
		expect(await errorCode(caller.partner.merchants.list())).toBe("FORBIDDEN");
	});
});
