'use client'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getMyVendorProfile,
  addService,
  updateService,
  deleteService,
  addPackage,
  updatePackage,
  deletePackage,
  addPackageMedia,
  setPackageCoverImage
} from '@/api/vendorClient'
import { uploadMedia } from '@/api/mediaClient'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  DollarSign,
  Image as ImageIcon,
  Video,
  Save,
  X,
  Upload,
  Camera,
  Loader2,
  ChevronDown,
  ChevronUp,
  Play
} from 'lucide-react'

/**
 * Services Management Component
 * Manage services, packages, and pricing
 */
export function ServicesManagement() {
  const [token, setToken] = useState(null)
  const [showAddService, setShowAddService] = useState(false)
  const [showAddPackage, setShowAddPackage] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const [editingPackage, setEditingPackage] = useState(null)
  const [uploadingMedia, setUploadingMedia] = useState(null) // { serviceId, packageId, type: 'gallery'|'cover' }
  const [expandedGallery, setExpandedGallery] = useState(null) // packageId whose gallery is expanded
  const [lightboxImage, setLightboxImage] = useState(null) // URL of image in lightbox
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

  // Fetch vendor profile to get services
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['vendorProfile'],
    queryFn: () => getMyVendorProfile(token),
    enabled: !!token
  })

  // Add service mutation
  const addServiceMutation = useMutation({
    mutationFn: (serviceData) => addService(token, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorProfile'])
      setShowAddService(false)
    }
  })

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: (serviceId) => deleteService(token, serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorProfile'])
    }
  })

  // Add package mutation
  const addPackageMutation = useMutation({
    mutationFn: ({ serviceId, packageData }) => addPackage(token, serviceId, packageData),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorProfile'])
      setShowAddPackage(null)
    }
  })

  // Delete package mutation
  const deletePackageMutation = useMutation({
    mutationFn: ({ serviceId, packageId }) => deletePackage(token, serviceId, packageId),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorProfile'])
    }
  })

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: ({ serviceId, serviceData }) => updateService(token, serviceId, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorProfile'])
      setEditingService(null)
    }
  })

  // Update package mutation
  const updatePackageMutation = useMutation({
    mutationFn: ({ serviceId, packageId, packageData }) => 
      updatePackage(token, serviceId, packageId, packageData),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorProfile'])
      setEditingPackage(null)
    }
  })

  /**
   * Upload file to media service, then save URL to vendor service
   * Flow: File → Media Service (S3) → get URL → addPackageMedia / setPackageCoverImage
   */
  const handleMediaUpload = async (file, serviceId, packageId, type = 'gallery') => {
    if (!file || !token) return
    setUploadingMedia({ serviceId, packageId, type })
    try {
      // Step 1: Upload to media service → get URL
      const uploadResult = await uploadMedia(token, file, {
        context: 'portfolio',
        folder: 'packages',
        tags: ['package', type === 'cover' ? 'cover' : 'gallery', serviceId, packageId]
      })
      const mediaData = uploadResult.data // { mediaId, url, thumbnailUrl, mediaType, ... }

      if (type === 'cover') {
        // Step 2a: Set as cover image on vendor service
        await setPackageCoverImage(token, serviceId, packageId, mediaData.url)
      } else {
        // Step 2b: Add to package gallery on vendor service
        await addPackageMedia(token, serviceId, packageId, {
          url: mediaData.url,
          type: mediaData.mediaType || 'image',
          caption: '',
          alt: file.name
        })
      }

      queryClient.invalidateQueries(['vendorProfile'])
    } catch (error) {
      console.error('Upload failed:', error)
      alert(error?.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploadingMedia(null)
    }
  }

  const services = profileData?.data?.services || []

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading services...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services & Packages</h1>
          <p className="text-gray-500 mt-1">Manage your service offerings and pricing</p>
        </div>
        <button
          onClick={() => setShowAddService(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] transition-all font-medium"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <AddServiceModal
          onClose={() => setShowAddService(false)}
          onSubmit={(data) => addServiceMutation.mutate(data)}
          isLoading={addServiceMutation.isPending}
        />
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onSubmit={(data) => updateServiceMutation.mutate({ 
            serviceId: editingService._id, 
            serviceData: data 
          })}
          isLoading={updateServiceMutation.isPending}
        />
      )}

      {/* Services List */}
      <div className="space-y-6">
        {services.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No services yet</h3>
            <p className="text-gray-500 mb-6">Start by adding your first service offering</p>
            <button
              onClick={() => setShowAddService(true)}
              className="px-6 py-3 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] transition-all font-medium"
            >
              Add Your First Service
            </button>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              {/* Service Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {service.category}
                  </h2>
                  {service.description && (
                    <p className="text-gray-600 mt-2">{service.description}</p>
                  )}
                  {service.subcategories && service.subcategories.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {service.subcategories.map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingService(service)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this service?')) {
                        deleteServiceMutation.mutate(service._id)
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Packages Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Packages</h3>
                    <p className="text-xs text-gray-500 mt-1">Create packages and upload media (photos/videos) to showcase your work</p>
                  </div>
                  <button
                    onClick={() => setShowAddPackage(service._id)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-[#C94C73] text-[#C94C73] rounded-lg hover:bg-[#C94C73] hover:text-white transition-all font-medium"
                  >
                    <Plus size={18} />
                    Add Package
                  </button>
                </div>

                {/* Add Package Modal */}
                {showAddPackage === service._id && (
                  <AddPackageModal
                    serviceId={service._id}
                    onClose={() => setShowAddPackage(null)}
                    onSubmit={(data) => addPackageMutation.mutate({ 
                      serviceId: service._id, 
                      packageData: data 
                    })}
                    isLoading={addPackageMutation.isPending}
                  />
                )}

                {/* Edit Package Modal */}
                {editingPackage && editingPackage.serviceId === service._id && (
                  <EditPackageModal
                    package={editingPackage}
                    serviceId={service._id}
                    onClose={() => setEditingPackage(null)}
                    onSubmit={(data) => updatePackageMutation.mutate({ 
                      serviceId: service._id,
                      packageId: editingPackage._id, 
                      packageData: data 
                    })}
                    isLoading={updatePackageMutation.isPending}
                  />
                )}

                {/* Packages List */}
                {service.packages && service.packages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {service.packages.map((pkg) => (
                      <div
                        key={pkg._id}
                        className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#C94C73] transition-all"
                      >
                        {/* Package Cover Image */}
                        <div className="mb-3 rounded-lg overflow-hidden h-40 bg-gray-100 relative group">
                          {pkg.media?.coverImage ? (
                            <>
                              <img
                                src={pkg.media.coverImage}
                                alt={pkg.name}
                                className="w-full h-full object-cover"
                              />
                              {/* Overlay to change cover */}
                              <label className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center cursor-pointer transition-all">
                                <span className="hidden group-hover:flex items-center gap-1 text-white text-sm font-medium">
                                  {uploadingMedia?.packageId === pkg._id && uploadingMedia?.type === 'cover'
                                    ? <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                                    : <><Camera size={16} /> Change Cover</>}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleMediaUpload(file, service._id, pkg._id, 'cover')
                                    e.target.value = ''
                                  }}
                                  disabled={!!uploadingMedia}
                                />
                              </label>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-200 transition-all">
                              {uploadingMedia?.packageId === pkg._id && uploadingMedia?.type === 'cover'
                                ? <><Loader2 className="text-gray-400 animate-spin" size={32} /><span className="text-xs text-gray-500 mt-1">Uploading...</span></>
                                : <><Camera className="text-gray-400" size={32} /><span className="text-xs text-gray-500 mt-1">Add Cover Image</span></>}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleMediaUpload(file, service._id, pkg._id, 'cover')
                                  e.target.value = ''
                                }}
                                disabled={!!uploadingMedia}
                              />
                            </label>
                          )}
                        </div>

                        {/* No Media Alert - Show when package has no media */}
                        {(!pkg.media?.coverImage && (!pkg.media?.gallery || pkg.media.gallery.length === 0)) && (
                          <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <Upload className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                              <div className="text-xs">
                                <p className="font-semibold text-amber-900 mb-1">Add Media to Showcase</p>
                                <p className="text-amber-700">Click the cover area above or "Upload Media" button below to add photos/videos</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Package Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                            {pkg.isPopular && (
                              <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => setEditingPackage({ ...pkg, serviceId: service._id })}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Delete this package?')) {
                                  deletePackageMutation.mutate({
                                    serviceId: service._id,
                                    packageId: pkg._id
                                  })
                                }
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-3">
                          <p className="text-2xl font-bold text-[#C94C73]">
                            ₹{pkg.price?.toLocaleString()}
                          </p>
                          {pkg.priceType && (
                            <p className="text-sm text-gray-500 capitalize">
                              {pkg.priceType.replace('_', ' ')}
                            </p>
                          )}
                        </div>

                        {/* Description */}
                        {pkg.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {pkg.description}
                          </p>
                        )}

                        {/* Inclusions */}
                        {pkg.inclusions && pkg.inclusions.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Includes:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {pkg.inclusions.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <span className="text-green-500 mt-0.5">✓</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                              {pkg.inclusions.length > 3 && (
                                <li className="text-[#C94C73] font-medium">
                                  +{pkg.inclusions.length - 3} more
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Media Count + Upload Button */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                          <div className="flex gap-3">
                            {pkg.media?.gallery?.length > 0 && (
                              <button 
                                onClick={() => setExpandedGallery(expandedGallery === pkg._id ? null : pkg._id)}
                                className="flex items-center gap-1 hover:text-[#C94C73] transition-colors"
                              >
                                <ImageIcon size={14} />
                                {pkg.media.gallery.length} photos
                                {expandedGallery === pkg._id 
                                  ? <ChevronUp size={12} /> 
                                  : <ChevronDown size={12} />}
                              </button>
                            )}
                            {pkg.media?.videos?.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Video size={14} />
                                {pkg.media.videos.length} videos
                              </span>
                            )}
                            {(!pkg.media?.gallery || pkg.media.gallery.length === 0) && 
                             (!pkg.media?.videos || pkg.media.videos.length === 0) && (
                              <span className="text-gray-400 text-xs">No media yet</span>
                            )}
                          </div>
                          <label className="flex items-center gap-1 px-3 py-1.5 bg-[#C94C73] text-white hover:bg-[#b43d62] rounded cursor-pointer transition-all text-xs font-medium">
                            {uploadingMedia?.packageId === pkg._id && uploadingMedia?.type === 'gallery'
                              ? <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                              : <><Upload size={14} /> Upload Media</>}
                            <input
                              type="file"
                              accept="image/*,video/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleMediaUpload(file, service._id, pkg._id, 'gallery')
                                e.target.value = ''
                              }}
                              disabled={!!uploadingMedia}
                            />
                          </label>
                        </div>

                        {/* Gallery Grid - Expandable */}
                        {expandedGallery === pkg._id && pkg.media?.gallery?.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Gallery ({pkg.media.gallery.length})</p>
                            <div className="grid grid-cols-3 gap-2">
                              {pkg.media.gallery.map((item, idx) => (
                                <div 
                                  key={idx} 
                                  className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                                  onClick={() => setLightboxImage(item.url)}
                                >
                                  {item.type === 'video' ? (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                      {item.thumbnailUrl ? (
                                        <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-70" />
                                      ) : null}
                                      <Play size={24} className="absolute text-white drop-shadow-lg" />
                                    </div>
                                  ) : (
                                    <img
                                      src={item.url}
                                      alt={item.alt || item.caption || `Photo ${idx + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                  )}
                                  {/* Hover overlay */}
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                    <ImageIcon size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Always show gallery preview (first 3 thumbnails) when collapsed and has media */}
                        {expandedGallery !== pkg._id && pkg.media?.gallery?.length > 0 && (
                          <div 
                            className="mt-2 flex gap-1.5 cursor-pointer"
                            onClick={() => setExpandedGallery(pkg._id)}
                          >
                            {pkg.media.gallery.slice(0, 4).map((item, idx) => (
                              <div key={idx} className="w-10 h-10 rounded overflow-hidden bg-gray-100 relative flex-shrink-0">
                                {item.type === 'video' ? (
                                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <Play size={10} className="text-white" />
                                  </div>
                                ) : (
                                  <img
                                    src={item.url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                            ))}
                            {pkg.media.gallery.length > 4 && (
                              <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
                                +{pkg.media.gallery.length - 4}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Status */}
                        <div className="mt-3 pt-3 border-t">
                          <span className={`
                            inline-block px-2 py-1 rounded-full text-xs font-medium
                            ${pkg.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                            }
                          `}>
                            {pkg.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No packages yet. Add your first package to this service.
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={lightboxImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

// Add Service Modal Component
function AddServiceModal({ onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    category: '',
    subcategories: [],
    description: '',
    isActive: true
  })
  const [subcategoryInput, setSubcategoryInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addSubcategory = () => {
    if (subcategoryInput.trim()) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, subcategoryInput.trim()]
      })
      setSubcategoryInput('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Add New Service</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Category *
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Photography, Videography, Makeup"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Subcategories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategories
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={subcategoryInput}
                onChange={(e) => setSubcategoryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubcategory())}
                placeholder="e.g., Wedding, Pre-wedding, Candid"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
              />
              <button
                type="button"
                onClick={addSubcategory}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {formData.subcategories.map((sub, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#C94C73] text-white rounded-full text-sm flex items-center gap-2"
                >
                  {sub}
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      subcategories: formData.subcategories.filter((_, i) => i !== idx)
                    })}
                    className="hover:text-red-200"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe this service offering..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#C94C73] focus:ring-[#C94C73]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Make this service active
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] font-medium disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add Package Modal Component
function AddPackageModal({ serviceId, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    priceType: 'fixed',
    description: '',
    duration: '',
    inclusions: [],
    exclusions: [],
    isPopular: false,
    isActive: true
  })
  const [inclusionInput, setInclusionInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      price: parseFloat(formData.price)
    })
  }

  const addInclusion = () => {
    if (inclusionInput.trim()) {
      setFormData({
        ...formData,
        inclusions: [...formData.inclusions, inclusionInput.trim()]
      })
      setInclusionInput('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Add New Package</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Package Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Premium Wedding Package"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="150000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Type
              </label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
              >
                <option value="fixed">Fixed</option>
                <option value="starting_from">Starting From</option>
                <option value="per_day">Per Day</option>
                <option value="per_hour">Per Hour</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Complete wedding coverage with premium editing..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., Full day (up to 12 hours)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Inclusions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's Included
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={inclusionInput}
                onChange={(e) => setInclusionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                placeholder="e.g., 2 photographers, 500 edited photos"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
              />
              <button
                type="button"
                onClick={addInclusion}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.inclusions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      inclusions: formData.inclusions.filter((_, i) => i !== idx)
                    })}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Media Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Upload className="text-blue-600 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Upload Photos & Videos</h4>
                <p className="text-xs text-blue-700">
                  After creating this package, you'll be able to upload cover images and gallery media (photos/videos) directly from the package card using the <span className="font-semibold">"Upload Media"</span> button.
                </p>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPopular"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 text-[#C94C73] focus:ring-[#C94C73]"
              />
              <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">
                Mark as popular package
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pkgActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[#C94C73] focus:ring-[#C94C73]"
              />
              <label htmlFor="pkgActive" className="text-sm font-medium text-gray-700">
                Make this package active
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] font-medium disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Service Modal Component
function EditServiceModal({ service, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    category: service.category || '',
    subcategories: service.subcategories || [],
    description: service.description || '',
    isActive: service.isActive !== undefined ? service.isActive : true
  })
  const [subcategoryInput, setSubcategoryInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addSubcategory = () => {
    if (subcategoryInput.trim()) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, subcategoryInput.trim()]
      })
      setSubcategoryInput('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Service</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Category *
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Photography, Videography, Makeup"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Subcategories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategories
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={subcategoryInput}
                onChange={(e) => setSubcategoryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubcategory())}
                placeholder="e.g., Wedding, Pre-wedding, Candid"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
              />
              <button
                type="button"
                onClick={addSubcategory}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {formData.subcategories.map((sub, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#C94C73] text-white rounded-full text-sm flex items-center gap-2"
                >
                  {sub}
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      subcategories: formData.subcategories.filter((_, i) => i !== idx)
                    })}
                    className="hover:text-red-200"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe this service offering..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editIsActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#C94C73] focus:ring-[#C94C73]"
            />
            <label htmlFor="editIsActive" className="text-sm font-medium text-gray-700">
              Make this service active
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] font-medium disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Package Modal Component
function EditPackageModal({ package: pkg, serviceId, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: pkg.name || '',
    price: pkg.price || '',
    priceType: pkg.priceType || 'fixed',
    description: pkg.description || '',
    duration: pkg.duration || '',
    inclusions: pkg.inclusions || [],
    exclusions: pkg.exclusions || [],
    isPopular: pkg.isPopular || false,
    isActive: pkg.isActive !== undefined ? pkg.isActive : true
  })
  const [inclusionInput, setInclusionInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      price: parseFloat(formData.price)
    })
  }

  const addInclusion = () => {
    if (inclusionInput.trim()) {
      setFormData({
        ...formData,
        inclusions: [...formData.inclusions, inclusionInput.trim()]
      })
      setInclusionInput('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Package</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Package Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Premium Wedding Package"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="150000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Type
              </label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
              >
                <option value="fixed">Fixed</option>
                <option value="starting_from">Starting From</option>
                <option value="per_day">Per Day</option>
                <option value="per_hour">Per Hour</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Complete wedding coverage with premium editing..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., Full day (up to 12 hours)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>

          {/* Inclusions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's Included
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={inclusionInput}
                onChange={(e) => setInclusionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                placeholder="e.g., 2 photographers, 500 edited photos"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
              />
              <button
                type="button"
                onClick={addInclusion}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.inclusions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      inclusions: formData.inclusions.filter((_, i) => i !== idx)
                    })}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editIsPopular"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 text-[#C94C73] focus:ring-[#C94C73]"
              />
              <label htmlFor="editIsPopular" className="text-sm font-medium text-gray-700">
                Mark as popular package
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editPkgActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-[#C94C73] focus:ring-[#C94C73]"
              />
              <label htmlFor="editPkgActive" className="text-sm font-medium text-gray-700">
                Make this package active
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] font-medium disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

