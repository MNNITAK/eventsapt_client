import { create } from "@/app/action";
import { axiosInstance } from "@/axios/axios";
const loginUser=async({data,router})=>{
    try {
        let resp=await axiosInstance.post("auth/vendor/login",data,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        //console.log(resp);        
        await create(resp?.data)
        console.log("vendor Login Response:", resp);
        router.push("/vendor-dashboard")
        return resp
    } catch (error) {
        //console.log(error);
        throw error     
    }       
}
export {loginUser}
