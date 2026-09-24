"use client";

import { Button } from "@edgecoms/ui/components/button";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export interface PortalNavItem {
	href: string;
	label: string;
}

interface PortalShellProps {
	brand: string;
	children: ReactNode;
	nav: PortalNavItem[];
	/** Each app owns its auth client, so signing out is the app's job. */
	onSignOut: () => void | Promise<void>;
	user: { name: string; email: string };
}

/** A section's landing page matches exactly, or it would stay lit everywhere. */
function isActive(pathname: string, href: string): boolean {
	if (href === "/" || href.endsWith("/partner") || href.endsWith("/admin")) {
		return pathname === href;
	}
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalShell({
	brand,
	nav,
	onSignOut,
	user,
	children,
}: PortalShellProps) {
	const pathname = usePathname();

	return (
		<div className="flex h-svh flex-col overflow-hidden bg-bg">
			<header className="sticky top-0 z-40 border-border border-b bg-page/80 backdrop-blur-xl">
				<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-3">
					<div className="flex items-center gap-6">
						<Link
							className="font-medium text-primary-foreground text-sm"
							href={"/" as Route}
						>
							Edge
							<span className="text-secondary-foreground"> / {brand}</span>
						</Link>
						<nav
							aria-label={`${brand} navigation`}
							className="hidden items-center gap-1 sm:flex"
						>
							{nav.map((item) => (
								<Link
									aria-current={
										isActive(pathname, item.href) ? "page" : undefined
									}
									className={`rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
										isActive(pathname, item.href)
											? "bg-surface-item-active text-primary-foreground"
											: "text-secondary-foreground hover:text-primary-foreground"
									}`}
									href={item.href as Route}
									key={item.href}
								>
									{item.label}
								</Link>
							))}
						</nav>
					</div>
					<div className="flex items-center gap-3">
						<span className="hidden text-secondary-foreground text-xs md:inline">
							{user.email}
						</span>
						<Button onClick={onSignOut} size="md" variant="secondary">
							Sign out
						</Button>
					</div>
				</div>
				<nav
					aria-label={`${brand} navigation`}
					className="flex items-center gap-1 overflow-x-auto border-border border-t px-4 py-2 sm:hidden"
				>
					{nav.map((item) => (
						<Link
							aria-current={isActive(pathname, item.href) ? "page" : undefined}
							className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
								isActive(pathname, item.href)
									? "bg-surface-item-active text-primary-foreground"
									: "text-secondary-foreground"
							}`}
							href={item.href as Route}
							key={item.href}
						>
							{item.label}
						</Link>
					))}
				</nav>
			</header>
			<main className="flex-1 overflow-y-auto">
				<div className="mx-auto w-full max-w-7xl px-6 py-10">{children}</div>
			</main>
		</div>
	);
}
