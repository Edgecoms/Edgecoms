"use client";

import { PortalHeader } from "@edgecoms/ui/components/portal";
import { Composer } from "../composer";

export default function NewCampaignPage() {
	return (
		<div className="flex flex-col gap-6">
			<PortalHeader
				description="Save a draft first. Then send yourself a test, then send."
				title="New campaign"
			/>
			<Composer />
		</div>
	);
}
