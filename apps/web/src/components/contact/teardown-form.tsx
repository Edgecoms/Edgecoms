"use client";

import type { FormEvent } from "react";

export function TeardownForm() {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-2xl border border-neutral-200 bg-white/95 p-6 sm:p-8 shadow-lg backdrop-blur-md flex flex-col gap-5"
		>
			{/* Field 1: Store URL */}
			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="storeUrl"
					className="font-medium text-xs text-neutral-700"
				>
					Your store URL
				</label>
				<input
					id="storeUrl"
					name="storeUrl"
					type="text"
					placeholder="yourstore.com"
					required
					className="w-full rounded-lg border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 text-neutral-900 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
				/>
			</div>

			{/* Field 2: Email & Name */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="email"
						className="font-medium text-xs text-neutral-700"
					>
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="you@store.com"
						required
						className="w-full rounded-lg border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 text-neutral-900 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<label
						htmlFor="name"
						className="font-medium text-xs text-neutral-700"
					>
						Name (optional)
					</label>
					<input
						id="name"
						name="name"
						type="text"
						placeholder="John Doe"
						className="w-full rounded-lg border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 text-neutral-900 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
					/>
				</div>
			</div>

			{/* Field 3: Anything we should look at first? */}
			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="notes"
					className="font-medium text-xs text-neutral-700"
				>
					Anything we should look at first? (optional)
				</label>
				<textarea
					id="notes"
					name="notes"
					rows={3}
					placeholder="AOV has been flat for a year, international traffic doesn't convert, that sort of thing."
					className="w-full rounded-lg border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 text-neutral-900 text-sm placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors resize-none"
				/>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				className="mt-2 w-full rounded-lg bg-black px-5 py-3 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800 active:scale-[0.99] cursor-pointer"
			>
				Send my store
			</button>

			{/* Footer Note */}
			<p className="text-center text-neutral-400 text-xs leading-relaxed">
				We send the teardown by email, so there is nothing to attend. If you
				would rather book a time, the audit link is on the left.
			</p>
		</form>
	);
}
