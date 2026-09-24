"use client";

import { Button } from "@edgecoms/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
} from "@edgecoms/ui/components/dialog";
import type { ReactNode } from "react";

/** A decision that needs a second, deliberate click. */
export function ConfirmDialog({
	children,
	confirmLabel,
	description,
	onConfirm,
	onOpenChange,
	open,
	pending,
	title,
}: {
	children?: ReactNode;
	confirmLabel: string;
	description?: string;
	onConfirm: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	pending: boolean;
	title: string;
}) {
	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent description={description} title={title}>
				{children}
				<div className="mt-6 flex items-center justify-end gap-3">
					<DialogClose
						render={
							<Button size="lg" type="button" variant="secondary">
								Cancel
							</Button>
						}
					/>
					<Button
						disabled={pending}
						onClick={onConfirm}
						size="lg"
						type="button"
						variant="primary"
					>
						{confirmLabel}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
