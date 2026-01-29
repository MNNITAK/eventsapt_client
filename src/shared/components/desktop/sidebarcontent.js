import { FaHome } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdSlowMotionVideo } from "react-icons/md";
import { TbReplaceFilled } from "react-icons/tb";
const NavigatorList = [
    {
        tag:"Home",
        link:"/",
        icon:<FaHome />
    },
    {
        tag:"Search",
        link:"/search",
        icon:<IoSearch />
    },
    {
        tag:"Shorts",
        link:"/shorts",
        icon:<MdSlowMotionVideo />
    },
    {
        tag:"Bookings",
        link:"/booking",
        icon:<TbReplaceFilled />
    }
]
export {NavigatorList}