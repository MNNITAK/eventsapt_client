'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Vendorsignup from "@/app/Components/vendorComponent/signup"
import Usersignup from "@/features/user/signup/SignUpUser.js"
import { vendorDetails as vnd } from '@/lib/vendorDetails'
function SignUp({usertype,compIndex}) {
  const searchParams = useSearchParams()
  //console.log(searchParams.toString());
  
  const [vendorDetails,setvendorDetails]=useState(vnd)
  return (
    <>
    {
        usertype=="user"?
        <Usersignup queryParams={searchParams.toString()} index={compIndex}/>:
        <Vendorsignup queryParams={searchParams.toString()} vendorDetails={vendorDetails} setvendorDetails={setvendorDetails}/>
    }
    </>
  )
}
export default SignUp