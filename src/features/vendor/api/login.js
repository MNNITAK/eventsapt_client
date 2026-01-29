import { create } from "@/app/action";
import { axiosInstance } from "@/axios/axios";
const loginUser=async({data,router})=>{
    try {
        let resp=await axiosInstance.post("/user/login",data,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        //console.log(resp);        
        await create(resp?.data)
        if(resp.status==203){
            router.push("/home")
        }
        return resp
    } catch (error) {
        //console.log(error);
        throw error     
    }       
}
export {loginUser}