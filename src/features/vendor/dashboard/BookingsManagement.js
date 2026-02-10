'use client'
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getVendorBookings, getUpcomingBookings } from '@/api/vendorClient'
import { Calendar, User, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react'

export function BookingsManagement() {
  const [token, setToken] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

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

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['vendorBookings', filterStatus],
    queryFn: () => getVendorBookings(token, { 
      status: filterStatus !== 'all' ? filterStatus : undefined 
    }),
    enabled: !!token
  })

  const bookings = bookingsData?.data?.bookings || []

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading bookings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-500 mt-1">Track and manage your confirmed bookings</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`
              px-4 py-2 rounded-lg font-medium capitalize transition-all
              ${filterStatus === status
                ? 'bg-[#C94C73] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 gap-4">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {booking.primaryContact?.name || booking.bookingNumber || 'Booking'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Booking ID: {booking.bookingNumber || booking._id?.substring(0, 8)}
                  </p>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                  ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                  ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(booking.events?.[0]?.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>{booking.events?.[0]?.venue?.city || 'Venue TBD'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign size={16} />
                  <span>₹{booking.pricing?.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] transition-all text-sm font-medium">
                  View Details
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                  Add Task
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                  Record Payment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
