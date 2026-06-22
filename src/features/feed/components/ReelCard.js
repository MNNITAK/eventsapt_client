'use client'
import { useState, useRef, useEffect, useCallback } from "react"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import { FaRegBookmark, FaBookmark } from "react-icons/fa6"
import { BsPlayFill } from "react-icons/bs"
import { TbShare3 } from "react-icons/tb"
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi"
import { FaRegComment } from "react-icons/fa"
import { axiosInstance } from "@/axios/axios.js"
import { getCookies } from "@/app/action.js"
import { useRouter, useSearchParams } from "next/navigation"
import { CommentsDrawer } from "./CommentsDrawer"
import { useTrackReel } from "@/features/insights/hooks/useTrackEvents.js"
import { formatCount, formatDuration } from "./feedUtils.js"

const ReelCard = ({ item }) => {

    const { insightVideoRef,
     insightContainerRef,
     trackLike, trackSave, trackShare, trackComment, trackFollow } = useTrackReel({reelId:item._id,isFollower:false})

    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [likeCount, setLikeCount] = useState(item?.interactions?.likeCount || 0)
    const [playing, setPlaying] = useState(false)
    const [muted, setMuted] = useState(false)     // audio on by default
    const [progress, setProgress] = useState(0)    // 0-100
    const [showComments, setShowComments] = useState(false)

    const videoRef = useRef(null)
    const containerRef = useRef(null)
    const mutedRef = useRef(false)

    const router = useRouter()
    const searchParams = useSearchParams()

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

    const video = item?.video || {}

    // ── Stable callback ref — useCallback prevents React from calling this
    // on every re-render (new function identity would reset muted each time)
    const setVideoRef = useCallback((node) => {
        videoRef.current = node
        if (node) node.muted = mutedRef.current
    }, [])
    const setInsightVideoRef = (element) => {
        videoRef.current = element;
        insightVideoRef.current = element;
    }
    const setInsightContainerRef = (element) => {
        containerRef.current = element;
        insightContainerRef.current = element;
    }
    const combinedVideoRefFunction = (element) => {
        setVideoRef(element);
        setInsightVideoRef(element)
    }

    // ── Sync muted toggle to video DOM node ───────────────────────────────
    useEffect(() => {
        mutedRef.current = muted
        if (videoRef.current) videoRef.current.muted = muted
    }, [muted])

    // ── Auto-play / pause via IntersectionObserver ─────────────────────────
    useEffect(() => {
        const el = containerRef.current
        if (!el || !video.url) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                const v = videoRef.current
                if (!v) return

                if (entry.isIntersecting) {
                    v.muted = mutedRef.current
                    v.play().then(() => setPlaying(true)).catch(() => {
                        // Browser blocked unmuted autoplay — fall back to muted
                        v.muted = true
                        mutedRef.current = true
                        setMuted(true)
                        v.play().then(() => setPlaying(true)).catch(() => {})
                    })
                    getCookies().then((token) => {
                        axiosInstance.post(`/v1/reels/${item._id}/play`, {}, {
                            headers: { wedoraCredentials: token }
                        }).catch(() => {})
                    })
                } else {
                    v.pause()
                    setPlaying(false)
                }
            },
            { threshold: 0.5 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [item._id, video.url])

    // ── Progress bar ──────────────────────────────────────────────────────
    const onTimeUpdate = () => {
        const v = videoRef.current
        if (!v || !v.duration) return
        setProgress((v.currentTime / v.duration) * 100)
    }

    const scrub = (e) => {
        const v = videoRef.current
        if (!v) return
        const rect = e.currentTarget.getBoundingClientRect()
        const ratio = (e.clientX - rect.left) / rect.width
        v.currentTime = ratio * v.duration
    }

    const handlePlayToggle = (e) => {
        e.stopPropagation()
        const v = videoRef.current
        if (!v) return
        if (playing) { v.pause(); setPlaying(false) }
        else { v.play().then(() => setPlaying(true)).catch(() => {}) }
    }

    const handleLike = async () => {
        try {
            const token = await getCookies()
            setLiked((p) => !p)
            setLikeCount((p) => liked ? p - 1 : p + 1)
            await axiosInstance.post(`/v1/reels/${item._id}/like`, {}, { headers: { wedoraCredentials: token } })
        } catch {
            setLiked((p) => !p)
            setLikeCount((p) => liked ? p + 1 : p - 1)
        }
    }

    const handleSave = async () => {
        try {
            const token = await getCookies()
            setSaved((p) => !p)
            await axiosInstance.post(`/v1/reels/${item._id}/save`, {}, { headers: { wedoraCredentials: token } })
        } catch {
            setSaved((p) => !p)
        }
    }

    return (
        <>
        <CommentsDrawer
            open={showComments}
            onClose={() => setShowComments(false)}
            itemId={item?._id}
            contentType="reel"
            initialCount={item?.interactions?.commentCount || 0}
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
                <button onClick={goToVendorProfile} className="truncate font-semibold text-[13px] text-white leading-tight text-left">
                    {item?.authorBusinessName || "Wedding Vendor"}
                </button>
            </div>

            {/* ── Video container ────────────────────────────────── */}
            <div
                ref={setInsightContainerRef}
                className="w-full aspect-[4/5] bg-black relative overflow-hidden"
            >
                {video.thumbnail && (
                    <img
                        src={video.thumbnail}
                        alt="Reel"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                {video.url ? (
                    <video
                        ref={combinedVideoRefFunction}
                        src={video.url}
                        className="absolute inset-0 w-full h-full object-cover"
                        playsInline
                        loop
                        muted={muted}
                        onTimeUpdate={onTimeUpdate}
                    />
                ) : !video.thumbnail ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                        No video available
                    </div>
                ) : null}

                {/* ── Tap to play/pause overlay ── */}
                <div className="absolute inset-0" onClick={handlePlayToggle}>
                    {!playing && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                <BsPlayFill className="text-white text-3xl ml-1" />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Reel badge ── */}
                <span className="absolute top-3 left-3 text-[10px] bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full pointer-events-none flex items-center gap-1">
                    <BsPlayFill className="text-xs" /> Reel
                </span>

                {/* ── Mute toggle ── */}
                <button
                    onClick={(e) => { e.stopPropagation(); setMuted((m) => !m) }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                    title={muted ? "Unmute" : "Mute"}
                >
                    {muted ? <HiVolumeOff className="text-white text-base" /> : <HiVolumeUp className="text-white text-base" />}
                </button>

                {/* ── Duration badge ── */}
                {video.duration && (
                    <span className="absolute bottom-3 right-3 text-[10px] bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full pointer-events-none">
                        {formatDuration(video.duration)}
                    </span>
                )}

                {/* ── Progress bar ── */}
                <div
                    className="absolute bottom-0 left-0 w-full h-1 bg-white/20 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); scrub(e) }}
                >
                    <div className="h-full bg-[#ff89ac] transition-none" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* ── Actions row (Instagram-style, below media) ─────── */}
            <div className="px-3 md:px-4 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => { handleLike(); trackLike(liked) }} className="flex items-center gap-1.5">
                        {liked
                            ? <FaHeart className="text-[#ff89ac] text-[26px]" />
                            : <FaRegHeart className="text-white text-[26px]" />}
                        <span className="text-sm text-white font-semibold">{formatCount(likeCount)}</span>
                    </button>

                    <button onClick={() => { setShowComments(true); trackComment?.() }} className="flex items-center gap-1.5">
                        <FaRegComment className="text-white text-[25px] -scale-x-100" />
                        <span className="text-sm text-white font-semibold">{formatCount(item?.interactions?.commentCount || 0)}</span>
                    </button>

                    <button onClick={() => trackShare()} className="flex items-center gap-1.5">
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
            {item?.caption ? (
                <div className="px-3 md:px-4 pt-2 pb-3">
                    <p className="text-sm text-white leading-snug line-clamp-2">
                        <button onClick={goToVendorProfile} className="font-semibold mr-1.5">{item?.authorBusinessName}</button>
                        <span className="text-[#d4d4d4]">{item.caption}</span>
                    </p>
                </div>
            ) : <div className="pb-3" />}
        </article>
        </>
    )
}

export { ReelCard }
