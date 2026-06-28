import { Skeleton } from "@edgecoms/ui/components/skeleton";
import type { ReactNode } from "react";

export function PortalHeader({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between">
			<div className="flex flex-col gap-2">
				<h1 className="font-medium text-h1 text-primary-foreground tracking-tight">
					{title}
				</h1>
				{description ? (
					<p className="max-w-2xl text-pretty text-body-sm text-secondary-foreground leading-relaxed">
						{description}
					</p>
				) : null}
			</div>
			{action ? <div className="shrink-0">{action}</div> : null}
		</div>
	);
}

export function StatCard({
	label,
	value,
	hint,
	loading,
}: {
	label: string;
	value: ReactNode;
	hint?: string;
	loading?: boolean;
}) {
	return (
		<div className="flex flex-col gap-2 rounded-xl border border-border bg-page p-5">
			<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
				{label}
			</span>
			{loading ? (
				<Skeleton className="h-8 w-24" />
			) : (
				<span className="font-medium text-h2 text-primary-foreground tabular-nums">
					{value}
				</span>
			)}
			{hint ? (
				<span className="text-caption text-secondary-foreground">{hint}</span>
			) : null}
		</div>
	);
}

const STATUS_STYLES: Record<string, string> = {
	approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
	paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
	pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
	rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
	suspended: "bg-rose-50 text-rose-700 ring-rose-600/20",
	void: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export function StatusBadge({ status }: { status: string }) {
	const style = STATUS_STYLES[status] ?? STATUS_STYLES.void;
	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium text-[11px] capitalize ring-1 ring-inset ${style}`}
		>
			{status}
		</span>
	);
}

export function EmptyState({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<div className="flex flex-col items-center gap-3 rounded-xl border border-border border-dashed bg-page/50 px-6 py-16 text-center">
			<p className="font-medium text-body text-primary-foreground">{title}</p>
			{description ? (
				<p className="max-w-sm text-pretty text-body-sm text-secondary-foreground">
					{description}
				</p>
			) : null}
			{action ? <div className="pt-2">{action}</div> : null}
		</div>
	);
}

export function TableShell({
	head,
	children,
}: {
	head: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="overflow-x-auto rounded-xl border border-border bg-page">
			<table className="w-full text-left text-body-sm">
				<thead className="border-border border-b text-secondary-foreground">
					<tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:font-medium [&>th]:text-[11px] [&>th]:uppercase [&>th]:tracking-[0.06em]">
						{head}
					</tr>
				</thead>
				<tbody className="[&>tr:not(:last-child)]:border-b [&>tr>td]:px-4 [&>tr>td]:py-3 [&>tr]:border-border">
					{children}
				</tbody>
			</table>
		</div>
	);
}
