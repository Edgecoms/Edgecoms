import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	/** There is no dashboard: Campaigns is the home screen. */
	redirects: () =>
		Promise.resolve([
			{ destination: "/campaigns", permanent: false, source: "/" },
		]),
};

export default nextConfig;
