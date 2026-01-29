import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";
const VendorPostsGrid=({fetchVendorPosts,vendorMediaData,setData,id})=>{
    return(   
        <>
        <InfiniteScroll
        className="md:w-[80%] w-[100%] mx-auto grid grid-cols-3 gap-1 mt-1"
        dataLength={vendorMediaData?.postsData?.length}
        next={fetchVendorPosts}
        loader={<h1 style={{ textAlign: 'center',width:"100%"}}>Loading</h1>}
        scrollThreshold={0}
        scrollableTarget={id}
        hasMore={vendorMediaData?.hasMorePost}
        endMessage={
            <p style={{ textAlign: 'center',width:"100%" }}>
              <b></b>
            </p>
          }
        >
          {
            vendorMediaData?.postsData?.map((item,pos)=>
              <div key={pos} className=" relative h-[30vh]">
              <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  style={{objectFit:'cover'}} alt="pics" fill={true} src={`${item}`}  />
              </div>
            )
          }
        </InfiniteScroll>
        </>
    )
}
export {VendorPostsGrid}