import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { createCheckoutSession } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planTier } = await req.json()

    if (!['basic', 'pro', 'enterprise'].includes(planTier)) {
      return NextResponse.json(
        { error: 'Invalid plan tier' },
        { status: 400 }
      )
    }

    const checkoutUrl = await createCheckoutSession(
      session.user.id,
      planTier,
      session.user.email
    )

    return NextResponse.json({ url: checkoutUrl })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
