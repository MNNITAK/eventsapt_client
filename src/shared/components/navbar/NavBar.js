import Logo from "@/shared/common/logo"
import { FiBell } from "react-icons/fi";
import { TbMessageChatbot } from "react-icons/tb";
import Link from "next/link";

function NavBar({ user }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f] md:border-b-0 md:py-6">
      {/* Brand / Logo */}
      <div className="scale-75 origin-left md:scale-100">
        <Logo />
      </div>

      {/* Action icons — visible on mobile only; desktop puts these elsewhere */}
      <div className="flex items-center gap-4 text-[#adaaaa] md:hidden">
        <Link href={`/chatpen/${user}?cs=0`}>
          <FiBell className="text-xl hover:text-white transition-colors" />
        </Link>
        <Link href={`/chatbot`}>
          <TbMessageChatbot className="text-xl hover:text-white transition-colors" />
        </Link>
      </div>

      {/* Desktop: notification icons shown above sidebar nav */}
      <div className="hidden md:flex items-center gap-3 text-[#adaaaa]">
        <Link href={`/chatpen/${user}?cs=0`}>
          <FiBell className="text-lg hover:text-white transition-colors" />
        </Link>
        <Link href={`/chatbot`}>
          <TbMessageChatbot className="text-lg hover:text-white transition-colors" />
        </Link>
      </div>
    </div>
  )
}

export { NavBar }
