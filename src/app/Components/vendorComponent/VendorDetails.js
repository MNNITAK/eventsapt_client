'use client'
import React from 'react'
import Image from 'next/image'
import ICO from "@/app/favicon.ico"
import { useRouter } from 'next/navigation'
function VendorDetails({vid,user,type,locationName}) {
    const router = useRouter()
    return (
        <>
            <main onClick={() => { router.push(`/home/user?tab=profile&vid=${vid}&vendorName=${user}&type=${type}`) }} className="flex items-center cursor-pointer gap-2">
                <Image alt="pic" src={ICO} width={40} height={40} />
                <span className="flex flex-col">
                    <span className="font-semibold">{user}</span>
                    <span className="font-normal text-[12px] text-white">{locationName}</span>
                </span>
            </main>
        </>
    )
}
export { VendorDetails }