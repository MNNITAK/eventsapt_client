import { getCookies } from "@/app/action";
import { axiosInstance } from "@/axios/axios.js"
let controller = null; 
const likePost=async(dt)=>{ 
    const refreshToken=await getCookies()
     // Abort the previous request if it exists
     if (controller) {
        controller.abort();
    }
    // Create a new controller for the new request
    controller = new AbortController();
    try {
        let response=await axiosInstance.post(`/user/likePost`,dt,{
            headers:{
                'wedoraCredentials':refreshToken
            },
            signal:controller.signal
        })
        //console.log(response.data);
        
    } catch (error) {
    }
}
export {likePost}