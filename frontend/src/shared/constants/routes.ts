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
  MY_SERVICES: '/my-services',
  SERVICE_JOURNEY: (slug: string) => `/services/journey/${slug}`,
  SERVICE_MAINTENANCE_PLANS: '/services/journey/maintenance-plans',
  SERVICE_VETTED_PARTNER: '/services/journey/vetted-partner',
  SERVICE_REQUEST: (serviceId: string) => `/services/journey/request?service=${serviceId}`,
  
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
  
  // Activity routes
  MESSAGING: '/messaging',
  MESSAGING_CHAT: (id: string) => `/messaging/${id}`,
  NOTIFICATIONS: '/notifications',
  EVENTS: '/events',
  FAVOURITES: '/favourites',
  
  // Tenant routes
  AGREEMENTS: '/tenant/agreements',
  PAYMENTS: '/tenant/payments',
  
  // Landlord routes
  LANDLORD_PROPERTIES: '/landlord/properties',
  LANDLORD_PROPERTY_CREATE: '/landlord/properties/create',
  LANDLORD_EARNINGS: '/landlord/earnings',
  LANDLORD_APPLICATIONS: '/landlord/applications',
  LANDLORD_PROPERTY_DETAILS: (id: string) => `/landlord/properties/${id}`,
  LANDLORD_PROPERTY_INSIGHTS: (id: string) => `/landlord/properties/${id}/insights`,
  LANDLORD_PROPERTY_MANAGE: (id: string) => `/landlord/properties/${id}/manage`,
 
  // Info routes
  ABOUT: '/about',
  LANDLORD_FAQ: '/landlord/faq',
  SITEMAP: '/sitemap',
  BUILDINGS: '/buildings',
  TERMS: '/terms',
  COOKIES: '/cookies',
  DISCLAIMER: '/disclaimer',
  CONTACT: '/contact',
 
  // Profile routes
  PROFILE: '/profile',
  SETTINGS: '/profile/settings',
} as const

