"use client";

import { Flame, Minus, Plus, Timer as TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { CtaDark } from "@/components/landing/cta-dark";
import { Frame } from "@/components/landing/frame";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { Reveal } from "@/components/ui/reveal";
import { BOOKING_LABEL, BOOKING_URL } from "@/lib/booking";
import { getProduct } from "@/lib/products";

const product = getProduct("edge-timer");

function EdgeTimerHeroSection() {
	const [timeLeft, setTimeLeft] = useState({
		hours: 2,
		minutes: 14,
		seconds: 55,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev.seconds > 0) {
					return { ...prev, seconds: prev.seconds - 1 };
				}
				if (prev.minutes > 0) {
					return { ...prev, minutes: 59, seconds: 59 };
				}
				return {
					hours: prev.hours > 0 ? prev.hours - 1 : 0,
					minutes: 59,
					seconds: 59,
				};
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
					<div className="relative z-20 flex max-w-[540px] flex-col items-start text-left">
						<Reveal>
							<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 font-semibold text-amber-800 text-xs shadow-2xs">
								<span className="size-2 rounded-full bg-amber-500" />
								{product?.name ?? "Edge Timer"}
							</span>
						</Reveal>

						<Reveal delay={0.08}>
							<h1 className="mt-4 font-bold font-satoshi text-4xl text-neutral-900 leading-[1.08] tracking-tight sm:text-5xl lg:text-[52px]">
								{product?.tagline ?? "Give them a deadline. Watch CVR move."}
							</h1>
						</Reveal>

						<Reveal delay={0.16}>
							<p className="mt-4 max-w-[480px] text-neutral-500 text-sm leading-relaxed sm:text-base">
								{product?.heroLead ??
									"Countdown timers on product pages, the cart, the announcement bar and collections, tied to deadlines that are actually real. Live in about five minutes, with no code and no theme edits."}
							</p>
						</Reveal>

						<Reveal delay={0.24}>
							<div className="mt-6 flex items-center gap-3">
								<a
									className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
									href={
										product?.appStoreUrl ??
										"https://apps.shopify.com/urgency-timer"
									}
									rel="noopener noreferrer"
									target="_blank"
								>
									Start for free
								</a>
								<a
									className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 font-medium text-neutral-900 text-sm shadow-2xs transition-colors hover:bg-neutral-50"
									href={BOOKING_URL}
									rel="noopener noreferrer"
									target="_blank"
								>
									<span>{BOOKING_LABEL}</span>
								</a>
							</div>
						</Reveal>
					</div>

					{/* Live Countdown Timer Interactive Showcase Card */}
					<div className="relative mx-auto mt-10 w-full max-w-xl rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xl sm:mt-6 sm:p-8">
						<div className="flex items-center justify-between border-neutral-200 border-b pb-4">
							<div className="flex items-center gap-2">
								<TimerIcon className="size-5 text-amber-600" />
								<span className="font-bold text-neutral-900 text-sm">
									Flash Sale Announcement Bar
								</span>
							</div>
							<span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-bold font-mono text-amber-700 text-xs">
								+ 14% CVR Lift
							</span>
						</div>

						{/* Timer Bar Banner Component */}
						<div className="my-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-neutral-900 p-4 text-white shadow-lg sm:flex-row">
							<div className="flex items-center gap-2">
								<Flame className="size-5 fill-amber-400 text-amber-400" />
								<span className="font-semibold text-xs sm:text-sm">
									Order in the next to ship today!
								</span>
							</div>
							<div className="flex items-center gap-2 font-mono">
								<div className="flex flex-col items-center rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1">
									<span className="font-bold text-amber-400 text-base">
										{String(timeLeft.hours).padStart(2, "0")}
									</span>
									<span className="text-[9px] text-neutral-400">HOURS</span>
								</div>
								<span className="font-bold text-amber-400 text-sm">:</span>
								<div className="flex flex-col items-center rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1">
									<span className="font-bold text-amber-400 text-base">
										{String(timeLeft.minutes).padStart(2, "0")}
									</span>
									<span className="text-[9px] text-neutral-400">MINS</span>
								</div>
								<span className="font-bold text-amber-400 text-sm">:</span>
								<div className="flex flex-col items-center rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1">
									<span className="font-bold text-amber-400 text-base">
										{String(timeLeft.seconds).padStart(2, "0")}
									</span>
									<span className="text-[9px] text-neutral-400">SECS</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
							<div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5">
								<span className="block text-[10px] text-neutral-400">
									Placement
								</span>
								<span className="font-semibold text-neutral-800">
									PDP & Cart
								</span>
							</div>
							<div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5">
								<span className="block text-[10px] text-neutral-400">
									Timer Mode
								</span>
								<span className="font-semibold text-neutral-800">
									Evergreen
								</span>
							</div>
							<div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5">
								<span className="block text-[10px] text-neutral-400">
									Theme Load
								</span>
								<span className="font-mono font-semibold text-emerald-700">
									0ms Bloat
								</span>
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

					<div className="mx-auto mt-10 max-w-xl divide-y divide-neutral-200/80 border-neutral-200/80 border-t border-b text-left">
						{faqItems.map((faq, idx) => {
							const isOpen = openIndex === idx;
							return (
								<div className="py-1" key={faq.question}>
									<button
										aria-expanded={isOpen}
										className="flex w-full items-center justify-between py-3.5 text-left font-medium text-neutral-900 text-xs transition-colors hover:text-neutral-600 sm:text-sm"
										onClick={() => toggleFaq(idx)}
										type="button"
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
										<div className="pt-1 pb-4 text-neutral-500 text-xs leading-relaxed sm:text-sm">
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
	if (!product) {
		return null;
	}

	return (
		<main className="min-h-screen bg-white">
			<EdgeTimerHeroSection />
			<Reveal>
				<LogoCloud />
			</Reveal>
			<Reveal>
				<EdgeTimerFaqSection />
			</Reveal>
			<Reveal>
				<CtaDark />
			</Reveal>
		</main>
	);
}
