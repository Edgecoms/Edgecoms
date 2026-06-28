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

export default function RegisterPage() {
	const router = useRouter();
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const name = String(form.get("name"));
		const email = String(form.get("email"));
		const password = String(form.get("password"));

		setLoading(true);
		const { error } = await authClient.signUp.email({ name, email, password });
		if (error) {
			toast.error(error.message ?? "Could not create account");
			setLoading(false);
			return;
		}

		toast.success("Account created — your application is pending review.");
		router.push("/partner" as Route);
		router.refresh();
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
					Apply to the Partner Program
				</h1>
				<p className="text-body-sm text-secondary-foreground">
					Create your account. Once approved, you can register merchants and
					track commission.
				</p>
			</div>

			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-2">
					<Label htmlFor={nameId}>Name</Label>
					<Input autoComplete="name" id={nameId} name="name" required />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor={emailId}>Work email</Label>
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
						autoComplete="new-password"
						id={passwordId}
						minLength={8}
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
					{loading ? "Creating account…" : "Create account"}
				</Button>
			</form>

			<p className="text-body-sm text-secondary-foreground">
				Already a partner?{" "}
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
