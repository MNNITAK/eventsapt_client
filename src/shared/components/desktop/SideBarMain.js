'use client'
import React from 'react'
import { primaryList, secodaryList, tertiaryList } from './sidebarcontent.js'
import { LogoutButton } from '../../common/logoutButton.js'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/store'

function SideBarMain({ client }) {
    const router = useRouter()
    const { user: clientData } = useAuthStore.getState()
    const srch = useSearchParams()
    const activeTab = srch.get('tab')

    const allNavItems = [...primaryList, ...secodaryList, ...tertiaryList]

    return (
        <div className='w-full flex flex-col justify-between flex-1 py-4 px-4 overflow-y-auto'>

            {/* Nav items */}
            <nav className='flex flex-col gap-1'>
                {allNavItems.map((item, pos) => {
                    const isActive = item.tag.toLowerCase() === activeTab
                    return (
                        <div
                            key={pos}
                            onClick={() => router.replace(`/home/user?tab=${item.tag.toLowerCase()}`)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-full cursor-pointer transition-all duration-150 ${
                                isActive
                                    ? 'bg-[#1f1f1f] text-[#ff89ac]'
                                    : 'text-[#71717a] hover:bg-[#1a1a1a] hover:text-white'
                            }`}
                        >
                            <span className={`text-[1.1rem] ${isActive ? 'text-[#ff89ac]' : ''}`}>
                                {item.icon}
                            </span>
                            <span className={`font-medium text-[0.9rem] ${isActive ? 'font-bold text-[#ff89ac]' : ''}`}>
                                {item.tag}
                            </span>
                        </div>
                    )
                })}
            </nav>

            {/* Bottom section */}
            <div className='flex flex-col gap-4 mt-6 px-2'>
                {/* Become a Vendor CTA */}
                <button
                    onClick={() => router.push('/vendor-dashboard')}
                    className='w-full py-3 rounded-full bg-gradient-to-r from-[#ff89ac] to-[#a68cff] text-black font-semibold text-sm text-center shadow-[0px_0px_20px_0px_rgba(255,137,172,0.25)] hover:shadow-[0px_0px_28px_0px_rgba(255,137,172,0.4)] transition-all duration-200'
                >
                    Become a Vendor
                </button>

                {/* Profile link */}
                <Link
                    href={client === 'user' ? `/profile/${client}` : `/profile/${client}/1`}
                    className='flex items-center gap-3 px-2 pt-4 border-t border-[#1f1f1f] cursor-pointer group'
                >
                    <div className='w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff89ac] to-[#a68cff] flex items-center justify-center flex-shrink-0'>
                        <span className='text-black font-bold text-xs'>
                            {clientData?.businessName?.[0]?.toUpperCase() || clientData?.name?.[0]?.toUpperCase() || 'W'}
                        </span>
                    </div>
                    <span className='text-[#71717a] text-sm font-medium group-hover:text-white transition-colors'>
                        Profile
                    </span>
                </Link>

                <div className='px-2'>
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}

export { SideBarMain }
