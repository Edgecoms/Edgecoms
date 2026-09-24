/// <reference types="bun" />
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createCallerFactory } from "@edgecoms/api";
import { createTestDb, type TestDb } from "@edgecoms/api/__tests__/db-harness";
import type { Context } from "@edgecoms/api/context";
import { mailContacts } from "@edgecoms/db/schema/mail";
import { eq } from "drizzle-orm";
import { signPreferencesToken } from "../preferences/token";
import { mailRouter } from "../router";

/**
 * The preferences page is public: its token is the only credential. It must
 * change exactly the contact it was issued for, and nothing for anyone else.
 */

const SECRET = "s".repeat(32);
let testDb: TestDb;
let alice: string;
let bob: string;

const anonymous = () =>
	createCallerFactory(mailRouter)({
		db: testDb.db,
		session: null,
	} as unknown as Context);

beforeEach(async () => {
	process.env.EDGE_MAIL_PREFERENCES_SECRET = SECRET;
	testDb = await createTestDb();
	const rows = await testDb.db
		.insert(mailContacts)
		.values([{ email: "alice@a.com" }, { email: "bob@b.com" }])
		.returning();
	alice = rows[0]?.id ?? "";
	bob = rows[1]?.id ?? "";
});

afterEach(async () => {
	await testDb.close();
});

const choice = { education: false, marketing: true, productUpdates: true };

async function row(id: string) {
	const [contact] = await testDb.db
		.select()
		.from(mailContacts)
		.where(eq(mailContacts.id, id));
	return contact;
}

describe("preferences", () => {
	test("a valid link saves that contact's choice and records when", async () => {
		await anonymous().preferences.save({
			...choice,
			token: signPreferencesToken(alice, SECRET) ?? "",
		});
		const saved = await row(alice);
		expect(saved?.marketing).toBe(true);
		expect(saved?.productUpdates).toBe(true);
		expect(saved?.preferencesSetAt).not.toBeNull();
		expect((await row(bob))?.marketing).toBe(false);
	});

	test("alice's signature on bob's id changes nobody", async () => {
		const signature = (signPreferencesToken(alice, SECRET) ?? "").split(".")[1];
		await expect(
			anonymous().preferences.save({ ...choice, token: `${bob}.${signature}` })
		).rejects.toMatchObject({ code: "NOT_FOUND" });
		expect((await row(bob))?.marketing).toBe(false);
	});

	test("no secret configured means no link works", async () => {
		const token = signPreferencesToken(alice, SECRET) ?? "";
		Reflect.deleteProperty(process.env, "EDGE_MAIL_PREFERENCES_SECRET");
		await expect(
			anonymous().preferences.save({ ...choice, token })
		).rejects.toMatchObject({ code: "NOT_FOUND" });
		expect((await row(alice))?.marketing).toBe(false);
	});
});
