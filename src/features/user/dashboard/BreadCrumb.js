'use client'
import { ChevronRight } from "lucide-react";
import { House } from "lucide-react";
import { usePathname } from "next/navigation";
const userProfileComponent = {
  personal: "User Profile",
  memories: "Memories",
  trending: "Trendind",
  events: "Events",
  library: "Library",
}
function formatPath(path) {
  const parts = path.split("/").filter(Boolean);
  return "/ " + parts.join(" / ");
}
export function Separotor() {
    return (
        <span className="ml-2 mr-2">
            /
        </span>
    );
}
export  function Breadcrumb() {
  const path = usePathname();
  
  const parts = path.split("/").filter(Boolean);
  return (
    <div className="flex items-center text-sm bg-white/80 w-[95%] mx-auto backdrop-blur px-6 py-4 rounded-lg justify-between border shadow-sm">
        {/* page description here */}
      <span className="font-semibold text-gray-700">{userProfileComponent[parts[1]]}</span>
      {/* routes link */}
      <div className="flex items-center gap-2">
      <span className="flex items-center"><House size={18} color="#9a2143" /><Separotor/></span>

      {parts.map((part, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="bg-[#f4d8e1] text-[14px] text-[#9a2143] px-2 rounded-md">
            {part}
          </span>

          {index !== parts.length - 1 && <span>/</span>}
        </div>
      ))}
    </div>
    </div>
  );
}