import { describe, expect, test } from "bun:test";
import {
	computeCommissionMinor,
	decimalStringToMinorUnits,
	minorUnitsToDecimalString,
	sumMinor,
} from "../money";
import { normalizeShopDomain, normalizeTransaction } from "../partner-api";

describe("decimalStringToMinorUnits", () => {
	test("converts 2-decimal currencies without float", () => {
		expect(decimalStringToMinorUnits("12.34", "USD")).toBe(1234n);
		expect(decimalStringToMinorUnits("0.05", "USD")).toBe(5n);
		expect(decimalStringToMinorUnits("100", "USD")).toBe(10_000n);
	});

	test("handles negative amounts (credits/clawbacks)", () => {
		expect(decimalStringToMinorUnits("-12.34", "USD")).toBe(-1234n);
		expect(decimalStringToMinorUnits("-0.01", "EUR")).toBe(-1n);
	});

	test("respects zero-decimal currencies", () => {
		expect(decimalStringToMinorUnits("1000", "JPY")).toBe(1000n);
	});

	test("respects three-decimal currencies", () => {
		expect(decimalStringToMinorUnits("1.234", "KWD")).toBe(1234n);
	});

	test("avoids float precision loss on long decimals", () => {
		// 0.1 + 0.2 famously != 0.3 in float; integer math is exact.
		expect(decimalStringToMinorUnits("0.10", "USD")).toBe(10n);
		expect(decimalStringToMinorUnits("0.20", "USD")).toBe(20n);
	});

	test("throws on more fractional digits than the currency supports", () => {
		expect(() => decimalStringToMinorUnits("1.234", "USD")).toThrow();
	});

	test("throws on malformed input", () => {
		expect(() => decimalStringToMinorUnits("abc", "USD")).toThrow();
		expect(() => decimalStringToMinorUnits("", "USD")).toThrow();
	});
});

describe("minorUnitsToDecimalString", () => {
	test("round-trips through minor units", () => {
		expect(minorUnitsToDecimalString(1234n, "USD")).toBe("12.34");
		expect(minorUnitsToDecimalString(-1n, "USD")).toBe("-0.01");
		expect(minorUnitsToDecimalString(1000n, "JPY")).toBe("1000");
		expect(minorUnitsToDecimalString(1234n, "KWD")).toBe("1.234");
	});
});

describe("computeCommissionMinor", () => {
	test("applies a basis-point rate with integer math", () => {
		// 10% of $100.00 = $10.00
		expect(computeCommissionMinor(10_000n, 1000)).toBe(1000n);
		// 15% of $1.00 = $0.15
		expect(computeCommissionMinor(100n, 1500)).toBe(15n);
	});

	test("truncates toward zero (no float rounding)", () => {
		// 15% of 7 minor units = 1.05 -> 1
		expect(computeCommissionMinor(7n, 1500)).toBe(1n);
		// 33% of 10 = 3.3 -> 3
		expect(computeCommissionMinor(10n, 3300)).toBe(3n);
	});

	test("a negative base yields a negative commission", () => {
		expect(computeCommissionMinor(-10_000n, 1000)).toBe(-1000n);
		expect(computeCommissionMinor(-7n, 1500)).toBe(-1n);
	});

	test("rejects non-integer / negative rates", () => {
		expect(() => computeCommissionMinor(100n, 12.5)).toThrow();
		expect(() => computeCommissionMinor(100n, -1)).toThrow();
	});
});

describe("sumMinor", () => {
	test("sums minor-unit amounts", () => {
		expect(sumMinor([100n, 250n, -50n])).toBe(300n);
		expect(sumMinor([])).toBe(0n);
	});
});

describe("normalizeShopDomain", () => {
	test("canonicalizes URLs, handles, and casing", () => {
		expect(normalizeShopDomain("Acme.myshopify.com")).toBe(
			"acme.myshopify.com"
		);
		expect(normalizeShopDomain("https://acme.myshopify.com/admin")).toBe(
			"acme.myshopify.com"
		);
		expect(normalizeShopDomain("www.acme.myshopify.com")).toBe(
			"acme.myshopify.com"
		);
		expect(normalizeShopDomain("acme")).toBe("acme.myshopify.com");
		expect(normalizeShopDomain("  ACME  ")).toBe("acme.myshopify.com");
	});

	test("throws on empty input", () => {
		expect(() => normalizeShopDomain("   ")).toThrow();
	});
});

describe("normalizeTransaction (Shopify boundary)", () => {
	test("maps a raw transaction into a normalized earning", () => {
		const earning = normalizeTransaction({
			id: "gid://partners/Transaction/1",
			__typename: "AppSubscriptionSale",
			createdAt: "2026-03-15T12:00:00Z",
			netAmount: { amount: "8.50", currencyCode: "USD" },
			grossAmount: { amount: "10.00", currencyCode: "USD" },
			shopifyFee: { amount: "1.50", currencyCode: "USD" },
			app: { id: "gid://partners/App/1000001" },
			shop: { myshopifyDomain: "Acme.myshopify.com" },
		});

		expect(earning.shopifyTransactionId).toBe("gid://partners/Transaction/1");
		expect(earning.shopDomain).toBe("acme.myshopify.com");
		expect(earning.appPartnerApiGid).toBe("gid://partners/App/1000001");
		expect(earning.grossAmountMinor).toBe(1000n);
		expect(earning.shopifyFeeAmountMinor).toBe(150n);
		expect(earning.netAmountMinor).toBe(850n);
		expect(earning.currency).toBe("USD");
		expect(earning.transactionType).toBe("app_subscription");
	});

	test("maps a credit (negative net) transaction", () => {
		const earning = normalizeTransaction({
			id: "gid://partners/Transaction/2",
			__typename: "AppSaleCredit",
			createdAt: "2026-03-20T00:00:00Z",
			netAmount: { amount: "-8.50", currencyCode: "USD" },
			grossAmount: { amount: "-10.00", currencyCode: "USD" },
			shopifyFee: { amount: "-1.50", currencyCode: "USD" },
			app: { id: "gid://partners/App/1000001" },
			shop: { myshopifyDomain: "acme.myshopify.com" },
		});

		expect(earning.netAmountMinor).toBe(-850n);
		expect(earning.transactionType).toBe("app_sale_credit");
	});
});
