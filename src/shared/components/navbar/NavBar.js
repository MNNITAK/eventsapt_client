import Logo from "@/shared/common/logo"
import SelectPage from "./SelectPage";
import { FiBell } from "react-icons/fi";
import { TbNotification } from "react-icons/tb";
import Link from "next/link";
import { TbMessageChatbot } from "react-icons/tb";
function NavBar({user}) {
  return (
    <div className="flex h-[10vh]  justify-between py-4 items-center md:border-0">
        <nav className="flex justify-around items-center">
        <span className="scale-75"><Logo/></span>
        <SelectPage/>
        </nav>
        <div className="text-[17px] font-bold flex mr-4">
            <Link href={`/chatpen/${user}?cs=0`}><FiBell className="mr-2"/></Link>
            <Link href={`/chatpen/${user}?cs=0`}><TbNotification className="mr-2"/></Link>
            <Link href={`/chatbot`}><TbMessageChatbot/></Link>
        </div>
    </div>
  )
}
export { NavBar }