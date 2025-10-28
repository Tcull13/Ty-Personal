import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { PLAN_LIMITS } from '@/lib/stripe/client'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user to check plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get total pins
    const totalPins = await prisma.pin.count({
      where: { userId: session.user.id },
    })

    // Get posted pins
    const postedPins = await prisma.pin.count({
      where: {
        userId: session.user.id,
        status: 'posted',
      },
    })

    // Get today's pins
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayPins = await prisma.affiliateLink.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: today,
        },
      },
    })

    // Get daily limit based on plan
    const planLimit = PLAN_LIMITS[user.planTier as keyof typeof PLAN_LIMITS]?.maxPinsPerDay || 3

    return NextResponse.json({
      totalPins,
      postedPins,
      todayPins,
      dailyLimit: planLimit,
    })
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
