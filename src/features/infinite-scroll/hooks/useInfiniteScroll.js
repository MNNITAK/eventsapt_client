import { useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSentinel } from "./useSentinel";

/**
 * useInfiniteScroll
 * -----------------
 * The single hook you use at every infinite-scroll feature in the app.
 * Combines TanStack Query's `useInfiniteQuery` (data + cache layer) with
 * `useSentinel` (scroll detection layer).
 *
 * HOW IT WORKS:
 *   1. TanStack Query manages fetching, caching, background refresh, dedup.
 *   2. useSentinel watches a tiny div at the list bottom via IntersectionObserver.
 *   3. When the sentinel enters the viewport, `fetchNextPage()` is called.
 *   4. New items are appended; the sentinel moves down; the cycle continues.
 *
 * @param {Object}   config
 * @param {string|Array} config.queryKey   - TanStack Query cache key. Make it unique
 *                                           per feature, e.g. ['posts'] or ['users','search',q].
 * @param {Function} config.fetcher        - Async function called with `{ pageParam }`.
 *                                           Must return `{ data, nextCursor, hasMore }`.
 * @param {Function} [config.getNextPageParam] - Custom cursor extractor. Default reads
 *                                               `lastPage.nextCursor`.
 * @param {*}        [config.initialPageParam]  - Value passed as pageParam on first fetch.
 *                                               Default: null.
 * @param {Object}   [config.queryOptions] - Any extra options forwarded to useInfiniteQuery
 *                                           (staleTime, gcTime, enabled, etc.)
 * @param {Object}   [config.sentinelOptions]   - Options forwarded to useSentinel
 *                                               (rootMargin, threshold).
 *
 * @returns {{
 *   items: Array,               — Flat array of all loaded items across all pages
 *   sentinelRef: React.Ref,     — Attach to a <div /> at the bottom of your list
 *   isLoading: boolean,         — True only on the very first load (no data yet)
 *   isFetchingNextPage: boolean,— True when loading subsequent pages (show your spinner)
 *   isError: boolean,
 *   error: Error|null,
 *   hasNextPage: boolean,
 *   refetch: Function,          — Manually refetch from page 1 (pull-to-refresh, etc.)
 * }}
 *
 * @example — Basic usage
 * const { items, sentinelRef, isFetchingNextPage } = useInfiniteScroll({
 *   queryKey: ['posts'],
 *   fetcher: ({ pageParam }) => api.getPosts({ cursor: pageParam }),
 * });
 *
 * @example — Search results with dynamic key
 * const { items, sentinelRef } = useInfiniteScroll({
 *   queryKey: ['users', 'search', searchTerm],
 *   fetcher: ({ pageParam }) => api.searchUsers({ q: searchTerm, cursor: pageParam }),
 *   queryOptions: { enabled: searchTerm.length > 2 }, // only fetch when query is long enough
 * });
 */
export function useInfiniteScroll({
  queryKey,
  fetcher,
  getNextPageParam,
  initialPageParam = null,
  queryOptions = {},
  sentinelOptions = {},
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: fetcher,
    // Default cursor extractor — reads `nextCursor` from each page response.
    // Override via `getNextPageParam` if your API returns a different shape.
    getNextPageParam: getNextPageParam ?? ((lastPage) => lastPage.nextCursor ?? undefined),
    initialPageParam,
    // Spread any extra TanStack Query options (staleTime, gcTime, select, etc.)
    ...queryOptions,
  });

  // Flatten pages: TanStack Query returns { pages: [page1, page2, ...] }
  // Each page has a `data` array. We flatten into one clean array.
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  // Only trigger next fetch when:
  // - there actually is a next page
  // - we're not already fetching (prevents duplicate requests)
  const shouldObserve = hasNextPage && !isFetchingNextPage;

  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const { sentinelRef } = useSentinel(handleIntersect, {
    enabled: shouldObserve,
    ...sentinelOptions,
  });

  return {
    items,
    sentinelRef,
    isLoading,       // first-load skeleton state
    isFetchingNextPage, // subsequent pages spinner state
    isError,
    error,
    hasNextPage,
    refetch,
  };
}
