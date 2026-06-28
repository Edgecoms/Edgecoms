"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@edgecoms/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";

function Dialog(props: ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props: ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger {...props} />;
}

function DialogClose(props: ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close {...props} />;
}

function DialogContent({
	className,
	title,
	description,
	children,
}: {
	className?: string;
	title: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
			<DialogPrimitive.Popup
				className={cn(
					"fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-2xl border border-border bg-page p-6 shadow-xl transition-all duration-200 data-[ending-style]:scale-[0.97] data-[starting-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
					className
				)}
			>
				<DialogPrimitive.Title className="font-medium text-h3 text-primary-foreground">
					{title}
				</DialogPrimitive.Title>
				{description ? (
					<DialogPrimitive.Description className="mt-1 text-body-sm text-secondary-foreground">
						{description}
					</DialogPrimitive.Description>
				) : null}
				<div className="mt-5">{children}</div>
			</DialogPrimitive.Popup>
		</DialogPrimitive.Portal>
	);
}

export { Dialog, DialogClose, DialogContent, DialogTrigger };
