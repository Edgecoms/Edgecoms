import { ButtonLink } from "@edgecoms/ui/components/button";
import { Infinity as InfinityIcon, Unlink, Wallet } from "lucide-react";
import type { Route } from "next";
import { BrandPanel } from "@/components/marketing/brand-panel";

/* Program facts, not performance metrics — nothing here is a number we would
   have to substantiate. */
const FACTS = [
	{ icon: InfinityIcon, label: "Lifetime commissions" },
	{ icon: Unlink, label: "No referral links" },
	{ icon: Wallet, label: "Paid every month" },
] as const;

export function PartnersHero() {
	return (
		<section className="w-full px-3 pb-3">
			<BrandPanel className="flex w-full items-center justify-center">
				<div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-6 py-24 text-center sm:gap-8 sm:py-32">
					<p className="font-medium text-body-sm text-white/80">
						Partner program
					</p>

					<h1 className="text-balance font-medium text-display text-white sm:text-display-lg lg:text-display-xl">
						Every merchant you manage, earning every month
					</h1>

					<p className="max-w-2xl text-pretty text-body-lg text-white leading-relaxed">
						Register the Shopify stores you already run. Take a share of Edge's
						revenue for as long as they stay subscribed. No referral links, no
						tracking codes, no expiry windows.
					</p>

					<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
						<ButtonLink
							className="h-11 rounded-full bg-white px-6 text-[15px] text-neutral-900 hover:bg-white/90 active:bg-white/90"
							href={"/register" as Route}
							size="xl"
							variant="secondary"
						>
							Apply to the program
						</ButtonLink>
						<ButtonLink
							className="h-11 rounded-full border border-white/40 bg-white/10 px-6 text-[15px] text-white hover:bg-white/20 active:bg-white/20"
							href={"/login" as Route}
							size="xl"
							variant="tertiary"
						>
							Partner login
						</ButtonLink>
					</div>

					<ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-2">
						{FACTS.map((fact) => {
							const Icon = fact.icon;
							return (
								<li
									className="flex items-center gap-2 text-[15px] text-white"
									key={fact.label}
								>
									<Icon
										aria-hidden="true"
										className="size-4"
										strokeWidth={1.5}
									/>
									{fact.label}
								</li>
							);
						})}
					</ul>
				</div>
			</BrandPanel>
		</section>
	);
}
