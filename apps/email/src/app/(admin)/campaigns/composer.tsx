"use client";

import { RESEND_UNSUBSCRIBE_URL, renderHtml } from "@edgecoms/mail/render";
import { Button } from "@edgecoms/ui/components/button";
import { Label } from "@edgecoms/ui/components/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { type ReactNode, useId, useState } from "react";
import { toast } from "sonner";
import { brandFor, campaignContent } from "@/emails/templates";
import { count as formatCount } from "@/lib/format";
import { queryClient, trpc } from "@/utils/trpc";
import { AudienceFields } from "./audience-fields";
import { SendDialog } from "./send-dialog";
import {
	AREA,
	CAMPAIGN_TYPES,
	CATEGORY_LABEL,
	type CampaignForm,
	type CampaignType,
	EMPTY_FORM,
	FIELD,
} from "./shared";

function nullIfEmpty(value: string): string | null {
	return value.trim() === "" ? null : value;
}

function Field({
	children,
	hint,
	label,
}: {
	children: (id: string) => ReactNode;
	hint?: string;
	label: string;
}) {
	const id = useId();
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>{label}</Label>
			{children(id)}
			{hint ? (
				<span className="text-caption text-secondary-foreground">{hint}</span>
			) : null}
		</div>
	);
}

/**
 * Structured fields and a live preview. The preview is rendered in the
 * browser by the SAME layout code the send uses, so what is shown is what
 * goes out.
 */
export function Composer({
	campaign,
}: {
	campaign?: { form: CampaignForm; id: string; tested: boolean };
}) {
	const router = useRouter();
	const options = useQuery(trpc.campaigns.options.queryOptions());
	const configured = options.data?.apps.filter((app) => app.configured) ?? [];
	const [form, setForm] = useState<CampaignForm>(campaign?.form ?? EMPTY_FORM);
	const [dirty, setDirty] = useState(!campaign);
	const [sending, setSending] = useState(false);
	const appId = form.appId || configured[0]?.appId || "";
	const app = options.data?.apps.find((row) => row.appId === appId);

	const recipients = useQuery({
		...trpc.campaigns.audienceCount.queryOptions({
			appId,
			audience: form.audience,
			type: form.type,
		}),
		enabled: appId !== "",
	});

	function update(patch: Partial<CampaignForm>) {
		setForm((current) => ({ ...current, ...patch }));
		setDirty(true);
	}

	const payload = { ...form, appId };
	const onError = (error: { message: string }) => toast.error(error.message);
	const create = useMutation(
		trpc.campaigns.create.mutationOptions({
			onError,
			onSuccess: ({ id }) => router.push(`/campaigns/${id}` as Route),
		})
	);
	const save = useMutation(
		trpc.campaigns.update.mutationOptions({
			onError,
			onSuccess: async () => {
				setDirty(false);
				toast.success("Saved. Send a new test before sending.");
				await queryClient.invalidateQueries();
			},
		})
	);
	const sendTest = useMutation(
		trpc.campaigns.sendTest.mutationOptions({
			onError,
			onSuccess: async ({ to }) => {
				toast.success(`Test sent to ${to}`);
				await queryClient.invalidateQueries();
			},
		})
	);

	const preview = app
		? renderHtml(
				campaignContent({
					body: form.body,
					ctaLabel: nullIfEmpty(form.ctaLabel),
					ctaUrl: nullIfEmpty(form.ctaUrl),
					eyebrow: nullIfEmpty(form.eyebrow),
					headline: form.headline || "Your headline",
					preheader: form.preheader,
					subject: form.subject,
				}),
				brandFor(app.identity, RESEND_UNSUBSCRIBE_URL)
			)
		: "";

	const count = recipients.data?.count;
	const canSend =
		campaign !== undefined && !dirty && campaign.tested && (count ?? 0) > 0;

	return (
		<div className="grid gap-8 lg:grid-cols-2">
			<form
				className="flex flex-col gap-5"
				onSubmit={(event) => {
					event.preventDefault();
					if (campaign) {
						save.mutate({ ...payload, id: campaign.id });
					} else {
						create.mutate(payload);
					}
				}}
			>
				<Field label="Campaign name">
					{(id) => (
						<input
							className={FIELD}
							id={id}
							onChange={(event) => update({ name: event.target.value })}
							required
							value={form.name}
						/>
					)}
				</Field>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field label="App">
						{(id) => (
							<select
								className={FIELD}
								id={id}
								onChange={(event) =>
									update({ appId: event.target.value, audience: {} })
								}
								value={appId}
							>
								{configured.map((row) => (
									<option key={row.appId} value={row.appId}>
										{row.name}
									</option>
								))}
							</select>
						)}
					</Field>
					<Field
						hint={`Goes to: ${CATEGORY_LABEL[form.type]} subscribers`}
						label="Type"
					>
						{(id) => (
							<select
								className={FIELD}
								id={id}
								onChange={(event) =>
									update({ type: event.target.value as CampaignType })
								}
								value={form.type}
							>
								{CAMPAIGN_TYPES.map(([value, label]) => (
									<option key={value} value={value}>
										{label}
									</option>
								))}
							</select>
						)}
					</Field>
				</div>
				<Field label="Subject">
					{(id) => (
						<input
							className={FIELD}
							id={id}
							onChange={(event) => update({ subject: event.target.value })}
							required
							value={form.subject}
						/>
					)}
				</Field>
				<Field label="Preview text">
					{(id) => (
						<input
							className={FIELD}
							id={id}
							onChange={(event) => update({ preheader: event.target.value })}
							value={form.preheader}
						/>
					)}
				</Field>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field label="Eyebrow (optional)">
						{(id) => (
							<input
								className={FIELD}
								id={id}
								onChange={(event) => update({ eyebrow: event.target.value })}
								placeholder="New feature"
								value={form.eyebrow}
							/>
						)}
					</Field>
					<Field label="Headline">
						{(id) => (
							<input
								className={FIELD}
								id={id}
								onChange={(event) => update({ headline: event.target.value })}
								required
								value={form.headline}
							/>
						)}
					</Field>
				</div>
				<Field hint="A blank line starts a new paragraph." label="Body">
					{(id) => (
						<textarea
							className={AREA}
							id={id}
							onChange={(event) => update({ body: event.target.value })}
							required
							value={form.body}
						/>
					)}
				</Field>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field label="Button text">
						{(id) => (
							<input
								className={FIELD}
								id={id}
								onChange={(event) => update({ ctaLabel: event.target.value })}
								value={form.ctaLabel}
							/>
						)}
					</Field>
					<Field label="Button link (https)">
						{(id) => (
							<input
								className={FIELD}
								id={id}
								onChange={(event) => update({ ctaUrl: event.target.value })}
								type="url"
								value={form.ctaUrl}
							/>
						)}
					</Field>
				</div>

				<AudienceFields
					audience={form.audience}
					onChange={(audience) => update({ audience })}
					otherApps={(options.data?.apps ?? [])
						.filter((row) => row.appId !== appId)
						.map((row) => ({ name: row.name, slug: row.slug }))}
				/>

				<p className="text-body-sm text-primary-foreground">
					Recipients:{" "}
					<span className="tabular-nums">
						{count === undefined ? "…" : formatCount(count)}
					</span>
					<span className="text-secondary-foreground">
						{" "}
						(opted in to {CATEGORY_LABEL[form.type].toLowerCase()}, not
						suppressed, each person once)
					</span>
				</p>

				<div className="flex flex-wrap items-center gap-3">
					<Button
						disabled={
							!dirty || create.isPending || save.isPending || appId === ""
						}
						size="lg"
						type="submit"
						variant={campaign ? "secondary" : "primary"}
					>
						{campaign ? "Save" : "Create draft"}
					</Button>
					{campaign ? (
						<>
							<Button
								disabled={dirty || sendTest.isPending}
								onClick={() => sendTest.mutate({ id: campaign.id })}
								size="lg"
								type="button"
								variant="secondary"
							>
								Send test to me
							</Button>
							<Button
								disabled={!canSend}
								onClick={() => setSending(true)}
								size="lg"
								type="button"
								variant="primary"
							>
								Send…
							</Button>
						</>
					) : null}
				</div>
				{campaign && !campaign.tested ? (
					<p className="text-caption text-secondary-foreground">
						Send a test after your last change to unlock sending.
					</p>
				) : null}
			</form>

			<div className="flex flex-col gap-2 lg:sticky lg:top-6 lg:self-start">
				<p className="text-body-sm text-secondary-foreground">
					Subject:{" "}
					<span className="text-primary-foreground">{form.subject || "-"}</span>
				</p>
				<iframe
					className="h-[720px] w-full rounded-xl border border-border-strong bg-white"
					sandbox=""
					srcDoc={preview}
					title="Email preview"
				/>
			</div>

			{campaign && count !== undefined ? (
				<SendDialog
					campaignId={campaign.id}
					categoryLabel={CATEGORY_LABEL[form.type]}
					name={form.name}
					onOpenChange={setSending}
					open={sending}
					recipients={count}
					testMode={options.data?.testMode ?? true}
				/>
			) : null}
		</div>
	);
}
