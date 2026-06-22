'use client'
import { useState, useRef } from "react"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import { FaRegBookmark, FaBookmark } from "react-icons/fa6"
import { FaRegComment } from "react-icons/fa"
import { TbShare3 } from "react-icons/tb"
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5"
import { axiosInstance } from "@/axios/axios.js"
import { getCookies } from "@/app/action.js"
import { useRouter, useSearchParams } from "next/navigation"
import { CommentsDrawer } from "./CommentsDrawer"
import { useTrackPost } from "@/features/insights/hooks/useTrackEvents.js"
import { formatCount } from "./feedUtils.js"

const PostCard = ({ item }) => {
    const { insightContainerRef, trackLike, trackSave } = useTrackPost({ postId: item._id, isFollower: false })
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [likeCount, setLikeCount] = useState(item?.interactions?.likeCount || 0)
    const [commentCount, setCommentCount] = useState(item?.interactions?.commentCount || 0)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [showComments, setShowComments] = useState(false)
    const [expanded, setExpanded] = useState(false)

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
            {/* Edge-to-edge on mobile (Instagram), framed card on desktop */}
            <article className="w-full bg-black md:bg-[#1a1919] md:rounded-[28px] md:mb-5 md:overflow-hidden md:border md:border-[#2a2828] mb-3">

                {/* ── Header (minimal: avatar + name, both link to profile) ── */}
                <div className="flex items-center gap-2.5 px-3 md:px-4 py-2.5">
                    <button onClick={goToVendorProfile} className="p-[2px] rounded-full bg-gradient-to-tr from-[#ff89ac] to-[#a68cff] flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                            <span className="text-[#ff89ac] font-bold text-sm">
                                {item?.authorBusinessName?.[0]?.toUpperCase() || "W"}
                            </span>
                        </div>
                    </button>
                    <button onClick={goToVendorProfile} className="truncate font-semibold text-[13px] leading-tight text-white text-left">
                        {item?.authorBusinessName || "Wedding Vendor"}
                    </button>
                </div>

                {/* ── Media carousel ─────────────────────────────────── */}
                <div
                    ref={insightContainerRef}
                    className="w-full aspect-[4/5] bg-black relative overflow-hidden select-none"
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
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white shadow-md"
                        >
                            <IoChevronBackOutline size={15} />
                        </button>
                    )}

                    {/* Right arrow */}
                    {hasMultiple && currentSlide < media.length - 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); next() }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white shadow-md"
                        >
                            <IoChevronForwardOutline size={15} />
                        </button>
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

                {/* ── Carousel dots (below media, Instagram-style) ───── */}
                {hasMultiple && (
                    <div className="w-full flex justify-center gap-1.5 pt-2.5">
                        {media.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`rounded-full transition-all duration-200 ${
                                    i === currentSlide ? "w-1.5 h-1.5 bg-[#ff89ac]" : "w-1.5 h-1.5 bg-white/25"
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* ── Actions row ────────────────────────────────────── */}
                <div className="px-3 md:px-4 pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => { handleLike(); trackLike(liked) }}
                            className="flex items-center gap-1.5"
                        >
                            {liked
                                ? <FaHeart className="text-[#ff89ac] text-[26px]" />
                                : <FaRegHeart className="text-white text-[26px]" />}
                            <span className="text-sm text-white font-semibold">{formatCount(likeCount)}</span>
                        </button>

                        <button onClick={() => setShowComments(true)} className="flex items-center gap-1.5">
                            <FaRegComment className="text-white text-[25px] -scale-x-100" />
                            <span className="text-sm text-white font-semibold">{formatCount(commentCount)}</span>
                        </button>

                        <button className="flex items-center gap-1.5">
                            <TbShare3 className="text-white text-[26px]" />
                            <span className="text-sm text-white font-semibold">{formatCount(item?.interactions?.shareCount || 0)}</span>
                        </button>
                    </div>

                    <button onClick={() => { handleSave(); trackSave(saved) }}>
                        {saved
                            ? <FaBookmark className="text-[#ff89ac] text-[24px]" />
                            : <FaRegBookmark className="text-white text-[24px]" />}
                    </button>
                </div>

                {/* ── Caption (minimal, single line) ─────────────────── */}
                {item?.caption && (
                    <div className="px-3 md:px-4 pt-2 pb-3">
                        <p className={`text-sm text-white leading-snug ${expanded ? "" : "line-clamp-2"}`}>
                            <button onClick={goToVendorProfile} className="font-semibold mr-1.5">{item?.authorBusinessName}</button>
                            <span className="text-[#d4d4d4]">{item.caption}</span>
                        </p>
                        {!expanded && item.caption.length > 80 && (
                            <button onClick={() => setExpanded(true)} className="text-[13px] text-[#adaaaa] mt-0.5">more</button>
                        )}
                    </div>
                )}
                {!item?.caption && <div className="pb-3" />}
            </article>
        </>
    )
}

export { PostCard }
