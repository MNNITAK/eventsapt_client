'use client'
import { useState, useRef } from "react"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import { FaRegBookmark, FaBookmark } from "react-icons/fa6"
import { FaRegComment } from "react-icons/fa"
import { TbShare3 } from "react-icons/tb"
import { MdLocationOn } from "react-icons/md"
import { BsThreeDots } from "react-icons/bs"
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5"
import { axiosInstance } from "@/axios/axios.js"
import { getCookies } from "@/app/action.js"
import { useRouter, useSearchParams } from "next/navigation"
import { CommentsDrawer } from "./CommentsDrawer"
import { useTrackPost } from "@/features/insights/hooks/useTrackEvents.js"

const PostCard = ({ item }) => {
    const { insightContainerRef, trackLike, trackSave } = useTrackPost({ postId: item._id, isFollower: false })
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [likeCount, setLikeCount] = useState(item?.interactions?.likeCount || 0)
    const [commentCount, setCommentCount] = useState(item?.interactions?.commentCount || 0)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [showComments, setShowComments] = useState(false)

    const router = useRouter()
    const searchParams = useSearchParams()

    const touchStartX = useRef(null)

    const media = item?.media || []
    const hasMultiple = media.length > 1
    const current = media[currentSlide] || media[0]

    const prev = () => setCurrentSlide((s) => (s - 1 + media.length) % media.length)
    const next = () => setCurrentSlide((s) => (s + 1) % media.length)

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return
        const diff = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
        touchStartX.current = null
    }

    const handleLike = async () => {
        try {
            const token = await getCookies()
            setLiked((p) => !p)
            setLikeCount((p) => liked ? p - 1 : p + 1)
            await axiosInstance.post(`/v1/posts/${item._id}/like`, {}, { headers: { wedoraCredentials: token } })
        } catch {
            setLiked((p) => !p)
            setLikeCount((p) => liked ? p + 1 : p - 1)
        }
    }

    const handleSave = async () => {
        try {
            const token = await getCookies()
            setSaved((p) => !p)
            await axiosInstance.post(`/v1/posts/${item._id}/save`, {}, { headers: { wedoraCredentials: token } })
        } catch {
            setSaved((p) => !p)
        }
    }

    const handleDoubleTap = () => { if (!liked) handleLike() }

    const goToVendorProfile = () => {
        const vid = item?.vendorId || item?.vendor?._id || item?.vendor
        const name = item?.authorBusinessName
        if (!vid && !name) return
        const params = new URLSearchParams(searchParams.toString())
        params.set("tab", "profile")
        if (vid) params.set("vendorId", String(vid))
        if (name) params.set("vendorName", name)
        router.push(`?${params.toString()}`)
    }

    return (
        <>
            <CommentsDrawer
                open={showComments}
                onClose={() => setShowComments(false)}
                itemId={item?._id}
                contentType="post"
                initialCount={commentCount}
            />
            <div className="w-full rounded-[32px] bg-[#1a1919] shadow-[0px_0px_40px_0px_rgba(0,0,0,0.3)] mb-5 overflow-hidden border border-[#2a2828] hover:border-[#3a3838] transition-all duration-300">

                {/* ── Header ─────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* Avatar with gradient ring */}
                        <button onClick={goToVendorProfile} className="p-[2px] rounded-full bg-gradient-to-tr from-[#ff89ac] to-[#a68cff] flex-shrink-0">
                            <div className="w-9 h-9 rounded-full bg-[#111] flex items-center justify-center">
                                <span className="text-[#ff89ac] font-bold text-sm">
                                    {item?.authorBusinessName?.[0]?.toUpperCase() || "W"}
                                </span>
                            </div>
                        </button>
                        <div>
                            <button onClick={goToVendorProfile} className="font-semibold text-sm leading-tight text-white hover:text-[#ff89ac] transition-colors text-left">
                                {item?.authorBusinessName || "Wedding Vendor"}
                            </button>
                            {item?.location?.city && (
                                <p className="text-[11px] text-[#adaaaa] flex items-center gap-0.5 mt-0.5">
                                    <MdLocationOn className="text-[#ff89ac] text-xs" />
                                    {item.location.city}{item.location.state ? `, ${item.location.state}` : ""}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {item?.eventType && item.eventType !== "wedding vendor" && (
                            <span className="text-[10px] bg-[#ff89ac]/10 text-[#ff89ac] font-semibold px-2.5 py-1 rounded-full border border-[#ff89ac]/20">
                                {item.eventType}
                            </span>
                        )}
                        {/* Follow button */}
                        <button className="text-[12px] text-white font-semibold px-4 py-1.5 rounded-full border border-[#494847] hover:border-[#ff89ac] hover:text-[#ff89ac] transition-all duration-150">
                            Follow
                        </button>
                        <BsThreeDots className="text-[#adaaaa] cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>

                {/* ── Media carousel ─────────────────────────────────── */}
                <div
                    ref={insightContainerRef}
                    className="w-full aspect-[4/3] bg-[#111] relative overflow-hidden select-none"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onDoubleClick={handleDoubleTap}
                >
                    <div
                        className="flex h-full transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {media.map((m, i) => (
                            <div key={i} className="h-full flex-shrink-0 w-full">
                                {m.mediaType === "video" ? (
                                    <video src={m.url} className="w-full h-full object-cover" muted playsInline loop
                                        onMouseEnter={(e) => e.target.play()} onMouseLeave={(e) => e.target.pause()} />
                                ) : (
                                    <img src={m.url} alt={item?.caption || "Post"} className="w-full h-full object-cover" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Left arrow */}
                    {hasMultiple && currentSlide > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); prev() }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all shadow-md"
                        >
                            <IoChevronBackOutline size={16} />
                        </button>
                    )}

                    {/* Right arrow */}
                    {hasMultiple && currentSlide < media.length - 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); next() }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all shadow-md"
                        >
                            <IoChevronForwardOutline size={16} />
                        </button>
                    )}

                    {/* Dots */}
                    {hasMultiple && (
                        <div className="absolute bottom-3 left-0 w-full flex justify-center gap-1.5">
                            {media.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`rounded-full transition-all duration-200 ${
                                        i === currentSlide ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
                                    }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Slide counter pill */}
                    {hasMultiple && (
                        <span className="absolute top-3 right-3 text-[11px] bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                            {currentSlide + 1}/{media.length}
                        </span>
                    )}

                    {media.length === 0 && (
                        <div className="w-full h-full flex items-center justify-center text-[#52525b] text-sm">
                            No media available
                        </div>
                    )}
                </div>

                {/* ── Actions row ────────────────────────────────────── */}
                <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => { handleLike(); trackLike(liked) }}
                            className="flex items-center gap-1.5 group"
                        >
                            {liked
                                ? <FaHeart className="text-[#ff89ac] text-xl scale-110 transition-transform" />
                                : <FaRegHeart className="text-[#adaaaa] text-xl group-hover:text-[#ff89ac] transition-colors" />}
                            <span className="text-xs text-[#adaaaa] font-medium">{likeCount}</span>
                        </button>

                        <button onClick={() => setShowComments(true)} className="flex items-center gap-1.5 group">
                            <FaRegComment className="text-[#adaaaa] text-xl group-hover:text-white transition-colors" />
                            <span className="text-xs text-[#adaaaa] font-medium">{commentCount}</span>
                        </button>

                        <button className="flex items-center gap-1.5 group">
                            <TbShare3 className="text-[#adaaaa] text-xl group-hover:text-white transition-colors" />
                            <span className="text-xs text-[#adaaaa] font-medium">{item?.interactions?.shareCount || 0}</span>
                        </button>
                    </div>

                    <button onClick={() => { handleSave(); trackSave(saved) }} className="group">
                        {saved
                            ? <FaBookmark className="text-[#ff89ac] text-xl scale-110 transition-transform" />
                            : <FaRegBookmark className="text-[#adaaaa] text-xl group-hover:text-[#ff89ac] transition-colors" />}
                    </button>
                </div>

                {/* ── Caption ────────────────────────────────────────── */}
                {item?.caption && (
                    <div className="px-4 pb-2">
                        <p className="text-sm text-[#adaaaa] leading-relaxed line-clamp-3">
                            <span className="font-semibold text-white mr-1">{item?.authorBusinessName}</span>
                            {item.caption}
                        </p>
                    </div>
                )}

                {/* ── Tags ───────────────────────────────────────────── */}
                {item?.tags?.length > 0 && (
                    <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 5).map((tag, i) => (
                            <span key={i} className="text-[11px] text-[#ff89ac] font-semibold cursor-pointer hover:underline">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export { PostCard }
