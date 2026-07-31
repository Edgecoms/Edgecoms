"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";
import Link from "next/link";
import Logo from "../ui/logo";

const links = [
	{ to: "/products", label: "Products" },
	{ to: "/partners", label: "Partners" },
	{ to: "/about", label: "About" },
] as const;

export default function Header() {
	return (
		/* Opaque, not translucent. The homepage now scrolls full-bleed orange
		   panels under this bar, and at --white-a1 the brand colour came
		   straight through and dropped the grey nav links to unreadable. A
		   blurred tint cannot be made safe against an arbitrary backdrop, so
		   the bar owns its own surface instead. */
		<header className="sticky inset-x-0 top-0 z-50 h-(--header-height) items-stretch border-border border-b bg-bg">
			{/* Every column is `min-w-0` so the bar can compress instead of forcing
			    itself wider than the viewport — at 375px the wordmark, three nav
			    links and the login button do not fit, and the overflow was pushing
			    the whole page wider than the screen. The wordmark drops below `sm`
			    (the mark alone still reads as home) and the nav sits at the same
			    edge padding as the rest of the page. */}
			<div className="mx-auto flex h-(--header-height) w-full items-center py-3">
				<div className="mx-auto flex w-full items-center justify-between gap-2 px-4 sm:max-w-7xl sm:px-6">
					<div className="flex min-w-0 items-center justify-start sm:flex-1">
						<Link className="flex items-center gap-2" href={"/"}>
							<Logo height={18} width={"auto"} />
							<span className="hidden font-medium text-body-lg sm:inline">
								Edgecoms
							</span>
						</Link>
					</div>
					<nav className="flex min-w-0 items-center justify-center gap-0.5 sm:flex-1 sm:gap-1">
						{links.map(({ to, label }) => (
							<ButtonLink
								className="px-2 font-normal text-secondary-foreground hover:text-foreground sm:px-2.5"
								href={to as Route}
								key={to}
								size="md"
								variant="tertiary"
							>
								{label}
							</ButtonLink>
						))}
					</nav>
					<div className="flex min-w-0 items-center justify-end gap-2 sm:flex-1">
						<ButtonLink
							className="max-sm:px-2"
							href={"/login" as Route}
							size={"md"}
							variant={"secondary"}
						>
							<span className="sm:hidden">Login</span>
							<span className="hidden sm:inline">Partner login</span>
						</ButtonLink>
					</div>
				</div>
			</div>
		</header>
	);
}
