/**
 * EVERY IMAGE ON THE SITE, IN ONE FILE.
 *
 * The page is built to hold real photography before the photography exists.
 * Each slot below renders as a labelled placeholder until you give it a `src`,
 * and going live with an image is a ONE-LINE edit here — drop the file into
 * `public/` and set `src`. Nothing in the components changes.
 *
 *     src: null                    →  placeholder, labelled with its brief
 *     src: "/images/hero.webp"     →  the real thing, via next/image
 *
 * `alt` is written NOW, deliberately, rather than when the asset arrives. Alt
 * text added later is alt text never added, and a sales page carrying a dozen
 * unlabelled images is unusable with a screen reader.
 *
 * `width`/`height` are the INTRINSIC pixel dimensions the file should have.
 * They set the aspect ratio the placeholder reserves, so swapping in the real
 * image causes no layout shift. Supply at roughly 2x these numbers for retina.
 */

export interface ImageSlot {
	/** Written now. Describes the image's meaning, not its appearance. */
	alt: string;
	height: number;
	/** What to shoot or supply. Shown on the placeholder so the brief travels with it. */
	hint: string;
	/** Set this to go live. Path under `public/`, e.g. "/images/instructor.webp". */
	src: string | null;
	width: number;
}

/**
 * Slots are keyed so a component asks for one by name. Adding a key here
 * without rendering it does nothing; rendering a key that does not exist is a
 * type error.
 */
export const IMAGES = {
	/* ── Hero ──────────────────────────────────────────────────────────────── */
	"hero-preview": {
		alt: "A preview of the course: the module list and a lesson playing",
		height: 720,
		hint: "Course preview — a screenshot of the lesson player or module list. 16:9. This is the first image anyone sees, so it should look like a real product, not a stock photo.",
		src: null,
		width: 1280,
	},

	/* ── Trust strip ───────────────────────────────────────────────────────────
	   Five logos of tools, publications or brands you can HONESTLY associate
	   with. Leave a slot null rather than filling it with a logo you have no
	   relationship with — an unearned logo wall is the fastest way to lose the
	   trust the rest of the page is building. */
	"trust-logo-1": {
		alt: "",
		height: 40,
		hint: "Partner, platform or publication logo. Monochrome or white, transparent PNG/SVG, ~160x40.",
		src: null,
		width: 160,
	},
	"trust-logo-2": {
		alt: "",
		height: 40,
		hint: "Partner, platform or publication logo. Monochrome or white, transparent PNG/SVG, ~160x40.",
		src: null,
		width: 160,
	},
	"trust-logo-3": {
		alt: "",
		height: 40,
		hint: "Partner, platform or publication logo. Monochrome or white, transparent PNG/SVG, ~160x40.",
		src: null,
		width: 160,
	},
	"trust-logo-4": {
		alt: "",
		height: 40,
		hint: "Partner, platform or publication logo. Monochrome or white, transparent PNG/SVG, ~160x40.",
		src: null,
		width: 160,
	},
	"trust-logo-5": {
		alt: "",
		height: 40,
		hint: "Partner, platform or publication logo. Monochrome or white, transparent PNG/SVG, ~160x40.",
		src: null,
		width: 160,
	},

	/* ── Inside the course ─────────────────────────────────────────────────── */
	"preview-lesson": {
		alt: "A lesson from the course playing, with the outline beside it",
		height: 720,
		hint: "A real lesson on screen. 16:9. Show the interface, not a stock person at a laptop.",
		src: null,
		width: 1280,
	},
	"preview-template": {
		alt: "One of the course spreadsheets, filled in with example numbers",
		height: 720,
		hint: "A template or calculator, filled in. 16:9. Real numbers beat an empty grid.",
		src: null,
		width: 1280,
	},
	"preview-teardown": {
		alt: "A store teardown in progress, with notes marked on the page",
		height: 720,
		hint: "A teardown screenshot with annotations. 16:9. Blur the brand if you do not have permission to name it.",
		src: null,
		width: 1280,
	},

	/* ── Instructor ────────────────────────────────────────────────────────────
	   The single highest-trust image on the page. A real face, looking at the
	   camera, beats any illustration. */
	"instructor-portrait": {
		alt: "The Edgecoms team member who teaches the course",
		height: 1000,
		hint: "Portrait, 4:5. Real photo, natural light, plain background. Not a stock headshot and not an avatar.",
		src: null,
		width: 800,
	},

	/* ── Community ─────────────────────────────────────────────────────────── */
	"community-preview": {
		alt: "The course community, showing a discussion thread",
		height: 720,
		hint: "Community screenshot. 16:9. REDACT names, avatars and any personal detail before supplying this — it is other people's data.",
		src: null,
		width: 1280,
	},
} as const satisfies Record<string, ImageSlot>;

export type ImageKey = keyof typeof IMAGES;
