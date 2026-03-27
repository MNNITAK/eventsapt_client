"use client";

import { useState } from "react";
import {
  Eye, Heart, Bookmark, Share2, Play,
  UserPlus, TrendingUp, Film, Image,
} from "lucide-react";

import { useInsightsOverview, useTopContent } from "../hooks/useInsights";
import {
  StatCard, SectionHeading, PeriodSelector,
  InsightsSkeleton, InsightsError,
} from "./InsightPrimitives";
import { EngagementDonut } from "./InsightCharts";
import { formatCount, formatSeconds, formatPct } from "../utils/insightHelpers";

// ─── TopContentRow ───────────────────────────────────────────────────────────

function TopContentRow({ item, rank }) {
  const totalViews =
    (item.interactions?.views?.followers ?? 0) +
    (item.interactions?.views?.nonFollowers ?? 0);

  return (
    <div className="flex items-center gap-3 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100 dark:[&:not(:last-child)]:border-zinc-800">
      {/* Rank */}
      <span className="w-5 text-right text-[12px] font-semibold text-zinc-300 dark:text-zinc-600">
        {rank}
      </span>

      {/* Thumbnail */}
      {item.video?.thumbnail || item.media?.[0]?.thumbnail ? (
        <img
          src={item.video?.thumbnail ?? item.media[0].thumbnail}
          alt=""
          className="h-12 w-9 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-12 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Image size={14} className="text-zinc-400" />
        </div>
      )}

      {/* Caption */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-50">
          {item.caption || "No caption"}
        </p>
        <p className="text-[11px] text-zinc-400">
          {new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="text-right">
        <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-50">
          {formatCount(totalViews)}
        </p>
        <p className="text-[11px] text-zinc-400">views</p>
      </div>
      <div className="text-right">
        <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-50">
          {formatCount(item.interactions?.likeCount)}
        </p>
        <p className="text-[11px] text-zinc-400">likes</p>
      </div>
    </div>
  );
}

// ─── InsightsOverviewPage ─────────────────────────────────────────────────────
// Props:
//   defaultType — "reels" | "posts" — which content type to show first

export default function InsightsOverviewPage({ defaultType = "reels" }) {
  const [period, setPeriod] = useState("28d");
  const [type, setType] = useState(defaultType);

  const { data, isLoading, isError, error, refetch } = useInsightsOverview(
    type,
    period
  );

  const {
    data: topContent,
    isLoading: topLoading,
  } = useTopContent(type, period, 5);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-semibold text-zinc-900 dark:text-zinc-50">
              Insights
            </h1>
            <p className="mt-1 text-[13px] text-zinc-400">
              Performance overview for your content
            </p>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* Content type toggle */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setType("reels")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium transition-all ${
              type === "reels"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-700 dark:bg-zinc-900 dark:ring-zinc-700"
            }`}
          >
            <Film size={14} />
            Reels
          </button>
          <button
            onClick={() => setType("posts")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium transition-all ${
              type === "posts"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-700 dark:bg-zinc-900 dark:ring-zinc-700"
            }`}
          >
            <Image size={14} />
            Posts
          </button>
        </div>

        {isLoading && <InsightsSkeleton cards={8} />}
        {isError && (
          <InsightsError message={error?.message} onRetry={refetch} />
        )}

        {data && (
          <div className="space-y-8">

            {/* ── Reach & Growth ───────────────────────────────── */}
            <section>
              <SectionHeading>Reach & growth</SectionHeading>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard
                  label="Total reach"
                  value={formatCount(data.totalReach)}
                  icon={Eye}
                />
                <StatCard
                  label="New follows"
                  value={formatCount(data.totalFollows)}
                  icon={UserPlus}
                  accent="#0f9b76"
                />
                {type === "reels" && (
                  <StatCard
                    label="Total plays"
                    value={formatCount(data.totalPlays)}
                    icon={Play}
                  />
                )}
              </div>
            </section>

            {/* ── Engagement ───────────────────────────────────── */}
            <section>
              <SectionHeading>Engagement</SectionHeading>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard
                  label="Likes"
                  value={formatCount(data.totalLikes)}
                  icon={Heart}
                />
                <StatCard
                  label="Saves"
                  value={formatCount(data.totalSaves)}
                  icon={Bookmark}
                />
                {type === "reels" && (
                  <StatCard
                    label="Shares"
                    value={formatCount(data.totalShares)}
                    icon={Share2}
                  />
                )}
                <StatCard
                  label="Eng. rate"
                  value={`${
                    data.totalReach > 0
                      ? (
                          ((data.totalLikes +
                            data.totalSaves +
                            (data.totalShares ?? 0)) /
                            data.totalReach) *
                          100
                        ).toFixed(1)
                      : "0.0"
                  }%`}
                  icon={TrendingUp}
                />
              </div>

              <div className="mt-3">
                <EngagementDonut
                  likes={data.totalLikes ?? 0}
                  comments={0}
                  saves={data.totalSaves ?? 0}
                  shares={data.totalShares ?? 0}
                />
              </div>
            </section>

            {/* ── Watch time (reels only) ───────────────────────── */}
            {type === "reels" && (
              <section>
                <SectionHeading>Watch time</SectionHeading>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Avg watch time"
                    value={formatSeconds(data.avgWatchTime)}
                    sub="per reel play"
                  />
                  <StatCard
                    label="Avg completion"
                    value={formatPct(data.avgCompletion)}
                    sub="of reel duration"
                    accent={
                      (data.avgCompletion ?? 0) >= 60 ? "#0f9b76" : undefined
                    }
                  />
                </div>
              </section>
            )}

            {/* ── Top content ───────────────────────────────────── */}
            <section>
              <SectionHeading>Top performing {type}</SectionHeading>
              <div className="rounded-2xl bg-white px-4 py-1 ring-1 ring-black/[0.06] dark:bg-zinc-900 dark:ring-white/[0.08]">
                {topLoading ? (
                  <div className="py-6 text-center text-[12px] text-zinc-400">
                    Loading…
                  </div>
                ) : topContent?.length ? (
                  topContent.map((item, i) => (
                    <TopContentRow key={item._id} item={item} rank={i + 1} />
                  ))
                ) : (
                  <p className="py-6 text-center text-[12px] text-zinc-400">
                    No published {type} in this period
                  </p>
                )}
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
