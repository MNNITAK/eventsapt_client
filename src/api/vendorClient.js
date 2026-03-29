import { axiosInstance } from '@/axios/axios';

// ============================================
// VENDOR PROFILE ENDPOINTS
// ============================================

/**
 * Search vendors with filters
 * @param {Object} params - Search parameters
 * @param {string} [params.category] - Service category filter
 * @param {string} [params.city] - City filter
 * @param {number} [params.minPrice] - Minimum price
 * @param {number} [params.maxPrice] - Maximum price
 * @param {number} [params.minRating] - Minimum rating (0-5)
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Results per page
 * @param {string} [params.sortBy] - Sort field
 * @returns {Promise<Object>} Vendors list with pagination
 */
export const searchVendors = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/vendors/profile/search', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get public vendor profile (for users viewing vendor details)
 * @param {string} vendorId - Vendor's MongoDB ID
 * @param {string} [token] - Optional user token for tracking
 * @returns {Promise<Object>} Public vendor profile
 */
export const getPublicVendorProfile = async (vendorId, token) => {
  try {
    const config = token ? {
      headers: { wedoraCredentials: token }
    } : {};
    const response = await axiosInstance.get(`/vendors/profile/public/${vendorId}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create vendor profile after registration (vendor only)
 * @param {string} token - JWT access token
 * @param {Object} businessInfo - Business information
 * @param {string} [businessInfo.tagline] - Business tagline (max 150 chars)
 * @param {string} [businessInfo.bio] - Business description (max 2000 chars)
 * @param {string} [businessInfo.logo] - Logo URL
 * @param {Array} [businessInfo.coverImages] - Cover image URLs
 * @param {number} [businessInfo.foundedYear] - Year founded
 * @param {string} [businessInfo.teamSize] - Team size: solo, 2-5, 6-10, 11-50, 50+
 * @param {Object} [businessInfo.socialLinks] - Social media links
 * @returns {Promise<Object>} Created vendor profile
 */
export const createVendorProfile = async (token, businessInfo) => {
  try {
    const response = await axiosInstance.post('/vendors/profile', 
      { businessInfo }, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get vendor's own profile (for vendor dashboard)
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Vendor profile
 */
export const getMyVendorProfile = async (token) => {
  try {
    const response = await axiosInstance.get('/vendors/profile/me', {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update business information
 * @param {string} token - JWT access token
 * @param {Object} businessInfo - Business information to update
 * @returns {Promise<Object>} Updated vendor profile
 */
export const updateBusinessInfo = async (token, businessInfo) => {
  try {
    const response = await axiosInstance.put('/vendors/profile/business-info', 
      businessInfo, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add a service area
 * @param {string} token - JWT access token
 * @param {Object} serviceArea - Service area details
 * @param {string} serviceArea.city - City name
 * @param {string} [serviceArea.state] - State name
 * @param {string} [serviceArea.country='India'] - Country
 * @param {boolean} [serviceArea.isPrimary] - Primary service area
 * @param {number} [serviceArea.travelCharge] - Travel charge for this area
 * @returns {Promise<Object>} Updated vendor profile
 */
export const addServiceArea = async (token, serviceArea) => {
  try {
    const response = await axiosInstance.post('/vendors/profile/service-areas', 
      serviceArea, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add a team member
 * @param {string} token - JWT access token
 * @param {Object} member - Team member details
 * @param {string} member.name - Member name
 * @param {string} [member.email] - Email address
 * @param {string} [member.phone] - Phone number
 * @param {string} member.role - owner, manager, sales, operations, content, viewer
 * @param {string} [member.photo] - Photo URL
 * @param {string} [member.designation] - Job title
 * @returns {Promise<Object>} Updated vendor profile
 */
export const addTeamMember = async (token, member) => {
  try {
    const response = await axiosInstance.post('/vendors/profile/team', 
      member, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update business hours
 * @param {string} token - JWT access token
 * @param {Object} businessHours - Business hours configuration
 * @param {string} businessHours.timezone - Timezone (e.g., Asia/Kolkata)
 * @param {Object} businessHours.schedule - Weekly schedule
 * @param {boolean} [businessHours.autoReplyWhenClosed] - Auto-reply when closed
 * @param {string} [businessHours.autoReplyMessage] - Auto-reply message
 * @returns {Promise<Object>} Updated vendor profile
 */
export const updateBusinessHours = async (token, businessHours) => {
  try {
    const response = await axiosInstance.put('/vendors/profile/business-hours', 
      businessHours, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update notification settings
 * @param {string} token - JWT access token
 * @param {Object} settings - Notification preferences
 * @returns {Promise<Object>} Updated vendor profile
 */
export const updateNotificationSettings = async (token, settings) => {
  try {
    const response = await axiosInstance.put('/vendors/profile/notification-settings', 
      settings, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle vendor's active/inactive status
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Updated vendor profile
 */
export const toggleVendorActiveStatus = async (token) => {
  try {
    const response = await axiosInstance.patch('/vendors/profile/toggle-active', 
      {}, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark onboarding as complete
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Updated vendor profile
 */
export const completeOnboarding = async (token) => {
  try {
    const response = await axiosInstance.post('/vendors/profile/complete-onboarding', 
      {}, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// SERVICE ENDPOINTS
// ============================================

/**
 * Add a new service offering
 * @param {string} token - JWT access token
 * @param {Object} service - Service details
 * @param {string} service.category - Service category
 * @param {Array} [service.subcategories] - Subcategories
 * @param {string} [service.description] - Service description (max 500 chars)
 * @param {boolean} [service.isActive=true] - Whether service is active
 * @returns {Promise<Object>} Updated vendor profile with new service
 */
export const addService = async (token, service) => {
  try {
    const response = await axiosInstance.post('/vendors/profile/services', 
      service, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing service
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {Object} service - Service details to update
 * @returns {Promise<Object>} Updated vendor profile
 */
export const updateService = async (token, serviceId, service) => {
  try {
    const response = await axiosInstance.put(`/vendors/profile/services/${serviceId}`, 
      service, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a service (and all its packages)
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @returns {Promise<Object>} Updated vendor profile
 */
export const deleteService = async (token, serviceId) => {
  try {
    const response = await axiosInstance.delete(`/vendors/profile/services/${serviceId}`, {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// PACKAGE ENDPOINTS
// ============================================

/**
 * Add a pricing package to a service
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {Object} packageData - Package details
 * @param {string} packageData.name - Package name
 * @param {number} packageData.price - Package price
 * @param {string} [packageData.priceType] - fixed, starting_from, per_day, per_hour
 * @param {string} [packageData.currency='INR'] - Currency
 * @param {string} [packageData.description] - Package description (max 1000 chars)
 * @param {string} [packageData.duration] - Duration description
 * @param {Array} [packageData.deliverables] - List of deliverables
 * @param {Array} [packageData.inclusions] - What's included
 * @param {Array} [packageData.exclusions] - What's not included
 * @param {Array} [packageData.addOns] - Available add-ons
 * @param {boolean} [packageData.isPopular] - Mark as popular package
 * @param {boolean} [packageData.isActive=true] - Is package active
 * @param {Date} [packageData.validUntil] - Package validity date
 * @returns {Promise<Object>} Updated vendor profile with new package
 */
export const addPackage = async (token, serviceId, packageData) => {
  try {
    const response = await axiosInstance.post(`/vendors/profile/services/${serviceId}/packages`, 
      packageData, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a pricing package
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {Object} packageData - Package details to update
 * @returns {Promise<Object>} Updated vendor profile
 */
export const updatePackage = async (token, serviceId, packageId, packageData) => {
  try {
    const response = await axiosInstance.put(`/vendors/profile/services/${serviceId}/packages/${packageId}`, 
      packageData, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a pricing package
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @returns {Promise<Object>} Updated vendor profile
 */
export const deletePackage = async (token, serviceId, packageId) => {
  try {
    const response = await axiosInstance.delete(`/vendors/profile/services/${serviceId}/packages/${packageId}`, {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// PACKAGE MEDIA ENDPOINTS
// ============================================

/**
 * Add media to package gallery
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {Object} media - Media details
 * @param {string} media.url - Media URL
 * @param {string} media.type - image or video
 * @param {string} [media.caption] - Media caption
 * @param {string} [media.alt] - Alt text for accessibility
 * @param {Object} [media.portfolioRef] - Reference to portfolio work
 * @returns {Promise<Object>} Updated vendor profile
 */
export const addPackageMedia = async (token, serviceId, packageId, media) => {
  try {
    const response = await axiosInstance.post(`/vendors/profile/services/${serviceId}/packages/${packageId}/media`, 
      media, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update package media details
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {string} mediaId - Media ID
 * @param {Object} media - Media details to update
 * @returns {Promise<Object>} Updated vendor profile
 */
export const updatePackageMedia = async (token, serviceId, packageId, mediaId, media) => {
  try {
    const response = await axiosInstance.put(`/vendors/profile/services/${serviceId}/packages/${packageId}/media/${mediaId}`, 
      media, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete package media
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {string} mediaId - Media ID
 * @returns {Promise<Object>} Updated vendor profile
 */
export const deletePackageMedia = async (token, serviceId, packageId, mediaId) => {
  try {
    const response = await axiosInstance.delete(`/vendors/profile/services/${serviceId}/packages/${packageId}/media/${mediaId}`, {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reorder package gallery items
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {Array} mediaOrder - Array of media IDs in desired order
 * @returns {Promise<Object>} Updated vendor profile
 */
export const reorderPackageGallery = async (token, serviceId, packageId, mediaOrder) => {
  try {
    const response = await axiosInstance.put(`/vendors/profile/services/${serviceId}/packages/${packageId}/media/reorder`, 
      { mediaOrder }, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Set package cover image
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {string} coverImage - Cover image URL
 * @returns {Promise<Object>} Updated vendor profile
 */
export const setPackageCoverImage = async (token, serviceId, packageId, coverImage) => {
  try {
    const response = await axiosInstance.put(`/vendors/profile/services/${serviceId}/packages/${packageId}/cover-image`, 
      { coverImage }, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add before/after media to package
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {Object} beforeAfter - Before/after details
 * @param {string} beforeAfter.before - Before image URL
 * @param {string} beforeAfter.after - After image URL
 * @param {string} [beforeAfter.caption] - Comparison caption
 * @returns {Promise<Object>} Updated vendor profile
 */
export const addPackageBeforeAfter = async (token, serviceId, packageId, beforeAfter) => {
  try {
    const response = await axiosInstance.post(`/vendors/profile/services/${serviceId}/packages/${packageId}/before-after`, 
      beforeAfter, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update before/after media
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {string} beforeAfterId - Before/after ID
 * @param {Object} beforeAfter - Before/after details to update
 * @returns {Promise<Object>} Updated vendor profile
 */
export const updatePackageBeforeAfter = async (token, serviceId, packageId, beforeAfterId, beforeAfter) => {
  try {
    const response = await axiosInstance.put(`/vendors/profile/services/${serviceId}/packages/${packageId}/before-after/${beforeAfterId}`, 
      beforeAfter, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete before/after media
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {string} beforeAfterId - Before/after ID
 * @returns {Promise<Object>} Updated vendor profile
 */
export const deletePackageBeforeAfter = async (token, serviceId, packageId, beforeAfterId) => {
  try {
    const response = await axiosInstance.delete(`/vendors/profile/services/${serviceId}/packages/${packageId}/before-after/${beforeAfterId}`, {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add video to package
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {Object} video - Video details
 * @param {string} video.url - Video URL
 * @param {string} [video.thumbnail] - Thumbnail image URL
 * @param {string} [video.title] - Video title
 * @param {number} [video.duration] - Duration in seconds
 * @param {string} [video.type] - showcase, testimonial, behind_scenes
 * @returns {Promise<Object>} Updated vendor profile
 */
export const addPackageVideo = async (token, serviceId, packageId, video) => {
  try {
    const response = await axiosInstance.post(`/vendors/profile/services/${serviceId}/packages/${packageId}/videos`, 
      video, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update package video
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {string} videoId - Video ID
 * @param {Object} video - Video details to update
 * @returns {Promise<Object>} Updated vendor profile
 */
export const updatePackageVideo = async (token, serviceId, packageId, videoId, video) => {
  try {
    const response = await axiosInstance.put(`/vendors/profile/services/${serviceId}/packages/${packageId}/videos/${videoId}`, 
      video, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete package video
 * @param {string} token - JWT access token
 * @param {string} serviceId - Service ID
 * @param {string} packageId - Package ID
 * @param {string} videoId - Video ID
 * @returns {Promise<Object>} Updated vendor profile
 */
export const deletePackageVideo = async (token, serviceId, packageId, videoId) => {
  try {
    const response = await axiosInstance.delete(`/vendors/profile/services/${serviceId}/packages/${packageId}/videos/${videoId}`, {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// LEAD/INQUIRY ENDPOINTS
// ============================================

/**
 * Create a lead (User submitting inquiry to vendor)
 * @param {string} token - JWT access token (User Token)
 * @param {Object} leadData - Lead details
 * @param {string} leadData.authVendorId - Vendor's ID
 * @param {Object} leadData.eventDetails - Event information
 * @param {Object} [leadData.budget] - Budget range
 * @param {Array} [leadData.serviceRequirements] - Required services
 * @param {string} [leadData.message] - Additional message
 * @returns {Promise<Object>} Created lead
 */
export const createLead = async (token, leadData) => {
  try {
    const response = await axiosInstance.post('/vendors/leads', 
      leadData, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's submitted inquiries
 * @param {string} token - JWT access token (User Token)
 * @returns {Promise<Object>} User inquiries
 */
export const getMyInquiries = async (token) => {
  try {
    const response = await axiosInstance.get('/vendors/leads/my-inquiries', {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all leads for vendor
 * @param {string} token - JWT access token (Vendor Token)
 * @param {Object} params - Query parameters
 * @param {string} [params.status] - Filter by status
 * @param {string} [params.priority] - Filter by priority
 * @param {string} [params.stage] - Filter by stage
 * @param {boolean} [params.isStarred] - Filter starred leads
 * @param {string} [params.tag] - Filter by tag
 * @param {string} [params.search] - Search term
 * @param {Date} [params.startDate] - Filter from date
 * @param {Date} [params.endDate] - Filter to date
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Results per page
 * @param {string} [params.sortBy] - Sort field
 * @param {string} [params.sortOrder] - asc or desc
 * @returns {Promise<Object>} Vendor leads
 */
export const getVendorLeads = async (token, params = {}) => {
  try {
    const response = await axiosInstance.get('/vendors/leads', {
      params,
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get lead statistics
 * @param {string} token - JWT access token (Vendor Token)
 * @returns {Promise<Object>} Lead statistics
 */
export const getLeadStats = async (token) => {
  try {
    const response = await axiosInstance.get('/vendors/leads/stats', {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get specific lead details
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} leadId - Lead ID
 * @returns {Promise<Object>} Lead details
 */
export const getLeadById = async (token, leadId) => {
  try {
    const response = await axiosInstance.get(`/vendors/leads/${leadId}`, {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update lead status
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} leadId - Lead ID
 * @param {string} status - new, contacted, qualified, proposal_sent, negotiating, won, lost, archived, spam
 * @param {string} [details] - Status update details
 * @returns {Promise<Object>} Updated lead
 */
export const updateLeadStatus = async (token, leadId, status, details) => {
  try {
    const response = await axiosInstance.patch(`/vendors/leads/${leadId}/status`, 
      { status, details }, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark lead as read
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} leadId - Lead ID
 * @returns {Promise<Object>} Updated lead
 */
export const markLeadAsRead = async (token, leadId) => {
  try {
    const response = await axiosInstance.patch(`/vendors/leads/${leadId}/read`, 
      {}, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle star on a lead
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} leadId - Lead ID
 * @returns {Promise<Object>} Updated lead
 */
export const toggleLeadStar = async (token, leadId) => {
  try {
    const response = await axiosInstance.patch(`/vendors/leads/${leadId}/star`, 
      {}, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add note to a lead
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} leadId - Lead ID
 * @param {string} content - Note content
 * @param {boolean} [isPrivate=true] - Is note private
 * @returns {Promise<Object>} Updated lead
 */
export const addLeadNote = async (token, leadId, content, isPrivate = true) => {
  try {
    const response = await axiosInstance.post(`/vendors/leads/${leadId}/notes`, 
      { content, isPrivate }, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Schedule follow-up for a lead
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} leadId - Lead ID
 * @param {Object} followUp - Follow-up details
 * @param {Date} followUp.scheduledAt - Follow-up date/time
 * @param {string} followUp.type - call, email, meeting
 * @param {string} [followUp.notes] - Follow-up notes
 * @param {Object} [followUp.reminder] - Reminder settings
 * @returns {Promise<Object>} Updated lead
 */
export const scheduleLeadFollowUp = async (token, leadId, followUp) => {
  try {
    const response = await axiosInstance.post(`/vendors/leads/${leadId}/follow-ups`, 
      followUp, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create quote for a lead
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} leadId - Lead ID
 * @param {Object} quote - Quote details
 * @returns {Promise<Object>} Created quote
 */
export const createLeadQuote = async (token, leadId, quote) => {
  try {
    const response = await axiosInstance.post(`/vendors/leads/${leadId}/quotes`, 
      quote, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark lead as won (convert to booking)
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} leadId - Lead ID
 * @param {Object} [details] - Additional details
 * @returns {Promise<Object>} Updated lead
 */
export const markLeadAsWon = async (token, leadId, details = {}) => {
  try {
    const response = await axiosInstance.post(`/vendors/leads/${leadId}/won`, 
      details, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark lead as lost
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} leadId - Lead ID
 * @param {Object} [details] - Reason and details
 * @returns {Promise<Object>} Updated lead
 */
export const markLeadAsLost = async (token, leadId, details = {}) => {
  try {
    const response = await axiosInstance.post(`/vendors/leads/${leadId}/lost`, 
      details, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// BOOKING ENDPOINTS
// ============================================

/**
 * Create a new booking
 * @param {string} token - JWT access token (Vendor Token)
 * @param {Object} bookingData - Booking details
 * @param {string} bookingData.authUserId - Client's user ID
 * @param {string} [bookingData.leadId] - Associated lead ID
 * @param {Array} bookingData.events - Event details
 * @param {Array} [bookingData.contacts] - Contact persons
 * @param {Object} bookingData.pricing - Pricing details
 * @returns {Promise<Object>} Created booking
 */
export const createBooking = async (token, bookingData) => {
  try {
    const response = await axiosInstance.post('/vendors/bookings', 
      bookingData, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all bookings for vendor
 * @param {string} token - JWT access token (Vendor Token)
 * @param {Object} params - Query parameters
 * @param {string} [params.status] - Filter by status
 * @param {string} [params.paymentStatus] - Filter by payment status
 * @param {Date} [params.startDate] - Filter from date
 * @param {Date} [params.endDate] - Filter to date
 * @param {string} [params.search] - Search term
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Results per page
 * @returns {Promise<Object>} Vendor bookings
 */
export const getVendorBookings = async (token, params = {}) => {
  try {
    const response = await axiosInstance.get('/vendors/bookings', {
      params,
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's bookings
 * @param {string} token - JWT access token (User Token)
 * @returns {Promise<Object>} User bookings
 */
export const getUserBookings = async (token) => {
  try {
    const response = await axiosInstance.get('/vendors/bookings/my-bookings', {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get upcoming bookings
 * @param {string} token - JWT access token (Vendor Token)
 * @param {number} [days=30] - Number of days ahead
 * @returns {Promise<Object>} Upcoming bookings
 */
export const getUpcomingBookings = async (token, days = 30) => {
  try {
    const response = await axiosInstance.get('/vendors/bookings/upcoming', {
      params: { days },
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get booking statistics
 * @param {string} token - JWT access token (Vendor Token)
 * @returns {Promise<Object>} Booking statistics
 */
export const getBookingStats = async (token) => {
  try {
    const response = await axiosInstance.get('/vendors/bookings/stats', {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Confirm a booking
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Confirmed booking
 */
export const confirmBooking = async (token, bookingId) => {
  try {
    const response = await axiosInstance.post(`/vendors/bookings/${bookingId}/confirm`, 
      {}, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Record a payment for booking
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} bookingId - Booking ID
 * @param {Object} payment - Payment details
 * @param {number} payment.amount - Payment amount
 * @param {string} payment.method - cash, bank_transfer, upi, cheque, card, wallet, emi, other
 * @param {string} [payment.transactionId] - Transaction ID
 * @param {string} [payment.referenceNumber] - Reference number
 * @param {Date} [payment.paymentDate] - Payment date
 * @param {string} [payment.notes] - Payment notes
 * @returns {Promise<Object>} Updated booking
 */
export const recordBookingPayment = async (token, bookingId, payment) => {
  try {
    const response = await axiosInstance.post(`/vendors/bookings/${bookingId}/payments`, 
      payment, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add task to booking
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} bookingId - Booking ID
 * @param {Object} task - Task details
 * @param {string} task.title - Task title
 * @param {string} [task.description] - Task description
 * @param {Date} [task.dueDate] - Due date
 * @param {string} [task.priority] - low, medium, high
 * @param {string} [task.assignedTo] - Team member ID
 * @returns {Promise<Object>} Updated booking
 */
export const addBookingTask = async (token, bookingId, task) => {
  try {
    const response = await axiosInstance.post(`/vendors/bookings/${bookingId}/tasks`, 
      task, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add deliverable to booking
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} bookingId - Booking ID
 * @param {Object} deliverable - Deliverable details
 * @returns {Promise<Object>} Updated booking
 */
export const addBookingDeliverable = async (token, bookingId, deliverable) => {
  try {
    const response = await axiosInstance.post(`/vendors/bookings/${bookingId}/deliverables`, 
      deliverable, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// CALENDAR/AVAILABILITY ENDPOINTS
// ============================================

/**
 * Get vendor's calendar
 * @param {string} token - JWT access token (Vendor Token)
 * @returns {Promise<Object>} Vendor calendar
 */
export const getVendorCalendar = async (token) => {
  try {
    const response = await axiosInstance.get('/vendors/calendar', {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get vendor's public availability
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Object>} Public availability
 */
export const getPublicAvailability = async (vendorId) => {
  try {
    const response = await axiosInstance.get(`/vendors/calendar/public/${vendorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update calendar settings
 * @param {string} token - JWT access token (Vendor Token)
 * @param {Object} settings - Calendar settings
 * @returns {Promise<Object>} Updated calendar
 */
export const updateCalendarSettings = async (token, settings) => {
  try {
    const response = await axiosInstance.put('/vendors/calendar/settings', 
      settings, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Set weekly availability schedule
 * @param {string} token - JWT access token (Vendor Token)
 * @param {Object} weeklySchedule - Weekly availability schedule
 * @returns {Promise<Object>} Updated calendar
 */
export const setWeeklyAvailability = async (token, weeklySchedule) => {
  try {
    const response = await axiosInstance.put('/vendors/calendar/weekly-availability', 
      { weeklySchedule }, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add date override
 * @param {string} token - JWT access token (Vendor Token)
 * @param {Object} override - Date override details
 * @param {string} override.date - Date (YYYY-MM-DD)
 * @param {boolean} override.isAvailable - Is available
 * @param {string} [override.reason] - Reason for override
 * @returns {Promise<Object>} Updated calendar
 */
export const addDateOverride = async (token, override) => {
  try {
    const response = await axiosInstance.post('/vendors/calendar/date-overrides', 
      override, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check availability for a date range
 * @param {string} token - JWT access token (Vendor Token)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} Availability data
 */
export const checkAvailability = async (token, startDate, endDate) => {
  try {
    const response = await axiosInstance.get('/vendors/calendar/availability', {
      params: { startDate, endDate },
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a temporary hold on a date
 * @param {string} token - JWT access token (Vendor Token)
 * @param {Object} hold - Hold details
 * @returns {Promise<Object>} Created hold
 */
export const createCalendarHold = async (token, hold) => {
  try {
    const response = await axiosInstance.post('/vendors/calendar/holds', 
      hold, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Block specific dates
 * @param {string} token - JWT access token (Vendor Token)
 * @param {Object} blockData - Block details
 * @returns {Promise<Object>} Updated calendar
 */
export const blockDates = async (token, blockData) => {
  try {
    const response = await axiosInstance.post('/vendors/calendar/block', 
      blockData, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// PORTFOLIO ENDPOINTS
// ============================================

/**
 * Get vendor's portfolio
 * @param {string} token - JWT access token (Vendor Token)
 * @returns {Promise<Object>} Vendor portfolio
 */
export const getVendorPortfolio = async (token) => {
  try {
    const response = await axiosInstance.get('/vendors/portfolio', {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get vendor's public portfolio
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Object>} Public portfolio
 */
export const getPublicPortfolio = async (vendorId) => {
  try {
    const response = await axiosInstance.get(`/vendors/portfolio/public/${vendorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a portfolio album
 * @param {string} token - JWT access token (Vendor Token)
 * @param {Object} album - Album details
 * @param {string} album.title - Album title
 * @param {string} [album.description] - Album description
 * @param {string} [album.category] - Category (wedding, engagement, etc.)
 * @param {Date} [album.eventDate] - Event date
 * @param {string} [album.venue] - Venue
 * @param {Array} [album.tags] - Album tags
 * @param {boolean} [album.isPublic=true] - Is public
 * @returns {Promise<Object>} Created album
 */
export const createPortfolioAlbum = async (token, album) => {
  try {
    const response = await axiosInstance.post('/vendors/portfolio/albums', 
      album, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add media to album
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} albumId - Album ID
 * @param {Object} media - Media details
 * @param {string} media.type - image or video
 * @param {string} media.url - Media URL
 * @param {string} [media.thumbnailUrl] - Thumbnail URL
 * @param {string} [media.caption] - Media caption
 * @param {Array} [media.tags] - Media tags
 * @returns {Promise<Object>} Updated album
 */
export const addPortfolioMedia = async (token, albumId, media) => {
  try {
    const response = await axiosInstance.post(`/vendors/portfolio/albums/${albumId}/media`, 
      media, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Add bulk media to album
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} albumId - Album ID
 * @param {Array} mediaItems - Array of media items
 * @returns {Promise<Object>} Updated album
 */
export const addBulkPortfolioMedia = async (token, albumId, mediaItems) => {
  try {
    const response = await axiosInstance.post(`/vendors/portfolio/albums/${albumId}/media/bulk`, 
      { mediaItems }, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate share link for album
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} albumId - Album ID
 * @returns {Promise<Object>} Share link details
 */
export const generateAlbumShareLink = async (token, albumId) => {
  try {
    const response = await axiosInstance.post(`/vendors/portfolio/albums/${albumId}/share`, 
      {}, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Access shared album via share token
 * @param {string} shareToken - Share token
 * @returns {Promise<Object>} Shared album
 */
export const accessSharedAlbum = async (shareToken) => {
  try {
    const response = await axiosInstance.get(`/vendors/portfolio/shared/${shareToken}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific album by ID
 * @param {string} token - JWT access token
 * @param {string} albumId - Album ID
 * @returns {Promise<Object>} Album details
 */
export const getPortfolioAlbum = async (token, albumId) => {
  try {
    const response = await axiosInstance.get(`/vendors/portfolio/albums/${albumId}`, {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a portfolio album
 * @param {string} token - JWT access token
 * @param {string} albumId - Album ID
 * @param {Object} updates - Album updates
 * @returns {Promise<Object>} Updated album
 */
export const updatePortfolioAlbum = async (token, albumId, updates) => {
  try {
    const response = await axiosInstance.put(`/vendors/portfolio/albums/${albumId}`,
      updates,
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a portfolio album
 * @param {string} token - JWT access token
 * @param {string} albumId - Album ID
 * @returns {Promise<Object>} Deletion result
 */
export const deletePortfolioAlbum = async (token, albumId) => {
  try {
    const response = await axiosInstance.delete(`/vendors/portfolio/albums/${albumId}`, {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update a media item in an album
 * @param {string} token - JWT access token
 * @param {string} albumId - Album ID
 * @param {string} mediaId - Media ID
 * @param {Object} updates - Media updates
 * @returns {Promise<Object>} Updated media
 */
export const updatePortfolioMedia = async (token, albumId, mediaId, updates) => {
  try {
    const response = await axiosInstance.put(
      `/vendors/portfolio/albums/${albumId}/media/${mediaId}`,
      updates,
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a media item from an album
 * @param {string} token - JWT access token
 * @param {string} albumId - Album ID
 * @param {string} mediaId - Media ID
 * @returns {Promise<Object>} Deletion result
 */
export const deletePortfolioMedia = async (token, albumId, mediaId) => {
  try {
    const response = await axiosInstance.delete(
      `/vendors/portfolio/albums/${albumId}/media/${mediaId}`,
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reorder media items in an album
 * @param {string} token - JWT access token
 * @param {string} albumId - Album ID
 * @param {Array} mediaOrder - Array of { mediaId, sortOrder }
 * @returns {Promise<Object>} Reordered media
 */
export const reorderPortfolioMedia = async (token, albumId, mediaOrder) => {
  try {
    const response = await axiosInstance.put(
      `/vendors/portfolio/albums/${albumId}/reorder`,
      { mediaOrder },
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reorder albums in the portfolio
 * @param {string} token - JWT access token
 * @param {Array} albumOrder - Array of album IDs in new order
 * @returns {Promise<Object>} Reordered albums
 */
export const reorderPortfolioAlbums = async (token, albumOrder) => {
  try {
    const response = await axiosInstance.put(
      '/vendors/portfolio/albums/reorder',
      { albumOrder },
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Set featured media on portfolio
 * @param {string} token - JWT access token
 * @param {Array} mediaIds - Array of media IDs to feature
 * @returns {Promise<Object>} Updated featured media
 */
export const setPortfolioFeaturedMedia = async (token, mediaIds) => {
  try {
    const response = await axiosInstance.put(
      '/vendors/portfolio/featured',
      { mediaIds },
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get portfolio stats
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Portfolio statistics
 */
export const getPortfolioStats = async (token) => {
  try {
    const response = await axiosInstance.get('/vendors/portfolio/stats', {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update portfolio settings
 * @param {string} token - JWT access token
 * @param {Object} settings - Portfolio settings
 * @returns {Promise<Object>} Updated settings
 */
export const updatePortfolioSettings = async (token, settings) => {
  try {
    const response = await axiosInstance.put(
      '/vendors/portfolio/settings',
      settings,
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Set album cover image
 * @param {string} token - JWT access token
 * @param {string} albumId - Album ID
 * @param {string} mediaId - Media ID to use as cover
 * @returns {Promise<Object>} Updated album
 */
export const setAlbumCover = async (token, albumId, mediaId) => {
  try {
    const response = await axiosInstance.put(
      `/vendors/portfolio/albums/${albumId}/cover`,
      { mediaId },
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Toggle album visibility
 * @param {string} token - JWT access token
 * @param {string} albumId - Album ID
 * @param {string} visibility - 'public', 'unlisted', or 'private'
 * @returns {Promise<Object>} Updated album
 */
export const toggleAlbumVisibility = async (token, albumId, visibility) => {
  try {
    const response = await axiosInstance.patch(
      `/vendors/portfolio/albums/${albumId}/visibility`,
      { visibility },
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Duplicate an album
 * @param {string} token - JWT access token
 * @param {string} albumId - Album ID to duplicate
 * @param {string} [newTitle] - Optional new title
 * @returns {Promise<Object>} Duplicated album
 */
export const duplicatePortfolioAlbum = async (token, albumId, newTitle) => {
  try {
    const response = await axiosInstance.post(
      `/vendors/portfolio/albums/${albumId}/duplicate`,
      { newTitle },
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Revoke share link for an album
 * @param {string} token - JWT access token
 * @param {string} albumId - Album ID
 * @returns {Promise<Object>} Revocation result
 */
export const revokeAlbumShareLink = async (token, albumId) => {
  try {
    const response = await axiosInstance.delete(
      `/vendors/portfolio/albums/${albumId}/share`,
      { headers: { wedoraCredentials: token } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// REVIEW ENDPOINTS
// ============================================

/**
 * Get public reviews for a vendor
 * @param {string} vendorId - Vendor ID
 * @param {Object} params - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Results per page
 * @param {string} [params.sortBy] - Sort field
 * @param {string} [params.sortOrder] - asc or desc
 * @returns {Promise<Object>} Public reviews
 */
export const getPublicReviews = async (vendorId, params = {}) => {
  try {
    const response = await axiosInstance.get(`/vendors/reviews/public/${vendorId}`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get public review statistics
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Object>} Review statistics
 */
export const getPublicReviewStats = async (vendorId) => {
  try {
    const response = await axiosInstance.get(`/vendors/reviews/public/${vendorId}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit a review for a vendor (User)
 * @param {string} token - JWT access token (User Token)
 * @param {string} vendorId - Vendor ID
 * @param {Object} review - Review details
 * @param {string} [review.bookingId] - Associated booking ID
 * @param {number} review.overallRating - Rating 1-5
 * @param {Object} [review.ratingBreakdown] - Detailed ratings
 * @param {string} [review.title] - Review title
 * @param {string} review.content - Review content
 * @param {Array} [review.pros] - List of positives
 * @param {Array} [review.cons] - List of negatives
 * @param {Object} [review.eventDetails] - Event information
 * @param {Array} [review.media] - Photos/videos
 * @param {boolean} [review.isAnonymous=false] - Post anonymously
 * @returns {Promise<Object>} Created review
 */
export const submitReview = async (token, vendorId, review) => {
  try {
    const response = await axiosInstance.post(`/vendors/reviews/vendor/${vendorId}`, 
      review, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if user can review a vendor
 * @param {string} token - JWT access token (User Token)
 * @param {string} vendorId - Vendor ID
 * @returns {Promise<Object>} Can review status
 */
export const checkCanReview = async (token, vendorId) => {
  try {
    const response = await axiosInstance.get(`/vendors/reviews/can-review/${vendorId}`, {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's submitted reviews
 * @param {string} token - JWT access token (User Token)
 * @returns {Promise<Object>} User reviews
 */
export const getMyReviews = async (token) => {
  try {
    const response = await axiosInstance.get('/vendors/reviews/my-reviews', {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all reviews for vendor dashboard
 * @param {string} token - JWT access token (Vendor Token)
 * @returns {Promise<Object>} Vendor reviews
 */
export const getVendorReviews = async (token) => {
  try {
    const response = await axiosInstance.get('/vendors/reviews', {
      headers: { wedoraCredentials: token }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Respond to a review (Vendor)
 * @param {string} token - JWT access token (Vendor Token)
 * @param {string} reviewId - Review ID
 * @param {string} response - Response text
 * @returns {Promise<Object>} Updated review
 */
export const respondToReview = async (token, reviewId, response) => {
  try {
    const res = await axiosInstance.post(`/vendors/reviews/${reviewId}/response`, 
      { response }, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark a review as helpful (User)
 * @param {string} token - JWT access token (User Token)
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} Updated review
 */
export const markReviewHelpful = async (token, reviewId) => {
  try {
    const response = await axiosInstance.post(`/vendors/reviews/${reviewId}/helpful`, 
      {}, 
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Flag a review for moderation
 * @param {string} token - JWT access token
 * @param {string} reviewId - Review ID
 * @param {string} reason - Flag reason
 * @returns {Promise<Object>} Flag confirmation
 */
export const flagReview = async (token, reviewId, reason) => {
  try {
    const response = await axiosInstance.post(`/vendors/reviews/${reviewId}/flag`,
      { reason },
      {
        headers: { wedoraCredentials: token }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReviewResponse = async (token, reviewId, response) => {
  try {
    const res = await axiosInstance.put(`/vendors/reviews/${reviewId}/response`, { response }, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const deleteReviewResponse = async (token, reviewId) => {
  try {
    const res = await axiosInstance.delete(`/vendors/reviews/${reviewId}/response`, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const removeReviewHelpful = async (token, reviewId) => {
  try {
    const res = await axiosInstance.delete(`/vendors/reviews/${reviewId}/helpful`, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

// ─── Lead Extended ────────────────────────────────────────────────────────────

export const updateLeadPriority = async (token, leadId, priority) => {
  try {
    const res = await axiosInstance.patch(`/vendors/leads/${leadId}/priority`, { priority }, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const archiveLead = async (token, leadId) => {
  try {
    const res = await axiosInstance.post(`/vendors/leads/${leadId}/archive`, {}, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const markLeadAsSpam = async (token, leadId) => {
  try {
    const res = await axiosInstance.post(`/vendors/leads/${leadId}/spam`, {}, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const addLeadTags = async (token, leadId, tags) => {
  try {
    const res = await axiosInstance.patch(`/vendors/leads/${leadId}/tags`, { tags }, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const completeLeadFollowUp = async (token, leadId, followUpId) => {
  try {
    const res = await axiosInstance.patch(`/vendors/leads/${leadId}/follow-ups/${followUpId}/complete`, {}, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

// ─── Booking Extended ─────────────────────────────────────────────────────────

export const getBookingById = async (token, bookingId) => {
  try {
    const res = await axiosInstance.get(`/vendors/bookings/${bookingId}`, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const updateBookingStatus = async (token, bookingId, status) => {
  try {
    const res = await axiosInstance.patch(`/vendors/bookings/${bookingId}/status`, { status }, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const addBookingNote = async (token, bookingId, content) => {
  try {
    const res = await axiosInstance.post(`/vendors/bookings/${bookingId}/notes`, { content }, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

// ─── Calendar Extended ────────────────────────────────────────────────────────

export const removeDateOverride = async (token, overrideId) => {
  try {
    const res = await axiosInstance.delete(`/vendors/calendar/date-overrides/${overrideId}`, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const unblockDate = async (token, date) => {
  try {
    const res = await axiosInstance.post(`/vendors/calendar/unblock`, { date }, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const releaseCalendarHold = async (token, holdId) => {
  try {
    const res = await axiosInstance.delete(`/vendors/calendar/holds/${holdId}`, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

// ─── Profile Extended ─────────────────────────────────────────────────────────

export const updatePrivacySettings = async (token, settings) => {
  try {
    const res = await axiosInstance.put('/vendors/profile/privacy-settings', settings, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const addQuickReply = async (token, reply) => {
  try {
    const res = await axiosInstance.post('/vendors/profile/quick-replies', reply, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const updateQuickReply = async (token, replyId, reply) => {
  try {
    const res = await axiosInstance.put(`/vendors/profile/quick-replies/${replyId}`, reply, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const deleteQuickReply = async (token, replyId) => {
  try {
    const res = await axiosInstance.delete(`/vendors/profile/quick-replies/${replyId}`, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const addVendorPeakSeason = async (token, season) => {
  try {
    const res = await axiosInstance.post('/vendors/profile/peak-seasons', season, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const updateVendorPeakSeason = async (token, seasonId, season) => {
  try {
    const res = await axiosInstance.put(`/vendors/profile/peak-seasons/${seasonId}`, season, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const deleteVendorPeakSeason = async (token, seasonId) => {
  try {
    const res = await axiosInstance.delete(`/vendors/profile/peak-seasons/${seasonId}`, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const updateTeamMember = async (token, memberId, updates) => {
  try {
    const res = await axiosInstance.put(`/vendors/profile/team/${memberId}`, updates, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const deleteTeamMember = async (token, memberId) => {
  try {
    const res = await axiosInstance.delete(`/vendors/profile/team/${memberId}`, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const updateServiceArea = async (token, areaId, updates) => {
  try {
    const res = await axiosInstance.put(`/vendors/profile/service-areas/${areaId}`, updates, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};

export const deleteServiceArea = async (token, areaId) => {
  try {
    const res = await axiosInstance.delete(`/vendors/profile/service-areas/${areaId}`, { headers: { wedoraCredentials: token } });
    return res.data;
  } catch (error) { throw error; }
};
