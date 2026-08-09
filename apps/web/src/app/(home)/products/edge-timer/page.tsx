"use client";

import {
	Clock,
	Flame,
	Minus,
	Play,
	Plus,
	ShieldAlert,
	Sparkles,
	Timer as TimerIcon,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { BOOKING_URL } from "@/lib/booking";
import { getProduct } from "@/lib/products";

const product = getProduct("edge-timer");

function EdgeTimerHeroSection() {
	const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 55 });

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
				if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
				return { hours: prev.hours > 0 ? prev.hours - 1 : 0, minutes: 59, seconds: 59 };
			});
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<section className="relative isolate w-full overflow-hidden border-neutral-200 border-b bg-white">
			<Frame className="relative pt-16 pb-12 sm:pt-20 sm:pb-16">
				{/* Grid lines with radial mask */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 [mask-image:radial-gradient(ellipse_100%_65%_at_50%_100%,black_30%,transparent_80%)]"
				/>

				{/* Soft amber/orange ambient glow */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_85%_65%_at_50%_90%,rgba(245,158,11,0.15),rgba(234,88,12,0.1),transparent_75%)]"
				/>

				<div className="mx-auto max-w-[1080px] px-4 sm:px-6">
					<div className="flex flex-col items-start text-left max-w-[540px] z-20 relative">
						<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 font-semibold text-xs text-amber-800 shadow-2xs">
							<span className="size-2 rounded-full bg-amber-500" />
							{product?.name ?? "Edge Timer"}
						</span>

						<h1 className="mt-4 font-bold font-satoshi text-4xl sm:text-5xl lg:text-[52px] text-neutral-900 leading-[1.08] tracking-tight">
							{product?.tagline ?? "Give them a deadline. Watch CVR move."}
						</h1>

						<p className="mt-4 text-neutral-500 text-sm sm:text-base leading-relaxed max-w-[480px]">
							{product?.heroLead ??
								"Countdown timers on product pages, the cart, the announcement bar and collections, tied to deadlines that are actually real. Live in about five minutes, with no code and no theme edits."}
						</p>

						<div className="mt-6 flex items-center gap-3">
							<a
								href={product?.appStoreUrl ?? "https://apps.shopify.com/urgency-timer"}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
							>
								Start for free
							</a>
							<a
								href={BOOKING_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-medium text-sm text-neutral-900 shadow-2xs transition-colors hover:bg-neutral-50"
							>
								<Play className="size-3.5 fill-neutral-800 text-neutral-800" />
								<span>Watch Demo</span>
							</a>
						</div>
					</div>

					{/* Live Countdown Timer Interactive Showcase Card */}
					<div className="relative mt-10 sm:mt-6 w-full max-w-xl mx-auto rounded-3xl border border-neutral-200/90 bg-white shadow-xl p-6 sm:p-8">
						<div className="flex items-center justify-between border-neutral-200 border-b pb-4">
							<div className="flex items-center gap-2">
								<TimerIcon className="size-5 text-amber-600" />
								<span className="font-bold text-neutral-900 text-sm">Flash Sale Announcement Bar</span>
							</div>
							<span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 font-mono font-bold text-xs text-amber-700">
								+ 14% CVR Lift
							</span>
						</div>

						{/* Timer Bar Banner Component */}
						<div className="my-6 rounded-2xl bg-neutral-900 text-white p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
							<div className="flex items-center gap-2">
								<Flame className="size-5 text-amber-400 fill-amber-400" />
								<span className="font-semibold text-xs sm:text-sm">Order in the next to ship today!</span>
							</div>
							<div className="flex items-center gap-2 font-mono">
								<div className="flex flex-col items-center bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">
									<span className="font-bold text-base text-amber-400">
										{String(timeLeft.hours).padStart(2, "0")}
									</span>
									<span className="text-[9px] text-neutral-400">HOURS</span>
								</div>
								<span className="font-bold text-amber-400 text-sm">:</span>
								<div className="flex flex-col items-center bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">
									<span className="font-bold text-base text-amber-400">
										{String(timeLeft.minutes).padStart(2, "0")}
									</span>
									<span className="text-[9px] text-neutral-400">MINS</span>
								</div>
								<span className="font-bold text-amber-400 text-sm">:</span>
								<div className="flex flex-col items-center bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700">
									<span className="font-bold text-base text-amber-400">
										{String(timeLeft.seconds).padStart(2, "0")}
									</span>
									<span className="text-[9px] text-neutral-400">SECS</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
							<div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5">
								<span className="text-[10px] text-neutral-400 block">Placement</span>
								<span className="font-semibold text-neutral-800">PDP & Cart</span>
							</div>
							<div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5">
								<span className="text-[10px] text-neutral-400 block">Timer Mode</span>
								<span className="font-semibold text-neutral-800">Evergreen</span>
							</div>
							<div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5">
								<span className="text-[10px] text-neutral-400 block">Theme Load</span>
								<span className="font-semibold text-emerald-700 font-mono">0ms Bloat</span>
							</div>
						</div>
					</div>
				</div>
			</Frame>
		</section>
	);
}

function EdgeTimerFaqSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFaq = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	const faqItems = product?.faq ?? [];

	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame className="py-16 sm:py-20">
				<div className="px-6 text-center sm:px-8">
					<h2 className="font-bold font-satoshi text-3xl text-neutral-900 leading-[1.1] tracking-tight sm:text-4xl">
						Frequently asked questions
					</h2>

					<div className="mx-auto mt-10 max-w-xl text-left border-neutral-200/80 border-t border-b divide-y divide-neutral-200/80">
						{faqItems.map((faq, idx) => {
							const isOpen = openIndex === idx;
							return (
								<div key={faq.question} className="py-1">
									<button
										type="button"
										onClick={() => toggleFaq(idx)}
										aria-expanded={isOpen}
										className="flex w-full items-center justify-between py-3.5 text-left font-medium text-xs text-neutral-900 transition-colors hover:text-neutral-600 sm:text-sm"
									>
										<span>{faq.question}</span>
										<span className="ml-4 flex size-5 shrink-0 items-center justify-center text-neutral-500">
											{isOpen ? (
												<Minus className="size-3.5 text-neutral-700" />
											) : (
												<Plus className="size-3.5 text-neutral-500" />
											)}
										</span>
									</button>
									{isOpen && (
										<div className="pb-4 pt-1 text-neutral-500 text-xs leading-relaxed sm:text-sm">
											{faq.answer}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</Frame>
		</section>
	);
}

export default function EdgeTimerPage() {
	if (!product) return null;

	return (
		<main className="min-h-screen bg-white">
			<EdgeTimerHeroSection />
			<LogoCloud />
			<EdgeTimerFaqSection />
			<CtaDark />
		</main>
	);
}
