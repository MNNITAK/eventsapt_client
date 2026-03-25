"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

export  function ProfileHeroCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Cover */}
      <div className="relative h-60 bg-gradient-to-br from-indigo-200 via-purple-200 to-slate-100">
        {/* Profile Image */}
        <div className="absolute left-1/2 -bottom-12 -translate-x-1/2">
          <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
            <Image
              src="https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp"
              alt="profile"
              fill
              className="object-cover"
            />

            <button className="absolute bottom-1 right-1 bg-black text-white p-1.5 rounded-full">
              <Camera size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 pb-6 px-6 text-center">
        <h2 className="text-xl font-semibold">Mathew Anderson</h2>
        <p className="text-gray-500 text-sm">Designer</p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-6">
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