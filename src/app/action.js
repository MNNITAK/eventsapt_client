'use server'
import { cookies } from 'next/headers'
export async function create(data) {
  const cookieStore = await cookies()  
  if(cookieStore.has('refreshToken')){
    cookieStore.delete('refreshToken')
  } 
  if(cookieStore.has('accessToken')){
    cookieStore.delete('accessToken')
  }
 cookieStore.set({
    name:"refreshToken",
    value:data?.refreshToken,
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge:7 * 24 * 60 * 60 //
 })
 cookieStore.set({
    name:"accessToken",
    value:data?.accessToken,
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge:60 * 60 // 1 hour for access token
 })
}

export const getCookies = async () => {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  return refreshToken || ""
}