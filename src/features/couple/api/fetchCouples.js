import { getCookies } from "@/app/action";
import { axiosInstance } from "@/axios/axios";
const fetchCouple=async(index,per_page)=>{
    try {
        let response=await axiosInstance.get(`/cmn/getCouplePosts?searchIndex=${index}&per_page=${per_page}`,{
            headers:{
                'wedoraCredentials':await getCookies()
            }
        })
        //console.log(response?.data?.data);
        response?.data?.data?.cposts?.map((i)=>i.p_type='couple')
        return response?.data?.data
    } catch (error) {
        
    }
}
export {fetchCouple}