import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { exchangePinterestCode } from '@/lib/pinterest/client'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=pinterest_denied', request.url)
    )
  }

  try {
    const redirectUri = `${process.env.APP_URL}/api/auth/pinterest/callback`
    const { accessToken, refreshToken } = await exchangePinterestCode(code, redirectUri)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        pinterestAccessToken: accessToken,
        pinterestRefreshToken: refreshToken || null,
      },
    })

    return NextResponse.redirect(
      new URL('/dashboard/settings?success=pinterest_connected', request.url)
    )
  } catch (err) {
    console.error('Pinterest OAuth error:', err)
    return NextResponse.redirect(
      new URL('/dashboard/settings?error=pinterest_failed', request.url)
    )
  }
}
