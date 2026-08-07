import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { EDGE_PRODUCTS } from "@/lib/products";

/* The seven app icons plus the platforms Trackproof feeds. Everything here is a
   file that exists in `public/`; nothing is a logo we have not been given. */
const PLATFORMS = [
	{ alt: "Shopify", src: "/logos/shopify.svg" },
	{ alt: "Meta", src: "/logos/meta.svg" },
	{ alt: "Google", src: "/logos/google.svg" },
	{ alt: "TikTok", src: "/logos/tiktok.svg" },
] as const;

const APP_TILES = EDGE_PRODUCTS.map((product) => ({
	alt: product.name,
	href: `/products/${product.slug}`,
	src: `/app-icons/${product.slug}.webp`,
}));

/* A checkerboard rather than a packed grid: the empty cells are what make it
   read as a surface things are plugged into. Slots picked by hand so nothing
   lands adjacent to its own colour. */
const SLOTS = [1, 3, 6, 8, 11, 13, 16, 18, 21, 23, 26] as const;
const CELLS = 28;

export function Integrations() {
	const tiles = [...APP_TILES, ...PLATFORMS.map((p) => ({ ...p, href: null }))];

	return (
		<section className="relative overflow-hidden border-neutral-200 border-y bg-neutral-50">
			<div className="mx-auto grid w-full max-w-[1080px] grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-24">
				<div className="flex flex-col gap-5">
					<h2 className="max-w-[380px] text-balance font-medium text-[36px] text-neutral-900 leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
						Works with the stack you already run
					</h2>
					<p className="max-w-[420px] text-pretty text-[17px] text-neutral-500 leading-relaxed">
						Every app is a Shopify App Block, billed on the invoice you already
						receive. Trackproof sends server-side conversions on to the ad
						platforms, so they see the sales they actually drove.
					</p>
					<Link
						className="mt-2 inline-flex h-10 w-fit items-center rounded-lg border border-neutral-200 bg-white px-5 font-medium text-[15px] text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
						href={"/products" as Route}
					>
						Explore the apps
					</Link>
				</div>

				<div className="relative -mx-6 overflow-hidden lg:mx-0">
					<div className="grid w-[620px] grid-cols-7 gap-2 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,black_50%,transparent)] lg:w-full">
						{Array.from({ length: CELLS }, (_, index) => {
							const slotIndex = SLOTS.indexOf(index as (typeof SLOTS)[number]);
							const tile = slotIndex === -1 ? null : tiles[slotIndex];

							if (!tile) {
								return (
									<div
										className="aspect-square rounded-lg border border-neutral-200/70"
										key={`empty-${index}`}
									/>
								);
							}

							const inner = (
								<Image
									alt={tile.alt}
									className="size-7 object-contain"
									height={64}
									src={tile.src}
									width={64}
								/>
							);

							return tile.href ? (
								<Link
									className="flex aspect-square items-center justify-center rounded-lg border border-neutral-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5"
									href={tile.href as Route}
									key={tile.alt}
								>
									{inner}
								</Link>
							) : (
								<div
									className="flex aspect-square items-center justify-center rounded-lg border border-neutral-200 bg-white shadow-sm"
									key={tile.alt}
								>
									{inner}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
