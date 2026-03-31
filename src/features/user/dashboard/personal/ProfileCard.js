"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { PenLine } from "lucide-react";
export function ProfileHeroCard() {
  return (
    <div className="bg-white w-[95%] mx-auto mt-5 rounded-3xl rounded-t-[60px] shadow-md overflow-hidden">
      {/* Cover */}
      <div className="relative h-[20vh] bg-gradient-to-br from-indigo-200 via-purple-200 to-slate-100">
        <button className="absolute bottom-4 flex items-center text-[10px] right-4 rounded-md bg-[#C94C73] text-white p-1.5 ">Change Cover <PenLine size={13} className="ml-1" color="#ffffff" /></button>
        {/* Profile Image */}
        <div className="absolute flex items-center gap-4 top-1/2 -translate-y-1/2 left-5">
          <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/2095597/pexels-photo-2095597.jpeg"
              alt="profile"
              fill
              className="object-cover"
            />

            <button className="absolute bottom-1 right-1 bg-black text-white p-1.5 rounded-full">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Akshay Yadav</h2>
            <p className="text-gray-500 text-sm">Organizer</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-4 pt-4  px-6 flex justify-between items-center">
        {/* <div>
          <h2 className="text-xl font-semibold">Mai kon?</h2>
        <p className="text-gray-500 text-sm">Organizer</p>
        </div> */}

        {/* Stats */}
        <div className="flex justify-center gap-8 ">
          <Stat label="Posts" value="938" />
          <Stat label="Followers" value="3,586" />
          <Stat label="Following" value="2,659" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="font-semibold text-lg">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}