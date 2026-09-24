"use client";

import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { useMutation } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { count as formatCount } from "@/lib/format";
import { queryClient, trpc } from "@/utils/trpc";
import { FIELD } from "./shared";

/**
 * The last gate before a send. It names the campaign, the number of people
 * and the category, and sends the count back to the server, which refuses if
 * the audience moved since this dialog opened.
 */
export function SendDialog({
	campaignId,
	categoryLabel,
	name,
	onOpenChange,
	open,
	recipients,
	testMode,
}: {
	campaignId: string;
	categoryLabel: string;
	name: string;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	recipients: number;
	testMode: boolean;
}) {
	const scheduleId = useId();
	const [scheduleAt, setScheduleAt] = useState("");
	const send = useMutation(
		trpc.campaigns.send.mutationOptions({
			onSuccess: async () => {
				onOpenChange(false);
				await queryClient.invalidateQueries();
			},
			onError: async (error) => {
				toast.error(error.message);
				await queryClient.invalidateQueries();
			},
		})
	);
	const verb = scheduleAt ? "Schedule" : "Send";

	return (
		<ConfirmDialog
			confirmLabel={`${verb} ${formatCount(recipients)} emails`}
			description="This cannot be undone once sending begins."
			onConfirm={() =>
				send.mutate({
					confirmCount: recipients,
					id: campaignId,
					scheduledAt: scheduleAt ? new Date(scheduleAt).toISOString() : null,
				})
			}
			onOpenChange={onOpenChange}
			open={open}
			pending={send.isPending}
			title="Send this campaign?"
		>
			<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-body-sm">
				<dt className="text-secondary-foreground">Campaign</dt>
				<dd className="text-primary-foreground">{name}</dd>
				<dt className="text-secondary-foreground">Recipients</dt>
				<dd className="text-primary-foreground tabular-nums">
					{formatCount(recipients)}
				</dd>
				<dt className="text-secondary-foreground">Category</dt>
				<dd className="text-primary-foreground">{categoryLabel}</dd>
			</dl>
			<p
				className={`mt-4 rounded-lg border p-3 text-body-sm ${
					testMode
						? "border-border text-secondary-foreground"
						: "border-rose-300 bg-rose-50 text-rose-800"
				}`}
			>
				{testMode
					? "Test mode is on: this goes to the test inbox only. No merchant receives it."
					: "Test mode is OFF: real merchants receive this."}
			</p>
			<div className="mt-4 flex flex-col gap-2">
				<Label htmlFor={scheduleId}>Schedule (optional, your local time)</Label>
				<Input
					className={FIELD}
					id={scheduleId}
					onChange={(event) => setScheduleAt(event.target.value)}
					type="datetime-local"
					value={scheduleAt}
				/>
			</div>
		</ConfirmDialog>
	);
}
