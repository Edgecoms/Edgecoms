"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import type { Route } from "next";
import Link from "next/link";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
import Logo from "../ui/logo";

const links = [
	{ to: "/products", label: "Products" },
	{ to: "/case-studies", label: "Case studies" },
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
			{/* The nav links are hidden below `md`: four links at this size do not
			    fit 375px, and forcing them to would put the page back into the
			    horizontal overflow it used to have. Products and Case studies are
			    both one tap away in the footer until there is a drawer. */}
			<div className="mx-auto flex h-(--header-height) w-full items-center">
				<div className="mx-auto flex w-full items-center justify-between gap-4 px-5 sm:max-w-7xl sm:px-6">
					<Link className="flex shrink-0 items-center gap-2.5" href={"/"}>
						<Logo height={24} width={"auto"} />
						<span className="font-semibold text-h3 tracking-tight">
							Edgecoms
						</span>
					</Link>

					<nav className="hidden items-center gap-1 md:flex">
						{links.map(({ to, label }) => (
							<ButtonLink
								className="px-3 font-medium text-[15px] text-secondary-foreground hover:text-foreground"
								href={to as Route}
								key={to}
								size="xl"
								variant="tertiary"
							>
								{label}
							</ButtonLink>
						))}
					</nav>

					<div className="flex shrink-0 items-center gap-2">
						<ButtonLink
							className="h-10 rounded-full px-5 font-medium text-[15px]"
							href={BOOKING_URL as Route}
							rel="noopener"
							size="xl"
							target="_blank"
							variant="brand"
						>
							<span className="sm:hidden">Free audit</span>
							<span className="hidden sm:inline">{BOOKING_LABEL}</span>
						</ButtonLink>
						<ButtonLink
							className="hidden h-10 rounded-full px-5 font-medium text-[15px] sm:inline-flex"
							href={"/login" as Route}
							size="xl"
							variant="secondary"
						>
							Partner login
						</ButtonLink>
					</div>
				</div>
			</div>
		</header>
	);
}
