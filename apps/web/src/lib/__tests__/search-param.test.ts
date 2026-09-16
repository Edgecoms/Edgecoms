import { describe, expect, test } from "bun:test";
import { singleParam } from "../search-param";

describe("a query value read on the server", () => {
	test("a single value comes through as it is", () => {
		expect(singleParam("abc123")).toBe("abc123");
	});

	test("absent and empty are both no value", () => {
		expect(singleParam(undefined)).toBeNull();
		expect(singleParam("")).toBeNull();
		expect(singleParam([])).toBeNull();
	});

	test("a repeated key uses the first value", () => {
		expect(singleParam(["first", "second"])).toBe("first");
		expect(singleParam(["", "second"])).toBeNull();
	});
});
