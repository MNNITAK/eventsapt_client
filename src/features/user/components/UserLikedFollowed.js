'use client'
import Image from "next/image"
const VendorLiked=({dt,isFollowed})=>{
    return(
        <div className=" w-[100%] relative h-[30vh] bg-gray-200">
            <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  priority style={{ objectFit: 'cover' }} fill={true} src={dt?.images?.[0] || dt?.couplecover?.[0]} alt='pics'/>
            <h1 className="absolute bottom-0 w-[100%]  p-2 py-4 font-normal bg-gradient-to-t from-white to-transparent">
                {dt?.name}
            </h1>
            <p className="absolute top-2 right-2 border-2 border-white text-white px-2 rounded-lg ">{dt?.isLikedBy?.length} Likes</p>
            {
                isFollowed && <p className="absolute top-2 left-2 border-2 border-white text-white px-2 rounded-lg ">Following</p>
            }
        </div>
    )
}
const CoupleLiked=({dt})=>{
    return(
        <div className=" w-[100%] relative h-[30vh] bg-gray-200">
            <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  priority style={{ objectFit: 'cover' }} fill={true} src={dt?.couplecover?.[0]} alt='pics'/>
            <h1 className="absolute bottom-0 w-[100%]  p-2 py-4 font-normal bg-gradient-to-t from-white to-transparent">
                {dt?.coupleName}
            </h1>
            <p className="absolute top-2 right-2 border-2 border-white text-white px-2 rounded-lg ">{dt?.isLikedBy?.length} Likes</p>
        </div>
    )
}
const VendorSaved=({dt})=>{
    return(
        <div className=" w-[100%] relative h-[30vh] bg-gray-200">
            <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  priority style={{ objectFit: 'cover' }} fill={true} src={dt?.images?.[0]} alt='pics'/>
            <h1 className="absolute bottom-0 w-[100%]  p-2 py-4 font-normal bg-gradient-to-t from-white to-transparent">
                {dt?.name}
            </h1>
            {/* <p className="absolute top-2 right-2 border-2 border-white text-white px-2 rounded-lg ">{dt?.isLikedBy?.length} Likes</p> */}
        </div>
    )
}
const VendorIdea=({dt})=>{
    return(
        <div className=" w-[100%] relative h-[30vh] bg-gray-200">
            <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  priority style={{ objectFit: 'cover' }} fill={true} src={dt?.images?.[0]} alt='pics'/>
            <h1 className="absolute bottom-0 w-[100%]  p-2 py-4 font-normal bg-gradient-to-t from-white to-transparent">
                {dt?.name}
            </h1>
            {/* <p className="absolute top-2 right-2 border-2 border-white text-white px-2 rounded-lg ">{dt?.isLikedBy?.length} Likes</p> */}
        </div>
    )
}
export {VendorLiked,CoupleLiked,VendorIdea,VendorSaved}