'use client'
import { RiHome5Fill, RiHome5Line } from "react-icons/ri";
import { RiSearch2Line, RiSearch2Fill } from "react-icons/ri";
import { GoClock, GoPerson } from "react-icons/go";
import { FaPlayCircle, FaRegPlayCircle } from "react-icons/fa";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

function BottomNavBar() {
  const searchParams = useSearchParams()
  const path = usePathname()
  const router = useRouter()
  const tab = searchParams.get("tab")

  // Resolve the client type (user / vendor) from the current path.
  // Home routes look like /home/<clientType>; fall back to "user".
  const segs = path.split('/').filter(Boolean)
  const clientType = (segs[0] === 'home' || segs[0] === 'profile') ? (segs[1] || 'user') : 'user'

  const isProfile = path.includes('/user-profile') || path.includes('/profile') || tab === 'profile'

  // New profile route for couples/users; vendors keep the vendor profile route.
  const profileHref = clientType === 'user'
    ? `/user-profile/personal`
    : `/profile/${clientType}/1`

  const go = (href) => () => router.push(href)

  return (
    <div className="w-full z-50 md:hidden block border-t border-[#1f1f1f] h-[10vh] min-h-[64px] fixed bottom-0">
      <div className="w-full flex relative justify-between items-center h-full bg-[#0e0e0e]">

        {/* Left cluster */}
        <div className="w-[40%] flex justify-evenly">
          <button onClick={go(`/home/${clientType}?tab=home`)} className={`flex flex-col items-center gap-0.5 ${tab === 'home' ? 'text-[#ff89ac]' : 'text-[#adaaaa]'}`}>
            {tab === 'home' ? <RiHome5Fill className="text-2xl" /> : <RiHome5Line className="text-2xl" />}
            <span className="text-[0.65rem] font-medium">Home</span>
          </button>
          <button onClick={go(`/home/${clientType}?tab=search`)} className={`flex flex-col items-center gap-0.5 ${tab === 'search' ? 'text-[#ff89ac]' : 'text-[#adaaaa]'}`}>
            {tab === 'search' ? <RiSearch2Fill className="text-2xl" /> : <RiSearch2Line className="text-2xl" />}
            <span className="text-[0.65rem] font-medium">Search</span>
          </button>
        </div>

        {/* Right cluster */}
        <div className="w-[40%] flex justify-evenly">
          <button onClick={go(`/user-profile/events`)} className="flex flex-col items-center gap-0.5 text-[#adaaaa]">
            <GoClock className="text-2xl" />
            <span className="text-[0.65rem] font-medium">Bookings</span>
          </button>
          <button onClick={go(profileHref)} className={`flex flex-col items-center gap-0.5 ${isProfile ? 'text-[#ff89ac]' : 'text-[#adaaaa]'}`}>
            <GoPerson className="text-2xl" />
            <span className="text-[0.65rem] font-medium">Profile</span>
          </button>
        </div>

        {/* Center reels button — elevated */}
        <button
          onClick={go(`/home/${clientType}?tab=reels`)}
          className="absolute top-[-60%] left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full"
          aria-label="Reels"
        >
          {tab === 'reels'
            ? <FaPlayCircle className="text-6xl bg-white text-[#ff89ac] rounded-full p-4 border-2 border-[#0e0e0e]" />
            : <FaRegPlayCircle className="text-6xl bg-gradient-to-tr from-[#ff89ac] to-[#a68cff] text-white rounded-full p-4 border-2 border-[#0e0e0e]" />}
        </button>
      </div>
    </div>
  )
}
export { BottomNavBar }
