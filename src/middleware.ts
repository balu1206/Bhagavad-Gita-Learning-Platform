import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

// Public routes that anyone can access without signing in
const PUBLIC_PREFIXES = ['/chapters'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always pass pathname as a header so server components can read it
  const res = NextResponse.next();
  res.headers.set('x-pathname', pathname);

  // Check if this route is publicly browsable
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return res;
  }

  // All other protected routes: require a valid session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

// Match every route inside the (app) group that we previously protected
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chapters/:path*',
    '/listen/:path*',
    '/bookmarks/:path*',
    '/journey/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
};
