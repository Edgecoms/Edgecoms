"use client";

import {
	Dialog,
	DialogClose,
	DialogPopup,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "@edgecoms/ui/components/dialog";
import { cn } from "@edgecoms/ui/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/ui/logo";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
import { EDGE_PRODUCTS, RPV_LEVERS } from "@/lib/products";

interface MenuItem {
	description: string;
	href: string;
	icon?: string;
	label: string;
}

/* Every href below resolves to a route that exists today. The reference nav has
   a Pricing entry and this one does not, because there is no pricing page —
   a top-level link into a 404 is worse than one fewer link. */
const PRODUCT_ITEMS: readonly MenuItem[] = EDGE_PRODUCTS.map((product) => ({
	description: product.eyebrow,
	href: `/products/${product.slug}`,
	icon: `/app-icons/${product.slug}.webp`,
	label: product.name,
}));

const SOLUTION_ITEMS: readonly MenuItem[] = RPV_LEVERS.map((lever) => ({
	description: lever.description,
	href: "/products",
	label: lever.title,
}));

const RESOURCE_ITEMS: readonly MenuItem[] = [
	{
		description: "Real stores, and the apps they actually run.",
		href: "/case-studies",
		label: "Case studies",
	},
	{
		description: "Why we build focused apps instead of one large one.",
		href: "/about",
		label: "About Edge",
	},
	{
		description: "Send us a store URL and we will look at it.",
		href: "/contact",
		label: "Contact",
	},
];

const MENUS = [
	{ items: PRODUCT_ITEMS, key: "product", label: "Product", wide: true },
	{ items: SOLUTION_ITEMS, key: "solutions", label: "Solutions", wide: false },
	{ items: RESOURCE_ITEMS, key: "resources", label: "Resources", wide: false },
] as const;

const FLAT_LINKS = [
	{ href: "/case-studies", label: "Customers" },
	{ href: "/partners", label: "Partners" },
] as const;

const TRIGGER_CLASS =
	"flex h-8 items-center gap-1 rounded-md px-3 font-medium text-[15px] text-neutral-600 transition-colors hover:text-neutral-900";

function MenuPanel({
	items,
	wide,
}: {
	items: readonly MenuItem[];
	wide: boolean;
}) {
	return (
		<div
			className={cn(
				"grid gap-1 rounded-xl border border-neutral-200 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
				wide ? "w-[520px] grid-cols-2" : "w-[320px] grid-cols-1"
			)}
		>
			{items.map((item) => (
				<Link
					className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-neutral-50"
					href={item.href as Route}
					key={item.label}
				>
					{item.icon ? (
						<Image
							alt=""
							className="mt-0.5 size-7 shrink-0 rounded-[7px] border border-neutral-200"
							height={64}
							src={item.icon}
							width={64}
						/>
					) : null}
					<span className="flex flex-col gap-0.5">
						<span className="font-medium text-[14px] text-neutral-900">
							{item.label}
						</span>
						<span className="text-[13px] text-neutral-500 leading-snug">
							{item.description}
						</span>
					</span>
				</Link>
			))}
		</div>
	);
}

export function LandingNav() {
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

	return (
		/* Opaque rather than translucent: the closing panel is near-black and a
		   blurred tint over it drops the grey nav links to unreadable. */
		<header className="sticky inset-x-0 top-0 z-50 border-neutral-200 border-b bg-white">
			<div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
				<Link
					className="flex shrink-0 items-center gap-2.5"
					href={"/" as Route}
				>
					<Logo className="h-6 w-auto shrink-0" />
					<span className="font-semibold text-[19px] text-neutral-900 tracking-tight">
						Edgecoms
					</span>
				</Link>

				<nav className="hidden items-center gap-0.5 lg:flex">
					{/* Opening on hover is CSS rather than a mouse handler, and it is
					    scoped to devices that actually have a pointer so it cannot stick
					    open on a tap. The click path stays in React because that is what
					    carries `aria-expanded` — a keyboard user tabs to the trigger and
					    presses it, and never touches the hover branch at all. The panel is
					    a sibling inside the same `group`, so the padding above it is part
					    of the hover target and the diagonal from trigger to first item
					    does not cross dead space. */}
					{MENUS.map((menu) => (
						<div className="group relative" key={menu.key}>
							<button
								aria-expanded={openMenu === menu.key}
								className={cn(
									TRIGGER_CLASS,
									"[@media(hover:hover)]:group-hover:text-neutral-900"
								)}
								onClick={() =>
									setOpenMenu(openMenu === menu.key ? null : menu.key)
								}
								type="button"
							>
								{menu.label}
								<ChevronDown
									aria-hidden="true"
									className={cn(
										"size-3.5 transition-transform duration-200 [@media(hover:hover)]:group-hover:rotate-180",
										openMenu === menu.key && "rotate-180"
									)}
								/>
							</button>

							<div
								className={cn(
									"absolute top-full left-1/2 hidden -translate-x-1/2 pt-3 [@media(hover:hover)]:group-hover:block",
									openMenu === menu.key && "block"
								)}
							>
								<MenuPanel items={menu.items} wide={menu.wide} />
							</div>
						</div>
					))}

					{FLAT_LINKS.map((link) => (
						<Link
							className={TRIGGER_CLASS}
							href={link.href as Route}
							key={link.href}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex shrink-0 items-center gap-2">
					<Link
						className="hidden h-9 items-center rounded-lg border border-neutral-200 bg-white px-4 font-medium text-[14px] text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50 sm:inline-flex"
						href={"/login" as Route}
					>
						Partner login
					</Link>
					{/* Mobile view (< sm): Primary button shows Partners Login */}
					<Link
						className="inline-flex h-9 items-center rounded-lg bg-neutral-900 px-4 font-medium text-[14px] text-white transition-colors hover:bg-neutral-800 sm:hidden"
						href={"/login" as Route}
					>
						Partners Login
					</Link>
					{/* Desktop view (sm and above): Primary button shows Book a Growth Audit */}
					<a
						className="hidden h-9 items-center rounded-lg bg-neutral-900 px-4 font-medium text-[14px] text-white transition-colors hover:bg-neutral-800 sm:inline-flex"
						href={BOOKING_URL}
						rel="noopener"
						target="_blank"
					>
						{BOOKING_LABEL}
					</a>

					<Dialog onOpenChange={setSheetOpen} open={sheetOpen}>
						<DialogTrigger
							aria-label="Open menu"
							className="-mr-2 flex size-10 items-center justify-center rounded-lg text-neutral-900 lg:hidden"
						>
							<Menu aria-hidden="true" className="size-5" />
						</DialogTrigger>

						<DialogPortal>
							<DialogPopup className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white px-6 py-5 transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 lg:hidden">
								<DialogTitle className="sr-only">Menu</DialogTitle>

								{/* Top bar with Close button on top right matching Image 1 */}
								<div className="flex items-center justify-end pb-3">
									<DialogClose
										aria-label="Close menu"
										className="-mr-2 flex size-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:text-neutral-900"
									>
										<X aria-hidden="true" className="size-6" />
									</DialogClose>
								</div>

								{/* Accordion Categories & Flat Links matching Image 1 */}
								<nav className="flex flex-col">
									{MENUS.map((menu) => {
										const isExpanded = expandedCategory === menu.key;
										return (
											<div
												className="border-neutral-100 border-b"
												key={menu.key}
											>
												<button
													className="flex w-full items-center justify-between py-4 font-semibold text-lg text-neutral-900 transition-colors hover:text-neutral-600"
													onClick={() =>
														setExpandedCategory(isExpanded ? null : menu.key)
													}
													type="button"
												>
													<span>{menu.label}</span>
													<ChevronDown
														className={cn(
															"size-5 text-neutral-500 transition-transform duration-200",
															isExpanded && "rotate-180"
														)}
													/>
												</button>

												{isExpanded ? (
													<div className="flex flex-col gap-3 pt-1 pb-5">
														{menu.items.map((item) => (
															<Link
																className="flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-50"
																href={item.href as Route}
																key={item.label}
																onClick={() => setSheetOpen(false)}
															>
																<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
																	{item.icon ? (
																		<Image
																			alt=""
																			className="size-6 rounded-[5px] object-contain"
																			height={48}
																			src={item.icon}
																			width={48}
																		/>
																	) : (
																		<span className="font-semibold text-caption text-neutral-700">
																			{item.label[0]}
																		</span>
																	)}
																</div>
																<div className="flex flex-col gap-0.5">
																	<span className="font-semibold text-[15px] text-neutral-900">
																		{item.label}
																	</span>
																	<span className="text-[13px] text-neutral-500 leading-snug">
																		{item.description}
																	</span>
																</div>
															</Link>
														))}
													</div>
												) : null}
											</div>
										);
									})}

									{/* Flat links matching Image 1: Customers, Partners, About, Contact */}
									{[
										{ href: "/case-studies", label: "Customers" },
										{ href: "/partners", label: "Partners" },
										{ href: "/about", label: "About" },
										{ href: "/contact", label: "Contact" },
									].map((link) => (
										<Link
											className="border-neutral-100 border-b py-4 font-semibold text-lg text-neutral-900 transition-colors hover:text-neutral-600"
											href={link.href as Route}
											key={link.href}
											onClick={() => setSheetOpen(false)}
										>
											{link.label}
										</Link>
									))}
								</nav>
							</DialogPopup>
						</DialogPortal>
					</Dialog>
				</div>
			</div>
		</header>
	);
}
