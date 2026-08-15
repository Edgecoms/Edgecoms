import type { Face } from "@/components/avatar-field";

/**
 * Eight faces scattered across the grid, none touching another and none inside
 * cols 3–7 / rows 1–3 where the lockup and headline sit.
 *
 *   row0  . . X . . . . X . .
 *   row1  . . . . . . . . . X
 *   row2  X . . . . . . . . .
 *   row3  . . . . . . . . X .
 *   row4  . X . . . . . . . .
 *   row5  . . . . X . . . . X
 */

/** The four that open the video and stay put for the rest of the intro. */
const CARRIED = [
	{ blur: 6, col: 2, row: 0, src: "p1.jpg" },
	{ blur: 11, col: 0, row: 2, src: "p4.jpg" },
	{ blur: 0, col: 8, row: 3, src: "p7.jpg" },
	{ blur: 4, col: 4, row: 5, src: "p9.jpg" },
] as const;

const CARRY_STAGGER = 4;
/** Screen 3 re-declares the carried four as already landed, so they hold at the cut. */
const ALREADY_LANDED = -20;

export const OPENING_FACES: Face[] = CARRIED.map((face, i) => ({
	...face,
	delay: i * CARRY_STAGGER,
}));

export const FIELD_FACES: Face[] = [
	...CARRIED.map((face) => ({ ...face, delay: ALREADY_LANDED })),
	{ blur: 2, col: 7, delay: 0, row: 0, src: "p2.jpg" },
	{ blur: 9, col: 9, delay: 5, row: 1, src: "p5.jpg" },
	{ blur: 0, col: 1, delay: 3, row: 4, src: "p10.jpg" },
	{ blur: 7, col: 9, delay: 8, row: 5, src: "p3.jpg" },
];
