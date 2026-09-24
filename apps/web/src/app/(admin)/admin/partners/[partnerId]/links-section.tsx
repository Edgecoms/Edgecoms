"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import {
	EmptyState,
	StatusBadge,
	TableShell,
} from "@edgecoms/ui/components/portal";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { EDGE_PRODUCTS } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";
import { queryClient, trpc } from "@/utils/trpc";

/**
 * A partner's referral links, on the admin side.
 *
 * The main link needs no row: `/r/<their code>` works from the moment they are
 * approved, so it is shown first and cannot be disabled or renamed. Everything
 * below it is a deliberate extra: one app, one channel, or a nicer address.
 *
 * Disabling stops new clicks resolving to a link. It never unbinds a store the
 * link already brought, the same rule a disabled code follows.
 */

interface LinkRow {
	appSlug: string | null;
	clicks: number;
	id: string;
	isActive: boolean;
	slug: string;
	subId: string | null;
	uniqueClicks: number;
}

const ALL_APPS = "all";

function referralUrl(segment: string): string {
	return `${SITE_URL}/r/${segment}`;
}

async function copy(value: string): Promise<void> {
	try {
		await navigator.clipboard.writeText(value);
		toast.success("Link copied.");
	} catch {
		toast.error("Could not copy. Select the address and copy it by hand.");
	}
}

function appLabel(appSlug: string | null): string {
	if (appSlug === null) {
		return "All apps";
	}
	return (
		EDGE_PRODUCTS.find((product) => product.slug === appSlug)?.name ?? appSlug
	);
}

function MainLink({ code }: { code: string }) {
	const url = referralUrl(code);
	return (
		<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-page/50 px-4 py-3">
			<div className="flex flex-col">
				<span className="text-caption text-secondary-foreground">
					Main link, every app
				</span>
				<span className="font-mono text-body-sm text-primary-foreground">
					{url}
				</span>
			</div>
			<Button onClick={() => copy(url)} size="md" variant="secondary">
				Copy
			</Button>
		</div>
	);
}

function LinkTableRow({
	link,
	partnerId,
}: {
	link: LinkRow;
	partnerId: string;
}) {
	const [address, setAddress] = useState(link.slug);
	const invalidate = () =>
		queryClient.invalidateQueries({
			queryKey: trpc.admin.referrals.links.list.queryKey({ partnerId }),
		});

	const setActive = useMutation(
		trpc.admin.referrals.links.setActive.mutationOptions()
	);
	const setSlug = useMutation(
		trpc.admin.referrals.links.setSlug.mutationOptions()
	);

	function toggle() {
		setActive.mutate(
			{ isActive: !link.isActive, linkId: link.id },
			{
				onError: (error) => toast.error(error.message),
				onSuccess: () => {
					toast.success(link.isActive ? "Link disabled." : "Link enabled.");
					invalidate();
				},
			}
		);
	}

	function rename() {
		setSlug.mutate(
			{ linkId: link.id, slug: address },
			{
				onError: (error) => toast.error(error.message),
				onSuccess: (result) => {
					setAddress(result.slug);
					toast.success("Address changed.");
					invalidate();
				},
			}
		);
	}

	const busy = setActive.isPending || setSlug.isPending;

	return (
		<tr>
			<td>
				<div className="flex flex-col gap-1">
					<span className="font-mono text-caption text-secondary-foreground">
						{referralUrl(link.slug)}
					</span>
					<div className="flex items-center gap-2">
						<Input
							aria-label="Link address"
							className="h-8 max-w-[220px] font-mono text-caption"
							onChange={(event) => setAddress(event.target.value)}
							value={address}
						/>
						<Button
							disabled={busy || address === link.slug}
							onClick={rename}
							size="md"
							variant="secondary"
						>
							Save
						</Button>
					</div>
				</div>
			</td>
			<td className="text-secondary-foreground">{appLabel(link.appSlug)}</td>
			<td className="text-secondary-foreground">{link.subId ?? "Main"}</td>
			<td className="text-right text-primary-foreground tabular-nums">
				{link.uniqueClicks} / {link.clicks}
			</td>
			<td>
				<StatusBadge status={link.isActive ? "approved" : "suspended"} />
			</td>
			<td className="text-right">
				<div className="flex justify-end gap-2">
					<Button
						onClick={() => copy(referralUrl(link.slug))}
						size="md"
						variant="tertiary"
					>
						Copy
					</Button>
					<Button
						disabled={busy}
						onClick={toggle}
						size="md"
						variant="secondary"
					>
						{link.isActive ? "Disable" : "Enable"}
					</Button>
				</div>
			</td>
		</tr>
	);
}

function NewLinkForm({ partnerId }: { partnerId: string }) {
	const appId = useId();
	const channelId = useId();
	const addressId = useId();
	const [appSlug, setAppSlug] = useState(ALL_APPS);
	const [subId, setSubId] = useState("");
	const [slug, setSlug] = useState("");

	const create = useMutation(
		trpc.admin.referrals.links.create.mutationOptions()
	);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		create.mutate(
			{
				appSlug: appSlug === ALL_APPS ? null : appSlug,
				partnerId,
				slug: slug.trim() === "" ? null : slug.trim(),
				subId: subId.trim() === "" ? null : subId.trim(),
			},
			{
				onError: (error) => toast.error(error.message),
				onSuccess: () => {
					setSubId("");
					setSlug("");
					toast.success("Link created.");
					queryClient.invalidateQueries({
						queryKey: trpc.admin.referrals.links.list.queryKey({ partnerId }),
					});
				},
			}
		);
	}

	return (
		<form
			className="flex flex-wrap items-end gap-3 rounded-xl border border-border border-dashed px-4 py-4"
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col gap-1">
				<label
					className="text-caption text-secondary-foreground"
					htmlFor={appId}
				>
					App
				</label>
				<select
					className="h-9 rounded-md border border-border bg-page px-2 text-body-sm text-primary-foreground"
					id={appId}
					onChange={(event) => setAppSlug(event.target.value)}
					value={appSlug}
				>
					<option value={ALL_APPS}>All apps</option>
					{EDGE_PRODUCTS.map((product) => (
						<option key={product.slug} value={product.slug}>
							{product.name}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-col gap-1">
				<label
					className="text-caption text-secondary-foreground"
					htmlFor={channelId}
				>
					Channel
				</label>
				<Input
					className="h-9 w-[160px]"
					id={channelId}
					onChange={(event) => setSubId(event.target.value)}
					placeholder="youtube"
					value={subId}
				/>
			</div>
			<div className="flex flex-col gap-1">
				<label
					className="text-caption text-secondary-foreground"
					htmlFor={addressId}
				>
					Address (optional)
				</label>
				<Input
					className="h-9 w-[200px] font-mono"
					id={addressId}
					onChange={(event) => setSlug(event.target.value)}
					placeholder="derived from the code"
					value={slug}
				/>
			</div>
			<Button
				disabled={create.isPending}
				size="lg"
				type="submit"
				variant="primary"
			>
				{create.isPending ? "Creating…" : "Create link"}
			</Button>
		</form>
	);
}

export function ReferralLinksSection({ partnerId }: { partnerId: string }) {
	const linksQuery = useQuery(
		trpc.admin.referrals.links.list.queryOptions({ partnerId })
	);
	const data = linksQuery.data;

	return (
		<section className="flex flex-col gap-4">
			<h2 className="font-medium text-h3 text-primary-foreground">
				Referral links
			</h2>

			{linksQuery.isLoading && <Skeleton className="h-32 w-full rounded-xl" />}

			{!linksQuery.isLoading && data?.code === null && (
				<EmptyState
					description="Links resolve through a partner's code, so issue a code first and the main link starts working straight away."
					title="No active code"
				/>
			)}

			{!linksQuery.isLoading && data?.code !== null && data !== undefined && (
				<>
					<MainLink code={data.code} />
					{data.links.length === 0 ? (
						<EmptyState
							description="Create one to track a single app or a single channel. Clicks on the main link are counted either way."
							title="No extra links"
						/>
					) : (
						<TableShell
							head={
								<>
									<th>Address</th>
									<th>App</th>
									<th>Channel</th>
									<th className="text-right">Unique / clicks</th>
									<th>Status</th>
									<th className="text-right">Action</th>
								</>
							}
						>
							{data.links.map((link) => (
								<LinkTableRow key={link.id} link={link} partnerId={partnerId} />
							))}
						</TableShell>
					)}
					<NewLinkForm partnerId={partnerId} />
				</>
			)}
		</section>
	);
}
