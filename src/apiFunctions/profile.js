import { cookies } from 'next/headers'
 const profileFetch = async () =>{
    const cookieStore = await cookies()  
    try {
        let profileResponse=await fetch(`${process.env.backend_api}/cmn/profile`,{
            method:'GET',
            headers:{
                "wedoraCredentials":cookieStore?.get("refreshToken")?.value
            }
        })
        profileResponse=await profileResponse.json()
        return profileResponse
    } catch (error) {
        console.log(error);
        
    }
} 
export {profileFetch} 