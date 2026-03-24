"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Fetchers ────────────────────────────────────────────────────────────────

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
};

// ─── Per-Reel Insights ───────────────────────────────────────────────────────

export const useReelInsights = (reelId, period = "28d") =>
  useQuery({
    queryKey: ["insights", "reel", reelId, period],
    queryFn: () => fetcher(`/api/v1/reels/${reelId}/insights?period=${period}`),
    staleTime: 5 * 60 * 1000,   // 5 min — matches backend Redis TTL
    gcTime: 10 * 60 * 1000,
    enabled: !!reelId,
    retry: 2,
  });

// ─── Per-Post Insights ───────────────────────────────────────────────────────

export const usePostInsights = (postId, period = "28d") =>
  useQuery({
    queryKey: ["insights", "post", postId, period],
    queryFn: () => fetcher(`/api/v1/posts/${postId}/insights?period=${period}`),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!postId,
    retry: 2,
  });

// ─── Overview Dashboard ──────────────────────────────────────────────────────

export const useInsightsOverview = (type = "reels", period = "28d") =>
  useQuery({
    queryKey: ["insights", "overview", type, period],
    queryFn: () =>
      fetcher(`/api/v1/insights/overview?type=${type}&period=${period}`),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

// ─── Top Performing Content ──────────────────────────────────────────────────

export const useTopContent = (type = "reels", period = "28d", limit = 5) =>
  useQuery({
    queryKey: ["insights", "top", type, period, limit],
    queryFn: () =>
      fetcher(
        `/api/v1/insights/top?type=${type}&period=${period}&limit=${limit}`
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

// ─── Event Tracking (fire-and-forget mutation) ───────────────────────────────

export const useTrackEvent = (contentType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, event, meta = {} }) =>
      fetch(`/api/v1/${contentType}/${id}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, meta }),
        keepalive: true,  // survives tab unload like sendBeacon
        credentials: "include",
      }).then((r) => r.json()),

    // Optimistic invalidation — refresh insights after any tracked event
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["insights", contentType.replace(/s$/, ""), id],
      });
    },
    // Silent failures — tracking must never break UX
    onError: () => {},
  });
};
