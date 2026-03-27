// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useReelInsights, usePostInsights, useInsightsOverview, useTopContent, useTrackEvent } from "./hooks/useInsights";
export { useTrackReel, useTrackPost } from "./hooks/useTrackEvents";

// ─── Pages ───────────────────────────────────────────────────────────────────
export { default as ReelInsightsPage } from "./components/ReelInsightsPage";
export { default as PostInsightsPage } from "./components/PostInsightsPage";
export { default as InsightsOverviewPage } from "./components/InsightsOverviewPage";

// ─── Primitives ───────────────────────────────────────────────────────────────
export {
  StatCard,
  SectionHeading,
  PeriodSelector,
  AudienceBar,
  InsightsSkeleton,
  InsightsError,
  EngagementRateCard,
} from "./components/InsightPrimitives";

// ─── Charts ───────────────────────────────────────────────────────────────────
export { EngagementDonut, WatchTimeBar } from "./components/InsightCharts";

// ─── Utils ────────────────────────────────────────────────────────────────────
export {
  formatCount,
  formatSeconds,
  formatPct,
  formatRate,
  parseDelta,
  computeAudiencePct,
  computeEngagementRate,
  PERIODS,
  CHART_COLORS,
} from "./utils/insightHelpers";
