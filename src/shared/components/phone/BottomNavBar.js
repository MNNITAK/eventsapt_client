'use client'
import { RiHome5Fill } from "react-icons/ri";
import { RiSearch2Line } from "react-icons/ri";
import { GoClock } from "react-icons/go";
import { GoPerson } from "react-icons/go";
import { FaRegPlayCircle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
function BottomNavBar() {
  const searchParams = useSearchParams()
  const path=usePathname()
  const router=useRouter()
  const tab=searchParams.get("tab")
const user = path.split('/').pop(); 
  return (
    <div className="w-[100%] z-5 md:hidden block border-t-[1px] h-[12vh] border-gray-300 fixed bottom-0">
        <div className="w-[100%] flex relative justify-between  h-[100%] bg-white py-4">
        <main className="w-[45%] flex justify-evenly ">
            <div onClick={()=>{router.push(`/home/user?tab=home`)}} className={`flex  flex-col ${tab=="home" ?"text-[#9A2143] ":""} items-center`}>
            <RiHome5Fill className="text-3xl" />
            <span className="text-[0.8rem]">Home</span>
            </div>
            <div onClick={()=>{router.push(`/home/user?tab=search`)}}  className={`flex  flex-col ${tab=="search"?"text-[#9A2143]  ":""} items-center`}>
            <RiSearch2Line className="text-3xl" />
            <span className="text-[0.8rem]">Search</span>
            </div>
        </main>
        <main className="w-[45%] flex justify-evenly ">
            <div className={`flex  flex-col ${tab=="booking"?"text-[#9A2143]  ":""} items-center`}>
            <GoClock className="text-3xl" />
            <span className="text-[0.8rem]">Bookings</span>
            </div>
            <div onClick={()=>{router.push(`/profile/${user}`)}} className={`flex  flex-col ${tab=="profile" || path.includes("profile")?"text-[#9A2143]  ":""} items-center`}>
            <GoPerson className="text-3xl" />
            <span className="text-[0.8rem]">Profile</span>
            </div>
        </main>
        <div className="absolute top-[-60%] left-1/2 transform border-2 border-white rounded-full -translate-x-1/2 translate-y-1/2">
          <FaRegPlayCircle className="text-6xl bg-[#9A2143] text-white rounded-full p-4" />
        </div>
        </div>
    </div>
  )
}
export { BottomNavBar }