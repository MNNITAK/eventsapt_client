/**
 * Media Service Client
 * Handles file uploads to the media microservice via the API gateway
 * 
 * Flow: Upload file → Media Service (S3) → Get URL → Use URL in Vendor Service
 * 
 * Gateway: POST /api/media/upload → http://localhost:3006/api/v1/media/upload
 */

import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 60000, // 60s for uploads
})

/**
 * Upload a single file to the media service
 * @param {string} token - JWT access token
 * @param {File} file - File object from input[type=file]
 * @param {Object} options - Upload options
 * @param {string} [options.context] - Upload context (e.g., 'package_media', 'cover_image')
 * @param {string} [options.folder] - Storage folder (e.g., 'packages', 'portfolio')
 * @param {Array<string>} [options.tags] - Tags for the media
 * @returns {Promise<Object>} { mediaId, url, thumbnailUrl, mediaType, ... }
 */

export const uploadMedia = async (token, file, options = {}) => {
  const formData = new FormData()
  formData.append('file', file)
  
  if (options.context) formData.append('context', options.context)
  if (options.folder) formData.append('folder', options.folder)
  if (options.tags) formData.append('tags', JSON.stringify(options.tags))

  const response = await axiosInstance.post('/media/upload', formData, {
    headers: {
      wedoraCredentials: token,
      'Content-Type': 'multipart/form-data',
    },
  })

  // ApiResponse shape: { statusCode, data, message, success }
  // data = { mediaId, url, thumbnailUrl, variants, mediaType, ... }
  return response.data
}

/**
 * Upload multiple files to the media service
 * @param {string} token - JWT access token
 * @param {FileList|Array<File>} files - Files to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} { uploaded: [...], errors: [...] }
 */
export const uploadMultipleMedia = async (token, files, options = {}) => {
  const formData = new FormData()
  
  for (const file of files) {
    formData.append('files', file)
  }
  
  if (options.context) formData.append('context', options.context)
  if (options.folder) formData.append('folder', options.folder)
  if (options.tags) formData.append('tags', JSON.stringify(options.tags))

  const response = await axiosInstance.post('/media/upload/multiple', formData, {
    headers: {
      wedoraCredentials: token,
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
