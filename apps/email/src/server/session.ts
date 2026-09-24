import type { Route } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { mailAuth } from "./auth";

/**
 * The admin check for a SERVER PAGE that reads data. Every such page calls it
 * itself: a layout is not an auth boundary in the App Router, because a
 * client can ask for a page segment without re-rendering its layout.
 */
export async function requireAdmin() {
	const session = await mailAuth.api.getSession({ headers: await headers() });
	if (!session) {
		redirect("/login" as Route);
	}
	if (session.user.role !== "admin") {
		notFound();
	}
	return session;
}
