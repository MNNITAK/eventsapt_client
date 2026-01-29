"use client"
import { logout } from "@/apiFunctions/logout"
import { TbLogout2 } from "react-icons/tb"
function LogoutButton() {
  return (
     <button onClick={logout} className='flex md:ml-4 px-2 py-2 bg-[#C94C73] text-white md:py-2 md:px-4 rounded-lg md:mt-4 items-center'><TbLogout2 className='mr-2'/>Logout</button>
  )
}
export { LogoutButton }