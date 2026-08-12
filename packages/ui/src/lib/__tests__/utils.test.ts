import { describe, expect, test } from "bun:test";
import { cn } from "../utils";

/**
 * The bug this guards: with a stock `twMerge`, `text-body-sm` and
 * `text-primary-foreground` land in the same class group, so passing a custom
 * type size through a component's `className` silently deleted the colour its
 * variant had set. Buttons rendered with black text on a black fill.
 */
describe("cn", () => {
	test("a custom type size does not evict a colour", () => {
		const result = cn("text-inverted-primary-foreground", "text-body-sm");

		expect(result).toContain("text-inverted-primary-foreground");
		expect(result).toContain("text-body-sm");
	});

	test("a custom type size still replaces another type size", () => {
		expect(cn("text-[13px]", "text-body-sm")).toBe("text-body-sm");
		expect(cn("text-h1", "text-display")).toBe("text-display");
	});

	test("colours still replace colours", () => {
		expect(cn("text-primary-foreground", "text-secondary-foreground")).toBe(
			"text-secondary-foreground"
		);
	});
});
