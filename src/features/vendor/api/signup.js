import { create } from "@/app/action";
import { signupVendor } from "@/api/authClient";
const signup=async({cred,router})=>{
    try {
        let response = await signupVendor(cred);
        await create(response);  
        router.push("/vendor-dashboard");          
        return response;
    } catch (error) {        
     router.push("/login?usertype=vendor"); 
     throw error;        
    }
}
export {signup}

