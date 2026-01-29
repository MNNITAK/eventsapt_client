import InfiniteScroll from "react-infinite-scroll-component";
import { VideoPlayer } from "@/shared/components/VideoModal/VideoPlayer.js";
const VendorReelGrid=({id,vendorMediaData,fetchVendorReels,setData})=>{
    return(<>
    <InfiniteScroll
    dataLength={vendorMediaData?.reelData}
    className="md:w-[80%] w-[100%%] mx-auto grid grid-cols-3 gap-1 mt-1"
    next={fetchVendorReels}
    loader={<h1 style={{ textAlign: 'center',width:"100%"}}></h1>}
    scrollThreshold={0.9}
    scrollableTarget={id}
    hasMore={vendorMediaData?.hasMoreReel}
    endMessage={
        <p style={{ textAlign: 'center',width:"100%" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
   {
    vendorMediaData?.reelData?.map((item,pos)=>
    <div key={pos} className=" relative h-[30vh]">
        <VideoPlayer PostUrl={item?.videoUrl} thumbnail={item?.displayUrl}/>
    </div>
    )
   }
    </InfiniteScroll>
    </>)
}
export {VendorReelGrid}