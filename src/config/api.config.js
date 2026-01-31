/**
 * API Configuration for Wedding Platform Microservices
 * 
 * This configuration provides centralized access to all microservice endpoints
 * through the API Gateway.
 */

export const API_CONFIG = {
  // API Gateway Base URL
  GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://localhost:3000',
  
  // Microservices Base URLs
  AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3000/api/auth',
  USER: process.env.USER_SERVICE_URL || 'http://localhost:3000/api/users',
  VENDOR: process.env.VENDOR_SERVICE_URL || 'http://localhost:3000/api/vendors',
  COUPLE: process.env.COUPLE_SERVICE_URL || 'http://localhost:3000/api/couples',
  POST: process.env.POST_SERVICE_URL || 'http://localhost:3000/api/posts',
  MEDIA: process.env.MEDIA_SERVICE_URL || 'http://localhost:3000/api/media',
  INTERACTION: process.env.INTERACTION_SERVICE_URL || 'http://localhost:3000/api/interactions',
  CHAT: process.env.CHAT_SERVICE_URL || 'http://localhost:3000/api/chat',
  NOTIFICATION: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3000/api/notifications',
  SEARCH: process.env.SEARCH_SERVICE_URL || 'http://localhost:3000/api/search',
  ANALYTICS: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3000/api/analytics',
};

/**
 * Service Endpoints Map
 * Quick reference for all available service endpoints
 */
export const SERVICE_ENDPOINTS = {
  AUTH: {
    baseUrl: API_CONFIG.AUTH,
    endpoints: {
      LOGIN: '/login',
      REGISTER: '/register',
      LOGOUT: '/logout',
      REFRESH: '/refresh-token',
      VERIFY: '/verify',
    }
  },
  USER: {
    baseUrl: API_CONFIG.USER,
    endpoints: {
      PROFILE: '/profile',
      UPDATE: '/update',
      DELETE: '/delete',
    }
  },
  VENDOR: {
    baseUrl: API_CONFIG.VENDOR,
    endpoints: {
      LIST: '/',
      CREATE: '/create',
      UPDATE: '/update',
      DELETE: '/delete',
    }
  },
  COUPLE: {
    baseUrl: API_CONFIG.COUPLE,
    endpoints: {
      LIST: '/',
      CREATE: '/create',
      UPDATE: '/update',
      DELETE: '/delete',
    }
  },
  POST: {
    baseUrl: API_CONFIG.POST,
    endpoints: {
      LIST: '/',
      CREATE: '/create',
      UPDATE: '/update',
      DELETE: '/delete',
    }
  },
  MEDIA: {
    baseUrl: API_CONFIG.MEDIA,
    endpoints: {
      UPLOAD: '/upload',
      DELETE: '/delete',
      GET: '/',
    }
  },
  INTERACTION: {
    baseUrl: API_CONFIG.INTERACTION,
    endpoints: {
      LIKE: '/like',
      COMMENT: '/comment',
      SHARE: '/share',
    }
  },
  CHAT: {
    baseUrl: API_CONFIG.CHAT,
    endpoints: {
      MESSAGES: '/messages',
      SEND: '/send',
      CONVERSATIONS: '/conversations',
    }
  },
  NOTIFICATION: {
    baseUrl: API_CONFIG.NOTIFICATION,
    endpoints: {
      LIST: '/',
      MARK_READ: '/mark-read',
      DELETE: '/delete',
    }
  },
  SEARCH: {
    baseUrl: API_CONFIG.SEARCH,
    endpoints: {
      VENDORS: '/vendors',
      POSTS: '/posts',
      USERS: '/users',
    }
  },
  ANALYTICS: {
    baseUrl: API_CONFIG.ANALYTICS,
    endpoints: {
      DASHBOARD: '/dashboard',
      METRICS: '/metrics',
      REPORTS: '/reports',
    }
  },
};

export default API_CONFIG;
