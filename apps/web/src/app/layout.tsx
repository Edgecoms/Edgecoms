import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import Providers from "@/components/providers";
import "../index.css";

const interVariable = localFont({
	src: "../assets/fonts/InterVariable.woff2",
	display: "swap",
	variable: "--font-inter",
	style: "normal",
});
const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Edge — Your edge starts here",
		template: "%s",
	},
	description:
		"Edge is a Shopify growth platform: a suite of thoughtfully crafted apps and a partner program that pays recurring commission on the merchants you bring.",
	applicationName: "Edge",
	openGraph: {
		title: "Edge — Your edge starts here",
		description:
			"A Shopify growth platform and a partner program that pays recurring commission.",
		siteName: "Edge",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${interVariable.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
