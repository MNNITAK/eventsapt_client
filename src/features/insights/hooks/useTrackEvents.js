"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  enqueueInsight,
  scheduleFlush,
  flushOnExit,
} from "../utils/insightsBuffer.js";
import { REEL_EVENTS, POST_EVENTS } from "../utils/insightHelpers.js";

// ─── Constants ───────────────────────────────────────────────────────────────

const PROGRESS_INTERVAL_MS = 5_000;  // flush watch_progress every 5s during playback
const COMPLETION_THRESHOLD = 0.95;   // 95% watched = "completed"
const VIEW_THRESHOLD_MS    = 1_000;  // must be in viewport ≥1s to count as a view
const REEL_IO_THRESHOLD    = 0.6;    // 60% of reel visible = in view
const POST_IO_THRESHOLD    = 0.5;    // 50% of post visible = in view

// ─── Internal safe enqueue ───────────────────────────────────────────────────
// Validates event name against the known schema field map before queueing.
// Prevents silent data corruption from typos or unknown events.

const enqueue = (item) => {
  const validSet = item.type === "reel" ? REEL_EVENTS : POST_EVENTS;
  if (!Object.values(validSet).includes(item.event)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[insights] Unknown event "${item.event}" for type "${item.type}" — skipped.`
      );
    }
    return;
  }
  enqueueInsight(item);
};

// ─── useTrackReel ─────────────────────────────────────────────────────────────
//
// Attaches to a <video> element inside the infinite scroll feed.
// Captures every measurable insight point for a reel and buffers them
// locally via insightsBuffer — no API call is made until scheduleFlush/flushOnExit.
//
// Tracked events:
//   play             — first play of this reel
//   replay           — video loops or user seeks back past currentTime < 1s
//   watch_progress   — incremental seconds watched (flushed every 5s + on pause)
//   completion       — ≥95% of reel watched
//   view_follower    — reel in viewport ≥1s, viewer is a follower
//   view_nonfollower — reel in viewport ≥1s, viewer is not a follower
//   like / unlike    — via trackLike(currentlyLiked)
//   save / unsave    — via trackSave(currentlySaved)
//   share            — via trackShare()
//   comment          — via trackComment()
//   new_follow       — via trackFollow()
//
// Usage:
//   const {
//     insightVideoRef,
//     insightContainerRef,
//     trackLike, trackSave, trackShare, trackComment, trackFollow,
//   } = useTrackReel({ reelId, isFollower });
//
//   <div ref={insightContainerRef}>
//     <video ref={insightVideoRef} ... />
//     <button onClick={() => { handleLike(); trackLike(isLiked); }}>♥</button>
//     <button onClick={() => { handleSave(); trackSave(isSaved); }}>🔖</button>
//     <button onClick={() => { handleShare(); trackShare(); }}>↗</button>
//   </div>

export function useTrackReel({ reelId, isFollower = false }) {
  const insightVideoRef     = useRef(null);
  const insightContainerRef = useRef(null);

  // All mutable tracking state — ref to avoid triggering re-renders
  const state = useRef({
    hasTrackedView:        false,
    hasTrackedCompletion:  false,
    lastTrackedTime:       0,
    sessionWatchedSeconds: 0,
    playCount:             0,
    viewTimer:             null,
    progressTimer:         null,
  });

  // ── 1. Viewport view tracking ─────────────────────────────────────────────
  useEffect(() => {
    const container = insightContainerRef.current;
    if (!container || !reelId) return;

    const s = state.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Debounce: only fire after reel stays in viewport for VIEW_THRESHOLD_MS
          s.viewTimer = setTimeout(() => {
            if (!s.hasTrackedView) {
              s.hasTrackedView = true;
              enqueue({
                type:  "reel",
                reelId,
                event: isFollower ? "view_follower" : "view_nonfollower",
              });
              scheduleFlush();
            }
          }, VIEW_THRESHOLD_MS);
        } else {
          clearTimeout(s.viewTimer);
        }
      },
      { threshold: REEL_IO_THRESHOLD }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      clearTimeout(s.viewTimer);
    };
  }, [reelId, isFollower]);

  // ── 2. Video playback events ──────────────────────────────────────────────
  useEffect(() => {
    const video = insightVideoRef.current;
    if (!video || !reelId) return;

    const s = state.current;

    const onPlay = () => {
      s.playCount += 1;

      if (s.playCount === 1) {
        // First play of this reel in this component mount
        enqueue({ type: "reel", reelId, event: "play" });
      } else if (video.currentTime < 1) {
        // currentTime reset near 0 = user replayed (loop or manual seek-back)
        enqueue({ type: "reel", reelId, event: "replay" });
      }

      scheduleFlush();

      // Periodically capture incremental watch progress while playing
      s.progressTimer = setInterval(() => {
        const current = video.currentTime;
        const delta   = current - s.lastTrackedTime;

        if (delta > 0) {
          s.sessionWatchedSeconds += delta;
          s.lastTrackedTime        = current;

          enqueue({
            type:  "reel",
            reelId,
            event: "watch_progress",
            meta: {
              watchedSeconds:      parseFloat(delta.toFixed(2)),
              totalSessionSeconds: parseFloat(s.sessionWatchedSeconds.toFixed(2)),
            },
          });

          scheduleFlush();
        }
      }, PROGRESS_INTERVAL_MS);
    };

    const onPause = () => {
      clearInterval(s.progressTimer);

      // Capture the partial segment the interval didn't reach yet
      const delta = video.currentTime - s.lastTrackedTime;
      if (delta > 0) {
        s.sessionWatchedSeconds += delta;
        s.lastTrackedTime        = video.currentTime;

        enqueue({
          type:  "reel",
          reelId,
          event: "watch_progress",
          meta: {
            watchedSeconds:      parseFloat(delta.toFixed(2)),
            totalSessionSeconds: parseFloat(s.sessionWatchedSeconds.toFixed(2)),
          },
        });

        scheduleFlush();
      }
    };

    const onTimeUpdate = () => {
      if (
        !s.hasTrackedCompletion &&
        video.duration > 0 &&
        video.currentTime / video.duration >= COMPLETION_THRESHOLD
      ) {
        s.hasTrackedCompletion = true;
        enqueue({ type: "reel", reelId, event: "completion" });
        scheduleFlush();
      }
    };

    const onEnded = () => {
      clearInterval(s.progressTimer);
    };

    video.addEventListener("play",       onPlay);
    video.addEventListener("pause",      onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended",      onEnded);

    return () => {
      clearInterval(s.progressTimer);
      video.removeEventListener("play",       onPlay);
      video.removeEventListener("pause",      onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended",      onEnded);
    };
  }, [reelId]);

  // ── 3. Tab/page exit — flush whatever is still in the buffer ──────────────
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushOnExit();
    };

    window.addEventListener("beforeunload",       flushOnExit);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload",       flushOnExit);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // ── 4. Interaction trackers ───────────────────────────────────────────────
  // Call these directly from your existing like/save/share handlers.
  // Pass the CURRENT state (before toggle) so we derive the correct event.

  /** trackLike(currentlyLiked: boolean) */
  const trackLike = useCallback(
    (currentlyLiked) => {
      enqueue({ type: "reel", reelId, event: currentlyLiked ? "unlike" : "like" });
      scheduleFlush();
    },
    [reelId]
  );

  /** trackSave(currentlySaved: boolean) */
  const trackSave = useCallback(
    (currentlySaved) => {
      enqueue({ type: "reel", reelId, event: currentlySaved ? "unsave" : "save" });
      scheduleFlush();
    },
    [reelId]
  );

  /** trackShare() — shares are always additive, no un-share */
  const trackShare = useCallback(() => {
    enqueue({ type: "reel", reelId, event: "share" });
    scheduleFlush();
  }, [reelId]);

  /** trackComment() — call on successful comment submission */
  const trackComment = useCallback(() => {
    enqueue({ type: "reel", reelId, event: "comment" });
    scheduleFlush();
  }, [reelId]);

  /** trackFollow() — call when user follows from within the reel context */
  const trackFollow = useCallback(() => {
    enqueue({ type: "reel", reelId, event: "new_follow" });
    scheduleFlush();
  }, [reelId]);

  return {
    insightVideoRef,
    insightContainerRef,
    trackLike,
    trackSave,
    trackShare,
    trackComment,
    trackFollow,
  };
}

// ─── useTrackPost ─────────────────────────────────────────────────────────────
//
// Tracks every measurable insight point for a post (image / carousel).
// No video — dwell time replaces watch time.
//
// Tracked events:
//   view_follower    — post in viewport ≥1s, viewer is a follower
//   view_nonfollower — post in viewport ≥1s, viewer is not a follower
//   reach            — first valid view (accountsReached)
//   dwell_time       — seconds post was visible (flushed on scroll-out + on exit)
//   like / unlike    — via trackLike(currentlyLiked)
//   save / unsave    — via trackSave(currentlySaved)
//   comment          — via trackComment()
//   new_follow       — via trackFollow()
//
// Usage:
//   const {
//     insightContainerRef,
//     trackLike, trackSave, trackComment, trackFollow,
//   } = useTrackPost({ postId, isFollower });
//
//   <div ref={insightContainerRef}>
//     {/* post content */}
//     <button onClick={() => { handleLike(); trackLike(isLiked); }}>♥</button>
//   </div>

export function useTrackPost({ postId, isFollower = false }) {
  const insightContainerRef = useRef(null);

  const state = useRef({
    hasTrackedView: false,
    viewTimer:      null,
    dwellStart:     null,
    totalDwellTime: 0,
  });

  // ── 1. Viewport view + dwell time ─────────────────────────────────────────
  useEffect(() => {
    const container = insightContainerRef.current;
    if (!container || !postId) return;

    const s = state.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // ── Entering viewport ────────────────────────────────────────────
          s.viewTimer = setTimeout(() => {
            if (!s.hasTrackedView) {
              s.hasTrackedView = true;

              // view_follower / view_nonfollower updates views.* field
              enqueue({
                type:  "post",
                postId,
                event: isFollower ? "view_follower" : "view_nonfollower",
              });
              // reach updates accountsReached (unique impressions)
              enqueue({ type: "post", postId, event: "reach" });

              scheduleFlush();
            }
          }, VIEW_THRESHOLD_MS);

          // Dwell clock starts immediately on intersection
          s.dwellStart = Date.now();

        } else {
          // ── Leaving viewport ─────────────────────────────────────────────
          clearTimeout(s.viewTimer);

          if (s.dwellStart !== null) {
            const delta = (Date.now() - s.dwellStart) / 1000;
            s.totalDwellTime += delta;

            enqueue({
              type:  "post",
              postId,
              event: "dwell_time",
              meta: {
                seconds: parseFloat(delta.toFixed(2)),
                total:   parseFloat(s.totalDwellTime.toFixed(2)),
              },
            });

            scheduleFlush();
            s.dwellStart = null;
          }
        }
      },
      { threshold: POST_IO_THRESHOLD }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      clearTimeout(s.viewTimer);
    };
  }, [postId, isFollower]);

  // ── 2. Flush remaining dwell time on tab hide / page unload ───────────────
  useEffect(() => {
    const s = state.current;

    const handleExit = () => {
      if (s.dwellStart !== null) {
        const delta = (Date.now() - s.dwellStart) / 1000;
        s.totalDwellTime += delta;

        enqueue({
          type:  "post",
          postId,
          event: "dwell_time",
          meta: {
            seconds: parseFloat(delta.toFixed(2)),
            total:   parseFloat(s.totalDwellTime.toFixed(2)),
          },
        });

        s.dwellStart = null;
      }

      flushOnExit();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") handleExit();
    };

    window.addEventListener("beforeunload",       handleExit);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload",       handleExit);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [postId]);

  // ── 3. Interaction trackers ───────────────────────────────────────────────

  const trackLike = useCallback(
    (currentlyLiked) => {
      enqueue({ type: "post", postId, event: currentlyLiked ? "unlike" : "like" });
      scheduleFlush();
    },
    [postId]
  );

  const trackSave = useCallback(
    (currentlySaved) => {
      enqueue({ type: "post", postId, event: currentlySaved ? "unsave" : "save" });
      scheduleFlush();
    },
    [postId]
  );

  const trackComment = useCallback(() => {
    enqueue({ type: "post", postId, event: "comment" });
    scheduleFlush();
  }, [postId]);

  const trackFollow = useCallback(() => {
    enqueue({ type: "post", postId, event: "new_follow" });
    scheduleFlush();
  }, [postId]);

  return {
    insightContainerRef,
    trackLike,
    trackSave,
    trackComment,
    trackFollow,
  };
}
