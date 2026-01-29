'use client'
import anime from "animejs";
import { useRef, useState } from "react";
import { ProfilePicture } from "@/shared/common/ProfilePicture.js";
import Link from "next/link";
import Image from "next/image";
import eventPic from "@/../public/event.svg"
import { CiCircleChevRight } from "react-icons/ci";
import { CiCircleChevLeft } from "react-icons/ci";
const VendorSideBar = () => {
    const sideBarRef = useRef(null);
    const buttonRef = useRef(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const vendorSocialURL = [{
        type: "Instagram",
        url: "https://images.ctfassets.net/23aumh6u8s0i/c04wENP3FnbevwdWzrePs/1e2739fa6d0aa5192cf89599e009da4e/nextjs"
    }, {
        type: "Facebook",
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyyPweovNKTRMp62H6KTqhJj036uHp_Oc4wQ&s"
    }, {
        type: "Twitter",
        url: "https://images.ctfassets.net/23aumh6u8s0i/c04wENP3FnbevwdWzrePs/1e2739fa6d0aa5192cf89599e009da4e/nextjs"
    }, {
        type: "Website",
        url: "http://localhost:3000/home/user?tab=home"
    }]
    const upcomingEvents = [{
        eventInfo: "Ria weds Chaddha",
        dateSheduled: "27-03-2025"
    }, {
        eventInfo: "Hudda wedding",
        dateSheduled: "12-10-2005"
    }, {
        eventInfo: "Shona weds Shoni",
        dateSheduled: "03-12-2012"
    }]
    const handleCollapse = () => {
        const sideBarCurrent = sideBarRef.current;
        const buttonCurrent = buttonRef.current;
        if (!sideBarCurrent || !buttonCurrent) return;

        if (!isCollapsed) {
            // 🔹 Collapse (hide)
            anime({
                targets: [sideBarCurrent, buttonCurrent],
                translateX: "-25vw",
                duration: 500,
                easing: "easeInOutQuad",
                complete: () => {
                    // Just disable clicks, do NOT change display/flex
                    sideBarCurrent.style.pointerEvents = "none";
                },
            });
        } else {
            // 🔹 Expand (show)
            sideBarCurrent.style.pointerEvents = "auto";
            anime({
                targets: [sideBarCurrent, buttonCurrent],
                translateX: "0vw",
                width: "0vw",
                duration: 500,
                easing: "easeInOutQuad",
            });
        }

        setIsCollapsed((prev) => !prev);
    };
    return (
        <>
            {/* Sidebar */}
            <div
                ref={sideBarRef}
                className={`${isCollapsed ? "translate-x-[-25vw] w-[0vw]" : "translate-x-[0vw] w-[25vw]"} ease-in-out relative transition-all duration-800  border-r-2  h-[100vh]  flex flex-col items-center justify-center`}
            >
                <div className="w-full flex flex-col items-center">
                    <div className="w-[10vw] h-[10vw] bg-white-200 relative rounded-full">
                        <ProfilePicture />
                    </div>
                    <button className="w-[80%] py-2 mt-2 bg-[#9A2143] rounded-md font-semibold text-white">
                        Messages
                    </button>
                </div>
                <p className="w-[80%] mt-4 text-[12px] font-semibold text-gray-500">Socials</p>
                {
                    vendorSocialURL?.map((item, pos) => {
                        return <div key={pos} className="w-[80%] flex flex-col">
                            <span className="text-[13px] text-gray-700 font-medium">{item.type}</span>
                            <Link href={item?.url} className="text-nowrap truncate  text-ellipsis underline text-[12px]">
                                {item?.url}
                            </Link>

                        </div>
                    })
                }
                <p className="w-[80%] mt-6 text-[12px] font-semibold text-gray-500">Upcoming Events</p>
                {
                    upcomingEvents?.map((item, pos) => {
                        return <div key={pos} className="w-[80%] mt-4 border py-1 px-1 bg-gray-300 rounded-lg relative flex items-center">
                            <Image alt="profilePic" className="rounded-full border-[2px] border-[#9A2143]" width={40} height={40} style={{ objectFit: "cover" }} src={eventPic} />
                            <p className="ml-2 w-[90%] flex justify-between">
                                <span className="text-[12px] text-gray-600">{item.eventInfo}</span>
                                <button className="text-[#9A2143] mr-2 font-semibold text-[12px]">View</button>
                            </p>
                            <span className="absolute right-1 top-[-14px] text-[10px] text-gray-600">{item?.dateSheduled}</span>
                        </div>
                    })
                }
            </div>
            {/* Toggle Button */}
            <button
                ref={buttonRef}
                onClick={()=>{setIsCollapsed(!isCollapsed)}}
                className={`top-2 absolute ${isCollapsed ? "left-1vw" : "left-[26vw]"} text-[#9A2143] duration-800 rounded-md w-[2vw] h-[2vw]  transition-all`}
            > 
                {isCollapsed ? <CiCircleChevLeft className="text-[30px]" /> : <CiCircleChevRight className="text-[30px]" />}
            </button>
        </>
    );
};

export { VendorSideBar };
