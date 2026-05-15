/**
 * Post & Reel Service Client
 * Vendor-side CRUD for posts and reels via the API gateway.
 * Gateway routes: /api/v1/posts, /api/v1/reels
 */

import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:4000/api',
  timeout: 30000,
})

const h = (token) => ({ headers: { wedoraCredentials: token } })

// ─── Posts ────────────────────────────────────────────────────────────────────

export const getVendorPostsOwn = async (token, vendorId) => {
  const res = await axiosInstance.get(`/v1/posts/vendor/${vendorId}`, h(token))
  return res.data
}

export const getSinglePost = async (token, postId) => {
  const res = await axiosInstance.get(`/v1/posts/${postId}`, h(token))
  return res.data
}

export const createPost = async (token, data) => {
  const res = await axiosInstance.post('/v1/posts', data, h(token))
  return res.data
}

export const updatePost = async (token, postId, data) => {
  const res = await axiosInstance.put(`/v1/posts/${postId}`, data, h(token))
  return res.data
}

export const deletePost = async (token, postId) => {
  const res = await axiosInstance.delete(`/v1/posts/${postId}`, h(token))
  return res.data
}

export const updatePostStatus = async (token, postId, status) => {
  const res = await axiosInstance.patch(`/v1/posts/${postId}/status`, { status }, h(token))
  return res.data
}

// ─── Reels ────────────────────────────────────────────────────────────────────

export const getVendorReelsOwn = async (token, vendorId) => {
  const res = await axiosInstance.get(`/v1/reels/vendor/${vendorId}`, h(token))
  return res.data
}

export const getSingleReel = async (token, reelId) => {
  const res = await axiosInstance.get(`/v1/reels/${reelId}`, h(token))
  return res.data
}

export const createReel = async (token, data) => {
  const res = await axiosInstance.post('/v1/reels', data, h(token))
  return res.data
}

export const updateReel = async (token, reelId, data) => {
  const res = await axiosInstance.put(`/v1/reels/${reelId}`, data, h(token))
  return res.data
}

export const deleteReel = async (token, reelId) => {
  const res = await axiosInstance.delete(`/v1/reels/${reelId}`, h(token))
  return res.data
}

export const updateReelStatus = async (token, reelId, status) => {
  const res = await axiosInstance.patch(`/v1/reels/${reelId}/status`, { status }, h(token))
  return res.data
}
