import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { autoPostEnabled, postingFrequency } = body

  const updateData: Record<string, unknown> = {}

  if (typeof autoPostEnabled === 'boolean') {
    updateData.autoPostEnabled = autoPostEnabled
  }

  if (typeof postingFrequency === 'number' && postingFrequency > 0) {
    updateData.postingFrequency = postingFrequency
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
    select: { autoPostEnabled: true, postingFrequency: true },
  })

  return NextResponse.json(user)
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      autoPostEnabled: true,
      postingFrequency: true,
      pinterestAccessToken: true,
      pinterestBoardIds: true,
    },
  })

  return NextResponse.json({
    autoPostEnabled: user?.autoPostEnabled ?? false,
    postingFrequency: user?.postingFrequency ?? 3,
    pinterestConnected: !!user?.pinterestAccessToken,
    pinterestBoardIds: user?.pinterestBoardIds ?? [],
  })
}
