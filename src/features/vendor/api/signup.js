import { create } from "@/app/action";
import { signupVendor } from "@/api/authClient";
const signup=async({cred,router})=>{
    try {
        let response = await signupVendor(cred);
        await create(response);  
        if(response?.statusCode==201){
            router.push("/home/vendor?clientType=vendor");
        }         
        return response;
    } catch (error) {        
        if(error.response?.data?.statusCode==409){
            router.push("/login?usertype=vendor");
        }
       throw error;        
    }
}
export {signup}