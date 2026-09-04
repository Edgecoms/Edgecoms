import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getProduct } from "../products";

/**
 * Test helper: the Edge Cart page's copy, as text a test can assert against.
 *
 * The page's words live in JSX rather than in a strings file, so the only
 * honest way to check "does any rendered string contain an em dash" is to read
 * the source. Comments are stripped first, because the codebase deliberately
 * uses em dashes in prose comments and those never reach a visitor.
 *
 * Crude on purpose. It over-collects (it keeps identifiers and class names as
 * well as copy), which can only ever produce a false failure, never a false
 * pass, and a false failure on an em dash in a Tailwind class is not a thing
 * that happens.
 */

const ROOT = join(import.meta.dir, "..", "..");

const COPY_SOURCES = [
	join(ROOT, "app", "(home)", "products", "edge-cart", "page.tsx"),
	join(ROOT, "components", "edge-cart", "cart-demo.tsx"),
	join(ROOT, "components", "edge-cart", "comparison-table.tsx"),
	join(ROOT, "components", "edge-cart", "email-dialog.tsx"),
	join(ROOT, "components", "edge-cart", "section.tsx"),
	join(ROOT, "components", "edge-cart", "threshold-calculator.tsx"),
	join(ROOT, "lib", "edge-cart-pricing.ts"),
];

const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g;
const LINE_COMMENT = /(^|[^:])\/\/[^\n]*/g;

function stripComments(source: string): string {
	return source.replace(BLOCK_COMMENT, "").replace(LINE_COMMENT, "$1");
}

/**
 * Every string the Edge Cart page can render: its own source minus comments,
 * plus the catalog fields it reads at runtime.
 */
export function edgeCartCopyStrings(): string[] {
	const fromSource = COPY_SOURCES.map((path) =>
		stripComments(readFileSync(path, "utf8"))
	);

	const product = getProduct("edge-cart");
	const fromCatalog = product
		? [
				product.tagline,
				product.heroLead,
				product.name,
				...product.faq.flatMap((entry) => [entry.question, entry.answer]),
				/* The tier's name travels with its claim, so a guard asking "which
				   plan says it has no usage fees" can tell Enterprise (true) from
				   Free or Growth (false). */
				...product.pricing.flatMap((tier) => [
					tier.name,
					tier.price,
					`${tier.name}: ${tier.includes}`,
				]),
			]
		: [];

	return [...fromSource, ...fromCatalog];
}

export const EDGE_CART_FAQ_QUESTIONS: string[] = (
	getProduct("edge-cart")?.faq ?? []
).map((entry) => entry.question);
