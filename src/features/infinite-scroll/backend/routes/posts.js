/**
 * routes/posts.js  (Node.js / Express)
 * -------------------------------------
 * Production-grade cursor-based pagination endpoint.
 *
 * WHY CURSOR PAGINATION (not offset/limit)?
 *   Offset: SELECT * LIMIT 10 OFFSET 50 — skips 50 rows every time.
 *   Problem: if new posts are inserted, page 2 might repeat items from page 1.
 *   Cursor: WHERE createdAt < :cursor ORDER BY createdAt DESC LIMIT 10
 *   Stable — new inserts don't affect existing cursor positions.
 *
 * RESPONSE SHAPE (what the frontend expects):
 * {
 *   data: [...],         — array of items for this page
 *   nextCursor: string | null,  — pass back as `cursor` on next request; null = no more pages
 *   hasMore: boolean     — convenience flag (false when nextCursor is null)
 * }
 */

import express from "express";
import { Post } from "../models/Post.js";
import { redis } from "../lib/redis.js"; // ioredis instance
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Default and maximum page sizes — never trust the client's `limit` blindly
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

/**
 * GET /posts
 * Query params:
 *   cursor  {string}  ISO timestamp of the last item from the previous page
 *   limit   {number}  Items per page (default 10, max 50)
 *   userId  {string}  Optional — filter to a specific user's posts
 */
router.get("/posts", authMiddleware, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const { cursor, userId } = req.query;

    // ── Cache: first page only (no cursor) ─────────────────────────────────
    // The first page is hit by every user every session — cache it hard.
    // Subsequent pages are user/cursor specific — not worth caching.
    const cacheKey = userId ? `posts:user:${userId}:first` : "posts:feed:first";

    if (!cursor) {
      const cached = await redis.get(cacheKey).catch(() => null); // never crash on Redis failure
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    // ── Build query ─────────────────────────────────────────────────────────
    const query = {};

    if (userId) query.userId = userId;

    // Cursor filter: fetch items older than the cursor timestamp
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    // Fetch limit + 1 to detect if there's a next page without a COUNT query
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })         // newest first
      .limit(limit + 1)                 // +1 to probe for next page
      .lean();                          // plain JS objects, faster than Mongoose docs

    // If we got limit+1 items, there's a next page — slice the probe off
    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, limit) : posts;

    // Next cursor = createdAt of the LAST item returned
    const nextCursor = hasMore ? data[data.length - 1].createdAt.toISOString() : null;

    const response = { data, nextCursor, hasMore };

    // ── Cache first page for 60 seconds ────────────────────────────────────
    if (!cursor) {
      await redis.setex(cacheKey, 60, JSON.stringify(response)).catch(() => null);
    }

    res.json(response);
  } catch (err) {
    console.error("[GET /posts]", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

export default router;

/**
 * DATABASE INDEX — run this once in your migration or seed script.
 * Without this index, every cursor query does a full collection scan.
 *
 * MongoDB:
 *   db.posts.createIndex({ createdAt: -1 })
 *   db.posts.createIndex({ userId: 1, createdAt: -1 })  // for user profile feeds
 *
 * PostgreSQL equivalent:
 *   CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
 *   CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
 *
 * INVALIDATE CACHE when a new post is created:
 *   await redis.del('posts:feed:first');
 *   await redis.del(`posts:user:${userId}:first`);
 */
