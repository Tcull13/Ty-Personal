import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { PinterestClient } from '@/lib/pinterest/client'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { pinterestAccessToken: true },
  })

  if (!user?.pinterestAccessToken) {
    return NextResponse.json(
      { error: 'Pinterest not connected. Please connect your Pinterest account in Settings.' },
      { status: 400 }
    )
  }

  try {
    const client = new PinterestClient(user.pinterestAccessToken)
    const boards = await client.getBoards()
    return NextResponse.json({ boards })
  } catch (err) {
    console.error('Error fetching Pinterest boards:', err)
    return NextResponse.json({ error: 'Failed to fetch Pinterest boards' }, { status: 500 })
  }
}
