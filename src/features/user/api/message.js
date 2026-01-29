import { axiosInstance } from "@/axios/axios";
import { getCookies } from "@/app/action";
const message=async(vendorData)=>{
    const refreshToken=await getCookies()
    try {
        const response=await axiosInstance.post(`/user/handleUserMessage`,vendorData,{headers:{'wedoraCredentials':refreshToken}})
        //console.log(response);
        return response
    } catch (error) {
        //console.log(error);
    }
}
export {message}