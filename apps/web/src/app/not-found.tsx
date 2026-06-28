import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";

export default function NotFound() {
	return (
		<div className="flex h-svh flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
			<div className="flex flex-col gap-2">
				<span className="font-medium font-mono text-label text-secondary-foreground uppercase tracking-[0.1em]">
					404
				</span>
				<h1 className="font-medium text-h1 text-primary-foreground tracking-tight">
					Page not found
				</h1>
				<p className="max-w-sm text-pretty text-body-sm text-secondary-foreground">
					The page you're looking for doesn't exist or has moved.
				</p>
			</div>
			<ButtonLink href={"/" as Route} size="xl" variant="primary">
				Back to home
			</ButtonLink>
		</div>
	);
}
