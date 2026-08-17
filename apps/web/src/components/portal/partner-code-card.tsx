"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

/**
 * The partner's attribution code — the thing they actually hand to a merchant.
 *
 * Front and centre on the dashboard because it replaced the registration form as
 * the normal way a store gets attributed: the partner sends the code, the
 * merchant pastes it into the Edge app, and the store arrives here already
 * pointed at the right partner.
 *
 * Codes are issued by an admin, so the empty state has to explain a wait rather
 * than offer a button.
 */

function CodeRow({
	code,
	redemptions,
	maxRedemptions,
	perkUsageAllowanceUsd,
	disabled,
}: {
	code: string;
	redemptions: number;
	maxRedemptions: number | null;
	perkUsageAllowanceUsd: number | null;
	disabled: boolean;
}) {
	const [copied, setCopied] = useState(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			// Revert the label so the button doesn't read "Copied" forever, which
			// makes a second copy look like it silently failed.
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Couldn't copy — select the code and copy it manually.");
		}
	}

	return (
		<div className="flex flex-col gap-4 rounded-xl border border-border bg-page p-5 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-3">
					<span className="font-medium font-mono text-h3 text-primary-foreground tracking-tight">
						{code}
					</span>
					{disabled ? (
						<span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 font-medium text-[11px] text-slate-600 ring-1 ring-slate-500/20 ring-inset">
							Disabled
						</span>
					) : null}
				</div>
				<span className="text-caption text-secondary-foreground">
					{redemptions} {redemptions === 1 ? "store" : "stores"} registered
					{maxRedemptions === null ? "" : ` of ${maxRedemptions} available`}
					{perkUsageAllowanceUsd === null
						? ""
						: ` · referred stores pay no usage fee under $${perkUsageAllowanceUsd.toLocaleString()}/mo`}
				</span>
			</div>
			<Button
				disabled={disabled}
				onClick={copy}
				size="md"
				variant={disabled ? "secondary" : "primary"}
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
					the store is attributed to you — no form to fill in.
				</p>
			</div>

			{codes.length === 0 ? (
				<div className="rounded-xl border border-border border-dashed bg-page/50 px-5 py-6 text-body-sm text-secondary-foreground">
					No code issued yet. We issue one when your partner account is approved
					— reach out if you're approved and still waiting.
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{codes.map((row) => (
						<CodeRow
							code={row.code}
							disabled={row.status !== "active"}
							key={row.id}
							maxRedemptions={row.maxRedemptions}
							perkUsageAllowanceUsd={row.perkUsageAllowanceUsd}
							redemptions={row.redemptions}
						/>
					))}
				</div>
			)}
		</div>
	);
}
