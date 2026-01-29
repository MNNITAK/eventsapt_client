import profile from "@/../public/profile.svg";
import Image from "next/image";
import { MdCameraswitch } from "react-icons/md";
const ProfilePicture = () => {
    return (
        <>
            <input type="file" className="hidden" />
            <Image alt="profilePic" style={{ objectFit: "cover" }} src={profile} />
            <MdCameraswitch className="absolute top-[75%] bg-white w-[1.6vw] rounded-full border-2 border-gray-600 h-[1.6vw] p-1 right-[5%]" />
        </>
    )
};
export { ProfilePicture } 