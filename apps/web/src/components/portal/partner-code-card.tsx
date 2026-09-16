"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/money";
import { trpc } from "@/utils/trpc";

/**
 * The partner's attribution code: the thing they actually hand to a merchant.
 *
 * Front and centre on the dashboard because it replaced the registration form as
 * the normal way a store gets attributed: the partner sends the code, the
 * merchant pastes it into the Edge app, and the store arrives here already
 * pointed at the right partner.
 *
 * Codes are issued by an admin, so the empty state has to explain a wait rather
 * than offer a button.
 */

type DiscountKind = "none" | "percentage" | "fixed" | "free_cycles";

/**
 * Why a code is not working, if it is not working.
 *
 * The card derived its whole health signal from `status`, which only knows
 * `active` and `disabled`. Expiry and the redemption cap live in separate
 * columns, so an EXPIRED code rendered in large type with an enabled Copy
 * button: the partner kept handing it out, every merchant was turned away with
 * the same deliberately generic "that code isn't valid", and nothing on either
 * side of the conversation could explain why.
 */
function codeProblem(row: {
	expiresAt: Date | string | null;
	maxRedemptions: number | null;
	redemptions: number;
	status: string;
}): string | null {
	if (row.status !== "active") {
		return "Turned off, so it will not take new stores.";
	}
	if (row.expiresAt && new Date(row.expiresAt).getTime() <= Date.now()) {
		return "Expired, so merchants entering it are turned away. Ask us to reissue it.";
	}
	if (row.maxRedemptions !== null && row.redemptions >= row.maxRedemptions) {
		return "Fully used, so it will not take another store. Ask us to raise the limit.";
	}
	return null;
}

interface CodeRowProps {
	code: string;
	disabled: boolean;
	discountAmountMinor: string | null;
	discountBps: number | null;
	discountCurrency: string | null;
	discountCycles: number | null;
	discountGrantLimit: number | null;
	discountKind: DiscountKind;
	expiresAt: Date | string | null;
	grantsUsed: number;
	maxRedemptions: number | null;
	redemptions: number;
	status: string;
}

/** What a merchant gets for using this code, in the partner's own words. */
function describeOffer(props: CodeRowProps): string | null {
	const cycles = props.discountCycles;
	const span =
		cycles === null
			? "for as long as they stay"
			: `for their first ${cycles} ${cycles === 1 ? "month" : "months"}`;
	switch (props.discountKind) {
		case "percentage":
			return `${(props.discountBps ?? 0) / 100}% off Enterprise ${span}`;
		case "fixed":
			/* formatMoney, not the raw column: `discountAmountMinor` is an
			   integer in MINOR units, so interpolating it directly told the
			   partner their code was worth "5000 USD" when it was worth $50. */
			return props.discountAmountMinor
				? `${formatMoney(props.discountAmountMinor, props.discountCurrency ?? "USD")} off Enterprise ${span}`
				: null;
		case "free_cycles":
			return `Enterprise free ${span}`;
		default:
			return null;
	}
}

function CodeRow(props: CodeRowProps) {
	const { code, redemptions, maxRedemptions, discountGrantLimit, grantsUsed } =
		props;
	const problem = codeProblem(props);
	const offer = describeOffer(props);
	const [copied, setCopied] = useState(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			// Revert the label so the button doesn't read "Copied" forever, which
			// makes a second copy look like it silently failed.
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Couldn't copy. Select the code and copy it manually.");
		}
	}

	return (
		<div className="flex flex-col gap-4 rounded-xl border border-border-strong bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-3">
					<span className="font-medium font-mono text-h3 text-primary-foreground tracking-tight">
						{code}
					</span>
					{problem ? (
						<span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 font-medium text-[11px] text-amber-800 ring-1 ring-amber-600/20 ring-inset">
							Not working
						</span>
					) : null}
				</div>
				{problem ? (
					<span className="text-amber-700 text-body-sm">{problem}</span>
				) : null}
				<span className="text-caption text-secondary-foreground">
					{redemptions} {redemptions === 1 ? "store" : "stores"} registered
					{maxRedemptions === null ? "" : ` of ${maxRedemptions} available`}
				</span>
				{offer ? (
					<div className="flex flex-col gap-1 rounded-lg bg-brand/5 px-3 py-2">
						<span className="text-caption text-primary-foreground">
							{offer}
							{discountGrantLimit === null
								? ""
								: ` · ${grantsUsed} of ${discountGrantLimit} used`}
						</span>
						{/* Said plainly, because the alternative is a partner discovering
						    it on an empty payout. Commission is a share of what Edge
						    receives, and a free store pays nothing. */}
						<span className="text-caption text-secondary-foreground">
							You earn no commission from a store while its plan is free.
							Earnings begin when it starts paying.
						</span>
					</div>
				) : null}
			</div>
			<Button
				onClick={copy}
				size="md"
				variant={problem ? "secondary" : "primary"}
			>
				{copied ? "Copied" : "Copy code"}
			</Button>
		</div>
	);
}

export function PartnerCodeCard() {
	const { data, isLoading } = useQuery(trpc.partner.codes.list.queryOptions());

	if (isLoading) {
		return <Skeleton className="h-28 w-full rounded-xl" />;
	}

	const codes = data ?? [];

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<h2 className="font-medium text-h3 text-primary-foreground">
					Your code
				</h2>
				<p className="text-body-sm text-secondary-foreground">
					Give this to a merchant you manage. They enter it in the Edge app and
					the store is attributed to you, with no form to fill in.
				</p>
			</div>

			{codes.length === 0 ? (
				<div className="rounded-xl border border-border border-dashed bg-page/50 px-5 py-6 text-body-sm text-secondary-foreground">
					No code issued yet. We issue one when your partner account is
					approved. Reach out if you're approved and still waiting.
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{codes.map((row) => (
						<CodeRow
							code={row.code}
							disabled={row.status !== "active"}
							discountAmountMinor={row.discountAmountMinor}
							discountBps={row.discountBps}
							discountCurrency={row.discountCurrency}
							discountCycles={row.discountCycles}
							discountGrantLimit={row.discountGrantLimit}
							discountKind={row.discountKind}
							expiresAt={row.expiresAt}
							grantsUsed={row.grantsUsed}
							key={row.id}
							maxRedemptions={row.maxRedemptions}
							redemptions={row.redemptions}
							status={row.status}
						/>
					))}
				</div>
			)}
		</div>
	);
}
