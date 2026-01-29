'use client'
import { useEffect,useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { fetchReels } from "@/features/feed/api/fetchPosts.js"
import { VideoPost } from "@/features/feed/components/PostStructure.js"
const VideoSWR=()=>{
    const [reelTracker,setTracker]=useState({
        reelData:[],
        pageIndex:0
    })
    const [hasMoreTrack,setTrack]=useState(true);
    const fetchVendorReels=async()=>{
            let postsResponse=await fetchReels(reelTracker.pageIndex,3)
            //console.log(postsResponse);
            
            if(!postsResponse?.hasMore){
                setTrack(false);
                return
            }else{
                setTracker((prevState) => ({
                    ...prevState,
                    reelData: [...prevState.reelData, ...postsResponse?.reels], // Append new data to the existing array
                    pageIndex: prevState.pageIndex + 1,           // Increment the pageIndex
                }));
            }
        }
    useEffect(()=>{
        fetchVendorReels()
    },[])
    return(
        <>
        <main id="VideoPost" className="w-[45%]  preferenceList h-[100%] overflow-y-auto">
        <InfiniteScroll
                dataLength={reelTracker?.reelData?.length}
                next={fetchVendorReels}
                loader={<h1 style={{ textAlign: 'center'}}>Loading</h1>}
                scrollableTarget="VideoPost"
                hasMore={hasMoreTrack}
                scrollThreshold={0.7}
                endMessage={
                    <p style={{ textAlign: 'center',width:"100%" }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
            >  
                {
                    reelTracker?.reelData?.map((item, pos) => <VideoPost key={pos} videoItem={item} videoContent={reelTracker?.reelData || []}/>)
                }
            </InfiniteScroll>
          </main>
        </>
    )
}
export {VideoSWR}