'use client'
import { logoutUser } from '@/api/authClient';
import { getCookies } from '@/app/action';
import { deleteCookies } from './deleteCookies';

export async function logout() {
   try {
    const accessToken = await getCookies();
    
    if(accessToken){
        try {
            // Use authClient logoutUser function
            const logoutResponse = await logoutUser(accessToken);
            console.log("Logout response:", logoutResponse);
        } catch (apiError) {
            console.error('Logout API error:', apiError);
            // Continue to delete cookies even if API fails
        }
    }
    
    // Delete cookies via server action
    await deleteCookies();
    
    // Redirect to login page
    window.location.href = '/authPage/user';
    
   } catch (error) {
        console.error('Logout error:', error);
        // Always try to delete cookies even on error
        try {
            await deleteCookies();
        } catch (e) {
            console.error('Cookie deletion error:', e);
        }
        // Redirect anyway
        window.location.href = '/authPage/user';
   }
}
