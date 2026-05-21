import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

// Routes that require authentication
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
