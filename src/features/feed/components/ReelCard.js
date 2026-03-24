'use client'
import { useState, useRef, useEffect, useCallback } from "react"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import { FaRegBookmark, FaBookmark } from "react-icons/fa6"
import { BsThreeDots, BsPlayFill, BsPauseFill } from "react-icons/bs"
import { MdLocationOn, MdMusicNote } from "react-icons/md"
import { TbShare3 } from "react-icons/tb"
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi"
import { axiosInstance } from "@/axios/axios.js"
import { getCookies } from "@/app/action.js"
import { useTrackReel } from "@/features/insights"

const formatDuration = (s) => {
    if (!s) return ""
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
}

const ReelCard = ({ item }) => {

    const { insightVideoRef,insightContainerRef } = useTrackReel({reelId:item._id,isFollower:false})

    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [likeCount, setLikeCount] = useState(item?.interactions?.likeCount || 0)
    const [playing, setPlaying] = useState(false)
    const [muted, setMuted] = useState(false)     // audio on by default
    const [progress, setProgress] = useState(0)    // 0-100

    const videoRef = useRef(null);
    
    const containerRef = useRef(null);
    
    const mutedRef = useRef(false)  // always holds the latest muted value for the observer closure

    const video = item?.video || {}
    const audio = item?.audio?.track

    // combiene refs of insight generator and video element
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
                        axiosInstance.post(`/reels/${item._id}/play`, {}, {
                            headers: { wedoraCredentials: token }
                        }).catch(() => {})
                    })
                } else {
                    v.pause()
                    setPlaying(false)
                }
            },
            // 0.3 threshold: fires when 30% of the card enters the viewport.
            // Safe for tall 9:16 reels that are taller than the screen.
            { threshold: 0.3 }
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

    // ── Manual play/pause toggle ─────────────────────────────────────────
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
            await axiosInstance.post(`/reels/${item._id}/like`, {}, { headers: { wedoraCredentials: token } })
        } catch {
            setLiked((p) => !p)
            setLikeCount((p) => liked ? p + 1 : p - 1)
        }
    }

    const handleSave = async () => {
        try {
            const token = await getCookies()
            setSaved((p) => !p)
            await axiosInstance.post(`/reels/${item._id}/save`, {}, { headers: { wedoraCredentials: token } })
        } catch {
            setSaved((p) => !p)
        }
    }

    return (
        <div className="w-full rounded-3xl bg-black mb-5 overflow-hidden shadow-xl border border-gray-900">

            {/* ── Header (dark style for reels) ──────────────────── */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#C94C73] to-[#f5a3bb]">
                        <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
                            <span className="text-[#f5a3bb] font-bold text-sm">
                                {item?.authorBusinessName?.[0]?.toUpperCase() || "W"}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-white leading-tight">
                            {item?.authorBusinessName || "Wedding Vendor"}
                        </p>
                        {item?.location?.city && (
                            <p className="text-[11px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                                <MdLocationOn className="text-[#C94C73] text-xs" />
                                {item.location.city}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#C94C73]/20 text-[#f5a3bb] font-semibold px-2.5 py-1 rounded-full border border-[#C94C73]/30">
                        Reel
                    </span>
                    <BsThreeDots className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
                </div>
            </div>

            {/* ── Video container ────────────────────────────────── */}
            <div
                ref={setInsightContainerRef}
                className="w-full aspect-[9/16] md:aspect-[4/5] bg-black relative overflow-hidden"
            >
                {video.url ? (
                    <video
                        ref={combinedVideoRefFunction}
                        src={video.url}
                        poster={video.thumbnail}
                        className="w-full h-full object-cover"
                        playsInline
                        loop
                        muted={muted}
                        onTimeUpdate={onTimeUpdate}
                    />
                ) : video.thumbnail ? (
                    <img src={video.thumbnail} alt="Reel" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                        No video available
                    </div>
                )}

                {/* ── Tap to play/pause overlay ── */}
                <div
                    className="absolute inset-0"
                    onClick={handlePlayToggle}
                >
                    {/* Pause icon flashes briefly on tap */}
                    {!playing && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                <BsPlayFill className="text-white text-3xl ml-1" />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right-side action overlay ── */}
                <div className="absolute right-3 bottom-20 flex flex-col gap-5 items-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleLike() }}
                        className="flex flex-col items-center gap-1"
                    >
                        {liked
                            ? <FaHeart className="text-[#C94C73] text-2xl drop-shadow-lg" />
                            : <FaRegHeart className="text-white text-2xl drop-shadow-lg" />}
                        <span className="text-white text-[10px] font-medium drop-shadow">{likeCount}</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleSave() }}
                        className="flex flex-col items-center gap-1"
                    >
                        {saved
                            ? <FaBookmark className="text-[#C94C73] text-2xl drop-shadow-lg" />
                            : <FaRegBookmark className="text-white text-2xl drop-shadow-lg" />}
                        <span className="text-white text-[10px] font-medium drop-shadow">{item?.interactions?.saveCount || 0}</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation() }}
                        className="flex flex-col items-center gap-1"
                    >
                        <TbShare3 className="text-white text-2xl drop-shadow-lg" />
                        <span className="text-white text-[10px] font-medium drop-shadow">{item?.interactions?.shareCount || 0}</span>
                    </button>

                    {/* ── Audio toggle ── */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setMuted((m) => !m) }}
                        className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                        title={muted ? "Unmute" : "Mute"}
                    >
                        {muted
                            ? <HiVolumeOff className="text-white text-lg" />
                            : <HiVolumeUp className="text-white text-lg" />}
                    </button>
                </div>

                {/* ── Bottom gradient — caption + audio ── */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-12 pointer-events-none">
                    {audio?.title && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <MdMusicNote className="text-white text-[10px]" />
                            </div>
                            <p className="text-white text-xs opacity-90 truncate">
                                {audio.title}{audio.artist ? ` · ${audio.artist}` : ""}
                            </p>
                        </div>
                    )}
                    {item?.caption && (
                        <p className="text-white text-xs leading-relaxed line-clamp-2 opacity-95">
                            {item.caption}
                        </p>
                    )}
                </div>

                {/* ── Duration badge ── */}
                {video.duration && (
                    <span className="absolute top-3 right-3 text-[10px] bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full pointer-events-none">
                        {formatDuration(video.duration)}
                    </span>
                )}

                {/* ── Progress bar ── */}
                <div
                    className="absolute bottom-0 left-0 w-full h-1 bg-white/20 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); scrub(e) }}
                >
                    <div
                        className="h-full bg-[#C94C73] transition-none"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* ── Tags (below video, dark bg) ────────────────────── */}
            {item?.tags?.length > 0 && (
                <div className="px-4 py-3 flex flex-wrap gap-1.5">
                    {item.tags.slice(0, 5).map((tag, i) => (
                        <span key={i} className="text-[11px] text-[#f5a3bb] cursor-pointer hover:underline">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

export { ReelCard }
