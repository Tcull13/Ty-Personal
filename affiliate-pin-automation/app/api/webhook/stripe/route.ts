import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/client'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const session = event.data.object as Stripe.Checkout.Session

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        const userId = session.metadata?.userId

        if (!userId) {
          console.error('No userId in session metadata')
          break
        }

        // Update user with subscription info
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            planTier: session.metadata?.planTier || 'basic',
          },
        })

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )

          // Update subscription period
          await prisma.user.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          })
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Update subscription details
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Downgrade to free plan
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            planTier: 'free',
          },
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
