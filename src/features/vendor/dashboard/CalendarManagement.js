'use client'
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVendorCalendar, getUpcomingBookings } from '@/api/vendorClient'
import { Calendar as Cal, Clock, CheckCircle } from 'lucide-react'

export function CalendarManagement() {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/me')
        if (response.ok) {
          const data = await response.json()
          setToken(data.token)
        }
      } catch (error) {
        console.error('Error fetching token:', error)
      }
    }
    fetchToken()
  }, [])

  const { data: calendarData, isLoading: calendarLoading } = useQuery({
    queryKey: ['vendorCalendar'],
    queryFn: () => getVendorCalendar(token),
    enabled: !!token
  })

  const { data: upcomingData, isLoading: upcomingLoading } = useQuery({
    queryKey: ['upcomingBookings'],
    queryFn: () => getUpcomingBookings(token, 30),
    enabled: !!token
  })

  if (calendarLoading || upcomingLoading) {
    return <div className="flex items-center justify-center h-64">Loading calendar...</div>
  }

  const upcomingBookings = upcomingData?.data || []

  // Compute available days from settings.defaultAvailability
  const defaultAvailability = calendarData?.data?.settings?.defaultAvailability || {}
  const availableDaysCount = Object.values(defaultAvailability).filter(day => day?.isAvailable).length
  const bookedSlotsCount = calendarData?.data?.bookedSlots?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Calendar & Availability</h1>
        <p className="text-gray-500 mt-1">Manage your schedule and availability</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <Cal className="text-[#C94C73]" size={24} />
            <div>
              <p className="text-sm text-gray-500">Events This Month</p>
              <p className="text-2xl font-bold">{upcomingBookings.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <Clock className="text-blue-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Available Days/Week</p>
              <p className="text-2xl font-bold">{availableDaysCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Booked Slots</p>
              <p className="text-2xl font-bold">{bookedSlotsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No upcoming events</p>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#C94C73]">
                      {new Date(booking.events?.[0]?.date).getDate()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.events?.[0]?.date).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.primaryContact?.name || booking.bookingNumber || 'Booking'}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {booking.events?.[0]?.type} • {booking.events?.[0]?.venue?.city}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] text-sm font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Availability Settings</h2>
        <p className="text-gray-500 mb-4">Configure your weekly availability and blocked dates</p>
        <button className="px-6 py-3 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] font-medium">
          Manage Availability
        </button>
      </div>
    </div>
  )
}
