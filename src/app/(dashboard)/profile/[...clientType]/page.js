import profilePic from "../../../../../public/profile.svg"
import { MdCameraswitch } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { RiMessage3Fill } from "react-icons/ri";
import Image from "next/image"

import { profileFetch } from "@/apiFunctions/profile";
import { BottomNavBar } from "@/shared/components/phone/BottomNavBar";
import { UserFollowStat } from "@/apiFunctions/user/UserFollowings";
import { UserProfile } from "@/features/user/components/UserProfilePage";
import { VendorProfileP1 } from "@/features/vendor/profile/VendroProfilePage";
async function page({ params }) {
    //console.log(prf.data); 
    let { clientType } = await params;
    const clientRole = clientType[0];
    console.log(clientRole);
    
    return (
        <>
        {
            clientRole == "user" ? <UserProfile/> : <>
            {
                clientType[1]=="1" && <VendorProfileP1/>
            }
            </>
        }
        </>
    )
}
export default page