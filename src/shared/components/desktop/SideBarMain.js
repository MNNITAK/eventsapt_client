'use client'
import React from 'react'
import { primaryList,secodaryList,tertiaryList } from './sidebarcontent.js'
import Image from 'next/image'
import ICO from "@/app/favicon.ico"
import { logout } from '@/apiFunctions/logout'
import { LogoutButton } from '../../common/logoutButton.js'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/store'
import { LuSearch } from "react-icons/lu";
function SideBarMain({tabParams,client}) {
   const router=useRouter()
   const { user:clientData } = useAuthStore.getState()
   //console.log(clientData);
   
   const srch=useSearchParams()
   tabParams={tab:srch.get('tab')}
   //console.log(client);
   
   return (
    <div className='w-[100%] h-[90vh] flex flex-col  justify-between  items-center '>
        <div className='w-[95%]  relative'>
          <input className='w-[100%] outline-none px-4 py-2 bg-[#e8e8e8] rounded-xl' type='text' placeholder='Search settings' />
          <LuSearch className='absolute right-4 top-[50%] -translate-y-1/2'/>
        </div>
        <hr />
        <div className='w-[95%] border-b-2  border-gray-200 pb-2'>
            {
               primaryList.map((item,pos)=>{
                return (
                  <div onClick={()=>{router.replace(`/home/user?tab=${item.tag.toLowerCase()}`)}} className={`font-semibold mt-[1px] mb-[1px] p-3 w-[100%] rounded-2xl transition-all duration-100 cursor-pointer flex items-center gap-2 ${item.tag.toLowerCase()==tabParams?.tab?"text-[white]  bg-[#9a2143] ":" hover:bg-[#f7d5e0] hover:text-[black]"}`} key={pos}>
                    <span className='text-[1.2rem]'>{item.icon}</span>
                    <p className='font-medium text-[1.1rem]'>{item.tag}</p>
                  </div>
                )
               }) 
            } 
        </div>
        <div className='w-[95%] border-b-2 border-gray-200 pb-2'>
            {
               secodaryList.map((item,pos)=>{
                return (
                  <div onClick={()=>{router.replace(`/home/user?tab=${item.tag.toLowerCase()}`)}} className={`font-semibold mt-[1px] mb-[1px] p-3 w-[100%] rounded-2xl transition-all duration-100 cursor-pointer flex items-center gap-2 ${item.tag.toLowerCase()==tabParams?.tab?"text-[white]  bg-[#9a2143] ":" hover:bg-[#f7d5e0] hover:text-[black]"}`} key={pos}>
                    <span className='text-[1.2rem]'>{item.icon}</span>
                    <p className='font-medium text-[1.1rem]'>{item.tag}</p>
                  </div>
                )
               }) 
            } 
        </div>
        <div className='w-[95%] '>
            {
               tertiaryList.map((item,pos)=>{
                return (
                  <div onClick={()=>{router.replace(`/home/user?tab=${item.tag.toLowerCase()}`)}} className={`font-semibold mt-[1px] mb-[1px] p-3 w-[100%] rounded-2xl transition-all duration-100 cursor-pointer flex items-center gap-2 ${item.tag.toLowerCase()==tabParams?.tab?"text-[white]  bg-[#9a2143] ":" hover:bg-[#f7d5e0] hover:text-[black]"}`} key={pos}>
                    <span className='text-[1.2rem]'>{item.icon}</span>
                    <p className='font-medium text-[1.1rem]'>{item.tag}</p>
                  </div>
                )
               }) 
            } 
        </div>
        <div className='w-[100%]'><LogoutButton/></div>
        <Link href={client=="user" ? `/profile/${client}` : `/profile/${client}/1`}  className='flex w-[95%] border-t-2 border-gray-500 pt-3 cursor-pointer items-center m-4'>
            <Image className='mr-2' alt='profile' src={ICO} width={30} height={30} />
            <p>Profile</p>
        </Link>
    </div>
  )
}
export { SideBarMain }