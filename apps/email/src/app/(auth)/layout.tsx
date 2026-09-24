import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-svh flex-col items-center justify-center overflow-y-auto bg-bg px-6 py-12">
			<div className="w-full max-w-sm">
				<p className="mb-8 font-medium text-primary-foreground">
					Edge <span className="text-secondary-foreground">/ Mail</span>
				</p>
				{children}
			</div>
		</div>
	);
}
