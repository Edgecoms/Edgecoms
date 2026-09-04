/**
 * The Edge Cart walkthrough, embedded.
 *
 * This is the one place the YouTube player can actually run. The same video is
 * linked from the playbook email as a thumbnail, because every mail client
 * strips `<iframe>` from a message body; on a web page there is no such
 * restriction, so here it is a real embed.
 *
 * Three deliberate choices:
 *
 * - **`youtube-nocookie.com`.** The privacy-preserving host: it does not write
 *   YouTube's tracking cookies until the visitor presses play. This page is
 *   consent-gated for Meta already, and shipping a third-party tracker that
 *   fires on page load would walk straight around that.
 * - **`loading="lazy"`.** The embed sits well down the page. Loading a player
 *   nobody has scrolled to costs a paid visitor bandwidth before the hero has
 *   finished painting.
 * - **A CSS aspect ratio rather than fixed dimensions.** The 560x315 the embed
 *   code ships with overflows a 375px screen, which is the one width this page
 *   is required not to scroll sideways at.
 */

const VIDEO_ID = "DDr1GQfYHqI";
const VIDEO_TITLE =
	"Edge Cart: The Shopify Slide Cart and Upsell App That Boosts Your AOV";

export function WalkthroughVideo() {
	return (
		<div className="mt-10">
			<p className="text-neutral-500 text-sm">
				Prefer to watch first? Here is the same drawer, set up end to end.
			</p>
			<div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 shadow-xs">
				<iframe
					allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
					className="h-full w-full"
					loading="lazy"
					referrerPolicy="strict-origin-when-cross-origin"
					src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
					title={VIDEO_TITLE}
				/>
			</div>
		</div>
	);
}
