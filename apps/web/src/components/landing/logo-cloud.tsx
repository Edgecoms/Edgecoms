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
			{/* Full-bleed banner, so it breaks the 1080px rules the way the rest of
			    the page does not — that is what makes it read as an announcement
			    rather than as another section. */}
			<div className="mx-auto w-full max-w-[1080px] px-6">
				<Link
					className="flex flex-col gap-4 rounded-xl bg-neutral-900 px-6 py-5 transition-colors hover:bg-neutral-800 sm:flex-row sm:items-center sm:justify-between"
					href={"/partners" as Route}
				>
					<span className="flex items-center gap-4">
						<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 font-semibold text-[15px] text-white">
							%
						</span>
						<span className="flex flex-col">
							<span className="font-medium text-[15px] text-white">
								Edge Partner Program
							</span>
							<span className="text-[14px] text-neutral-400">
								Register the merchants you manage and earn a recurring share of
								Edge revenue, every month
							</span>
						</span>
					</span>
					<span className="shrink-0 self-start rounded-lg bg-white px-4 py-2 font-medium text-[14px] text-neutral-900 sm:self-auto">
						Learn more
					</span>
				</Link>
			</div>

			<Frame className="mt-14 py-14">
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
