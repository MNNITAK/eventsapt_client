import { getCookies } from "../../../app/action.js";
import { axiosInstance, pseudoAxios } from "../../../axios/axios.js";

// DISABLED - Will be replaced with microservice logic
export const fetchPosts=async(index,per_page,filter=[])=>{
    try {
        // TODO: Implement with new microservice endpoints
        // let resp=await axiosInstance.post(`/cmn/getPosts?searchIndex=${index}&per_page=${per_page}&searchStatus=${filter?.length>0}`,
        //    filter,
        //     {
        //     headers:{
        //         'wedoraCredentials':await getCookies()
        //     }
        // })
        // resp?.data?.data?.pics.map((i,p)=>i.p_type='post')
        // return resp?.data?.data
        return { pics: [], totalPages: 0 };
    } catch (error) {
        return { pics: [], totalPages: 0 };
    }
}

// DISABLED - Will be replaced with microservice logic
export const fetchReels=async(index,per_page)=>{
    try {
        // TODO: Implement with new microservice endpoints
        // let resp=await pseudoAxios.get(`/cmn/getReels?searchIndex=${index}&per_page=${per_page}`)
        // resp?.data?.data?.reels.map((i,p)=>i.p_type='reel')
        // return resp?.data?.data
        return { reels: [], totalPages: 0 };
    } catch (error) {
        return { reels: [], totalPages: 0 };        
    }
}