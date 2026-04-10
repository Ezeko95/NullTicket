import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cookie name must match what the backend sets after login.
// Update this constant when the backend team confirms the name.
const SESSION_COOKIE = 'token';

const PUBLIC_PATHS = ['/login'];

export function proxy(request: NextRequest) {
  if (process.env.DISABLE_AUTH === 'true') return;

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (!isPublic && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/login' && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
