import { axiosInstance } from "@/axios/axios"
import { getCookies } from "@/app/action"

const authHeader = async () => {
    const token = await getCookies()
    return token ? { wedoraCredentials: token } : {}
}

/**
 * Resolve a vendorId from a business name via the search endpoint.
 * Returns the vendorId string, or null if not found.
 */
export const resolveVendorIdByName = async (businessName) => {
    const { data } = await axiosInstance.get(
        `/vendors/profile/search?name=${encodeURIComponent(businessName)}&limit=1`
    )
    const vendors = data?.data?.vendors || []
    return vendors[0]?._id ? String(vendors[0]._id) : null
}

export const fetchPublicVendorProfile = async (vendorId) => {
    const headers = await authHeader()
    const { data } = await axiosInstance.get(`/vendors/profile/public/${vendorId}`, { headers })
    return data?.data
}

export const fetchVendorPosts = async (vendorId) => {
    const { data } = await axiosInstance.get(`/posts/vendor/${vendorId}`)
    return data?.data?.posts || data?.data || []
}

export const fetchVendorReels = async (vendorId) => {
    const { data } = await axiosInstance.get(`/reels/vendor/${vendorId}`)
    return data?.data?.reels || data?.data || []
}

export const fetchVendorPortfolio = async (vendorId) => {
    const headers = await authHeader()
    const { data } = await axiosInstance.get(`/vendors/portfolio/public/${vendorId}`, { headers })
    return data?.data
}

export const fetchVendorReviews = async (vendorId) => {
    const headers = await authHeader()
    const { data } = await axiosInstance.get(`/vendors/reviews/public/${vendorId}`, { headers })
    return data?.data
}

export const fetchVendorReviewStats = async (vendorId) => {
    const { data } = await axiosInstance.get(`/vendors/reviews/public/${vendorId}/stats`)
    return data?.data
}
