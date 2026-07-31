import type { ReactNode } from "react";
import BundlesDiagram from "./edge-bundles";
import CartDiagram from "./edge-cart";
import CurrencyDiagram from "./edge-currency";
import ReviewsDiagram from "./edge-reviews";
import SubscriptionsDiagram from "./edge-subscriptions";
import TimerDiagram from "./edge-timer";

/**
 * Illustration per product slug. All six are drawn at card scale, so nothing
 * needs a transform to sit in a grid cell — the product page scales them up
 * with CSS where it has more room.
 */
export const DIAGRAMS: Record<string, ReactNode> = {
	"edge-bundles": <BundlesDiagram />,
	"edge-cart": <CartDiagram />,
	"edge-currency": <CurrencyDiagram />,
	"edge-reviews": <ReviewsDiagram />,
	"edge-subscriptions": <SubscriptionsDiagram />,
	"edge-timer": <TimerDiagram />,
};
