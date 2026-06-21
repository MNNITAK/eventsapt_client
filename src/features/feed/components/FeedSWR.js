'use client'
import { useInfiniteScroll } from "@/features/infinite-scroll/hooks/useInfiniteScroll"
import { fetchFeed } from "@/features/feed/api/fetchFeed"
import { PostCard } from "./PostCard"
import { ReelCard } from "./ReelCard"
import { STORY_COUNT } from "./StorySection"

// Skeleton card shown while loading
const FeedSkeleton = () => (
    <div className="w-full rounded-[32px] border border-[#2a2828] bg-[#1a1919] mb-5 overflow-hidden animate-pulse">
        <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-[#2a2828] flex-shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-3 w-28 bg-[#2a2828] rounded-full" />
                <div className="h-2 w-20 bg-[#222] rounded-full" />
            </div>
            <div className="h-7 w-16 bg-[#2a2828] rounded-full" />
        </div>
        <div className="w-full aspect-[4/3] bg-[#222]" />
        <div className="px-4 py-3 flex gap-5">
            <div className="h-4 w-10 bg-[#2a2828] rounded-full" />
            <div className="h-4 w-10 bg-[#2a2828] rounded-full" />
            <div className="h-4 w-10 bg-[#2a2828] rounded-full" />
        </div>
        <div className="px-4 pb-4">
            <div className="h-3 w-3/4 bg-[#2a2828] rounded-full mb-2" />
            <div className="h-3 w-1/2 bg-[#222] rounded-full" />
        </div>
    </div>
)

// Interleave posts and reels in 2:1 ratio — post, post, reel, post, post, reel, ...
function buildFeedRatio(items) {
    const posts = items.filter(item => item?.contentType !== 'reel')
    const reels = items.filter(item => item?.contentType === 'reel')
    const result = []
    let pi = 0, ri = 0
    while (pi < posts.length || ri < reels.length) {
        if (pi < posts.length) result.push(posts[pi++])
        if (pi < posts.length) result.push(posts[pi++])
        if (ri < reels.length) result.push(reels[ri++])
    }
    return result
}

const FeedSWR = () => {
    const { items, sentinelRef, isLoading, isFetchingNextPage, isError } = useInfiniteScroll({
        queryKey: ['feed'],
        fetcher: fetchFeed,
        initialPageParam: 1,
        queryOptions: {
            staleTime: 1000 * 60 * 5, // 5 min — feed comes from Redis, no need to refetch often
        },
        // Pipeline the next page: start fetching ~2–3 cards before the user reaches
        // the end, so the next set is already loaded by the time they scroll to it
        // (no visible wait). React Query caches + dedupes the in-flight request.
        sentinelOptions: { rootMargin: "1600px 0px" },
    })

    if (isLoading) {
        return (
            <div className="w-full">
                {[...Array(3)].map((_, i) => <FeedSkeleton key={i} />)}
            </div>
        )
    }

    // First STORY_COUNT items are used by StorySection — skip them here
    const feedItems = buildFeedRatio(items.slice(STORY_COUNT))

    if (isError || feedItems.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-16">
                <p className="text-lg font-medium text-[#adaaaa]">No posts yet</p>
                <p className="text-sm mt-1 text-[#52525b]">Check back soon for wedding inspiration</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {feedItems.map((item, i) =>
                item?.contentType === 'reel'
                    ? <ReelCard key={item._id || i} item={item} />
                    : <PostCard key={item._id || i} item={item} />
            )}

            {/* Sentinel — triggers next page load when scrolled into view */}
            <div ref={sentinelRef} />

            {isFetchingNextPage && (
                <div className="w-full flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-[#ff89ac] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    )
}

export { FeedSWR }
