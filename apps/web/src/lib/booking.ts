/**
 * Where every "book a teardown" action goes.
 *
 * Kept in one place because it is on nine surfaces — the header, both heroes,
 * every app page, the case studies and every closing CTA — and a scheduling
 * link is exactly the kind of thing that changes without warning. One edit here
 * moves all of them.
 */
export const BOOKING_URL =
	"https://calendly.com/anurag-edgecoms/book-a-free-loom-audit";

/**
 * The label on every booking action. One string, because the same promise has
 * to be made on nine surfaces — a button that says one thing in the header and
 * another in the hero reads as two different offers.
 *
 * NOTE: the Calendly page it points at is titled "book a free Loom audit". A
 * merchant who is promised a growth audit and lands on a Loom booking page is a
 * no-show, so rename the Calendly event to match this.
 */
export const BOOKING_LABEL = "Get a demo";
