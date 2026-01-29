import { Back, Verify } from "@/app/Components/ui/Back";
import { Otp } from "@/features/auth/components/Otp";
import Image from "next/image";
import authPic from "@/../public/auth.svg"
export default function page(){
    return(
        <div className="w-[100%] h-[100vh] flex justify-center items-center">
        <div className="w-[25%] flex flex-col items-center h-[50%] ">
            <span className="w-[90%] "> <Back/></span>
            <Otp/>
            <Image src={authPic} width={300} height={300} className="mt-10 mb-5" alt="authPic"/>
            <Verify/>
        </div>
        </div>
    )
}