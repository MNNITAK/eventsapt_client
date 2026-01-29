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
    value:data?.data?.refreshToken,
    httpOnly:true,
    secure:true,
    sameSite:"none",
    maxAge:60*60
 })
}
export const getCookies = async () => {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  return refreshToken || ""
}