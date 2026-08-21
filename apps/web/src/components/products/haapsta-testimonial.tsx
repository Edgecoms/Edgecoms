import { BookOpen } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Frame } from "@/components/landing/frame";

export function HaapstaTestimonial() {
	return (
		<section className="relative w-full border-neutral-200 border-b bg-white">
			<Frame>
				<div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:px-8 sm:py-20">
					{/* Haapsta Company Logo */}
					<div className="flex items-center justify-center gap-2">
						<div className="flex size-7 items-center justify-center rounded-lg bg-neutral-900 font-bold text-white text-xs">
							H
						</div>
						<span className="font-bold font-satoshi text-neutral-900 text-xl tracking-tight">
							Haapsta
						</span>
					</div>

					{/* Testimonial Quote */}
					<blockquote className="mx-auto mt-8 max-w-2xl font-normal text-lg text-neutral-700 leading-relaxed tracking-tight sm:text-xl md:text-[22px]">
						“Edge is the{" "}
						<span className="font-bold text-neutral-900">
							ultimate app infrastructure
						</span>{" "}
						for every Shopify store. If you're looking to 10x your average order
						value and conversion rate, I cannot recommend building with{" "}
						<span className="font-bold text-neutral-900 underline decoration-neutral-400 decoration-dotted underline-offset-4">
							Edge Apps
						</span>{" "}
						enough.”
					</blockquote>

					{/* Author Profile */}
					<div className="mt-8 flex flex-col items-center">
						<p className="font-semibold text-neutral-900 text-sm">
							Marcus Bennett
						</p>
						<p className="font-medium text-neutral-500 text-xs">CEO, Haapsta</p>
					</div>

					{/* Read the Story Button */}
					<div className="mt-6">
						<Link
							className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200/80 bg-blue-50/60 px-3.5 py-1.5 font-medium text-blue-600 text-xs shadow-2xs transition-colors hover:bg-blue-100/70 hover:text-blue-700"
							href={"/#case-studies" as Route}
						>
							<BookOpen className="size-3.5" />
							<span>Read the story</span>
						</Link>
					</div>
				</div>
			</Frame>
		</section>
	);
}
