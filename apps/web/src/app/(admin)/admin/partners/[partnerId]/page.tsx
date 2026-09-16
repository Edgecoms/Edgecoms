"use client";

import { ButtonLink } from "@edgecoms/ui/components/button";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import {
	EmptyState,
	PortalHeader,
	StatusBadge,
	TableShell,
} from "@/components/portal/ui";
import { formatMoney, formatPeriod } from "@/lib/money";
import { trpc } from "@/utils/trpc";

/**
 * One partner, end to end: the rate they are on, the codes they hand out, the
 * stores those codes brought in, and the money that followed.
 *
 * There is no partner-detail procedure, so every section reads the same list
 * the matching admin index reads and keeps the rows for this partner. The lists
 * are admin-sized (and commissions are server-capped at 200), so filtering
 * here costs a pass over an array rather than a round trip.
 *
 * `codes.list` carries a `partnerId`, so its rows match exactly. The other
 * payloads carry only the partner LABEL the server renders them with, so their
 * rows are matched on that same `companyName ?? name` string: two partners
 * sharing a company name would see each other's rows, and the fix for that is
 * a `partnerId` on those payloads rather than a cleverer guess here.
 */

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

interface CodeRow {
	code: string;
	expiresAt: Date | string | null;
	id: string;
	label: string | null;
	maxRedemptions: number | null;
	partnerId: string;
	redemptions: number;
	status: string;
}

interface StoreRow {
	id: string;
	name: string;
	partnerCompany: string | null;
	partnerName: string;
	shopDomain: string;
	source: string;
	sourceCode: string | null;
	status: string;
}

interface BonusRow {
	amountMinor: string;
	currency: string;
	id: string;
	partner: string;
	periodMonth: string;
	reason: string | null;
	status: string;
}

interface CommissionRow {
	amountMinor: string;
	appName: string;
	currency: string;
	id: string;
	merchantName: string;
	partner: string;
	period: string;
	rateBps: number;
	status: string;
}

interface PayoutRow {
	amountMinor: string;
	currency: string;
	id: string;
	method: string | null;
	netMinor: string;
	partner: string;
	periodMonth: string;
	reference: string | null;
	status: string;
}

const PARTNERS_HREF = "/admin/partners" as Route;

function formatBps(bps: number): string {
	return `${(bps / 100).toFixed(1)}%`;
}

function formatDate(value: Date | string | null): string {
	if (!value) {
		return "Never";
	}
	return new Date(value).toLocaleDateString(undefined, {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="flex flex-col gap-1">
			<dt className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
				{label}
			</dt>
			<dd className="text-body text-primary-foreground tabular-nums">
				{value}
			</dd>
		</div>
	);
}

function PartnerFacts({ partner }: { partner: PartnerRow }) {
	return (
		<dl className="grid gap-5 rounded-xl border border-border-strong bg-surface p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
			<Fact label="Commission rate" value={formatBps(partner.defaultRateBps)} />
			<Fact label="Merchants" value={partner.merchantCount} />
			<Fact
				label="Proposed on invite"
				value={
					partner.proposedRateBps === null
						? "None"
						: formatBps(partner.proposedRateBps)
				}
			/>
			<Fact
				label="Website"
				value={
					partner.website ? (
						<a
							className="text-primary-foreground underline decoration-border-strong underline-offset-2"
							href={partner.website}
							rel="noreferrer noopener"
							target="_blank"
						>
							{partner.website}
						</a>
					) : (
						"Not given"
					)
				}
			/>
		</dl>
	);
}

/**
 * A titled section that owns its own three states, so a slow query shows a
 * skeleton where its table will be instead of blanking the whole page.
 */
function Section({
	children,
	count,
	emptyDescription,
	emptyTitle,
	loading,
	title,
}: {
	children: ReactNode;
	count: number;
	emptyDescription: string;
	emptyTitle: string;
	loading: boolean;
	title: string;
}) {
	function body() {
		if (loading) {
			return <Skeleton className="h-32 w-full rounded-xl" />;
		}
		if (count === 0) {
			return <EmptyState description={emptyDescription} title={emptyTitle} />;
		}
		return children;
	}

	return (
		<section className="flex flex-col gap-4">
			<h2 className="font-medium text-h3 text-primary-foreground">{title}</h2>
			{body()}
		</section>
	);
}

function CodesSection({
	codes,
	loading,
}: {
	codes: CodeRow[];
	loading: boolean;
}) {
	return (
		<Section
			count={codes.length}
			emptyDescription="Approving a partner issues their first code, and you can issue more from Attribution codes."
			emptyTitle="No codes"
			loading={loading}
			title="Attribution codes"
		>
			<TableShell
				head={
					<>
						<th>Code</th>
						<th>Status</th>
						<th className="text-right">Redemptions</th>
						<th>Expires</th>
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
							<StatusBadge
								status={code.status === "active" ? "approved" : "suspended"}
							/>
						</td>
						<td className="text-right text-primary-foreground tabular-nums">
							{code.redemptions}
							{code.maxRedemptions === null ? "" : ` / ${code.maxRedemptions}`}
						</td>
						<td className="text-secondary-foreground">
							{formatDate(code.expiresAt)}
						</td>
					</tr>
				))}
			</TableShell>
		</Section>
	);
}

function StoresSection({
	loading,
	stores,
}: {
	loading: boolean;
	stores: StoreRow[];
}) {
	return (
		<Section
			count={stores.length}
			emptyDescription="A store lands here once a merchant enters one of their codes, or once you register it against them by hand."
			emptyTitle="No stores"
			loading={loading}
			title="Stores"
		>
			<TableShell
				head={
					<>
						<th>Store</th>
						<th>Source</th>
						<th>Status</th>
					</>
				}
			>
				{stores.map((store) => (
					<tr key={store.id}>
						<td>
							<div className="flex flex-col">
								<span className="text-primary-foreground">{store.name}</span>
								<span className="text-caption text-secondary-foreground">
									{store.shopDomain}
								</span>
							</div>
						</td>
						<td>
							{store.source === "code" && store.sourceCode ? (
								<span className="font-mono text-caption text-secondary-foreground">
									{store.sourceCode}
								</span>
							) : (
								<span className="text-caption text-secondary-foreground">
									Registered by hand
								</span>
							)}
						</td>
						<td>
							<StatusBadge status={store.status} />
						</td>
					</tr>
				))}
			</TableShell>
		</Section>
	);
}

function CommissionsSection({
	commissions,
	loading,
}: {
	commissions: CommissionRow[];
	loading: boolean;
}) {
	return (
		<Section
			count={commissions.length}
			emptyDescription="The billing sync generates commission once an approved store is billed for an app that earns."
			emptyTitle="No commissions"
			loading={loading}
			title="Commissions"
		>
			<TableShell
				head={
					<>
						<th>Store</th>
						<th>App</th>
						<th>Period</th>
						<th className="text-right">Rate</th>
						<th>Status</th>
						<th className="text-right">Amount</th>
					</>
				}
			>
				{commissions.map((commission) => (
					<tr key={commission.id}>
						<td className="text-primary-foreground">
							{commission.merchantName}
						</td>
						<td className="text-secondary-foreground">{commission.appName}</td>
						<td className="text-secondary-foreground">
							{formatPeriod(commission.period)}
						</td>
						<td className="text-right text-secondary-foreground tabular-nums">
							{formatBps(commission.rateBps)}
						</td>
						<td>
							<StatusBadge status={commission.status} />
						</td>
						<td className="text-right text-primary-foreground tabular-nums">
							{formatMoney(commission.amountMinor, commission.currency)}
						</td>
					</tr>
				))}
			</TableShell>
		</Section>
	);
}

function BonusesSection({
	bonuses,
	loading,
}: {
	bonuses: BonusRow[];
	loading: boolean;
}) {
	return (
		<Section
			count={bonuses.length}
			emptyDescription="Issue one from the partners list and it rides that month's payout."
			emptyTitle="No bonuses"
			loading={loading}
			title="Bonuses"
		>
			<TableShell
				head={
					<>
						<th>Reason</th>
						<th>Period</th>
						<th>Status</th>
						<th className="text-right">Amount</th>
					</>
				}
			>
				{bonuses.map((bonus) => (
					<tr key={bonus.id}>
						<td className="text-primary-foreground">
							{bonus.reason ?? "Not given"}
						</td>
						<td className="text-secondary-foreground">
							{formatPeriod(bonus.periodMonth)}
						</td>
						<td>
							<StatusBadge status={bonus.status} />
						</td>
						<td className="text-right text-primary-foreground tabular-nums">
							{formatMoney(bonus.amountMinor, bonus.currency)}
						</td>
					</tr>
				))}
			</TableShell>
		</Section>
	);
}

function PayoutsSection({
	loading,
	payouts,
}: {
	loading: boolean;
	payouts: PayoutRow[];
}) {
	return (
		<Section
			count={payouts.length}
			emptyDescription="Group their pending commissions for a period from Payouts and it appears here."
			emptyTitle="No payouts"
			loading={loading}
			title="Payouts"
		>
			<TableShell
				head={
					<>
						<th>Period</th>
						<th>Method</th>
						<th>Reference</th>
						<th>Status</th>
						<th className="text-right">Gross</th>
						<th className="text-right">Net</th>
					</>
				}
			>
				{payouts.map((payout) => (
					<tr key={payout.id}>
						<td className="text-primary-foreground">
							{formatPeriod(payout.periodMonth)}
						</td>
						<td className="text-secondary-foreground">
							{payout.method ?? "-"}
						</td>
						<td className="font-mono text-caption text-secondary-foreground">
							{payout.reference ?? "-"}
						</td>
						<td>
							<StatusBadge status={payout.status} />
						</td>
						<td className="text-right text-secondary-foreground tabular-nums">
							{formatMoney(payout.amountMinor, payout.currency)}
						</td>
						<td className="text-right text-primary-foreground tabular-nums">
							{formatMoney(payout.netMinor, payout.currency)}
						</td>
					</tr>
				))}
			</TableShell>
		</Section>
	);
}

function PartnerDetail({ partner }: { partner: PartnerRow }) {
	const codesQuery = useQuery(trpc.admin.codes.list.queryOptions());
	const merchantsQuery = useQuery(trpc.admin.merchants.list.queryOptions());
	const bonusesQuery = useQuery(trpc.admin.partners.bonuses.queryOptions());
	const payoutsQuery = useQuery(trpc.admin.payouts.list.queryOptions());
	/* Every status, because a detail page that hid paid commission would make a
	   partner with a settled book look like they had never earned. */
	const commissionsQuery = useQuery(
		trpc.admin.commissions.list.queryOptions(undefined)
	);

	const label = partner.companyName ?? partner.name;
	const codes = (codesQuery.data ?? []).filter(
		(row) => row.partnerId === partner.id
	);
	const stores = (merchantsQuery.data ?? []).filter(
		(row) => (row.partnerCompany ?? row.partnerName) === label
	);
	const bonuses = (bonusesQuery.data ?? []).filter(
		(row) => row.partner === label
	);
	const commissions = (commissionsQuery.data ?? []).filter(
		(row) => row.partner === label
	);
	const payouts = (payoutsQuery.data ?? []).filter(
		(row) => row.partner === label
	);

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-2">
				<ButtonLink
					className="self-start"
					href={PARTNERS_HREF}
					size="md"
					variant="tertiary"
				>
					All partners
				</ButtonLink>
				<PortalHeader
					action={<StatusBadge status={partner.status} />}
					description={partner.email}
					title={label}
				/>
				<PartnerFacts partner={partner} />
			</div>

			<CodesSection codes={codes} loading={codesQuery.isLoading} />
			<StoresSection loading={merchantsQuery.isLoading} stores={stores} />
			<CommissionsSection
				commissions={commissions}
				loading={commissionsQuery.isLoading}
			/>
			<BonusesSection bonuses={bonuses} loading={bonusesQuery.isLoading} />
			<PayoutsSection loading={payoutsQuery.isLoading} payouts={payouts} />
		</div>
	);
}

export default function AdminPartnerDetailPage() {
	const { partnerId } = useParams<{ partnerId: string }>();
	const partnersQuery = useQuery(trpc.admin.partners.list.queryOptions());
	const partner = (partnersQuery.data ?? []).find(
		(row) => row.id === partnerId
	);

	if (partnersQuery.isLoading) {
		return <Skeleton className="h-48 w-full rounded-xl" />;
	}

	if (!partner) {
		return (
			<EmptyState
				action={
					<ButtonLink href={PARTNERS_HREF} size="lg" variant="primary">
						Back to partners
					</ButtonLink>
				}
				description="This partner is not in the list. They may have been removed, or the link may be wrong."
				title="No such partner"
			/>
		);
	}

	return <PartnerDetail partner={partner} />;
}
