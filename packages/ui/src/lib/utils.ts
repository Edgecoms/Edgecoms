import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The type scale from `globals.css`, repeated here because tailwind-merge does
 * not read the Tailwind theme.
 *
 * Without this it cannot tell `text-body-sm` (a size) from
 * `text-primary-foreground` (a colour) — both are `text-` plus an unknown
 * word — so it files them in the same group and the later one silently evicts
 * the earlier. In practice that meant any component passing a custom type size
 * through `className` deleted the colour baked into its variant, and the
 * element fell back to inheriting. Arbitrary values like `text-[15px]` were
 * never affected, which is why it hid for so long.
 *
 * Add a key here whenever one is added to the `--text-*` block in
 * `globals.css`.
 */
const FONT_SIZES = [
	"display-xl",
	"display-lg",
	"display",
	"h1",
	"h2",
	"h3",
	"body-lg",
	"body",
	"body-sm",
	"caption",
	"label",
] as const;

const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			"font-size": [{ text: [...FONT_SIZES] }],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
