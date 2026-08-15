/** Canvas and palette for the Edge Partners launch video. */

export const CANVAS = { fps: 30, height: 1080, width: 1920 } as const;

export const COLOR = {
	/** Purple — the Edge Partners mark. Matches purple-600 on the marketing site. */
	accent: "#9333EA",
	/** Blue — the phrase a card wants you to read first. */
	highlight: "#2563EB",
	/** Near-white canvas. */
	canvas: "#FAFAFA",
	/** Slate ink for headlines and body. */
	ink: "#0F172A",
	/** Upcoming words in a headline build, before they land. */
	inkGhost: "#CBD5E1",
	/** Supporting copy and struck-through words. */
	inkMuted: "#64748B",
} as const;
