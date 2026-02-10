'use client'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getVendorReviews, respondToReview } from '@/api/vendorClient'
import { Star, MessageSquare, ThumbsUp } from 'lucide-react'

export function ReviewsManagement() {
  const [token, setToken] = useState(null)
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

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['vendorReviews'],
    queryFn: () => getVendorReviews(token),
    enabled: !!token
  })

  const respondMutation = useMutation({
    mutationFn: ({ reviewId, response }) => respondToReview(token, reviewId, response),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorReviews'])
    }
  })

  const reviews = reviewsData?.data?.reviews || []

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading reviews...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
        <p className="text-gray-500 mt-1">Manage customer feedback and ratings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Average Rating</p>
          <p className="text-3xl font-bold text-yellow-500">
            {reviewsData?.data?.stats?.avgRating?.toFixed(1) || '0.0'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">5-Star Reviews</p>
          <p className="text-3xl font-bold text-green-600">
            {reviews.filter(r => r.overallRating === 5).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Response Rate</p>
          <p className="text-3xl font-bold text-blue-600">
            {reviews.length > 0 
              ? Math.round((reviews.filter(r => r.vendorResponse).length / reviews.length) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <p className="text-gray-500">No reviews yet</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {review.reviewer?.name?.[0] || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.reviewer?.name || 'Anonymous'}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              fill={star <= review.overallRating ? '#FFC107' : 'none'}
                              className={star <= review.overallRating ? 'text-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  )}
                  <p className="text-gray-700 mb-3">{review.content}</p>

                  {/* Vendor Response */}
                  {review.vendorResponse ? (
                    <div className="bg-gray-50 rounded-lg p-4 ml-8">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Your Response:</p>
                      <p className="text-sm text-gray-700">{review.vendorResponse.content}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        const response = prompt('Enter your response:')
                        if (response) {
                          respondMutation.mutate({ reviewId: review._id, response })
                        }
                      }}
                      className="ml-8 flex items-center gap-2 px-4 py-2 border border-[#C94C73] text-[#C94C73] rounded-lg hover:bg-[#C94C73] hover:text-white transition-all"
                    >
                      <MessageSquare size={16} />
                      Respond to Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
