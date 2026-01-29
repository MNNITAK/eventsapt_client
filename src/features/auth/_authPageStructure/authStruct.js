'use client'
import { useParams } from "next/navigation"
import LinkButton from "@/shared/common/linkbutton";
import Link from "next/link";
import { SwitchAccount } from "../../../shared/components/ui/SwitchAccountButton";
export default function AuthStruct({usertype}) {
    const params = useParams()
    return (
        <div className="w-full flex flex-col  h-[80%] justify-between items-center ">
           <div className="w-[100%] flex flex-col items-center">
           <LinkButton client={usertype} linkText="Login" linkTag={`/login`} />
           <LinkButton client={usertype}  color="bg-[#F1F1F1]"  linkText="SignUp" linkTag={`/signup`} />
           </div>
           {/* <SwitchAccount/> */}
           {
            usertype == "user" && <div className='w-[100%] text-center text-gray-500'>Are you a vendor?<Link replace={true} className='ml-3 text-white bg-[#C94C73] py-3 px-4 rounded-lg' href="/authPage/vendor">Business Sign In</Link></div>
           }
           {
            usertype == "vendor" &&  <div className='w-[100%] text-center text-gray-500'>Are you a user?<Link replace={true} className='ml-3 text-white bg-[#C94C73] py-3 px-4 rounded-lg' href="/authPage/user">User Sign In</Link></div>
           }
            {/* {
                usertype == "vendor" ? <>
                 <div className='w-[100%] text-center text-gray-500'>Are you a vendor?<Link className='ml-3 text-white bg-[#C94C73] py-3 px-4 rounded-lg' href="/authPage/vendor">Business Sign In</Link></div>
                </> : <>
                <div className='w-[100%] text-center text-gray-500'>Are you a user?<Link className='ml-3 text-white bg-[#C94C73] py-3 px-4 rounded-lg' href="/authPage/user">User Sign In</Link></div>
                </>
            } */}
        </div>
    )
}