import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { PLAN_LIMITS } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, imageUrl, affiliateUrl, productTitle } = await req.json()

    // Validate input
    if (!title || !description || !imageUrl || !affiliateUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user with plan info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check rate limits
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todaysPinsCount = await prisma.pin.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
        },
      },
    })

    const planLimit = PLAN_LIMITS[user.planTier as keyof typeof PLAN_LIMITS]?.maxPinsPerDay || 3

    if (todaysPinsCount >= planLimit) {
      return NextResponse.json(
        {
          error: `Daily limit reached. Your ${user.planTier} plan allows ${planLimit} pins per day.`,
          upgrade: true,
        },
        { status: 429 }
      )
    }

    // Extract product ID from Amazon URL if possible
    let productId = 'manual'
    const asinMatch = affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/) ||
                      affiliateUrl.match(/\/gp\/product\/([A-Z0-9]{10})/)
    if (asinMatch) {
      productId = asinMatch[1]
    }

    // Create affiliate link record
    const affiliateLink = await prisma.affiliateLink.create({
      data: {
        userId: user.id,
        originalUrl: affiliateUrl,
        affiliateUrl: affiliateUrl,
        productId: productId,
        productTitle: productTitle || title,
        productPrice: null,
        productImageUrl: imageUrl,
        productCategory: null,
        pinStyle: 'manual',
        includePrice: false,
        status: 'active',
      },
    })

    // Create pin record
    const pin = await prisma.pin.create({
      data: {
        userId: user.id,
        affiliateLinkId: affiliateLink.id,
        title: title,
        description: description,
        imageUrl: imageUrl,
        destinationUrl: affiliateUrl,
        generatedWith: 'manual',
        generationPrompt: 'Manually created by user',
        status: 'draft',
      },
    })

    return NextResponse.json({
      success: true,
      pin,
      affiliateLink,
      message: 'Pin created successfully! Ready to post.',
    })
  } catch (error: any) {
    console.error('Error creating manual pin:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create pin' },
      { status: 500 }
    )
  }
}
