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
