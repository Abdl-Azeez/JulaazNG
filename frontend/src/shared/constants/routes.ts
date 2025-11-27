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
  HANDYMAN_DASHBOARD: '/handyman/dashboard',
  HANDYMAN_JOBS: '/handyman/jobs',
  HANDYMAN_JOB_CHECKLIST: '/handyman/checklist',
  HANDYMAN_UPCOMING_ROTA: '/handyman/rota',
  HANDYMAN_ASSIGNMENTS: '/handyman/assignments',
  HANDYMAN_JOB_SHEET: (jobId: string) => `/handyman/jobs/${jobId}/sheet`,
  HANDYMAN_JOB_BRIEF: (jobId: string) => `/handyman/jobs/${jobId}/brief`,
  HANDYMAN_CLAIM_JOB: (jobId: string) => `/handyman/jobs/${jobId}/claim`,
  HANDYMAN_PLAYBOOK: '/handyman/playbook',
  
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
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PROPERTIES: '/admin/properties',
  ADMIN_PROPERTY_DETAILS: (id: string) => `/admin/properties/${id}`,
  ADMIN_SERVICES: '/admin/services',
  ADMIN_APPROVALS: '/admin/approvals',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_DISPUTES: '/admin/disputes',
  ADMIN_BACKGROUND_CHECKS: '/admin/background-checks',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Homerunner routes
  HOMERUNNER_DASHBOARD: '/homerunner/dashboard',
  HOMERUNNER_INSPECTIONS: '/homerunner/inspections',
  HOMERUNNER_VIEWINGS: '/homerunner/viewings',
  HOMERUNNER_EARNINGS: '/homerunner/earnings',
  HOMERUNNER_SCHEDULE: '/homerunner/schedule',
  HOMERUNNER_INSPECTION_DETAILS: (id: string) => `/homerunner/inspections/${id}`,
  HOMERUNNER_VIEWING_DETAILS: (id: string) => `/homerunner/viewings/${id}`,
  
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

