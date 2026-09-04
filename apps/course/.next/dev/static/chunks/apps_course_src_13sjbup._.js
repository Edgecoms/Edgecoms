(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/course/src/lib/content.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * ALL COPY AND CONTENT FOR THE COURSE SITE, IN ONE FILE.
 *
 * Two rules carried over from the main marketing site, because they are worth
 * keeping and this deployment has no other guardrail:
 *
 * 1. PROSE NEVER STATES A HARD NUMBER. Figures render only through the
 *    structured fields below, so an unsourced claim cannot hide inside a
 *    paragraph where nobody thinks to check it.
 * 2. ANYTHING UNPROVEN IS FLAGGED. `provenance: "invented"` means a placeholder
 *    that must be replaced with something defensible or deleted before launch.
 *    A fabricated student result is a false-advertising claim, not filler.
 */ __turbopack_context__.s([
    "COURSE_AUDIENCE",
    ()=>COURSE_AUDIENCE,
    "COURSE_COMPARISON",
    ()=>COURSE_COMPARISON,
    "COURSE_FAQ",
    ()=>COURSE_FAQ,
    "COURSE_INCLUSIONS",
    ()=>COURSE_INCLUSIONS,
    "COURSE_MODULES",
    ()=>COURSE_MODULES,
    "COURSE_PAIN_POINTS",
    ()=>COURSE_PAIN_POINTS,
    "COURSE_STATS",
    ()=>COURSE_STATS,
    "CURRENT_PRICE",
    ()=>CURRENT_PRICE,
    "INSTRUCTOR_CREDENTIALS",
    ()=>INSTRUCTOR_CREDENTIALS,
    "LIST_PRICE",
    ()=>LIST_PRICE,
    "PRIVACY_NOTICE",
    ()=>PRIVACY_NOTICE,
    "PRIVACY_POLICY_HREF",
    ()=>PRIVACY_POLICY_HREF,
    "SHOW_STRUCK_PRICE",
    ()=>SHOW_STRUCK_PRICE,
    "SHOW_UNVERIFIED",
    ()=>SHOW_UNVERIFIED,
    "VISIBLE_STATS",
    ()=>VISIBLE_STATS,
    "publishable",
    ()=>publishable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const SHOW_UNVERIFIED = ("TURBOPACK compile-time value", "development") === "development";
function publishable(items) {
    return items.filter((item)=>item.provenance === "verified" || SHOW_UNVERIFIED);
}
const LIST_PRICE = "$499";
const SHOW_STRUCK_PRICE = true;
const CURRENT_PRICE = "Free";
const COURSE_STATS = [
    {
        label: "students enrolled",
        provenance: "invented",
        value: "300+"
    },
    {
        label: "modules, taught in sequence",
        provenance: "verified",
        value: "10"
    },
    {
        label: "hours of video",
        provenance: "invented",
        value: "12+"
    }
];
const VISIBLE_STATS = publishable(COURSE_STATS);
_c = VISIBLE_STATS;
const COURSE_MODULES = [
    {
        lessons: 5,
        summary: "Revenue per visitor is conversion rate times average order value. Learn to read your own store as that equation, so every decision after this one has a number attached to it.",
        title: "The revenue equation"
    },
    {
        lessons: 4,
        summary: "Who actually buys from you, what they were trying to solve, and the words they use for it. Research you can finish in a week, not a quarter.",
        title: "Customer research that pays for itself"
    },
    {
        lessons: 5,
        summary: "What you sell, how it is packaged, and why the same product at the same price converts differently depending on how it is framed.",
        title: "Offer and positioning"
    },
    {
        lessons: 6,
        summary: "The page most of your traffic lands on and most of it leaves from. Structure, imagery, proof, objection handling, and the order they need to appear in.",
        title: "The product page"
    },
    {
        lessons: 5,
        summary: "Where the drop-off actually happens, how to measure it properly, and what to change first. Cart, shipping, payment, and the recovery flows behind them.",
        title: "Cart and checkout"
    },
    {
        lessons: 5,
        summary: "Bundles, volume tiers, and post-purchase offers. Raising what each buyer spends without touching the price of your hero product or training customers to wait for a discount.",
        title: "Raising average order value"
    },
    {
        lessons: 6,
        summary: "Paid acquisition without setting money on fire. Creative, testing structure, budget discipline, and knowing when a channel is genuinely done.",
        title: "Traffic that pays back"
    },
    {
        lessons: 6,
        summary: "Email, SMS, and subscriptions. Turning one purchase into a second, because the second one costs you nothing in ad spend.",
        title: "Retention and repeat revenue"
    },
    {
        lessons: 5,
        summary: "Attribution, cohorts, and holdouts. How to tell which of the last ten things you changed actually moved the number, and how to stop arguing about it.",
        title: "Measurement and attribution"
    },
    {
        lessons: 4,
        summary: "The operating cadence that keeps growth compounding: what to review weekly, what to leave alone, what to hire for, and what to automate.",
        title: "Scaling the system"
    }
];
const COURSE_INCLUSIONS = [
    {
        body: "Ten modules taught in sequence, each building on the equation from the first. Watch at your own pace, rewatch whenever.",
        emoji: "🎓",
        title: "The full video curriculum"
    },
    {
        body: "Real stores pulled apart on camera — what is working, what is leaking revenue, and what we would change first.",
        emoji: "🔍",
        title: "Store teardowns"
    },
    {
        body: "The spreadsheets we use ourselves: the revenue model, the offer canvas, the testing tracker, the retention audit.",
        emoji: "📊",
        title: "Templates and calculators"
    },
    {
        body: "A private space to ask questions, post your numbers, and get eyes on your store from people solving the same problems.",
        emoji: "💬",
        title: "Community access"
    },
    {
        body: "A live session every month to work through whatever is actually blocking people that month. Recorded if you cannot make it.",
        emoji: "🎥",
        title: "Monthly live Q&A"
    },
    {
        body: "Ecommerce moves. When a module goes out of date we refilm it, and you get the new version at no extra cost.",
        emoji: "♾️",
        title: "Lifetime updates"
    }
];
const COURSE_PAIN_POINTS = [
    "I do not know where to start, and every guide contradicts the last one",
    "I have watched hours of free videos and still cannot say what to do on Monday",
    "People visit my store and leave without buying, and I do not know why",
    "I am paying more for traffic every month and keeping less of it",
    "Customers buy once and I never hear from them again",
    "I cannot tell which of the things I changed actually made a difference",
    "I want one order to follow, not another list of tactics"
];
const COURSE_AUDIENCE = [
    {
        body: "Running a store that already sells, and wanting the next stage to come from something other than more ad spend.",
        title: "Store owners"
    },
    {
        body: "Selling growth work to clients and wanting one defensible framework behind every recommendation you make.",
        title: "Agencies and freelancers"
    },
    {
        body: "Owning the number internally, and needing to argue for changes with evidence rather than opinion.",
        title: "Marketing managers"
    },
    {
        body: "Comfortable shipping the change, less comfortable deciding which change is worth shipping.",
        title: "Developers moving into growth"
    },
    {
        body: "Early enough that the decisions are still cheap to make, and worth making in the right order.",
        title: "Founders pre-launch"
    },
    {
        body: "Anyone who would rather understand why something works than collect another folder of screenshots.",
        title: "Anyone tired of tactics"
    }
];
const COURSE_COMPARISON = {
    ours: [
        "Built from operating real stores, not from other courses",
        "Every tactic tied to a metric you can check yourself",
        "Real store teardowns, numbers included",
        "Refilmed when it goes out of date, free forever",
        "A live session every month with the people who made it"
    ],
    theirs: [
        "Recycled tactics repackaged every season",
        "Theory with no number attached to any of it",
        "Screenshots of somebody else's dashboard as proof",
        "Recorded once years ago and never touched again",
        "You are on your own the moment the payment clears"
    ]
};
const INSTRUCTOR_CREDENTIALS = [
    "We build and maintain a suite of Shopify apps used on live storefronts",
    "Our work is conversion rate and average order value, every day, on real stores",
    "We see what happens after the tactic ships, not just the case study screenshot",
    "Everything taught here is something we run ourselves before we recommend it",
    "When we do not know, we say so — and we tell you how to find out"
];
const COURSE_FAQ = [
    {
        answer: "Nothing. You give us your name, email and phone number, and we send you the access link. There is no card, no trial that converts into a charge, and nothing to cancel later.",
        question: "What's the catch? Why is it free?"
    },
    {
        answer: "Because we build Shopify apps, and the people who get value from this course tend to be exactly the people our apps are built for. Teaching the thinking first is a better introduction than an ad. You are never obliged to install anything.",
        question: "So what do you get out of it?"
    },
    {
        answer: "Your name, email and phone number, used to send you access and occasional updates about the course. We do not sell your details to anyone. You can unsubscribe from any email, and ask us to delete your record entirely, at any time.",
        question: "What will you do with my details?"
    },
    {
        answer: "We build and run Shopify apps used by real merchants, and we see the conversion and order-value data those stores produce. This course is the reasoning behind that work, written down in the order it is actually useful.",
        question: "Who is teaching it?"
    },
    {
        answer: "It is platform-agnostic in principle and Shopify-specific in the examples. The equation, the research, the offer design and the measurement all transfer. The click-by-click walkthroughs are filmed in Shopify.",
        question: "Do I need to be on Shopify?"
    },
    {
        answer: "None. If you have not launched, the early modules are the ones that decide whether your store works at all — research, offer, positioning, product page — and you will be making those decisions from a much better position than most people do. The measurement and paid traffic modules will be theory until you have visitors, and they will be waiting when you do.",
        question: "I have not launched yet. Is this still for me?"
    },
    {
        answer: "It should not be. Everything is in plain English, and where a term is unavoidable it gets defined the first time it appears. If you have run a store for a few years you will move faster through the first two modules, but the sequencing and the measurement material tend to be new to most people.",
        question: "Is it too basic if I already sell a bit, or too advanced if I don't?"
    },
    {
        answer: "It is self-paced and nothing expires, so it takes as long as you want it to. The modules are short enough to fit around a working day, and you can stop after the ones that apply to you and come back to the rest later.",
        question: "How long does it take?"
    },
    {
        answer: "Yes. Access does not expire and neither do the updates. When a module is refilmed you get the new version automatically.",
        question: "Is access really lifetime?"
    },
    {
        answer: "No. The course teaches the reasoning, and the reasoning applies whatever tools you use. Where an Edge app is the fastest way to implement something we will say so, and we will also tell you how to do it without one.",
        question: "Do I have to use Edge apps to apply this?"
    },
    {
        answer: "Yes, and it is a common way to use it. The templates and teardown format are built to be used on client stores, not just your own. Send your team the link.",
        question: "Can my whole team sign up?"
    }
];
const PRIVACY_POLICY_HREF = null;
const PRIVACY_NOTICE = "We use your name, email and phone only to send your course access and occasional updates about it. Your phone number is a fallback for when email bounces, which is the single most common reason access never arrives. We never sell your details or pass them to anyone else, and you can unsubscribe or ask us to delete your record at any time by replying to any email or writing to hello@edgecoms.com.";
var _c;
__turbopack_context__.k.register(_c, "VISIBLE_STATS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/course/src/components/ui.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Container",
    ()=>Container,
    "CtaButton",
    ()=>CtaButton,
    "CtaLink",
    ()=>CtaLink,
    "PriceTag",
    ()=>PriceTag,
    "Section",
    ()=>Section,
    "SectionHeading",
    ()=>SectionHeading,
    "cx",
    ()=>cx
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/content.ts [app-client] (ecmascript)");
;
;
;
function cx(...parts) {
    return parts.filter(Boolean).join(" ");
}
function Container(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b";
    }
    const { children, className, narrow: t1 } = t0;
    const narrow = t1 === undefined ? false : t1;
    const t2 = narrow ? "max-w-3xl" : "max-w-6xl";
    let t3;
    if ($[1] !== className || $[2] !== t2) {
        t3 = cx("mx-auto w-full px-5 sm:px-8", t2, className);
        $[1] = className;
        $[2] = t2;
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    let t4;
    if ($[4] !== children || $[5] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t3,
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 40,
            columnNumber: 10
        }, this);
        $[4] = children;
        $[5] = t3;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    return t4;
}
_c = Container;
function Section(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b";
    }
    const { children, className, id, tone: t1 } = t0;
    const tone = t1 === undefined ? "dark" : t1;
    let t2;
    if ($[1] !== className || $[2] !== tone) {
        const tones = {
            dark: "bg-ink text-paper",
            paper: "bg-paper text-ink [--color-focus:var(--color-ink)]",
            wash: "bg-accent-wash text-ink [--color-focus:var(--color-ink)]"
        };
        t2 = cx("w-full scroll-mt-24 py-16 sm:py-24", tones[tone], className);
        $[1] = className;
        $[2] = tone;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== children || $[5] !== id || $[6] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: t2,
            id: id,
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 87,
            columnNumber: 10
        }, this);
        $[4] = children;
        $[5] = id;
        $[6] = t2;
        $[7] = t3;
    } else {
        t3 = $[7];
    }
    return t3;
}
_c1 = Section;
function SectionHeading(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b";
    }
    const { eyebrow, lead, title, tone: t1 } = t0;
    const tone = t1 === undefined ? "dark" : t1;
    const isDark = tone === "dark";
    let t2;
    if ($[1] !== eyebrow || $[2] !== isDark) {
        t2 = eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: cx("font-semibold text-xs uppercase tracking-[0.18em]", isDark ? "text-accent" : "text-ink/60"),
            children: eyebrow
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 120,
            columnNumber: 20
        }, this) : null;
        $[1] = eyebrow;
        $[2] = isDark;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    let t3;
    if ($[4] !== title) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-balance font-bold text-section",
            children: title
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 129,
            columnNumber: 10
        }, this);
        $[4] = title;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    let t4;
    if ($[6] !== isDark || $[7] !== lead) {
        t4 = lead ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: cx("max-w-xl text-pretty text-base leading-relaxed sm:text-lg", isDark ? "text-muted" : "text-ink/60"),
            children: lead
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 137,
            columnNumber: 17
        }, this) : null;
        $[6] = isDark;
        $[7] = lead;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] !== t2 || $[10] !== t3 || $[11] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex max-w-2xl flex-col items-center gap-4 text-center",
            children: [
                t2,
                t3,
                t4
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 146,
            columnNumber: 10
        }, this);
        $[9] = t2;
        $[10] = t3;
        $[11] = t4;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    return t5;
}
_c2 = SectionHeading;
const CTA_BASE = "inline-flex items-center justify-center gap-2 rounded-[10px] px-6 font-bold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none";
const CTA_SIZES = {
    lg: "h-14 text-base sm:text-lg",
    md: "h-12 text-sm sm:text-base"
};
function CtaLink(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(17);
    if ($[0] !== "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b") {
        for(let $i = 0; $i < 17; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b";
    }
    let children;
    let className;
    let href;
    let props;
    let t1;
    let t2;
    if ($[1] !== t0) {
        ({ children, className, href, size: t1, variant: t2, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = href;
        $[5] = props;
        $[6] = t1;
        $[7] = t2;
    } else {
        children = $[2];
        className = $[3];
        href = $[4];
        props = $[5];
        t1 = $[6];
        t2 = $[7];
    }
    const size = t1 === undefined ? "lg" : t1;
    const variant = t2 === undefined ? "accent" : t2;
    let t3;
    if ($[8] !== className || $[9] !== size || $[10] !== variant) {
        const variants = {
            accent: "bg-accent text-accent-ink hover:bg-accent-dim",
            outline: "border border-ink-border bg-white/5 text-paper hover:bg-white/10"
        };
        t3 = cx(CTA_BASE, CTA_SIZES[size], variants[variant], className);
        $[8] = className;
        $[9] = size;
        $[10] = variant;
        $[11] = t3;
    } else {
        t3 = $[11];
    }
    let t4;
    if ($[12] !== children || $[13] !== href || $[14] !== props || $[15] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            className: t3,
            href: href,
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 219,
            columnNumber: 10
        }, this);
        $[12] = children;
        $[13] = href;
        $[14] = props;
        $[15] = t3;
        $[16] = t4;
    } else {
        t4 = $[16];
    }
    return t4;
}
_c3 = CtaLink;
function CtaButton(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(13);
    if ($[0] !== "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b") {
        for(let $i = 0; $i < 13; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b";
    }
    let children;
    let className;
    let props;
    let t1;
    if ($[1] !== t0) {
        ({ children, className, size: t1, ...props } = t0);
        $[1] = t0;
        $[2] = children;
        $[3] = className;
        $[4] = props;
        $[5] = t1;
    } else {
        children = $[2];
        className = $[3];
        props = $[4];
        t1 = $[5];
    }
    const size = t1 === undefined ? "lg" : t1;
    const t2 = CTA_SIZES[size];
    let t3;
    if ($[6] !== className || $[7] !== t2) {
        t3 = cx(CTA_BASE, t2, "bg-accent text-accent-ink hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-60", className);
        $[6] = className;
        $[7] = t2;
        $[8] = t3;
    } else {
        t3 = $[8];
    }
    let t4;
    if ($[9] !== children || $[10] !== props || $[11] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            className: t3,
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 273,
            columnNumber: 10
        }, this);
        $[9] = children;
        $[10] = props;
        $[11] = t3;
        $[12] = t4;
    } else {
        t4 = $[12];
    }
    return t4;
}
_c4 = CtaButton;
function PriceTag(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1963e740c476f26caa30997bb6ca81a95a5fc05df19c29cfd634aa2f602a403b";
    }
    const { className, currentClassName: t1, listClassName: t2 } = t0;
    const currentClassName = t1 === undefined ? "font-bold text-4xl text-accent" : t1;
    const listClassName = t2 === undefined ? "font-semibold text-2xl text-muted-dark line-through decoration-2" : t2;
    let t3;
    if ($[1] !== className) {
        t3 = cx("flex items-baseline gap-3", className);
        $[1] = className;
        $[2] = t3;
    } else {
        t3 = $[2];
    }
    let t4;
    if ($[3] !== listClassName) {
        t4 = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHOW_STRUCK_PRICE"] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            "aria-hidden": "true",
            className: listClassName,
            children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIST_PRICE"]
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 322,
            columnNumber: 30
        }, this) : null;
        $[3] = listClassName;
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    let t5;
    if ($[5] !== currentClassName) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: currentClassName,
            children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENT_PRICE"]
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 330,
            columnNumber: 10
        }, this);
        $[5] = currentClassName;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    let t6;
    if ($[7] !== t3 || $[8] !== t4 || $[9] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: t3,
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 338,
            columnNumber: 10
        }, this);
        $[7] = t3;
        $[8] = t4;
        $[9] = t5;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "sr-only",
            children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHOW_STRUCK_PRICE"] ? `Was ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIST_PRICE"]}. Now ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENT_PRICE"]}.` : `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENT_PRICE"]} while the course is in beta.`
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/ui.tsx",
            lineNumber: 348,
            columnNumber: 10
        }, this);
        $[11] = t7;
    } else {
        t7 = $[11];
    }
    let t8;
    if ($[12] !== t6) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t6,
                t7
            ]
        }, void 0, true);
        $[12] = t6;
        $[13] = t8;
    } else {
        t8 = $[13];
    }
    return t8;
}
_c5 = PriceTag;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "Container");
__turbopack_context__.k.register(_c1, "Section");
__turbopack_context__.k.register(_c2, "SectionHeading");
__turbopack_context__.k.register(_c3, "CtaLink");
__turbopack_context__.k.register(_c4, "CtaButton");
__turbopack_context__.k.register(_c5, "PriceTag");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/course/src/components/faq.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Faq",
    ()=>Faq
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/content.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Faq() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "0119e09ff4e51ef576d8cd55c480433127444a793fe4d0cdb54ccf5705541135") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0119e09ff4e51ef576d8cd55c480433127444a793fe4d0cdb54ccf5705541135";
    }
    const [openIndex, setOpenIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-balance text-center font-bold text-section",
            children: "Frequently asked questions"
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/faq.tsx",
            lineNumber: 21,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] !== openIndex) {
        t1 = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COURSE_FAQ"].map({
            "Faq[COURSE_FAQ.map()]": (item, index)=>{
                const isOpen = openIndex === index;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "aria-expanded": isOpen,
                            className: "flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-base text-ink transition-colors hover:text-ink/60",
                            onClick: {
                                "Faq[COURSE_FAQ.map() > <button>.onClick]": ()=>setOpenIndex(isOpen ? null : index)
                            }["Faq[COURSE_FAQ.map() > <button>.onClick]"],
                            type: "button",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: item.question
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/faq.tsx",
                                    lineNumber: 33,
                                    columnNumber: 72
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex size-6 shrink-0 items-center justify-center",
                                    children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                        "aria-hidden": "true",
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/faq.tsx",
                                        lineNumber: 33,
                                        columnNumber: 177
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        "aria-hidden": "true",
                                        className: "size-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/faq.tsx",
                                        lineNumber: 33,
                                        columnNumber: 227
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/faq.tsx",
                                    lineNumber: 33,
                                    columnNumber: 100
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/course/src/components/faq.tsx",
                            lineNumber: 31,
                            columnNumber: 41
                        }, this),
                        isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-pretty pb-5 text-ink/60 leading-relaxed",
                            children: item.answer
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/faq.tsx",
                            lineNumber: 33,
                            columnNumber: 300
                        }, this) : null
                    ]
                }, item.question, true, {
                    fileName: "[project]/apps/course/src/components/faq.tsx",
                    lineNumber: 31,
                    columnNumber: 16
                }, this);
            }
        }["Faq[COURSE_FAQ.map()]"]);
        $[2] = openIndex;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[4] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Section"], {
            id: "faq",
            tone: "paper",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
                narrow: true,
                children: [
                    t0,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-10 divide-y divide-ink/10 border-ink/10 border-t border-b",
                        children: t1
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/faq.tsx",
                        lineNumber: 43,
                        columnNumber: 70
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/components/faq.tsx",
                lineNumber: 43,
                columnNumber: 41
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/faq.tsx",
            lineNumber: 43,
            columnNumber: 10
        }, this);
        $[4] = t1;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    return t2;
}
_s(Faq, "6UZ+mnQ9sKC06YXeyhrfGXQCT10=");
_c = Faq;
var _c;
__turbopack_context__.k.register(_c, "Faq");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/course/src/components/primitives.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Reveal",
    ()=>Reveal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Reveal(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "c2a0b83fb7190cd087aa9df22e68bc747de8830c482718343c132a567d9fe145") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "c2a0b83fb7190cd087aa9df22e68bc747de8830c482718343c132a567d9fe145";
    }
    const { children, className } = t0;
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ({
            "Reveal[useEffect()]": ()=>{
                const el = ref.current;
                if (!el) {
                    return;
                }
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    return;
                }
                const observer = new IntersectionObserver((entries)=>{
                    for (const entry of entries){
                        if (entry.isIntersecting) {
                            el.dataset.reveal = "in";
                            observer.disconnect();
                        }
                    }
                }, {
                    rootMargin: "0px 0px -80px 0px",
                    threshold: 0.12
                });
                observer.observe(el);
                return ()=>observer.disconnect();
            }
        })["Reveal[useEffect()]"];
        t2 = [];
        $[1] = t1;
        $[2] = t2;
    } else {
        t1 = $[1];
        t2 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    if ($[3] !== children || $[4] !== className) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: className,
            "data-reveal": "",
            ref: ref,
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/primitives.tsx",
            lineNumber: 78,
            columnNumber: 10
        }, this);
        $[3] = children;
        $[4] = className;
        $[5] = t3;
    } else {
        t3 = $[5];
    }
    return t3;
}
_s(Reveal, "8uVE59eA/r6b92xF80p7sH8rXLk=");
_c = Reveal;
var _c;
__turbopack_context__.k.register(_c, "Reveal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/course/src/app/data:d8d4c9 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "submitLead",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"60c5921e899291b4198cb29bbf22227cf76b2b0523":{"name":"submitLead"}},"apps/course/src/app/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60c5921e899291b4198cb29bbf22227cf76b2b0523", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "submitLead");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/course/src/components/signup.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Signup",
    ()=>Signup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$data$3a$d8d4c9__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/course/src/app/data:d8d4c9 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/content.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const INITIAL = {
    status: "idle"
};
const FIELD_CLASS = "h-12 w-full rounded-[10px] border bg-white/5 px-4 text-paper text-base placeholder:text-muted-dark focus-visible:outline-none";
/** One field, with its label, error, and the wiring between them. */ function Field(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(23);
    if ($[0] !== "e3a518846fe503b8b67b41e715bf504fa22e351ce4832195116737385ef9f32a") {
        for(let $i = 0; $i < 23; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e3a518846fe503b8b67b41e715bf504fa22e351ce4832195116737385ef9f32a";
    }
    const { autoComplete, defaultValue, error, label, name, placeholder, type: t1 } = t0;
    const type = t1 === undefined ? "text" : t1;
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const errorId = `${id}-error`;
    let t2;
    if ($[1] !== id || $[2] !== label) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
            className: "font-medium text-paper/80 text-sm",
            htmlFor: id,
            children: label
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 38,
            columnNumber: 10
        }, this);
        $[1] = id;
        $[2] = label;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const t3 = error ? errorId : undefined;
    const t4 = error ? true : undefined;
    const t5 = error ? "border-red-400 focus-visible:border-red-400" : "border-ink-border focus-visible:border-accent";
    let t6;
    if ($[4] !== t5) {
        t6 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cx"])(FIELD_CLASS, t5);
        $[4] = t5;
        $[5] = t6;
    } else {
        t6 = $[5];
    }
    let t7;
    if ($[6] !== autoComplete || $[7] !== defaultValue || $[8] !== id || $[9] !== name || $[10] !== placeholder || $[11] !== t3 || $[12] !== t4 || $[13] !== t6 || $[14] !== type) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            "aria-describedby": t3,
            "aria-invalid": t4,
            autoComplete: autoComplete,
            className: t6,
            defaultValue: defaultValue,
            id: id,
            name: name,
            placeholder: placeholder,
            required: true,
            type: type
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 58,
            columnNumber: 10
        }, this);
        $[6] = autoComplete;
        $[7] = defaultValue;
        $[8] = id;
        $[9] = name;
        $[10] = placeholder;
        $[11] = t3;
        $[12] = t4;
        $[13] = t6;
        $[14] = type;
        $[15] = t7;
    } else {
        t7 = $[15];
    }
    let t8;
    if ($[16] !== error || $[17] !== errorId) {
        t8 = error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-red-400 text-sm",
            id: errorId,
            role: "alert",
            children: error
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 74,
            columnNumber: 18
        }, this) : null;
        $[16] = error;
        $[17] = errorId;
        $[18] = t8;
    } else {
        t8 = $[18];
    }
    let t9;
    if ($[19] !== t2 || $[20] !== t7 || $[21] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-1.5",
            children: [
                t2,
                t7,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 83,
            columnNumber: 10
        }, this);
        $[19] = t2;
        $[20] = t7;
        $[21] = t8;
        $[22] = t9;
    } else {
        t9 = $[22];
    }
    return t9;
}
_s(Field, "WhsuKpSQZEWeFcB7gWlfDRQktoQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = Field;
function Signup() {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(23);
    if ($[0] !== "e3a518846fe503b8b67b41e715bf504fa22e351ce4832195116737385ef9f32a") {
        for(let $i = 0; $i < 23; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "e3a518846fe503b8b67b41e715bf504fa22e351ce4832195116737385ef9f32a";
    }
    const [state, formAction, pending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionState"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$data$3a$d8d4c9__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["submitLead"], INITIAL);
    const formRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const successRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;
    const values = state.status === "error" ? state.values : undefined;
    let t0;
    if ($[1] !== state.status) {
        t0 = ({
            "Signup[useEffect()]": ()=>{
                if (state.status === "success") {
                    successRef.current?.focus();
                    return;
                }
                if (state.status === "error") {
                    const firstInvalid = formRef.current?.querySelector("[aria-invalid]");
                    firstInvalid?.focus();
                }
            }
        })["Signup[useEffect()]"];
        $[1] = state.status;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    let t1;
    if ($[3] !== state) {
        t1 = [
            state
        ];
        $[3] = state;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    const t2 = state.status === "success" ? state.message : "";
    let t3;
    if ($[5] !== t2) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "aria-live": "polite",
            className: "sr-only",
            role: "status",
            children: t2
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 146,
            columnNumber: 10
        }, this);
        $[5] = t2;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "font-semibold text-accent text-xs uppercase tracking-[0.18em]",
            children: "Get access"
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 154,
            columnNumber: 10
        }, this);
        $[7] = t4;
    } else {
        t4 = $[7];
    }
    let t5;
    let t6;
    let t7;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-balance font-bold text-section",
            children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHOW_STRUCK_PRICE"] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    "It was ",
                    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIST_PRICE"],
                    ".",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-accent",
                        children: "Now it's free."
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/signup.tsx",
                        lineNumber: 163,
                        columnNumber: 110
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    "Free ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-accent",
                        children: "while it's in beta."
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/signup.tsx",
                        lineNumber: 163,
                        columnNumber: 174
                    }, this)
                ]
            }, void 0, true)
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 163,
            columnNumber: 10
        }, this);
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriceTag"], {
            currentClassName: "font-bold text-5xl text-accent sm:text-6xl",
            listClassName: "font-bold text-4xl text-muted-dark line-through decoration-2"
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 164,
            columnNumber: 10
        }, this);
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-pretty text-muted leading-relaxed sm:text-lg",
            children: "Tell us where to send it and the whole course is yours — every module, every template, every future update. No card, no trial, nothing to cancel."
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 165,
            columnNumber: 10
        }, this);
        $[8] = t5;
        $[9] = t6;
        $[10] = t7;
    } else {
        t5 = $[8];
        t6 = $[9];
        t7 = $[10];
    }
    let t8;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-6",
            children: [
                t4,
                t5,
                t6,
                t7,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "flex flex-col gap-2.5",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COURSE_INCLUSIONS"].map(_SignupCOURSE_INCLUSIONSMap)
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/signup.tsx",
                    lineNumber: 176,
                    columnNumber: 63
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 176,
            columnNumber: 10
        }, this);
        $[11] = t8;
    } else {
        t8 = $[11];
    }
    let t9;
    if ($[12] !== fieldErrors || $[13] !== pending || $[14] !== state.message || $[15] !== state.status || $[16] !== values?.email || $[17] !== values?.name || $[18] !== values?.phone) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12",
            children: [
                t8,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-ink-border bg-ink-raised p-6 sm:p-8",
                    children: state.status === "success" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-4 py-8 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex size-12 items-center justify-center rounded-full bg-accent/15",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    "aria-hidden": "true",
                                    className: "size-6 text-accent"
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/signup.tsx",
                                    lineNumber: 183,
                                    columnNumber: 366
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 281
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-2xl text-paper",
                                ref: successRef,
                                tabIndex: -1,
                                children: "You're in"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 432
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-pretty text-muted leading-relaxed",
                                children: state.message
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 523
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/course/src/components/signup.tsx",
                        lineNumber: 183,
                        columnNumber: 214
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        action: formAction,
                        className: "flex flex-col gap-4",
                        ref: formRef,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-bold text-paper text-xl",
                                        children: "Send me the course"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 183,
                                        columnNumber: 714
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted text-sm",
                                        children: "Three fields. We'll email your access link."
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 183,
                                        columnNumber: 782
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 677
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                autoComplete: "name",
                                defaultValue: values?.name,
                                error: fieldErrors?.name,
                                label: "Your name",
                                name: "name",
                                placeholder: "Alex Mercer"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 869
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                autoComplete: "email",
                                defaultValue: values?.email,
                                error: fieldErrors?.email,
                                label: "Email address",
                                name: "email",
                                placeholder: "alex@yourstore.com",
                                type: "email"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 1008
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                autoComplete: "tel",
                                defaultValue: values?.phone,
                                error: fieldErrors?.phone,
                                label: "Phone number",
                                name: "phone",
                                placeholder: "+1 555 000 1234",
                                type: "tel"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 1175
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                "aria-hidden": "true",
                                className: "hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "website",
                                        children: "Website"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 183,
                                        columnNumber: 1377
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        autoComplete: "off",
                                        id: "website",
                                        name: "website",
                                        tabIndex: -1,
                                        type: "text"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 183,
                                        columnNumber: 1417
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 1334
                            }, this),
                            state.status === "error" && !fieldErrors ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "rounded-[10px] border border-red-400/40 bg-red-400/10 px-4 py-3 text-red-300 text-sm leading-relaxed",
                                role: "alert",
                                children: state.message
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 1549
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CtaButton"], {
                                disabled: pending,
                                type: "submit",
                                children: pending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            "aria-hidden": "true",
                                            className: "size-4 animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/course/src/components/signup.tsx",
                                            lineNumber: 183,
                                            columnNumber: 1762
                                        }, this),
                                        "Sending…"
                                    ]
                                }, void 0, true) : `Send me the course — ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CURRENT_PRICE"].toLowerCase()}`
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 1705
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-dark text-xs leading-relaxed",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRIVACY_NOTICE"]
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 1904
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/course/src/components/signup.tsx",
                        lineNumber: 183,
                        columnNumber: 605
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/signup.tsx",
                    lineNumber: 183,
                    columnNumber: 105
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 183,
            columnNumber: 10
        }, this);
        $[12] = fieldErrors;
        $[13] = pending;
        $[14] = state.message;
        $[15] = state.status;
        $[16] = values?.email;
        $[17] = values?.name;
        $[18] = values?.phone;
        $[19] = t9;
    } else {
        t9 = $[19];
    }
    let t10;
    if ($[20] !== t3 || $[21] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Section"], {
            id: "get-access",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
                children: [
                    t3,
                    t9
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/components/signup.tsx",
                lineNumber: 197,
                columnNumber: 36
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 197,
            columnNumber: 11
        }, this);
        $[20] = t3;
        $[21] = t9;
        $[22] = t10;
    } else {
        t10 = $[22];
    }
    return t10;
}
_s1(Signup, "3OR6jE5MpgQN8UMbWYQwmaQIhsc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionState"]
    ];
});
_c1 = Signup;
function _SignupCOURSE_INCLUSIONSMap(item) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "flex items-start gap-3 text-paper/90 text-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                "aria-hidden": "true",
                className: "mt-0.5 size-4 shrink-0 text-accent"
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/signup.tsx",
                lineNumber: 207,
                columnNumber: 88
            }, this),
            item.title
        ]
    }, item.title, true, {
        fileName: "[project]/apps/course/src/components/signup.tsx",
        lineNumber: 207,
        columnNumber: 10
    }, this);
}
var _c, _c1;
__turbopack_context__.k.register(_c, "Field");
__turbopack_context__.k.register(_c1, "Signup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/course/src/components/sticky-bar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StickyBar",
    ()=>StickyBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function StickyBar() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(7);
    if ($[0] !== "9215ce9590d80c03d598b9c89ae94e2c657a78fdce5fbf4381148eacaaf42a33") {
        for(let $i = 0; $i < 7; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "9215ce9590d80c03d598b9c89ae94e2c657a78fdce5fbf4381148eacaaf42a33";
    }
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = ({
            "StickyBar[useEffect()]": ()=>{
                const onScroll = {
                    "StickyBar[useEffect() > onScroll]": ()=>{
                        const target = document.getElementById("get-access");
                        const pastHero = window.scrollY > window.innerHeight * 0.85;
                        let formInView = false;
                        if (target) {
                            const rect = target.getBoundingClientRect();
                            formInView = rect.top < window.innerHeight && rect.bottom > 0;
                        }
                        setVisible(pastHero && !formInView);
                    }
                }["StickyBar[useEffect() > onScroll]"];
                onScroll();
                window.addEventListener("scroll", onScroll, {
                    passive: true
                });
                window.addEventListener("resize", onScroll);
                return ()=>{
                    window.removeEventListener("scroll", onScroll);
                    window.removeEventListener("resize", onScroll);
                };
            }
        })["StickyBar[useEffect()]"];
        t1 = [];
        $[1] = t0;
        $[2] = t1;
    } else {
        t0 = $[1];
        t1 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    const t2 = `fixed inset-x-0 bottom-0 z-50 border-ink-border border-t bg-ink/95 backdrop-blur transition-transform duration-300 ease-[var(--ease-out-strong)] motion-reduce:transition-none ${visible ? "translate-y-0" : "translate-y-full"}`;
    const t3 = !visible;
    let t4;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
            className: "flex items-center justify-between gap-4 py-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-baseline gap-2.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriceTag"], {
                            currentClassName: "font-bold text-accent text-xl",
                            listClassName: "font-semibold text-muted-dark text-sm line-through"
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
                            lineNumber: 70,
                            columnNumber: 123
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "hidden text-muted text-sm sm:inline",
                            children: "· full course access"
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
                            lineNumber: 70,
                            columnNumber: 251
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
                    lineNumber: 70,
                    columnNumber: 78
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CtaLink"], {
                    className: "shrink-0",
                    href: "#get-access",
                    size: "md",
                    children: "Get free access"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
                    lineNumber: 70,
                    columnNumber: 338
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
            lineNumber: 70,
            columnNumber: 10
        }, this);
        $[3] = t4;
    } else {
        t4 = $[3];
    }
    let t5;
    if ($[4] !== t2 || $[5] !== t3) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t2,
            inert: t3,
            children: t4
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
            lineNumber: 77,
            columnNumber: 10
        }, this);
        $[4] = t2;
        $[5] = t3;
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    return t5;
}
_s(StickyBar, "cz/DzCD06IMMsoBJ0A1IgCy1P5M=");
_c = StickyBar;
var _c;
__turbopack_context__.k.register(_c, "StickyBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_course_src_13sjbup._.js.map