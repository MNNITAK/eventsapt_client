import { getCookies } from "@/app/action";
import { axiosInstance } from "@/axios/axios";

// DISABLED - Will be replaced with microservice logic
const fetchCouple=async(index,per_page)=>{
    try {
        // TODO: Implement with new microservice endpoints
        // let response=await axiosInstance.get(`/cmn/getCouplePosts?searchIndex=${index}&per_page=${per_page}`,{
        //     headers:{
        //         'wedoraCredentials':await getCookies()
        //     }
        // })
        // response?.data?.data?.cposts?.map((i)=>i.p_type='couple')
        // return response?.data?.data
        return { cposts: [], totalPages: 0 };
    } catch (error) {
        return { cposts: [], totalPages: 0 };
    }
}
export {fetchCouple}