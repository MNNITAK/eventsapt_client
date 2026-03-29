'use client'
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyMedia, getStorageStats, deleteMedia, deleteMediaBulk } from '@/api/mediaClient'
import { Image as ImageIcon, Video, Trash2, Copy, Check, Loader2, HardDrive } from 'lucide-react'

export function MediaLibrary() {
  const [token, setToken]           = useState(null)
  const [typeFilter, setTypeFilter] = useState('all')
  const [selected, setSelected]     = useState(new Set())
  const [copiedId, setCopiedId]     = useState(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    fetch('/api/me').then(r => r.ok ? r.json() : null).then(d => d && setToken(d.token)).catch(() => {})
  }, [])

  const { data: mediaData, isLoading } = useQuery({
    queryKey: ['myMedia'],
    queryFn: () => getMyMedia(token),
    enabled: !!token,
  })

  const { data: statsData } = useQuery({
    queryKey: ['storageStats'],
    queryFn: () => getStorageStats(token),
    enabled: !!token,
  })

  const inv = () => { queryClient.invalidateQueries(['myMedia']); queryClient.invalidateQueries(['storageStats']) }

  const deleteSingleMut = useMutation({
    mutationFn: (id) => deleteMedia(token, id),
    onSuccess: () => { inv(); setSelected(prev => { const n = new Set(prev); n.delete(deleteSingleMut.variables); return n }) },
  })

  const deleteBulkMut = useMutation({
    mutationFn: (ids) => deleteMediaBulk(token, ids),
    onSuccess: () => { inv(); setSelected(new Set()) },
  })

  const rawData  = mediaData?.data
  const allMedia = Array.isArray(rawData?.files) ? rawData.files
    : Array.isArray(rawData?.media) ? rawData.media
    : Array.isArray(rawData)        ? rawData
    : []
  const stats    = statsData?.data || {}

  const safeMedia = Array.isArray(allMedia) ? allMedia : []
  const filtered  = typeFilter === 'all' ? safeMedia
    : safeMedia.filter(m => typeFilter === 'video' ? m.mediaType === 'video' : m.mediaType !== 'video')

  const toggleSelect = (id) => setSelected(prev => {
    const n = new Set(prev)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })

  const selectAll = () => setSelected(new Set(filtered.map(m => m._id || m.mediaId || m.id)))
  const clearAll  = () => setSelected(new Set())

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const fmt = (bytes) => {
    if (!bytes) return '0 B'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const usedPct = stats.usedBytes && stats.totalBytes
    ? Math.min(Math.round((stats.usedBytes / stats.totalBytes) * 100), 100)
    : 0

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      <Loader2 className="animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Media <span className="text-[#C94C73]">Library</span></h1>
        <p className="text-gray-500 mt-1">Manage all your uploaded files</p>
      </div>

      {/* Storage Stats */}
      {stats.totalBytes && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <HardDrive size={20} className="text-[#C94C73]" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Storage Used</span>
                <span className="text-gray-500">{fmt(stats.usedBytes)} / {fmt(stats.totalBytes)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${usedPct > 80 ? 'bg-red-500' : 'bg-[#C94C73]'}`}
                  style={{ width: `${usedPct}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-gray-700">{usedPct}%</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <span>{stats.imageCount || 0} images</span>
            <span>{stats.videoCount || 0} videos</span>
            <span>{allMedia.length} total files</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {['all', 'image', 'video'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium capitalize transition-all
                ${typeFilter === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>
              {t}
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <>
            <button onClick={selected.size === filtered.length ? clearAll : selectAll}
              className="text-sm text-[#C94C73] hover:underline">
              {selected.size === filtered.length ? 'Deselect all' : 'Select all'}
            </button>
            {selected.size > 0 && (
              <span className="text-sm text-gray-500">{selected.size} selected</span>
            )}
          </>
        )}

        {selected.size > 0 && (
          <button
            onClick={() => { if (window.confirm(`Delete ${selected.size} file(s)? This cannot be undone.`)) deleteBulkMut.mutate([...selected]) }}
            disabled={deleteBulkMut.isPending}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-60 ml-auto">
            {deleteBulkMut.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete {selected.size} file{selected.size > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <ImageIcon size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No files found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((media) => {
            const id       = media._id || media.mediaId
            const url      = media.url
            const isVideo  = media.mediaType === 'video'
            const isChosen = selected.has(id)

            return (
              <div
                key={id}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer
                  ${isChosen ? 'border-[#C94C73] shadow-md' : 'border-transparent hover:border-gray-200'}`}
                onClick={() => toggleSelect(id)}
              >
                <div className="aspect-square bg-gray-100">
                  {isVideo ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                      <Video size={28} className="text-gray-400" />
                    </div>
                  ) : (
                    <img src={media.thumbnailUrl || url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Selection checkbox */}
                <div className={`absolute top-1.5 left-1.5 w-5 h-5 rounded border-2 flex items-center justify-center
                  ${isChosen ? 'bg-[#C94C73] border-[#C94C73]' : 'bg-white border-gray-300 opacity-0 group-hover:opacity-100'} transition-all`}>
                  {isChosen && <Check size={11} className="text-white" />}
                </div>

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end justify-center opacity-0 group-hover:opacity-100 pb-2">
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => copyUrl(url, id)}
                      className="p-1.5 bg-white rounded-full shadow text-gray-600 hover:bg-gray-50"
                      title="Copy URL">
                      {copiedId === id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                    <button
                      onClick={() => { if (window.confirm('Delete this file?')) deleteSingleMut.mutate(id) }}
                      className="p-1.5 bg-white rounded-full shadow text-red-500 hover:bg-red-50"
                      title="Delete">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Type badge */}
                <div className="absolute top-1.5 right-1.5">
                  {isVideo
                    ? <span className="bg-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">VID</span>
                    : <span className="bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">IMG</span>
                  }
                </div>

                {/* File size */}
                {media.size && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] text-center py-0.5">
                    {fmt(media.size)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
