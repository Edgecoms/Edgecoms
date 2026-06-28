import { db, pool } from "@edgecoms/db";
import { user } from "@edgecoms/db/schema/auth";
import { partners } from "@edgecoms/db/schema/partners";
import { eq } from "drizzle-orm";
import { auth } from "./index";

/**
 * Creates (or re-promotes) the admin user from env. Idempotent. Because the
 * `role` field is `input: false` at sign-up, the role is ALWAYS set here via a
 * direct update — there is no way to self-register as an admin.
 *
 * Run with: `bun run db:create-admin` with ADMIN_EMAIL / ADMIN_PASSWORD set.
 */
async function createAdmin() {
	const email = process.env.ADMIN_EMAIL;
	const password = process.env.ADMIN_PASSWORD;
	const name = process.env.ADMIN_NAME ?? "Edge Admin";

	if (!(email && password)) {
		throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
	}

	const existing = await db.query.user.findFirst({
		where: eq(user.email, email),
	});

	if (existing) {
		process.stdout.write(`User ${email} already exists; promoting to admin.\n`);
	} else {
		await auth.api.signUpEmail({ body: { email, password, name } });
		process.stdout.write(`Created user ${email}.\n`);
	}

	await db.update(user).set({ role: "admin" }).where(eq(user.email, email));

	// Remove the partner profile auto-provisioned at sign-up — admins are not
	// partners. Safe: a fresh admin has no merchants, so the restrict FK allows it.
	const adminUser = await db.query.user.findFirst({
		where: eq(user.email, email),
		columns: { id: true },
	});
	if (adminUser) {
		await db.delete(partners).where(eq(partners.userId, adminUser.id));
	}

	process.stdout.write(`Admin ready: ${email}\n`);
}

createAdmin()
	.then(() => pool.end())
	.then(() => process.exit(0))
	.catch((error) => {
		process.stderr.write(`Create admin failed: ${String(error)}\n`);
		pool.end().finally(() => process.exit(1));
	});
