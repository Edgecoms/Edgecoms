"use client";

import {
	Dialog,
	DialogBackdrop,
	DialogPopup,
	DialogPortal,
	DialogTitle,
} from "@edgecoms/ui/components/dialog";
import { cn } from "@edgecoms/ui/lib/utils";
import {
	Lock,
	Minus,
	Plus,
	RotateCcw,
	ShieldCheck,
	ShoppingBag,
	Timer,
	Truck,
	X,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { EDGE_CART_APP_STORE_URL } from "@/lib/edge-cart-lead";

/**
 * THE LIVE DRAWER, RUNNING ON THE PAGE.
 *
 * The claim this section makes is "not a screenshot", so it has to be true:
 * every control below does the thing it looks like it does, and the numbers
 * are recomputed from cart state rather than written down. A static mock with
 * a fake progress bar would undercut the sentence above it.
 *
 * Two rules it inherits from the rest of the codebase:
 *
 * 1. **Money is integer minor units.** This is a demo and nobody is billed
 *    from it, but a cart that drifts a cent after six clicks is exactly the
 *    bug the house rule exists to prevent, and it would be visible on screen.
 *    Cents in, formatted once on the way out.
 * 2. **The drawer is a real dialog.** Base UI owns the focus trap, Escape, the
 *    scroll lock and the outside press, the same way the mobile nav sheet does.
 *    Hand-rolling a trap here would be a worse copy of one the repo already has.
 */

interface DemoProduct {
	/** Minor units. See rule 1. */
	cents: number;
	id: string;
	name: string;
	/** Two short words for the placeholder tile, matching the hero mockup. */
	tile: string;
	variant: string;
}

const PRODUCTS: readonly DemoProduct[] = [
	{
		cents: 8500,
		id: "backpack",
		name: "Minimalist Leather Backpack",
		tile: "Backpack",
		variant: "Color: Charcoal",
	},
	{
		cents: 6400,
		id: "weekender",
		name: "Canvas Weekender",
		tile: "Weekender",
		variant: "Color: Sand",
	},
	{
		cents: 2800,
		id: "card-holder",
		name: "Leather Card Holder",
		tile: "Card Holder",
		variant: "Color: Tan",
	},
] as const;

/** The rule-based upsell. Becomes a real line item once accepted. */
const UPSELL: DemoProduct = {
	cents: 1400,
	id: "balm",
	name: "Premium Leather Balm",
	tile: "Leather Care",
	variant: "50ml",
};

const ADD_ON_CENTS = 400;
const FREE_SHIPPING_THRESHOLD_CENTS = 10_000;
const COUNTDOWN_SECONDS = 10 * 60;
const PERCENT = 100;
const SECONDS_PER_MINUTE = 60;
const CENTS_PER_UNIT = 100;

const ALL_PRODUCTS = [...PRODUCTS, UPSELL];

function money(cents: number): string {
	return `$${(cents / CENTS_PER_UNIT).toFixed(2)}`;
}

function clock(totalSeconds: number): string {
	const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
	const seconds = totalSeconds % SECONDS_PER_MINUTE;
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** The neutral placeholder tile, in the hero mockup's visual language. */
function Tile({
	className,
	label,
	size = "md",
}: {
	className?: string;
	label: string;
	size?: "md" | "lg";
}) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				"flex shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 text-center font-bold text-[10px] text-neutral-500 leading-tight",
				size === "lg" ? "aspect-[4/3] w-full text-xs" : "size-14",
				className
			)}
		>
			{label}
		</div>
	);
}

type Quantities = Record<string, number>;

function useCartTotals(quantities: Quantities, giftWrap: boolean) {
	return useMemo(() => {
		const lines = ALL_PRODUCTS.filter(
			(product) => (quantities[product.id] ?? 0) > 0
		).map((product) => ({
			product,
			quantity: quantities[product.id] ?? 0,
		}));

		const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
		const itemsCents = lines.reduce(
			(sum, line) => sum + line.product.cents * line.quantity,
			0
		);
		const subtotalCents = itemsCents + (giftWrap ? ADD_ON_CENTS : 0);
		const remainingCents = Math.max(
			0,
			FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents
		);
		const percent = Math.min(
			PERCENT,
			Math.round((subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * PERCENT)
		);

		return { itemCount, lines, percent, remainingCents, subtotalCents };
	}, [giftWrap, quantities]);
}

function RewardBar({
	percent,
	remainingCents,
}: {
	percent: number;
	remainingCents: number;
}) {
	const unlocked = remainingCents === 0;

	return (
		<div className="my-4 rounded-xl border border-blue-100/80 bg-blue-50/60 p-3">
			<div className="mb-1.5 flex items-center justify-between gap-3 font-semibold text-xs">
				<span className="flex items-center gap-1.5 text-blue-700">
					<Truck className="size-3.5 shrink-0" />
					{unlocked ? (
						<span className="font-bold text-emerald-700">
							Free shipping unlocked
						</span>
					) : (
						<span>Add {money(remainingCents)} more for Free Shipping</span>
					)}
				</span>
				<span className="shrink-0 font-mono text-neutral-600">{percent}%</span>
			</div>
			<div
				aria-label="Progress toward free shipping"
				aria-valuemax={PERCENT}
				aria-valuemin={0}
				aria-valuenow={percent}
				className="h-2 w-full overflow-hidden rounded-full bg-blue-100"
				role="progressbar"
			>
				<div
					className={cn(
						"h-full rounded-full transition-all duration-300 motion-reduce:transition-none",
						unlocked ? "bg-emerald-600" : "bg-blue-600"
					)}
					style={{ width: `${percent}%` }}
				/>
			</div>
		</div>
	);
}

function Stepper({
	name,
	onChange,
	quantity,
}: {
	name: string;
	onChange: (next: number) => void;
	quantity: number;
}) {
	return (
		<div className="flex items-center gap-1 rounded-lg border border-neutral-200">
			<button
				aria-label={`Decrease quantity of ${name}`}
				className="flex size-7 items-center justify-center rounded-l-lg text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
				onClick={() => onChange(quantity - 1)}
				type="button"
			>
				<Minus className="size-3" />
			</button>
			<span
				aria-live="polite"
				className="min-w-5 text-center font-mono font-semibold text-neutral-900 text-xs"
			>
				{quantity}
			</span>
			<button
				aria-label={`Increase quantity of ${name}`}
				className="flex size-7 items-center justify-center rounded-r-lg text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
				onClick={() => onChange(quantity + 1)}
				type="button"
			>
				<Plus className="size-3" />
			</button>
		</div>
	);
}

const TRUST_BADGES = [
	{ icon: Lock, label: "Secure checkout" },
	{ icon: Truck, label: "Tracked delivery" },
	{ icon: RotateCcw, label: "Easy returns" },
	{ icon: ShieldCheck, label: "Buyer protection" },
] as const;

export function CartDemo() {
	const reduced = useReducedMotion();
	const discountId = useId();
	/**
	 * Where focus lands when the drawer opens, stated explicitly rather than
	 * left to the default resolver. The close button is the right first stop for
	 * a drawer: it is the escape hatch, and Tab from there walks the contents in
	 * reading order.
	 */
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	/** Returns focus to whichever "Add to cart" opened the drawer. */
	const triggerRef = useRef<HTMLElement | null>(null);
	const [open, setOpen] = useState(false);
	const [quantities, setQuantities] = useState<Quantities>({});
	const [giftWrap, setGiftWrap] = useState(false);
	const [discount, setDiscount] = useState("");
	const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
	const [showCheckoutNote, setShowCheckoutNote] = useState(false);

	const { itemCount, lines, percent, remainingCents, subtotalCents } =
		useCartTotals(quantities, giftWrap);

	const balmInCart = (quantities[UPSELL.id] ?? 0) > 0;

	/** Counts only while the drawer is open, and resets each time it opens. */
	useEffect(() => {
		if (!open) {
			return;
		}

		setSecondsLeft(COUNTDOWN_SECONDS);
		const tick = setInterval(() => {
			setSecondsLeft((current) => (current > 0 ? current - 1 : 0));
		}, 1000);

		return () => clearInterval(tick);
	}, [open]);

	const setQuantity = (id: string, next: number) => {
		setQuantities((current) => {
			const updated = { ...current };
			if (next <= 0) {
				delete updated[id];
			} else {
				updated[id] = next;
			}
			return updated;
		});
	};

	const addToCart = (id: string, trigger: HTMLElement | null) => {
		triggerRef.current = trigger;
		setQuantity(id, (quantities[id] ?? 0) + 1);
		setShowCheckoutNote(false);
		setOpen(true);
	};

	return (
		<div>
			{/* The demo storefront. Reserved height so the section does not resize
			    when the tiles paint. */}
			<div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{PRODUCTS.map((product) => (
					<div
						className="flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-xs"
						key={product.id}
					>
						<Tile label={product.tile} size="lg" />
						<div className="mt-3 flex flex-1 flex-col">
							<span className="font-semibold text-neutral-900 text-sm leading-snug">
								{product.name}
							</span>
							<span className="mt-1 font-mono text-neutral-500 text-sm">
								{money(product.cents)}
							</span>
						</div>
						<button
							className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-black px-4 font-semibold text-sm text-white shadow-xs transition-colors hover:bg-neutral-800"
							onClick={(event) => addToCart(product.id, event.currentTarget)}
							type="button"
						>
							Add to cart
						</button>
					</div>
				))}
			</div>

			<Dialog onOpenChange={setOpen} open={open}>
				<DialogPortal>
					<DialogBackdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
					<DialogPopup
						className={cn(
							"fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col bg-white shadow-2xl",
							/* Slide by default, fade when the OS asks for less motion.
							   Both directions covered, so the exit matches the entrance. */
							reduced
								? "opacity-100 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
								: "translate-x-0 transition-transform duration-300 ease-out data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full"
						)}
						finalFocus={triggerRef}
						initialFocus={closeButtonRef}
					>
						{/* Header */}
						<div className="flex items-center justify-between border-neutral-100 border-b px-5 py-4">
							<DialogTitle className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
								<ShoppingBag className="size-4 text-blue-600" />
								<span>Your Shopping Cart ({itemCount})</span>
							</DialogTitle>
							<button
								aria-label="Close cart"
								className="flex size-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
								onClick={() => setOpen(false)}
								ref={closeButtonRef}
								type="button"
							>
								<X className="size-4" />
							</button>
						</div>

						{/* Announcement */}
						<p className="bg-neutral-900 px-5 py-2 text-center font-medium text-[11px] text-white">
							Orders before 2pm ship the same day
						</p>

						<div className="flex-1 overflow-y-auto px-5 pb-4">
							<RewardBar percent={percent} remainingCents={remainingCents} />

							{lines.length === 0 ? (
								<p className="py-10 text-center text-neutral-500 text-sm">
									Your cart is empty. Add a product to see the drawer fill.
								</p>
							) : (
								<ul>
									{lines.map(({ product, quantity }) => (
										<li
											className="flex gap-3 border-neutral-100 border-b py-3"
											key={product.id}
										>
											<Tile label={product.tile} />
											<div className="flex flex-1 flex-col justify-between">
												<div className="flex items-start justify-between gap-2">
													<span className="font-bold text-neutral-900 text-xs">
														{product.name}
													</span>
													<span className="shrink-0 font-bold font-mono text-neutral-900 text-xs">
														{money(product.cents * quantity)}
													</span>
												</div>
												<div className="mt-2 flex items-center justify-between">
													<span className="text-[10px] text-neutral-400">
														{product.variant}
													</span>
													<Stepper
														name={product.name}
														onChange={(next) => setQuantity(product.id, next)}
														quantity={quantity}
													/>
												</div>
											</div>
										</li>
									))}
								</ul>
							)}

							{/* Rule-based upsell, in the hero mockup's styling. */}
							{balmInCart ? null : (
								<div className="my-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-3">
									<div className="flex min-w-0 items-center gap-2.5">
										<Tile
											className="size-10 border-amber-200 bg-amber-100 text-amber-800"
											label={UPSELL.tile}
										/>
										<div className="min-w-0">
											<div className="truncate font-bold text-neutral-900 text-xs">
												{UPSELL.name}
											</div>
											<div className="text-[10px] text-neutral-500">
												Frequently bought together, +{money(UPSELL.cents)}
											</div>
										</div>
									</div>
									<button
										aria-label={`Add ${UPSELL.name} to cart`}
										className="shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-semibold text-neutral-800 text-xs shadow-2xs transition-colors hover:bg-neutral-50"
										onClick={() => setQuantity(UPSELL.id, 1)}
										type="button"
									>
										Add +
									</button>
								</div>
							)}

							{/* Add-on. Separate from the upsell on purpose: an add-on must
							    never occupy a slot the upsell engine is bidding for. */}
							<div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-3">
								<span className="font-semibold text-neutral-800 text-xs">
									Gift wrap +{money(ADD_ON_CENTS)}
								</span>
								<button
									aria-checked={giftWrap}
									aria-label={`Gift wrap, ${money(ADD_ON_CENTS)}`}
									className={cn(
										"relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2",
										giftWrap ? "bg-blue-600" : "bg-neutral-300"
									)}
									onClick={() => setGiftWrap((current) => !current)}
									role="switch"
									type="button"
								>
									<span
										className={cn(
											"inline-block size-4 rounded-full bg-white shadow-xs transition-transform motion-reduce:transition-none",
											giftWrap ? "translate-x-6" : "translate-x-1"
										)}
									/>
								</button>
							</div>

							{/* Countdown */}
							<div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
								<span className="flex items-center gap-1.5 font-semibold text-neutral-600 text-xs">
									<Timer className="size-3.5" />
									Reserved for
								</span>
								<span className="font-bold font-mono text-neutral-900 text-sm tabular-nums">
									{clock(secondsLeft)}
								</span>
							</div>

							{/* Discount code */}
							<div className="mt-3">
								<label
									className="block font-medium text-neutral-600 text-xs"
									htmlFor={discountId}
								>
									Discount code
								</label>
								<input
									className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-neutral-900 text-xs outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
									id={discountId}
									onChange={(event) => setDiscount(event.target.value)}
									placeholder="Enter a code"
									type="text"
									value={discount}
								/>
							</div>
						</div>

						{/* Footer */}
						<div className="border-neutral-200 border-t px-5 py-4">
							<div className="flex items-center justify-between text-xs">
								<span className="text-neutral-500">Subtotal</span>
								<span className="font-bold font-mono text-neutral-900 text-sm">
									{money(subtotalCents)}
								</span>
							</div>

							<button
								className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A31F4] py-3 font-semibold text-white text-xs shadow-xs transition-colors hover:bg-[#4a28cc]"
								onClick={() => setShowCheckoutNote(true)}
								type="button"
							>
								<Lock className="size-3.5" />
								<span>Checkout with Shop Pay</span>
							</button>

							{showCheckoutNote ? (
								<p
									className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-neutral-600 text-xs leading-relaxed"
									role="status"
								>
									This is a demo. Install Edge Cart to run it on your store.{" "}
									<a
										className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
										href={EDGE_CART_APP_STORE_URL}
										rel="noopener noreferrer"
										target="_blank"
									>
										Install Edge Cart
									</a>
								</p>
							) : null}

							<ul className="mt-4 flex flex-wrap items-center justify-between gap-2 border-neutral-100 border-t pt-3">
								{TRUST_BADGES.map((badge) => (
									<li
										className="flex items-center gap-1 text-[10px] text-neutral-500"
										key={badge.label}
									>
										<badge.icon className="size-3 text-neutral-400" />
										{badge.label}
									</li>
								))}
							</ul>
						</div>
					</DialogPopup>
				</DialogPortal>
			</Dialog>
		</div>
	);
}
