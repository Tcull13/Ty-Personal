import { Router, Request, Response, raw } from "express";
import { db } from "../db/index.js";
import { storefronts } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "./middleware.js";

const upgradeRouter = Router();
export const webhookRouter = Router();

// Lazy-init Stripe — gracefully handles missing key
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.warn("STRIPE_SECRET_KEY not set — Stripe features disabled");
    return null;
  }
  const Stripe = require("stripe");
  return new Stripe(key);
}

const PRICE_ID = process.env.STRIPE_PRICE_ID || "price_doorway_premium_19";

/**
 * POST /api/upgrade
 * Creates a Stripe Checkout Session for the $19/mo Doorway Premium plan.
 * Requires auth.
 */
upgradeRouter.post("/api/upgrade", requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const biz = authReq.storefront!;

    // If no Stripe key, return a graceful "coming soon" response
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({
        error: "Payment processing is not configured yet. Please check back soon.",
      });
    }

    // Look up full storefront for Stripe customer ID
    const fullBiz = db
      .select()
      .from(storefronts)
      .where(eq(storefronts.id, biz.id))
      .get();

    if (!fullBiz) {
      return res.status(404).json({ error: "Storefront not found" });
    }

    // If already premium, don't let them subscribe again
    if (fullBiz.plan === "premium" && fullBiz.subscriptionStatus === "active") {
      return res.status(400).json({ error: "You're already on the Premium plan!" });
    }

    let customerId = fullBiz.stripeCustomerId || "";

    // Create or retrieve Stripe Customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: fullBiz.email || undefined,
        name: fullBiz.businessName,
        metadata: { storefrontId: String(fullBiz.id), slug: fullBiz.slug },
      });
      customerId = customer.id;

      // Save customer ID to DB
      db.update(storefronts)
        .set({ stripeCustomerId: customerId })
        .where(eq(storefronts.id, fullBiz.id))
        .run();
    }

    const baseUrl = process.env.PUBLIC_URL || `http://localhost:3000`;

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?tab=settings&upgrade=success`,
      cancel_url: `${baseUrl}/upgrade?canceled=true`,
      metadata: {
        storefrontId: String(fullBiz.id),
        slug: fullBiz.slug,
      },
      subscription_data: {
        metadata: {
          storefrontId: String(fullBiz.id),
          slug: fullBiz.slug,
        },
      },
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe upgrade error:", err.message);
    res.status(500).json({ error: "Failed to create checkout session: " + err.message });
  }
});

/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events (checkout.session.completed, etc.)
 * Raw body is needed for signature verification.
 */
webhookRouter.post(
  "/api/stripe/webhook",
  raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    let event: any;

    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).json({ error: "Invalid signature" });
      }
    } else {
      // No webhook secret configured — parse the body directly (dev mode)
      try {
        event = JSON.parse(req.body.toString());
      } catch {
        return res.status(400).json({ error: "Invalid payload" });
      }
    }

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const storefrontId = parseInt(
        session.metadata?.storefrontId || session.subscription?.metadata?.storefrontId || "0"
      );

      if (storefrontId) {
        db.update(storefronts)
          .set({
            plan: "premium",
            stripeSubscriptionId: session.subscription || "",
            subscriptionStatus: "active",
          })
          .where(eq(storefronts.id, storefrontId))
          .run();

        console.log(`✅ Storefront ${storefrontId} upgraded to Premium`);
      }
    }

    // Handle customer.subscription.deleted (cancellation)
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const storefrontId = parseInt(subscription.metadata?.storefrontId || "0");

      if (storefrontId) {
        db.update(storefronts)
          .set({
            plan: "free",
            subscriptionStatus: "canceled",
          })
          .where(eq(storefronts.id, storefrontId))
          .run();

        console.log(`❌ Storefront ${storefrontId} downgraded to Free`);
      }
    }

    res.json({ received: true });
  }
);

export default upgradeRouter;
