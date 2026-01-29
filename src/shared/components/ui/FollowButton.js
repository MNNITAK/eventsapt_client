'use client'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
function FollowButton() {
  return (
    <button className="bg-[#9A2143] text-white px-3 rounded-lg text-sm py-1">Follow</button>
  )
}
function BackButton(){
    const router = useRouter();
    return (
        <IoMdArrowRoundBack onClick={()=>{router.back()}}/>
    )
}
function VendorBackButton(){
    const router = useRouter();
    return (
        <>
        <div className="flex gap-1 mt-5 justify-evenly w-[100%]">
        <button onClick={()=>{router.back()}} className="bg-[#9A2143]  w-[100%] text-white px-3 rounded-lg text-sm py-2">Back</button>
        <button className=" border-2 border-[#9A2143] text-[#9A2143]  w-[100%] px-3 rounded-lg text-sm py-2">Message</button>
        </div>
        </>
    )
}
export { FollowButton,BackButton,VendorBackButton}