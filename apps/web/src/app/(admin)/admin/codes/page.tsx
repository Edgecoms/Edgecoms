"use client";

import { Button } from "@edgecoms/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
} from "@edgecoms/ui/components/dialog";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import {
	EmptyState,
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@/components/portal/ui";
import { queryClient, trpc } from "@/utils/trpc";

/**
 * Attribution codes.
 *
 * A code is what a partner actually hands to a merchant, so two things on this
 * page are load-bearing rather than cosmetic:
 *
 *   • The "keep the rate out of the code" guidance. `ALEX30` gets read by
 *     merchants as "30% off", shows one agency another's rate, and goes stale the
 *     moment the rate changes. The rate is always read from the partner record.
 *   • Disable, not delete. Disabling stops new redemptions and leaves the stores
 *     already referred with their partner. There is deliberately no delete.
 */

interface CodeRow {
	code: string;
	expiresAt: string | Date | null;
	id: string;
	label: string | null;
	maxRedemptions: number | null;
	partnerCompany: string | null;
	partnerName: string;
	partnerStatus: string;
	perkUsageAllowanceUsd: number | null;
	redemptions: number;
	status: "active" | "disabled";
}

interface PartnerOption {
	companyName: string | null;
	id: string;
	name: string;
	status: string;
}

/** Empty string from an optional number field means "not set", not zero. */
function optionalInt(value: FormDataEntryValue | null): number | null {
	const raw = String(value ?? "").trim();
	if (raw === "") {
		return null;
	}
	const parsed = Number(raw);
	return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

function formatExpiry(expiresAt: string | Date | null): string {
	if (!expiresAt) {
		return "Never";
	}
	return new Date(expiresAt).toLocaleDateString(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function CodesTable({
	codes,
	onToggle,
	toggling,
}: {
	codes: CodeRow[];
	onToggle: (id: string, status: "active" | "disabled") => void;
	toggling: boolean;
}) {
	return (
		<TableShell
			head={
				<>
					<th>Code</th>
					<th>Partner</th>
					<th>Status</th>
					<th className="text-right">Redemptions</th>
					<th>Expires</th>
					<th className="text-right">Perk</th>
					<th className="text-right">Action</th>
				</>
			}
		>
			{codes.map((code) => (
				<tr key={code.id}>
					<td>
						<div className="flex flex-col">
							<span className="font-mono text-primary-foreground">
								{code.code}
							</span>
							{code.label ? (
								<span className="text-caption text-secondary-foreground">
									{code.label}
								</span>
							) : null}
						</div>
					</td>
					<td>
						<div className="flex flex-col">
							<span className="text-secondary-foreground">
								{code.partnerCompany ?? code.partnerName}
							</span>
							{code.partnerStatus === "approved" ? null : (
								<span className="text-amber-700 text-caption">
									Partner {code.partnerStatus} — the code won't bind yet
								</span>
							)}
						</div>
					</td>
					<td>
						<StatusBadge
							status={code.status === "active" ? "approved" : "suspended"}
						/>
					</td>
					<td className="text-right text-primary-foreground tabular-nums">
						{code.redemptions}
						{code.maxRedemptions === null ? "" : ` / ${code.maxRedemptions}`}
					</td>
					<td className="text-secondary-foreground">
						{formatExpiry(code.expiresAt)}
					</td>
					<td className="text-right text-secondary-foreground tabular-nums">
						{code.perkUsageAllowanceUsd === null
							? "—"
							: `$${code.perkUsageAllowanceUsd.toLocaleString()}/mo`}
					</td>
					<td className="text-right">
						<Button
							disabled={toggling}
							onClick={() => onToggle(code.id, code.status)}
							size="md"
							variant="secondary"
						>
							{code.status === "active" ? "Disable" : "Enable"}
						</Button>
					</td>
				</tr>
			))}
		</TableShell>
	);
}

function IssueCodeDialog({
	open,
	onOpenChange,
	partners,
	onSubmit,
	pending,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	partners: PartnerOption[];
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	pending: boolean;
}) {
	const partnerId = useId();
	const codeId = useId();
	const labelId = useId();
	const maxId = useId();
	const expiresId = useId();
	const perkId = useId();

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent
				description="The code is what a merchant types into an Edge app. Keep it rate-free."
				title="Issue an attribution code"
			>
				<form className="flex flex-col gap-5" onSubmit={onSubmit}>
					<div className="flex flex-col gap-2">
						<Label htmlFor={partnerId}>Partner</Label>
						<select
							className="h-10 rounded-lg border border-border bg-page px-3 text-body-sm text-primary-foreground"
							id={partnerId}
							name="partnerId"
							required
						>
							{partners.map((partner) => (
								<option key={partner.id} value={partner.id}>
									{partner.companyName ?? partner.name} ({partner.status})
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor={codeId}>Code</Label>
						<Input
							autoComplete="off"
							id={codeId}
							name="code"
							placeholder="ACMEPARTNER"
							required
						/>
						<span className="text-caption text-secondary-foreground">
							4–32 letters, digits or hyphens. Stored upper-case.{" "}
							<strong>Never put the commission rate in the code</strong> —
							merchants read <code>ALEX30</code> as "30% off", and it leaks one
							agency's rate to another. Use the internal label for that.
						</span>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor={labelId}>Internal label (optional)</Label>
						<Input
							id={labelId}
							name="label"
							placeholder="Alex — 25%, signed Aug 2026"
						/>
						<span className="text-caption text-secondary-foreground">
							Admin-only. Never shown to the partner or the merchant.
						</span>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor={maxId}>Max redemptions</Label>
							<Input
								id={maxId}
								min="1"
								name="maxRedemptions"
								placeholder="Unlimited"
								type="number"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor={expiresId}>Expires</Label>
							<Input id={expiresId} name="expiresAt" type="date" />
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor={perkId}>Fee-free allowance (USD / month)</Label>
						<Input
							id={perkId}
							min="0"
							name="perkUsageAllowanceUsd"
							placeholder="Standard band"
							type="number"
						/>
						<span className="text-caption text-secondary-foreground">
							The instant benefit a referred store gets: monthly revenue up to
							this figure carries no usage fee. Leave empty for the standard
							entry band. Apps read this when a merchant enters the code.
						</span>
					</div>

					<div className="flex items-center justify-end gap-3">
						<DialogClose
							render={
								<Button size="lg" type="button" variant="secondary">
									Cancel
								</Button>
							}
						/>
						<Button
							disabled={pending}
							size="lg"
							type="submit"
							variant="primary"
						>
							{pending ? "Issuing…" : "Issue code"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminCodesPage() {
	const codesQuery = useQuery(trpc.admin.codes.list.queryOptions());
	const partnersQuery = useQuery(trpc.admin.partners.list.queryOptions());
	const createMutation = useMutation(trpc.admin.codes.create.mutationOptions());
	const updateMutation = useMutation(trpc.admin.codes.update.mutationOptions());
	const [creating, setCreating] = useState(false);

	function refresh() {
		queryClient.invalidateQueries({
			queryKey: trpc.admin.codes.list.queryKey(),
		});
	}

	function handleCreate(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const expiresAt = String(form.get("expiresAt") ?? "").trim();

		createMutation.mutate(
			{
				partnerId: String(form.get("partnerId")),
				code: String(form.get("code")),
				label: String(form.get("label") ?? ""),
				maxRedemptions: optionalInt(form.get("maxRedemptions")),
				// A date input gives a bare day; the code expires at the end of it.
				expiresAt: expiresAt
					? new Date(`${expiresAt}T23:59:59Z`).toISOString()
					: null,
				perkUsageAllowanceUsd: optionalInt(form.get("perkUsageAllowanceUsd")),
			},
			{
				onSuccess: (result) => {
					toast.success(`Code ${result.code} created.`);
					setCreating(false);
					refresh();
				},
				onError: (error) => toast.error(error.message),
			}
		);
	}

	function toggleStatus(id: string, status: "active" | "disabled") {
		updateMutation.mutate(
			{ codeId: id, status: status === "active" ? "disabled" : "active" },
			{
				onSuccess: () => {
					toast.success(
						status === "active" ? "Code disabled." : "Code re-enabled."
					);
					refresh();
				},
				onError: (error) => toast.error(error.message),
			}
		);
	}

	const codes = codesQuery.data ?? [];
	const issueButton = (
		<Button onClick={() => setCreating(true)} size="lg" variant="primary">
			Issue a code
		</Button>
	);

	function body() {
		if (codesQuery.isLoading) {
			return <Skeleton className="h-48 w-full rounded-xl" />;
		}
		if (codes.length === 0) {
			return (
				<EmptyState
					action={issueButton}
					description="Issue one to an approved partner and they can start registering the merchants they manage."
					title="No codes yet"
				/>
			);
		}
		return (
			<CodesTable
				codes={codes}
				onToggle={toggleStatus}
				toggling={updateMutation.isPending}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				action={issueButton}
				description="A partner gives their code to a merchant, who enters it in an Edge app. The store then lands here for approval, already attributed."
				title="Attribution codes"
			/>

			{body()}

			<p className="text-caption text-secondary-foreground">
				Disabling a code stops new redemptions. Stores already referred stay
				with their partner — a partner loses the ability to acquire, never their
				existing book.
			</p>

			<IssueCodeDialog
				onOpenChange={setCreating}
				onSubmit={handleCreate}
				open={creating}
				partners={partnersQuery.data ?? []}
				pending={createMutation.isPending}
			/>
		</div>
	);
}
