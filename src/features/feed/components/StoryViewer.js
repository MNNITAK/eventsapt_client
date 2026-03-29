'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { IoClose } from 'react-icons/io5'
import { BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'

const STORY_DURATION = 5000 // ms per story

function StoryViewer({ items, startIndex = 0, onClose }) {
    const [current, setCurrent] = useState(startIndex)
    const [progress, setProgress] = useState(0)
    const [paused, setPaused] = useState(false)
    const [muted, setMuted] = useState(false)
    const videoRef = useRef(null)
    const intervalRef = useRef(null)
    const startTimeRef = useRef(null)
    const elapsedRef = useRef(0)

    const item = items[current]
    const isReel = item?.contentType === 'reel'
    const mediaSrc = isReel
        ? (item?.video?.url || item?.video?.thumbnail)
        : item?.media?.[0]?.url
    const isVideo = isReel || item?.media?.[0]?.mediaType === 'video'
    const name = item?.authorBusinessName || 'Vendor'
    const initial = name[0]?.toUpperCase()

    const goNext = useCallback(() => {
        if (current < items.length - 1) {
            elapsedRef.current = 0
            setProgress(0)
            setCurrent(c => c + 1)
        } else {
            onClose()
        }
    }, [current, items.length, onClose])

    const goPrev = useCallback(() => {
        if (current > 0) {
            elapsedRef.current = 0
            setProgress(0)
            setCurrent(c => c - 1)
        }
    }, [current])

    // Progress timer
    useEffect(() => {
        elapsedRef.current = 0
        setProgress(0)
        startTimeRef.current = Date.now()

        const tick = () => {
            if (paused) return
            elapsedRef.current = Date.now() - startTimeRef.current
            const pct = Math.min((elapsedRef.current / STORY_DURATION) * 100, 100)
            setProgress(pct)
            if (pct >= 100) goNext()
        }

        intervalRef.current = setInterval(tick, 50)
        return () => clearInterval(intervalRef.current)
    }, [current, paused, goNext])

    // Pause/resume when paused state changes
    useEffect(() => {
        if (paused) {
            clearInterval(intervalRef.current)
            if (videoRef.current) videoRef.current.pause()
        } else {
            startTimeRef.current = Date.now() - elapsedRef.current
            if (videoRef.current) videoRef.current.play().catch(() => {})
        }
    }, [paused])

    // Auto-play video when story changes
    useEffect(() => {
        if (videoRef.current && isVideo) {
            videoRef.current.currentTime = 0
            videoRef.current.play().catch(() => {})
        }
    }, [current, isVideo])

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={onClose}
        >
            {/* Story card — stop propagation so taps on the card don't close */}
            <div
                className="relative w-full max-w-sm h-full md:max-h-[90vh] md:rounded-2xl overflow-hidden bg-black"
                onClick={e => e.stopPropagation()}
            >
                {/* ── Progress bars ── */}
                <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
                    {items.map((_, i) => (
                        <div key={i} className="flex-1 h-[2.5px] bg-white/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-none"
                                style={{
                                    width: i < current ? '100%' : i === current ? `${progress}%` : '0%'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* ── Header ── */}
                <div className="absolute top-8 left-3 right-3 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-[2px] rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                            <div className="p-[1.5px] rounded-full bg-black">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1a1919] flex items-center justify-center">
                                    {mediaSrc ? (
                                        <img src={mediaSrc} alt={name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm font-bold text-[#ff89ac]">{initial}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className="text-white text-sm font-semibold drop-shadow">{name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {isVideo && (
                            <button
                                onClick={() => { setMuted(m => !m); if (videoRef.current) videoRef.current.muted = !muted }}
                                className="text-white drop-shadow"
                            >
                                {muted ? <HiVolumeOff size={20} /> : <HiVolumeUp size={20} />}
                            </button>
                        )}
                        <button onClick={onClose} className="text-white drop-shadow">
                            <IoClose size={24} />
                        </button>
                    </div>
                </div>

                {/* ── Media ── */}
                {isVideo && item?.video?.url ? (
                    <video
                        ref={videoRef}
                        src={item.video.url}
                        poster={item.video.thumbnail}
                        className="w-full h-full object-cover"
                        playsInline
                        loop={false}
                        muted={muted}
                        onEnded={goNext}
                    />
                ) : (
                    <img
                        src={mediaSrc}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                )}

                {/* ── Caption overlay ── */}
                {item?.caption && (
                    <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent px-4 pt-10 pb-6">
                        <p className="text-white text-sm leading-relaxed line-clamp-3">{item.caption}</p>
                    </div>
                )}

                {/* ── Tap zones: left half = prev, right half = next ── */}
                <div className="absolute inset-0 z-10 flex">
                    <div
                        className="flex-1 h-full cursor-pointer"
                        onClick={goPrev}
                        onMouseDown={() => setPaused(true)}
                        onMouseUp={() => setPaused(false)}
                        onTouchStart={() => setPaused(true)}
                        onTouchEnd={() => setPaused(false)}
                    />
                    <div
                        className="flex-1 h-full cursor-pointer"
                        onClick={goNext}
                        onMouseDown={() => setPaused(true)}
                        onMouseUp={() => setPaused(false)}
                        onTouchStart={() => setPaused(true)}
                        onTouchEnd={() => setPaused(false)}
                    />
                </div>
            </div>
        </div>
    )
}

export { StoryViewer }
