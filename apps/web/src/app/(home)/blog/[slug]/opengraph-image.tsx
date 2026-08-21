import { ImageResponse } from "next/og";
import { getBlogApps, getPost } from "@/lib/blog";

/**
 * The social card for a post or a cluster hub.
 *
 * Same language as the site-wide card in `app/opengraph-image.tsx` — white,
 * dot grid, typographic — with a warm wash in the brand orange so a blog unfurl
 * is recognisably ours without being a different design. No custom font is
 * loaded: satori cannot read the WOFF2 files the site ships, and a card that
 * renders in the system sans beats one that fails to render at all.
 */

export const alt = "Edgecoms";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams(): { slug: string }[] {
	return [];
}

export default async function BlogOpengraphImage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = getPost(slug);
	const product = post
		? post.product
		: getBlogApps().find((app) => app.slug === slug);

	const eyebrow = product ? product.name : "Edgecoms";
	const heading = post ? post.title : `${eyebrow} articles`;

	return new ImageResponse(
		<div
			style={{
				alignItems: "flex-start",
				background: "#ffffff",
				backgroundImage:
					"radial-gradient(circle at 88% 6%, rgba(255,94,31,0.16), transparent 55%), radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)",
				backgroundSize: "100% 100%, 32px 32px",
				display: "flex",
				flexDirection: "column",
				height: "100%",
				justifyContent: "space-between",
				padding: "72px",
				width: "100%",
			}}
		>
			<div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
				<div
					style={{
						alignItems: "center",
						background: "#0a0a0a",
						borderRadius: "14px",
						color: "#ffffff",
						display: "flex",
						fontSize: "34px",
						fontWeight: 700,
						height: "64px",
						justifyContent: "center",
						width: "64px",
					}}
				>
					E
				</div>
				<div style={{ color: "#0a0a0a", fontSize: "36px", fontWeight: 600 }}>
					Edgecoms
				</div>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
				<div
					style={{
						color: "#ff5e1f",
						display: "flex",
						fontSize: "27px",
						fontWeight: 600,
					}}
				>
					{eyebrow}
				</div>
				<div
					style={{
						color: "#0a0a0a",
						display: "flex",
						fontSize: heading.length > 46 ? "58px" : "68px",
						fontWeight: 700,
						letterSpacing: "-0.03em",
						lineHeight: 1.08,
						maxWidth: "960px",
					}}
				>
					{heading}
				</div>
			</div>

			<div
				style={{
					borderTop: "1px solid #e5e7eb",
					color: "#737373",
					display: "flex",
					fontSize: "26px",
					paddingTop: "28px",
					width: "100%",
				}}
			>
				edgecoms.com/blog
			</div>
		</div>,
		size
	);
}
