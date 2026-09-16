/**
 * One query value as a single string.
 *
 * A server page receives `?a=1&a=2` as an array and `?a=` as an empty string.
 * Neither is a usable token, so this takes the first of a repeat and treats
 * empty as absent, which is what `URLSearchParams.get` plus a truthiness check
 * gave the client pages before they moved to reading on the server.
 */
export function singleParam(
	value: string | string[] | undefined
): string | null {
	const first = Array.isArray(value) ? value[0] : value;
	return first ? first : null;
}
