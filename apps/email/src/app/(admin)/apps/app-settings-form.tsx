"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type FormEvent, useId } from "react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

export interface AppSettingsValues {
	senderEmail: string;
	senderName: string;
}

const FIELDS = [
	["senderName", "Sender name", "text", "Edge Cart"],
	["senderEmail", "Sender email", "email", "updates@edgecoms.app"],
] as const;

export function AppSettingsForm({
	appId,
	appName,
	settings,
}: {
	appId: string;
	appName: string;
	settings: AppSettingsValues | null;
}) {
	const router = useRouter();
	const idPrefix = useId();
	const save = useMutation(
		trpc.apps.saveSettings.mutationOptions({
			onSuccess: () => {
				toast.success(`${appName} saved`);
				router.refresh();
			},
			onError: (error) => toast.error(error.message),
		})
	);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const value = (name: string) => String(form.get(name) ?? "");
		save.mutate({
			appId,
			senderEmail: value("senderEmail"),
			senderName: value("senderName"),
		});
	}

	return (
		<form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
			{FIELDS.map(([name, label, type, placeholder]) => (
				<div className="flex flex-col gap-2" key={name}>
					<Label htmlFor={`${idPrefix}-${name}`}>{label}</Label>
					<Input
						className="bg-white"
						defaultValue={
							settings?.[name] ?? (name === "senderName" ? appName : "")
						}
						id={`${idPrefix}-${name}`}
						name={name}
						placeholder={placeholder}
						required
						type={type}
					/>
				</div>
			))}
			<div className="flex items-end sm:col-span-2">
				<Button
					disabled={save.isPending}
					size="md"
					type="submit"
					variant="primary"
				>
					{save.isPending ? "Saving…" : "Save"}
				</Button>
			</div>
		</form>
	);
}
