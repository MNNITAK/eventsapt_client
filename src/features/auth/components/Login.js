'use client'
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react"
import { PlaceholdersAndVanishInput } from "@/app/Components/ui/changeInputPlaceholder"
import Link from "next/link";
import GoogleLogo from "../../../../public/google-icon.svg"
import Image from "next/image";
import { FaEyeSlash,FaEye } from "react-icons/fa";
import { loginUser } from "@/features/auth/api/login";
import {  logViaGoogle } from "@/lib/googleAuth";
import { loginSchema } from "@/schema/userSchema";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { loginClient } from "@/features/auth/api/clientLogin";
function UserLogin() {
  const searchParams = useSearchParams()
  const searchKey = searchParams.get('usertype')
  const router=useRouter()
  let [credError,setErr]=useState([])
  const {mutate,error,isPending,data,isError,isSuccess}=useMutation({
    mutationFn:loginClient
  })  
    const placeholders = [
        "Enter Username or", 
        "Enter email"
      ];
      const passplaceholders = [
        "Enter password",
       
      ];
    let [userCredentials,setCredentials]=useState({
        userid:"",
        password:"",
        isGoogleAuthenticated:false
    })
   const loginViaGoole=async()=>{
           //console.log(userDetails);
           let data=await logViaGoogle()
           //console.log(data);
           //setCredentials((prev)=>({...prev,userid:data.email,isGoogleAuthenticated:true}))
           mutate({
            data:{userid:data.email},
            router:router,
            client:searchKey
           })
       } 
  const handleChange = (e) => {
    setCredentials((prev)=>({...prev,[e.target.name]:(e.target.value).trim()}))
  };
  const onSubmit = (e) => {
    setErr([])
   let validatedSchema=loginSchema.safeParse(userCredentials)
   //console.log(validatedSchema); 
   if(!(validatedSchema?.success)){
    setErr(validatedSchema?.error?.errors)
    return
   }
   //console.log(userCredentials);  
   mutate({
    data:userCredentials,
    router:router,
    client:searchKey
   })
  };
  return (
    <div className="md:mt-10 mt-4 flex flex-col">
      <span className="">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        autofocusInput={true}
        name="userid"
      />
        </span>  
        <h2></h2>
      <input
      type="password"
      className= "md:w-[25vw] w-[85vw] mt-4 outline-2 pl-4  sm:pl-7 border-[1px] focus:outline-[#C94C73] pr-20 relative dark:bg-zinc-800 h-12 rounded-lg overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200"
      placeholder="Enter password"
      onChange={handleChange}
      name="password"
      />
      <h2 className="text-sm ml-2 mt-2 font-semibold text-gray-500">{
        <>{
          credError?.length>0?"Provide valid credentials ":""
        }</>
        }</h2>
        <h2 className="text-sm ml-2 mt-0 font-semibold text-gray-500">{
        <>{
          isError?error?.response?.data?.message:""
        }</>
        }</h2>
      <button 
      onClick={onSubmit}
      disabled={isPending || isSuccess }
      className="md:w-[25vw] w-[85vw] text-white rounded-lg mt-10 md:mt-4 py-3 bg-[#C94C73]">
        {
          isPending?"Logging you in":"Login"
        }
      </button>
      <div className="text-[#838485] text-center mt-4 md:mt-2">{`Don't have an account?`}<Link className="text-black ml-1" href={`/authPage/user`}>Sign Up</Link></div>
      {
        searchKey != "vendor" && <>
        <div
      className="relative "
      >
        <hr className="border-[#9e9d9d] mt-8"></hr>
        <span className="absolute left-[45%] text-[#9e9d9d] top-5 bg-white px-3">OR</span>

      </div>
      <button
       onClick={loginViaGoole}
      className="md:w-[25vw] border-[#C94C73] border-2 flex justify-center items-center  w-[85vw] text-black rounded-lg mt-5 md:mt-10 py-3 bg-white">
        <span className="mr-2">Continue with google</span>
        <Image alt="googleLogin" src={GoogleLogo} height={20} width={20}/>
      </button>
        
        </>
      }
    </div>
  )
}

export {UserLogin}