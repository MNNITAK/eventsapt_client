import { getCookies } from "../../../app/action.js"
import { axiosInstance } from "../../../axios/axios.js"

/**
 * Fetches the reels-only feed (full-screen Reels section).
 * Uses the public reels browsing endpoint, which is cursor-paginated.
 *
 * Shape returned must match what useInfiniteScroll expects:
 *   { data: [...reels], nextCursor: <cursor|null> }
 *
 * @param {{ pageParam: string|null }} - pageParam is the `_id` cursor from the previous page
 */
export const fetchReelsFeed = async ({ pageParam = null }) => {
    try {
        const token = await getCookies()

        const resp = await axiosInstance.get(`/v1/reels`, {
            params: { limit: 10, ...(pageParam ? { cursor: pageParam } : {}) },
            headers: {
                wedoraCredentials: token,
            },
        })

        const { reels = [], hasNextPage, nextCursor } = resp.data?.data || {}

        // Tag each item so the feed cards can branch on contentType if reused.
        const data = reels.map((r) => ({ ...r, contentType: "reel" }))

        return {
            data,
            nextCursor: hasNextPage ? nextCursor : null,
        }
    } catch (error) {
        console.error("[fetchReelsFeed] error:", error?.response?.data || error.message)
        return { data: [], nextCursor: null }
    }
}

/**
 * Fetches the COMBINED feed (reels + posts) for the full-screen Instagram-style
 * Reels viewer. Uses the same `/v1/feed` endpoint the home feed uses (page
 * paginated), so the viewer always has content even when there are few reels.
 *
 * Shape returned must match useInfiniteScroll: { data: [...items], nextCursor }
 */
export const fetchReelsViewerFeed = async ({ pageParam = 1 }) => {
    try {
        const token = await getCookies()
        const page = pageParam || 1

        const resp = await axiosInstance.get(`/v1/feed`, {
            params: { page, limit: 20 },
            headers: {
                wedoraCredentials: token,
            },
        })

        const { items = [], hasNextPage, page: currentPage } = resp.data?.data || {}

        return {
            data: items,
            nextCursor: hasNextPage ? (currentPage || page) + 1 : null,
        }
    } catch (error) {
        console.error("[fetchReelsViewerFeed] error:", error?.response?.data || error.message)
        return { data: [], nextCursor: null }
    }
}
