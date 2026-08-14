import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import Providers from "@/components/providers";
import {
	jsonLdScriptProps,
	organizationSchema,
	SITE_NAME,
	SITE_URL,
	websiteSchema,
} from "@/lib/seo";
import "../index.css";

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

const DESCRIPTION =
	"Edge is a Shopify growth platform: a suite of thoughtfully crafted apps and a partner program that pays recurring commission on the merchants you bring.";

/**
 * Site-wide defaults. Every page inherits these and overrides only what it
 * needs, so nothing ships without an OG card or a canonical.
 *
 * `metadataBase` is what makes relative `alternates.canonical` and relative OG
 * image paths resolve to absolute URLs. Without it Next emits relative OG URLs,
 * which crawlers drop.
 */
export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Edge · Your edge starts here",
		template: `%s · ${SITE_NAME}`,
	},
	description: DESCRIPTION,
	applicationName: "Edge",
	alternates: { canonical: "/" },
	keywords: [
		"Shopify apps",
		"average order value",
		"conversion rate optimisation",
		"product bundles",
		"cart upsell",
		"server-side tracking",
		"Shopify partner program",
	],
	authors: [{ name: SITE_NAME, url: SITE_URL }],
	creator: SITE_NAME,
	publisher: SITE_NAME,
	formatDetection: { address: false, email: false, telephone: false },
	openGraph: {
		title: "Edge · Your edge starts here",
		description: DESCRIPTION,
		siteName: SITE_NAME,
		type: "website",
		locale: "en_US",
		url: SITE_URL,
	},
	twitter: {
		card: "summary_large_image",
		title: "Edge · Your edge starts here",
		description: DESCRIPTION,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* Publisher identity, stated once for the whole site. Every other
				    JSON-LD block on the site references these two by @id rather than
				    restating them. */}
				<script {...jsonLdScriptProps(organizationSchema)} />
				<script {...jsonLdScriptProps(websiteSchema)} />
			</head>
			<body
				className={`${interVariable.variable} ${satoshiVariable.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
