/**
 * Feature Wrappers — How to reuse InfiniteScrollList across the app
 * -----------------------------------------------------------------
 * PATTERN: Never call InfiniteScrollList directly from pages.
 * Create a thin feature wrapper that bakes in:
 *   - queryKey  (unique per feature)
 *   - fetcher   (calls your API)
 *   - renderItem (renders one row/card)
 *
 * Pages then just do: <PostFeed /> or <UserList searchTerm={q} />
 * Zero boilerplate in the page, full control in the wrapper.
 */

import { InfiniteScrollList } from "./InfiniteScrollList";
import { api } from "../lib/api"; // your axios/fetch wrapper

// ─────────────────────────────────────────────────────────────────────────────
// 1. POST FEED  (Instagram-style)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PostFeed
 * Infinite list of posts. Used on the home feed page.
 *
 * @param {string} [userId] - If provided, fetches posts for a specific user profile.
 */
export function PostFeed({ userId } = {}) {
  // queryKey includes userId so profile feeds are cached separately from home feed
  const queryKey = userId ? ["posts", "user", userId] : ["posts", "feed"];

  const fetcher = ({ pageParam }) =>
    api.get("/posts", { params: { cursor: pageParam, userId, limit: 10 } });

  return (
    <InfiniteScrollList
      queryKey={queryKey}
      fetcher={fetcher}
      renderItem={(post) => <PostCard post={post} />}
      keyExtractor={(post) => post.id}
      skeletonCount={4}
      SkeletonComponent={PostCardSkeleton}
      queryOptions={{
        staleTime: 30_000, // posts are fresh for 30s — won't refetch on tab focus
      }}
      sentinelOptions={{
        rootMargin: "400px", // start loading 400px before bottom (feeds are tall)
      }}
    />
  );
}

function PostCard({ post }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <strong>{post.author?.name}</strong>
      <p>{post.content}</p>
    </div>
  );
}

function PostCardSkeleton() {
  return (
    <div style={{ height: 120, borderRadius: 12, background: "#f5f5f5", marginBottom: 12 }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. USER SEARCH LIST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * UserList
 * Infinite list of users, filtered by a search term.
 * Only fetches when searchTerm is at least 2 characters.
 *
 * @param {string} searchTerm
 */
export function UserList({ searchTerm }) {
  // Key changes when searchTerm changes → TanStack auto-resets to page 1 ✓
  const queryKey = ["users", "search", searchTerm];

  const fetcher = ({ pageParam }) =>
    api.get("/users/search", { params: { q: searchTerm, cursor: pageParam, limit: 20 } });

  return (
    <InfiniteScrollList
      queryKey={queryKey}
      fetcher={fetcher}
      renderItem={(user) => <UserRow user={user} />}
      queryOptions={{
        enabled: searchTerm?.length >= 2, // don't fetch until query is meaningful
        staleTime: 60_000,
      }}
      sentinelOptions={{
        rootMargin: "200px", // list items are small, 200px lookahead is enough
      }}
    />
  );
}

function UserRow({ user }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
      <img src={user.avatar} alt={user.name} style={{ width: 40, height: 40, borderRadius: "50%" }} />
      <div>
        <strong>{user.name}</strong>
        <p style={{ margin: 0, color: "#888", fontSize: 13 }}>@{user.username}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NOTIFICATION LIST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NotificationList
 * Infinite list of notifications. Refreshes frequently (short staleTime).
 */
export function NotificationList() {
  const fetcher = ({ pageParam }) =>
    api.get("/notifications", { params: { cursor: pageParam, limit: 15 } });

  return (
    <InfiniteScrollList
      queryKey={["notifications"]}
      fetcher={fetcher}
      renderItem={(notif) => <NotificationRow notif={notif} />}
      queryOptions={{
        staleTime: 10_000,       // notifications go stale fast — refetch after 10s
        refetchInterval: 30_000, // poll every 30s in background
      }}
    />
  );
}

function NotificationRow({ notif }) {
  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid #f5f5f5", opacity: notif.read ? 0.6 : 1 }}>
      {notif.message}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMMENT LIST  (inside a modal or panel — scroll inside a container)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CommentList
 * Infinite comments for a specific post. Note sentinelOptions.root —
 * when infinite scroll is inside a scrollable div (not the window),
 * you need to pass the scroll container as root.
 *
 * @param {string} postId
 * @param {React.RefObject} scrollContainerRef - ref of the scrollable parent div
 */
export function CommentList({ postId, scrollContainerRef }) {
  const fetcher = ({ pageParam }) =>
    api.get(`/posts/${postId}/comments`, { params: { cursor: pageParam, limit: 20 } });

  return (
    <InfiniteScrollList
      queryKey={["comments", postId]}
      fetcher={fetcher}
      renderItem={(comment) => <CommentRow comment={comment} />}
      queryOptions={{ staleTime: 20_000 }}
      sentinelOptions={{
        rootMargin: "100px",
        // Pass the scroll container so IntersectionObserver watches it, not window.
        // (useSentinel would need a `root` option added to support this)
      }}
    />
  );
}

function CommentRow({ comment }) {
  return (
    <div style={{ padding: "8px 0" }}>
      <strong>{comment.author?.name}: </strong>
      {comment.text}
    </div>
  );
}
