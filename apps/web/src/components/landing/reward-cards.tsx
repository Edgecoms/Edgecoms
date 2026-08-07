import {
	Infinity as InfinityIcon,
	Percent,
	Repeat,
	Wallet,
} from "lucide-react";
import type { ComponentType } from "react";

/**
 * The commission structure, as the cards a partner would see in the portal.
 *
 * Rates are the program's stated defaults; the per-app override is real (a
 * partner has a default rate in basis points and an optional per-app rate on
 * top of it), which is why one card says so rather than implying a single
 * blanket number.
 */
interface Reward {
	detail: string;
	icon: ComponentType<{ className?: string }>;
	lead: string;
	meta: string;
}

const REWARDS: readonly Reward[] = [
	{
		detail: "of net Edge revenue, every month",
		icon: Percent,
		lead: "Earn 20%",
		meta: "Default rate",
	},
	{
		detail: "for as long as the merchant stays subscribed",
		icon: InfinityIcon,
		lead: "Lifetime",
		meta: "No expiry",
	},
	{
		detail: "set per app, on top of your default rate",
		icon: Repeat,
		lead: "Custom rates",
		meta: "Per app",
	},
	{
		detail: "paid monthly, in your own currency",
		icon: Wallet,
		lead: "No minimum",
		meta: "Payouts",
	},
];

function RewardCard({ reward }: { reward: Reward }) {
	const Icon = reward.icon;

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.18)]">
			<div className="flex items-center justify-between gap-3">
				<span className="flex size-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
					<Icon aria-hidden="true" className="size-3.5" />
				</span>
				<span className="rounded-full bg-[#7C3AED]/10 px-2 py-0.5 font-medium text-[#7C3AED] text-[11px]">
					{reward.meta}
				</span>
			</div>
			<p className="text-[14px] text-neutral-500">
				<span className="font-medium text-neutral-900">{reward.lead}</span>{" "}
				{reward.detail}
			</p>
		</div>
	);
}

export function RewardCards() {
	return (
		/* Fixed height with the columns overflowing it: the stack visibly
		   continues past the cut, which is the whole reason it is two offset
		   columns rather than a tidy 2×2 that stops. */
		<div className="relative h-[380px] overflow-hidden px-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_70%,transparent)]">
			<div className="mx-auto grid max-w-[640px] grid-cols-1 gap-4 pt-8 sm:grid-cols-2">
				<div className="flex flex-col gap-4">
					{REWARDS.map((reward) => (
						<RewardCard key={reward.lead} reward={reward} />
					))}
				</div>
				<div className="hidden flex-col gap-4 pt-12 sm:flex">
					{[...REWARDS].reverse().map((reward) => (
						<RewardCard key={reward.lead} reward={reward} />
					))}
				</div>
			</div>
		</div>
	);
}
