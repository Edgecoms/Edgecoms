"use client";

import type { FormEvent } from "react";

export function TeardownForm() {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<form
			className="flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white/95 p-6 shadow-lg backdrop-blur-md sm:p-8"
			onSubmit={handleSubmit}
		>
			{/* Field 1: Store URL */}
			<div className="flex flex-col gap-1.5">
				<label
					className="font-medium text-neutral-700 text-xs"
					htmlFor="storeUrl"
				>
					Your store URL
				</label>
				<input
					className="w-full rounded-lg border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 text-neutral-900 text-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
					id="storeUrl"
					name="storeUrl"
					placeholder="yourstore.com"
					required
					type="text"
				/>
			</div>

			{/* Field 2: Email & Name */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<label
						className="font-medium text-neutral-700 text-xs"
						htmlFor="email"
					>
						Email
					</label>
					<input
						className="w-full rounded-lg border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 text-neutral-900 text-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
						id="email"
						name="email"
						placeholder="you@store.com"
						required
						type="email"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<label
						className="font-medium text-neutral-700 text-xs"
						htmlFor="name"
					>
						Name (optional)
					</label>
					<input
						className="w-full rounded-lg border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 text-neutral-900 text-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
						id="name"
						name="name"
						placeholder="John Doe"
						type="text"
					/>
				</div>
			</div>

			{/* Field 3: Anything we should look at first? */}
			<div className="flex flex-col gap-1.5">
				<label className="font-medium text-neutral-700 text-xs" htmlFor="notes">
					Anything we should look at first? (optional)
				</label>
				<textarea
					className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50/60 px-3.5 py-2.5 text-neutral-900 text-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
					id="notes"
					name="notes"
					placeholder="AOV has been flat for a year, international traffic doesn't convert, that sort of thing."
					rows={3}
				/>
			</div>

			{/* Submit Button */}
			<button
				className="mt-2 w-full cursor-pointer rounded-lg bg-black px-5 py-3 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800 active:scale-[0.99]"
				type="submit"
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
