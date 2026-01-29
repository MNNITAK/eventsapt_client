import Image from "next/image"
import ICO from "@/app/favicon.ico"
import { FaStar } from "react-icons/fa6";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa6";
import { HiOutlineSave } from "react-icons/hi";
import { IoShareSocial } from "react-icons/io5";
import { VendorButton } from "@/features/vendor/components/VendorButton.js";
function VendorDescription({description}) {
    return (
        <div className="w-[100%] h-[100%] flex flex-col items-center">
            <main className="w-[95%] bg-white mt-12 px-3 rounded-lg py-3">
                <div className="flex justify-between items-center">
                    <h1 className="flex items-center">
                        <Image alt="vendorPostpic" src={ICO} width={60} height={60} className="rounded-full" />
                        <span className="font-semibold flex flex-col ml-3">
                            <span>{description?.ownerUsername}</span>
                            <span className="font-normal text-gray-500">{description?.ownerUsername}</span>
                            <span className="font-normal text-gray-500">IIT BHU near Hyderabd gate</span>
                        </span>
                    </h1>
                    <span className="flex bg-[#9A2143] items-center text-white py-1 px-2 rounded-md">2.3 <FaStar className="ml-2"/></span>
                    {/* <p className="flex pl-12 flex-col">
                        <span>Varanasi</span>
                        <span>IIT BHU near Hyderabd gate</span>
                    </p> */}
                </div>
                <span></span>
            </main>
            <main className="w-[95%] bg-white flex justify-evenly mt-3 px-3 rounded-lg py-3">
                        <span className="flex items-center"> <AiOutlineLike className="mr-2  text-[20px]"/>{description?.likesCount} Like</span>
                        <span className="flex items-center"> <IoShareSocial className="mr-2  text-[20px]"/>{description?.commentsCount} Share</span>
                        <span className="flex items-center"> <HiOutlineSave className="mr-2  text-[20px]"/>{description?.videoViewCount} Save</span>
            </main>
            <main className="w-[95%] mt-3 px-3 rounded-lg py-3">
                <p>Tags</p>
                <p className="flex flex-wrap gap-1">
                {
                    description?.hashtags?.map((item, pos) => (
                        pos <10 && <span key={pos} className="bg-[#fce9e9] text-[#9A2143] py-1 px-2 rounded-md mr-2">{`# `}{item}</span>
                    ))
                }
                </p>
            </main>
            <main className="w-[95%] bg-white mt-3 px-3 rounded-lg py-3">
                <p>Review</p>
                <div className="w-[100%] flex justify-center items-center py-8">
                    No reviews yet
                </div>
            </main>
            <div className="w-[95%] flex mt-3 justify-between">
                    <VendorButton/>
            </div>
        </div>
    )
}
export { VendorDescription }