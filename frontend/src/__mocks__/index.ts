/**
 * Centralized Mock Data Exports
 * 
 * ⚠️ TEMPORARY - All imports should come from this file
 * When backend is ready, replace these with real API calls
 * 
 * Usage:
 * import { mockProperties, mockLoginResponse } from '@/__mocks__'
 */

// ============================================================
// AUTHENTICATION & USERS
// ============================================================
export * from './data/auth.mock'

// ============================================================
// PROPERTIES
// ============================================================
export * from './data/properties.mock'
export * from './data/property-details.mock'

// ============================================================
// BOOKINGS & APPLICATIONS
// ============================================================
export * from './data/bookings.mock'

// ============================================================
// SERVICES
// ============================================================
export * from './data/services.mock'

// ============================================================
// NOTIFICATIONS
// ============================================================
export * from './data/notifications.mock'

// ============================================================
// MESSAGING
// ============================================================
export * from './data/messages.mock'

// ============================================================
// PAYMENTS & EARNINGS
// ============================================================
export * from './data/payments.mock'

// ============================================================
// LANDLORD DASHBOARD
// ============================================================
export * from './data/landlord.mock'

// ============================================================
// ADMIN DASHBOARD
// ============================================================
export * from './data/admin.mock'

// ============================================================
// FAVOURITES
// ============================================================
export * from './data/favourites.mock'

// ============================================================
// EVENTS & CALENDAR
// ============================================================
export * from './data/events.mock'

// ============================================================
// HOMERUNNER
// ============================================================
export * from './data/homerunner.mock'

// ============================================================
// HANDYMAN
// ============================================================
export * from './data/handyman.mock'

// ============================================================
// TENANT (Payments & Agreements)
// ============================================================
export * from './data/tenant.mock'

// ============================================================
// SAMPLE USERS (Test Credentials)
// ============================================================
export * from './data/users.mock'

/**
 * Helper to check if we're in mock mode
 * Set VITE_USE_MOCKS=true in .env to enable
 */
export const isUsingMocks = () => {
  return import.meta.env.VITE_USE_MOCKS === 'true' || import.meta.env.DEV
}

/**
 * Helper to simulate API delay
 */
export const mockDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Helper to create consistent API response
 */
export const createMockResponse = <T>(data: T) => {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Helper to create mock error response
 */
export const createMockError = (
  code: string,
  message: string,
  details?: unknown
) => {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  }
}
