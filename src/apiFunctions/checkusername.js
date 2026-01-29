import { axiosInstance } from "@/axios/axios.js";
export const checkusername=async(username)=>{
    try {
        let resp=await axiosInstance.post(`/user/usernameAvalaiblity`,{username:username},{
            headers:{
                "Authorization":`Bearer ${process.env.openapikey}`
            }
        });
        return resp
    } catch (error) {
        throw error
    }  
}