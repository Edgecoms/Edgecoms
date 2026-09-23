import { handle } from "hono/vercel";
import { api } from "@/server/api";

/** Every /api route is Hono's; see src/server/api.ts. */
export const GET = handle(api);
export const POST = handle(api);
