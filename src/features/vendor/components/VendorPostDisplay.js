import { useEffect, useState } from "react";
import { VendorPostsGrid } from "./VendorPostsGrid";
import { fetchReels } from "@/features/feed/api/fetchPosts";
import { fetchPosts } from "@/features/feed/api/fetchPosts";
import { fetchVendorMediaPosts, fetchVendorMediaReels } from "../api/fetchVendorPosts";
import { VendorReelGrid } from "./VendorReelDisplay.js";
const SelectPostPage=({id,vendorName,dataSet,type})=>{
    let [postIndex,setIndex]=useState(type)
    let [vendorMediaData,setData]=useState({
        postsData:[...dataSet],
        reelData:[],
        postIndex:0,
        reelIndex:0,
        hasMorePost:true,
        hasMoreReel:true
    })
    const fetchVendorPosts=async()=>{
        let postsResponse=await fetchVendorMediaPosts(vendorMediaData.postIndex,6,vendorName)
        if(!postsResponse?.hasMore){
            setData((prev)=>({...prev,hasMorePost:false}));
            return
        }else{
            setData((prevState) => ({
                ...prevState,
                postsData: [...prevState.postsData, ...postsResponse?.pics], // Append new data to the existing array
                postIndex: prevState.postIndex + 1,           // Increment the pageIndex
            }));
        }
    }
    const fetchVendorReels=async()=>{
        let postsResponse=await fetchVendorMediaReels(vendorMediaData.reelIndex,6,vendorName)
        //(postsResponse);
        
        if(!postsResponse?.hasMore){
            setData((prev)=>({...prev,hasMoreReel:false}));
            return
        }else{
            setData((prevState) => ({
                ...prevState,
                reelData: [...prevState.reelData, ...postsResponse?.reels], // Append new data to the existing array
                reelIndex: prevState.reelIndex + 1,           // Increment the pageIndex
            }));
        }
    }
    // useEffect(()=>{
    //     if(type=='reels'){
    //         fetchVendorReels()
    //     }
    // },[])
    useEffect(()=>{
    
        fetchVendorReels()
    },[])
    return (
        <>
        <div className="md:w-[80%] w-[100%] mx-auto flex justify-center mt-6 ">
            {
                type=='post'? <>
                <button onClick={()=>setIndex('post')} className={`px-7 font-semibold ${postIndex=='post'?'bg-[#e9ced68e] text-[#9A2143]':""} py-2 `}>Posts</button>

                </> : <>
                <button onClick={()=>setIndex('reels')} className={`px-7 font-semibold ${postIndex=='reels'?'bg-[#e9ced68e] text-[#9A2143]':""} py-2`}>Reels</button>

                </>
            }
        </div>
        {
            postIndex=='post' && <VendorPostsGrid id={id} vendorMediaData={vendorMediaData} fetchVendorPosts={fetchVendorPosts} setData={setData}/>
        }
        {
            postIndex=='reels' && <VendorReelGrid id={id} vendorMediaData={vendorMediaData} fetchVendorReels={fetchVendorReels} setData={setData} />
        }
        </>
    )
}
export {SelectPostPage}