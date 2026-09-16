import Image from "next/image";

/**
 * An app's own icon, wherever that app is named.
 *
 * Every icon lives at `/app-icons/<slug>.webp`, derived from the slug rather
 * than stored per product — the file is the same one on the App Store listing,
 * so there is no case where an app has a different icon and nothing to keep in
 * sync.
 *
 * Two of the seven sit on black and the rest on white, which is normal for app
 * icons and reads correctly at small sizes; the rounded corner is what makes
 * them read as a set rather than as seven unrelated pictures.
 */
const SIZES = {
	sm: "size-6 rounded-[0.35rem]",
	md: "size-8 rounded-[0.45rem]",
	lg: "size-11 rounded-xl",
} as const;

export function AppIcon({
	className = "",
	product,
	size = "md",
}: {
	className?: string;
	/**
	 * Anything carrying a slug. Deliberately not `EdgeProduct`: the partner
	 * portal renders these from a slim server-built list, and requiring the full
	 * marketing product would ship the whole catalog to the browser.
	 */
	product: { slug: string };
	size?: keyof typeof SIZES;
}) {
	return (
		<Image
			alt=""
			className={`shrink-0 border border-border/60 ${SIZES[size]} ${className}`}
			height={96}
			src={`/app-icons/${product.slug}.webp`}
			width={96}
		/>
	);
}
