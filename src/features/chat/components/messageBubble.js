import profpic from "@/../public/profPic.png"
import Image from "next/image"
const MessageBubble = ({ message,isSender ,sentAt}) => {
    return (
        <div className={`flex w-[100%] mt-1 ${isSender ? "justify-end" : "justify-start"}`}>
            <div className={`md:max-w-[40%] max-w-[90%] flex items-center  ${isSender ? "flex-row-reverse " : ""}`}>
                <Image src={profpic} width={30} height={30} alt="profilePicture" className="rounded-full ml-2 mr-2"/>
                <p className={`text-sm  px-3 py-2 rounded-lg ${isSender ? " bg-[#C94C73]  text-white" : "bg-[#f7e3e3] text-black"}`}>{message}</p>
                <p className="text-[14px] text-gray-400 mx-2">{sentAt}</p>
            </div>
        </div>
    )
}
export {MessageBubble}