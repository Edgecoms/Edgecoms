import { cn } from "@edgecoms/ui/lib/utils";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";
import { CASE_STUDIES } from "@/lib/marketing-stats";

/* Every store here is running Edge apps on its live storefront, which is the
   part of a customer claim that is checkable by anyone who views source. The
   two carrying a CASE STUDY tag are the ones with a written-up page. */
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
		<section className="relative bg-white">
			{/* The partner banner used to sit here. It now overlaps the preview
			    artwork one section up, where it interrupts something rather than
			    occupying a band of its own. */}
			<Frame className="py-14">
				<ul className="grid grid-cols-2 items-center gap-x-6 gap-y-10 px-6 sm:grid-cols-3 lg:grid-cols-6">
					{MERCHANTS.map((merchant) => (
						<li
							className="flex flex-col items-center gap-2"
							key={merchant.slug}
						>
							<Link
								className="flex h-8 items-center justify-center opacity-70 transition-opacity hover:opacity-100"
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
							<span
								className={cn(
									"rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500 tracking-[0.08em]",
									merchant.hasStudy ? "visible" : "invisible"
								)}
							>
								CASE STUDY
							</span>
						</li>
					))}
				</ul>
			</Frame>
		</section>
	);
}
