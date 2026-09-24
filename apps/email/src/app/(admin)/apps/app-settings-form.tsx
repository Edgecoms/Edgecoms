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
	appUrl: string | null;
	brandColor: string;
	logoUrl: string | null;
	replyTo: string | null;
	reviewUrl: string | null;
	senderEmail: string;
	senderName: string;
	supportUrl: string | null;
}

const FIELDS = [
	["senderName", "Sender name", "text", "Edge Cart"],
	["senderEmail", "Sender email", "email", "updates@edgecoms.app"],
	["replyTo", "Reply-to (optional)", "email", ""],
	["appUrl", "App URL", "url", "https://admin.shopify.com/..."],
	["supportUrl", "Support URL", "url", "https://edgecoms.app/support"],
	[
		"reviewUrl",
		"App Store review URL",
		"url",
		"https://apps.shopify.com/...#reviews",
	],
	["logoUrl", "Logo URL (optional)", "url", ""],
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
			appUrl: value("appUrl"),
			brandColor: value("brandColor"),
			logoUrl: value("logoUrl"),
			replyTo: value("replyTo"),
			reviewUrl: value("reviewUrl"),
			senderEmail: value("senderEmail"),
			senderName: value("senderName"),
			supportUrl: value("supportUrl"),
		});
	}

	return (
		<form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
			{FIELDS.map(([name, label, type, placeholder]) => (
				<div className="flex flex-col gap-2" key={name}>
					<Label htmlFor={`${idPrefix}-${name}`}>{label}</Label>
					<Input
						defaultValue={
							settings?.[name] ?? (name === "senderName" ? appName : "")
						}
						id={`${idPrefix}-${name}`}
						name={name}
						placeholder={placeholder}
						required={name === "senderName" || name === "senderEmail"}
						type={type}
					/>
				</div>
			))}
			<div className="flex flex-col gap-2">
				<Label htmlFor={`${idPrefix}-brandColor`}>Brand colour</Label>
				<input
					className="h-10 w-20 cursor-pointer rounded-md border border-border-strong bg-surface"
					defaultValue={settings?.brandColor ?? "#ff5e1f"}
					id={`${idPrefix}-brandColor`}
					name="brandColor"
					type="color"
				/>
			</div>
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
