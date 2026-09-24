"use client";

import { Button } from "@edgecoms/ui/components/button";
import { useMutation } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";
import { trpc } from "@/utils/trpc";

const CATEGORIES = [
	[
		"productUpdates",
		"Product updates",
		"New features and important improvements",
	],
	["education", "Tips & education", "Guides and optimisation tips"],
	["marketing", "Offers & promotions", "Discounts and special offers"],
] as const;

type Key = (typeof CATEGORIES)[number][0];

export function PreferencesForm({
	initial,
	token,
}: {
	initial: Record<Key, boolean>;
	token: string;
}) {
	const [values, setValues] = useState(initial);
	const save = useMutation(trpc.preferences.save.mutationOptions());

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		save.mutate({ ...values, token });
	}

	return (
		<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
			<div className="flex items-start justify-between gap-6 border-border border-b pb-5">
				<div>
					<p className="font-medium text-body text-primary-foreground">
						Essential account emails
					</p>
					<p className="text-body-sm text-secondary-foreground">
						About your account, billing and anything you asked for.
					</p>
				</div>
				<span className="text-body-sm text-secondary-foreground">Required</span>
			</div>
			{CATEGORIES.map(([key, label, description]) => (
				<label
					className="flex items-start justify-between gap-6 border-border border-b pb-5"
					key={key}
				>
					<span>
						<span className="block font-medium text-body text-primary-foreground">
							{label}
						</span>
						<span className="block text-body-sm text-secondary-foreground">
							{description}
						</span>
					</span>
					<input
						checked={values[key]}
						className="mt-1 size-4"
						onChange={(event) =>
							setValues((current) => ({
								...current,
								[key]: event.target.checked,
							}))
						}
						type="checkbox"
					/>
				</label>
			))}
			<Button
				disabled={save.isPending}
				size="xl"
				type="submit"
				variant="primary"
			>
				{save.isPending ? "Saving…" : "Save preferences"}
			</Button>
			<p aria-live="polite" className="text-body-sm text-secondary-foreground">
				{save.isSuccess ? "Saved. Your choices apply to every Edge app." : null}
				{save.isError ? "That did not save. Please try again." : null}
			</p>
		</form>
	);
}
