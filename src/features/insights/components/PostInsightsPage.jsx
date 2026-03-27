"use client";

import { useState } from "react";
import {
  Eye, Heart, MessageCircle, Bookmark, UserPlus, Clock,
} from "lucide-react";

import { usePostInsights } from "../hooks/useInsights";
import {
  StatCard, SectionHeading, PeriodSelector,
  AudienceBar, InsightsSkeleton, InsightsError,
  EngagementRateCard,
} from "./InsightPrimitives";
import { EngagementDonut } from "./InsightCharts";
import {
  formatCount, parseDelta, computeAudiencePct, formatSeconds,
} from "../utils/insightHelpers_old";

// ─── PostInsightsPage ────────────────────────────────────────────────────────
// Props:
//   postId   — string  — MongoDB _id of the post
//   title    — string? — optional display label
//   onBack   — fn?     — optional back navigation handler

export default function PostInsightsPage({ postId, title, onBack }) {
  const [period, setPeriod] = useState("28d");

  const { data, isLoading, isError, error, refetch } = usePostInsights(
    postId,
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
              {title ?? "Post insights"}
            </h1>
          </div>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {isLoading && <InsightsSkeleton cards={7} />}
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
                  label="Avg watch time"
                  // Posts with video use averageWatchTime
                  value={
                    data.summary?.averageWatchTime
                      ? formatSeconds(data.summary.averageWatchTime)
                      : "—"
                  }
                  icon={Clock}
                  sub="for video posts"
                />
                <StatCard
                  label="New follows"
                  value={formatCount(data.summary?.newFollows)}
                  icon={UserPlus}
                  sub="from this post"
                  accent="#0f9b76"
                />
              </div>
            </section>

            {/* ── Engagement ────────────────────────────────────── */}
            <section>
              <SectionHeading>Engagement</SectionHeading>
              <div className="grid grid-cols-3 gap-3">
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
              </div>
              <div className="mt-3">
                {/* Posts don't have shares — pass 0 for shares */}
                <EngagementDonut
                  likes={data.summary?.likes ?? 0}
                  comments={data.summary?.comments ?? 0}
                  saves={data.summary?.saves ?? 0}
                  shares={0}
                />
              </div>
              <div className="mt-3">
                <EngagementRateCard rate={data.engagement?.rate} />
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
