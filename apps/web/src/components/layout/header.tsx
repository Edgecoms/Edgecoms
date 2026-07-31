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
			<div className="mx-auto flex h-(--header-height) w-full items-center py-3">
				<div className="mx-auto flex w-full items-center justify-between px-6 sm:max-w-7xl">
					<div className="flex flex-1 items-center justify-start">
						<Link className="flex items-center gap-2" href={"/"}>
							<Logo height={18} width={"auto"} />
							<span className="font-medium text-body-lg">Edgecoms</span>
						</Link>
					</div>
					<nav className="flex flex-1 items-center justify-center gap-1">
						{links.map(({ to, label }) => (
							<ButtonLink
								className="font-normal text-secondary-foreground hover:text-foreground"
								href={to as Route}
								key={to}
								size="md"
								variant="tertiary"
							>
								{label}
							</ButtonLink>
						))}
					</nav>
					<div className="flex flex-1 items-center justify-end gap-2">
						<ButtonLink
							href={"/login" as Route}
							size={"md"}
							variant={"secondary"}
						>
							Partner login
						</ButtonLink>
					</div>
				</div>
			</div>
		</header>
	);
}
