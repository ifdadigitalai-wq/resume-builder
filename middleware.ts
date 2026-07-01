import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip static assets, Next.js internals, and API auth
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/api/auth/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const isOfficerPath = pathname.startsWith('/admin');
  const isStudentPath = !isOfficerPath && 
                        !pathname.startsWith('/api') && 
                        pathname !== '/login' && 
                        pathname !== '/register' && 
                        pathname !== '/';

  const token = req.cookies.get('token')?.value || req.cookies.get('session_token')?.value
  const payload = token ? await verifyToken(token) : null

  if (!payload) {
    // If not authenticated, restrict protected routes to login
    if (isOfficerPath || isStudentPath) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  }

  // Mismatch token redirection
  if (isOfficerPath && payload.role !== 'OFFICER') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  if (isStudentPath && payload.role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url))
  }

  // Prevent authenticated user from viewing login/register
  if (pathname === '/login' || pathname === '/register') {
    if (payload.role === 'OFFICER') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  const res = NextResponse.next()
  res.headers.set('x-user-id', payload.sub)
  res.headers.set('x-user-role', payload.role)
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}