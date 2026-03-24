import { getCookies } from "../../../app/action.js"
import { axiosInstance } from "../../../axios/axios.js"

/**
 * Fetches the mixed posts+reels feed from the recommendation engine.
 * Shape returned must match what useInfiniteScroll expects:
 *   { data: [...items], nextCursor: <nextPage|null> }
 *
 * @param {{ pageParam: number|null }} - pageParam comes from TanStack Query
 */
export const fetchFeed = async ({ pageParam = 1 }) => {
    try {
        const token = await getCookies()
        const page = pageParam || 1

        const resp = await axiosInstance.get(`/content/feed`, {
            params: { page, limit: 20 },
            headers: {
                wedoraCredentials: token,
            },
        })

        const { items = [], hasNextPage, page: currentPage } = resp.data?.data || {}

        return {
            data: items,
            nextCursor: hasNextPage ? currentPage + 1 : null,
        }
    } catch (error) {
        console.error("[fetchFeed] error:", error?.response?.data || error.message)
        return { data: [], nextCursor: null }
    }
}
