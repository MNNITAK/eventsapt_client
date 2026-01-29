export const metadata={
  title:"Authpage"
}
import React from 'react'
import Logo from '@/shared/common/logo.js'
import AuthPage from '@/features/auth/_authPageStructure/authStruct.js'
async function page(props) {
  let {usertype}= await props.params
  return (
    <main className="w-screen  bg-white h-screen flex flex-col items-center md:flex-row md:justify-center md:items-center">
      <div className='md:w-1/3 w-[95%] h-1/3 mt-10 md:mt-0 bg-[#dcdcde] rounded-lg'></div>
      <div className='w-screen  flex- flex-col items-center md:w-1/3 h-1/2   md:py-10 '>
      <div className='mt-4 md:mt-1'><Logo/></div>
      <AuthPage usertype={usertype}/>
      </div>
    </main>
  )
}
export default page