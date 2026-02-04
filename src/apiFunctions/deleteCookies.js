'use server'
import { cookies } from 'next/headers'

export async function deleteCookies() {
   try {
    const cookieStore = await cookies();
    
    if(cookieStore.has('refreshToken')){
        cookieStore.delete('refreshToken');
    }
    if(cookieStore.has('accessToken')){
        cookieStore.delete('accessToken');
    }
    
    return { success: true };
   } catch (error) {
        console.error('Error deleting cookies:', error);
        return { success: false, error: error.message };
   }
}
