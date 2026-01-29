import { getCookies } from "@/app/action";
import { axiosInstance } from "@/axios/axios";
const fetchProfileData=async({vendorName,type})=>{
    try {
        const data= await axiosInstance.get(`/cmn/getVendorProfile?vendorName=${vendorName}&type=${type}`,{
            headers:{
                'wedoraCredentials':await getCookies()
            }
        })
        return data?.data?.data
    } catch (error) {
    }
}
export {fetchProfileData}