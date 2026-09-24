"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Label } from "@edgecoms/ui/components/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { type ReactNode, useId, useState } from "react";
import { toast } from "sonner";
import {
	byteSize,
	claudePrompt,
	GMAIL_CLIP_BYTES,
	htmlProblem,
	withoutPlaceholders,
} from "@/emails/campaign-html";
import { count as formatCount } from "@/lib/format";
import { queryClient, trpc } from "@/utils/trpc";
import { AudienceFields } from "./audience-fields";
import { SendDialog } from "./send-dialog";
import {
	CAMPAIGN_TYPES,
	CATEGORY_LABEL,
	type CampaignForm,
	type CampaignType,
	CODE_AREA,
	EMPTY_FORM,
	FIELD,
} from "./shared";

function Field({
	children,
	hint,
	label,
}: {
	children: (id: string) => ReactNode;
	hint?: ReactNode;
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

/** The pasted email, with what is wrong with it and the brief for Claude. */
function HtmlField({
	app,
	onChange,
	value,
}: {
	app: { logoUrl: string | null; name: string } | null;
	onChange: (html: string) => void;
	value: string;
}) {
	const problem = value.trim() === "" ? null : htmlProblem(value);
	const size = byteSize(value);

	async function copyPrompt() {
		try {
			await navigator.clipboard.writeText(
				claudePrompt(app?.name ?? "an Edge app", app?.logoUrl ?? null)
			);
			toast.success(
				"Prompt copied. Add what the email is about, then paste it into Claude."
			);
		} catch {
			toast.error("Could not copy. Your browser blocked the clipboard.");
		}
	}

	return (
		<>
			<Field
				hint={
					<>
						Paste the full HTML. It is sent exactly as pasted.{" "}
						<button
							className="text-primary-foreground underline underline-offset-4"
							onClick={copyPrompt}
							type="button"
						>
							Copy prompt for Claude
						</button>
					</>
				}
				label="Email HTML"
			>
				{(id) => (
					<textarea
						className={CODE_AREA}
						id={id}
						onChange={(event) => onChange(event.target.value)}
						placeholder="<!doctype html>…"
						spellCheck={false}
						value={value}
					/>
				)}
			</Field>
			{problem ? (
				<p className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-body-sm text-rose-800">
					{problem}
				</p>
			) : null}
			{size > GMAIL_CLIP_BYTES ? (
				<p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 text-body-sm">
					This email is {Math.round(size / 1000)} KB. Gmail hides anything past
					102 KB behind "View entire message".
				</p>
			) : null}
		</>
	);
}

/** The email as it will arrive, in a sandbox: nothing in it can run. */
function EmailPreview({ html, subject }: { html: string; subject: string }) {
	return (
		<div className="flex flex-col gap-2 lg:sticky lg:top-6 lg:self-start">
			<p className="text-body-sm text-secondary-foreground">
				Subject:{" "}
				<span className="text-primary-foreground">{subject || "-"}</span>
			</p>
			{html.trim() === "" ? (
				<div className="flex h-[720px] items-center justify-center rounded-xl border border-border-strong border-dashed bg-white text-body-sm text-secondary-foreground">
					The preview appears when you paste the HTML.
				</div>
			) : (
				<iframe
					className="h-[720px] w-full rounded-xl border border-border-strong bg-white"
					sandbox=""
					srcDoc={withoutPlaceholders(html)}
					title="Email preview"
				/>
			)}
		</div>
	);
}

/**
 * Paste the email, see it exactly as it will arrive, choose who gets it.
 * The HTML is written elsewhere (the "Copy prompt for Claude" brief keeps it
 * email-safe); this checks it and never changes it.
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

	const count = recipients.data?.count;
	const canSave =
		dirty &&
		appId !== "" &&
		htmlProblem(form.html) === null &&
		!create.isPending &&
		!save.isPending;
	const canSend =
		campaign !== undefined && !dirty && campaign.tested && (count ?? 0) > 0;

	return (
		<div className="grid gap-8 lg:grid-cols-2">
			<form
				className="flex flex-col gap-5"
				onSubmit={(event) => {
					event.preventDefault();
					const payload = { ...form, appId };
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
							placeholder="Smart Upsells launch"
							required
							value={form.name}
						/>
					)}
				</Field>
				<div className="grid gap-5 sm:grid-cols-2">
					<Field
						hint={
							configured.length === 0
								? "Save a sender for an app on the Apps page first."
								: undefined
						}
						label="App"
					>
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
							placeholder="Smart Upsells just landed in Edge Cart"
							required
							value={form.subject}
						/>
					)}
				</Field>
				<Field
					hint="The line inboxes show beside the subject."
					label="Preview text"
				>
					{(id) => (
						<input
							className={FIELD}
							id={id}
							onChange={(event) => update({ preheader: event.target.value })}
							placeholder="Upsells that change with what's in the cart."
							value={form.preheader}
						/>
					)}
				</Field>

				<HtmlField
					app={app ? { logoUrl: app.identity.logoUrl, name: app.name } : null}
					onChange={(html) => update({ html })}
					value={form.html}
				/>

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
						disabled={!canSave}
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

			<EmailPreview html={form.html} subject={form.subject} />

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
