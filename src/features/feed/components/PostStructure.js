'use client'
import Image from "next/image"
import ICO from "@/app/favicon.ico"
import { BsThreeDots } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { TbLocation } from "react-icons/tb";
import { MdSaveAlt } from "react-icons/md";
import { PostImageSlider } from "../../../app/Components/ui/PostImageSlider";
import { VendorDetails } from "../../../app/Components/vendorComponent/VendorDetails";
import { useState } from "react";
import { VideoModal } from "@/shared/components/VideoModal/VideoModal.js";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { likePost } from "../api/likepost.js"
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { Save } from "./SavePost";
const ImagePost =  ({ images }) => {
    let controller = new AbortController();
    const [isLiked,setLiked]=useState(images?.isLikedByUser )
    const [isSaved,setSave]=useState(false);
    const router=useRouter()
    const {mutate,data}=useMutation({
        mutationKey:['likePost'],
        mutationFn:likePost
    })
    const payload={
        postId:images?._id,
        likeType:'post'
    }
    const savePayLoad={
        postId:images?._id,
        type:"post"
    }
    return (
        <>
            <div className="aspect-[4/3] my-1 border-2  rounded-xl w-[100%] ">
                <div className="flex items-center justify-between gap-2 py-1 pl-2">
                    <main  onClick={()=>{router.push(`/home/user?tab=profile&vid=${images?._id}&vendorName=${images?.name}&type=post`)}} className="flex cursor-pointer items-center gap-2">
                        <Image alt="pic" src={ICO} width={40} height={40} />
                        <span className="flex flex-col ">
                            <h1 className="font-semibold ">{ images?.name}</h1>
                            <span className="font-normal text-[12px] text-gray-600">{images?.address[0]}</span>
                        </span>
                    </main>
                    <nav className="mr-3">
                        <BsThreeDots />
                    </nav>
                </div>
                <div className="w-[100%] h-[100%] rounded-xl ">
                    {
                        images?.images?.length>0?<PostImageSlider imageResponse={images} />:"Unable to preview image"
                    }
                </div>
                <div className="bg-white flex justify-between w-[100%] py-2">
                    <div className="w-[30%]  text-2xl justify-evenly flex items-center">
                        {
                            isLiked  ?
                            <button onClick={()=>{setLiked(false);mutate({...payload,isLiked:false})}}><FaHeart className="text-[#C94C73]"/></button> :
                             <button onClick={()=>{setLiked(true);mutate({...payload,isLiked:true})}}><FaRegHeart  /></button>
                             
                        }
                        <TbLocation onClick={()=>{setSave(!isSaved)}} className=" cursor-not-allowed" />
                       
                        <Save isSavedByUser={images?.isSavedByUser} savePayLoad={savePayLoad}/>
                    </div>
                    <div className="w-[30%] flex justify-end items-center mr-4">
                        <p className="text-[12px] bg-[#FFECEC] px-3 font-semibold py-1 text-nowrap rounded-[25px]">2490 reviews</p>
                    </div>
                </div>
            </div>
        </>
    )
}
const CouplePost=({images})=>{
    const [isLiked,setLiked]=useState(images?.isLikedByUser )
    const params=useParams()
    // console.log(params?.clientType);
    const payload={
        postId:images?._id,
        likeType:'couple'
    }
    const {mutate,data}=useMutation({
        mutationKey:['likeCouplePost'],
        mutationFn:likePost
    })
    const router=useRouter()
    const formatWeddingText = (text) => {
        if(text.includes("&")){
            return text.replace(" & ", " weds ");  
        }
    // Return original text if "&" is not found
        if(text.includes("and")){
            return text.replace(" and ", " weds ");  
        }
        return text;     
    };
    return(
        <>
            <div className="aspect-[4/3] my-1 w-[100%] ">
                <div className="flex items-center justify-between gap-2 py-1">
                    <main  onClick={()=>{router.push(`/home/user?tab=coupleProfile&cpid=${images?._id}&coupleName=${encodeURIComponent(images?.coupleName)}`)}} className="flex cursor-pointer items-center gap-2">
                        {/* <Image alt="pic" src={ICO} width={40} height={40} /> */}
                        <span className="flex flex-col  ">
                            <h1 className="font-semibold text-[12px] bg-[#FFECEC] rounded-md  text-[#C94C73] p-2  ">{ formatWeddingText(images?.coupleName)}</h1>
                            {/* <span className="font-normal text-[12px] text-gray-600">{images?.address[0]}</span> */}
                        </span>
                    </main>
                    <nav className="mr-3">
                        <BsThreeDots />
                    </nav>
                </div>
                <div className="w-[100%] h-[100%] rounded-xl ">
                    {
                        images?.couplecover?.length>0?<PostImageSlider imageResponse={images} />:"Unable to preview image"
                    }
                </div>
                <div className="bg-white flex justify-between w-[100%] py-2">
                    <div className="w-[30%]  text-2xl justify-evenly flex items-center">
                    {
                            isLiked  ?
                            <button onClick={()=>{setLiked(false);mutate({...payload,isLiked:false})}}><FaHeart className="text-[#C94C73]"/></button> :
                             <button onClick={()=>{setLiked(true);mutate({...payload,isLiked:true})}}><FaRegHeart  /></button>
                             
                        }
                        <TbLocation className=" cursor-not-allowed"/>
                        <FaRegBookmark className=" cursor-not-allowed"/>
                    </div>
                    <div className="w-[30%] flex justify-end items-center mr-4">
                        <p className="text-[12px] bg-[#FFECEC] px-3 font-semibold py-1 text-nowrap rounded-[25px]">2490 reviews</p>
                    </div>
                </div>
            </div>
        </>
    )
}
const VideoPost = ({videoContent,videoItem}) => {
    const [showCaption, setShowCaption] = useState(false);
    const params=useParams()
    // console.log(params?.clientType);
    const router=useRouter()
    const [open,setOpen]=useState(false)
    function getFirst20Words(text) {
        let words = text.split(/\s+/); // Split by spaces
        if (words.length > 20) {
            return words.slice(0, 20).join(" ") + " ...";
        }
        return text;
    }
    return (
        <>
            <div className="md:aspect-[3/4] overflow-hidden relative my-1 aspect-[3/4] row-span-3 border-2 rounded-2xl md:col-span-2 w-[100%] ">
                <div className=" absolute bottom-0 left-0 z-10 text-white w-[100%] bg-gradient-to-t from-black to-transparent ">
                    <main className={`flex items-center justify-between gap-2 py-3 pl-2`}>
                    <VendorDetails locationName={videoItem?.locationName} user={videoItem?.ownerUsername} vid={videoItem?._id} type={`reels`}/>
                    <nav className="mr-3 ml-2">
                        <BsThreeDots />
                    </nav>
                    </main>
                </div>
                {
                    videoItem?.caption &&<p className={`w-[100%] mx-auto absolute ${showCaption ? "bottom-10" : "bottom-[-500px]"} transition-all bg-gradient-to-t py-3 to-[#0000005f] from-transparent duration-500  text-white z-30  text-center`}>{getFirst20Words(videoItem?.caption)}</p>
                }
                <div className="w-[100%] relative h-[100%] rounded-xl bg-gray-200">
                  {
                    videoItem?.id ?<Image onMouseEnter={() => setShowCaption(true)} onMouseLeave={() => setShowCaption(false)}  onClick={()=>{setOpen(true);router.push(`/home/${params?.clientType}?tab=home&view=video&vid=${videoItem?._id}`)} } style={{objectFit:"cover"}} priority fill={true} layout="fill" src={videoItem?.displayUrl} alt="Image"/>:"Unable to preview video"
                  }
                  <VideoModal postCollection={videoContent} VideoModalOpen={open} setVideoModal={setOpen}/>
                </div> 
                <div className="bg-[#ffffffcb] absolute top-2 right-2 rounded-lg  py-2">
                    <div className=" text-2xl justify-evenly flex flex-col px-2 py-1">
                        <FaRegHeart />
                        <TbLocation className="my-2" />
                        <MdSaveAlt />
                    </div>
                    
                </div>
                <div className=" absolute top-2 left-2  flex justify-end  items-center">
                        <p className="text-[12px]  bg-[#FFECEC] px-3 font-semibold py-1 text-nowrap rounded-[25px]">{videoItem?.likesCount} likes</p>
                    </div>
            </div>
        </>
    )
}
export { ImagePost, VideoPost,CouplePost }