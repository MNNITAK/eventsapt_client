import { create } from "@/app/action";
import { axiosInstance } from "@/axios/axios";
const loginUser=async({data,router,client})=>{
    try {
        let resp=await axiosInstance.post(`/${client}/login`,data,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )      
        await create(resp?.data)
        if(resp.status==203){
            router.push(`/home/${client}?tab=home`)
        }
        return resp
    } catch (error) {
        //console.log(error);
        throw error       
    }    
}
export {loginUser}