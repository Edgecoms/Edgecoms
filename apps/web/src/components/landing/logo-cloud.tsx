import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";
import { CASE_STUDIES } from "@/lib/marketing-stats";

/**
 * A logo earns the CASE STUDY chip only when there is a written study behind
 * it. `CASE_STUDIES` generates a page for every key it holds, so a merchant
 * with no `title` still resolves to a URL — an empty one. Labelling that as a
 * case study and sending paid traffic into it is worse than showing the logo
 * on its own, so an unwritten study renders the logo with no chip and no link.
 */
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
		<section className="relative w-full overflow-hidden border-neutral-200 border-b bg-white">
			<Frame className="py-10 sm:py-12">
				<ul className="grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 px-6 sm:grid-cols-3 lg:grid-cols-6">
					{MERCHANTS.map((merchant) => (
						<li
							className="flex flex-col items-center gap-2"
							key={merchant.slug}
						>
							{merchant.hasStudy ? (
								<Link
									className="flex flex-col items-center gap-2"
									href={`/case-studies/${merchant.slug}` as Route}
								>
									<span className="flex h-8 items-center justify-center">
										<Image
											alt={merchant.brand}
											className="h-full w-auto object-contain"
											height={96}
											src={merchant.logo}
											width={220}
										/>
									</span>
									<span className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-semibold text-[9px] text-neutral-500 tracking-[0.08em]">
										CASE STUDY
									</span>
								</Link>
							) : (
								<span className="flex h-8 items-center justify-center">
									<Image
										alt={merchant.brand}
										className="h-full w-auto object-contain"
										height={96}
										src={merchant.logo}
										width={220}
									/>
								</span>
							)}
						</li>
					))}
				</ul>
			</Frame>
		</section>
	);
}
