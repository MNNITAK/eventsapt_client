import {axiosInstance} from '@/axios/axios';

// ============================================
// USER ENDPOINTS
// ============================================

/**
 * Creates a new user account
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Unique username (3-20 chars, lowercase)
 * @param {string} userData.email - User email address
 * @param {string} userData.password - User password (min 8 characters)
 * @param {string} userData.phoneNumber - Phone number (10-12 digits)
 * @param {string} [userData.usertype] - Type of user (bride, groom, planner, family, user)
 * @param {string} [userData.weddingDate] - Wedding date (ISO 8601 format)
 * @returns {Promise<Object>} User data with tokens
 */
export const signupUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/user/signup', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phoneNumber: userData.phoneNumber,
      ...(userData.usertype && { usertype: userData.usertype }),
      ...(userData.weddingDate && { weddingDate: userData.weddingDate })
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Authenticates a user and returns tokens
 * @param {string} userid - Username, email, or phone number
 * @param {string} password - User password
 * @returns {Promise<Object>} User data with tokens
 */
export const loginUser = async (userid, password) => {
  try {
    const response = await axiosInstance.post('/auth/user/login', {
      userid,
      password
    });
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logs out the current user by invalidating the refresh token
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Logout confirmation
 */
export const logoutUser = async (token) => {
  try {
    const response = await axiosInstance.post('/auth/user/logout', {}, {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Checks if a username is available for registration
 * @param {string} username - Username to check
 * @returns {Promise<Object>} Availability status
 */
export const checkUsernameAvailability = async (username) => {
  try {
    const response = await axiosInstance.post('/auth/user/usernameAvailability', {
      username
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Generates new access and refresh tokens
 * @param {string} refreshToken - Valid refresh token
 * @returns {Promise<Object>} New tokens and user data
 */
export const refreshUserToken = async (refreshToken) => {
  try {
    const response = await axiosInstance.post('/auth/user/generateToken', {
      refreshToken
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verifies if the current token is valid
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Authentication status
 */
export const verifyUserAuth = async (token) => {
  try {
    const response = await axiosInstance.get('/auth/user/pseudo', {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates user's location and preferences
 * @param {string} token - JWT access token
 * @param {Object} preferences - User preferences data
 * @param {string} preferences.email - User's email address
 * @param {string} [preferences.locationCity] - User's city
 * @param {Array} [preferences.userPreference] - Array of preference objects
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserPreferences = async (token, preferences) => {
  try {
    const response = await axiosInstance.post('/auth/user/updatePreferences', {
      email: preferences.email,
      ...(preferences.locationCity && { locationCity: preferences.locationCity }),
      ...(preferences.userPreference && { userPreference: preferences.userPreference })
    }, {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Likes or unlikes a vendor
 * @param {string} token - JWT access token
 * @param {string} vendorId - Vendor's ID
 * @returns {Promise<Object>} Like action result
 */
export const toggleVendorLike = async (token, vendorId) => {
  try {
    const response = await axiosInstance.post('/auth/user/vendor/like', {
      vendorId
    }, {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Follows or unfollows a vendor
 * @param {string} token - JWT access token
 * @param {string} vendorId - Vendor's ID
 * @returns {Promise<Object>} Follow action result
 */
export const toggleVendorFollow = async (token, vendorId) => {
  try {
    const response = await axiosInstance.post('/auth/user/vendor/follow', {
      vendorId
    }, {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Saves or unsaves a vendor
 * @param {string} token - JWT access token
 * @param {string} vendorId - Vendor's ID
 * @returns {Promise<Object>} Save action result
 */
export const toggleVendorSave = async (token, vendorId) => {
  try {
    const response = await axiosInstance.post('/auth/user/vendor/save', {
      vendorId
    }, {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves all user interactions (likes, follows, saves)
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} User interactions data
 */
export const getUserInteractions = async (token) => {
  try {
    const response = await axiosInstance.get('/auth/user/interactions', {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// VENDOR ENDPOINTS
// ============================================

/**
 * Creates a new vendor account
 * @param {Object} vendorData - Vendor registration data
 * @param {string} vendorData.businessName - Unique business name
 * @param {string} vendorData.businessEmail - Business email
 * @param {string} vendorData.businessPhone - Business phone number
 * @param {string} vendorData.password - Password (min 8 chars)
 * @param {string} [vendorData.city] - Business city
 * @param {string} [vendorData.address] - Business address
 * @param {string} [vendorData.gstNumber] - GST number
 * @param {Array} [vendorData.citiesActive] - Active cities
 * @param {Array} [vendorData.servicesProvided] - Services offered
 * @returns {Promise<Object>} Vendor data with tokens
 */
export const signupVendor = async (vendorData) => {
  try {
    const response = await axiosInstance.post('/auth/vendor/signup', {
      businessName: vendorData.businessName,
      businessEmail: vendorData.businessEmail,
      businessPhone: vendorData.businessPhone,
      password: vendorData.password,
      ...(vendorData.city && { city: vendorData.city }),
      ...(vendorData.address && { address: vendorData.address }),
      ...(vendorData.gstNumber && { gstNumber: vendorData.gstNumber }),
      ...(vendorData.citiesActive && { citiesActive: vendorData.citiesActive }),
      ...(vendorData.servicesProvided && { servicesProvided: vendorData.servicesProvided })
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Authenticates a vendor
 * @param {string} userid - Business name, email, or phone
 * @param {string} password - Vendor password
 * @returns {Promise<Object>} Vendor data with tokens
 */
export const loginVendor = async (userid, password) => {
  try {
    const response = await axiosInstance.post('/auth/vendor/login', {
      userid,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logs out the vendor
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Logout confirmation
 */
export const logoutVendor = async (token) => {
  try {
    const response = await axiosInstance.post('/auth/vendor/logout', {}, {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Checks if a business name is available
 * @param {string} businessName - Business name to check
 * @returns {Promise<Object>} Availability status
 */
export const checkBusinessNameAvailability = async (businessName) => {
  try {
    const response = await axiosInstance.post('/auth/vendor/usernameAvailability', {
      businessName
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Refreshes vendor tokens
 * @param {string} refreshToken - Valid refresh token
 * @returns {Promise<Object>} New tokens and vendor data
 */
export const refreshVendorToken = async (refreshToken) => {
  try {
    const response = await axiosInstance.post('/auth/vendor/generateToken', {
      refreshToken
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verifies vendor token validity
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Authentication status
 */
export const verifyVendorAuth = async (token) => {
  try {
    const response = await axiosInstance.get('/auth/vendor/pseudo', {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates vendor profile information
 * @param {string} token - JWT access token
 * @param {Object} profileData - Vendor profile data
 * @param {string} [profileData.city] - Business city
 * @param {string} [profileData.address] - Business address
 * @param {Array} [profileData.citiesActive] - Active service cities
 * @param {Array} [profileData.servicesProvided] - Services offered
 * @returns {Promise<Object>} Updated vendor data
 */
export const updateVendorProfile = async (token, profileData) => {
  try {
    const response = await axiosInstance.put('/auth/vendor/profile', {
      ...(profileData.city && { city: profileData.city }),
      ...(profileData.address && { address: profileData.address }),
      ...(profileData.citiesActive && { citiesActive: profileData.citiesActive }),
      ...(profileData.servicesProvided && { servicesProvided: profileData.servicesProvided })
    }, {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves vendor's followers list
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Vendor followers data
 */
export const getVendorFollowers = async (token) => {
  try {
    const response = await axiosInstance.get('/auth/vendor/followers', {
      headers: {
        wedoraCredentials: token
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
