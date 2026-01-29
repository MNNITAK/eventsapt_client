'use client'
import { CouplePost, ImagePost } from "@/features/feed/components/PostStructure.js"
import { getImageUrl } from "@/features/feed/api/pexel"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { getVideoUrl } from "@/features/feed/api/pexel"
import { fetchPosts } from "@/features/feed/api/fetchPosts.js"
import { fetchCouple } from "@/features/couple/api/fetchCouples"
import { useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Loader } from "../ui/Loader"
const ImageSWR = ({ data }) => {
    const searchParam=useSearchParams();
    const [filters, setFilters] = useState([]);   
    const [hasMoreTrack,setTrack]=useState(true); // for posts only
    const [hasMoreCouple,setMoreCouple]=useState(true);
    const [VideoData, setVideoData] = useState([]);
    const [postsTracker,setTracker]=useState({
        postData:[],
        pageIndex:0,
        coupleData:[],
        coupleIndex:0
    }) 
    const fetchVendorPosts=async(SearchFilter=[])=>{
        SearchFilter=filters
        function shuffleArray(arr=[]) {
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
            }
            return arr;
          }
        let pseudoData=[]
        let postsResponse=await fetchPosts(postsTracker.pageIndex,3,SearchFilter)
        let coupleDataResponse=await fetchCouple(postsTracker.coupleIndex,3)
        pseudoData=shuffleArray([...postsResponse?.pics,...coupleDataResponse?.cposts])
        //console.log(pseudoData);    
        if(!postsResponse?.hasMore || !coupleDataResponse.hasMore){
            setTrack(false);
            return
        }else{
            setTracker((prevState) => ({
                ...prevState,
                postData: [...prevState.postData,...pseudoData], // Append new data to the existing array
                pageIndex: prevState.pageIndex + 1,
                coupleIndex:prevState.coupleIndex+1           // Increment the pageIndex
            }));
        }
        return pseudoData
    }
    const {mutate:postMutate,data:postData,isPending:postPending,isSuccess:postSuccess,isError:ispostError,error:postError}=useMutation({
        mutationFn:fetchVendorPosts
       })
    useEffect(() => {
        postMutate(filters);
        setTracker((prev)=>({
            ...prev,
            postData:[],
            pageIndex:0,
            coupleIndex:0
        }))
        // fetchImageData();
      }, [filters]);
      useEffect(()=>{
        const filterValues = searchParam.getAll("filter");
        if(filterValues.length>0){
            setFilters(filterValues);      
        }else{
            setFilters([]);
        }
        // if(searchParam.get('tab')=='search'){
        //     postMutate(filterValues);
        // }
        setTracker((prev)=>({
            ...prev,
            postData:[],
            pageIndex:0,
            coupleIndex:0
        }))
        //console.log(filterValues);      
      },[searchParam])
    return (<>
        <main id="ImagePost" className="w-[54%] preferenceList max-h-[100%] overflow-y-auto">
            {/* {
                postPending && <h1 className="w-[100%] text-center"><LuLoaderCircle className="animate-spin mx-auto text-[30px]" /></h1>
            } */}
            {
                 <InfiniteScroll
                dataLength={postsTracker?.postData?.length}
                next={postMutate}
                loader={ispostError ? <p>Nothing found</p> : <Loader/>}
                scrollableTarget="ImagePost"
                hasMore={hasMoreTrack}
                scrollThreshold={0.9}
                endMessage={
                    <p style={{ textAlign: 'center',width:"100%" }}>
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
            >
                {
                    postsTracker?.postData?.map((item, pos) =>
                        item.p_type == "couple" ? 
                            <CouplePost key={pos} images={item} />
                         : 
                            <ImagePost key={pos} images={item} />
                      )
                }
            </InfiniteScroll>
            }
        </main>
    </>)
}
export { ImageSWR }