"use client";

import { useState } from "react";
import {
  Eye, Heart, MessageCircle, Bookmark, Share2,
  Play, RefreshCw, TrendingUp, UserPlus, Clock,
} from "lucide-react";

import { useReelInsights } from "../hooks/useInsights";
import {
  StatCard, SectionHeading, PeriodSelector,
  AudienceBar, InsightsSkeleton, InsightsError,
  EngagementRateCard,
} from "./InsightPrimitives";
import { EngagementDonut, WatchTimeBar } from "./InsightCharts";
import {
  formatCount, formatSeconds, formatPct, parseDelta, computeAudiencePct,
} from "../utils/insightHelpers";

// ─── ReelInsightsPage ────────────────────────────────────────────────────────
// Props:
//   reelId   — string  — MongoDB _id of the reel
//   title    — string? — optional display label
//   onBack   — fn?     — optional back navigation handler

export default function ReelInsightsPage({ reelId, title, onBack }) {
  const [period, setPeriod] = useState("28d");

  const { data, isLoading, isError, error, refetch } = useReelInsights(
    reelId,
    period
  );

  const audience = computeAudiencePct(
    data?.audience?.followerViews,
    data?.audience?.nonFollowerViews
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            {onBack && (
              <button
                onClick={onBack}
                className="mb-2 flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ← Back
              </button>
            )}
            <h1 className="text-[22px] font-semibold text-zinc-900 dark:text-zinc-50">
              {title ?? "Reel insights"}
            </h1>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* States */}
        {isLoading && <InsightsSkeleton cards={9} />}
        {isError && (
          <InsightsError message={error?.message} onRetry={refetch} />
        )}

        {data && (
          <div className="space-y-8">

            {/* ── Overview ─────────────────────────────────────── */}
            <section>
              <SectionHeading>Overview</SectionHeading>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard
                  label="Accounts reached"
                  value={formatCount(data.summary?.reach)}
                  icon={Eye}
                  delta={parseDelta(data.deltas?.reach)}
                />
                <StatCard
                  label="Plays"
                  value={formatCount(data.summary?.plays)}
                  icon={Play}
                  delta={parseDelta(data.deltas?.plays)}
                />
                <StatCard
                  label="New follows"
                  value={formatCount(data.summary?.newFollows)}
                  icon={UserPlus}
                  sub="from this reel"
                  accent="#0f9b76"
                />
              </div>
            </section>

            {/* ── Engagement ────────────────────────────────────── */}
            <section>
              <SectionHeading>Engagement</SectionHeading>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard
                  label="Likes"
                  value={formatCount(data.summary?.likes)}
                  icon={Heart}
                />
                <StatCard
                  label="Comments"
                  value={formatCount(data.summary?.comments)}
                  icon={MessageCircle}
                />
                <StatCard
                  label="Saves"
                  value={formatCount(data.summary?.saves)}
                  icon={Bookmark}
                />
                <StatCard
                  label="Shares"
                  value={formatCount(data.summary?.shares)}
                  icon={Share2}
                />
              </div>
              <div className="mt-3">
                <EngagementDonut
                  likes={data.summary?.likes ?? 0}
                  comments={data.summary?.comments ?? 0}
                  saves={data.summary?.saves ?? 0}
                  shares={data.summary?.shares ?? 0}
                />
              </div>
              <div className="mt-3">
                <EngagementRateCard rate={data.engagement?.rate} />
              </div>
            </section>

            {/* ── Watch time (reel-specific) ────────────────────── */}
            <section>
              <SectionHeading>Watch time</SectionHeading>
              <WatchTimeBar
                averageSeconds={data.watchTime?.averageSeconds ?? 0}
                durationSeconds={data.meta?.duration ?? 1}
                completionRate={data.watchTime?.completionRate ?? 0}
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <StatCard
                  label="Replays"
                  value={formatCount(data.summary?.replays)}
                  icon={RefreshCw}
                  sub="users rewatched"
                />
                <StatCard
                  label="Total watch time"
                  value={formatSeconds(data.watchTime?.totalSeconds)}
                  icon={Clock}
                />
              </div>
            </section>

            {/* ── Audience ──────────────────────────────────────── */}
            <section>
              <SectionHeading>Audience</SectionHeading>
              <AudienceBar
                followerPct={audience.followerPct}
                nonFollowerPct={audience.nonFollowerPct}
                total={audience.total}
              />
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
