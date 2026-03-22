import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

/**
 * InfiniteScrollList
 * ------------------
 * A fully reusable UI wrapper that handles the infinite scroll lifecycle:
 * skeleton on first load, spinner between pages, error state, and end message.
 *
 * This component owns NO data-fetching logic — it delegates entirely to
 * `useInfiniteScroll`. You only supply:
 *   - what to fetch (queryKey + fetcher)
 *   - how to render each item (renderItem)
 *   - optionally: skeleton, error UI, end message, spinner
 *
 * REUSABILITY PATTERN:
 * Don't use this component directly in pages. Instead, create feature-specific
 * wrappers (PostFeed, UserList, NotificationList, etc.) that bake in their
 * own queryKey + fetcher + renderItem, then export those. This keeps pages clean.
 * See the examples at the bottom of this file.
 *
 * @param {Object}   props
 * @param {string|Array} props.queryKey          - Unique TanStack Query cache key.
 * @param {Function} props.fetcher               - `({ pageParam }) => Promise<{ data, nextCursor, hasMore }>`
 * @param {Function} props.renderItem            - `(item, index) => ReactNode`
 * @param {Function} [props.keyExtractor]        - `(item, index) => string` — unique key per item.
 *                                                 Default: uses `item.id` then falls back to index.
 * @param {number}   [props.skeletonCount=5]     - How many skeleton rows to show on first load.
 * @param {ReactNode}[props.SkeletonComponent]   - Your skeleton component. If omitted, a default
 *                                                 pulsing placeholder is shown.
 * @param {ReactNode}[props.EmptyComponent]      - Shown when fetch succeeds but returns 0 items.
 * @param {ReactNode}[props.ErrorComponent]      - Shown on fetch error. Receives `{ error, refetch }`.
 * @param {ReactNode}[props.LoadingSpinner]      - Shown between pages. Defaults to a simple spinner.
 * @param {ReactNode}[props.EndMessage]          - Shown when hasNextPage is false and items exist.
 * @param {string}   [props.className]           - CSS class on the list wrapper div.
 * @param {Object}   [props.queryOptions]        - Extra TanStack Query options.
 * @param {Object}   [props.sentinelOptions]     - Extra useSentinel options (rootMargin, threshold).
 */
export function InfiniteScrollList({
  queryKey,
  fetcher,
  renderItem,
  keyExtractor,
  skeletonCount = 5,
  SkeletonComponent,
  EmptyComponent,
  ErrorComponent,
  LoadingSpinner,
  EndMessage,
  className = "",
  queryOptions = {},
  sentinelOptions = {},
}) {
  const {
    items,
    sentinelRef,
    isLoading,
    isFetchingNextPage,
    isError,
    error,
    hasNextPage,
    refetch,
  } = useInfiniteScroll({ queryKey, fetcher, queryOptions, sentinelOptions });

  // ── First load: show skeletons ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={className}>
        {Array.from({ length: skeletonCount }).map((_, i) =>
          SkeletonComponent ? (
            <SkeletonComponent key={i} />
          ) : (
            <DefaultSkeleton key={i} />
          )
        )}
      </div>
    );
  }

  // ── Fetch error ─────────────────────────────────────────────────────────────
  if (isError) {
    if (ErrorComponent) return <ErrorComponent error={error} refetch={refetch} />;
    return <DefaultError error={error} refetch={refetch} />;
  }

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    if (EmptyComponent) return <EmptyComponent />;
    return <DefaultEmpty />;
  }

  // ── Key extraction: item.id → item._id → index ──────────────────────────────
  const getKey = keyExtractor ?? ((item, i) => item.id ?? item._id ?? String(i));

  return (
    <div className={className}>
      {/* Render each item */}
      {items.map((item, index) => (
        <div key={getKey(item, index)}>
          {renderItem(item, index)}
        </div>
      ))}

      {/*
        SENTINEL — invisible 1px div at the bottom.
        IntersectionObserver watches this; when it enters the viewport,
        the next page fetch is triggered automatically.
      */}
      <div ref={sentinelRef} style={{ height: 1 }} aria-hidden="true" />

      {/* Between-page spinner */}
      {isFetchingNextPage && (
        LoadingSpinner ? <LoadingSpinner /> : <DefaultSpinner />
      )}

      {/* End of feed message */}
      {!hasNextPage && items.length > 0 && (
        EndMessage ?? <DefaultEndMessage />
      )}
    </div>
  );
}

// ── Default UI fallbacks ──────────────────────────────────────────────────────
// These are intentionally minimal so they don't impose a design system.
// Override all of them via the component props above.

function DefaultSkeleton() {
  return (
    <div style={{
      height: 80,
      borderRadius: 8,
      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      marginBottom: 12,
    }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

function DefaultSpinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{
        width: 28, height: 28,
        border: "3px solid #e5e7eb",
        borderTopColor: "#111",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

function DefaultEmpty() {
  return <p style={{ textAlign: "center", color: "#999", padding: "2rem" }}>Nothing here yet.</p>;
}

function DefaultError({ error, refetch }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <p style={{ color: "#e53e3e" }}>{error?.message ?? "Something went wrong."}</p>
      <button onClick={refetch} style={{ marginTop: 8, cursor: "pointer" }}>Try again</button>
    </div>
  );
}

function DefaultEndMessage() {
  return <p style={{ textAlign: "center", color: "#bbb", padding: "2rem", fontSize: 13 }}>You're all caught up ✓</p>;
}
