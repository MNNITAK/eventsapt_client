import { axiosInstance } from "@/axios/axios"

 const fetchCoupleDetails=async(query)=>{
    console.log(query);
    
    try {
        const response=await axiosInstance.get(`/cmn/getCoupleDetails?coupleName=${encodeURIComponent(query.trim())}`)
        //console.log(response.data);
        return response.data.data
    } catch (error) {
        //console.log(error);
        
    }

}
export {fetchCoupleDetails}