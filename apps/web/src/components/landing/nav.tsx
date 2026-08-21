"use client";

import { Button, ButtonLink } from "@edgecoms/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogPopup,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "@edgecoms/ui/components/dialog";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@edgecoms/ui/components/navigation-menu";
import { cn } from "@edgecoms/ui/lib/utils";
import {
	Briefcase,
	ChevronDown,
	HelpCircle,
	Mail,
	Menu,
	Users,
	X,
} from "lucide-react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PartnersIcon } from "@/components/landing/frame";
import Logo from "@/components/ui/logo";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
import { EDGE_PRODUCTS } from "@/lib/products";

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

const RESOURCE_ITEMS: readonly MenuItem[] = [
	{
		description: "Answers to your questions.",
		href: "/contact",
		label: "Help Center",
	},
	{
		description: "Company, values, and team.",
		href: "/about",
		label: "About",
	},
	{
		description: "Join our global, remote team.",
		href: "/careers",
		label: "Careers",
	},
	{
		description: "Reach out to support or sales.",
		href: "/contact",
		label: "Contact",
	},
] as const;

const MENUS = [
	{ items: PRODUCT_ITEMS, key: "product", label: "Product", wide: true },
	{ items: RESOURCE_ITEMS, key: "resources", label: "Resources", wide: false },
] as const;

const FLAT_LINKS = [
	{ href: "/customers", label: "Customers" },
	{ href: "/partners", label: "Partners" },
] as const;

function ProductMenuPanel() {
	return (
		<div className="w-[860px] rounded-3xl border border-neutral-200/80 bg-white p-3 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.12)]">
			{/* Top 3-Column Grid */}
			<div className="grid grid-cols-3 gap-3">
				{/* Column 1: Edge Partners */}
				<Link
					className="group flex flex-col justify-between rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 transition-colors hover:border-neutral-200 hover:bg-neutral-50"
					href={"/partners" as Route}
				>
					<div>
						<PartnersIcon className="size-6 rounded-md p-1" />
						<h3 className="mt-3 font-semibold text-[15px] text-neutral-900">
							Edge Partners
						</h3>
						<p className="mt-1 text-[13px] text-neutral-500 leading-snug">
							Grow your revenue on auto-pilot with partnerships.
						</p>
					</div>

					{/* Mock Visual Card Block for Partners */}
					<div className="relative mt-4 flex h-[140px] w-full flex-col justify-end overflow-hidden rounded-xl border border-neutral-200/60 bg-white/80 p-2.5 shadow-2xs backdrop-blur-xs">
						<div className="grid grid-cols-2 gap-1.5 opacity-90 transition-transform duration-300 group-hover:scale-[1.02]">
							<div className="flex flex-col gap-0.5 rounded-lg border border-neutral-200/50 bg-neutral-50 p-1.5">
								<span className="truncate font-medium text-[10px] text-neutral-700">
									Lauren A.
								</span>
								<span className="font-semibold text-[11px] text-neutral-900">
									$1.8K
								</span>
							</div>
							<div className="flex flex-col gap-0.5 rounded-lg border border-neutral-200/50 bg-neutral-50 p-1.5">
								<span className="truncate font-medium text-[10px] text-neutral-700">
									Mia T.
								</span>
								<span className="font-semibold text-[11px] text-purple-700">
									$22.6K
								</span>
							</div>
							<div className="flex flex-col gap-0.5 rounded-lg border border-neutral-200/50 bg-neutral-50 p-1.5">
								<span className="truncate font-medium text-[10px] text-neutral-700">
									Sophie L.
								</span>
								<span className="font-semibold text-[11px] text-neutral-900">
									$11.0K
								</span>
							</div>
							<div className="flex flex-col gap-0.5 rounded-lg border border-neutral-200/50 bg-neutral-50 p-1.5">
								<span className="truncate font-medium text-[10px] text-neutral-700">
									Hiroshi T.
								</span>
								<span className="font-semibold text-[11px] text-purple-700">
									$19.2K
								</span>
							</div>
						</div>
					</div>
				</Link>

				{/* Column 2: Trackproof */}
				<Link
					className="group flex flex-col justify-between rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 transition-colors hover:border-neutral-200 hover:bg-neutral-50"
					href={"/products/trackproof" as Route}
				>
					<div>
						<Image
							alt=""
							className="size-6 rounded-md border border-neutral-200/80 object-contain"
							height={64}
							src="/app-icons/trackproof.webp"
							width={64}
						/>
						<h3 className="mt-3 font-semibold text-[15px] text-neutral-900">
							Trackproof
						</h3>
						<p className="mt-1 text-[13px] text-neutral-500 leading-snug">
							Server-side attribution and conversion tracking delivered.
						</p>
					</div>

					{/* Mock Visual Card Block for Trackproof */}
					<div className="relative mt-4 flex h-[140px] w-full flex-col justify-between overflow-hidden rounded-xl border border-neutral-200/60 bg-white/80 p-2.5 shadow-2xs backdrop-blur-xs">
						<svg
							aria-hidden="true"
							className="absolute inset-0 h-full w-full stroke-emerald-500/30"
							fill="none"
							viewBox="0 0 200 100"
						>
							<path d="M0 80 Q 50 70 100 40 T 200 10" strokeWidth="3" />
						</svg>

						<div className="relative flex items-center justify-between rounded-lg border border-neutral-200/60 bg-neutral-50 px-2 py-1">
							<span className="font-mono text-[10px] text-neutral-600">
								d.to/conversions
							</span>
							<span className="size-1.5 rounded-full bg-emerald-500" />
						</div>

						<div className="relative flex items-center justify-between text-[11px]">
							<span className="text-neutral-500">Clicks</span>
							<span className="font-semibold text-neutral-900">12.5K</span>
						</div>
						<div className="relative flex items-center justify-between text-[11px]">
							<span className="text-neutral-500">Sales</span>
							<span className="font-semibold text-emerald-600">$12,400</span>
						</div>
					</div>
				</Link>

				{/* Column 3: All Apps */}
				<Link
					className="group flex flex-col justify-between rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 transition-colors hover:border-neutral-200 hover:bg-neutral-50"
					href={"/products" as Route}
				>
					<div>
						<Image
							alt=""
							className="size-6 rounded-md border border-neutral-200/80 object-contain"
							height={64}
							src="/app-icons/edge-bundles.webp"
							width={64}
						/>
						<h3 className="mt-3 font-semibold text-[15px] text-neutral-900">
							All Apps
						</h3>
						<p className="mt-1 text-[13px] text-neutral-500 leading-snug">
							Bundles, volume tiers & slide cart for high-converting stores.
						</p>
					</div>

					{/* Mock Visual Card Block for Edge Links / Apps */}
					<div className="relative mt-4 flex h-[140px] w-full flex-col gap-1.5 overflow-hidden rounded-xl border border-neutral-200/60 bg-white/80 p-2.5 shadow-2xs backdrop-blur-xs">
						<div className="flex items-center justify-between rounded-lg border border-neutral-200/50 bg-neutral-50 p-1.5 text-[10px]">
							<span className="truncate font-medium text-neutral-700">
								d.to/bundles
							</span>
							<span className="rounded-md bg-neutral-200/70 px-1.5 py-0.5 font-semibold text-neutral-800">
								151.8K clicks
							</span>
						</div>
						<div className="flex items-center justify-between rounded-lg border border-neutral-200/50 bg-neutral-50 p-1.5 text-[10px]">
							<span className="truncate font-medium text-neutral-700">
								d.to/cart-upsell
							</span>
							<span className="rounded-md bg-neutral-200/70 px-1.5 py-0.5 font-semibold text-neutral-800">
								100K clicks
							</span>
						</div>
						<div className="flex items-center justify-between rounded-lg border border-neutral-200/50 bg-neutral-50 p-1.5 text-[10px]">
							<span className="truncate font-medium text-neutral-700">
								d.to/volume-tier
							</span>
							<span className="rounded-md bg-neutral-200/70 px-1.5 py-0.5 font-semibold text-neutral-800">
								65.8K clicks
							</span>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}

function ResourceMenuPanel() {
	return (
		<div className="w-[660px] rounded-3xl border border-neutral-200/80 bg-white p-4 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.12)]">
			<div className="grid grid-cols-12 divide-x divide-neutral-100">
				{/* Column 1: EXPLORE (Span 7) */}
				<div className="col-span-7 flex flex-col pr-4">
					<span className="mb-3 px-1 font-semibold text-[11px] text-neutral-400 uppercase tracking-wider">
						Explore
					</span>
					<div className="grid h-full grid-cols-1 gap-3">
						{/* Help Center Card */}
						<Link
							className="group flex flex-col justify-between rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4.5 transition-colors hover:border-neutral-200 hover:bg-neutral-50"
							href={"/contact" as Route}
						>
							<div>
								<div className="flex size-9 items-center justify-center rounded-xl border border-neutral-200/70 bg-white shadow-2xs">
									<HelpCircle className="size-4 text-neutral-800" />
								</div>
							</div>
							<div className="mt-8">
								<h3 className="font-semibold text-[15px] text-neutral-900">
									Help Center
								</h3>
								<p className="mt-0.5 text-[12px] text-neutral-500 leading-snug">
									Answers to your questions
								</p>
							</div>
						</Link>
					</div>
				</div>

				{/* Column 2: COMPANY (Span 5) */}
				<div className="col-span-5 flex flex-col pl-4">
					<span className="mb-3 px-2 font-semibold text-[11px] text-neutral-400 uppercase tracking-wider">
						Company
					</span>
					<div className="flex flex-col gap-1">
						{/* About */}
						<Link
							className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-50"
							href={"/about" as Route}
						>
							<div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200/80 bg-white shadow-2xs">
								<Users className="size-4 text-neutral-700" />
							</div>
							<div className="flex flex-col">
								<span className="font-semibold text-[13px] text-neutral-900">
									About
								</span>
								<span className="text-[12px] text-neutral-500 leading-tight">
									Company, values, and team
								</span>
							</div>
						</Link>

						{/* Careers */}
						<Link
							className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-50"
							href={"/careers" as Route}
						>
							<div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200/80 bg-white shadow-2xs">
								<Briefcase className="size-4 text-neutral-700" />
							</div>
							<div className="flex flex-col">
								<span className="font-semibold text-[13px] text-neutral-900">
									Careers
								</span>
								<span className="text-[12px] text-neutral-500 leading-tight">
									Join our global, remote team
								</span>
							</div>
						</Link>

						{/* Contact */}
						<Link
							className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-50"
							href={"/contact" as Route}
						>
							<div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200/80 bg-white shadow-2xs">
								<Mail className="size-4 text-neutral-700" />
							</div>
							<div className="flex flex-col">
								<span className="font-semibold text-[13px] text-neutral-900">
									Contact
								</span>
								<span className="text-[12px] text-neutral-500 leading-tight">
									Reach out to support or sales
								</span>
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export function LandingNav() {
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

				<NavigationMenu align="center" className="hidden lg:flex">
					<NavigationMenuList className="gap-0.5">
						{MENUS.map((menu) => (
							<NavigationMenuItem key={menu.key}>
								<NavigationMenuTrigger className="h-8 px-3 text-caption text-neutral-600 hover:text-neutral-900 data-[state=open]:text-neutral-900">
									{menu.label}
								</NavigationMenuTrigger>
								<NavigationMenuContent className="border-none bg-transparent p-0 shadow-none">
									{menu.key === "product" ? (
										<ProductMenuPanel />
									) : (
										<ResourceMenuPanel />
									)}
								</NavigationMenuContent>
							</NavigationMenuItem>
						))}

						{FLAT_LINKS.map((link) => (
							<NavigationMenuItem key={link.href}>
								<Button
									className="h-8 px-3 font-medium text-caption text-neutral-600 hover:text-neutral-900"
									nativeButton={false}
									render={<Link href={link.href as Route} />}
									variant={"tertiary"}
								>
									{link.label}
								</Button>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>

				<div className="flex shrink-0 items-center gap-2">
					<ButtonLink href={"/login" as Route} size="lg" variant="tertiary">
						Partner login
					</ButtonLink>
					<ButtonLink
						className="hidden sm:inline-flex"
						href={BOOKING_URL}
						rel="noopener"
						size={"lg"}
						target="_blank"
						variant={"secondary"}
					>
						{BOOKING_LABEL}
					</ButtonLink>

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
