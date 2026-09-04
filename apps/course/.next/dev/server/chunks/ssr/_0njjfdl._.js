module.exports = [
"[project]/packages/db/src/schema/_shared.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "currencyCode",
    ()=>currencyCode,
    "moneyMinor",
    ()=>moneyMinor,
    "timestamps",
    ()=>timestamps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$bigint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.45.2+a088e4a2fd6d6505/node_modules/drizzle-orm/pg-core/columns/bigint.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.45.2+a088e4a2fd6d6505/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.45.2+a088e4a2fd6d6505/node_modules/drizzle-orm/pg-core/columns/varchar.js [app-rsc] (ecmascript)");
;
const moneyMinor = (name)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$bigint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["bigint"])(name, {
        mode: "bigint"
    }).notNull();
const currencyCode = (name = "currency")=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$varchar$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["varchar"])(name, {
        length: 3
    }).notNull();
const timestamps = {
    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])("created_at").defaultNow().notNull(),
    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])("updated_at").defaultNow().$onUpdate(()=>/* @__PURE__ */ new Date()).notNull()
};
}),
"[project]/packages/db/src/schema/course-leads.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "courseLeads",
    ()=>courseLeads
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.45.2+a088e4a2fd6d6505/node_modules/drizzle-orm/pg-core/indexes.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.45.2+a088e4a2fd6d6505/node_modules/drizzle-orm/pg-core/table.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.45.2+a088e4a2fd6d6505/node_modules/drizzle-orm/pg-core/columns/text.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.45.2+a088e4a2fd6d6505/node_modules/drizzle-orm/pg-core/columns/timestamp.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.45.2+a088e4a2fd6d6505/node_modules/drizzle-orm/pg-core/columns/uuid.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2f$_shared$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/db/src/schema/_shared.ts [app-rsc] (ecmascript)");
;
;
const courseLeads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$table$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["pgTable"])("course_leads", {
    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$uuid$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uuid"])("id").primaryKey().defaultRandom(),
    /**
		 * Lowercased and trimmed before insert — the unique constraint is only a
		 * dedup rule if the value is normalised first, exactly like merchant
		 * domains elsewhere in this schema.
		 */ email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("email").notNull().unique(),
    name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("name").notNull(),
    /** Stored as typed. Not normalised to E.164 — we do not know the country. */ phone: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("phone").notNull(),
    /** Which page or campaign produced the lead, for attribution later. */ source: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["text"])("source").default("course-landing").notNull(),
    /**
		 * Set when access has actually been delivered. Null means the person is
		 * still waiting — this column is the difference between "we captured a
		 * lead" and "we kept our promise", and it is the one to alert on.
		 */ accessSentAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$columns$2f$timestamp$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamp"])("access_sent_at"),
    ...__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2f$_shared$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["timestamps"]
}, (table)=>[
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["index"])("course_leads_created_at_idx").on(table.createdAt),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$pg$2d$core$2f$indexes$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["index"])("course_leads_access_sent_at_idx").on(table.accessSentAt)
    ]);
}),
"[project]/apps/course/src/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getDb",
    ()=>getDb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2f$course$2d$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/db/src/schema/course-leads.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.45.2+a088e4a2fd6d6505/node_modules/drizzle-orm/node-postgres/driver.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$bun$2f$pg$40$8$2e$22$2e$0$2b$51226add061828f6$2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/.bun/pg@8.22.0+51226add061828f6/node_modules/pg)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$bun$2f$pg$40$8$2e$22$2e$0$2b$51226add061828f6$2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$bun$2f$pg$40$8$2e$22$2e$0$2b$51226add061828f6$2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
/**
 * The course site's OWN database client.
 *
 * It deliberately does NOT import `@edgecoms/db`'s root export. That module
 * pulls in `@edgecoms/env/server`, which requires `BETTER_AUTH_SECRET`,
 * `BETTER_AUTH_URL` and `CORS_ORIGIN` — the money platform's secrets. A public
 * marketing site on a different domain has no business holding those, and a
 * deploy that needs them just to save a name and an email is a deploy that will
 * eventually be given them.
 *
 * So only the table definition is imported (it depends on nothing but Drizzle),
 * and the connection is opened here from a single variable.
 */ const globalForDb = globalThis;
function getDb() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        return null;
    }
    // Cached UNCONDITIONALLY, in production as well as in dev.
    //
    // The familiar "only cache outside production" idiom exists to survive HMR,
    // and copying it here would have been a serious bug rather than a style
    // choice: this module is only ever reached from a server action, so an
    // uncached getDb() opens a brand new pool of `max` connections on every
    // single form submission and never closes any of them. Postgres starts
    // refusing connections under very ordinary traffic. Caching in dev too
    // keeps HMR from leaking pools for the same reason.
    const pool = globalForDb.coursePool ?? new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$bun$2f$pg$40$8$2e$22$2e$0$2b$51226add061828f6$2f$node_modules$2f$pg$29$__["Pool"]({
        connectionString,
        max: 5
    });
    globalForDb.coursePool = pool;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$node$2d$postgres$2f$driver$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["drizzle"])(pool, {
        schema: {
            courseLeads: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2f$course$2d$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["courseLeads"]
        }
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/course/src/lib/lead-schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "leadSchema",
    ()=>leadSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/zod@4.4.3/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>");
;
const leadSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Enter your email address").max(254, "That email address is too long").email("That does not look like an email address").transform((value)=>value.toLowerCase()),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Enter your name").max(120, "That name is too long"),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Enter your phone number").max(32, "That phone number is too long").refine((value)=>(value.match(/\d/g) ?? []).length >= 6, "Enter a phone number we can reach you on"),
    /** Honeypot. Real people never see this field, so a filled one is a bot. */ website: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(0).optional()
});
}),
"[project]/apps/course/src/app/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"60c5921e899291b4198cb29bbf22227cf76b2b0523":{"name":"submitLead"}},"apps/course/src/app/actions.ts",""] */ __turbopack_context__.s([
    "submitLead",
    ()=>submitLead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2f$course$2d$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/db/src/schema/course-leads.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/drizzle-orm@0.45.2+a088e4a2fd6d6505/node_modules/drizzle-orm/sql/sql.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$lead$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/lead-schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
/** Shown whenever we cannot store the lead. Never a fake success. */ const FALLBACK_CONTACT = "hello@edgecoms.com";
async function submitLead(_previous, formData) {
    const raw = {
        email: String(formData.get("email") ?? ""),
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        website: String(formData.get("website") ?? "")
    };
    // Echoed back on every failure so the form can be re-populated. React 19
    // resets an uncontrolled form on submit whatever the outcome, so without
    // this a rejected submission hands the visitor three empty boxes and an
    // error message about the one they got wrong.
    const values = {
        email: raw.email,
        name: raw.name,
        phone: raw.phone
    };
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$lead$2d$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["leadSchema"].safeParse(raw);
    if (!parsed.success) {
        const fieldErrors = {};
        for (const issue of parsed.error.issues){
            const field = issue.path[0];
            if (field === "email" || field === "name" || field === "phone") {
                fieldErrors[field] ??= issue.message;
            }
        }
        // A filled honeypot produces no field error, because the field is hidden
        // and there is nothing to point at. Answer as though it worked: a bot
        // that is told it failed simply tries again.
        if (Object.keys(fieldErrors).length === 0) {
            return {
                message: "Thanks — check your inbox.",
                status: "success"
            };
        }
        return {
            fieldErrors,
            message: "Please check the highlighted fields.",
            status: "error",
            values
        };
    }
    const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDb"])();
    if (!db) {
        // Unconfigured deploy. Loud in the server log, honest in the browser.
        console.error("[course] DATABASE_URL is not set — a signup could not be stored.");
        return {
            message: `Something went wrong on our end and we could not save your details. Please email ${FALLBACK_CONTACT} and we will send your access manually.`,
            status: "error",
            values
        };
    }
    try {
        await db.insert(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2f$course$2d$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["courseLeads"]).values({
            email: parsed.data.email,
            name: parsed.data.name,
            phone: parsed.data.phone,
            source: "course-landing"
        }).onConflictDoUpdate({
            set: {
                name: parsed.data.name,
                phone: parsed.data.phone,
                updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$drizzle$2d$orm$40$0$2e$45$2e$2$2b$a088e4a2fd6d6505$2f$node_modules$2f$drizzle$2d$orm$2f$sql$2f$sql$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sql"]`now()`
            },
            target: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$db$2f$src$2f$schema$2f$course$2d$leads$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["courseLeads"].email
        });
    } catch (error) {
        console.error("[course] Failed to store signup:", error);
        return {
            message: `Something went wrong on our end and we could not save your details. Please email ${FALLBACK_CONTACT} and we will send your access manually.`,
            status: "error",
            values
        };
    }
    return {
        message: "You're in. We'll send your access link to that email shortly — check your spam folder if it hasn't arrived within a few minutes.",
        status: "success"
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    submitLead
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitLead, "60c5921e899291b4198cb29bbf22227cf76b2b0523", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/course/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/course/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/app/actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/apps/course/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/course/src/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "60c5921e899291b4198cb29bbf22227cf76b2b0523",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["submitLead"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/course/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/course/src/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/app/actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=_0njjfdl._.js.map