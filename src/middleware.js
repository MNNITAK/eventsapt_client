import { cookies } from "next/headers";
import { NextResponse } from 'next/server';
export async function middleware(request) {
  const clientRefreshToken = request.cookies.get("refreshToken")?.value;
  const publicUrl = process.env.NEXT_PUBLIC_FRNT;
  const url = request.nextUrl;
  if (!publicUrl) {
    throw new Error("Missing frontendUrl env");
  }
  const redirectLoginUrl = new URL("/authPage/user", publicUrl);
  if (!clientRefreshToken) {
    return NextResponse.redirect(redirectLoginUrl);
  }
  try {
    let clientAuthTokenCheck = await fetch(`${process.env.backend_api}/cmn/checkClientAuth`, {
      cache: "no-cache",
      headers: {
        "wedoraCredentials": clientRefreshToken
      }
    })
    clientAuthTokenCheck = await clientAuthTokenCheck.json();
    if (clientAuthTokenCheck.statusCode >= 400) {
      return NextResponse.redirect(redirectLoginUrl);
    } else if (clientAuthTokenCheck.statusCode >= 200 && clientAuthTokenCheck.statusCode < 300) {
      const typeClient = clientAuthTokenCheck?.data?.typeClient;
      const redirectHomeURL = new URL(`/home/${encodeURIComponent(typeClient)}?tab=home`, process.env.NEXT_PUBLIC_FRNT);
      if (url.pathname === "/") {
        return NextResponse.redirect(redirectHomeURL);
      }
      const segments = url.pathname.split("/");
      if (segments[1] === "home" && segments[2] !== typeClient) {
        return NextResponse.redirect(redirectHomeURL);
      }

      // Otherwise continue as normal
      return NextResponse.next();
    }

  } catch (error) {
    const redirectErrorPage = new URL("/unavailable", publicUrl);
    return NextResponse.redirect(redirectErrorPage);
  }
}

// export async function middleware(request) {
//   const cookieStore = await cookies()
//   const hasCookie = cookieStore.has('refreshToken')
//   const loginUrl = new URL('/authPage/user', process.env.NEXT_PUBLIC_FRNT);
//   if(!hasCookie){
//     return NextResponse.redirect(loginUrl)
//   }
//   try {
//     let rftResp=await fetch(`${process.env.backend_api}/cmn/checkClientAuth`,{
//       cache:"no-cache",
//       headers:{
//         "wedoraCredentials":cookieStore?.get("refreshToken")?.value
//       }
//     })
//     rftResp=await rftResp.json()
//     if(request.nextUrl.pathname=="/"){
//       const home = new URL(`/home/${encodeURIComponent(rftResp?.data?.typeClient)}?tab=home`, process.env.NEXT_PUBLIC_FRNT);
//     if(!(home.pathname.includes(rftResp?.data?.typeClient))){
//       return NextResponse.redirect(home); 
//     }
//     if (request.nextUrl.pathname !== home.pathname) {
//       return NextResponse.redirect(home);
//     }
//     }
//   } catch (error) {
//     cookieStore.delete('refreshToken')
//     console.log(error);
//     if(error){
//       return NextResponse.redirect(loginUrl)
//     }
//   }
//   return NextResponse.next();
// }
export const config = {
  matcher: [
    // Match all pages except static files and API r   ou/((?!_next/static|_next/image|favicon.ico|api).*)',\\
    "/", "/home/:path", "/profile/:path*", "/chatpen/:path"
  ],
};
