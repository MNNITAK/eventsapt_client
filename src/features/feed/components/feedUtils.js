// Small shared formatting helpers for feed cards.

// "5h", "3d", "2w" — Instagram-style relative time.
export function timeAgo(date) {
    if (!date) return ""
    const then = new Date(date).getTime()
    if (Number.isNaN(then)) return ""
    const sec = Math.max(0, Math.floor((Date.now() - then) / 1000))
    if (sec < 60) return "just now"
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}h ago`
    const day = Math.floor(hr / 24)
    if (day < 7) return `${day}d ago`
    const wk = Math.floor(day / 7)
    if (wk < 5) return `${wk}w ago`
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

// 1234 -> "1,234"; 12345 -> "12.3K"; 1234567 -> "1.2M"
export function formatCount(n) {
    const num = Number(n) || 0
    if (num < 1000) return String(num)
    if (num < 1_000_000) {
        const k = num / 1000
        return `${k % 1 === 0 ? k : k.toFixed(1)}K`
    }
    const m = num / 1_000_000
    return `${m % 1 === 0 ? m : m.toFixed(1)}M`
}

// Format seconds as m:ss (e.g. 75 -> "1:15").
export function formatDuration(s) {
    if (!s) return ""
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
}
