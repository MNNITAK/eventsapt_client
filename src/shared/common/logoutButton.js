"use client"
import { logout } from "@/apiFunctions/logout"
import { TbLogout2 } from "react-icons/tb"
function LogoutButton() {
  return (
     <button onClick={logout} className='flex w-[95%] mx-auto  px-2 py-2 border-2 border-[#9a2143] text-[#9a2143]  md:py-2 md:px-4 rounded-lg  items-center'><TbLogout2 className='mr-2'/>Logout</button>
  )
}
export { LogoutButton }