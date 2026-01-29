'use server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';
export async function logout() {
   try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const loginUrl = new URL('/authPage/user', process.env.NEXT_PUBLIC_FRNT);
    if(!refreshToken){
        return NextResponse.redirect(loginUrl)
    }
    const logoutResponse=await fetch(`${process.env.backend_api}/cmn/logout`,{
        method:'POST',
         headers:{
             "wedoraCredentials":refreshToken
         }
     }) 
    const readableLogoutResponse=await logoutResponse.json()
    //console.log(readableLogoutResponse);
    cookieStore.delete('refreshToken')
    NextResponse.redirect(loginUrl)
   } catch (error) {
        if(refreshToken){
            cookieStore.delete('refreshToken')
        }
   }
}