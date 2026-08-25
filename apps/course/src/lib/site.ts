/**
 * Site-wide constants for the course domain.
 *
 * TODO(launch): set `NEXT_PUBLIC_SITE_URL` to the real domain on the deploy.
 * The fallback below is a placeholder and must not ship as a canonical — a
 * canonical pointing at the wrong host tells Google the real page is a copy.
 */
export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://course.edgecoms.com"
).replace(/\/$/, "");

/** TODO(launch): confirm the course name. */
export const COURSE_NAME = "The Edge Growth Course";

export const SITE_TAGLINE = "Know what to work on next, and why";

export const SITE_DESCRIPTION =
	"A free ten-module ecommerce growth course for beginners and growing stores. Customer research, offers, product pages, checkout, order value, traffic and retention — in plain English, in the order they matter.";

export function absoluteUrl(path: string): string {
	return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
