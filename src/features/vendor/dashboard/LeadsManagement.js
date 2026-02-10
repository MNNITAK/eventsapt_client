'use client'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getVendorLeads, 
  updateLeadStatus, 
  toggleLeadStar, 
  markLeadAsRead,
  addLeadNote,
  scheduleLeadFollowUp
} from '@/api/vendorClient'
import { 
  Search, 
  Filter, 
  Star, 
  Phone, 
  Mail, 
  Calendar,
  Plus,
  MoreVertical,
  User,
  MapPin
} from 'lucide-react'

/**
 * Leads Management Component
 * Manage all vendor inquiries and leads
 */
export function LeadsManagement() {
  const [token, setToken] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
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

  // Fetch leads
  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['vendorLeads', filterStatus],
    queryFn: () => getVendorLeads(token, { 
      status: filterStatus !== 'all' ? filterStatus : undefined 
    }),
    enabled: !!token
  })

  // Update lead status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ leadId, status }) => updateLeadStatus(token, leadId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorLeads'])
    }
  })

  // Toggle star mutation
  const toggleStarMutation = useMutation({
    mutationFn: (leadId) => toggleLeadStar(token, leadId),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorLeads'])
    }
  })

  const leads = leadsData?.data?.leads || []
  const filteredLeads = leads.filter(lead => 
    lead.leadNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.eventDetails?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.eventDetails?.venue?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusOptions = [
    { value: 'all', label: 'All Leads', color: 'gray' },
    { value: 'new', label: 'New', color: 'blue' },
    { value: 'contacted', label: 'Contacted', color: 'yellow' },
    { value: 'qualified', label: 'Qualified', color: 'green' },
    { value: 'proposal_sent', label: 'Proposal Sent', color: 'purple' },
    { value: 'won', label: 'Won', color: 'emerald' },
    { value: 'lost', label: 'Lost', color: 'red' },
  ]

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading leads...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-500 mt-1">Manage your inquiries and potential clients</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`
                  px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                  ${filterStatus === status.value
                    ? 'bg-[#C94C73] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No leads found</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Lead Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => toggleStarMutation.mutate(lead._id)}
                      className={`${lead.isStarred ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                    >
                      <Star size={20} fill={lead.isStarred ? 'currentColor' : 'none'} />
                    </button>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lead.leadNumber || 'Lead'}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {lead.eventDetails?.type} • {lead.eventDetails?.date ? new Date(lead.eventDetails.date).toLocaleDateString() : 'Date TBD'}
                      </p>
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                      ${lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${lead.status === 'qualified' ? 'bg-green-100 text-green-800' : ''}
                      ${lead.status === 'won' ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${lead.status === 'lost' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {lead.status}
                    </span>
                  </div>

                  {/* Lead Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} />
                      <span>{lead.communication?.preferredMethod || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={16} />
                      <span>Source: {lead.source || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{lead.eventDetails?.venue?.city || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Budget */}
                  {lead.budget && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        Budget: ₹{lead.budget.min?.toLocaleString()} - ₹{lead.budget.max?.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {/* Message */}
                  {lead.initialMessage && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{lead.initialMessage}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatusMutation.mutate({ 
                        leadId: lead._id, 
                        status: e.target.value 
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="negotiating">Negotiating</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                    
                    <button className="px-4 py-2 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] transition-all text-sm font-medium">
                      Create Quote
                    </button>
                    
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                      Schedule Follow-up
                    </button>
                    
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
