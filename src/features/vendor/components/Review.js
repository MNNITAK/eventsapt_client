import { CgProfile } from "react-icons/cg";
import { FaStar } from "react-icons/fa6";
const Review=({reviewData})=>{
    return(
        <>
        <div className="flex my-2 w-[100%]">
            <p className="flex items-center"><CgProfile className="text-[25px] ml-3"/></p>
            <div className="ml-2 w-[100%]">
                <h1 className="flex items-center w-[100%] justify-between"><span className="font-semibold text-gray-500">{reviewData[0]}</span><span className="flex bg-[#9A2143] items-center text-white py-1 px-2 rounded-md ml-2">{reviewData[1]} <FaStar className="ml-2"/></span>
                </h1>
                <div className="text-sm">{reviewData[2]}</div>
            </div>
        </div>
        </>
    )
}
export {Review}