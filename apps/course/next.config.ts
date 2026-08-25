import type { NextConfig } from "next";

/**
 * The course site is a SEPARATE DEPLOYMENT on its own domain.
 *
 * It deliberately shares nothing with `apps/web` beyond the monorepo tooling —
 * no `@edgecoms/ui`, no Edge nav or footer, no Edge design tokens. The two sites
 * have different audiences and different brands, and coupling them would mean a
 * change to the Edge design system silently restyling a sales page on another
 * domain.
 */
const nextConfig: NextConfig = {
	reactCompiler: true,
	typedRoutes: true,
};

export default nextConfig;
