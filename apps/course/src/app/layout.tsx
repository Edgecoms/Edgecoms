import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { SITE_DESCRIPTION, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

/* One family, used from the 72px hero down to the 12px legal line. The design
   leans on weight and size for hierarchy rather than a second typeface. */
const inter = Inter({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	alternates: { canonical: "/" },
	description: SITE_DESCRIPTION,
	metadataBase: new URL(SITE_URL),
	openGraph: {
		description: SITE_DESCRIPTION,
		locale: "en_US",
		title: SITE_TAGLINE,
		type: "website",
		url: SITE_URL,
	},
	robots: { follow: true, index: true },
	title: SITE_TAGLINE,
	twitter: {
		card: "summary_large_image",
		description: SITE_DESCRIPTION,
		title: SITE_TAGLINE,
	},
};

/* The page is dark end to end, so the browser chrome should be too — otherwise
   iOS Safari draws a white bar above a black page on overscroll. */
export const viewport: Viewport = {
	themeColor: "#050505",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html className={inter.variable} lang="en">
			<body className="font-sans antialiased">{children}</body>
		</html>
	);
}
