"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Checkbox } from "@edgecoms/ui/components/checkbox";
import { Label } from "@edgecoms/ui/components/label";
import { useMutation } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
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
	const id = useId();
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
				<div
					className="flex items-start justify-between gap-6 border-border border-b pb-5"
					key={key}
				>
					<div>
						<Label
							className="block font-medium text-body text-primary-foreground"
							htmlFor={`${id}-${key}`}
						>
							{label}
						</Label>
						<span className="block text-body-sm text-secondary-foreground">
							{description}
						</span>
					</div>
					<Checkbox
						checked={values[key]}
						className="mt-1"
						id={`${id}-${key}`}
						onCheckedChange={(checked) =>
							setValues((current) => ({ ...current, [key]: checked }))
						}
					/>
				</div>
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
