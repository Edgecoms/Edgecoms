import Providers from "@/components/providers";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";

const interVariable = localFont({
	src: "../assets/fonts/InterVariable.woff2",
	display: "swap",
	variable: "--font-inter",
	weight: "100 900",
});
const satoshiVariable = localFont({
	src: "../assets/fonts/Satoshi-Regular.woff2",
	display: "swap",
	variable: "--font-satoshi",
	weight: "400",
});
const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

/** Internal tool: never indexed, whatever the route. */
export const metadata: Metadata = {
	title: { default: "Edge Mail", template: "%s · Edge Mail" },
	robots: { follow: false, index: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${interVariable.variable} ${satoshiVariable.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
