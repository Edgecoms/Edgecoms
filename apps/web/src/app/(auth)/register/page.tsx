"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { trackStandard } from "@/lib/meta-pixel";
import { trpc } from "@/utils/trpc";

export default function RegisterPage() {
	const router = useRouter();
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const [loading, setLoading] = useState(false);

	/**
	 * An invited agency arrives at `/register?invite=<token>`.
	 *
	 * The token buys one thing: the address it was sent to, so the partner
	 * cannot fat-finger a different one and land in the program unlinked from
	 * the rate the admin proposed. It buys no privileges: accepting still
	 * creates the same pending application a cold signup creates.
	 *
	 * An absent, expired or spent token simply yields no invite, and the page is
	 * the ordinary open application form.
	 */
	const inviteToken = useSearchParams().get("invite");
	const { data: invite } = useQuery({
		...trpc.invites.peek.queryOptions({ token: inviteToken ?? "" }),
		enabled: Boolean(inviteToken),
	});

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const name = String(form.get("name"));
		const email = String(form.get("email"));
		const password = String(form.get("password"));

		setLoading(true);
		/* After verifying, the link lands them where the invite is claimed.
		   Claiming now would be refused: the address is not proven yet. */
		const { error } = await authClient.signUp.email({
			callbackURL: inviteToken
				? `/partner?invite=${encodeURIComponent(inviteToken)}`
				: "/partner",
			email,
			name,
			password,
		});
		if (error) {
			toast.error(error.message ?? "Could not create account");
			setLoading(false);
			return;
		}

		/**
		 * Fired on success only, and before the redirect -- the pixel is blind to
		 * `/partner`, so reporting it after the push would report nothing. No
		 * name or email goes with it: Meta gets the fact of a signup, not who.
		 */
		trackStandard("CompleteRegistration", {
			content_name: "Partner application",
			status: "pending",
		});

		toast.success(
			"Account created. Check your email for a link to confirm your address."
		);
		router.push(
			(inviteToken
				? `/partner?invite=${encodeURIComponent(inviteToken)}`
				: "/partner") as Route
		);
		router.refresh();
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="font-medium text-h2 text-primary-foreground tracking-tight">
					{invite
						? "Accept your Edge Partners invitation"
						: "Apply to the Partner Program"}
				</h1>
				<p className="text-body-sm text-secondary-foreground">
					{invite?.companyName
						? `Create the account for ${invite.companyName}. We review it, set your commission rate, and email you your code.`
						: "Create your account. We review it, set your commission rate, and email you the code you hand to the stores you manage."}
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
						defaultValue={invite?.email ?? ""}
						id={emailId}
						key={invite?.email ?? "open"}
						name="email"
						readOnly={Boolean(invite)}
						required
						type="email"
					/>
					{invite ? (
						<span className="text-caption text-secondary-foreground">
							The address your invitation was sent to.
						</span>
					) : null}
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
