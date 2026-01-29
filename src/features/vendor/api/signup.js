import { create } from "@/app/action";
import { axiosInstance } from "@/axios/axios";
const signup=async({cred,router})=>{
    try {
        let response = await axiosInstance.post('/vendor/signup', cred, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        await create(response?.data)  
        if(response?.status==201){
            router.push("/home/vendor?clientType=vendor")
        }         
        return response
    } catch (error) {        
        if(error.status==409){
            router.push("/login?usertype=vendor")
        }
       throw error        
    }
}
export {signup}