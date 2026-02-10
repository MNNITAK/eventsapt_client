'use client'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getMyVendorProfile, 
  updateBusinessInfo, 
  updateBusinessHours,
  addServiceArea,
  addTeamMember
} from '@/api/vendorClient'
import { Save, Plus, User, MapPin, Clock, Bell, Lock } from 'lucide-react'

export function ProfileSettings() {
  const [token, setToken] = useState(null)
  const [activeTab, setActiveTab] = useState('business')
  const queryClient = useQueryClient()

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

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['vendorProfile'],
    queryFn: () => getMyVendorProfile(token),
    enabled: !!token
  })

  const updateBusinessMutation = useMutation({
    mutationFn: (data) => updateBusinessInfo(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorProfile'])
    }
  })

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading settings...</div>
  }

  const profile = profileData?.data || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">Manage your business profile and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: 'business', label: 'Business Info', icon: User },
          { id: 'areas', label: 'Service Areas', icon: MapPin },
          { id: 'hours', label: 'Business Hours', icon: Clock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 font-medium transition-all
                ${activeTab === tab.id
                  ? 'text-[#C94C73] border-b-2 border-[#C94C73]'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'business' && (
        <BusinessInfoSettings profile={profile} onUpdate={(data) => updateBusinessMutation.mutate(data)} />
      )}
      {activeTab === 'areas' && (
        <ServiceAreasSettings profile={profile} token={token} />
      )}
      {activeTab === 'hours' && (
        <BusinessHoursSettings profile={profile} token={token} />
      )}
      {activeTab === 'notifications' && (
        <NotificationSettings profile={profile} />
      )}
      {activeTab === 'security' && (
        <SecuritySettings profile={profile} />
      )}
    </div>
  )
}

function BusinessInfoSettings({ profile, onUpdate }) {
  const [formData, setFormData] = useState({
    tagline: profile.businessInfo?.tagline || '',
    bio: profile.businessInfo?.bio || '',
    logo: profile.businessInfo?.logo || '',
    foundedYear: profile.businessInfo?.foundedYear || '',
    teamSize: profile.businessInfo?.teamSize || 'solo'
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
        <input
          type="text"
          value={profile.businessName}
          disabled
          className="w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Business name cannot be changed</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          placeholder="Capturing your perfect moments"
          maxLength={150}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.tagline.length}/150 characters</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={5}
          maxLength={2000}
          placeholder="Tell clients about your business..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
        />
        <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/2000 characters</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
          <input
            type="number"
            value={formData.foundedYear}
            onChange={(e) => setFormData({ ...formData, foundedYear: parseInt(e.target.value) })}
            placeholder="2015"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
          <select
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
          >
            <option value="solo">Solo</option>
            <option value="2-5">2-5</option>
            <option value="6-10">6-10</option>
            <option value="11-50">11-50</option>
            <option value="50+">50+</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => onUpdate(formData)}
        className="flex items-center gap-2 px-6 py-3 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] font-medium"
      >
        <Save size={18} />
        Save Changes
      </button>
    </div>
  )
}

function ServiceAreasSettings({ profile, token }) {
  const serviceAreas = profile.serviceAreas || []

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Service Areas</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62]">
          <Plus size={18} />
          Add Area
        </button>
      </div>

      <div className="space-y-3">
        {serviceAreas.map((area, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">{area.city}, {area.state}</h3>
              {area.isPrimary && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Primary</span>
              )}
            </div>
            {area.travelCharge > 0 && (
              <p className="text-sm text-gray-600">Travel Charge: ₹{area.travelCharge}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BusinessHoursSettings({ profile, token }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Business Hours</h2>
      <p className="text-gray-500 mb-6">Set your weekly availability schedule</p>
      
      <div className="space-y-4">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
          <div key={day} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="font-medium w-24">{day}</span>
            <input
              type="time"
              defaultValue="09:00"
              className="px-3 py-2 border rounded-lg"
            />
            <span>to</span>
            <input
              type="time"
              defaultValue="18:00"
              className="px-3 py-2 border rounded-lg"
            />
          </div>
        ))}
      </div>

      <button className="mt-6 px-6 py-3 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] font-medium">
        Save Hours
      </button>
    </div>
  )
}

function NotificationSettings({ profile }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
      
      <div className="space-y-4">
        {[
          { label: 'New Leads', description: 'Get notified when you receive new inquiries' },
          { label: 'Bookings', description: 'Updates about booking confirmations and changes' },
          { label: 'Payments', description: 'Payment received and pending notifications' },
          { label: 'Reviews', description: 'New reviews from clients' },
          { label: 'Marketing', description: 'Tips and promotional offers' }
        ].map((item) => (
          <div key={item.label} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">{item.label}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked />
                Email
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked />
                Push
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SecuritySettings({ profile }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Change Password</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input type="password" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input type="password" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input type="password" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <button className="px-6 py-3 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] font-medium">
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Account Status</h2>
        <div className="max-w-md">
          <p className="text-gray-600 mb-4">
            Your account is currently <span className="font-semibold text-green-600">Active</span>
          </p>
          <button className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  )
}
