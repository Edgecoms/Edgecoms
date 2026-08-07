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

/* Staggered checkerboard slots matching the target image reference */
const SLOTS = [1, 3, 6, 8, 11, 13, 16, 18, 21, 23, 26] as const;
const CELLS = 28;

export function Integrations() {
	const tiles = [...APP_TILES, ...PLATFORMS.map((p) => ({ ...p, href: null }))];

	return (
		<section className="relative overflow-hidden border-neutral-200 border-y bg-slate-50/60">
			{/* OpenAI-inspired Marketing Mesh Gradient Background */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 overflow-hidden"
			>
				{/* Cyan / Teal Aurora Pool (top left) */}
				<div className="absolute -top-20 -left-20 h-[450px] w-[550px] rounded-full bg-gradient-to-br from-teal-200/60 via-cyan-200/50 to-blue-200/40 opacity-70 blur-3xl" />

				{/* Purple / Violet Aurora Pool (center right) */}
				<div className="absolute top-1/2 -right-20 h-[500px] w-[600px] -translate-y-1/2 rounded-full bg-gradient-to-tl from-purple-200/60 via-indigo-200/50 to-sky-200/40 opacity-75 blur-3xl" />

				{/* Soft Peach / Coral Warm Accent Pool (bottom center) */}
				<div className="absolute -bottom-20 left-1/3 h-[400px] w-[500px] rounded-full bg-gradient-to-tr from-rose-200/50 via-amber-200/40 to-teal-200/40 opacity-60 blur-3xl" />
			</div>

			<div className="relative mx-auto grid w-full max-w-[1080px] grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-24">
				<div className="flex flex-col gap-5">
					<h2 className="max-w-[380px] text-balance font-medium text-[36px] text-neutral-900 leading-[1.08] tracking-[-0.03em] sm:text-[44px]">
						Works with the stack you already run
					</h2>
					<p className="max-w-[420px] text-pretty text-[17px] text-neutral-600 leading-relaxed">
						Every app is a Shopify App Block, billed on the invoice you already
						receive. Trackproof sends server-side conversions on to the ad
						platforms, so they see the sales they actually drove.
					</p>
					<Link
						className="mt-2 inline-flex h-10 w-fit items-center rounded-lg border border-neutral-200/80 bg-white/90 px-5 font-medium text-[15px] text-neutral-900 shadow-sm backdrop-blur-sm transition-all hover:bg-white"
						href={"/products" as Route}
					>
						Explore the apps
					</Link>
				</div>

				<div className="relative -mx-6 overflow-hidden lg:mx-0">
					{/* Staggered Icon Grid matching the design image */}
					<div className="grid w-[620px] grid-cols-7 gap-3.5 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_60%,transparent)] lg:w-full">
						{Array.from({ length: CELLS }, (_, index) => {
							const slotIndex = SLOTS.indexOf(index as (typeof SLOTS)[number]);
							const tile = slotIndex === -1 ? null : tiles[slotIndex];

							if (!tile) {
								return (
									<div
										className="aspect-square rounded-xl border border-white/60 bg-white/40 shadow-xs backdrop-blur-xs"
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
									className="flex aspect-square items-center justify-center rounded-xl border border-white/90 bg-white/90 p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md transition-transform hover:-translate-y-1 hover:bg-white hover:shadow-md"
									href={tile.href as Route}
									key={tile.alt}
								>
									{inner}
								</Link>
							) : (
								<div
									className="flex aspect-square items-center justify-center rounded-xl border border-white/90 bg-white/90 p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md"
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
