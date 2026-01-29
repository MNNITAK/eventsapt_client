'use client'
import Image from "next/image"
import profpic from "@/../public/profPic.png"
import { useRouter } from "next/navigation"
const NotifyBar=({user,orgName,uid,senderId,recieverId,lastMessage,num})=>{
    const router=useRouter()
    return(
        <div onClick={()=>{router.push(`/chatpen/${user}?cs=1&uid=${encodeURIComponent(uid)}&s=${encodeURIComponent(senderId)}&r=${encodeURIComponent(recieverId)}`)}} className="flex justify-between cursor-pointer items-center px-4 py-2 hover:bg-[#fce3e3]">
            <div className="flex"><Image src={profpic} width={50} height={50} alt="profilePicture" className="rounded-full mr-2"/>
            <div>
                <h1 className="text-md font-medium">{orgName}</h1>
                <span className="text-sm text-gray-500">{lastMessage ||""}</span>
            </div></div>
            {
                num >0 && <p className="bg-[#9A2143] text-white py-1 px-2 rounded-md text-[12px]">
               {num}
                </p>
            }
        </div>
    )
}
export {NotifyBar}