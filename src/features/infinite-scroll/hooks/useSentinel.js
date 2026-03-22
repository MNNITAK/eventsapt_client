import { useEffect, useRef } from "react";

/**
 * useSentinel
 * -----------
 * Attaches an IntersectionObserver to a sentinel (invisible div at the bottom
 * of a list). When the sentinel enters the viewport, `onIntersect` is called.
 *
 * This hook is intentionally dumb — it knows nothing about data fetching.
 * It only answers one question: "Has the user scrolled to the bottom?"
 *
 * @param {Function} onIntersect  - Callback fired when sentinel becomes visible.
 * @param {Object}   options
 * @param {boolean}  options.enabled      - Whether the observer should be active.
 *                                          Pass `false` when there's no more data.
 * @param {string}   options.rootMargin   - CSS margin around the root. Use to trigger
 *                                          loading *before* the sentinel is visible.
 *                                          Default: "300px" (loads 300px early).
 * @param {number}   options.threshold    - 0–1. How much of sentinel must be visible
 *                                          before firing. Default: 0 (any pixel).
 *
 * @returns {{ sentinelRef: React.RefObject }} - Attach this ref to your sentinel div.
 *
 * @example
 * const { sentinelRef } = useSentinel(fetchNextPage, { enabled: hasNextPage });
 * return <div ref={sentinelRef} />;
 */
export function useSentinel(onIntersect, { enabled = true, rootMargin = "300px", threshold = 0 } = {}) {
  const sentinelRef = useRef(null);
  // Stable ref to always hold the latest callback — avoids stale closure issues
  // without requiring onIntersect to be memoized by the caller.
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    // Don't observe if disabled (e.g. no more pages, or currently fetching)
    if (!enabled) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callbackRef.current();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);

    // Cleanup: always disconnect on unmount or when deps change
    return () => observer.disconnect();
  }, [enabled, rootMargin, threshold]);

  return { sentinelRef };
}
