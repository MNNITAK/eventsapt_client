'use client'
import React from 'react'
import { NavigatorList } from './sidebarcontent.js'
import Image from 'next/image'
import ICO from "@/app/favicon.ico"
import { logout } from '@/apiFunctions/logout'
import { LogoutButton } from '../../common/logoutButton.js'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/store'
function SideBarMain({tabParams,client}) {
   const router=useRouter()
   const { user:clientData } = useAuthStore.getState()
   //console.log(clientData);
   
   const srch=useSearchParams()
   tabParams={tab:srch.get('tab')}
   //console.log(client);
   
   return (
    <div className='w-[100%] h-[75%] flex flex-col justify-between mt-[15vh]'>
        <div>
            {
               NavigatorList.map((item,pos)=>{
                return (
                  <div onClick={()=>{router.replace(`/home/user?tab=${item.tag.toLowerCase()}`)}} className={`ml-4 py-2 pl-2 cursor-pointer flex items-center gap-2 ${item.tag.toLowerCase()==tabParams?.tab?"text-[#9A2143] border-l-2 border-[#9A2143] bg-[#d3739217] ":"text-gray-500 hover:text-[#C94C73]"}`} key={pos}>
                    <span className='text-[1.2rem]'>{item.icon}</span>
                    <p className='font-medium text-[1rem]'>{item.tag}</p>
                  </div>
                )
               }) 
            } 
            <LogoutButton/>
        </div>
        <Link href={client=="user" ? `/profile/${client}` : `/profile/${client}/1`}  className='flex cursor-pointer items-center m-4'>
            <Image className='mr-2' alt='profile' src={ICO} width={30} height={30} />
            <p>Profile</p>
        </Link>
    </div>
  )
}
export { SideBarMain }