// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const hostHeader = req.headers.get('host')
  const hostname = hostHeader ? hostHeader.split(':')[0] : ''

  if (hostname === 'pharmshift.com') {
    const url = req.nextUrl
    url.host = 'www.pharmshift.com'
    return NextResponse.redirect(url, 301)
  }
  console.log('Middleware executed for host:', hostname)
  return NextResponse.next()
}
