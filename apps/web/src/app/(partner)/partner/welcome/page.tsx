"use client";

import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import Link from "next/link";
import { PartnerCodeCard } from "@/components/portal/partner-code-card";
import { PortalHeader, StatusBadge } from "@/components/portal/ui";
import { trpc } from "@/utils/trpc";

/**
 * THE FIRST SCREEN a partner sees, and for a while the only one worth seeing.
 *
 * A newly approved partner used to land on the dashboard: four zeroes, an empty
 * activity table, and no explanation of how any of it becomes non-zero.
 * Everything a partner needs to understand was written on the public marketing
 * page and nowhere inside the product.
 *
 * So this screen answers three questions in order, and nothing else:
 *
 *   1. What is my code, and what do I do with it?
 *   2. How does that turn into money?
 *   3. What is still waiting on me?
 *
 * The checklist is derived, never stored. See `partner.onboarding`. Each item
 * is a fact about a row that exists, so it cannot drift out of step with
 * reality the way a saved "onboarding_complete" flag would.
 */

/** How a partner earns, in the order they experience it. */
const HOW_IT_WORKS = [
	{
		body: "No link for them to click and forget. They paste the code into any Edge app while installing, and the store arrives here already attributed to you.",
		title: "Give your code to a store you manage",
	},
	{
		body: "We check the store over and approve it. Until then it sits in your Merchants list as pending, and earns nothing.",
		title: "We approve the store",
	},
	{
		body: "Nothing for you to track or invoice. Every commission is generated from a charge Shopify has already recorded against that store.",
		title: "Shopify bills it for the Edge apps it uses",
	},
	{
		body: "You take your share of what Edge receives, paid again every month for as long as the store stays on Edge. No expiry and no clawback window.",
		title: "You get paid, every month it stays",
	},
] as const;

interface ChecklistItem {
	description: string;
	done: boolean;
	/** Typed route: Next's typedRoutes rejects a bare string here. */
	href?: Route;
	label: string;
	title: string;
}

function Checklist({ items }: { items: readonly ChecklistItem[] }) {
	return (
		<ol className="flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
			{items.map((item) => (
				<li
					className="flex items-start gap-3 bg-surface px-5 py-4"
					key={item.title}
				>
					<span
						aria-hidden="true"
						className={
							item.done
								? "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-caption text-surface"
								: "mt-0.5 size-5 shrink-0 rounded-full border border-border border-dashed"
						}
					>
						{item.done ? "✓" : null}
					</span>
					<div className="flex flex-col gap-0.5">
						<span className="text-body-sm text-primary-foreground">
							{item.title}
							<span className="sr-only">
								{item.done ? " (done)" : " (still to do)"}
							</span>
						</span>
						<span className="text-caption text-secondary-foreground">
							{item.description}
						</span>
						{item.href && !item.done ? (
							<Link
								className="mt-1 w-fit text-caption text-primary-foreground underline"
								href={item.href}
							>
								{item.label}
							</Link>
						) : null}
					</div>
				</li>
			))}
		</ol>
	);
}

export default function PartnerWelcomePage() {
	const { data, isLoading } = useQuery(trpc.partner.onboarding.queryOptions());

	const approved = data?.status === "approved";
	const rate = data ? (data.defaultRateBps / 100).toFixed(1) : null;

	const checklist: ChecklistItem[] = data
		? [
				{
					description: data.steps.codeIssued
						? "Your code is ready to hand out."
						: "We issue this when your account is approved. If you are approved and still waiting, tell us.",
					done: data.steps.codeIssued,
					label: "",
					title: "Attribution code issued",
				},
				{
					description:
						"We cannot pay you without these. Two minutes now beats a delayed first payout.",
					done: data.steps.payoutReady,
					href: "/partner/settings" as Route,
					label: "Add payout details",
					title: "Payout details added",
				},
				{
					description:
						"Send your code to one store you already manage. It shows up here for approval.",
					done: data.steps.firstStore,
					href: "/partner/merchants" as Route,
					label: "See your merchants",
					title: "First store bound to your code",
				},
				{
					description:
						"Arrives on its own once an approved store is billed for an Edge app.",
					done: data.steps.firstCommission,
					href: "/partner/earnings" as Route,
					label: "See your earnings",
					title: "First commission earned",
				},
			]
		: [];

	return (
		<div className="flex flex-col gap-10">
			<PortalHeader
				description="What your code does, how you get paid, and the two things still waiting on you."
				title="Start here"
			/>

			{isLoading ? <Skeleton className="h-28 w-full rounded-xl" /> : null}

			{data && !approved ? (
				<div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
					<div className="flex items-center gap-2">
						<span className="font-medium text-body-sm">
							Your application is
						</span>
						<StatusBadge status={data.status} />
					</div>
					<p className="text-body-sm">
						Nothing is needed from you yet. We review applications by hand, set
						your commission rate, and email you your code, usually the same day.
						Your code only starts binding stores once that happens.
					</p>
				</div>
			) : null}

			{data && approved ? (
				<p className="max-w-prose text-body text-secondary-foreground">
					You are approved at{" "}
					<strong className="text-primary-foreground">
						{rate}% commission
					</strong>{" "}
					on the net revenue of every store you bring to Edge. That rate is
					fixed onto each commission as it is earned, so if we ever renegotiate
					it, everything you have already earned stays exactly as it was.
				</p>
			) : null}

			<PartnerCodeCard />

			<section className="flex flex-col gap-4">
				<h2 className="font-medium text-h3 text-primary-foreground">
					How you get paid
				</h2>
				<ol className="grid gap-4 sm:grid-cols-2">
					{HOW_IT_WORKS.map((step, index) => (
						<li
							className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface px-5 py-4"
							key={step.title}
						>
							<span className="text-caption text-secondary-foreground tabular-nums">
								Step {index + 1}
							</span>
							<span className="font-medium text-body-sm text-primary-foreground">
								{step.title}
							</span>
							<span className="text-caption text-secondary-foreground">
								{step.body}
							</span>
						</li>
					))}
				</ol>
			</section>

			{data ? (
				<section className="flex flex-col gap-4">
					<h2 className="font-medium text-h3 text-primary-foreground">
						Still to do
					</h2>
					<Checklist items={checklist} />
				</section>
			) : null}
		</div>
	);
}
