"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

/** Admins only. There is no sign-up here: accounts come from the partner platform. */
export default function LoginPage() {
	const router = useRouter();
	const emailId = useId();
	const passwordId = useId();
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		setLoading(true);
		const { error } = await authClient.signIn.email({
			email: String(form.get("email")),
			password: String(form.get("password")),
		});
		if (error) {
			toast.error(error.message ?? "Could not sign in");
			setLoading(false);
			return;
		}
		router.push("/" as Route);
		router.refresh();
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
					Sign in
				</h1>
				<p className="text-body-sm text-secondary-foreground">
					Use your Edge admin account.
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
				<div className="flex flex-col gap-2">
					<Label htmlFor={passwordId}>Password</Label>
					<Input
						autoComplete="current-password"
						id={passwordId}
						name="password"
						required
						type="password"
					/>
				</div>
				<Button
					className="mt-2 w-full"
					disabled={loading}
					size="xl"
					type="submit"
					variant="primary"
				>
					{loading ? "Signing in…" : "Sign in"}
				</Button>
			</form>
		</div>
	);
}
