import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { PinterestClient } from '@/lib/pinterest/client'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pinId, boardId } = await req.json()

    if (!pinId || !boardId) {
      return NextResponse.json(
        { error: 'Pin ID and Board ID are required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user?.pinterestAccessToken) {
      return NextResponse.json(
        { error: 'Pinterest account not connected' },
        { status: 400 }
      )
    }

    // Get pin
    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
    })

    if (!pin || pin.userId !== user.id) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 })
    }

    if (pin.status === 'posted') {
      return NextResponse.json(
        { error: 'Pin already posted' },
        { status: 400 }
      )
    }

    // Post to Pinterest
    const pinterestClient = new PinterestClient(user.pinterestAccessToken)

    try {
      const pinterestPinId = await pinterestClient.createPin({
        boardId,
        title: pin.title,
        description: pin.description,
        imageUrl: pin.imageUrl,
        link: pin.destinationUrl,
        altText: pin.title,
      })

      // Update pin status
      await prisma.pin.update({
        where: { id: pinId },
        data: {
          status: 'posted',
          pinterestPinId,
          pinterestBoardId: boardId,
          postedAt: new Date(),
        },
      })

      // Track analytics
      await prisma.analytics.create({
        data: {
          userId: user.id,
          affiliateLinkId: pin.affiliateLinkId,
          pinId: pin.id,
          eventType: 'impression',
          source: 'pinterest',
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Pin posted successfully!',
        pinterestPinId,
      })
    } catch (error: any) {
      // Update pin with error
      await prisma.pin.update({
        where: { id: pinId },
        data: {
          status: 'failed',
          errorMessage: error.message,
        },
      })

      return NextResponse.json(
        { error: `Failed to post to Pinterest: ${error.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error posting pin:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
