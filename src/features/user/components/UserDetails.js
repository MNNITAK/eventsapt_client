'use client'
import React, { use, useEffect, useState } from 'react'
import GoogleLogo from "../../../../public/google-icon.svg"
import Image from 'next/image'
import { userschema } from '@/schema/userSchema'
import { Authinput } from '../../../app/Components/ui/input'
import { LoginViaGoogle } from '@/lib/googleAuth'
import spinner from "../../../../public/spinner.svg"
import { checkusername } from '@/apiFunctions/checkusername'
import { useMutation } from '@tanstack/react-query'
import { useDebouncedCallback } from 'use-debounce'
import { signup } from '@/apiFunctions/user/signup'
import Link from 'next/link'

function Userdetailspage1({
    userDetails,
    setDetails,
    prev,
    next,
    error,
    setError,
    index,
    queryParams
}) {
    const {mutate,isPending,data,isError,error:checkError,isSuccess}=useMutation({
        mutationFn:checkusername
    })
    const {mutate:signupMutation,isPending:signupPending,data:signupData,isError:signupError,error:signupCheckError,isSuccess:signupSuccess}=useMutation({
        mutationFn:signup
    })
    const usernameDebounce=useDebouncedCallback((val)=>{
        mutate(val.trim())
    },500)
    useEffect(()=>{
       if(userDetails.username.length>3){
        usernameDebounce(userDetails.username)
       }
    },[userDetails.username])
    const handleSubmit=()=>{
        let validationResponse=(userschema.safeParse(userDetails))?.error?.errors
        validationResponse=validationResponse?.filter((item)=>(item.path)[0]!=='locationCity')
        if(validationResponse?.length>0){
            setError(validationResponse)
            //console.log(validationResponse);
        }
        else{
            setError([])
            signupMutation({cred:userDetails})
        }
    }
    const loginViaGoole=async()=>{
        //console.log(userDetails);
        let data=LoginViaGoogle(userDetails,setDetails,false)
        //console.log(data);
    }
    let errorInitiator = (name) => {
        return error.some(element => element.path[0] === name);
    };
    let errorMessage=(name)=>{
    return error.filter((item)=>(item.path)==name)
        
    }
    const inputOption = [
        { 
            type: "text",
            placeholder: "Enter username",
            name: "username"
        },
        {
            type: "email",
            placeholder: "Enter email",
            name: "email"
        }, {
            type: "password",
            placeholder: "Enter password",
            name: "password"
        },
        {
            type: "number",
            placeholder: "Enter phonenumber",
            name: "phoneNumber"
        }
    ]
    const setPreferences=()=>{
        const params = new URLSearchParams(queryParams)
            params.set('compIndex', index+1)
            window.history.pushState(null, '', `?${params.toString()}`)
            next()
    }
    return (
        <>
            <div  className='w-[87vw] md:w-[26vw] md:h-[70vh] h-[70vh] md:py-2 flex flex-col items-center'>
                {
                    inputOption.map((items, pos) =>
                        <div key={pos} className='relative'>
                        {/* <input
                            type={items.type}
                            name={items.name}
                            value={userDetails[`${items.name}`]}
                            onChange={inputFieldHandle}
                            className="md:w-[25vw] w-[85vw] mt-2 outline-2 pl-4 sm:pl-7 border-[1px] focus:outline-[#C94C73] pr-20 relative dark:bg-zinc-800 h-12 md:h-[6vh]  rounded-lg overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200"
                            placeholder={items.placeholder}
                        /> */}
                        <Authinput
                        type={items.type}
                        name={items.name}
                        setDetails={setDetails}
                        details={userDetails}
                        placeholder={items.placeholder}
                        />
                        {
                            items.name=="username" && isPending ?<>
                            <Image className='absolute top-[3vh] md:top-[3.5vh] right-3' src={spinner} alt='spinner' width={25} height={25}/>
                            </>:<></>
                        }
                        {
                            userDetails?.username.length>3 && items?.name=="username" &&!isPending? data?.status==200?<div className='text-[0.6rem] w-[90%] font-semibold text-green-400 pl-2 mt-1'>Username available</div>:checkError?.status==409?<div className='text-[0.6rem] w-[90%] font-semibold text-red-400 pl-2 mt-1'>Username not available</div>:"" :""
                        }
                        {
                           items.name!=="username"&&  error?.length > 0 &&  errorInitiator(items.name) && <div className='text-[0.6rem] w-[90%] font-semibold text-red-400 pl-2 mt-1'>{(errorMessage(items.name)[0]).message}</div> 
                        }
                        </div>
                    )
                }
                <div className='w-[100%] text-gray-400 font-semibold ml-2'>
                
                    {
                        signupData?.data?.message  || signupCheckError?.response?.data?.message
                    }
                </div>
                {
                    signupData?.status==201 || signupCheckError?.status==409?
                    <button
                    onClick={setPreferences} 
                    className="md:w-[25vw] w-[85vw] text-white rounded-lg mt-10 md:mt-5  py-3 bg-[#C94C73]"
                    >Set preferences</button>
                    :<button
                    disabled={isError}
                    onClick={() => { handleSubmit() }}
                    className="md:w-[25vw] w-[85vw] text-white rounded-lg mt-10 md:mt-5  py-3 bg-[#C94C73]">
                    {
                        signupPending ? "Signing up..." : "Sign up"
                    }
                </button>
                }
                <div className=' relative w-[95%]'>
                    <hr className="border-[#9e9d9d] mt-8"></hr>
                    <span className="absolute left-[45%] text-[#9e9d9d] top-5 bg-white px-3">OR</span>
                </div>
                <button
                    disabled={signupSuccess || signupError}
                    onClick={loginViaGoole}
                    className="md:w-[25vw] border-[#C94C73] border-2 flex justify-center items-center w-[85vw] text-black rounded-lg mt-5 md:mt-5 py-3 bg-white">
                    <span className="mr-2">Continue with google</span>
                    <Image alt="googleLogin" src={GoogleLogo} height={20} width={20} />
                </button>
            <p className='mt-2 text-sm text-gray-500'>Already have an account?<Link className='text-[#C94C73] ml-1 underline' href={`/login?usertype=user`}>Sign In</Link></p>
            </div>
            {/* <div className="md:mt-4 mt-1 flex justify-between px-1">
                <button className="p-2 border-2 rounded-lg border-[#C94C73] " onClick={() => { prev() }}>
                    Previous
                </button>
                <button className="p-2 border-2 rounded-lg border-[#C94C73] " onClick={() => { next() }}>
                    Next
                </button>
            </div> */}
        </>
    )
}
export { Userdetailspage1 }