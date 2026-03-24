// "use client";

// import { useEffect, useRef, useCallback } from "react";

// // ─── useTrackReel ─────────────────────────────────────────────────────────────
// // Attach this to your <video> element inside the infinite scroll feed.
// // Handles: play, replay, view (via IntersectionObserver), watch_progress,
// //          completion, and fires each event exactly once per play session.
// //
// // Usage:
// //   const { insightVideoRef, insightContainerRef } = useTrackReel({ reelId, isFollower });
// //   <div ref={insightContainerRef}><video ref={insightVideoRef} ... /></div>

// const PROGRESS_INTERVAL_MS = 5_000;  // flush watch time every 5s
// const COMPLETION_THRESHOLD = 0.95;   // 95% = "completed"
// const VIEW_THRESHOLD_MS = 1_000;     // 1s in viewport = a view

// const post = (url, body) =>
//   fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//     keepalive: true,
//     credentials: "include",
//   }).catch(() => {});  // fire-and-forget — never throw

// export function useTrackReel({ reelId, isFollower = false }) {
//   const insightVideoRef = useRef(null);
//   const insightContainerRef = useRef(null);

//   // Mutable state refs — avoid re-renders for tracking data
//   const state = useRef({
//     hasTrackedView: false,
//     hasTrackedCompletion: false,
//     lastTrackedTime: 0,
//     sessionWatchedSeconds: 0,
//     playCount: 0,
//     viewTimer: null,
//     progressTimer: null,
//   });

//   // ── View tracking (IntersectionObserver) ──────────────────────────────────
//   useEffect(() => {
//     const container = insightContainerRef.current;
//     if (!container || !reelId) return;

//     const s = state.current;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           // Start timer — only count view after 1s in viewport
//           s.viewTimer = setTimeout(() => {
//             if (!s.hasTrackedView) {
//               s.hasTrackedView = true;
//               post(`/api/v1/reels/${reelId}/track`, {
//                 event: isFollower ? "view_follower" : "view_nonfollower",
//               });
//             }
//           }, VIEW_THRESHOLD_MS);
//         } else {
//           clearTimeout(s.viewTimer);
//         }
//       },
//       { threshold: 0.6 }  // 60% of reel visible = in view
//     );

//     observer.observe(container);
//     return () => {
//       observer.disconnect();
//       clearTimeout(s.viewTimer);
//     };
//   }, [reelId, isFollower]);

//   // ── Video event listeners ─────────────────────────────────────────────────
//   useEffect(() => {
//     const video = insightVideoRef.current;
//     if (!video || !reelId) return;

//     const s = state.current;

//     const onPlay = () => {
//       s.playCount += 1;
//       if (s.playCount === 1) {
//         // First play
//         post(`/api/v1/reels/${reelId}/track`, { event: "play" });
//       } else {
//         // Replay — currentTime reset to near 0 means user replayed
//         if (video.currentTime < 1) {
//           post(`/api/v1/reels/${reelId}/track`, { event: "replay" });
//         }
//       }

//       // Flush watch_progress every 5s
//       s.progressTimer = setInterval(() => {
//         const current = video.currentTime;
//         const delta = current - s.lastTrackedTime;
//         if (delta > 0) {
//           s.sessionWatchedSeconds += delta;
//           s.lastTrackedTime = current;
//           post(`/api/v1/reels/${reelId}/track`, {
//             event: "watch_progress",
//             meta: {
//               watchedSeconds: delta,
//               totalSessionSeconds: s.sessionWatchedSeconds,
//             },
//           });
//         }
//       }, PROGRESS_INTERVAL_MS);
//     };

//     const onPause = () => {
//       clearInterval(s.progressTimer);
//       // Flush remaining on pause
//       const delta = video.currentTime - s.lastTrackedTime;
//       if (delta > 0) {
//         s.sessionWatchedSeconds += delta;
//         s.lastTrackedTime = video.currentTime;
//         post(`/api/v1/reels/${reelId}/track`, {
//           event: "watch_progress",
//           meta: { watchedSeconds: delta, totalSessionSeconds: s.sessionWatchedSeconds },
//         });
//       }
//     };

//     const onTimeUpdate = () => {
//       if (
//         !s.hasTrackedCompletion &&
//         video.duration > 0 &&
//         video.currentTime / video.duration >= COMPLETION_THRESHOLD
//       ) {
//         s.hasTrackedCompletion = true;
//         post(`/api/v1/reels/${reelId}/track`, { event: "completion" });
//       }
//     };

//     const onEnded = () => {
//       clearInterval(s.progressTimer);
//     };

//     video.addEventListener("play", onPlay);
//     video.addEventListener("pause", onPause);
//     video.addEventListener("timeupdate", onTimeUpdate);
//     video.addEventListener("ended", onEnded);

//     return () => {
//       clearInterval(s.progressTimer);
//       video.removeEventListener("play", onPlay);
//       video.removeEventListener("pause", onPause);
//       video.removeEventListener("timeupdate", onTimeUpdate);
//       video.removeEventListener("ended", onEnded);
//     };
//   }, [reelId]);

//   return { insightVideoRef, insightContainerRef };
// }

// // ─── useTrackPost ─────────────────────────────────────────────────────────────
// // Simpler — posts only need view tracking via IntersectionObserver.
// //
// // Usage:
// //   const { insightContainerRef } = useTrackPost({ postId, isFollower });
// //   <div ref={insightContainerRef}>...</div>

// export function useTrackPost({ postId, isFollower = false }) {
//   const insightContainerRef = useRef(null);

//   useEffect(() => {
//     const container = insightContainerRef.current;
//     if (!container || !postId) return;

//     let hasTracked = false;
//     let timer = null;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           timer = setTimeout(() => {
//             if (!hasTracked) {
//               hasTracked = true;
//               post(`/api/v1/posts/${postId}/track`, {
//                 event: isFollower ? "view_follower" : "view_nonfollower",
//               });
//             }
//           }, VIEW_THRESHOLD_MS);
//         } else {
//           clearTimeout(timer);
//         }
//       },
//       { threshold: 0.5 }
//     );

//     observer.observe(container);
//     return () => {
//       observer.disconnect();
//       clearTimeout(timer);
//     };
//   }, [postId, isFollower]);

//   return { insightContainerRef };
// }




// below is saved locally first and the flushed into backend after certain time


"use client";

import { useEffect, useRef } from "react";
import {
  enqueueInsight,
  scheduleFlush,
  flushOnExit,
} from "../utils/insightsBuffer.js";

const PROGRESS_INTERVAL_MS = 5000;
const COMPLETION_THRESHOLD = 0.95;
const VIEW_THRESHOLD_MS = 1000;

export function useTrackReel({ reelId, isFollower = false }) {
  const insightVideoRef = useRef(null);
  const insightContainerRef = useRef(null);

  const state = useRef({
    hasTrackedView: false,
    hasTrackedCompletion: false,
    lastTrackedTime: 0,
    sessionWatchedSeconds: 0,
    playCount: 0,
    viewTimer: null,
    progressTimer: null,
  });

  useEffect(() => {
    const container = insightContainerRef.current;
    if (!container || !reelId) return;

    const s = state.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          s.viewTimer = setTimeout(() => {
            if (!s.hasTrackedView) {
              s.hasTrackedView = true;
              enqueueInsight({
                type: "reel",
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
      { threshold: 0.6 }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      clearTimeout(s.viewTimer);
    };
  }, [reelId, isFollower]);

  useEffect(() => {
    const video = insightVideoRef.current;
    if (!video || !reelId) return;

    const s = state.current;

    const onPlay = () => {
      s.playCount += 1;

      if (s.playCount === 1) {
        enqueueInsight({ type: "reel", reelId, event: "play" });
      } else if (video.currentTime < 1) {
        enqueueInsight({ type: "reel", reelId, event: "replay" });
      }

      scheduleFlush();

      s.progressTimer = setInterval(() => {
        const current = video.currentTime;
        const delta = current - s.lastTrackedTime;

        if (delta > 0) {
          s.sessionWatchedSeconds += delta;
          s.lastTrackedTime = current;

          enqueueInsight({
            type: "reel",
            reelId,
            event: "watch_progress",
            meta: {
              watchedSeconds: delta,
              totalSessionSeconds: s.sessionWatchedSeconds,
            },
          });

          scheduleFlush();
        }
      }, PROGRESS_INTERVAL_MS);
    };

    const onPause = () => {
      clearInterval(s.progressTimer);

      const delta = video.currentTime - s.lastTrackedTime;
      if (delta > 0) {
        s.sessionWatchedSeconds += delta;
        s.lastTrackedTime = video.currentTime;

        enqueueInsight({
          type: "reel",
          reelId,
          event: "watch_progress",
          meta: {
            watchedSeconds: delta,
            totalSessionSeconds: s.sessionWatchedSeconds,
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
        enqueueInsight({ type: "reel", reelId, event: "completion" });
        scheduleFlush();
      }
    };

    const onEnded = () => {
      clearInterval(s.progressTimer);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

    return () => {
      clearInterval(s.progressTimer);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, [reelId]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushOnExit();
      }
    };

    window.addEventListener("beforeunload", flushOnExit);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", flushOnExit);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return { insightVideoRef, insightContainerRef };
}

export function useTrackPost({ postId, isFollower = false }) {
  const insightContainerRef = useRef(null);

  useEffect(() => {
    const container = insightContainerRef.current;
    if (!container || !postId) return;

    let hasTracked = false;
    let timer = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            if (!hasTracked) {
              hasTracked = true;
              enqueueInsight({
                type: "post",
                postId,
                event: isFollower ? "view_follower" : "view_nonfollower",
              });
              scheduleFlush();
            }
          }, VIEW_THRESHOLD_MS);
        } else {
          clearTimeout(timer);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [postId, isFollower]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushOnExit();
      }
    };

    window.addEventListener("beforeunload", flushOnExit);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", flushOnExit);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return { insightContainerRef };
}