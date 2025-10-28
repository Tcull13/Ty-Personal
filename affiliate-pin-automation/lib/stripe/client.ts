import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const PLAN_LIMITS = {
  free: {
    maxPinsPerDay: 3,
    maxBoards: 1,
    features: ['Basic pin generation', 'Manual posting'],
  },
  basic: {
    maxPinsPerDay: 20,
    maxBoards: 5,
    features: ['AI pin generation', 'Auto-posting', 'Basic analytics', 'Email support'],
    price: 19.99,
    stripePriceId: process.env.STRIPE_PRICE_ID_BASIC,
  },
  pro: {
    maxPinsPerDay: 100,
    maxBoards: 20,
    features: [
      'Advanced AI generation',
      'Auto-posting',
      'Advanced analytics',
      'Scheduling',
      'Priority support',
      'Canva integration',
    ],
    price: 49.99,
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO,
  },
  enterprise: {
    maxPinsPerDay: 500,
    maxBoards: -1, // unlimited
    features: [
      'Everything in Pro',
      'Unlimited boards',
      'Team collaboration',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
    price: 199.99,
    stripePriceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
  },
}

/**
 * Create a Stripe checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  planTier: 'basic' | 'pro' | 'enterprise',
  customerEmail: string
): Promise<string> {
  const plan = PLAN_LIMITS[planTier]

  if (!plan.stripePriceId) {
    throw new Error(`Price ID not configured for ${planTier} plan`)
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: customerEmail,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.APP_URL}/pricing?canceled=true`,
    metadata: {
      userId,
      planTier,
    },
  })

  return session.url!
}

/**
 * Create a Stripe customer portal session
 */
export async function createPortalSession(customerId: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.APP_URL}/dashboard/settings`,
  })

  return session.url
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(customerId: string): Promise<boolean> {
  if (!customerId) return false

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  })

  return subscriptions.data.length > 0
}

/**
 * Get user's current plan tier
 */
export async function getUserPlanTier(customerId: string): Promise<string> {
  if (!customerId) return 'free'

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  })

  if (subscriptions.data.length === 0) return 'free'

  const subscription = subscriptions.data[0]
  const priceId = subscription.items.data[0].price.id

  // Match price ID to plan tier
  if (priceId === process.env.STRIPE_PRICE_ID_BASIC) return 'basic'
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return 'pro'
  if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE) return 'enterprise'

  return 'free'
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.cancel(subscriptionId)
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}
