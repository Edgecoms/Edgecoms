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
		<header className="sticky inset-x-0 top-0 z-50 h-(--header-height) items-stretch border-border-default/50 border-b bg-(--white-a1) backdrop-blur-2xl">
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
