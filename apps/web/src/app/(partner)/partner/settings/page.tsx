"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { Skeleton } from "@edgecoms/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { PortalHeader, StatusBadge } from "@/components/portal/ui";
import { queryClient, trpc } from "@/utils/trpc";

/**
 * Two forms, deliberately separate.
 *
 * Getting a company name wrong is cosmetic. Getting an account number wrong
 * sends money to a stranger, so the payout destination submits on its own, is
 * validated field by field, and tells the partner in plain words when it is not
 * yet payable.
 */

/**
 * A short list of countries, with the rest reachable by typing a code.
 *
 * India first because that is where most partners and the business itself are.
 * Not an exhaustive list on purpose: a select of 200 countries is worse to use
 * than five buttons and a free field, and the server validates the code either
 * way.
 */
const COMMON_COUNTRIES = [
	["IN", "India"],
	["US", "United States"],
	["GB", "United Kingdom"],
	["DE", "Germany"],
	["CA", "Canada"],
	["AE", "UAE"],
] as const;

/** Where the money goes. Country first, then the fields that country uses. */
function PayoutDetailsForm({
	country,
	data,
	onCountry,
	onSubmit,
	pending,
}: {
	country: string;
	data: {
		payoutAccountName: string | null;
		payoutAccountNumber: string | null;
		payoutBlocker: string | null;
		payoutCountry: string | null;
		payoutIfsc: string | null;
	};
	onCountry: (value: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	pending: boolean;
}) {
	const nameId = useId();
	const accountId = useId();
	const ifscId = useId();
	const countryId = useId();
	const domestic = country === "IN";

	return (
		<form
			className="flex flex-col gap-6 rounded-xl border border-border-strong bg-surface p-5 shadow-sm"
			onSubmit={onSubmit}
		>
			<div className="flex flex-col gap-1">
				<h2 className="font-medium text-h3 text-primary-foreground">
					Where your money goes
				</h2>
				{data.payoutBlocker ? (
					<p className="text-amber-700 text-body-sm">
						Not payable yet: {data.payoutBlocker}. We cannot pay you until this
						is set.
					</p>
				) : (
					<p className="text-body-sm text-secondary-foreground">
						On file and payable. Commission and bonuses go here.
					</p>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<span className="text-body-sm text-primary-foreground">
					Which country is your bank in?
				</span>
				<div className="flex flex-wrap gap-2">
					{COMMON_COUNTRIES.map(([code, label]) => (
						<Button
							key={code}
							onClick={() => onCountry(code)}
							size="md"
							type="button"
							variant={country === code ? "primary" : "secondary"}
						>
							{label}
						</Button>
					))}
				</div>
				<div className="flex items-center gap-2">
					<Label className="text-caption" htmlFor={countryId}>
						Somewhere else
					</Label>
					<Input
						className="w-20"
						id={countryId}
						maxLength={2}
						onChange={(event) =>
							onCountry(event.currentTarget.value.toUpperCase())
						}
						placeholder="JP"
						value={
							COMMON_COUNTRIES.some(([code]) => code === country) ? "" : country
						}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={nameId}>Account holder name</Label>
				<Input
					defaultValue={data.payoutAccountName ?? ""}
					id={nameId}
					name="accountName"
					placeholder="As it appears on the account"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor={accountId}>
					{domestic ? "Account number" : "IBAN or account number"}
				</Label>
				<Input
					defaultValue={data.payoutAccountNumber ?? ""}
					id={accountId}
					name="accountNumber"
					placeholder={domestic ? "9 to 18 digits" : "IBAN"}
				/>
			</div>

			{domestic ? (
				<div className="flex flex-col gap-2">
					<Label htmlFor={ifscId}>IFSC</Label>
					<Input
						defaultValue={data.payoutIfsc ?? ""}
						id={ifscId}
						name="ifsc"
						placeholder="HDFC0001234"
					/>
					<span className="text-caption text-secondary-foreground">
						Eleven characters. The fifth is always a zero.
					</span>
				</div>
			) : (
				<span className="text-caption text-secondary-foreground">
					Payments outside India are an outward remittance: they take longer and
					carry their own bank charges.
				</span>
			)}

			<div>
				<Button disabled={pending} size="xl" type="submit" variant="primary">
					{pending ? "Saving…" : "Save payout details"}
				</Button>
			</div>
		</form>
	);
}

export default function PartnerSettingsPage() {
	const companyId = useId();
	const websiteId = useId();

	const { data, isLoading } = useQuery(
		trpc.partner.settings.get.queryOptions()
	);
	const updateMutation = useMutation(
		trpc.partner.settings.update.mutationOptions()
	);
	const payoutMutation = useMutation(
		trpc.partner.settings.setPayoutDetails.mutationOptions()
	);

	/**
	 * Country first. The rest of the form follows from it, so the partner
	 * answers the thing we need rather than classifying themselves into a
	 * remittance route they should not have to know about.
	 */
	const [chosenCountry, setChosenCountry] = useState<string | null>(null);
	const country = chosenCountry ?? data?.payoutCountry ?? "IN";

	function refresh() {
		queryClient.invalidateQueries({
			queryKey: trpc.partner.settings.get.queryKey(),
		});
		queryClient.invalidateQueries({
			queryKey: trpc.partner.onboarding.queryKey(),
		});
	}

	function handleProfile(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		updateMutation.mutate(
			{
				companyName: String(form.get("companyName") ?? ""),
				website: String(form.get("website") ?? ""),
			},
			{
				onError: (error) => toast.error(error.message),
				onSuccess: () => {
					toast.success("Profile saved.");
					refresh();
				},
			}
		);
	}

	function handlePayout(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);

		payoutMutation.mutate(
			{
				accountName: String(form.get("accountName") ?? "").trim(),
				accountNumber: String(form.get("accountNumber") ?? "").trim(),
				country,
				/* Sent regardless; the server ignores it outside India. */
				ifsc: String(form.get("ifsc") ?? "").trim() || undefined,
			},
			{
				onError: (error) => toast.error(error.message),
				onSuccess: () => {
					toast.success("Payout details saved.");
					refresh();
				},
			}
		);
	}

	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-8">
			<PortalHeader
				description="Your company profile, and where your money goes."
				title="Settings"
			/>

			{isLoading || !data ? (
				<Skeleton className="h-72 w-full rounded-xl" />
			) : (
				<>
					<div className="flex flex-wrap items-center gap-6 rounded-xl border border-border-strong bg-surface p-5 shadow-sm">
						<div className="flex flex-col gap-1">
							<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
								Account status
							</span>
							<StatusBadge status={data.status} />
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-medium font-mono text-[11px] text-secondary-foreground uppercase tracking-[0.08em]">
								Commission rate
							</span>
							<span className="font-medium text-body text-primary-foreground tabular-nums">
								{(data.defaultRateBps / 100).toFixed(2)}%
							</span>
						</div>
					</div>

					<form className="flex flex-col gap-6" onSubmit={handleProfile}>
						<h2 className="font-medium text-h3 text-primary-foreground">
							Profile
						</h2>
						<div className="flex flex-col gap-2">
							<Label htmlFor={companyId}>Company name</Label>
							<Input
								defaultValue={data.companyName ?? ""}
								id={companyId}
								name="companyName"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor={websiteId}>Website</Label>
							<Input
								defaultValue={data.website ?? ""}
								id={websiteId}
								name="website"
								placeholder="https://"
							/>
						</div>
						<div>
							<Button
								disabled={updateMutation.isPending}
								size="xl"
								type="submit"
								variant="primary"
							>
								{updateMutation.isPending ? "Saving…" : "Save profile"}
							</Button>
						</div>
					</form>

					<PayoutDetailsForm
						country={country}
						data={data}
						onCountry={setChosenCountry}
						onSubmit={handlePayout}
						pending={payoutMutation.isPending}
					/>
				</>
			)}
		</div>
	);
}
