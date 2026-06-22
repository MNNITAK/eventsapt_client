'use client'
import React from 'react'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  Image,
  Star,
  Settings,
  FileText,
  LogOut,
  Video,
  Library,
  X
} from 'lucide-react'

/**
 * Dashboard Sidebar Component
 * Navigation menu for vendor dashboard
 */
export function DashboardSidebar({ activeTab, setActiveTab, isOpen = false, onClose }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'services', label: 'Services & Packages', icon: Package },
    { id: 'portfolio', label: 'Portfolio', icon: Image },
    { id: 'content', label: 'Content Studio', icon: Video },
    { id: 'media', label: 'Media Library', icon: Library },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div
      className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 max-w-[80vw] h-full
        bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out md:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#C94C73]">Vendor Hub</h1>
          <p className="text-sm text-gray-500 mt-1">Control Panel</p>
        </div>
        {/* Close button (mobile drawer only) */}
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="md:hidden text-gray-500 hover:text-gray-700 p-1 -mr-1"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${isActive 
                  ? 'bg-[#C94C73] text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}
