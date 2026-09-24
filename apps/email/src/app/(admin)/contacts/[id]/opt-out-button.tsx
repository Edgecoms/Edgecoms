"use client";

import { Button } from "@edgecoms/ui/components/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { trpc } from "@/utils/trpc";

/** For a merchant who asked support to stop. One-way by design. */
export function OptOutButton({ contactId }: { contactId: string }) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const optOut = useMutation(
		trpc.contacts.optOut.mutationOptions({
			onSuccess: () => {
				toast.success("Opted out of all categories");
				setOpen(false);
				router.refresh();
			},
			onError: (error) => toast.error(error.message),
		})
	);
	return (
		<>
			<Button onClick={() => setOpen(true)} size="md" variant="secondary">
				Opt out of everything
			</Button>
			<ConfirmDialog
				confirmLabel="Opt out"
				description="Product updates, education and marketing all switch off. Only the merchant can switch them back on, from their preferences page."
				onConfirm={() => optOut.mutate({ contactId })}
				onOpenChange={setOpen}
				open={open}
				pending={optOut.isPending}
				title="Opt this contact out?"
			/>
		</>
	);
}
