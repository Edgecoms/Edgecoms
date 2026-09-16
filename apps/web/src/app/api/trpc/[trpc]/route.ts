import { createContext } from "@edgecoms/api/context";
import { appRouter } from "@edgecoms/api/routers/index";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { sendPartnerEmail } from "@/lib/partner-mail";

function handler(req: NextRequest) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createContext(req, sendPartnerEmail),
	});
}

export { handler as GET, handler as POST };
