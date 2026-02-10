'use client'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getVendorPortfolio, 
  createPortfolioAlbum,
  addPortfolioMedia,
  addBulkPortfolioMedia,
  updatePortfolioAlbum,
  deletePortfolioAlbum,
  deletePortfolioMedia,
  setAlbumCover,
  getPortfolioStats
} from '@/api/vendorClient'
import { uploadMedia } from '@/api/mediaClient'
import { 
  Plus, Image, Video, Upload, Folder, Loader2, 
  Trash2, Edit3, X, ChevronDown, ChevronUp, 
  Play, Eye, EyeOff, Star, MoreVertical, 
  BarChart3, ImageIcon, Camera
} from 'lucide-react'

export function PortfolioManagement() {
  const [token, setToken] = useState(null)
  const [showCreateAlbum, setShowCreateAlbum] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState(null)
  const [uploadingAlbumId, setUploadingAlbumId] = useState(null)
  const [expandedAlbumId, setExpandedAlbumId] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [deletingMediaId, setDeletingMediaId] = useState(null)
  const [albumMenuOpen, setAlbumMenuOpen] = useState(null)
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

  // Close album menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setAlbumMenuOpen(null)
    if (albumMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [albumMenuOpen])

  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ['vendorPortfolio'],
    queryFn: () => getVendorPortfolio(token),
    enabled: !!token
  })

  const { data: statsData } = useQuery({
    queryKey: ['portfolioStats'],
    queryFn: () => getPortfolioStats(token),
    enabled: !!token
  })

  const createAlbumMutation = useMutation({
    mutationFn: (albumData) => createPortfolioAlbum(token, albumData),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorPortfolio'])
      queryClient.invalidateQueries(['portfolioStats'])
      setShowCreateAlbum(false)
    }
  })

  const updateAlbumMutation = useMutation({
    mutationFn: ({ albumId, updates }) => updatePortfolioAlbum(token, albumId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorPortfolio'])
      setEditingAlbum(null)
    }
  })

  const deleteAlbumMutation = useMutation({
    mutationFn: (albumId) => deletePortfolioAlbum(token, albumId),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorPortfolio'])
      queryClient.invalidateQueries(['portfolioStats'])
    }
  })

  const deleteMediaMutation = useMutation({
    mutationFn: ({ albumId, mediaId }) => deletePortfolioMedia(token, albumId, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorPortfolio'])
      queryClient.invalidateQueries(['portfolioStats'])
      setDeletingMediaId(null)
    }
  })

  const setCoverMutation = useMutation({
    mutationFn: ({ albumId, mediaId }) => setAlbumCover(token, albumId, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries(['vendorPortfolio'])
    }
  })

  /**
   * Upload media files to portfolio album
   * Flow: File(s) → Media Service (S3) → get URLs → addPortfolioMedia
   */
  const handleMediaUpload = async (files, albumId) => {
    if (!files || files.length === 0 || !token) return
    
    setUploadingAlbumId(albumId)
    try {
      const uploadPromises = Array.from(files).map(file => 
        uploadMedia(token, file, {
          context: 'portfolio',
          folder: 'portfolio',
          tags: ['portfolio', albumId]
        })
      )

      const results = await Promise.all(uploadPromises)
      
      const mediaItems = results.map(result => ({
        url: result.data.url,
        thumbnailUrl: result.data.thumbnailUrl,
        type: result.data.mediaType || 'image',
        caption: '',
        tags: []
      }))

      if (mediaItems.length > 1) {
        await addBulkPortfolioMedia(token, albumId, mediaItems)
      } else {
        await addPortfolioMedia(token, albumId, mediaItems[0])
      }

      queryClient.invalidateQueries(['vendorPortfolio'])
      queryClient.invalidateQueries(['portfolioStats'])
      alert(`Successfully uploaded ${mediaItems.length} file(s)!`)
    } catch (error) {
      console.error('Upload failed:', error)
      alert(error?.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploadingAlbumId(null)
    }
  }

  const handleDeleteAlbum = (albumId, albumTitle) => {
    if (window.confirm(`Are you sure you want to delete "${albumTitle}"? This will remove all media in this album.`)) {
      deleteAlbumMutation.mutate(albumId)
    }
  }

  const handleDeleteMedia = (albumId, mediaId) => {
    if (window.confirm('Delete this media item?')) {
      setDeletingMediaId(mediaId)
      deleteMediaMutation.mutate({ albumId, mediaId })
    }
  }

  const handleSetCover = (albumId, mediaUrl) => {
    setCoverMutation.mutate({ albumId, mediaId: mediaUrl })
  }

  const albums = portfolioData?.data?.albums || []
  const stats = statsData?.data || null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-500 mt-1">Showcase your best work</p>
        </div>
        <button
          onClick={() => setShowCreateAlbum(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] transition-all font-medium"
        >
          <Plus size={20} />
          Create Album
        </button>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-50 rounded-lg">
                <Folder size={20} className="text-[#C94C73]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAlbums || 0}</p>
                <p className="text-xs text-gray-500">Albums</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ImageIcon size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalImages || 0}</p>
                <p className="text-xs text-gray-500">Images</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Video size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVideos || 0}</p>
                <p className="text-xs text-gray-500">Videos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Eye size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews || 0}</p>
                <p className="text-xs text-gray-500">Views</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Albums Grid */}
      {albums.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Folder className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No albums yet</h3>
          <p className="text-gray-500 mb-6">Create your first portfolio album to showcase your work, then upload photos and videos to it</p>
          <button
            onClick={() => setShowCreateAlbum(true)}
            className="px-6 py-3 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] transition-all font-medium"
          >
            Create Your First Album
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {albums.map((album) => {
            const mediaItems = album.media || []
            const isExpanded = expandedAlbumId === album._id

            return (
              <div
                key={album._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Album Header Row */}
                <div className="flex items-start gap-4 p-4">
                  {/* Cover Thumbnail */}
                  <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {album.coverImage ? (
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                    ) : mediaItems.length > 0 ? (
                      <img
                        src={mediaItems[0].thumbnailUrl || mediaItems[0].url}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="text-gray-400" size={28} />
                      </div>
                    )}
                  </div>

                  {/* Album Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{album.title}</h3>
                        {album.description && (
                          <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">{album.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          {album.category && (
                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                              {album.category}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Image size={12} /> {mediaItems.length} items
                          </span>
                          {album.visibility && album.visibility !== 'public' && (
                            <span className="text-xs text-amber-600 flex items-center gap-1">
                              <EyeOff size={12} /> {album.visibility}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Upload Button */}
                        <label className={`
                          px-3 py-2 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] text-sm cursor-pointer
                          flex items-center gap-1.5 font-medium transition-colors
                          ${uploadingAlbumId === album._id ? 'opacity-50 cursor-not-allowed' : ''}
                        `}>
                          {uploadingAlbumId === album._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          Upload
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => {
                              const files = e.target.files
                              if (files && files.length > 0) {
                                handleMediaUpload(files, album._id)
                              }
                              e.target.value = ''
                            }}
                            disabled={uploadingAlbumId !== null}
                          />
                        </label>

                        {/* Expand/Collapse Gallery */}
                        <button
                          onClick={() => setExpandedAlbumId(isExpanded ? null : album._id)}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                          title={isExpanded ? 'Collapse gallery' : 'Expand gallery'}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setAlbumMenuOpen(albumMenuOpen === album._id ? null : album._id)
                            }}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {albumMenuOpen === album._id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <button
                                onClick={() => {
                                  setEditingAlbum(album)
                                  setAlbumMenuOpen(null)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit3 size={14} /> Edit Album
                              </button>
                              <button
                                onClick={() => {
                                  setExpandedAlbumId(isExpanded ? null : album._id)
                                  setAlbumMenuOpen(null)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye size={14} /> {isExpanded ? 'Hide' : 'View'} Gallery
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={() => {
                                  handleDeleteAlbum(album._id, album.title)
                                  setAlbumMenuOpen(null)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 size={14} /> Delete Album
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Preview Row (when collapsed) */}
                {!isExpanded && mediaItems.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="flex gap-2 overflow-hidden">
                      {mediaItems.slice(0, 6).map((media, idx) => (
                        <div
                          key={media._id || idx}
                          className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative"
                          onClick={() => setLightboxImage(media)}
                        >
                          <img
                            src={media.thumbnailUrl || media.url}
                            alt={media.title || `Media ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {media.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <Play size={12} className="text-white" fill="white" />
                            </div>
                          )}
                        </div>
                      ))}
                      {mediaItems.length > 6 && (
                        <button
                          onClick={() => setExpandedAlbumId(album._id)}
                          className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          +{mediaItems.length - 6}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* No media alert */}
                {mediaItems.length === 0 && (
                  <div className="mx-4 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-700 flex items-center gap-2">
                      <Upload size={14} />
                      No media yet — click <strong>Upload</strong> to add photos and videos to this album
                    </p>
                  </div>
                )}

                {/* Expanded Gallery Grid */}
                {isExpanded && mediaItems.length > 0 && (
                  <div className="border-t border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Gallery ({mediaItems.length} items)
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {mediaItems.map((media, idx) => (
                        <div
                          key={media._id || idx}
                          className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
                        >
                          <img
                            src={media.thumbnailUrl || media.url}
                            alt={media.title || `Media ${idx + 1}`}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setLightboxImage(media)}
                          />
                          {media.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 pointer-events-none">
                              <Play size={24} className="text-white" fill="white" />
                            </div>
                          )}

                          {/* Hover Overlay with Actions */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-end justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-1.5 mb-2">
                              <button
                                onClick={() => setLightboxImage(media)}
                                className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                                title="View full size"
                              >
                                <Eye size={12} className="text-gray-700" />
                              </button>
                              <button
                                onClick={() => handleSetCover(album._id, media.url)}
                                className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                                title="Set as album cover"
                              >
                                <Star size={12} className="text-gray-700" />
                              </button>
                              <button
                                onClick={() => handleDeleteMedia(album._id, media._id)}
                                disabled={deletingMediaId === media._id}
                                className="p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                                title="Delete media"
                              >
                                {deletingMediaId === media._id ? (
                                  <Loader2 size={12} className="text-red-500 animate-spin" />
                                ) : (
                                  <Trash2 size={12} className="text-red-500" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Featured/cover indicator */}
                          {album.coverImage === media.url && (
                            <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              COVER
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded but empty */}
                {isExpanded && mediaItems.length === 0 && (
                  <div className="border-t border-gray-100 p-8 text-center">
                    <Camera className="mx-auto text-gray-300 mb-3" size={40} />
                    <p className="text-sm text-gray-500">No media in this album yet</p>
                    <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] text-sm cursor-pointer font-medium transition-colors">
                      <Upload size={14} />
                      Upload Media
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files
                          if (files && files.length > 0) {
                            handleMediaUpload(files, album._id)
                          }
                          e.target.value = ''
                        }}
                        disabled={uploadingAlbumId !== null}
                      />
                    </label>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={() => setLightboxImage(null)}
          >
            <X size={32} />
          </button>
          <div className="max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            {lightboxImage.type === 'video' ? (
              <video
                src={lightboxImage.url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] mx-auto rounded-lg"
              />
            ) : (
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title || 'Portfolio media'}
                className="max-w-full max-h-[85vh] mx-auto object-contain rounded-lg"
              />
            )}
            {lightboxImage.title && (
              <p className="text-white text-center mt-3 text-sm">{lightboxImage.title}</p>
            )}
          </div>
        </div>
      )}

      {/* Create Album Modal */}
      {showCreateAlbum && (
        <AlbumFormModal
          title="Create Album"
          onClose={() => setShowCreateAlbum(false)}
          onSubmit={(data) => createAlbumMutation.mutate(data)}
          isLoading={createAlbumMutation.isPending}
        />
      )}

      {/* Edit Album Modal */}
      {editingAlbum && (
        <AlbumFormModal
          title="Edit Album"
          initialData={{
            title: editingAlbum.title,
            description: editingAlbum.description || '',
            category: editingAlbum.category || 'wedding',
            isPublic: editingAlbum.visibility !== 'private'
          }}
          onClose={() => setEditingAlbum(null)}
          onSubmit={(data) => updateAlbumMutation.mutate({ albumId: editingAlbum._id, updates: data })}
          isLoading={updateAlbumMutation.isPending}
        />
      )}
    </div>
  )
}

function AlbumFormModal({ title, initialData, onClose, onSubmit, isLoading }) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    category: 'wedding',
    isPublic: true
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Album Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C94C73]"
            >
              <option value="wedding">Wedding</option>
              <option value="engagement">Engagement</option>
              <option value="reception">Reception</option>
              <option value="pre-wedding">Pre-wedding</option>
              <option value="mehendi">Mehendi</option>
              <option value="sangeet">Sangeet</option>
              <option value="haldi">Haldi</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              💡 After creating the album, use the <strong>Upload</strong> button to add photos and videos to it.
            </p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] disabled:opacity-50 transition-colors">
              {isLoading ? 'Saving...' : (title === 'Edit Album' ? 'Save Changes' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
