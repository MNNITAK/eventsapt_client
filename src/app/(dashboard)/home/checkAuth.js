import { cookies } from "next/headers";
import { axiosInstance } from "../../../axios/axios";
export default async function checkAuth() {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value;
    try {
        let rftResp=await fetch(`${process.env.backend_api}/cmn/checkClientAuth`,{
            cache:"no-cache",
            headers:{
              "wedoraCredentials":cookieStore?.get("refreshToken")?.value
            }
          })
          rftResp=await rftResp.json()
          if(rftResp.statusCode>=400){
            return -1
          }
          //console.log(rftResp);
         return 1 
    } catch (error) {
        //console.log(error);        
        return -1
    }
}