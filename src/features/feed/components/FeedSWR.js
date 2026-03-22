'use client'
import { useInfiniteScroll } from "@/features/infinite-scroll/hooks/useInfiniteScroll"
import { fetchFeed } from "@/features/feed/api/fetchFeed"
import { PostCard } from "./PostCard"
import { ReelCard } from "./ReelCard"

// Skeleton card shown while loading
const FeedSkeleton = () => (
    <div className="w-full rounded-2xl border border-gray-100 mb-4 overflow-hidden animate-pulse">
        <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gray-200" />
            <div className="flex flex-col gap-1">
                <div className="h-3 w-28 bg-gray-200 rounded" />
                <div className="h-2 w-16 bg-gray-100 rounded" />
            </div>
        </div>
        <div className="w-full aspect-[4/3] bg-gray-200" />
        <div className="px-3 py-2 flex gap-4">
            <div className="h-4 w-8 bg-gray-200 rounded" />
            <div className="h-4 w-8 bg-gray-200 rounded" />
        </div>
        <div className="px-3 pb-3">
            <div className="h-3 w-3/4 bg-gray-100 rounded mb-1" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
    </div>
)

const FeedSWR = () => {
    const { items, sentinelRef, isLoading, isFetchingNextPage, isError } = useInfiniteScroll({
        queryKey: ['feed'],
        fetcher: fetchFeed,
        initialPageParam: 1,
        queryOptions: {
            staleTime: 1000 * 60 * 5, // 5 min — feed comes from Redis, no need to refetch often
        },
    })

    if (isLoading) {
        return (
            <div className="w-full">
                {[...Array(3)].map((_, i) => <FeedSkeleton key={i} />)}
            </div>
        )
    }

    if (isError || items.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="text-lg font-medium">No posts yet</p>
                <p className="text-sm mt-1">Check back soon for wedding inspiration</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {items.map((item, i) =>
                item?.contentType === 'reel'
                    ? <ReelCard key={item._id || i} item={item} />
                    : <PostCard key={item._id || i} item={item} />
            )}

            {/* Sentinel — triggers next page load when scrolled into view */}
            <div ref={sentinelRef} />

            {isFetchingNextPage && (
                <div className="w-full flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-[#C94C73] border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    )
}

export { FeedSWR }
