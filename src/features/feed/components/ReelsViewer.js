'use client'
import { useState, useRef, useEffect } from "react"
import { FaRegHeart, FaHeart } from "react-icons/fa"
import { FaRegBookmark, FaBookmark } from "react-icons/fa6"
import { FaRegComment } from "react-icons/fa"
import { TbShare3 } from "react-icons/tb"
import { BsPlayFill, BsThreeDots } from "react-icons/bs"
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi"
import { MdMusicNote, MdLocationOn } from "react-icons/md"
import { axiosInstance } from "@/axios/axios.js"
import { getCookies } from "@/app/action.js"
import { useRouter, useSearchParams } from "next/navigation"
import { useInfiniteScroll } from "@/features/infinite-scroll/hooks/useInfiniteScroll"
import { fetchReelsViewerFeed } from "@/features/feed/api/fetchReelsFeed"
import { CommentsDrawer } from "./CommentsDrawer"
import { useTrackReel } from "@/features/insights/hooks/useTrackEvents.js"
import { formatCount } from "./feedUtils.js"

// ── Single full-screen slide (handles both reels and image/video posts) ───────
function FullScreenReel({ item, globalMuted, setGlobalMuted }) {
    const { insightVideoRef, insightContainerRef, trackLike, trackSave, trackShare, trackComment } =
        useTrackReel({ reelId: item._id, isFollower: false })

    // A slide is a "reel" if it's tagged as one or carries a reel video; everything
    // else is a post, whose first media item we render full-screen (image or video).
    const isReel = item?.contentType === "reel" || !!item?.video?.url
    const kind = isReel ? "reels" : "posts"

    const reelVideo = item?.video || {}
    const firstMedia = item?.media?.[0] || {}
    const isVideo = isReel || firstMedia?.mediaType === "video"
    const mediaUrl = isReel ? reelVideo.url : firstMedia?.url
    const posterUrl = isReel
        ? reelVideo.thumbnail
        : (firstMedia?.mediaType === "video" ? firstMedia?.thumbnail : firstMedia?.url)
    const audio = item?.audio?.track

    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [likeCount, setLikeCount] = useState(item?.interactions?.likeCount || 0)
    const [playing, setPlaying] = useState(false)
    const [showComments, setShowComments] = useState(false)

    const videoRef = useRef(null)
    const containerRef = useRef(null)
    const mutedRef = useRef(globalMuted)

    const router = useRouter()
    const searchParams = useSearchParams()

    const setContainerRef = (el) => { containerRef.current = el; insightContainerRef.current = el }
    const setVideoRef = (el) => { videoRef.current = el; insightVideoRef.current = el; if (el) el.muted = mutedRef.current }

    useEffect(() => {
        mutedRef.current = globalMuted
        if (videoRef.current) videoRef.current.muted = globalMuted
    }, [globalMuted])

    // Auto play/pause whichever video slide is centered in the viewport.
    useEffect(() => {
        const el = containerRef.current
        if (!el || !isVideo || !mediaUrl) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                const v = videoRef.current
                if (!v) return
                if (entry.isIntersecting) {
                    v.muted = mutedRef.current
                    v.play().then(() => setPlaying(true)).catch(() => {
                        v.muted = true; mutedRef.current = true; setGlobalMuted(true)
                        v.play().then(() => setPlaying(true)).catch(() => {})
                    })
                    // Play tracking only applies to reels.
                    if (isReel) {
                        getCookies().then((token) => {
                            axiosInstance.post(`/v1/reels/${item._id}/play`, {}, { headers: { wedoraCredentials: token } }).catch(() => {})
                        })
                    }
                } else {
                    v.pause(); setPlaying(false)
                }
            },
            { threshold: 0.6 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [item._id, mediaUrl, isVideo, isReel, setGlobalMuted])

    const togglePlay = () => {
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
            await axiosInstance.post(`/v1/${kind}/${item._id}/like`, {}, { headers: { wedoraCredentials: token } })
        } catch {
            setLiked((p) => !p)
            setLikeCount((p) => liked ? p + 1 : p - 1)
        }
    }

    const handleSave = async () => {
        try {
            const token = await getCookies()
            setSaved((p) => !p)
            await axiosInstance.post(`/v1/${kind}/${item._id}/save`, {}, { headers: { wedoraCredentials: token } })
        } catch {
            setSaved((p) => !p)
        }
    }

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
        <div ref={setContainerRef} className="relative w-full h-full snap-start snap-always bg-black flex-shrink-0 overflow-hidden">
            <CommentsDrawer
                open={showComments}
                onClose={() => setShowComments(false)}
                itemId={item?._id}
                contentType={isReel ? "reel" : "post"}
                initialCount={item?.interactions?.commentCount || 0}
            />

            {/* ── Media ── */}
            {isVideo ? (
                <>
                    {posterUrl && (
                        <img src={posterUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {mediaUrl ? (
                        <video
                            ref={setVideoRef}
                            src={mediaUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            playsInline
                            loop
                            muted={globalMuted}
                        />
                    ) : !posterUrl ? (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No media available</div>
                    ) : null}

                    {/* Tap to play/pause */}
                    <div className="absolute inset-0" onClick={togglePlay}>
                        {!playing && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                    <BsPlayFill className="text-white text-3xl ml-1" />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                mediaUrl ? (
                    <img src={mediaUrl} alt={item?.caption || "Post"} className="absolute inset-0 w-full h-full object-contain" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No media available</div>
                )
            )}

            {/* Mute toggle — only meaningful for video */}
            {isVideo && (
                <button
                    onClick={(e) => { e.stopPropagation(); setGlobalMuted((m) => !m) }}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-10"
                >
                    {globalMuted ? <HiVolumeOff className="text-white text-lg" /> : <HiVolumeUp className="text-white text-lg" />}
                </button>
            )}

            {/* Right action rail */}
            <div className="absolute right-3 bottom-28 flex flex-col gap-5 items-center z-10">
                <button onClick={(e) => { e.stopPropagation(); handleLike(); trackLike(liked) }} className="flex flex-col items-center gap-1">
                    {liked ? <FaHeart className="text-[#ff89ac] text-[30px] drop-shadow-lg" /> : <FaRegHeart className="text-white text-[30px] drop-shadow-lg" />}
                    <span className="text-white text-[11px] font-medium drop-shadow">{formatCount(likeCount)}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); setShowComments(true); trackComment?.() }} className="flex flex-col items-center gap-1">
                    <FaRegComment className="text-white text-[28px] -scale-x-100 drop-shadow-lg" />
                    <span className="text-white text-[11px] font-medium drop-shadow">{formatCount(item?.interactions?.commentCount || 0)}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleSave(); trackSave(saved) }} className="flex flex-col items-center gap-1">
                    {saved ? <FaBookmark className="text-[#ff89ac] text-[28px] drop-shadow-lg" /> : <FaRegBookmark className="text-white text-[28px] drop-shadow-lg" />}
                    <span className="text-white text-[11px] font-medium drop-shadow">{formatCount(item?.interactions?.saveCount || 0)}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); trackShare() }} className="flex flex-col items-center gap-1">
                    <TbShare3 className="text-white text-[28px] drop-shadow-lg" />
                    <span className="text-white text-[11px] font-medium drop-shadow">{formatCount(item?.interactions?.shareCount || 0)}</span>
                </button>
                <BsThreeDots className="text-white text-xl drop-shadow-lg" />
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/85 via-black/30 to-transparent px-4 pb-6 pt-16 z-10">
                <div className="flex items-center gap-2.5 mb-2.5 pr-16">
                    <button onClick={goToVendorProfile} className="p-[2px] rounded-full bg-gradient-to-tr from-[#ff89ac] to-[#a68cff] flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                            <span className="text-[#ff89ac] font-bold text-sm">{item?.authorBusinessName?.[0]?.toUpperCase() || "W"}</span>
                        </div>
                    </button>
                    <button onClick={goToVendorProfile} className="text-white font-semibold text-sm truncate">{item?.authorBusinessName || "Wedding Vendor"}</button>
                </div>
                {item?.caption && (
                    <p className="text-white text-[13px] leading-snug line-clamp-2 pr-16 mb-1.5">{item.caption}</p>
                )}
                {audio?.title && (
                    <div className="flex items-center gap-1.5 pr-16">
                        <MdMusicNote className="text-white text-sm flex-shrink-0" />
                        <p className="text-white text-[12px] opacity-90 truncate">{audio.title}{audio.artist ? ` · ${audio.artist}` : ""}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Reels viewer (snap-scroll container) ─────────────────────────────────────
function ReelsViewer() {
    const [globalMuted, setGlobalMuted] = useState(false)
    // Combined reels + posts feed, Instagram-style.
    const { items, sentinelRef, isLoading, isFetchingNextPage, isError } = useInfiniteScroll({
        queryKey: ['reels-viewer-feed'],
        fetcher: fetchReelsViewerFeed,
        initialPageParam: 1,
        queryOptions: { staleTime: 1000 * 60 * 5 },
        sentinelOptions: { rootMargin: "1200px 0px" },
    })

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="w-7 h-7 border-2 border-[#ff89ac] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (isError || items.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                <p className="text-lg font-medium text-[#adaaaa]">Nothing here yet</p>
                <p className="text-sm mt-1 text-[#52525b]">Check back soon for wedding inspiration</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide">
            {items.map((item) => (
                <FullScreenReel
                    key={item._id}
                    item={item}
                    globalMuted={globalMuted}
                    setGlobalMuted={setGlobalMuted}
                />
            ))}
            <div ref={sentinelRef} className="h-px" />
            {isFetchingNextPage && (
                <div className="w-full flex justify-center py-4 bg-black">
                    <div className="w-6 h-6 border-2 border-[#ff89ac] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    )
}

export { ReelsViewer }
