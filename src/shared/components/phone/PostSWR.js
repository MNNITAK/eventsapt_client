'use client'
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { getImageUrl } from "@/features/feed/api/pexel"
import { CouplePost, ImagePost, VideoPost } from "../../../features/feed/components/PostStructure"
import { fetchVendorMediaPosts } from "../../../features/vendor/api/fetchVendorPosts"
import { fetchPosts, fetchReels } from "@/features/feed/api/fetchPosts"
import { fetchCouple } from "@/features/couple/api/fetchCouples"
import { useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Loader } from "../ui/Loader"
const PostSWR = ({ id_ }) => {
    const searchParam=useSearchParams();
    const [index, setIndex] = useState(1);
    const [hasMoreTrack, setTrack] = useState(true);
    const [hasMoreCouple,setHasMoreCouple]=useState(true)
    const [imageData, setData] = useState([]);
    const [videoData, setVideoData] = useState([]);
    const [filters, setFilters] = useState([]);   
    let [mobileMedia,setMedia]=useState({
        index:0,
        coupleIndex:0,
        media:[]
    })
    let fetchVendorMedia=async(SearchFilter=filters)=>{
        function shuffleArray(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
            }
            return arr;
          }
        let picResponse=await fetchPosts(mobileMedia.index,2,filters);
        let coupleResponse=await fetchCouple(mobileMedia.coupleIndex,2)
        //let reelResponse=await fetchReels(mobileMedia.index,1);
        let pseudoArray=[...picResponse?.pics,...coupleResponse?.cposts];
        //console.log(shuffleArray(pseudoArray));
        setMedia((prev)=>({
            index:prev.index+1,
            coupleIndex:prev.coupleIndex+1,
            media:[...prev.media,...shuffleArray(pseudoArray)]
        }))
    }
    const {mutate:postMutate,data:postData,isPending:postPending,isSuccess:postSuccess,isError:ispostError,error:postError}=useMutation({
        mutationFn:fetchVendorMedia
       })
       useEffect(() => {
        postMutate(filters);
        setMedia((prev)=>({
            ...prev,
            media:[],
            index:0,
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
        setMedia((prev)=>({
            ...prev,
            media:[],
            index:0,
            coupleIndex:0
        }))
        //console.log(filterValues);
      },[searchParam])
    return (
        <>
            <InfiniteScroll
                dataLength={mobileMedia?.media?.length}
                next={postMutate}
                loader={ispostError ? <p>Nothing found</p> : <Loader/>}
                scrollableTarget={id_}
                hasMore={hasMoreTrack}
                scrollThreshold={0.9}
                endMessage={
                    <div style={{ textAlign: 'center',
                     }}>
                       Yay! you completed!!
                    </div>
                }
            >
                {
                    mobileMedia?.media?.map((item,pos)=>
                    item.p_type=='couple' ? <CouplePost images={item} key={pos}/> : <ImagePost key={pos} images={item}/>
                    )
                }
            </InfiniteScroll>
        </>
    )
}
export { PostSWR }