import { CalendarDays, Heart, RefreshCw, UserPlus } from "lucide-react";
import type React from "react";

interface Step {
	caption?: string;
	highlight?: boolean;
	icon: React.ReactNode;
	label: string;
}

const STEPS: Step[] = [
	{
		icon: <UserPlus aria-hidden="true" className="size-4" />,
		label: "Sign up",
	},
	{
		icon: <CalendarDays aria-hidden="true" className="size-4" />,
		label: "Trial",
		caption: "7 days",
	},
	{
		icon: <RefreshCw aria-hidden="true" className="size-4" />,
		label: "Renewal",
		caption: "Monthly",
		highlight: true,
	},
	{
		icon: <Heart aria-hidden="true" className="size-4" />,
		label: "Loyal",
		caption: "Customer",
	},
];

export default function SubscriptionsDiagram() {
	return (
		<div className="flex w-full flex-col items-center gap-5">
			<div className="flex w-full items-start justify-between">
				{STEPS.map((step) => (
					<div
						className="flex flex-1 flex-col items-center gap-1.5"
						key={step.label}
					>
						<div
							className={`grid size-9 place-items-center rounded-full border bg-white ${
								step.highlight
									? "border-[#F3A487] text-[#EF5F37]"
									: "border-[#EAEAEA] text-[#52525b]"
							}`}
						>
							{step.icon}
						</div>
						<span
							className={`text-[11px] ${step.highlight ? "font-medium text-[#EF5F37]" : "text-[#1c1c1e]"}`}
						>
							{step.label}
						</span>
						{step.caption ? (
							<span className="-mt-1 text-[#a1a1aa] text-[9px]">
								{step.caption}
							</span>
						) : null}
					</div>
				))}
			</div>

			<div className="w-full max-w-[230px] rounded-2xl border border-[#EDEDED] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.035)]">
				<div className="flex items-baseline justify-between">
					<span className="text-[#8a8a8e] text-[11px]">Recurring revenue</span>
					<span className="font-semibold text-[#EF5F37] text-[13px]">+23%</span>
				</div>
				<svg
					aria-hidden="true"
					className="mt-2 h-9 w-full"
					preserveAspectRatio="none"
					viewBox="0 0 200 36"
				>
					<defs>
						<linearGradient id="rev-fill" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stopColor="#EF5F37" stopOpacity="0.18" />
							<stop offset="100%" stopColor="#EF5F37" stopOpacity="0" />
						</linearGradient>
					</defs>
					<path
						d="M0 30 L30 26 L60 28 L90 18 L120 20 L150 10 L200 4 L200 36 L0 36 Z"
						fill="url(#rev-fill)"
					/>
					<path
						d="M0 30 L30 26 L60 28 L90 18 L120 20 L150 10 L200 4"
						fill="none"
						stroke="#EF5F37"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
				</svg>
			</div>
		</div>
	);
}
