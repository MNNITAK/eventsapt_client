import Image from "next/image"
import profile from "../../../../public/profile.svg"
import { MdCameraswitch } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { RiMessage3Fill } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BackButton, FollowButton, VendorBackButton } from "../../../shared/components/ui/FollowButton";
import { vendorSocialHandle } from "@/lib/constants";
import { LuDot } from "react-icons/lu";
import { ProfilePicture } from "../../../shared/common/ProfilePicture";
function Profile() {
  return (
    <div className="w-[90%] md:overflow-y-auto h-[100vh]  md:h-[95%] flex flex-col items-center">
      <div className="w-[100%] flex justify-between items-center text-xl">
        <BackButton />
        <p className="text-sm">Eventsmore events</p>
        <FollowButton />
      </div>
      <div className="w-[10vw] h-[10vw] bg-gray-200 relative mt-3 rounded-full">
        <ProfilePicture/>
      </div>
      <main className="flex flex-col items-center justify-center">
        <p className="text-md font-semibold">Eventsmore events</p>
        <p className="text-sm font-light text-gray-500">Da Nang, Vietnam</p>
      </main>
      <div className="flex w-[100%] justify-between mt-3 py-2 rounded-md bg-gray-100">
        <div className="w-[50%] text-center py-1 font-light text-gray-500">
          <span className="font-semibold text-gray-700">200 </span>Following
        </div>
        <div className="w-[50%] text-center py-1 font-light text-gray-500">
          <span className="font-semibold text-gray-700">250 </span>Followers
        </div>
      </div>
      <p className="flex justify-center mt-6 ">
        {
          vendorSocialHandle.map((item, pos) =>
            <span className="text-[20px] text-gray-500 flex" key={pos}>{item.icon}
              {
                pos < 2 && <LuDot className="text-[#9A2143]" />
              }
            </span>
          )
        }
      </p>
      <VendorBackButton />
    </div>
  )
}
export { Profile }