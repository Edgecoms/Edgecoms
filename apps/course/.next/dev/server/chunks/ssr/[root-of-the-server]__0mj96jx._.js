module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/apps/course/src/lib/content.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/apps/course/src/components/ui.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/content.ts [app-rsc] (ecmascript)");
;
;
function cx(...parts) {
    return parts.filter(Boolean).join(" ");
}
function Container({ children, className, narrow = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: cx("mx-auto w-full px-5 sm:px-8", narrow ? "max-w-3xl" : "max-w-6xl", className),
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/ui.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, this);
}
function Section({ children, className, id, tone = "dark" }) {
    // `[--color-focus:...]` re-points the site-wide focus ring for everything
    // inside a light band. Mint measures 1.40:1 on white — effectively
    // invisible — and the FAQ's text-only buttons live on exactly that surface.
    const tones = {
        dark: "bg-ink text-paper",
        paper: "bg-paper text-ink [--color-focus:var(--color-ink)]",
        wash: "bg-accent-wash text-ink [--color-focus:var(--color-ink)]"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: cx("w-full scroll-mt-24 py-16 sm:py-24", tones[tone], className),
        id: id,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/ui.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, this);
}
function SectionHeading({ eyebrow, lead, title, tone = "dark" }) {
    const isDark = tone === "dark";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto flex max-w-2xl flex-col items-center gap-4 text-center",
        children: [
            eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: cx("font-semibold text-xs uppercase tracking-[0.18em]", isDark ? "text-accent" : "text-ink/60"),
                children: eyebrow
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/ui.tsx",
                lineNumber: 96,
                columnNumber: 5
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-balance font-bold text-section",
                children: title
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/ui.tsx",
                lineNumber: 106,
                columnNumber: 4
            }, this),
            lead ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: cx("max-w-xl text-pretty text-base leading-relaxed sm:text-lg", isDark ? "text-muted" : "text-ink/60"),
                children: lead
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/ui.tsx",
                lineNumber: 109,
                columnNumber: 5
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/course/src/components/ui.tsx",
        lineNumber: 94,
        columnNumber: 3
    }, this);
}
const CTA_BASE = "inline-flex items-center justify-center gap-2 rounded-[10px] px-6 font-bold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none";
const CTA_SIZES = {
    lg: "h-14 text-base sm:text-lg",
    md: "h-12 text-sm sm:text-base"
};
function CtaLink({ children, className, href, size = "lg", variant = "accent", ...props }) {
    const variants = {
        accent: "bg-accent text-accent-ink hover:bg-accent-dim",
        outline: "border border-ink-border bg-white/5 text-paper hover:bg-white/10"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        className: cx(CTA_BASE, CTA_SIZES[size], variants[variant], className),
        href: href,
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/ui.tsx",
        lineNumber: 149,
        columnNumber: 3
    }, this);
}
function CtaButton({ children, className, size = "lg", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: cx(CTA_BASE, CTA_SIZES[size], "bg-accent text-accent-ink hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-60", className),
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/ui.tsx",
        lineNumber: 166,
        columnNumber: 3
    }, this);
}
function PriceTag({ className, currentClassName = "font-bold text-4xl text-accent", listClassName = "font-semibold text-2xl text-muted-dark line-through decoration-2" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: cx("flex items-baseline gap-3", className),
                children: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SHOW_STRUCK_PRICE"] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: listClassName,
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LIST_PRICE"]
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/ui.tsx",
                        lineNumber: 206,
                        columnNumber: 6
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: currentClassName,
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CURRENT_PRICE"]
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/ui.tsx",
                        lineNumber: 210,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/components/ui.tsx",
                lineNumber: 204,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SHOW_STRUCK_PRICE"] ? `Was ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LIST_PRICE"]}. Now ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CURRENT_PRICE"]}.` : `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CURRENT_PRICE"]} while the course is in beta.`
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/ui.tsx",
                lineNumber: 212,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/apps/course/src/components/closing.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClosingCta",
    ()=>ClosingCta,
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/site.ts [app-rsc] (ecmascript)");
;
;
;
function ClosingCta() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        className: "relative isolate overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,color-mix(in_oklab,var(--color-accent)_20%,transparent),transparent_70%)]"
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/closing.tsx",
                lineNumber: 7,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
                className: "relative",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-2xl flex-col items-center gap-6 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-balance font-bold text-section",
                            children: "Stop guessing which change matters"
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/closing.tsx",
                            lineNumber: 14,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-pretty text-muted leading-relaxed sm:text-lg",
                            children: "Learn the system we use to grow ecommerce stores, and start applying it to yours this week."
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/closing.tsx",
                            lineNumber: 18,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PriceTag"], {
                            className: "justify-center",
                            listClassName: "font-bold text-2xl text-muted-dark line-through decoration-2"
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/closing.tsx",
                            lineNumber: 23,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CtaLink"], {
                            href: "#get-access",
                            children: "Get free access"
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/closing.tsx",
                            lineNumber: 28,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-dark text-sm",
                            children: "No card required · Lifetime access"
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/closing.tsx",
                            lineNumber: 30,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/course/src/components/closing.tsx",
                    lineNumber: 13,
                    columnNumber: 5
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/closing.tsx",
                lineNumber: 12,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/course/src/components/closing.tsx",
        lineNumber: 6,
        columnNumber: 3
    }, this);
}
function Footer() {
    const year = new Date().getFullYear();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "border-ink-border border-t bg-ink py-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-dark text-sm",
                        children: [
                            "© ",
                            year,
                            " Edgecoms · ",
                            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_NAME"]
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/course/src/components/closing.tsx",
                        lineNumber: 46,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        className: "text-muted text-sm underline underline-offset-4 transition-colors hover:text-paper",
                        href: "mailto:hello@edgecoms.com",
                        children: "hello@edgecoms.com"
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/closing.tsx",
                        lineNumber: 49,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/components/closing.tsx",
                lineNumber: 45,
                columnNumber: 5
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/closing.tsx",
            lineNumber: 44,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/closing.tsx",
        lineNumber: 43,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/course/src/components/faq.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Faq",
    ()=>Faq
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Faq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Faq() from the server but Faq is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/course/src/components/faq.tsx <module evaluation>", "Faq");
}),
"[project]/apps/course/src/components/faq.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Faq",
    ()=>Faq
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Faq = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Faq() from the server but Faq is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/course/src/components/faq.tsx", "Faq");
}),
"[project]/apps/course/src/components/faq.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$faq$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/course/src/components/faq.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$faq$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/faq.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$faq$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/course/src/lib/images.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * EVERY IMAGE ON THE SITE, IN ONE FILE.
 *
 * The page is built to hold real photography before the photography exists.
 * Each slot below renders as a labelled placeholder until you give it a `src`,
 * and going live with an image is a ONE-LINE edit here — drop the file into
 * `public/` and set `src`. Nothing in the components changes.
 *
 *     src: null                    →  placeholder, labelled with its brief
 *     src: "/images/hero.webp"     →  the real thing, via next/image
 *
 * `alt` is written NOW, deliberately, rather than when the asset arrives. Alt
 * text added later is alt text never added, and a sales page carrying a dozen
 * unlabelled images is unusable with a screen reader.
 *
 * `width`/`height` are the INTRINSIC pixel dimensions the file should have.
 * They set the aspect ratio the placeholder reserves, so swapping in the real
 * image causes no layout shift. Supply at roughly 2x these numbers for retina.
 */ __turbopack_context__.s([
    "IMAGES",
    ()=>IMAGES
]);
const IMAGES = {
    /* ── Hero ──────────────────────────────────────────────────────────────── */ "hero-preview": {
        alt: "A preview of the course: the module list and a lesson playing",
        height: 720,
        hint: "Course preview — a screenshot of the lesson player or module list. 16:9. This is the first image anyone sees, so it should look like a real product, not a stock photo.",
        src: null,
        width: 1280
    },
    /* ── Trust strip ───────────────────────────────────────────────────────────
	   Five logos of tools, publications or brands you can HONESTLY associate
	   with. Leave a slot null rather than filling it with a logo you have no
	   relationship with — an unearned logo wall is the fastest way to lose the
	   trust the rest of the page is building. */ "trust-logo-1": {
        alt: "",
        height: 40,
        hint: "Partner, platform or publication logo. Monochrome or white, transparent PNG/SVG, ~160x40.",
        src: null,
        width: 160
    },
    "trust-logo-2": {
        alt: "",
        height: 40,
        hint: "Partner, platform or publication logo. Monochrome or white, transparent PNG/SVG, ~160x40.",
        src: null,
        width: 160
    },
    "trust-logo-3": {
        alt: "",
        height: 40,
        hint: "Partner, platform or publication logo. Monochrome or white, transparent PNG/SVG, ~160x40.",
        src: null,
        width: 160
    },
    "trust-logo-4": {
        alt: "",
        height: 40,
        hint: "Partner, platform or publication logo. Monochrome or white, transparent PNG/SVG, ~160x40.",
        src: null,
        width: 160
    },
    "trust-logo-5": {
        alt: "",
        height: 40,
        hint: "Partner, platform or publication logo. Monochrome or white, transparent PNG/SVG, ~160x40.",
        src: null,
        width: 160
    },
    /* ── Inside the course ─────────────────────────────────────────────────── */ "preview-lesson": {
        alt: "A lesson from the course playing, with the outline beside it",
        height: 720,
        hint: "A real lesson on screen. 16:9. Show the interface, not a stock person at a laptop.",
        src: null,
        width: 1280
    },
    "preview-template": {
        alt: "One of the course spreadsheets, filled in with example numbers",
        height: 720,
        hint: "A template or calculator, filled in. 16:9. Real numbers beat an empty grid.",
        src: null,
        width: 1280
    },
    "preview-teardown": {
        alt: "A store teardown in progress, with notes marked on the page",
        height: 720,
        hint: "A teardown screenshot with annotations. 16:9. Blur the brand if you do not have permission to name it.",
        src: null,
        width: 1280
    },
    /* ── Instructor ────────────────────────────────────────────────────────────
	   The single highest-trust image on the page. A real face, looking at the
	   camera, beats any illustration. */ "instructor-portrait": {
        alt: "The Edgecoms team member who teaches the course",
        height: 1000,
        hint: "Portrait, 4:5. Real photo, natural light, plain background. Not a stock headshot and not an avatar.",
        src: null,
        width: 800
    },
    /* ── Community ─────────────────────────────────────────────────────────── */ "community-preview": {
        alt: "The course community, showing a discussion thread",
        height: 720,
        hint: "Community screenshot. 16:9. REDACT names, avatars and any personal detail before supplying this — it is other people's data.",
        src: null,
        width: 1280
    }
};
}),
"[project]/apps/course/src/components/slot-image.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SlotImage",
    ()=>SlotImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/image.js [app-rsc] (ecmascript) <export default as ImageIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/images.ts [app-rsc] (ecmascript)");
;
;
;
;
;
function SlotImage({ className, imageKey, priority = false, rounded = "2xl", sizes, tone = "dark" }) {
    const slot = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IMAGES"][imageKey];
    const radius = {
        "2xl": "rounded-2xl",
        full: "rounded-full",
        lg: "rounded-lg",
        none: ""
    }[rounded];
    if (slot.src) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            alt: slot.alt,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cx"])(radius, "h-auto w-full object-cover", className),
            height: slot.height,
            priority: priority,
            sizes: sizes,
            src: slot.src,
            width: slot.width
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/slot-image.tsx",
            lineNumber: 43,
            columnNumber: 4
        }, this);
    }
    const isDark = tone === "dark";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": "true",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cx"])("flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed p-6 text-center", radius, isDark ? "border-accent/25 bg-accent/[0.04] text-muted" : "border-ink/15 bg-ink/[0.03] text-ink/50", className),
        // Reserving the real ratio is the whole point: approve this layout and
        // the layout does not move when the photograph arrives.
        style: {
            aspectRatio: `${slot.width} / ${slot.height}`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ImageIcon$3e$__["ImageIcon"], {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cx"])("size-6", isDark ? "text-accent/50" : "text-ink/30")
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/slot-image.tsx",
                lineNumber: 72,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cx"])("font-mono text-[11px] tracking-tight", isDark ? "text-accent/70" : "text-ink/50"),
                children: [
                    imageKey,
                    " · ",
                    slot.width,
                    "×",
                    slot.height
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/components/slot-image.tsx",
                lineNumber: 75,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "max-w-sm text-pretty text-xs leading-relaxed",
                children: slot.hint
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/slot-image.tsx",
                lineNumber: 83,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/course/src/components/slot-image.tsx",
        lineNumber: 58,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/course/src/components/hero.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Hero",
    ()=>Hero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$slot$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/slot-image.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/content.ts [app-rsc] (ecmascript)");
;
;
;
;
/**
 * The hero plays on load rather than on scroll, in reading order: eyebrow,
 * headline, lead, price, buttons, fine print, product shot.
 *
 * Driven by CSS (`.hero-item` in globals.css) rather than Motion, and so a
 * server component with no client JavaScript at all. The old version wrote
 * `opacity: 0` into the SSR HTML via Motion's `initial` prop, which meant a
 * blocked bundle showed a blank screen and a reduced-motion visitor — whose
 * branch differed between server and client — never got the styles cleared.
 * A CSS animation needs no JS to run and is switched off by a media query.
 *
 * 110ms apart: each element is still settling as the next begins, which is
 * what makes six movements read as one.
 */ const STEP_MS = 110;
/** Inline custom property, read by the `.hero-item` animation-delay. */ function delay(index) {
    return {
        "--hero-delay": `${index * STEP_MS}ms`
    };
}
function Hero() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "relative isolate overflow-hidden bg-ink",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "aria-hidden": "true",
                className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent_70%)]"
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/hero.tsx",
                lineNumber: 32,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "hero-item inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-semibold text-accent text-xs uppercase tracking-[0.16em]",
                                style: delay(0),
                                children: "Free · for beginners and growing stores"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/hero.tsx",
                                lineNumber: 39,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "hero-item max-w-4xl text-balance font-bold text-hero",
                                style: delay(1),
                                children: [
                                    "Know what to work on next,",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-accent",
                                        children: "and why"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/hero.tsx",
                                        lineNumber: 51,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/course/src/components/hero.tsx",
                                lineNumber: 46,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "hero-item max-w-2xl text-pretty text-base text-muted leading-relaxed sm:text-xl",
                                style: delay(2),
                                children: "Free, ten modules, plain English. By the end you can name the one thing most likely to be holding a store back, and what to do about it — whether your store is trading already or still on paper."
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/hero.tsx",
                                lineNumber: 54,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero-item flex flex-col items-center gap-3",
                                style: delay(3),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PriceTag"], {
                                    className: "justify-center",
                                    currentClassName: "font-bold text-4xl text-accent sm:text-5xl"
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/hero.tsx",
                                    lineNumber: 67,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/hero.tsx",
                                lineNumber: 63,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hero-item flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center",
                                style: delay(4),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CtaLink"], {
                                        href: "#get-access",
                                        children: "Get free access"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/hero.tsx",
                                        lineNumber: 77,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CtaLink"], {
                                        href: "#curriculum",
                                        variant: "outline",
                                        children: "See what's inside"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/hero.tsx",
                                        lineNumber: 78,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/course/src/components/hero.tsx",
                                lineNumber: 73,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "hero-item text-muted-dark text-sm",
                                style: delay(5),
                                children: "No card required · Lifetime access · Unsubscribe anytime"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/hero.tsx",
                                lineNumber: 83,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/course/src/components/hero.tsx",
                        lineNumber: 38,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hero-item pb-16 sm:pb-20",
                        style: delay(6),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-2xl border border-ink-border bg-ink-raised p-2 shadow-2xl sm:p-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$slot$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SlotImage"], {
                                imageKey: "hero-preview",
                                priority: true,
                                sizes: "(max-width: 1024px) 100vw, 1024px"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/hero.tsx",
                                lineNumber: 92,
                                columnNumber: 7
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/hero.tsx",
                            lineNumber: 91,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/hero.tsx",
                        lineNumber: 90,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/components/hero.tsx",
                lineNumber: 37,
                columnNumber: 4
            }, this),
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VISIBLE_STATS"].length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative border-ink-border border-y",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                        className: "grid grid-cols-1 divide-y divide-ink-border sm:grid-cols-3 sm:divide-x sm:divide-y-0",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VISIBLE_STATS"].map((stat)=>/* `flex-col-reverse` puts the figure above its caption while
								   the DOM keeps the term before its description. */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col-reverse items-center gap-1 px-2 py-6 text-center sm:py-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                        className: "text-pretty text-muted text-xs sm:text-sm",
                                        children: stat.label
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/hero.tsx",
                                        lineNumber: 114,
                                        columnNumber: 10
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                        className: "font-bold text-2xl text-paper tabular-nums sm:text-4xl",
                                        children: stat.value
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/hero.tsx",
                                        lineNumber: 117,
                                        columnNumber: 10
                                    }, this)
                                ]
                            }, stat.label, true, {
                                fileName: "[project]/apps/course/src/components/hero.tsx",
                                lineNumber: 110,
                                columnNumber: 9
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/hero.tsx",
                        lineNumber: 106,
                        columnNumber: 7
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/hero.tsx",
                    lineNumber: 105,
                    columnNumber: 6
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/hero.tsx",
                lineNumber: 104,
                columnNumber: 5
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/course/src/components/hero.tsx",
        lineNumber: 28,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/course/src/components/primitives.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Reveal",
    ()=>Reveal
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Reveal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Reveal() from the server but Reveal is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/course/src/components/primitives.tsx <module evaluation>", "Reveal");
}),
"[project]/apps/course/src/components/primitives.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Reveal",
    ()=>Reveal
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Reveal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Reveal() from the server but Reveal is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/course/src/components/primitives.tsx", "Reveal");
}),
"[project]/apps/course/src/components/primitives.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/course/src/components/primitives.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/primitives.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/course/src/components/sections.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Audience",
    ()=>Audience,
    "Comparison",
    ()=>Comparison,
    "CoursePreview",
    ()=>CoursePreview,
    "Curriculum",
    ()=>Curriculum,
    "Inclusions",
    ()=>Inclusions,
    "Instructor",
    ()=>Instructor,
    "PainPoints",
    ()=>PainPoints,
    "TrustStrip",
    ()=>TrustStrip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/check.js [app-rsc] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/x.js [app-rsc] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$slot$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/slot-image.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/content.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/images.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/site.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
/**
 * The logo strip, directly under the hero.
 *
 * Renders only the slots that have a real logo. An unearned logo wall is the
 * fastest way to lose the trust the rest of the page is building, so an empty
 * slot shows the placeholder in development and simply disappears in
 * production rather than shipping a grey box that implies a relationship.
 */ const TRUST_KEYS = [
    "trust-logo-1",
    "trust-logo-2",
    "trust-logo-3",
    "trust-logo-4",
    "trust-logo-5"
];
function TrustStrip() {
    const anyReal = TRUST_KEYS.some((key)=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$images$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IMAGES"][key].src !== null);
    // Nothing to show and not worth a placeholder band in production.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "w-full border-ink-border border-b bg-ink py-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center font-semibold text-muted-dark text-xs uppercase tracking-[0.18em]",
                    children: "Built by the team behind"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 42,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-5",
                    children: TRUST_KEYS.map((key)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$slot$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SlotImage"], {
                                className: "max-h-10 w-auto opacity-60",
                                imageKey: key,
                                rounded: "lg"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/sections.tsx",
                                lineNumber: 48,
                                columnNumber: 8
                            }, this)
                        }, key, false, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 47,
                            columnNumber: 7
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 45,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/sections.tsx",
            lineNumber: 41,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/sections.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, this);
}
/**
 * A look inside. Three real screenshots do more for a course page than any
 * amount of prose about what the course contains — this is the section that
 * answers "what am I actually getting".
 */ const PREVIEWS = [
    {
        body: "Every module is a short, plain-English lesson you can watch on a phone.",
        imageKey: "preview-lesson",
        title: "The lessons"
    },
    {
        body: "Fill in your own numbers and the templates tell you where the money is leaking.",
        imageKey: "preview-template",
        title: "The templates"
    },
    {
        body: "We pull real stores apart and mark up exactly what we would change.",
        imageKey: "preview-teardown",
        title: "The teardowns"
    }
];
function CoursePreview() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                    eyebrow: "A look inside",
                    lead: "No mystery about what you are signing up for. This is the actual course.",
                    title: "See it before you sign up"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 88,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3",
                    children: PREVIEWS.map((preview)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                            className: "flex flex-col gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-2xl border border-ink-border bg-ink-raised p-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$slot$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SlotImage"], {
                                        imageKey: preview.imageKey,
                                        sizes: "(max-width: 1024px) 100vw, 33vw"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/sections.tsx",
                                        lineNumber: 98,
                                        columnNumber: 9
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 97,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                                    className: "flex flex-col gap-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-base text-paper",
                                            children: preview.title
                                        }, void 0, false, {
                                            fileName: "[project]/apps/course/src/components/sections.tsx",
                                            lineNumber: 104,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-pretty text-muted text-sm leading-relaxed",
                                            children: preview.body
                                        }, void 0, false, {
                                            fileName: "[project]/apps/course/src/components/sections.tsx",
                                            lineNumber: 107,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 103,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, preview.title, true, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 96,
                            columnNumber: 7
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 94,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/sections.tsx",
            lineNumber: 87,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/sections.tsx",
        lineNumber: 86,
        columnNumber: 3
    }, this);
}
function PainPoints() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        tone: "wash",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            narrow: true,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                    eyebrow: "Sound familiar?",
                    lead: "Most of this comes down to a handful of decisions. The hard part is knowing which one to make first.",
                    title: "If you have ever thought…",
                    tone: "wash"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 124,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                    className: "mt-10 flex flex-col gap-3",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_PAIN_POINTS"].map((point)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "flex items-start gap-3 rounded-xl bg-white/70 px-5 py-4 text-base text-ink/80 leading-relaxed",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-hidden": "true",
                                    className: "mt-2 size-2 shrink-0 rounded-full bg-ink/25"
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 137,
                                    columnNumber: 8
                                }, this),
                                point
                            ]
                        }, point, true, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 133,
                            columnNumber: 7
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 131,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-8 text-balance text-center font-semibold text-ink text-lg",
                    children: [
                        "Said yes to more than a couple? That is exactly the ground",
                        " ",
                        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_NAME"],
                        " covers."
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 146,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/sections.tsx",
            lineNumber: 123,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/sections.tsx",
        lineNumber: 122,
        columnNumber: 3
    }, this);
}
function Inclusions() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                    eyebrow: "What you get",
                    lead: "Everything below is included. Nothing is an upsell, and none of it costs anything.",
                    title: "Inside the course"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 160,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_INCLUSIONS"].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3 rounded-2xl border border-ink-border bg-ink-raised p-6 transition-colors hover:border-accent/40",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-hidden": "true",
                                    className: "text-3xl",
                                    children: item.emoji
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 172,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold text-lg text-paper",
                                    children: item.title
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 175,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-pretty text-muted text-sm leading-relaxed",
                                    children: item.body
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 176,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, item.title, true, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 168,
                            columnNumber: 7
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 166,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                    className: "mt-10 flex flex-col gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-2xl border border-ink-border bg-ink-raised p-2 sm:p-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$slot$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SlotImage"], {
                                imageKey: "community-preview",
                                sizes: "(max-width: 1024px) 100vw, 1024px"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/sections.tsx",
                                lineNumber: 188,
                                columnNumber: 7
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 187,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                            className: "text-center text-muted text-sm",
                            children: "Ask a question, post your numbers, get an answer from someone solving the same problem."
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 193,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 186,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/sections.tsx",
            lineNumber: 159,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/sections.tsx",
        lineNumber: 158,
        columnNumber: 3
    }, this);
}
function Curriculum() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        id: "curriculum",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            narrow: true,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                    eyebrow: "The curriculum",
                    lead: "Each module builds on the equation taught in the first. You can skip ahead, but the sequence is the point.",
                    title: "Ten modules, in the order they matter"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 212,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                    className: "mt-12 flex flex-col gap-3",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_MODULES"].map((module, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "grid grid-cols-[auto_1fr] gap-x-5 rounded-2xl border border-ink-border bg-ink-raised p-5 sm:p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-bold text-accent text-lg tabular-nums",
                                    children: String(index + 1).padStart(2, "0")
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 224,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-lg text-paper",
                                                    children: module.title
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 10
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-dark text-xs tabular-nums",
                                                    children: [
                                                        module.lessons,
                                                        " lessons"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 10
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/course/src/components/sections.tsx",
                                            lineNumber: 229,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-pretty text-muted text-sm leading-relaxed",
                                            children: module.summary
                                        }, void 0, false, {
                                            fileName: "[project]/apps/course/src/components/sections.tsx",
                                            lineNumber: 237,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 228,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, module.title, true, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 220,
                            columnNumber: 7
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 218,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-10 flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CtaLink"], {
                        href: "#get-access",
                        children: "Get all ten, free"
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/sections.tsx",
                        lineNumber: 246,
                        columnNumber: 6
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 245,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/sections.tsx",
            lineNumber: 211,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/sections.tsx",
        lineNumber: 210,
        columnNumber: 3
    }, this);
}
function Audience() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        tone: "wash",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                    eyebrow: "Who it's for",
                    lead: "The through-line is the same everywhere: you own a number, and you want a defensible way to move it.",
                    title: "Built for people who own the number",
                    tone: "wash"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 257,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_AUDIENCE"].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-2 rounded-2xl bg-white/70 p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold text-ink text-lg",
                                    children: item.title
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 270,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-pretty text-ink/60 text-sm leading-relaxed",
                                    children: item.body
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 271,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, item.title, true, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 266,
                            columnNumber: 7
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 264,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/sections.tsx",
            lineNumber: 256,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/sections.tsx",
        lineNumber: 255,
        columnNumber: 3
    }, this);
}
function Instructor() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto w-full max-w-sm lg:mx-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$slot$2d$image$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SlotImage"], {
                            imageKey: "instructor-portrait",
                            sizes: "(max-width: 1024px) 24rem, 32vw"
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 295,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/sections.tsx",
                        lineNumber: 294,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold text-accent text-xs uppercase tracking-[0.18em]",
                                children: "Who's teaching"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/sections.tsx",
                                lineNumber: 302,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-balance font-bold text-section",
                                children: "The team behind Edge"
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/sections.tsx",
                                lineNumber: 305,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-pretty text-muted leading-relaxed sm:text-lg",
                                children: "Edgecoms builds the Edge suite — focused Shopify apps for bundles, cart upsells, reviews, subscriptions and attribution. This course is the reasoning underneath that work, written down in the order it is actually useful."
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/sections.tsx",
                                lineNumber: 308,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-pretty text-muted leading-relaxed sm:text-lg",
                                children: "We are not teaching this from a conference talk. We had to answer these questions to build the products, and the answers turned out to be worth more than the tactics."
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/sections.tsx",
                                lineNumber: 314,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-2 flex flex-col gap-3",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["INSTRUCTOR_CREDENTIALS"].map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-start gap-3 rounded-xl border border-ink-border bg-ink-raised px-5 py-4 text-paper/90 text-sm leading-relaxed",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                "aria-hidden": "true",
                                                className: "mt-0.5 size-4 shrink-0 text-accent"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/course/src/components/sections.tsx",
                                                lineNumber: 326,
                                                columnNumber: 10
                                            }, this),
                                            line
                                        ]
                                    }, line, true, {
                                        fileName: "[project]/apps/course/src/components/sections.tsx",
                                        lineNumber: 322,
                                        columnNumber: 9
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/sections.tsx",
                                lineNumber: 320,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/course/src/components/sections.tsx",
                        lineNumber: 301,
                        columnNumber: 6
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/components/sections.tsx",
                lineNumber: 291,
                columnNumber: 5
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/course/src/components/sections.tsx",
            lineNumber: 290,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/sections.tsx",
        lineNumber: 289,
        columnNumber: 3
    }, this);
}
function Comparison() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                    eyebrow: "The honest comparison",
                    title: "Why this one is different"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 350,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-4 rounded-2xl border border-ink-border bg-ink-raised p-6 sm:p-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-muted-dark text-sm uppercase tracking-wider",
                                    children: "Most ecommerce courses"
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 357,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "flex flex-col gap-3",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_COMPARISON"].theirs.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-start gap-3 text-muted text-sm leading-relaxed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    "aria-hidden": "true",
                                                    className: "mt-0.5 size-4 shrink-0 text-muted-dark"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                                    lineNumber: 366,
                                                    columnNumber: 10
                                                }, this),
                                                line
                                            ]
                                        }, line, true, {
                                            fileName: "[project]/apps/course/src/components/sections.tsx",
                                            lineNumber: 362,
                                            columnNumber: 9
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 360,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 356,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-4 rounded-2xl border border-accent/40 bg-accent/[0.07] p-6 sm:p-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-accent text-sm uppercase tracking-wider",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_NAME"]
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 377,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "flex flex-col gap-3",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_COMPARISON"].ours.map((line)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-start gap-3 text-paper/90 text-sm leading-relaxed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    "aria-hidden": "true",
                                                    className: "mt-0.5 size-4 shrink-0 text-accent"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                                    lineNumber: 386,
                                                    columnNumber: 10
                                                }, this),
                                                line
                                            ]
                                        }, line, true, {
                                            fileName: "[project]/apps/course/src/components/sections.tsx",
                                            lineNumber: 382,
                                            columnNumber: 9
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/sections.tsx",
                                    lineNumber: 380,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/course/src/components/sections.tsx",
                            lineNumber: 376,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/course/src/components/sections.tsx",
                    lineNumber: 355,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/sections.tsx",
            lineNumber: 349,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/sections.tsx",
        lineNumber: 348,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/course/src/components/signup.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Signup",
    ()=>Signup
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Signup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Signup() from the server but Signup is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/course/src/components/signup.tsx <module evaluation>", "Signup");
}),
"[project]/apps/course/src/components/signup.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Signup",
    ()=>Signup
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const Signup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call Signup() from the server but Signup is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/course/src/components/signup.tsx", "Signup");
}),
"[project]/apps/course/src/components/signup.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$signup$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/course/src/components/signup.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$signup$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/signup.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$signup$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/course/src/lib/social-proof.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUTHORITY_POINTS",
    ()=>AUTHORITY_POINTS,
    "EDGE_APPS",
    ()=>EDGE_APPS,
    "MAX_RATING",
    ()=>MAX_RATING,
    "REAL_TESTIMONIAL_COUNT",
    ()=>REAL_TESTIMONIAL_COUNT,
    "TESTIMONIALS",
    ()=>TESTIMONIALS,
    "VISIBLE_TESTIMONIALS",
    ()=>VISIBLE_TESTIMONIALS,
    "aggregateRating",
    ()=>aggregateRating,
    "isPublishable",
    ()=>isPublishable
]);
const MAX_RATING = 5;
const TESTIMONIALS = [
    {
        avatar: null,
        collectedAt: null,
        id: "fragrance-founder",
        name: "",
        permission: "none",
        provenance: "invented",
        quote: "I had been treating conversion rate and order value as one problem. Splitting them the way module one does showed me I had been working on the wrong half all year.",
        rating: 5,
        role: "Founder, home fragrance brand",
        source: null
    },
    {
        avatar: null,
        collectedAt: null,
        id: "apparel-manager",
        name: "",
        permission: "none",
        provenance: "invented",
        quote: "The product page module alone would have been worth paying for. We reordered the page the way it teaches and the change held through a full season.",
        rating: 5,
        role: "Ecommerce manager, apparel",
        source: null
    },
    {
        avatar: null,
        collectedAt: null,
        id: "agency-founder",
        name: "",
        permission: "none",
        provenance: "invented",
        quote: "I now run the same audit on every client store in week one. It has replaced about four separate documents we used to maintain.",
        rating: 4,
        role: "Founder, agency",
        source: null
    },
    {
        avatar: null,
        collectedAt: null,
        id: "supplements-growth",
        name: "",
        permission: "none",
        provenance: "invented",
        quote: "The measurement module ended an argument my team had been having for two quarters. We were both wrong, and the holdout proved it.",
        rating: 5,
        role: "Head of growth, supplements",
        source: null
    },
    {
        avatar: null,
        collectedAt: null,
        id: "single-product-owner",
        name: "",
        permission: "none",
        provenance: "invented",
        quote: "I came for the paid traffic module and got the most value out of retention, which I had been ignoring completely.",
        rating: 4,
        role: "Owner, single-product store",
        source: null
    },
    {
        avatar: null,
        collectedAt: null,
        id: "shopify-freelancer",
        name: "",
        permission: "none",
        provenance: "invented",
        quote: "I could always build the thing. This taught me how to argue for which thing to build, which is what clients actually pay for.",
        rating: 5,
        role: "Freelancer, Shopify development",
        source: null
    }
];
function isPublishable(testimonial) {
    return testimonial.provenance === "verified" && testimonial.permission === "granted";
}
const VISIBLE_TESTIMONIALS = TESTIMONIALS.filter((testimonial)=>isPublishable(testimonial) || ("TURBOPACK compile-time value", "development") === "development");
const REAL_TESTIMONIAL_COUNT = TESTIMONIALS.filter(isPublishable).length;
/**
 * The star summary, COMPUTED from real ratings and never written by hand.
 *
 * Returns `null` below a floor of four, for two reasons: an "average" of one
 * review is not an average, and Google's review-snippet policy expects an
 * aggregate to represent a real body of opinion. A hardcoded "4.8★" next to
 * three reviews is exactly the kind of claim that earns a manual action.
 */ const MIN_RATINGS_FOR_AVERAGE = 4;
function aggregateRating() {
    const rated = TESTIMONIALS.filter((testimonial)=>isPublishable(testimonial) && testimonial.rating !== null);
    if (rated.length < MIN_RATINGS_FOR_AVERAGE) {
        return null;
    }
    const total = rated.reduce((sum, testimonial)=>sum + (testimonial.rating ?? 0), 0);
    return {
        average: Math.round(total / rated.length * 10) / 10,
        count: rated.length
    };
}
;
const AUTHORITY_POINTS = [
    "We build Shopify apps that run on live merchant storefronts",
    "Conversion rate and average order value are our day job, not a side interest",
    "Everything taught here is something we run ourselves first",
    "We show the workings, so you can check them rather than trust us"
];
const EDGE_APPS = [
    "Edge Bundles",
    "Edge Cart",
    "Edge Timer",
    "Edge Reviews",
    "Edge Subscriptions",
    "Edge Currency",
    "Trackproof"
];
}),
"[project]/apps/course/src/components/social-proof.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SocialProof",
    ()=>SocialProof
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/star.js [app-rsc] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/image.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/social-proof.ts [app-rsc] (ecmascript)");
;
;
;
;
;
/**
 * A rating out of five.
 *
 * The number is exposed once, in text, for screen readers; the stars themselves
 * are decorative. Reading out "star, star, star, star, star" is noise.
 */ function Stars({ rating }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "flex items-center gap-0.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only",
                children: [
                    rating,
                    " out of ",
                    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MAX_RATING"]
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/components/social-proof.tsx",
                lineNumber: 23,
                columnNumber: 4
            }, this),
            Array.from({
                length: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MAX_RATING"]
            }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                    "aria-hidden": "true",
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cx"])("size-4", index < Math.round(rating) ? "fill-accent text-accent" : "text-muted-dark")
                }, index, false, {
                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                    lineNumber: 27,
                    columnNumber: 5
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/course/src/components/social-proof.tsx",
        lineNumber: 22,
        columnNumber: 3
    }, this);
}
function TestimonialCard({ testimonial }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
        className: "flex flex-col justify-between gap-5 rounded-2xl border border-ink-border bg-ink-raised p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4",
                children: [
                    testimonial.rating === null ? null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Stars, {
                        rating: testimonial.rating
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/social-proof.tsx",
                        lineNumber: 47,
                        columnNumber: 6
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                        className: "text-pretty text-paper/90 text-sm leading-relaxed",
                        children: [
                            "“",
                            testimonial.quote,
                            "”"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/course/src/components/social-proof.tsx",
                        lineNumber: 49,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/components/social-proof.tsx",
                lineNumber: 45,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                className: "flex items-center gap-3",
                children: [
                    testimonial.avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        alt: "",
                        className: "size-9 shrink-0 rounded-full object-cover",
                        height: 72,
                        src: testimonial.avatar,
                        width: 72
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/social-proof.tsx",
                        lineNumber: 56,
                        columnNumber: 6
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs leading-snug",
                        children: [
                            testimonial.name ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block font-semibold text-paper",
                                children: testimonial.name
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/social-proof.tsx",
                                lineNumber: 68,
                                columnNumber: 7
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block text-muted-dark",
                                children: testimonial.role
                            }, void 0, false, {
                                fileName: "[project]/apps/course/src/components/social-proof.tsx",
                                lineNumber: 72,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/course/src/components/social-proof.tsx",
                        lineNumber: 64,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/components/social-proof.tsx",
                lineNumber: 54,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/course/src/components/social-proof.tsx",
        lineNumber: 44,
        columnNumber: 3
    }, this);
}
/**
 * WHAT THE SECTION SHOWS BEFORE ANYONE HAS TAKEN THE COURSE.
 *
 * The honest answer to "a new course has no testimonials" is not an empty
 * space, and it is certainly not an invented one. It is to say so, and to put
 * the proof that does exist in its place: this is built by people who ship
 * Shopify apps for a living, which is checkable in a way a student count is
 * not.
 *
 * Framing newness as an opening is also simply true — early members shape what
 * gets made — and it gives the page something to convert on while the real
 * quotes are being collected.
 */ function FoundingMembers() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                    eyebrow: "Why trust this",
                    lead: "This course is new, so there are no student results to show you yet. Rather than borrow someone else's, here is what we can actually stand behind.",
                    title: "No testimonials yet. Here's the honest version."
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                    lineNumber: 96,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-4 rounded-2xl border border-accent/40 bg-accent/[0.07] p-6 sm:p-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold text-lg text-paper",
                                    children: "Who is actually behind it"
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                                    lineNumber: 104,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "flex flex-col gap-3",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AUTHORITY_POINTS"].map((point)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-start gap-3 text-paper/90 text-sm leading-relaxed",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    "aria-hidden": "true",
                                                    className: "mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 10
                                                }, this),
                                                point
                                            ]
                                        }, point, true, {
                                            fileName: "[project]/apps/course/src/components/social-proof.tsx",
                                            lineNumber: 109,
                                            columnNumber: 9
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                                    lineNumber: 107,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/course/src/components/social-proof.tsx",
                            lineNumber: 103,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-4 rounded-2xl border border-ink-border bg-ink-raised p-6 sm:p-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold text-lg text-paper",
                                    children: "The apps we build"
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                                    lineNumber: 124,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-pretty text-muted text-sm leading-relaxed",
                                    children: "Real products on real storefronts. The thinking in this course is the thinking that went into them."
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                                    lineNumber: 125,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "flex flex-wrap gap-2",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EDGE_APPS"].map((app)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "rounded-full border border-ink-border px-3 py-1 text-paper/80 text-xs",
                                            children: app
                                        }, app, false, {
                                            fileName: "[project]/apps/course/src/components/social-proof.tsx",
                                            lineNumber: 131,
                                            columnNumber: 9
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                                    lineNumber: 129,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/course/src/components/social-proof.tsx",
                            lineNumber: 123,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                    lineNumber: 102,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mx-auto mt-8 max-w-xl text-balance text-center text-muted text-sm leading-relaxed",
                    children: "When people finish the course and tell us what changed, we will publish what they say here — with their name on it, and their permission."
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                    lineNumber: 142,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/social-proof.tsx",
            lineNumber: 95,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/social-proof.tsx",
        lineNumber: 94,
        columnNumber: 3
    }, this);
}
function SocialProof() {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["REAL_TESTIMONIAL_COUNT"] === 0 && __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VISIBLE_TESTIMONIALS"].length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(FoundingMembers, {}, void 0, false, {
            fileName: "[project]/apps/course/src/components/social-proof.tsx",
            lineNumber: 163,
            columnNumber: 10
        }, this);
    }
    const rating = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["aggregateRating"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Section"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Container"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SectionHeading"], {
                    eyebrow: "From students",
                    title: "What people took away"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                    lineNumber: 171,
                    columnNumber: 5
                }, this),
                rating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 flex flex-col items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Stars, {
                            rating: rating.average
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/social-proof.tsx",
                            lineNumber: 175,
                            columnNumber: 7
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted text-sm",
                            children: [
                                rating.average,
                                " out of ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["MAX_RATING"],
                                ", from ",
                                rating.count,
                                " reviews"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/course/src/components/social-proof.tsx",
                            lineNumber: 176,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                    lineNumber: 174,
                    columnNumber: 6
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VISIBLE_TESTIMONIALS"].map((testimonial)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(TestimonialCard, {
                            testimonial: testimonial
                        }, testimonial.id, false, {
                            fileName: "[project]/apps/course/src/components/social-proof.tsx",
                            lineNumber: 184,
                            columnNumber: 7
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                    lineNumber: 182,
                    columnNumber: 5
                }, this),
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$social$2d$proof$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["REAL_TESTIMONIAL_COUNT"] === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-8 text-center font-mono text-accent/70 text-xs",
                    children: "Development only — no permissioned testimonials yet, so a production build shows the founding-members panel instead."
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/social-proof.tsx",
                    lineNumber: 189,
                    columnNumber: 6
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/social-proof.tsx",
            lineNumber: 170,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/social-proof.tsx",
        lineNumber: 169,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/course/src/components/sticky-bar.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StickyBar",
    ()=>StickyBar
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const StickyBar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StickyBar() from the server but StickyBar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/course/src/components/sticky-bar.tsx <module evaluation>", "StickyBar");
}),
"[project]/apps/course/src/components/sticky-bar.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StickyBar",
    ()=>StickyBar
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const StickyBar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call StickyBar() from the server but StickyBar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/apps/course/src/components/sticky-bar.tsx", "StickyBar");
}),
"[project]/apps/course/src/components/sticky-bar.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sticky$2d$bar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/course/src/components/sticky-bar.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sticky$2d$bar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/sticky-bar.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sticky$2d$bar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/apps/course/src/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CoursePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$closing$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/closing.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$faq$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/faq.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/hero.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/primitives.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sections$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/sections.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$signup$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/signup.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$social$2d$proof$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/social-proof.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sticky$2d$bar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/sticky-bar.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/content.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/site.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
/**
 * Structured data.
 *
 * The `offers` block states a price of 0 because the page genuinely offers the
 * course for nothing — that is a claim the page can back. There is deliberately
 * NO `aggregateRating`: the testimonials are placeholders, and a rich result
 * built on invented reviews is what earns a manual action.
 *
 * TODO(launch): add `aggregateRating` only once real, permissioned reviews
 * exist, and drop `offers` back to the real figure if the course starts being
 * charged for.
 */ const COURSE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Course",
    description: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SITE_DESCRIPTION"],
    name: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_NAME"],
    offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        price: 0,
        priceCurrency: "USD"
    },
    provider: {
        "@type": "Organization",
        name: "Edgecoms",
        url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["absoluteUrl"])("/")
    },
    url: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$site$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["absoluteUrl"])("/")
};
const FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["COURSE_FAQ"].map((item)=>({
            "@type": "Question",
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer
            },
            name: item.question
        }))
};
/** JSON-LD is our own structured data, and `<` is escaped so a stray angle
    bracket in copy can never close the script tag early. */ function JsonLd({ data }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as raw text.
        dangerouslySetInnerHTML: {
            __html: JSON.stringify(data).replace(/</g, "\\u003c")
        },
        type: "application/ld+json"
    }, void 0, false, {
        fileName: "[project]/apps/course/src/app/page.tsx",
        lineNumber: 66,
        columnNumber: 3
    }, this);
}
function CoursePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(JsonLd, {
                data: COURSE_SCHEMA
            }, void 0, false, {
                fileName: "[project]/apps/course/src/app/page.tsx",
                lineNumber: 79,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(JsonLd, {
                data: FAQ_SCHEMA
            }, void 0, false, {
                fileName: "[project]/apps/course/src/app/page.tsx",
                lineNumber: 80,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                className: "sr-only rounded-[10px] bg-accent font-bold text-accent-ink focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2",
                href: "#get-access",
                children: "Skip to sign-up"
            }, void 0, false, {
                fileName: "[project]/apps/course/src/app/page.tsx",
                lineNumber: 83,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$hero$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Hero"], {}, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 92,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sections$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TrustStrip"], {}, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 93,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sections$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PainPoints"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 96,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 95,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sections$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Inclusions"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 99,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 98,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sections$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CoursePreview"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 102,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 101,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sections$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Curriculum"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 105,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 104,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sections$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Audience"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 108,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 107,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sections$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Instructor"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 111,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 110,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sections$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Comparison"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 114,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 113,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$social$2d$proof$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SocialProof"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 117,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 116,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$signup$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Signup"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 120,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 119,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$faq$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Faq"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 123,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 122,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$primitives$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Reveal"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$closing$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ClosingCta"], {}, void 0, false, {
                            fileName: "[project]/apps/course/src/app/page.tsx",
                            lineNumber: 126,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/app/page.tsx",
                        lineNumber: 125,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/course/src/app/page.tsx",
                lineNumber: 90,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$closing$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                fileName: "[project]/apps/course/src/app/page.tsx",
                lineNumber: 130,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$sticky$2d$bar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["StickyBar"], {}, void 0, false, {
                fileName: "[project]/apps/course/src/app/page.tsx",
                lineNumber: 131,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/apps/course/src/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/course/src/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0mj96jx._.js.map