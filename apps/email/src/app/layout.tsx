import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "@/components/providers";
import "./globals.css";

/** Internal tool: never indexed, whatever the route. */
export const metadata: Metadata = {
	title: { default: "Edge Mail", template: "%s · Edge Mail" },
	robots: { follow: false, index: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className="antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
