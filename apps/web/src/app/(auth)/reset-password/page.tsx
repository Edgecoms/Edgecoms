"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

/** Better Auth's own minimum, restated so the field can say it before submit. */
const MIN_PASSWORD_LENGTH = 8;

/**
 * Choose a new password, from the link in the reset email.
 *
 * Better Auth puts the token on the URL, or an `error` when the link was
 * already used or has expired. The expired case is the common one, so it gets
 * its own screen with a way to start again rather than a failed form.
 */
export default function ResetPasswordPage() {
	const router = useRouter();
	const params = useSearchParams();
	const passwordId = useId();
	const [loading, setLoading] = useState(false);

	const token = params.get("token");
	const linkError = params.get("error");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!token) {
			return;
		}
		const newPassword = String(
			new FormData(event.currentTarget).get("password")
		);

		setLoading(true);
		const { error } = await authClient.resetPassword({ newPassword, token });
		setLoading(false);
		if (error) {
			toast.error(error.message ?? "That link no longer works.");
			return;
		}
		toast.success("Password changed. Sign in with the new one.");
		router.push("/login" as Route);
	}

	if (!token || linkError) {
		return (
			<div className="flex flex-col gap-4">
				<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
					This link has expired
				</h1>
				<p className="text-body-sm text-secondary-foreground">
					Reset links work once and last an hour. Ask for a fresh one and use it
					straight away.
				</p>
				<Link
					className="w-fit text-body-sm text-primary-foreground underline underline-offset-4"
					href={"/forgot-password" as Route}
				>
					Send a new link
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
					Choose a new password
				</h1>
				<p className="text-body-sm text-secondary-foreground">
					Your earnings and stores are unaffected.
				</p>
			</div>

			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-2">
					<Label htmlFor={passwordId}>New password</Label>
					<Input
						autoComplete="new-password"
						id={passwordId}
						minLength={MIN_PASSWORD_LENGTH}
						name="password"
						required
						type="password"
					/>
					<span className="text-caption text-secondary-foreground">
						At least {MIN_PASSWORD_LENGTH} characters.
					</span>
				</div>
				<Button
					className="mt-2 w-full"
					disabled={loading}
					size="xl"
					type="submit"
					variant="primary"
				>
					{loading ? "Saving…" : "Save new password"}
				</Button>
			</form>
		</div>
	);
}
