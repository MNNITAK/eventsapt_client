'use client'
import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMyVendorProfile, getLeadStats, getBookingStats } from '@/api/vendorClient'
import { TrendingUp, Users, Calendar, Star, DollarSign, Package } from 'lucide-react'

/**
 * Dashboard Overview Component
 * Main dashboard with stats and quick actions
 */
export function DashboardOverview() {
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Fetch token from server-side API route
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          const data = await response.json();
          console.log("DashboardOverview - Retrieved token from /api/me:", data);
          setToken(data.token);
        } else {
          console.error("Failed to fetch token:", response.status);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    
    fetchToken();
  }, [])

  // Fetch vendor profile
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['vendorProfile'],
    queryFn: () => getMyVendorProfile(token),
    enabled: !!token
  })

  // Fetch lead stats
  const { data: leadStats, isLoading: leadsLoading } = useQuery({
    queryKey: ['leadStats'],
    queryFn: () => getLeadStats(token),
    enabled: !!token
  })

  // Fetch booking stats
  const { data: bookingStats, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookingStats'],
    queryFn: () => getBookingStats(token),
    enabled: !!token
  })

  const stats = [
    {
      title: 'Total Leads',
      value: leadStats?.data?.total || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Bookings',
      value: (bookingStats?.data?.confirmed || 0) + (bookingStats?.data?.in_progress || 0),
      icon: Calendar,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Average Rating',
      value: profileData?.data?.stats?.avgRating?.toFixed(1) || '0.0',
      icon: Star,
      color: 'bg-yellow-500',
      change: '+0.2'
    },
    {
      title: 'Revenue (This Month)',
      value: `₹${bookingStats?.data?.totalRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+18%'
    },
    {
      title: 'Services',
      value: profileData?.data?.services?.length || profileData?.data?.servicesProvided?.length || 0,
      icon: Package,
      color: 'bg-indigo-500',
      change: 'Active'
    },
    {
      title: 'Profile Views',
      value: profileData?.data?.stats?.profileViews || 0,
      icon: TrendingUp,
      color: 'bg-pink-500',
      change: '+25%'
    }
  ]

  if (profileLoading || leadsLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profileData?.data?.businessName || 'Vendor'}!
        </h1>
        <p className="text-gray-500 mt-2">
          Here's what's happening with your business today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-[#C94C73] rounded-lg hover:bg-[#C94C73] hover:text-white transition-all text-[#C94C73] font-semibold">
            Add New Service
          </button>
          <button className="p-4 border-2 border-[#C94C73] rounded-lg hover:bg-[#C94C73] hover:text-white transition-all text-[#C94C73] font-semibold">
            Upload Portfolio
          </button>
          <button className="p-4 border-2 border-[#C94C73] rounded-lg hover:bg-[#C94C73] hover:text-white transition-all text-[#C94C73] font-semibold">
            View New Leads
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">New lead received</p>
              <p className="text-sm text-gray-500">Wedding photography inquiry</p>
            </div>
            <span className="text-sm text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Booking confirmed</p>
              <p className="text-sm text-gray-500">Sharma-Patel Wedding</p>
            </div>
            <span className="text-sm text-gray-400">1 day ago</span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">New review received</p>
              <p className="text-sm text-gray-500">5-star rating from John Doe</p>
            </div>
            <span className="text-sm text-gray-400">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}
