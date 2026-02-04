import { NextResponse } from 'next/server';

// Middleware disabled - authentication handled in backend
export async function middleware(request) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pages except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
