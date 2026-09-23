"use client";

import { Toaster } from "@edgecoms/ui/components/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { queryClient } from "@/utils/trpc";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<Toaster richColors />
		</QueryClientProvider>
	);
}
