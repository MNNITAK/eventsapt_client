import { FaHome } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { MdSlowMotionVideo } from "react-icons/md";
import { TbReplaceFilled } from "react-icons/tb";
import { MdDashboard } from "react-icons/md";
import { TbNeedleThread } from "react-icons/tb";
import { FaCalendarDay } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
const primaryList = [
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
        tag:"Reels",
        link:"/shorts",
        icon:<MdSlowMotionVideo />
    }
];
const secodaryList = [
    {
        tag:"Dashboard",
        link:"/user-dashboard",
        icon:<MdDashboard />
    },
    {
        tag:"Bookings",
        link:"/user-bookings",
        icon:<TbReplaceFilled />
    },{
        tag:"Threads",
        link:"/user-threads",
        icon:<TbNeedleThread />
    },{
        tag:"Calendar",
        link:"/user-calender",
        icon:<FaCalendarDay />
    }

]
const tertiaryList = [
    {
        tag:"Settings",
        link:"/user-settings",
        icon:<IoMdSettings />
    }
]
export {primaryList,secodaryList,tertiaryList}