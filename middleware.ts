// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const hostHeader = req.headers.get('host')
  const hostname = hostHeader ? hostHeader.split(':')[0] : ''

  // Handle domain redirect BEFORE auth checks
  if (hostname === 'pharmshift.com') {
    const url = req.nextUrl
    url.host = 'www.pharmshift.com'
    const response = NextResponse.redirect(url, 301)

    // Preserve auth cookies during redirect
    const token = await getToken({ req, secret: process.env.AUTH_SECRET })
    if(token) {
      // Copy session cookies to new domain if some exist
      req.cookies.getAll().forEach(cookie => {
        if (cookie.name.startsWith('next-auth')) {
          response.cookies.set(cookie.name, cookie.value, {
            domain: '.pharmshift.com',
            path: '/',
            secure: true,
            sameSite: 'lax'
          })
        }
      })
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
