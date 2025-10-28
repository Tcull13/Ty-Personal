import { prisma } from '../prisma'
import { PinterestClient } from '../pinterest/client'

/**
 * Process scheduled pins and post them to Pinterest
 * This should be run by a cron job (e.g., every 5 minutes)
 */
export async function processScheduledPins() {
  console.log('Processing scheduled pins...')

  try {
    // Find all pending scheduled posts that are due
    const now = new Date()

    const scheduledPosts = await prisma.scheduledPost.findMany({
      where: {
        scheduledFor: {
          lte: now,
        },
        status: 'pending',
      },
      take: 10, // Process 10 at a time
      orderBy: {
        scheduledFor: 'asc',
      },
    })

    console.log(`Found ${scheduledPosts.length} scheduled posts to process`)

    for (const scheduledPost of scheduledPosts) {
      try {
        // Update status to processing
        await prisma.scheduledPost.update({
          where: { id: scheduledPost.id },
          data: {
            status: 'processing',
            lastAttempt: new Date(),
            attempts: { increment: 1 },
          },
        })

        // Get the pin
        const pin = await prisma.pin.findUnique({
          where: { id: scheduledPost.pinId },
          include: {
            user: true,
          },
        })

        if (!pin) {
          throw new Error('Pin not found')
        }

        if (!pin.user.pinterestAccessToken) {
          throw new Error('Pinterest not connected')
        }

        if (!pin.user.pinterestBoardIds || pin.user.pinterestBoardIds.length === 0) {
          throw new Error('No Pinterest boards configured')
        }

        // Post to Pinterest
        const pinterestClient = new PinterestClient(pin.user.pinterestAccessToken)

        const pinterestPinId = await pinterestClient.createPin({
          boardId: pin.user.pinterestBoardIds[0], // Use first board
          title: pin.title,
          description: pin.description,
          imageUrl: pin.imageUrl,
          link: pin.destinationUrl,
          altText: pin.title,
        })

        // Update pin status
        await prisma.pin.update({
          where: { id: pin.id },
          data: {
            status: 'posted',
            pinterestPinId,
            pinterestBoardId: pin.user.pinterestBoardIds[0],
            postedAt: new Date(),
          },
        })

        // Update scheduled post status
        await prisma.scheduledPost.update({
          where: { id: scheduledPost.id },
          data: {
            status: 'completed',
          },
        })

        // Track analytics
        await prisma.analytics.create({
          data: {
            userId: pin.userId,
            affiliateLinkId: pin.affiliateLinkId,
            pinId: pin.id,
            eventType: 'impression',
            source: 'pinterest',
          },
        })

        console.log(`Successfully posted pin ${pin.id}`)
      } catch (error: any) {
        console.error(`Failed to process scheduled post ${scheduledPost.id}:`, error)

        // Update with error
        await prisma.scheduledPost.update({
          where: { id: scheduledPost.id },
          data: {
            status: scheduledPost.attempts >= 3 ? 'failed' : 'pending', // Retry up to 3 times
            errorMessage: error.message,
          },
        })
      }
    }

    console.log('Scheduled pins processing complete')
  } catch (error) {
    console.error('Error processing scheduled pins:', error)
  }
}

/**
 * Schedule a pin for posting
 */
export async function schedulePinForPosting(
  pinId: string,
  scheduledFor: Date
) {
  return await prisma.scheduledPost.create({
    data: {
      pinId,
      scheduledFor,
      status: 'pending',
    },
  })
}

/**
 * Auto-schedule pins for users with auto-posting enabled
 * This distributes their pins evenly throughout the day based on their frequency setting
 */
export async function autoScheduleUserPins(userId: string) {
  // Get user settings
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user || !user.autoPostEnabled) {
    return
  }

  // Get draft pins
  const draftPins = await prisma.pin.findMany({
    where: {
      userId,
      status: 'draft',
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  if (draftPins.length === 0) {
    return
  }

  // Calculate posting times based on frequency
  const postsPerDay = user.postingFrequency || 1
  const hoursPerPost = 24 / postsPerDay

  let currentDate = new Date()
  currentDate.setHours(currentDate.getHours() + 1) // Start 1 hour from now

  for (const pin of draftPins) {
    // Check if already scheduled
    const existingSchedule = await prisma.scheduledPost.findFirst({
      where: { pinId: pin.id },
    })

    if (!existingSchedule) {
      await schedulePinForPosting(pin.id, currentDate)

      // Update pin status
      await prisma.pin.update({
        where: { id: pin.id },
        data: { status: 'scheduled' },
      })

      // Increment time for next post
      currentDate = new Date(currentDate.getTime() + hoursPerPost * 60 * 60 * 1000)
    }
  }
}
