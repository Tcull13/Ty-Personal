import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { isValidAmazonUrl, scrapeAmazonProduct, addAffiliateTag } from '@/lib/amazon-scraper'
import { generateCompletePinContent } from '@/lib/ai/pin-generator'
import { PLAN_LIMITS } from '@/lib/stripe/client'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url, pinStyle, includePrice, customText } = await req.json()

    // Validate Amazon URL
    if (!isValidAmazonUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid Amazon product URL' },
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

    const todaysPinsCount = await prisma.affiliateLink.count({
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

    // Scrape Amazon product
    const product = await scrapeAmazonProduct(url)

    // Add affiliate tag
    const affiliateTag = process.env.AMAZON_ASSOCIATE_TAG || 'your-tag-20'
    const affiliateUrl = addAffiliateTag(url, affiliateTag)

    // Create affiliate link record
    const affiliateLink = await prisma.affiliateLink.create({
      data: {
        userId: user.id,
        originalUrl: url,
        affiliateUrl,
        productId: product.productId,
        productTitle: product.title,
        productPrice: product.price,
        productImageUrl: product.imageUrl,
        productCategory: product.category,
        pinStyle: pinStyle || 'auto',
        includePrice: includePrice !== false,
        customText,
        status: 'processing',
      },
    })

    // Generate pin content asynchronously
    try {
      const pinContent = await generateCompletePinContent(
        product,
        pinStyle || 'auto',
        customText
      )

      // Create pin record
      const pin = await prisma.pin.create({
        data: {
          userId: user.id,
          affiliateLinkId: affiliateLink.id,
          title: pinContent.title,
          description: pinContent.description,
          imageUrl: pinContent.imageUrl,
          destinationUrl: affiliateUrl,
          generatedWith: pinContent.generatedWith,
          generationPrompt: pinContent.prompt,
          status: 'draft',
        },
      })

      // Update affiliate link status
      await prisma.affiliateLink.update({
        where: { id: affiliateLink.id },
        data: { status: 'active' },
      })

      return NextResponse.json({
        success: true,
        affiliateLink,
        pin,
        message: 'Pin generated successfully! Ready to post.',
      })
    } catch (error: any) {
      // Update affiliate link with error
      await prisma.affiliateLink.update({
        where: { id: affiliateLink.id },
        data: {
          status: 'error',
          errorMessage: error.message,
        },
      })

      return NextResponse.json(
        {
          error: 'Failed to generate pin content',
          affiliateLink,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error creating affiliate link:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
