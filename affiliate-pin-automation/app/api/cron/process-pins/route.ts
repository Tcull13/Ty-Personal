import { NextRequest, NextResponse } from 'next/server'
import { processScheduledPins } from '@/lib/scheduler/pin-scheduler'

/**
 * Cron endpoint to process scheduled pins
 * This should be called periodically (e.g., every 5 minutes) by a cron service
 *
 * Security: In production, verify the request is from your cron service
 * using a secret token in the Authorization header
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await processScheduledPins()

    return NextResponse.json({ success: true, message: 'Scheduled pins processed' })
  } catch (error: any) {
    console.error('Error in cron job:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process scheduled pins' },
      { status: 500 }
    )
  }
}
