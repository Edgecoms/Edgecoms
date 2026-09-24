import { db } from "@edgecoms/db";
import { RESEND_UNSUBSCRIBE_URL, renderHtml } from "@edgecoms/mail/render";
import { EmptyState, PortalHeader } from "@edgecoms/ui/components/portal";
import type { Metadata, Route } from "next";
import Link from "next/link";
import {
	brandFor,
	LIFECYCLE_NAMES,
	LIFECYCLE_TEMPLATES,
	lifecycleContent,
} from "@/emails/templates";
import { identityOf, listAppsWithSettings } from "@/server/apps/identity";

export const metadata: Metadata = { title: "Templates" };

function pill(active: boolean): string {
	return `rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
		active
			? "bg-surface-item-active text-primary-foreground"
			: "text-secondary-foreground hover:text-primary-foreground"
	}`;
}

/**
 * The lifecycle emails exactly as each app sends them: the same render the
 * push to Resend uses, so what is previewed here is what goes out.
 */
export default async function TemplatesPage({
	searchParams,
}: {
	searchParams: Promise<{ app?: string; t?: string }>;
}) {
	const { app: slug, t } = await searchParams;
	const all = await listAppsWithSettings(db);
	const app = all.find((row) => row.slug === slug) ?? all[0];
	const template = LIFECYCLE_TEMPLATES.find((name) => name === t) ?? "welcome";

	if (!app) {
		return (
			<EmptyState
				description="Seed the app catalog first."
				title="No apps yet"
			/>
		);
	}

	const identity = identityOf(app);
	const content = lifecycleContent(template, identity);
	const html = renderHtml(content, brandFor(identity, RESEND_UNSUBSCRIBE_URL));
	const href = (appSlug: string, name: string) =>
		`/templates?app=${appSlug}&t=${name}` as Route;

	return (
		<div className="flex flex-col gap-6">
			<PortalHeader
				description="Pushed to Resend as <app>-<template> by `bun run resend:push-templates`. Automations pick them by that alias."
				title="Templates"
			/>
			<nav aria-label="App" className="flex flex-wrap gap-1">
				{all.map((row) => (
					<Link
						aria-current={row.slug === app.slug ? "page" : undefined}
						className={pill(row.slug === app.slug)}
						href={href(row.slug, template)}
						key={row.slug}
					>
						{row.name}
						{row.settings ? "" : " (not configured)"}
					</Link>
				))}
			</nav>
			<nav aria-label="Template" className="flex flex-wrap gap-1">
				{LIFECYCLE_TEMPLATES.map((name) => (
					<Link
						aria-current={name === template ? "page" : undefined}
						className={pill(name === template)}
						href={href(app.slug, name)}
						key={name}
					>
						{LIFECYCLE_NAMES[name]}
					</Link>
				))}
			</nav>
			<p className="text-body-sm text-secondary-foreground">
				Subject:{" "}
				<span className="text-primary-foreground">{content.subject}</span>
			</p>
			<iframe
				className="h-[760px] w-full rounded-xl border border-border-strong bg-white"
				sandbox=""
				srcDoc={html}
				title={`${app.name} ${LIFECYCLE_NAMES[template]} preview`}
			/>
		</div>
	);
}
