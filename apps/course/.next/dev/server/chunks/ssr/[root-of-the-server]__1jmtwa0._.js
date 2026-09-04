module.exports = [
"[next]/internal/font/google/inter_4124bfd4.module.css [app-rsc] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "inter_4124bfd4-module__dGlmfG__className",
  "variable": "inter_4124bfd4-module__dGlmfG__variable",
});
}),
"[next]/internal/font/google/inter_4124bfd4.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_4124bfd4$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_4124bfd4.module.css [app-rsc] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_4124bfd4$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Inter', 'Inter Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_4124bfd4$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_4124bfd4$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/apps/course/src/lib/site.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Site-wide constants for the course domain.
 *
 * TODO(launch): set `NEXT_PUBLIC_SITE_URL` to the real domain on the deploy.
 * The fallback below is a placeholder and must not ship as a canonical — a
 * canonical pointing at the wrong host tells Google the real page is a copy.
 */ __turbopack_context__.s([
    "COURSE_NAME",
    ()=>COURSE_NAME,
    "SITE_DESCRIPTION",
    ()=>SITE_DESCRIPTION,
    "SITE_TAGLINE",
    ()=>SITE_TAGLINE,
    "SITE_URL",
    ()=>SITE_URL,
    "absoluteUrl",
    ()=>absoluteUrl
]);
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://course.edgecoms.com").replace(/\/$/, "");
const COURSE_NAME = "The Edge Growth Course";
const SITE_TAGLINE = "Know what to work on next, and why";
const SITE_DESCRIPTION = "A free ten-module ecommerce growth course for beginners and growing stores. Customer research, offers, product pages, checkout, order value, traffic and retention — in plain English, in the order they matter.";
function absoluteUrl(path) {
    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
}),
"[project]/apps/course/src/app/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RootLayout,
    "metadata",
    ()=>metadata,
    "viewport",
    ()=>viewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_4124bfd4$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_4124bfd4.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/site.ts [app-rsc] (ecmascript)");
;
;
;
;
const metadata = {
    alternates: {
        canonical: "/"
    },
    description: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_DESCRIPTION"],
    metadataBase: new URL(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]),
    openGraph: {
        description: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_DESCRIPTION"],
        locale: "en_US",
        title: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_TAGLINE"],
        type: "website",
        url: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_URL"]
    },
    robots: {
        follow: true,
        index: true
    },
    title: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_TAGLINE"],
    twitter: {
        card: "summary_large_image",
        description: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_DESCRIPTION"],
        title: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_TAGLINE"]
    }
};
const viewport = {
    themeColor: "#050505"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_4124bfd4$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].variable,
        lang: "en",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: "font-sans antialiased",
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/course/src/app/layout.tsx",
            lineNumber: 44,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/app/layout.tsx",
        lineNumber: 43,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/course/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/course/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-rsc] (ecmascript)").vendored['react-rsc'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1jmtwa0._.js.map