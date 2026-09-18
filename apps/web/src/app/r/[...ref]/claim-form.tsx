"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { useActionState, useId } from "react";
import { type ClaimState, claimStore } from "./actions";

/**
 * The one field on the page: the merchant's store address.
 *
 * It accepts whatever they have to hand (a handle, a myshopify domain, or their
 * live domain) because a merchant does not think of their store as a
 * `.myshopify.com` address, and refusing the form over that would cost the
 * partner the referral.
 */

const INITIAL: ClaimState = { error: null };

export function ClaimForm({
	appSlug,
	clickId,
	partnerName,
	/* NOT named `ref`: React reserves that prop, and passing it to a client
	   component from a server component is an error, not a warning. */
	refPath,
	subId,
}: {
	appSlug: string | null;
	clickId: string | null;
	partnerName: string;
	refPath: string;
	subId: string | null;
}) {
	const shopId = useId();
	const [state, action, pending] = useActionState(claimStore, INITIAL);

	return (
		<form action={action} className="flex flex-col gap-3">
			<input name="ref" type="hidden" value={refPath} />
			<input name="appSlug" type="hidden" value={appSlug ?? ""} />
			<input name="subId" type="hidden" value={subId ?? ""} />
			<input name="clickId" type="hidden" value={clickId ?? ""} />

			<div className="flex flex-col gap-2">
				<Label htmlFor={shopId}>Your store URL</Label>
				<Input
					autoComplete="url"
					enterKeyHint="go"
					id={shopId}
					name="shop"
					placeholder="mystore.myshopify.com"
					required
				/>
				<span className="text-caption text-secondary-foreground">
					Your myshopify address, your live domain, or just the store name.
				</span>
			</div>

			{state.error ? (
				<p aria-live="polite" className="text-body-sm text-red-700">
					{state.error}
				</p>
			) : null}

			<Button
				className="w-full"
				disabled={pending}
				size="xl"
				type="submit"
				variant="primary"
			>
				{pending ? "One moment…" : "Continue to the Shopify App Store"}
			</Button>

			<p className="text-caption text-secondary-foreground">
				We record this store against {partnerName}, so they are credited when
				you install. Nothing is charged here, and you install from Shopify as
				usual.
			</p>
		</form>
	);
}
