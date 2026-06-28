"use client";

import { Button } from "@edgecoms/ui/components/button";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex h-svh flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
			<div className="flex flex-col gap-2">
				<span className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.1em]">
					Error
				</span>
				<h1 className="font-medium text-h1 text-primary-foreground tracking-tight">
					Something went wrong
				</h1>
				<p className="max-w-sm text-pretty text-body-sm text-secondary-foreground">
					An unexpected error occurred. Try again, and if it persists, contact
					support.
				</p>
				{error.digest ? (
					<span className="font-mono text-caption text-secondary-foreground">
						Reference: {error.digest}
					</span>
				) : null}
			</div>
			<Button onClick={() => reset()} size="xl" variant="primary">
				Try again
			</Button>
		</div>
	);
}
