import { loadFont } from "@remotion/fonts";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";
import { staticFile } from "remotion";

/** Headlines and UI. */
export const SATOSHI = "Satoshi";
/** Numbers, code and URLs. */
export const MONO = loadGeistMono().fontFamily;

loadFont({
	family: SATOSHI,
	url: staticFile("fonts/Satoshi-Variable.woff2"),
	weight: "300 900",
});

export const SANS_STACK = `${SATOSHI}, -apple-system, BlinkMacSystemFont, sans-serif`;
export const MONO_STACK = `${MONO}, ui-monospace, SFMono-Regular, monospace`;
