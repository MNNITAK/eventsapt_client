'use client'
import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardOverview } from './DashboardOverview'
import { LeadsManagement } from './LeadsManagement'
import { BookingsManagement } from './BookingsManagement'
import { ServicesManagement } from './ServicesManagement'
import { PortfolioManagement } from './PortfolioManagement'
import { ReviewsManagement } from './ReviewsManagement'
import { CalendarManagement } from './CalendarManagement'
import { ProfileSettings } from './ProfileSettings'
import { ContentStudio } from './ContentStudio'
import { MediaLibrary } from './MediaLibrary'

/**
 * Main Vendor Control Panel Component
 * Complete dashboard for vendor management
 */
export function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // On mobile, selecting a tab should also close the slide-in drawer
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return <DashboardOverview />
      case 'leads':
        return <LeadsManagement />
      case 'bookings':
        return <BookingsManagement />
      case 'services':
        return <ServicesManagement />
      case 'portfolio':
        return <PortfolioManagement />
      case 'content':
        return <ContentStudio />
      case 'media':
        return <MediaLibrary />
      case 'reviews':
        return <ReviewsManagement />
      case 'calendar':
        return <CalendarManagement />
      case 'settings':
        return <ProfileSettings />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay backdrop (tap to close drawer) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation — static on desktop, slide-in drawer on mobile */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar with hamburger toggle */}
        <div className="md:hidden flex items-center gap-3 bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="text-gray-700 p-1 -ml-1"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-[#C94C73]">Vendor Hub</h1>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
