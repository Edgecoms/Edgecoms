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

type DiscountKind = "none" | "percentage" | "fixed" | "free_cycles";

interface CodeRow {
	code: string;
	discountAmountMinor: string | null;
	discountBps: number | null;
	discountCurrency: string | null;
	discountCycles: number | null;
	discountGrantLimit: number | null;
	discountKind: DiscountKind;
	expiresAt: string | Date | null;
	/** Spent allocation for this code's PARTNER, shared across all their codes. */
	grantsUsed: number;
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

/** One-line summary of what a code takes off the Enterprise plan. */
function describeDiscount(code: CodeRow): string {
	const cycles =
		code.discountCycles === null ? "ongoing" : `${code.discountCycles} cycles`;
	switch (code.discountKind) {
		case "percentage":
			return `${(code.discountBps ?? 0) / 100}% off, ${cycles}`;
		case "fixed":
			return `${code.discountAmountMinor ?? "0"} ${code.discountCurrency ?? ""} off, ${cycles}`;
		case "free_cycles":
			return `Free for ${code.discountCycles ?? 0} cycles`;
		default:
			return "—";
	}
}

interface PartnerOption {
	companyName: string | null;
	id: string;
	name: string;
	status: string;
}

const PERCENT_PATTERN = /^(\d{1,3})(?:\.(\d{1,2}))?$/;

/**
 * "12.5" -> 1250 basis points, without floating point.
 *
 * `whole * 100` and the two-digit fraction are both exact in float64, so the sum
 * is exact. Multiplying 12.5 by 100 directly is not, and this is a money field.
 */
function percentToBps(raw: string): number | null {
	const match = PERCENT_PATTERN.exec(raw.trim());
	if (!match) {
		return null;
	}
	const whole = Number(match[1]);
	const fraction = Number((match[2] ?? "").padEnd(2, "0"));
	return whole * 100 + fraction;
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

interface DiscountPayload {
	discountAmount: string | null;
	discountBps: number | null;
	discountCurrency: string | null;
	discountCycles: number | null;
	discountGrantLimit: number | null;
	discountKind: DiscountKind;
}

/**
 * Read the discount block off the form. Returns null when the percentage is
 * unparseable, which is the only field the browser cannot validate for us.
 *
 * Fields belonging to another kind are sent as null rather than omitted, so
 * switching a code from `fixed` to `percentage` clears the stale amount instead
 * of leaving it behind for the next reader to trip over.
 */
function readDiscount(form: FormData): DiscountPayload | null {
	const kind = String(form.get("discountKind") ?? "none") as DiscountKind;
	if (kind === "none") {
		return {
			discountKind: kind,
			discountBps: null,
			discountAmount: null,
			discountCurrency: null,
			discountCycles: null,
			discountGrantLimit: null,
		};
	}

	let bps: number | null = null;
	if (kind === "percentage") {
		bps = percentToBps(String(form.get("discountPercent") ?? ""));
		if (bps === null) {
			return null;
		}
	}
	const isFixed = kind === "fixed";

	return {
		discountKind: kind,
		discountBps: bps,
		discountAmount: isFixed
			? String(form.get("discountAmount") ?? "").trim() || null
			: null,
		discountCurrency: isFixed
			? String(form.get("discountCurrency") ?? "")
					.trim()
					.toUpperCase() || null
			: null,
		discountCycles: optionalInt(form.get("discountCycles")),
		discountGrantLimit: optionalInt(form.get("discountGrantLimit")),
	};
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
					<th>Enterprise discount</th>
					<th className="text-right">Grants</th>
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
					<td className="text-secondary-foreground">
						{describeDiscount(code)}
					</td>
					<td className="text-right text-secondary-foreground tabular-nums">
						{code.discountKind === "none"
							? "—"
							: `${code.grantsUsed}${
									code.discountGrantLimit === null
										? ""
										: ` / ${code.discountGrantLimit}`
								}`}
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
	const kindId = useId();
	const bpsId = useId();
	const amountId = useId();
	const currencyId = useId();
	const cyclesId = useId();
	const grantLimitId = useId();
	// Drives which term fields are shown. The rest of the form stays uncontrolled.
	const [kind, setKind] = useState<DiscountKind>("none");

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent
				description="Merchants type this into an Edge app."
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
						{/* The rate warning stays: a merchant reads ALEX30 as "30% off",
						    and it leaks one agency's rate to another. */}
						<span className="text-caption text-secondary-foreground">
							4–32 letters, digits or hyphens.{" "}
							<strong>Keep the rate out</strong> — <code>ALEX30</code> reads as
							"30% off".
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
							Never shown to the partner or merchant.
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

					<div className="flex flex-col gap-4 rounded-xl border border-border bg-page p-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor={kindId}>Enterprise plan discount</Label>
							<select
								className="h-10 rounded-lg border border-border bg-bg px-3 text-body-sm text-primary-foreground"
								id={kindId}
								name="discountKind"
								onChange={(event) =>
									setKind(event.currentTarget.value as DiscountKind)
								}
								value={kind}
							>
								<option value="none">No discount</option>
								<option value="percentage">Percentage off</option>
								<option value="fixed">Fixed amount off</option>
								<option value="free_cycles">Free for N cycles</option>
							</select>
						</div>

						{kind === "none" ? null : (
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
								{kind === "percentage" ? (
									<div className="flex flex-col gap-2">
										<Label htmlFor={bpsId}>Percent off</Label>
										<Input
											defaultValue="100"
											id={bpsId}
											max="100"
											min="1"
											name="discountPercent"
											step="0.01"
											type="number"
										/>
									</div>
								) : null}

								{kind === "fixed" ? (
									<>
										<div className="flex flex-col gap-2">
											<Label htmlFor={amountId}>Amount off</Label>
											<Input
												id={amountId}
												name="discountAmount"
												placeholder="5.00"
												type="text"
											/>
										</div>
										<div className="flex flex-col gap-2">
											<Label htmlFor={currencyId}>Currency</Label>
											<Input
												defaultValue="USD"
												id={currencyId}
												maxLength={3}
												name="discountCurrency"
											/>
										</div>
									</>
								) : null}

								<div className="flex flex-col gap-2">
									<Label htmlFor={cyclesId}>Cycles</Label>
									<Input
										defaultValue="6"
										id={cyclesId}
										min="1"
										name="discountCycles"
										placeholder="Ongoing"
										type="number"
									/>
								</div>

								<div className="flex flex-col gap-2">
									<Label htmlFor={grantLimitId}>First N merchants</Label>
									<Input
										defaultValue="10"
										id={grantLimitId}
										min="1"
										name="discountGrantLimit"
										placeholder="Unlimited"
										type="number"
									/>
								</div>
							</div>
						)}

						{/* Two things an admin can get wrong from the fields alone: that
						    the allowance is shared across a partner's codes, and that a
						    free store pays the partner nothing. */}
						{kind === "none" ? null : (
							<span className="text-caption text-secondary-foreground">
								Shared across the partner's codes. Usage plans bill in full, and
								a free store earns the partner no commission.
							</span>
						)}
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

		const discount = readDiscount(form);
		if (!discount) {
			toast.error("Enter a percentage between 0 and 100, up to 2 decimals.");
			return;
		}

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
				...discount,
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
