import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-svh flex-col items-center justify-center overflow-y-auto bg-bg px-6 py-12">
			<div className="w-full max-w-sm">
				<Link
					className="mb-8 inline-block font-medium text-primary-foreground"
					href={"/" as Route}
				>
					Edge
				</Link>
				{children}
			</div>
		</div>
	);
}
