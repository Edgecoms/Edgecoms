"use client";

import { Button } from "@edgecoms/ui/components/button";
import { Input } from "@edgecoms/ui/components/input";
import { Label } from "@edgecoms/ui/components/label";
import { Textarea } from "@edgecoms/ui/components/textarea";
import { useMutation } from "@tanstack/react-query";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { type FormEvent, useId } from "react";
import { toast } from "sonner";
import { PortalHeader } from "@/components/portal/ui";
import { EDGE_PRODUCTS } from "@/lib/products";
import { queryClient, trpc } from "@/utils/trpc";

export default function RegisterMerchantPage() {
	const router = useRouter();
	const nameId = useId();
	const urlId = useId();
	const emailId = useId();
	const notesId = useId();

	const registerMutation = useMutation(
		trpc.partner.merchants.register.mutationOptions()
	);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		registerMutation.mutate(
			{
				name: String(form.get("name")),
				storeUrl: String(form.get("storeUrl")),
				email: String(form.get("email") ?? ""),
				appsInstalled: form.getAll("appsInstalled").map(String),
				notes: String(form.get("notes") ?? ""),
			},
			{
				onSuccess: () => {
					toast.success("Merchant registered — pending review.");
					queryClient.invalidateQueries({
						queryKey: trpc.partner.merchants.list.queryKey(),
					});
					queryClient.invalidateQueries({
						queryKey: trpc.partner.dashboard.queryKey(),
					});
					router.push("/partner/merchants" as Route);
				},
				onError: (error) => toast.error(error.message),
			}
		);
	}

	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-8">
			<PortalHeader
				description="Register a Shopify store you manage. We normalize the store domain and submit it for approval."
				title="Register a merchant"
			/>

			<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-2">
					<Label htmlFor={nameId}>Merchant name</Label>
					<Input id={nameId} name="name" placeholder="Acme Co." required />
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor={urlId}>Store URL</Label>
					<Input
						id={urlId}
						name="storeUrl"
						placeholder="acme.myshopify.com"
						required
					/>
					<span className="text-caption text-secondary-foreground">
						The store's myshopify domain. We'll normalize it before saving.
					</span>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor={emailId}>Merchant email</Label>
					<Input
						id={emailId}
						name="email"
						placeholder="owner@acme.com"
						type="email"
					/>
				</div>

				<fieldset className="flex flex-col gap-3">
					<legend className="text-xs">Apps installed</legend>
					<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
						{EDGE_PRODUCTS.map((product) => (
							<label
								className="flex items-center gap-2 text-body-sm text-secondary-foreground"
								key={product.slug}
							>
								<input
									className="size-4 accent-primary"
									name="appsInstalled"
									type="checkbox"
									value={product.name}
								/>
								{product.name}
							</label>
						))}
					</div>
				</fieldset>

				<div className="flex flex-col gap-2">
					<Label htmlFor={notesId}>Notes</Label>
					<Textarea
						id={notesId}
						name="notes"
						placeholder="Anything we should know about this merchant…"
						rows={4}
					/>
				</div>

				<div className="flex items-center gap-3">
					<Button
						disabled={registerMutation.isPending}
						size="xl"
						type="submit"
						variant="primary"
					>
						{registerMutation.isPending ? "Registering…" : "Register merchant"}
					</Button>
				</div>
			</form>
		</div>
	);
}
