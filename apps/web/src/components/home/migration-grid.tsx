import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";

export const MIGRATION_GRID_COLUMNS = [
	{
		header: "Migrated off Rewardful",
		logos: [
			{
				brand: "Vyssence",
				logo: "/case-studies/vyssence-logo.png",
				slug: "vyssence",
			},
			{
				brand: "Celorah",
				logo: "/case-studies/celorah-logo.png",
				slug: "celorah",
			},
			{
				brand: "Aurient",
				logo: "/case-studies/aurient-logo.png",
				slug: "aurient",
			},
			{
				brand: "Klyro Light",
				caseStudy: true,
				logo: "/case-studies/klyrolight-logo.png",
				slug: "klyrolight",
			},
		],
	},
	{
		header: "Migrated off PartnerStack",
		logos: [
			{
				brand: "Aurient",
				logo: "/case-studies/aurient-logo.png",
				slug: "aurient",
			},
			{
				brand: "Klyro Light",
				caseStudy: true,
				logo: "/case-studies/klyrolight-logo.png",
				slug: "klyrolight",
			},
			{
				brand: "J Pet Central",
				logo: "/case-studies/jpetcentral-logo.png",
				slug: "jpetcentral",
			},
		],
	},
	{
		header: "Migrated off FirstPromoter",
		logos: [
			{
				brand: "J Pet Central",
				caseStudy: true,
				logo: "/case-studies/jpetcentral-logo.png",
				slug: "jpetcentral",
			},
			{
				brand: "Matata Xplore",
				logo: "/case-studies/matataxplore-logo.png",
				slug: "matataxplore",
			},
		],
	},
	{
		header: "More great teams on Edge",
		logos: [
			{
				brand: "Matata Xplore",
				logo: "/case-studies/matataxplore-logo.png",
				slug: "matataxplore",
			},
			{
				brand: "Vyssence",
				logo: "/case-studies/vyssence-logo.png",
				slug: "vyssence",
			},
			{
				brand: "Celorah",
				logo: "/case-studies/celorah-logo.png",
				slug: "celorah",
			},
		],
	},
] as const;

export function MigrationGrid() {
	return (
		<section className="relative w-full bg-white">
			{/* Full-width tab headers row */}
			<div className="w-full border-neutral-200 border-b bg-neutral-50/60">
				<Frame className="border-neutral-200 border-x">
					<div className="grid grid-cols-1 divide-y border-neutral-200 p-2.5 sm:grid-cols-2 md:grid-cols-4 md:divide-x md:divide-y-0">
						{MIGRATION_GRID_COLUMNS.map((col) => (
							<div className="px-1.5 py-0.5" key={col.header}>
								<div className="w-full rounded-lg border border-neutral-200/80 bg-neutral-100/90 px-3 py-1.5 text-center font-medium text-neutral-700 text-xs">
									{col.header}
								</div>
							</div>
						))}
					</div>
				</Frame>
			</div>

			{/* Full-width logo grid row */}
			<div className="w-full border-neutral-200 border-b bg-white">
				<Frame className="border-neutral-200 border-x">
					<div className="grid grid-cols-1 divide-y border-neutral-200 sm:grid-cols-2 md:grid-cols-4 md:divide-x md:divide-y-0">
						{MIGRATION_GRID_COLUMNS.map((col) => (
							<div
								className="grid grid-cols-2 items-center justify-items-center gap-6 p-6"
								key={col.header}
							>
								{col.logos.map((item) => (
									<div
										className="flex flex-col items-center gap-1"
										key={item.brand}
									>
										<Link
											className="flex h-7 items-center justify-center transition-opacity hover:opacity-80"
											href={`/case-studies/${item.slug}` as Route}
										>
											<Image
												alt={item.brand}
												className="h-5 w-auto object-contain"
												height={80}
												src={item.logo}
												width={160}
											/>
										</Link>
										{"caseStudy" in item && item.caseStudy && (
											<span className="rounded-full bg-purple-100 px-1.5 py-0.5 font-bold font-mono text-[8px] text-purple-700 uppercase tracking-widest">
												CASE STUDY
											</span>
										)}
									</div>
								))}
							</div>
						))}
					</div>
				</Frame>
			</div>
		</section>
	);
}
