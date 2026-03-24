// ─── Number formatters ───────────────────────────────────────────────────────

export const formatCount = (n = 0) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

export const formatSeconds = (s = 0) => {
  if (s >= 60) return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
  return `${Math.round(s)}s`;
};

export const formatPct = (n = 0) => `${Math.round(n)}%`;

export const formatRate = (n = 0) =>
  typeof n === "string" ? `${n}%` : `${parseFloat(n).toFixed(2)}%`;

// ─── Period helpers ──────────────────────────────────────────────────────────

export const PERIODS = [
  { label: "7 days", value: "7d" },
  { label: "28 days", value: "28d" },
  { label: "90 days", value: "90d" },
  { label: "All time", value: "all" },
];

// ─── Delta badge helper ──────────────────────────────────────────────────────
// Returns { label, positive } — used by StatCard delta prop

export const parseDelta = (delta) => {
  if (delta == null) return null;
  const num = typeof delta === "string" ? parseFloat(delta) : delta;
  return {
    label: `${num > 0 ? "+" : ""}${num.toFixed(1)}%`,
    positive: num >= 0,
  };
};

// ─── Audience breakdown ──────────────────────────────────────────────────────

export const computeAudiencePct = (followers = 0, nonFollowers = 0) => {
  const total = followers + nonFollowers;
  if (total === 0) return { followerPct: 0, nonFollowerPct: 0, total: 0 };
  return {
    followerPct: Math.round((followers / total) * 100),
    nonFollowerPct: Math.round((nonFollowers / total) * 100),
    total,
  };
};

// ─── Engagement rate ─────────────────────────────────────────────────────────

export const computeEngagementRate = (
  { likeCount = 0, commentCount = 0, saveCount = 0, shareCount = 0 } = {},
  accountsReached = 0
) => {
  if (accountsReached === 0) return "0.00";
  return (
    ((likeCount + commentCount + saveCount + shareCount) / accountsReached) *
    100
  ).toFixed(2);
};

// ─── Chart palette (fixed hex — CSS vars don't work inside Chart.js canvas) ──

export const CHART_COLORS = {
  primary: "#1a1a1a",
  muted: "#d1d1d1",
  teal: "#0f9b76",
  coral: "#e05a3a",
  purple: "#6b5ce7",
  amber: "#f59e0b",
  blue: "#3b82f6",
};

export const CHART_COLORS_DARK = {
  primary: "#f5f5f5",
  muted: "#3a3a3a",
  teal: "#2dd4bf",
  coral: "#fb7c5a",
  purple: "#a78bfa",
  amber: "#fbbf24",
  blue: "#60a5fa",
};

// ─── Insight event type constants ─────────────────────────────────────────────
// Single source of truth for every event name used across useTrackEvents,
// insightBuffer, and the backend /api/v1/insights/bulk handler.
// Never use raw strings — always import from here.

export const REEL_EVENTS = {
  // Playback
  PLAY:             "play",            // first play of this reel in this session
  REPLAY:           "replay",          // user replayed from near beginning
  WATCH_PROGRESS:   "watch_progress",  // periodic watch time delta (every 5s + on pause)
  COMPLETION:       "completion",      // watched >= 95% of duration

  // Visibility
  VIEW_FOLLOWER:    "view_follower",     // reel in viewport 1s+, viewer is a follower
  VIEW_NONFOLLOWER: "view_nonfollower",  // reel in viewport 1s+, viewer is not a follower

  // User actions — each maps to a field on reelInteractionSchema
  LIKE:             "like",
  UNLIKE:           "unlike",
  SAVE:             "save",
  UNSAVE:           "unsave",
  SHARE:            "share",
  COMMENT:          "comment",          // a comment was posted
  COMMENT_DELETE:   "comment_delete",   // a comment was deleted

  // Growth
  NEW_FOLLOW:       "new_follow",       // user followed the author from this reel
};

export const POST_EVENTS = {
  // Visibility
  VIEW_FOLLOWER:    "view_follower",
  VIEW_NONFOLLOWER: "view_nonfollower",
  REACH:            "reach",            // first unique view = accountsReached +1

  // Dwell (posts have no video — dwell replaces watch time)
  DWELL_TIME:       "dwell_time",       // seconds spent with post in viewport

  // User actions — each maps to a field on interactionSchema
  LIKE:             "like",
  UNLIKE:           "unlike",
  SAVE:             "save",
  UNSAVE:           "unsave",
  COMMENT:          "comment",
  COMMENT_DELETE:   "comment_delete",

  // Growth
  NEW_FOLLOW:       "new_follow",
};
