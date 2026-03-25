import { ChevronRight } from "lucide-react";
import { House } from "lucide-react";
export function Separotor() {
    return (
        <span className="ml-2 mr-2">
            /
        </span>
    );
}
export  function Breadcrumb({ items = {} }) {
  return (
    <div className="flex items-center text-sm bg-white/80 w-[95%] mx-auto backdrop-blur px-6 py-4 rounded-lg justify-between border shadow-sm">
        {/* page description here */}
      <span className="font-semibold text-gray-700">User Profile</span>
      {/* routes link */}
      <div className="flex items-center">
       <span className="flex items-center"> <House color="#9a2143" size={18} /><Separotor /></span>
        <span className="bg-[#f4d8e1] text-[14px] text-[#9a2143] px-2  rounded-md">user-profile</span>
        
      </div>
    </div>
  );
}