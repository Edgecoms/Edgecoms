"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { Textarea } from "@edgecoms/ui/components/textarea";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";

export function ContactForm() {
	const nameId = useId();
	const emailId = useId();
	const companyId = useId();
	const messageId = useId();
	const [submitting, setSubmitting] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmitting(true);
		// Wired to a notification toast for now; a contact endpoint lands later.
		toast.success("Thanks — we'll be in touch shortly.");
		event.currentTarget.reset();
		setSubmitting(false);
	}

	return (
		<form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<Label htmlFor={nameId}>Name</Label>
					<Input autoComplete="name" id={nameId} name="name" required />
				</div>
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
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={companyId}>Company</Label>
				<Input autoComplete="organization" id={companyId} name="company" />
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={messageId}>How can we help?</Label>
				<Textarea id={messageId} name="message" required rows={5} />
			</div>

			<div>
				<Button disabled={submitting} size="xl" type="submit" variant="primary">
					Send message
				</Button>
			</div>
		</form>
	);
}
