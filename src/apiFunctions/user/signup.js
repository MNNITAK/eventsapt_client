import { create, getCookies } from "@/app/action";
import { axiosInstance } from "@/axios/axios";
const signup=async({cred})=>{
    try {
        let response = await axiosInstance.post('/user/signup', cred, {
            headers: {
                "Content-Type": "application/json"
            }
        })  
         await create(response?.data)
        return response
    } catch (error) {
        //console.log(error);
        throw error       
    }
}
const updatePreference=async({cred})=>{
    const refreshToken=await getCookies()
    //console.log(cred);
    try {
        let resp=await axiosInstance.post('/user/updatePreferences',cred,{
            headers: {
                "wedoraCredentials":refreshToken
            }
        })
        return resp
    } catch (error) {
        //console.log(error);
        return error
    }
}
export {signup,updatePreference}