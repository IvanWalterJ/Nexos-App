import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // The publishable key (sb_publishable_*) is client-only and cannot be used
  // in middleware for server-side session verification.
  // Route protection is handled client-side in each page component.
  // This middleware only handles static rewrites if needed.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
