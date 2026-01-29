import profilePic from "@/../public/profile.svg";
import { MdCameraswitch } from "react-icons/md";
import Image from "next/image";
import { profileFetch } from "@/apiFunctions/profile";
import { BottomNavBar } from "@/shared/components/phone/BottomNavBar";
import { UserFollowStat } from "@/apiFunctions/user/UserFollowings";

const UserProfile = async ({ }) => {
    const prf = await profileFetch()
    const {userProfile}=prf?.data
    console.log(userProfile);
    
    return(
        <>
            <div className="md:w-[80%] w-[95%] mt-5 flex md:flex-col flex-col  mx-auto">
                {/* <div className="md:w-[20%] md:shadow-xl  h-[30vw] md:h-[31vh] items-center md:shadow-gray-200 flex justify-center aspect-square ">
                <div className="md:w-[10vw] md:h-[10vw] w-[30vw] h-[30vw]  relative rounded-full">
                    <input type="file" className="hidden" />
                    <Image alt="profilePic" style={{ objectFit: "cover" }} src={profilePic} />
                    <MdCameraswitch className="absolute top-[75%] bg-white md:w-[1.6vw] w-[7vw] h-[7vw] rounded-full border-2 border-gray-600 md:h-[1.6vw] p-1 right-[5%]" />
                </div>
            </div>
            <div className="md:w-[79%] w-[100%] mt-4 md:mt-0">
                <div className="md:h-[40vh] h-[30vh] rounded-md shadow-xl shadow-gray-200">
                    <p className="mt-2 ml-2 text-sm font-semibold text-gray-500">Your analytics</p>
                    <main className="w-[100%] h-[80%] md:h-[80%] mt-4 pr-4 flex flex-col justify-center items-center">
                        <LoginStat lgs={prf?.data?.userProfile?.loginCounts}/>
                    </main>
                </div>
                <div className="min-h-[30vh] mt-6 shadow-xl shadow-gray-200">
                    <div>
                        <p className="mt-6 ml-2 text-sm font-semibold text-gray-500">Events hosted</p>
                        <main className="w-[100%] h-[20vh] flex justify-center items-center">
                            Nothing to display
                        </main>
                    </div>
                </div>
            </div> */}
                <div className="md:w-[80%] w-[90%] mx-auto mt-[4vh] flex md:flex-row flex-row ">
                    <div className="w-[60%]  flex md:flex-row flex-row items-center ">
                        <div className="md:w-[10vw] md:h-[10vw] w-[20vw] h-[20vw]  relative  rounded-full">
                            <input type="file" className="hidden" />
                            <Image alt="profilePic" style={{ objectFit: "cover" }} src={profilePic} />
                            <MdCameraswitch className="absolute top-[75%] bg-white w-[1.6vw] rounded-full border-2 border-gray-600 h-[1.6vw] p-1 right-[5%]" />
                        </div>
                        <span className="font-semibold  mt-2 md:mt-0 flex flex-col ml-3">
                            <span className="text-nowrap">{userProfile?.username}</span>
                            <span className="font-normal text-gray-500 text-nowrap">{userProfile?.locationCity}</span>
                            {/* <span className="font-normal text-gray-500 text-nowrap">{userProfile?.email}</span> */}
                        </span>
                    </div>
                    <div className="flex justify-end mt-3 md:mt-0 w-[100%]  items-center">
                        <button className="border-2 border-[#9A2143] text-[#9A2143] w-[70%] px-3 text-sm py-2 rounded-lg">Message</button>
                        {/* <button className="bg-[#9A2143] border-2 border-[#9A2143] w-[50%] text-white px-3 rounded-lg text-sm py-2 ml-2">Follow</button> */}
                    </div>
                </div>
                <div className="flex md:w-[80%] w-[95%] justify-between mx-auto mt-3 py-2 rounded-md bg-gray-100">
                    <div className="w-[50%] border-r-2 border-[#9A2143] flex justify-center items-center text-center py-1 font-light text-gray-500">
                        <span className="font-semibold  text-gray-700">{`${userProfile?.vendorLiked.length + userProfile?.coupleLiked.length + " "}`} </span>Likes
                    </div>
                    <div className="w-[50%] text-center py-1 font-light text-gray-500">
                        <span className="font-semibold text-gray-700">{userProfile?.vendorFollowed.length + " "} </span>Following
                    </div>
                </div>
                <UserFollowStat userData={prf?.data?.vendor_and_coupleCollection} />

            </div>
            <BottomNavBar />
        </>
    )
}
export { UserProfile }