"use server";

import { courseLeads } from "@edgecoms/db/schema/course-leads";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
	type LeadFieldErrors,
	type LeadState,
	type LeadValues,
	leadSchema,
} from "@/lib/lead-schema";

/** Shown whenever we cannot store the lead. Never a fake success. */
const FALLBACK_CONTACT = "hello@edgecoms.com";

/**
 * Captures a course signup.
 *
 * FAILS CLOSED, and that is the whole point of this file. Every other form in
 * this organisation's codebase calls `toast.success()` and drops the data on
 * the floor — a visitor believes they have signed up and never hears back. This
 * one only reports success after a row is committed. If the database is
 * unreachable or unconfigured, the visitor is told plainly and given an address
 * that reaches a human.
 *
 * Idempotent on the normalised email: submitting twice updates the existing row
 * instead of erroring or duplicating, so a double-click is harmless and a
 * returning visitor can correct a typo in their phone number.
 */
export async function submitLead(
	_previous: LeadState,
	formData: FormData
): Promise<LeadState> {
	const raw = {
		email: String(formData.get("email") ?? ""),
		name: String(formData.get("name") ?? ""),
		phone: String(formData.get("phone") ?? ""),
		website: String(formData.get("website") ?? ""),
	};

	// Echoed back on every failure so the form can be re-populated. React 19
	// resets an uncontrolled form on submit whatever the outcome, so without
	// this a rejected submission hands the visitor three empty boxes and an
	// error message about the one they got wrong.
	const values: LeadValues = {
		email: raw.email,
		name: raw.name,
		phone: raw.phone,
	};

	const parsed = leadSchema.safeParse(raw);

	if (!parsed.success) {
		const fieldErrors: LeadFieldErrors = {};

		for (const issue of parsed.error.issues) {
			const field = issue.path[0];

			if (field === "email" || field === "name" || field === "phone") {
				fieldErrors[field] ??= issue.message;
			}
		}

		// A filled honeypot produces no field error, because the field is hidden
		// and there is nothing to point at. Answer as though it worked: a bot
		// that is told it failed simply tries again.
		if (Object.keys(fieldErrors).length === 0) {
			return { message: "Thanks — check your inbox.", status: "success" };
		}

		return {
			fieldErrors,
			message: "Please check the highlighted fields.",
			status: "error",
			values,
		};
	}

	const db = getDb();

	if (!db) {
		// Unconfigured deploy. Loud in the server log, honest in the browser.
		console.error(
			"[course] DATABASE_URL is not set — a signup could not be stored."
		);

		return {
			message: `Something went wrong on our end and we could not save your details. Please email ${FALLBACK_CONTACT} and we will send your access manually.`,
			status: "error",
			values,
		};
	}

	try {
		await db
			.insert(courseLeads)
			.values({
				email: parsed.data.email,
				name: parsed.data.name,
				phone: parsed.data.phone,
				source: "course-landing",
			})
			.onConflictDoUpdate({
				set: {
					name: parsed.data.name,
					phone: parsed.data.phone,
					updatedAt: sql`now()`,
				},
				target: courseLeads.email,
			});
	} catch (error) {
		console.error("[course] Failed to store signup:", error);

		return {
			message: `Something went wrong on our end and we could not save your details. Please email ${FALLBACK_CONTACT} and we will send your access manually.`,
			status: "error",
			values,
		};
	}

	return {
		message:
			"You're in. We'll send your access link to that email shortly — check your spam folder if it hasn't arrived within a few minutes.",
		status: "success",
	};
}
