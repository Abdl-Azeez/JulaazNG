/**
 * Application routes
 * Centralized route path constants
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  
  // Auth routes
  LOGIN: '/login',
  LOGIN_PASSWORD: '/login/password',
  SIGNUP: '/signup',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Property routes
  PROPERTIES: '/properties',
  PROPERTY_SEARCH: '/properties/search',
  PROPERTY_DETAILS: (id: string) => `/properties/${id}`,
  PROPERTY_BOOKING: (id: string) => `/properties/${id}/booking`,
  MY_BOOKINGS: '/my-bookings',
  
  // Service routes
  SERVICES: '/services',
  SERVICE_PROVIDERS: (id: string) => `/services/providers/${id}`,
  SERVICE_BOOKINGS: '/services/bookings',
  
  // Artisan routes
  ARTISANS: '/artisans',
  ARTISAN_REQUEST: '/artisans/request',
  ARTISAN_MATCHING: (id: string) => `/artisans/matching/${id}`,
  ARTISAN_DIAGNOSTIC: (id: string) => `/artisans/diagnostic/${id}`,
  ARTISAN_BOOKINGS: '/artisans/bookings',
  
  // Property Management routes
  PROPERTY_MANAGEMENT: '/property-management',
  PROPERTY_MANAGEMENT_DASHBOARD: '/property-management/dashboard',
  RENT_COLLECTION: '/property-management/rent-collection',
  SECURITY_MONITORING: '/property-management/security-monitoring',
  
  // Dashboard routes
  DASHBOARD_TENANT: '/dashboard/tenant',
  DASHBOARD_LANDLORD: '/dashboard/landlord',
  DASHBOARD_SERVICE_PROVIDER: '/dashboard/service-provider',
  DASHBOARD_ARTISAN: '/dashboard/artisan',
  DASHBOARD_PROPERTY_MANAGER: '/dashboard/property-manager',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_PROPERTIES: '/admin/properties',
  ADMIN_ANALYTICS: '/admin/analytics',
  
  // Other routes
  MESSAGING: '/messaging',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  SETTINGS: '/profile/settings',
} as const

