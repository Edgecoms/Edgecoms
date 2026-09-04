module.exports = [
"[project]/apps/course/src/lib/content.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/apps/course/src/components/ui.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/content.ts [app-ssr] (ecmascript)");
;
;
function cx(...parts) {
    return parts.filter(Boolean).join(" ");
}
function Container({ children, className, narrow = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto flex max-w-2xl flex-col items-center gap-4 text-center",
        children: [
            eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: cx("font-semibold text-xs uppercase tracking-[0.18em]", isDark ? "text-accent" : "text-ink/60"),
                children: eyebrow
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/ui.tsx",
                lineNumber: 96,
                columnNumber: 5
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-balance font-bold text-section",
                children: title
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/ui.tsx",
                lineNumber: 106,
                columnNumber: 4
            }, this),
            lead ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: cx("flex items-baseline gap-3", className),
                children: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHOW_STRUCK_PRICE"] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        className: listClassName,
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LIST_PRICE"]
                    }, void 0, false, {
                        fileName: "[project]/apps/course/src/components/ui.tsx",
                        lineNumber: 206,
                        columnNumber: 6
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: currentClassName,
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CURRENT_PRICE"]
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHOW_STRUCK_PRICE"] ? `Was ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LIST_PRICE"]}. Now ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CURRENT_PRICE"]}.` : `${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CURRENT_PRICE"]} while the course is in beta.`
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/ui.tsx",
                lineNumber: 212,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/apps/course/src/components/faq.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Faq",
    ()=>Faq
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/minus.js [app-ssr] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/content.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function Faq() {
    const [openIndex, setOpenIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Section"], {
        id: "faq",
        tone: "paper",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
            narrow: true,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-balance text-center font-bold text-section",
                    children: "Frequently asked questions"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/faq.tsx",
                    lineNumber: 15,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-10 divide-y divide-ink/10 border-ink/10 border-t border-b",
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COURSE_FAQ"].map((item, index)=>{
                        const isOpen = openIndex === index;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "aria-expanded": isOpen,
                                    className: "flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-base text-ink transition-colors hover:text-ink/60",
                                    onClick: ()=>setOpenIndex(isOpen ? null : index),
                                    type: "button",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: item.question
                                        }, void 0, false, {
                                            fileName: "[project]/apps/course/src/components/faq.tsx",
                                            lineNumber: 31,
                                            columnNumber: 10
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex size-6 shrink-0 items-center justify-center",
                                            children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                "aria-hidden": "true",
                                                className: "size-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/course/src/components/faq.tsx",
                                                lineNumber: 34,
                                                columnNumber: 12
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                "aria-hidden": "true",
                                                className: "size-4"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/course/src/components/faq.tsx",
                                                lineNumber: 36,
                                                columnNumber: 12
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/course/src/components/faq.tsx",
                                            lineNumber: 32,
                                            columnNumber: 10
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/course/src/components/faq.tsx",
                                    lineNumber: 25,
                                    columnNumber: 9
                                }, this),
                                isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-pretty pb-5 text-ink/60 leading-relaxed",
                                    children: item.answer
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/faq.tsx",
                                    lineNumber: 41,
                                    columnNumber: 10
                                }, this) : null
                            ]
                        }, item.question, true, {
                            fileName: "[project]/apps/course/src/components/faq.tsx",
                            lineNumber: 24,
                            columnNumber: 8
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/faq.tsx",
                    lineNumber: 19,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/faq.tsx",
            lineNumber: 14,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/faq.tsx",
        lineNumber: 13,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/course/src/components/primitives.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Reveal",
    ()=>Reveal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function Reveal({ children, className }) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const el = ref.current;
        if (!el) {
            return;
        }
        // Belt and braces: the CSS media query already neutralises the hidden
        // state, but there is no point running an observer for an animation that
        // cannot play.
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
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        "data-reveal": "",
        ref: ref,
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/primitives.tsx",
        lineNumber: 68,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/course/src/app/data:d8d4c9 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "submitLead",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"60c5921e899291b4198cb29bbf22227cf76b2b0523":{"name":"submitLead"}},"apps/course/src/app/actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("60c5921e899291b4198cb29bbf22227cf76b2b0523", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "submitLead");
;
}),
"[project]/apps/course/src/components/signup.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Signup",
    ()=>Signup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.bun/lucide-react@0.546.0+e14d3f224186685e/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$data$3a$d8d4c9__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/course/src/app/data:d8d4c9 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/lib/content.ts [app-ssr] (ecmascript)");
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
/** One field, with its label, error, and the wiring between them. */ function Field({ autoComplete, defaultValue, error, label, name, placeholder, type = "text" }) {
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    const errorId = `${id}-error`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "font-medium text-paper/80 text-sm",
                htmlFor: id,
                children: label
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/signup.tsx",
                lineNumber: 44,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                "aria-describedby": error ? errorId : undefined,
                "aria-invalid": error ? true : undefined,
                autoComplete: autoComplete,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cx"])(FIELD_CLASS, error ? "border-red-400 focus-visible:border-red-400" : "border-ink-border focus-visible:border-accent"),
                // React 19 resets an uncontrolled form on every submit, whatever the
                // outcome. Without this the visitor's answers vanish the moment one
                // field is rejected. The value comes back from the action.
                defaultValue: defaultValue,
                id: id,
                name: name,
                placeholder: placeholder,
                required: true,
                type: type
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/signup.tsx",
                lineNumber: 47,
                columnNumber: 4
            }, this),
            error ? /* `role="alert"` because nothing else announces this. The message is
				   produced by a server round trip, focus is on the submit button (and
				   is dropped entirely when that button disables), and
				   `aria-describedby` is only read when focus reaches the input — so
				   without a live region a screen reader user is told nothing at all
				   and assumes the form went through. */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-400 text-sm",
                id: errorId,
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/apps/course/src/components/signup.tsx",
                lineNumber: 74,
                columnNumber: 5
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/apps/course/src/components/signup.tsx",
        lineNumber: 43,
        columnNumber: 3
    }, this);
}
function Signup() {
    const [state, formAction, pending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useActionState"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$app$2f$data$3a$d8d4c9__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["submitLead"], INITIAL);
    const formRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const successRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;
    const values = state.status === "error" ? state.values : undefined;
    /*
	 * Focus has to be put somewhere deliberately after every submission.
	 *
	 * The submit button is disabled while pending, which makes the browser blur
	 * it, so focus falls to <body> on BOTH outcomes. On success the whole form
	 * then unmounts. Left alone, a keyboard or screen reader user is silently
	 * returned to the top of a very long page with no idea what happened.
	 */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (state.status === "success") {
            successRef.current?.focus();
            return;
        }
        if (state.status === "error") {
            const firstInvalid = formRef.current?.querySelector("[aria-invalid]");
            firstInvalid?.focus();
        }
    }, [
        state
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Section"], {
        id: "get-access",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "aria-live": "polite",
                    className: "sr-only",
                    role: "status",
                    children: state.status === "success" ? state.message : ""
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/signup.tsx",
                    lineNumber: 129,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold text-accent text-xs uppercase tracking-[0.18em]",
                                    children: "Get access"
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/signup.tsx",
                                    lineNumber: 136,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-balance font-bold text-section",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHOW_STRUCK_PRICE"] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            "It was ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LIST_PRICE"],
                                            ".",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-accent",
                                                children: "Now it's free."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                                lineNumber: 144,
                                                columnNumber: 10
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            "Free ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-accent",
                                                children: "while it's in beta."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                                lineNumber: 148,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/signup.tsx",
                                    lineNumber: 140,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PriceTag"], {
                                    currentClassName: "font-bold text-5xl text-accent sm:text-6xl",
                                    listClassName: "font-bold text-4xl text-muted-dark line-through decoration-2"
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/signup.tsx",
                                    lineNumber: 153,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-pretty text-muted leading-relaxed sm:text-lg",
                                    children: "Tell us where to send it and the whole course is yours — every module, every template, every future update. No card, no trial, nothing to cancel."
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/signup.tsx",
                                    lineNumber: 158,
                                    columnNumber: 7
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "flex flex-col gap-2.5",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COURSE_INCLUSIONS"].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-start gap-3 text-paper/90 text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    "aria-hidden": "true",
                                                    className: "mt-0.5 size-4 shrink-0 text-accent"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/course/src/components/signup.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 10
                                                }, this),
                                                item.title
                                            ]
                                        }, item.title, true, {
                                            fileName: "[project]/apps/course/src/components/signup.tsx",
                                            lineNumber: 166,
                                            columnNumber: 9
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/apps/course/src/components/signup.tsx",
                                    lineNumber: 164,
                                    columnNumber: 7
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/course/src/components/signup.tsx",
                            lineNumber: 135,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-2xl border border-ink-border bg-ink-raised p-6 sm:p-8",
                            children: state.status === "success" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center gap-4 py-8 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex size-12 items-center justify-center rounded-full bg-accent/15",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            "aria-hidden": "true",
                                            className: "size-6 text-accent"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/course/src/components/signup.tsx",
                                            lineNumber: 185,
                                            columnNumber: 10
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 184,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-bold text-2xl text-paper",
                                        ref: successRef,
                                        tabIndex: -1,
                                        children: "You're in"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 189,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-pretty text-muted leading-relaxed",
                                        children: state.message
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 196,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 183,
                                columnNumber: 8
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                action: formAction,
                                className: "flex flex-col gap-4",
                                ref: formRef,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-bold text-paper text-xl",
                                                children: "Send me the course"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                                lineNumber: 207,
                                                columnNumber: 10
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-muted text-sm",
                                                children: "Three fields. We'll email your access link."
                                            }, void 0, false, {
                                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                                lineNumber: 210,
                                                columnNumber: 10
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 206,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                        autoComplete: "name",
                                        defaultValue: values?.name,
                                        error: fieldErrors?.name,
                                        label: "Your name",
                                        name: "name",
                                        placeholder: "Alex Mercer"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 215,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                        autoComplete: "email",
                                        defaultValue: values?.email,
                                        error: fieldErrors?.email,
                                        label: "Email address",
                                        name: "email",
                                        placeholder: "alex@yourstore.com",
                                        type: "email"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 223,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                        autoComplete: "tel",
                                        defaultValue: values?.phone,
                                        error: fieldErrors?.phone,
                                        label: "Phone number",
                                        name: "phone",
                                        placeholder: "+1 555 000 1234",
                                        type: "tel"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 232,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        "aria-hidden": "true",
                                        className: "hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: "website",
                                                children: "Website"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                                lineNumber: 247,
                                                columnNumber: 10
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                autoComplete: "off",
                                                id: "website",
                                                name: "website",
                                                tabIndex: -1,
                                                type: "text"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                                lineNumber: 248,
                                                columnNumber: 10
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 246,
                                        columnNumber: 9
                                    }, this),
                                    state.status === "error" && !fieldErrors ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "rounded-[10px] border border-red-400/40 bg-red-400/10 px-4 py-3 text-red-300 text-sm leading-relaxed",
                                        role: "alert",
                                        children: state.message
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 258,
                                        columnNumber: 10
                                    }, this) : null,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CtaButton"], {
                                        disabled: pending,
                                        type: "submit",
                                        children: pending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$lucide$2d$react$40$0$2e$546$2e$0$2b$e14d3f224186685e$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    "aria-hidden": "true",
                                                    className: "size-4 animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/course/src/components/signup.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 12
                                                }, this),
                                                "Sending…"
                                            ]
                                        }, void 0, true) : `Send me the course — ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CURRENT_PRICE"].toLowerCase()}`
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 266,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted-dark text-xs leading-relaxed",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$lib$2f$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRIVACY_NOTICE"]
                                    }, void 0, false, {
                                        fileName: "[project]/apps/course/src/components/signup.tsx",
                                        lineNumber: 280,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/course/src/components/signup.tsx",
                                lineNumber: 201,
                                columnNumber: 8
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/signup.tsx",
                            lineNumber: 181,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/course/src/components/signup.tsx",
                    lineNumber: 133,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/signup.tsx",
            lineNumber: 121,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/signup.tsx",
        lineNumber: 120,
        columnNumber: 3
    }, this);
}
}),
"[project]/apps/course/src/components/sticky-bar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StickyBar",
    ()=>StickyBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.bun/next@16.2.9+e12028118a4bd84f/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/course/src/components/ui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function StickyBar() {
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onScroll = ()=>{
            const target = document.getElementById("get-access");
            const pastHero = window.scrollY > window.innerHeight * 0.85;
            // Genuinely overlapping the viewport, not merely "somewhere above".
            let formInView = false;
            if (target) {
                const rect = target.getBoundingClientRect();
                formInView = rect.top < window.innerHeight && rect.bottom > 0;
            }
            setVisible(pastHero && !formInView);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        window.addEventListener("resize", onScroll);
        return ()=>{
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `fixed inset-x-0 bottom-0 z-50 border-ink-border border-t bg-ink/95 backdrop-blur transition-transform duration-300 ease-[var(--ease-out-strong)] motion-reduce:transition-none ${visible ? "translate-y-0" : "translate-y-full"}`,
        // Inert while off-screen, so a keyboard user cannot tab into a bar they
        // cannot see.
        inert: !visible,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
            className: "flex items-center justify-between gap-4 py-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-baseline gap-2.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PriceTag"], {
                            currentClassName: "font-bold text-accent text-xl",
                            listClassName: "font-semibold text-muted-dark text-sm line-through"
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
                            lineNumber: 60,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "hidden text-muted text-sm sm:inline",
                            children: "· full course access"
                        }, void 0, false, {
                            fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
                            lineNumber: 64,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
                    lineNumber: 59,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$bun$2f$next$40$16$2e$2$2e$9$2b$e12028118a4bd84f$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$course$2f$src$2f$components$2f$ui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CtaLink"], {
                    className: "shrink-0",
                    href: "#get-access",
                    size: "md",
                    children: "Get free access"
                }, void 0, false, {
                    fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
                    lineNumber: 69,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
            lineNumber: 58,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/course/src/components/sticky-bar.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, this);
}
}),
];

//# sourceMappingURL=apps_course_src_07x--xl._.js.map