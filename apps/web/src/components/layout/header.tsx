"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogPopup,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "@edgecoms/ui/components/dialog";
import { Menu, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
import Logo from "../ui/logo";

const links = [
	{ to: "/products", label: "Products" },
	{ to: "/case-studies", label: "Case studies" },
	{ to: "/partners", label: "Partners" },
	{ to: "/about", label: "About" },
] as const;

/* The wordmark used to sit at 20px next to a 24px mark, which read as a big
   word with a small icon bolted on. Dropping it to body size below `sm` puts
   the mark back in charge. */
function Wordmark() {
	return (
		<>
			<Logo className="h-6 w-auto shrink-0" />
			<span className="font-semibold text-body tracking-tight sm:text-h3">
				Edgecoms
			</span>
		</>
	);
}

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		/* Opaque, not translucent. The homepage now scrolls full-bleed orange
		   panels under this bar, and at --white-a1 the brand colour came
		   straight through and dropped the grey nav links to unreadable. A
		   blurred tint cannot be made safe against an arbitrary backdrop, so
		   the bar owns its own surface instead. */
		<header className="sticky inset-x-0 top-0 z-50 h-(--header-height) items-stretch border-border border-b bg-bg">
			{/* Below `md` the four links move into a sheet rather than being dropped:
			    they do not fit 375px, and hiding them outright left Products and Case
			    studies reachable only from the footer. */}
			<div className="mx-auto flex h-(--header-height) w-full items-center">
				{/* Three columns from `md` up rather than `justify-between`: the outer
				    two are equal fractions, so the auto-width nav in the middle sits on
				    the container's true centre. Under `justify-between` it centred in the
				    leftover space instead, which the wider button cluster pulled off to
				    the left. Below `md` the middle column is empty and the equal
				    fractions only squeeze the wordmark under the button cluster, so it
				    falls back to plain flex. */}
				<div className="mx-auto flex w-full items-center justify-between gap-4 px-5 sm:max-w-7xl sm:px-6 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
					<Link
						className="flex shrink-0 items-center gap-2.5 justify-self-start"
						href={"/"}
					>
						<Wordmark />
					</Link>

					<nav className="hidden items-center gap-1 justify-self-center md:flex">
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

					<div className="flex shrink-0 items-center gap-2 justify-self-end">
						{/* The booking CTA is desktop-only. On mobile it was the single
						    loudest thing on screen before the merchant had read a word,
						    and it competes with the hero's own primary button. It sits
						    at the foot of the sheet instead. */}
						<ButtonLink
							className="hidden rounded-full px-4 font-medium text-sm md:inline-flex"
							href={BOOKING_URL as Route}
							rel="noopener"
							size="xl"
							target="_blank"
							variant="brand"
						>
							{BOOKING_LABEL}
						</ButtonLink>
						<ButtonLink
							className="rounded-full px-4 font-medium text-sm"
							href={"/login" as Route}
							size="xl"
							variant="secondary"
						>
							Partner login
						</ButtonLink>

						<Dialog onOpenChange={setMenuOpen} open={menuOpen}>
							<DialogTrigger
								aria-label="Open menu"
								className="-mr-2 flex size-10 items-center justify-center rounded-full text-primary-foreground md:hidden"
							>
								<Menu aria-hidden="true" className="size-5" />
							</DialogTrigger>

							<DialogPortal>
								{/* Full-bleed and opaque: it replaces the page rather than
								    floating over it, so it repeats the header row instead of
								    leaving the real one poking out from underneath. */}
								<DialogPopup className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 md:hidden">
									<DialogTitle className="sr-only">Menu</DialogTitle>

									<div className="flex h-(--header-height) shrink-0 items-center justify-between gap-4 border-border border-b px-5">
										<Link
											className="flex shrink-0 items-center gap-2.5"
											href={"/"}
											onClick={() => setMenuOpen(false)}
										>
											<Wordmark />
										</Link>
										<DialogClose
											aria-label="Close menu"
											className="-mr-2 flex size-10 items-center justify-center rounded-full text-primary-foreground"
										>
											<X aria-hidden="true" className="size-5" />
										</DialogClose>
									</div>

									<nav className="flex flex-col px-5 py-4">
										{links.map(({ to, label }) => (
											<Link
												className="py-3 font-medium text-h2 text-primary-foreground"
												href={to as Route}
												key={to}
												onClick={() => setMenuOpen(false)}
											>
												{label}
											</Link>
										))}
									</nav>

									<div className="mt-auto flex flex-col gap-2 px-5 pt-6 pb-8">
										<ButtonLink
											className="h-11 rounded-full font-medium text-sm"
											href={BOOKING_URL as Route}
											onClick={() => setMenuOpen(false)}
											rel="noopener"
											size="xl"
											target="_blank"
											variant="brand"
										>
											{BOOKING_LABEL}
										</ButtonLink>
									</div>
								</DialogPopup>
							</DialogPortal>
						</Dialog>
					</div>
				</div>
			</div>
		</header>
	);
}
