import { create, getCookies } from "@/app/action";
import { signupUser, updateUserPreferences } from "@/api/authClient";

const signup=async({cred})=>{
    try {
        let response = await signupUser(cred);
        await create(response);
        return response;
    } catch (error) {
        //console.log(error);
        throw error;       
    }
}

const updatePreference=async({cred})=>{
    const refreshToken=await getCookies();
    //console.log(cred);
    try {
        let resp = await updateUserPreferences(refreshToken, cred);
        return resp;
    } catch (error) {
        //console.log(error);
        return error;
    }
}
export {signup,updatePreference}