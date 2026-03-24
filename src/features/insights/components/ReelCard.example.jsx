"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ReelCard.jsx — drop-in example showing how useTrackReel integrates
// into your existing infinite scroll feed card.
//
// You already have IntersectionObserver wired for scroll — useTrackReel
// uses its own internal observer for view tracking so there's no conflict.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { Heart, MessageCircle, Bookmark, Share2, BarChart2 } from "lucide-react";
import { useTrackReel } from "../hooks/useTrackEvents";
import { useTrackEvent } from "../hooks/useInsights";

export default function ReelCard({ reel, currentUserId, isFollower = false }) {
  // Attach all tracking — just swap in these two refs
  const { videoRef, containerRef } = useTrackReel({
    reelId: reel._id,
    isFollower,
  });

  const { mutate: track } = useTrackEvent("reels");

  const handleLike = () => {
    // Your existing like logic here...
    track({ id: reel._id, event: "like" });
  };

  const handleSave = () => {
    // Your existing save logic here...
    track({ id: reel._id, event: "save" });
  };

  const handleShare = () => {
    // Your existing share logic here...
    track({ id: reel._id, event: "share" });
  };

  return (
    // containerRef goes on the outer wrapper — IntersectionObserver watches this
    <div ref={containerRef} className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black">
      <video
        ref={videoRef}  // ← videoRef goes on the <video> element
        src={reel.video.url}
        poster={reel.video.thumbnail}
        loop
        playsInline
        muted  // muted by default for autoplay — user can unmute
        className="h-full w-full object-cover"
      />

      {/* Action bar */}
      <div className="absolute bottom-4 right-3 flex flex-col items-center gap-4">
        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <Heart size={24} className="text-white drop-shadow" />
          <span className="text-[11px] font-medium text-white drop-shadow">
            {reel.interactions.likeCount}
          </span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <MessageCircle size={24} className="text-white drop-shadow" />
          <span className="text-[11px] font-medium text-white drop-shadow">
            {reel.interactions.commentCount}
          </span>
        </button>
        <button onClick={handleSave} className="flex flex-col items-center gap-1">
          <Bookmark size={24} className="text-white drop-shadow" />
          <span className="text-[11px] font-medium text-white drop-shadow">
            {reel.interactions.saveCount}
          </span>
        </button>
        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <Share2 size={24} className="text-white drop-shadow" />
        </button>

        {/* Link to per-reel insights — only shown to the author */}
        {reel.authorBusinessName === currentUserId && (
          <Link
            href={`/insights/reels/${reel._id}`}
            className="flex flex-col items-center gap-1"
          >
            <BarChart2 size={22} className="text-white drop-shadow" />
            <span className="text-[11px] font-medium text-white drop-shadow">
              Insights
            </span>
          </Link>
        )}
      </div>

      {/* Caption */}
      <div className="absolute bottom-4 left-3 right-16 text-white">
        <p className="text-[13px] font-medium drop-shadow">{reel.authorBusinessName}</p>
        <p className="mt-1 line-clamp-2 text-[12px] text-white/80 drop-shadow">
          {reel.caption}
        </p>
      </div>
    </div>
  );
}
