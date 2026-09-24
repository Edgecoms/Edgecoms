/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { createCallerFactory } from "@edgecoms/api";
import type { Context } from "@edgecoms/api/context";
import { mailRouter } from "../router";

/**
 * Edge Mail's authorization boundary: every admin procedure refuses a missing
 * session and a partner session. The layout redirect is cosmetic; this is the
 * check that holds.
 */

const createCaller = createCallerFactory(mailRouter);

function callerAs(role: "admin" | "partner" | null) {
	const session =
		role === null
			? null
			: { user: { email: `${role}@edgecoms.app`, name: role, role } };
	return createCaller({ db: {}, session } as unknown as Context);
}

describe("mail router authorization", () => {
	test("refuses an anonymous caller", async () => {
		await expect(callerAs(null).me()).rejects.toMatchObject({
			code: "UNAUTHORIZED",
		});
	});

	test("refuses a partner", async () => {
		await expect(callerAs("partner").me()).rejects.toMatchObject({
			code: "FORBIDDEN",
		});
	});

	test("allows an admin", async () => {
		await expect(callerAs("admin").me()).resolves.toEqual({
			email: "admin@edgecoms.app",
			name: "admin",
		});
	});
});
