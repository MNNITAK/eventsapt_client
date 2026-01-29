import { getCookies } from "@/app/action";
import { axiosInstance } from "@/axios/axios";
const followVendor=async(data)=>{
    try {
        const refreshToken=await getCookies()
        let response;
        if(refreshToken){
             response=await axiosInstance.post('/user/followVendor',data,{
                headers: {
                    "wedoraCredentials":refreshToken
                }
            })
        }
        return response
    } catch (error) {
        //console.log(error);
    }
}
export {followVendor}