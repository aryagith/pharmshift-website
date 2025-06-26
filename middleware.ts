// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host')

  if (host === 'pharmshift.com') {
    const url = req.nextUrl
    url.host = 'www.pharmshift.com'
    return NextResponse.redirect(url, 301)
  }
  console.log('Middleware executed for host:', host)
  return NextResponse.next()
}
