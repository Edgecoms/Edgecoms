"use client";

import type { MailAudience } from "@edgecoms/db/schema/mail";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { useId } from "react";
import { FIELD } from "./shared";

const STATUSES = [
	["installed", "Installed"],
	["active", "Active"],
	["inactive", "Inactive"],
] as const;

type Status = (typeof STATUSES)[number][0];

function days(value: string): number | undefined {
	const parsed = Number.parseInt(value, 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/**
 * The audience as a few structured choices, not a query builder. Every one
 * narrows. Opt-in and suppression are applied by the server on top of all of
 * it and cannot be switched off here.
 */
export function AudienceFields({
	audience,
	onChange,
	otherApps,
}: {
	audience: MailAudience;
	onChange: (next: MailAudience) => void;
	otherApps: { name: string; slug: string }[];
}) {
	const id = useId();
	const winback = audience.uninstalledWithinDays !== undefined;
	const statuses = audience.installStatuses ?? ["installed", "active"];

	function toggleStatus(status: Status, on: boolean) {
		const next = on
			? [...statuses.filter((value) => value !== status), status]
			: statuses.filter((value) => value !== status);
		onChange({
			...audience,
			installStatuses: next.length > 0 ? next : undefined,
		});
	}

	function toggleApp(slug: string, on: boolean) {
		const current = audience.notInstalledAppSlugs ?? [];
		const next = on
			? [...current, slug]
			: current.filter((value) => value !== slug);
		onChange({
			...audience,
			notInstalledAppSlugs: next.length > 0 ? next : undefined,
		});
	}

	return (
		<fieldset className="flex flex-col gap-4">
			<legend className="pb-2 font-medium text-body text-primary-foreground">
				Audience
			</legend>

			<div className="flex flex-col gap-2">
				<Label htmlFor={`${id}-winback`}>Uninstalled within (days)</Label>
				<Input
					className={FIELD}
					id={`${id}-winback`}
					min={1}
					onChange={(event) =>
						onChange({
							...audience,
							uninstalledWithinDays: days(event.target.value),
						})
					}
					placeholder="Leave empty unless this is a winback"
					type="number"
					value={audience.uninstalledWithinDays ?? ""}
				/>
			</div>

			{winback ? null : (
				<div className="flex flex-col gap-2">
					<span className="text-body-sm text-primary-foreground">
						Install status
					</span>
					<div className="flex flex-wrap gap-4">
						{STATUSES.map(([status, label]) => (
							<label
								className="flex items-center gap-2 text-body-sm"
								key={status}
							>
								<input
									checked={statuses.includes(status)}
									onChange={(event) =>
										toggleStatus(status, event.target.checked)
									}
									type="checkbox"
								/>
								{label}
							</label>
						))}
					</div>
				</div>
			)}

			<div className="flex flex-col gap-2">
				<Label htmlFor={`${id}-plans`}>
					Plans (comma separated, empty for any)
				</Label>
				<Input
					className={FIELD}
					defaultValue={(audience.plans ?? []).join(", ")}
					id={`${id}-plans`}
					onChange={(event) => {
						const plans = event.target.value
							.split(",")
							.map((plan) => plan.trim())
							.filter((plan) => plan !== "");
						onChange({
							...audience,
							plans: plans.length > 0 ? plans : undefined,
						});
					}}
					placeholder="free, pro"
					type="text"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={`${id}-active`}>Active within (days)</Label>
				<Input
					className={FIELD}
					id={`${id}-active`}
					min={1}
					onChange={(event) =>
						onChange({
							...audience,
							activeWithinDays: days(event.target.value),
						})
					}
					placeholder="Any"
					type="number"
					value={audience.activeWithinDays ?? ""}
				/>
			</div>

			{otherApps.length > 0 ? (
				<div className="flex flex-col gap-2">
					<span className="text-body-sm text-primary-foreground">
						Only stores that do NOT have
					</span>
					<div className="flex flex-wrap gap-4">
						{otherApps.map((app) => (
							<label
								className="flex items-center gap-2 text-body-sm"
								key={app.slug}
							>
								<input
									checked={(audience.notInstalledAppSlugs ?? []).includes(
										app.slug
									)}
									onChange={(event) =>
										toggleApp(app.slug, event.target.checked)
									}
									type="checkbox"
								/>
								{app.name}
							</label>
						))}
					</div>
				</div>
			) : null}
		</fieldset>
	);
}
