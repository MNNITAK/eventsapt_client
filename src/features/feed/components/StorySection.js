'use client'
import React, { useState } from "react";
import { StoryCard } from "./StoryCard";
import { StoryViewer } from "./StoryViewer";
import { useInfiniteScroll } from "@/features/infinite-scroll/hooks/useInfiniteScroll";
import { fetchFeed } from "@/features/feed/api/fetchFeed";

export const STORY_COUNT = 6;

function StorySection() {
    const [viewerIndex, setViewerIndex] = useState(null) // null = closed

    const { items, isLoading } = useInfiniteScroll({
        queryKey: ['feed'],
        fetcher: fetchFeed,
        initialPageParam: 1,
        queryOptions: { staleTime: 1000 * 60 * 5 },
    });

    const storyItems = items.slice(0, STORY_COUNT);

    if (isLoading) {
        return (
            <div className="flex gap-4 px-4 py-3 w-full items-center">
                {[...Array(STORY_COUNT)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-[#2a2828] animate-pulse" />
                        <div className="h-2 w-10 bg-[#2a2828] rounded-full animate-pulse" />
                    </div>
                ))}
            </div>
        );
    }

    if (storyItems.length === 0) return null;

    return (
        <>
            {/* Story circles row */}
            <div className="w-full px-3 py-3 flex gap-1 overflow-x-auto scrollbar-hide border-b border-[#1a1a1a]">
                {storyItems.map((item, i) => (
                    <StoryCard
                        key={item._id || i}
                        item={item}
                        onClick={() => setViewerIndex(i)}
                    />
                ))}
            </div>

            {/* Full-screen viewer — rendered when a story is tapped */}
            {viewerIndex !== null && (
                <StoryViewer
                    items={storyItems}
                    startIndex={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                />
            )}
        </>
    );
}
export { StorySection }
