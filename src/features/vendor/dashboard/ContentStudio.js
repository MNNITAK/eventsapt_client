'use client'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyVendorProfile } from '@/api/vendorClient'
import {
  getVendorPostsOwn,
  createPost,
  updatePost,
  deletePost,
  updatePostStatus,
  getVendorReelsOwn,
  createReel,
  updateReel,
  deleteReel,
  updateReelStatus,
} from '@/api/postClient'
import { uploadMedia, uploadMultipleMedia } from '@/api/mediaClient'
import {
  Plus, Video, Image as ImageIcon, Edit2, Trash2, X,
  Upload, Film, Check, Loader2,
} from 'lucide-react'

const SUB_TABS = [
  { id: 'posts',   label: 'My Posts',    icon: ImageIcon },
  { id: 'reels',   label: 'My Reels',    icon: Film },
  { id: 'newPost', label: 'Create Post', icon: Plus },
  { id: 'newReel', label: 'Create Reel', icon: Video },
]

const STATUS_BADGE = {
  published: 'bg-green-100 text-green-700',
  draft:     'bg-gray-100 text-gray-600',
  archived:  'bg-yellow-100 text-yellow-700',
}

export function ContentStudio() {
  const [token, setToken] = useState(null)
  const [subTab, setSubTab] = useState('posts')
  const [editPost, setEditPost] = useState(null)
  const [editReel, setEditReel] = useState(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(d => d && setToken(d.token)).catch(() => {})
  }, [])

  const { data: profileData } = useQuery({
    queryKey: ['vendorProfile'],
    queryFn: () => getMyVendorProfile(token),
    enabled: !!token,
  })

  const vendorId = profileData?.data?._id

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['vendorPostsOwn', vendorId],
    queryFn: () => getVendorPostsOwn(token, vendorId),
    enabled: !!token && !!vendorId && subTab === 'posts',
  })

  const { data: reelsData, isLoading: reelsLoading } = useQuery({
    queryKey: ['vendorReelsOwn', vendorId],
    queryFn: () => getVendorReelsOwn(token, vendorId),
    enabled: !!token && !!vendorId && subTab === 'reels',
  })

  const inv = (keys) => keys.forEach(k => queryClient.invalidateQueries([k]))

  const deletePostMut = useMutation({ mutationFn: (id) => deletePost(token, id),                          onSuccess: () => inv(['vendorPostsOwn']) })
  const statusPostMut = useMutation({ mutationFn: ({ id, status }) => updatePostStatus(token, id, status), onSuccess: () => inv(['vendorPostsOwn']) })
  const deleteReelMut = useMutation({ mutationFn: (id) => deleteReel(token, id),                          onSuccess: () => inv(['vendorReelsOwn']) })
  const statusReelMut = useMutation({ mutationFn: ({ id, status }) => updateReelStatus(token, id, status), onSuccess: () => inv(['vendorReelsOwn']) })

  const posts = postsData?.data?.posts || postsData?.data || []
  const reels = reelsData?.data?.reels || reelsData?.data || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content <span className="text-[#C94C73]">Studio</span></h1>
        <p className="text-gray-500 mt-1">Create and manage your posts and reels</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {SUB_TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setSubTab(id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap text-sm transition-all
              ${subTab === id ? 'text-[#C94C73] border-b-2 border-[#C94C73]' : 'text-gray-500 hover:text-gray-800'}`}>
            <Icon size={16} />{label}
          </button>
        ))}
      </div>

      {/* My Posts */}
      {subTab === 'posts' && (
        <div>
          {postsLoading ? (
            <div className="flex items-center justify-center h-40 text-gray-400"><Loader2 className="animate-spin" /></div>
          ) : posts.length === 0 ? (
            <EmptyState icon={<ImageIcon size={40} />} text="No posts yet" cta="Create Post" onCta={() => setSubTab('newPost')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {posts.map(post => (
                <ContentCard
                  key={post._id}
                  item={post}
                  type="post"
                  onEdit={() => { setEditPost(post); setSubTab('newPost') }}
                  onDelete={() => { if (window.confirm('Delete this post?')) deletePostMut.mutate(post._id) }}
                  onStatusChange={(status) => statusPostMut.mutate({ id: post._id, status })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Reels */}
      {subTab === 'reels' && (
        <div>
          {reelsLoading ? (
            <div className="flex items-center justify-center h-40 text-gray-400"><Loader2 className="animate-spin" /></div>
          ) : reels.length === 0 ? (
            <EmptyState icon={<Film size={40} />} text="No reels yet" cta="Create Reel" onCta={() => setSubTab('newReel')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {reels.map(reel => (
                <ContentCard
                  key={reel._id}
                  item={reel}
                  type="reel"
                  onEdit={() => { setEditReel(reel); setSubTab('newReel') }}
                  onDelete={() => { if (window.confirm('Delete this reel?')) deleteReelMut.mutate(reel._id) }}
                  onStatusChange={(status) => statusReelMut.mutate({ id: reel._id, status })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Post */}
      {subTab === 'newPost' && (
        <PostForm
          token={token}
          initial={editPost}
          onSuccess={() => { inv(['vendorPostsOwn']); setEditPost(null); setSubTab('posts') }}
          onCancel={() => { setEditPost(null); setSubTab('posts') }}
        />
      )}

      {/* Create / Edit Reel */}
      {subTab === 'newReel' && (
        <ReelForm
          token={token}
          initial={editReel}
          onSuccess={() => { inv(['vendorReelsOwn']); setEditReel(null); setSubTab('reels') }}
          onCancel={() => { setEditReel(null); setSubTab('reels') }}
        />
      )}
    </div>
  )
}

// ─── Content Card ─────────────────────────────────────────────────────────────

function ContentCard({ item, type, onEdit, onDelete, onStatusChange }) {
  const thumb = type === 'post'
    ? (item.media?.[0]?.url || item.images?.[0])
    : (item.thumbnailUrl || item.thumbnail)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="relative h-40 bg-gray-100">
        {thumb ? (
          <img src={thumb} alt={item.caption || 'content'} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            {type === 'post' ? <ImageIcon size={32} /> : <Film size={32} />}
          </div>
        )}
        <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[item.status] || 'bg-gray-100 text-gray-600'}`}>
          {item.status || 'draft'}
        </span>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
          {item.caption || item.description || <span className="text-gray-400 italic">No caption</span>}
        </p>

        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map(t => (
              <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">#{t}</span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs hover:bg-gray-50 text-gray-700">
            <Edit2 size={12} />Edit
          </button>
          <select value={item.status || 'draft'} onChange={(e) => onStatusChange(e.target.value)}
            className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#C94C73] bg-white text-gray-700">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button onClick={onDelete}
            className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Post Form ────────────────────────────────────────────────────────────────

function PostForm({ token, initial, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    caption:  initial?.caption  || '',
    location: initial?.location || '',
    tags:     initial?.tags?.join(', ') || '',
    status:   initial?.status   || 'published',
  })
  const [files, setFiles]         = useState([])
  const [previews, setPreviews]   = useState(initial?.media?.map(m => m.url) || [])
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files)
    setFiles(selected)
    setPreviews(selected.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async () => {
    setError('')
    if (!initial && files.length === 0) return setError('Please select at least one image.')
    setUploading(true)
    try {
      let mediaUrls = initial?.media || []
      if (files.length > 0) {
        const uploaded = await uploadMultipleMedia(token, files, { context: 'post', folder: 'posts' })
        const items = uploaded?.data?.uploaded || []
        mediaUrls = items.map(u => ({ url: u.url, type: u.mediaType || 'image' }))
      }
      const payload = {
        caption:  form.caption,
        location: form.location,
        tags:     form.tags.split(',').map(t => t.trim()).filter(Boolean),
        status:   form.status,
        media:    mediaUrls,
      }
      if (initial) { await updatePost(token, initial._id, payload) }
      else         { await createPost(token, payload) }
      onSuccess()
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{initial ? 'Edit Post' : 'Create Post'}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Images *</label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#C94C73] transition-colors">
          <Upload size={24} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Click to select images</span>
          <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
        </label>
        {previews.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
        <textarea rows={3} value={form.caption} maxLength={2200}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          placeholder="Write a caption..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#C94C73] text-gray-900" />
        <p className="text-xs text-gray-400 mt-0.5">{form.caption.length}/2200</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="wedding, bridal, makeup"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#C94C73] text-gray-900" />
          <p className="text-xs text-gray-400">Comma separated</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Lucknow, UP"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#C94C73] text-gray-900" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#C94C73] bg-white text-gray-900">
          <option value="published">Publish Now</option>
          <option value="draft">Save as Draft</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button onClick={onCancel} className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700">Cancel</button>
        <button onClick={handleSubmit} disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] text-sm font-medium disabled:opacity-60">
          {uploading ? <><Loader2 size={15} className="animate-spin" />Uploading...</> : <><Check size={15} />{initial ? 'Update Post' : 'Publish Post'}</>}
        </button>
      </div>
    </div>
  )
}

// ─── Reel Form ────────────────────────────────────────────────────────────────

function ReelForm({ token, initial, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    caption: initial?.caption || '',
    tags:    initial?.tags?.join(', ') || '',
    status:  initial?.status  || 'published',
  })
  const [videoFile, setVideoFile]       = useState(null)
  const [thumbFile, setThumbFile]       = useState(null)
  const [videoPreview, setVideoPreview] = useState(initial?.videoUrl || null)
  const [thumbPreview, setThumbPreview] = useState(initial?.thumbnailUrl || null)
  const [uploading, setUploading]       = useState(false)
  const [error, setError]               = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!initial && !videoFile) return setError('Please select a video file.')
    setUploading(true)
    try {
      let videoUrl     = initial?.videoUrl     || ''
      let thumbnailUrl = initial?.thumbnailUrl || ''
      if (videoFile) {
        const res = await uploadMedia(token, videoFile, { context: 'reel', folder: 'reels' })
        videoUrl = res?.data?.url
      }
      if (thumbFile) {
        const res = await uploadMedia(token, thumbFile, { context: 'reel_thumbnail', folder: 'reels' })
        thumbnailUrl = res?.data?.url
      }
      const payload = {
        caption:     form.caption,
        tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
        status:      form.status,
        videoUrl,
        thumbnailUrl,
      }
      if (initial) { await updateReel(token, initial._id, payload) }
      else         { await createReel(token, payload) }
      onSuccess()
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{initial ? 'Edit Reel' : 'Create Reel'}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Video *</label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#C94C73] transition-colors">
          <Film size={24} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">{videoFile ? videoFile.name : 'Click to select video (.mp4, .mov)'}</span>
          <input type="file" accept="video/*" onChange={(e) => { setVideoFile(e.target.files[0]); setVideoPreview(URL.createObjectURL(e.target.files[0])) }} className="hidden" />
        </label>
        {videoPreview && !videoFile && (
          <p className="text-xs text-gray-400 mt-1">Current video already uploaded.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail (optional)</label>
        <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50">
          <Upload size={16} className="text-gray-400" />
          <span className="text-sm text-gray-500">{thumbFile ? thumbFile.name : 'Select thumbnail image'}</span>
          <input type="file" accept="image/*" onChange={(e) => { setThumbFile(e.target.files[0]); setThumbPreview(URL.createObjectURL(e.target.files[0])) }} className="hidden" />
        </label>
        {thumbPreview && <img src={thumbPreview} alt="thumb" className="mt-2 w-24 h-16 object-cover rounded-lg border border-gray-200" />}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
        <textarea rows={3} value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          placeholder="Write a caption for this reel..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#C94C73] text-gray-900" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="wedding, sangeet, dance"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#C94C73] text-gray-900" />
        <p className="text-xs text-gray-400">Comma separated</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#C94C73] bg-white text-gray-900">
          <option value="published">Publish Now</option>
          <option value="draft">Save as Draft</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button onClick={onCancel} className="px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-700">Cancel</button>
        <button onClick={handleSubmit} disabled={uploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] text-sm font-medium disabled:opacity-60">
          {uploading ? <><Loader2 size={15} className="animate-spin" />Uploading...</> : <><Check size={15} />{initial ? 'Update Reel' : 'Publish Reel'}</>}
        </button>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ icon, text, cta, onCta }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="text-gray-300 mx-auto mb-4">{icon}</div>
      <p className="text-gray-500 mb-4">{text}</p>
      <button onClick={onCta}
        className="px-5 py-2.5 bg-[#C94C73] text-white rounded-lg hover:bg-[#b43d62] text-sm font-medium">
        {cta}
      </button>
    </div>
  )
}
