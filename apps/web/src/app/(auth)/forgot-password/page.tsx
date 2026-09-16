"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import type { Route } from "next";
import Link from "next/link";
import { type FormEvent, useId, useState } from "react";
import { authClient } from "@/lib/auth-client";

/**
 * Ask for a password reset link.
 *
 * The confirmation is the SAME whether or not the address has an account. A
 * page that said "no account with that email" would let anybody check which
 * agencies are partners, one address at a time.
 */
export default function ForgotPasswordPage() {
	const emailId = useId();
	const [loading, setLoading] = useState(false);
	const [sentTo, setSentTo] = useState<string | null>(null);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const email = String(new FormData(event.currentTarget).get("email")).trim();

		setLoading(true);
		/* The outcome is deliberately not inspected: see the page comment. */
		await authClient.requestPasswordReset({
			email,
			redirectTo: "/reset-password",
		});
		setLoading(false);
		setSentTo(email);
	}

	if (sentTo) {
		return (
			<div className="flex flex-col gap-4">
				<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
					Check your email
				</h1>
				<p className="text-body-sm text-secondary-foreground">
					If {sentTo} has an Edge Partners account, a link to reset its password
					is on its way. It works once and expires in an hour.
				</p>
				<Link
					className="w-fit text-body-sm text-primary-foreground underline underline-offset-4"
					href={"/login" as Route}
				>
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
					Reset your password
				</h1>
				<p className="text-body-sm text-secondary-foreground">
					Enter the email you signed up with and we will send you a link.
				</p>
			</div>

			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-2">
					<Label htmlFor={emailId}>Email</Label>
					<Input
						autoComplete="email"
						id={emailId}
						name="email"
						required
						type="email"
					/>
				</div>
				<Button
					className="mt-2 w-full"
					disabled={loading}
					size="xl"
					type="submit"
					variant="primary"
				>
					{loading ? "Sending…" : "Send reset link"}
				</Button>
			</form>

			<p className="text-body-sm text-secondary-foreground">
				Remembered it?{" "}
				<Link
					className="text-primary-foreground underline underline-offset-4"
					href={"/login" as Route}
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
