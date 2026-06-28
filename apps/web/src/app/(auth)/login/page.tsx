"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
	const router = useRouter();
	const emailId = useId();
	const passwordId = useId();
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const email = String(form.get("email"));
		const password = String(form.get("password"));

		setLoading(true);
		const { data, error } = await authClient.signIn.email({ email, password });
		if (error) {
			toast.error(error.message ?? "Could not sign in");
			setLoading(false);
			return;
		}

		const role = (data?.user as { role?: string } | undefined)?.role;
		router.push((role === "admin" ? "/admin" : "/partner") as Route);
		router.refresh();
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
					Welcome back
				</h1>
				<p className="text-body-sm text-secondary-foreground">
					Sign in to your partner dashboard.
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

			<p className="text-body-sm text-secondary-foreground">
				New partner?{" "}
				<Link
					className="text-primary-foreground underline underline-offset-4"
					href={"/register" as Route}
				>
					Apply to the program
				</Link>
			</p>
		</div>
	);
}
