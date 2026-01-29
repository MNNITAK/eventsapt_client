
import { userAgent } from "next/server";
const getUserAgent=(request)=>{
    const ua = userAgent(request)
    return ua

}
export {getUserAgent}