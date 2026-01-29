import { FaStar } from "react-icons/fa6";
import { BigCalender } from "../../../app/Components/vendorComponent/calender/BigCalender";

import { ProfilePopper } from "./ProfilePopper";
import { NavigationPanel } from "./NavigationPanel";
import { ProfilePicture } from "../../../shared/common/ProfilePicture";
const VendorProfileP1 = () => {
    const vendorStat = [{
        type: "Following",
        data: "98"
    }, {
        type: "Impressions",
        data: "60"
    }]
    return (
        <div className="w-[100%] flex flex-col justify-evenly items-center">
            <ProfilePopper/>
            <div className="h-[20%]  w-[80%] flex justify-center">
                <div className="w-[10vw]  h-[10vw] bg-white-200 relative rounded-full">
                        <ProfilePicture />
                </div>
                <div className="flex w-[50%] justify-around">
                    {
                    vendorStat.map((item, pos) => {
                        return <span key={pos} className=" justify-center items-center flex flex-col">
                            <span>{item.data}</span>
                            <span className="text-[20px]">{item.type}</span>
                        </span>
                    })
                }
                <span className=" justify-center items-center flex flex-col">
                    <span>4.8</span>
                    <span className="text-[20px]"><FaStar/></span>
                </span>
                </div>
            </div>
            <NavigationPanel/>
            <div className="h-[70%] w-[80%] border-2">
                
            </div>
        </div>
    )
}
const VendorProfileP2 = () => {
    return (
        <div className="w-[100%] bg-gray-400">
            Main COntent2

        </div>
    )   
}
export { VendorProfileP1, VendorProfileP2 }