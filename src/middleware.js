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
};   // prev middleware code struct


// actual middleware code struct
// import { cookies } from "next/headers";
// import { NextResponse } from 'next/server';
// export async function middleware(request) {
//   const clientValidityToken = request.cookies;
//   const refreshToken = clientValidityToken.get("refreshToekn");
//   const accessToken = clientValidityToken.get("accessToken");
  
// }

// export const config = {
//   matcher: [
//     // Match all pages except static files and API r   ou/((?!_next/static|_next/image|favicon.ico|api).*)',\\
//     "/", "/home/:path", "/profile/:path*", "/chatpen/:path"
//   ],
// };
