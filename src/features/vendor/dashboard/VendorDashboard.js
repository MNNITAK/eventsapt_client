'use client'
import React, { useState } from 'react'
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
