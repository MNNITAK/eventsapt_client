import { getVideoUrl } from "@/features/feed/api/pexel"
import { ImagePost, VideoPost } from "./PostStructure"
import { StorySection } from "./StorySection"
import { getImageUrl } from "@/features/feed/api/pexel"
import { ImageSWR } from "@/shared/components/desktop/ImagePostSWR.js"
import { PostSWR } from "@/shared/components/phone/PostSWR.js"
import { VideoSWR } from "@/shared/components/desktop/ReelPostSWR.js"

async function Posts({id_}) {
  return ( 
    <>
      <div className="md:w-[95%] md:pt-2 hidden md:block  w-[100%] h-[90%] md:h-[73vh] md:ml-4">
        <div className="w-[100%] h-[100%] flex justify-between">
          <ImageSWR />
          <VideoSWR/>
        </div>
      </div>
      {/* below code segment for mobile posts and reels */}
      <div id="MobilePost" className="w-[100%] md:hidden mt-2">
        <PostSWR id_={id_}/>
      </div>
    </>
  )
}
export { Posts }