"use client";

import { Button } from "@edgecoms/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
} from "@edgecoms/ui/components/dialog";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import {
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@edgecoms/ui/components/portal";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { Textarea } from "@edgecoms/ui/components/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { queryClient, trpc } from "@/utils/trpc";

interface PartnerRow {
	companyName: string | null;
	defaultRateBps: number;
	email: string;
	id: string;
	merchantCount: number;
	name: string;
	/** The rate proposed on the invite they accepted, if they came from one. */
	proposedRateBps: number | null;
	status: string;
	website: string | null;
}

function pctToBps(value: string): number {
	const pct = Number.parseFloat(value);
	return Number.isFinite(pct) ? Math.round(pct * 100) : 0;
}

const NON_CODE_CHARS = /[^A-Z0-9]/g;
/** Whitespace, commas or semicolons: however an admin pasted the list. */
const EMAIL_SEPARATORS = /[\s,;]+/;

/**
 * A starting point for the attribution code, from whatever we know them as.
 *
 * Only ever a SUGGESTION in an editable field. The code is merchant-facing and
 * must stay rate-free (`ACMEAGENCY`, never `ACME30`), which is a naming
 * judgement no derivation can make for you.
 */
function suggestCode(partner: PartnerRow): string {
	const source = partner.companyName ?? partner.name ?? "";
	const cleaned = source.toUpperCase().replace(NON_CODE_CHARS, "").slice(0, 32);
	return cleaned.length >= 4 ? cleaned : "";
}

/** Reports what became of the notification without pretending it went out. */
function describeDelivery(delivery: string): string {
	if (delivery === "sent") {
		return "Partner approved and emailed.";
	}
	if (delivery === "skipped") {
		return "Partner approved. Email is not configured, so tell them yourself.";
	}
	return "Partner approved, but the email did not send. Let them know.";
}

export default function AdminPartnersPage() {
	const partnersQuery = useQuery(trpc.admin.partners.list.queryOptions());
	const appsQuery = useQuery(trpc.admin.apps.list.queryOptions());
	const invitesQuery = useQuery(trpc.admin.partners.invites.queryOptions());
	const approveMutation = useMutation(
		trpc.admin.partners.approve.mutationOptions()
	);
	const statusMutation = useMutation(
		trpc.admin.partners.setStatus.mutationOptions()
	);
	const inviteMutation = useMutation(
		trpc.admin.partners.invite.mutationOptions()
	);
	const revokeMutation = useMutation(
		trpc.admin.partners.revokeInvite.mutationOptions()
	);
	const bonusMutation = useMutation(
		trpc.admin.partners.issueBonus.mutationOptions()
	);

	const rateId = useId();
	const codeId = useId();
	const emailsId = useId();
	const companyId = useId();
	const proposedRateId = useId();
	const bonusAmountId = useId();
	const bonusReasonId = useId();
	const bonusPeriodId = useId();

	const [approving, setApproving] = useState<PartnerRow | null>(null);
	const [inviting, setInviting] = useState(false);
	const [bonusFor, setBonusFor] = useState<PartnerRow | null>(null);

	function refresh() {
		queryClient.invalidateQueries({
			queryKey: trpc.admin.partners.list.queryKey(),
		});
		queryClient.invalidateQueries({
			queryKey: trpc.admin.partners.invites.queryKey(),
		});
		queryClient.invalidateQueries({
			queryKey: trpc.admin.dashboard.queryKey(),
		});
	}

	function handleApprove(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!approving) {
			return;
		}
		const form = new FormData(event.currentTarget);
		const appRates = (appsQuery.data ?? [])
			.map((app) => ({
				appId: app.id,
				raw: String(form.get(`rate_${app.id}`) ?? ""),
			}))
			.filter((entry) => entry.raw.trim() !== "")
			.map((entry) => ({ appId: entry.appId, rateBps: pctToBps(entry.raw) }));
		const code = String(form.get("code") ?? "").trim();

		approveMutation.mutate(
			{
				appRates: appRates.length > 0 ? appRates : undefined,
				code: code === "" ? undefined : code,
				defaultRateBps: pctToBps(String(form.get("defaultRate"))),
				partnerId: approving.id,
			},
			{
				onError: (error) => toast.error(error.message),
				onSuccess: (result) => {
					toast.success(describeDelivery(result.emailed));
					setApproving(null);
					refresh();
				},
			}
		);
	}

	function handleInvite(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const emails = String(form.get("emails") ?? "")
			.split(EMAIL_SEPARATORS)
			.map((value) => value.trim())
			.filter((value) => value !== "");

		if (emails.length === 0) {
			toast.error("Add at least one email address.");
			return;
		}

		const company = String(form.get("companyName") ?? "").trim();
		const proposed = String(form.get("proposedRate") ?? "").trim();

		inviteMutation.mutate(
			{
				companyName: company === "" ? undefined : company,
				emails,
				proposedRateBps: proposed === "" ? undefined : pctToBps(proposed),
			},
			{
				onError: (error) => toast.error(error.message),
				onSuccess: (result) => {
					const invited = result.results.filter(
						(row) => row.outcome === "invited" && row.emailed === "sent"
					).length;
					const existing = result.results.filter(
						(row) => row.outcome === "already_registered"
					).length;
					const unsent = result.results.filter(
						(row) => row.outcome === "invited" && row.emailed !== "sent"
					).length;

					const parts = [`${invited} invited`];
					if (unsent > 0) {
						parts.push(`${unsent} saved but not emailed`);
					}
					if (existing > 0) {
						parts.push(`${existing} already registered`);
					}
					toast.success(parts.join(" · "));
					setInviting(false);
					refresh();
				},
			}
		);
	}

	function handleBonus(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!bonusFor) {
			return;
		}
		const form = new FormData(event.currentTarget);
		bonusMutation.mutate(
			{
				amount: String(form.get("amount") ?? "").trim(),
				currency: String(form.get("currency") ?? "USD").trim(),
				partnerId: bonusFor.id,
				periodMonth: String(form.get("periodMonth") ?? "").trim(),
				reason: String(form.get("reason") ?? "").trim(),
			},
			{
				onError: (error) => toast.error(error.message),
				onSuccess: () => {
					toast.success("Bonus issued. It joins that month's payout.");
					setBonusFor(null);
					refresh();
				},
			}
		);
	}

	function setStatus(partnerId: string, status: "approved" | "suspended") {
		statusMutation.mutate(
			{ partnerId, status },
			{
				onError: (error) => toast.error(error.message),
				onSuccess: () => {
					toast.success(status === "suspended" ? "Suspended." : "Reinstated.");
					refresh();
				},
			}
		);
	}

	function revoke(inviteId: string) {
		revokeMutation.mutate(
			{ inviteId },
			{
				onError: (error) => toast.error(error.message),
				onSuccess: () => {
					toast.success("Invitation link revoked.");
					refresh();
				},
			}
		);
	}

	const liveInvites = (invitesQuery.data ?? []).filter(
		(invite) => invite.status === "sent"
	);

	return (
		<div className="flex flex-col gap-8">
			<PortalHeader
				action={
					<Button onClick={() => setInviting(true)} size="md" variant="primary">
						Invite partners
					</Button>
				}
				description="Invite agencies by email, approve them with a commission rate and a code, and manage status."
				title="Partners"
			/>

			{partnersQuery.isLoading ? (
				<Skeleton className="h-48 w-full rounded-xl" />
			) : (
				<TableShell
					head={
						<>
							<th>Partner</th>
							<th>Status</th>
							<th className="text-right">Rate</th>
							<th className="text-right">Merchants</th>
							<th className="text-right">Action</th>
						</>
					}
				>
					{(partnersQuery.data ?? []).map((partner) => (
						<tr key={partner.id}>
							<td>
								<div className="flex flex-col">
									<Link
										className="text-primary-foreground underline decoration-border-strong underline-offset-2"
										href={`/admin/partners/${partner.id}` as Route}
									>
										{partner.companyName ?? partner.name}
									</Link>
									<span className="text-caption text-secondary-foreground">
										{partner.email}
									</span>
								</div>
							</td>
							<td>
								<StatusBadge status={partner.status} />
							</td>
							<td className="text-right text-primary-foreground tabular-nums">
								{(partner.defaultRateBps / 100).toFixed(1)}%
							</td>
							<td className="text-right text-secondary-foreground tabular-nums">
								{partner.merchantCount}
							</td>
							<td className="text-right">
								{partner.status === "pending" ||
								partner.status === "suspended" ? (
									<Button
										onClick={() => setApproving(partner)}
										size="md"
										variant="primary"
									>
										{partner.status === "suspended" ? "Re-approve" : "Approve"}
									</Button>
								) : (
									<div className="flex items-center justify-end gap-2">
										<Button
											onClick={() => setBonusFor(partner)}
											size="md"
											variant="secondary"
										>
											Bonus
										</Button>
										<Button
											onClick={() => setStatus(partner.id, "suspended")}
											size="md"
											variant="secondary"
										>
											Suspend
										</Button>
									</div>
								)}
							</td>
						</tr>
					))}
				</TableShell>
			)}

			{liveInvites.length > 0 ? (
				<section className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<h2 className="font-medium text-h3 text-primary-foreground">
							Invitations out
						</h2>
						<p className="text-body-sm text-secondary-foreground">
							Sent, not yet accepted. Inviting the same address again replaces
							its link.
						</p>
					</div>
					<TableShell
						head={
							<>
								<th>Email</th>
								<th>Company</th>
								<th className="text-right">Proposed</th>
								<th className="text-right">Status</th>
								<th className="text-right">Action</th>
							</>
						}
					>
						{liveInvites.map((invite) => (
							<tr key={invite.id}>
								<td className="text-primary-foreground">{invite.email}</td>
								<td className="text-secondary-foreground">
									{invite.companyName ?? "Not given"}
								</td>
								<td className="text-right text-secondary-foreground tabular-nums">
									{invite.proposedRateBps === null
										? "None"
										: `${(invite.proposedRateBps / 100).toFixed(1)}%`}
								</td>
								<td className="text-right">
									<StatusBadge status={invite.expired ? "expired" : "sent"} />
								</td>
								<td className="text-right">
									<Button
										onClick={() => revoke(invite.id)}
										size="md"
										variant="secondary"
									>
										Revoke
									</Button>
								</td>
							</tr>
						))}
					</TableShell>
				</section>
			) : null}

			<Dialog onOpenChange={setInviting} open={inviting}>
				<DialogContent
					description="They get a signup link tied to their address. Accepting it creates an application. You still approve them and set the real rate."
					title="Invite partners"
				>
					<form className="flex flex-col gap-5" onSubmit={handleInvite}>
						<div className="flex flex-col gap-2">
							<Label htmlFor={emailsId}>Email addresses</Label>
							<Textarea
								id={emailsId}
								name="emails"
								placeholder={"name@youragency.com\nsecond@youragency.com"}
								rows={4}
							/>
							<span className="text-caption text-secondary-foreground">
								One per line, or separated by commas. Up to 50 at a time.
							</span>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor={companyId}>Agency name (optional)</Label>
							<Input
								id={companyId}
								name="companyName"
								placeholder="Your agency"
							/>
							<span className="text-caption text-secondary-foreground">
								Applied to every address in this batch, so send one agency at a
								time if you set it.
							</span>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor={proposedRateId}>
								Proposed commission rate (%, optional)
							</Label>
							<Input
								id={proposedRateId}
								name="proposedRate"
								placeholder="20"
								step="0.1"
								type="number"
							/>
							<span className="text-caption text-secondary-foreground">
								A note to yourself. It pre-fills the approve dialog and is never
								shown to the partner or used to calculate commission.
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
								disabled={inviteMutation.isPending}
								size="lg"
								type="submit"
								variant="primary"
							>
								{inviteMutation.isPending ? "Sending…" : "Send invitations"}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				onOpenChange={(open) => {
					if (!open) {
						setBonusFor(null);
					}
				}}
				open={bonusFor !== null}
			>
				{bonusFor ? (
					<DialogContent
						description="Money on top of commission, with no earning event behind it. It joins that month's payout, and the partner sees the reason you give."
						title={`Bonus for ${bonusFor.companyName ?? bonusFor.name}`}
					>
						<form className="flex flex-col gap-5" onSubmit={handleBonus}>
							<div className="flex gap-3">
								<div className="flex flex-1 flex-col gap-2">
									<Label htmlFor={bonusAmountId}>Amount</Label>
									<Input
										id={bonusAmountId}
										inputMode="decimal"
										name="amount"
										placeholder="250.00"
									/>
								</div>
								<div className="flex w-28 flex-col gap-2">
									<Label htmlFor="bonus-currency">Currency</Label>
									<Input
										defaultValue="USD"
										id="bonus-currency"
										maxLength={3}
										name="currency"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor={bonusPeriodId}>Payout period</Label>
								<Input
									id={bonusPeriodId}
									name="periodMonth"
									placeholder="2026-03"
								/>
								<span className="text-caption text-secondary-foreground">
									As YYYY-MM. The bonus rides that month's payout, so a period
									already paid forms a follow-up payout rather than changing a
									settled one.
								</span>
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor={bonusReasonId}>Reason</Label>
								<Input
									id={bonusReasonId}
									name="reason"
									placeholder="Brought three stores in a month"
								/>
								<span className="text-caption text-secondary-foreground">
									Shown to the partner. A payment they cannot explain is worse
									than no payment.
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
									disabled={bonusMutation.isPending}
									size="lg"
									type="submit"
									variant="primary"
								>
									{bonusMutation.isPending ? "Issuing…" : "Issue bonus"}
								</Button>
							</div>
						</form>
					</DialogContent>
				) : null}
			</Dialog>

			<Dialog
				onOpenChange={(open) => {
					if (!open) {
						setApproving(null);
					}
				}}
				open={approving !== null}
			>
				{approving ? (
					<DialogContent
						description="Sets the commission rate, issues their attribution code, and emails them both."
						title={`Approve ${approving.companyName ?? approving.name}`}
					>
						<form className="flex flex-col gap-5" onSubmit={handleApprove}>
							<div className="flex flex-col gap-2">
								<Label htmlFor={rateId}>Default commission rate (%)</Label>
								<Input
									defaultValue={(
										(approving.proposedRateBps ?? approving.defaultRateBps) /
											100 || 10
									).toString()}
									id={rateId}
									name="defaultRate"
									step="0.1"
									type="number"
								/>
								{approving.proposedRateBps === null ? null : (
									<span className="text-caption text-secondary-foreground">
										Pre-filled from the rate you proposed when you invited them.
									</span>
								)}
							</div>

							<div className="flex flex-col gap-2">
								<Label htmlFor={codeId}>Attribution code</Label>
								<Input
									defaultValue={suggestCode(approving)}
									id={codeId}
									name="code"
									placeholder="YOURAGENCY"
								/>
								<span className="text-caption text-secondary-foreground">
									4–32 letters, digits or hyphens. Keep the rate out of it,
									because a merchant sees this string. Leave blank only if they
									already hold an active code.
								</span>
							</div>

							<fieldset className="flex flex-col gap-2">
								<legend className="text-xs">
									Per-app overrides (optional)
								</legend>
								<div className="flex flex-col gap-2">
									{(appsQuery.data ?? []).map((app) => (
										<div
											className="flex items-center justify-between gap-3"
											key={app.id}
										>
											<span className="text-body-sm text-secondary-foreground">
												{app.name}
											</span>
											<Input
												className="w-24"
												name={`rate_${app.id}`}
												placeholder="-"
												step="0.1"
												type="number"
											/>
										</div>
									))}
								</div>
							</fieldset>

							<div className="flex items-center justify-end gap-3">
								<DialogClose
									render={
										<Button size="lg" type="button" variant="secondary">
											Cancel
										</Button>
									}
								/>
								<Button
									disabled={approveMutation.isPending}
									size="lg"
									type="submit"
									variant="primary"
								>
									{approveMutation.isPending ? "Approving…" : "Approve partner"}
								</Button>
							</div>
						</form>
					</DialogContent>
				) : null}
			</Dialog>
		</div>
	);
}
