'use client'
import { useState, useEffect, useRef } from "react"
import { FaTimes } from "react-icons/fa"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import { LuLoaderCircle } from "react-icons/lu"
import { IoSend } from "react-icons/io5"
import { axiosInstance } from "@/axios/axios"
import { getCookies } from "@/app/action"

const CommentsDrawer = ({ open, onClose, itemId, contentType = "post", initialCount = 0 }) => {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState("")
    const [sending, setSending] = useState(false)
    const [error, setError] = useState("")
    const inputRef = useRef(null)

    const endpoint = contentType === "reel" ? "reels" : "posts"

    // Fetch comments when drawer opens
    useEffect(() => {
        if (!open || !itemId) return
        setLoading(true)
        axiosInstance.get(`/v1/${endpoint}/${itemId}`)
            .then((res) => {
                const doc = res.data?.data
                setComments(doc?.interactions?.comments || [])
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [open, itemId, endpoint])

    // Focus input on open
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 300)
    }, [open])

    const handleSend = async () => {
        if (!text.trim() || sending) return
        setSending(true)
        setError("")
        try {
            const token = await getCookies()
            const res = await axiosInstance.post(
                `/v1/${endpoint}/${itemId}/comments`,
                { content: text.trim() },
                { headers: { wedoraCredentials: token } }
            )
            // Trust the server as the source of truth so the comment actually
            // persists across refresh. If the API echoes the saved comment, use
            // it; otherwise re-fetch the persisted list (no fabricated comments).
            const newComment = res.data?.data?.comment
            if (newComment) {
                setComments((prev) => [newComment, ...prev])
            } else {
                const refetch = await axiosInstance.get(`/v1/${endpoint}/${itemId}`)
                setComments(refetch.data?.data?.interactions?.comments || [])
            }
            setText("")
        } catch {
            // Surface the failure instead of pretending it saved.
            setError("Couldn't post your comment. Please try again.")
        } finally {
            setSending(false)
        }
    }

    const handleDelete = async (commentId) => {
        try {
            const token = await getCookies()
            await axiosInstance.delete(`/v1/${endpoint}/${itemId}/comments/${commentId}`, {
                headers: { wedoraCredentials: token },
            })
            setComments((prev) => prev.filter((c) => c._id !== commentId))
        } catch {}
    }

    const formatTime = (iso) => {
        if (!iso) return ""
        const d = new Date(iso)
        const now = new Date()
        const diff = Math.floor((now - d) / 1000)
        if (diff < 60) return `${diff}s`
        if (diff < 3600) return `${Math.floor(diff / 60)}m`
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`
        return `${Math.floor(diff / 86400)}d`
    }

    if (!open) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col"
                style={{ maxHeight: "75vh" }}>

                {/* Handle + header */}
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
                    <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
                    <p className="font-semibold text-gray-800 text-sm">
                        Comments {comments.length > 0 && <span className="text-gray-400 font-normal">({comments.length})</span>}
                    </p>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
                        <FaTimes />
                    </button>
                </div>

                {/* Comments list */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <LuLoaderCircle className="animate-spin text-[#C94C73] text-2xl" />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-400 text-sm">No comments yet</p>
                            <p className="text-gray-300 text-xs mt-1">Be the first to comment!</p>
                        </div>
                    ) : (
                        comments.map((c) => (
                            <div key={c._id} className="flex gap-3">
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C94C73] to-[#f5a3bb] flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs font-bold">
                                        {c.author?.name?.[0]?.toUpperCase() || c.author?.businessName?.[0]?.toUpperCase() || "U"}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <div className="bg-gray-50 rounded-2xl rounded-tl-none px-3 py-2">
                                        <span className="text-xs font-semibold text-gray-800 mr-2">
                                            {c.author?.name || c.author?.businessName || "User"}
                                        </span>
                                        <span className="text-sm text-gray-700">{c.content}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 px-1">
                                        <span className="text-[11px] text-gray-400">{formatTime(c.createdAt)}</span>
                                        <button
                                            onClick={() => handleDelete(c._id)}
                                            className="text-[11px] text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            Delete
                                        </button>
                                        {c.isPinned && (
                                            <span className="text-[10px] text-[#C94C73] font-medium">Pinned</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input */}
                {error && (
                    <p className="px-5 pt-2 text-[12px] text-red-500">{error}</p>
                )}
                <div className="px-4 pb-5 pt-3 border-t border-gray-100 flex items-center gap-3 bg-white">
                    <input
                        ref={inputRef}
                        value={text}
                        onChange={(e) => { setText(e.target.value); if (error) setError("") }}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        placeholder="Add a comment..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#C94C73]/30 transition-all"
                        maxLength={2000}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!text.trim() || sending}
                        className="w-9 h-9 rounded-full bg-[#C94C73] flex items-center justify-center disabled:opacity-40 transition-opacity"
                    >
                        {sending
                            ? <LuLoaderCircle className="animate-spin text-white text-sm" />
                            : <IoSend className="text-white text-sm" />
                        }
                    </button>
                </div>
            </div>
        </>
    )
}

export { CommentsDrawer }
