import { getCookies } from "../../../app/action.js";
import { axiosInstance, pseudoAxios } from "../../../axios/axios.js";
export const fetchPosts=async(index,per_page,filter=[])=>{
    try {
        let resp=await axiosInstance.post(`/cmn/getPosts?searchIndex=${index}&per_page=${per_page}&searchStatus=${filter?.length>0}`,
           filter,
            {
            headers:{
                'wedoraCredentials':await getCookies()
            }
        })
        resp?.data?.data?.pics.map((i,p)=>i.p_type='post')
        return resp?.data?.data
    } catch (error) {
    }
}
export const fetchReels=async(index,per_page)=>{
    try {
         let resp=await pseudoAxios.get(`/cmn/getReels?searchIndex=${index}&per_page=${per_page}`)
        resp?.data?.data?.reels.map((i,p)=>i.p_type='reel')
        //console.log(resp?.data?.data);
        return resp?.data?.data
    } catch (error) {        
    }
}