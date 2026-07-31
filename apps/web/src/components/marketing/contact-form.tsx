"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { Textarea } from "@edgecoms/ui/components/textarea";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";

/**
 * The teardown request. Every primary CTA on the site points here, so the form
 * is deliberately two required fields: the store URL, without which we cannot
 * do the thing we promised, and an email to send it back to. Name and notes are
 * optional — each required field costs completions, and neither of those two is
 * worth a merchant closing the tab over.
 *
 * TODO: this does not submit anywhere yet. `handleSubmit` shows a toast and
 * clears the form, which means a merchant who fills it in believes they have
 * reached us and has not. This is the single highest-priority gap on the site —
 * wire it to an endpoint (or a form service) before any traffic arrives.
 */
export function ContactForm() {
	const storeId = useId();
	const emailId = useId();
	const nameId = useId();
	const notesId = useId();
	const [submitting, setSubmitting] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitting(true);
		toast.success("Got it. We'll send your teardown within two working days.");
		event.currentTarget.reset();
		setSubmitting(false);
	}

	return (
		<form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
			<div className="flex flex-col gap-2">
				<Label htmlFor={storeId}>Your store URL</Label>
				<Input
					id={storeId}
					name="store"
					placeholder="yourstore.com"
					required
					type="text"
				/>
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
					<Label htmlFor={nameId}>Name (optional)</Label>
					<Input autoComplete="name" id={nameId} name="name" />
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={notesId}>
					Anything we should look at first? (optional)
				</Label>
				<Textarea
					id={notesId}
					name="notes"
					placeholder="AOV has been flat for a year, international traffic doesn't convert, that sort of thing."
					rows={4}
				/>
			</div>

			<div className="flex flex-col gap-3">
				<Button disabled={submitting} size="xl" type="submit" variant="brand">
					Send my store
				</Button>
				<span className="text-caption text-secondary-foreground">
					We send the teardown by email, so there is nothing to attend. If you
					would rather book a time, the audit link is on the left.
				</span>
			</div>
		</form>
	);
}
