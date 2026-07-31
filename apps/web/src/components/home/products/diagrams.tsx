import type { ReactNode } from "react";
import BundlesDiagram from "./edge-bundles";
import CartDiagram from "./edge-cart";
import CurrencyDiagram from "./edge-currency";
import ReviewsDiagram from "./edge-reviews";
import SubscriptionsDiagram from "./edge-subscriptions";
import TimerDiagram from "./edge-timer";
import TrackproofDiagram from "./trackproof";

/**
 * Illustration per product slug. All seven are drawn at card scale, so nothing
 * needs a transform to sit in a grid cell — the product pages scale them up
 * with CSS where they have more room.
 */
export const DIAGRAMS: Record<string, ReactNode> = {
	"edge-bundles": <BundlesDiagram />,
	"edge-cart": <CartDiagram />,
	"edge-currency": <CurrencyDiagram />,
	"edge-reviews": <ReviewsDiagram />,
	"edge-subscriptions": <SubscriptionsDiagram />,
	"edge-timer": <TimerDiagram />,
	trackproof: <TrackproofDiagram />,
};
