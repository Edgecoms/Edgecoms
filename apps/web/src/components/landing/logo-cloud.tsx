import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";
import { CASE_STUDIES } from "@/lib/marketing-stats";

const MERCHANTS = Object.entries(CASE_STUDIES)
	.filter(([, study]) => Boolean(study.logo))
	.map(([slug, study]) => ({
		brand: study.brand,
		hasStudy: Boolean(study.title),
		logo: study.logo as string,
		slug,
	}));

export function LogoCloud() {
	return (
		<section className="relative overflow-hidden border-neutral-200 border-b bg-white">
			<Frame className="py-10 sm:py-12">
				<ul className="grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 px-6 sm:grid-cols-3 lg:grid-cols-6">
					{MERCHANTS.map((merchant) => (
						<li
							className="flex flex-col items-center gap-2"
							key={merchant.slug}
						>
							<Link
								className="flex h-8 items-center justify-center"
								href={`/case-studies/${merchant.slug}` as Route}
							>
								<Image
									alt={merchant.brand}
									className="h-full w-auto object-contain"
									height={96}
									src={merchant.logo}
									width={220}
								/>
							</Link>
							<span className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-semibold text-[9px] text-neutral-500 tracking-[0.08em]">
								CASE STUDY
							</span>
						</li>
					))}
				</ul>
			</Frame>
		</section>
	);
}
