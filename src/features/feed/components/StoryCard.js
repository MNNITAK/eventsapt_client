'use client'
import React from 'react'
import { BsPlayFill } from 'react-icons/bs'

function StoryCard({ item, onClick }) {
    const isReel = item?.contentType === 'reel'
    const thumbnail = isReel ? item?.video?.thumbnail : item?.media?.[0]?.url
    const name = item?.authorBusinessName || 'Vendor'
    const initial = name[0]?.toUpperCase()

    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-1.5 focus:outline-none flex-shrink-0 px-1"
        >
            {/* Gradient ring — pink → red → purple like Instagram */}
            <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                {/* Dark gap between ring and image */}
                <div className="p-[2px] rounded-full bg-[#0e0e0e]">
                    <div className="w-14 h-14 md:w-[3.8rem] md:h-[3.8rem] rounded-full overflow-hidden relative">
                        {thumbnail ? (
                            <img
                                src={thumbnail}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#ff89ac]/30 to-[#a68cff]/30 flex items-center justify-center">
                                <span className="text-lg font-bold text-[#ff89ac]">{initial}</span>
                            </div>
                        )}
                        {isReel && (
                            <div className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-[#ee2a7b] flex items-center justify-center">
                                <BsPlayFill className="text-white text-[8px] ml-px" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <span className="text-[10px] text-[#adaaaa] truncate max-w-[56px] text-center leading-tight">
                {name.split(' ')[0]}
            </span>
        </button>
    )
}
export { StoryCard }
