import { Star, User } from "lucide-react";

const STARS = ["s1", "s2", "s3", "s4", "s5"];

export default function ReviewsDiagram() {
	return (
		<div className="flex w-full flex-col items-center gap-3">
			<div className="flex w-full justify-end">
				<span className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAEAEA] bg-white px-2.5 py-1.5 font-medium text-[#52525b] text-[11px]">
					<User aria-hidden="true" className="size-3.5" />
					Customer
				</span>
			</div>

			<div className="w-full max-w-[230px] rounded-2xl border border-[#EDEDED] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.035)]">
				<div className="flex gap-0.5">
					{STARS.map((id) => (
						<Star
							aria-hidden="true"
							className="size-4 fill-[#EF5F37] text-[#EF5F37]"
							key={id}
						/>
					))}
				</div>
				<p className="mt-2.5 font-medium text-[#1c1c1e] text-[13px]">
					“Great quality and fast shipping!”
				</p>
				<div className="mt-3 space-y-1.5">
					<div className="h-1.5 w-full rounded-full bg-[#F1F1F2]" />
					<div className="h-1.5 w-2/3 rounded-full bg-[#F1F1F2]" />
				</div>
			</div>
		</div>
	);
}
