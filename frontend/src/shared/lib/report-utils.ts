import type { ReportType, ReportEligibility } from '@/shared/types/report.types'
import type { RoleType } from '@/shared/store/role.store'

/**
 * Check if a user can report based on their role and context
 */
export function checkReportEligibility(
  reporterRole: RoleType | null,
  reportType: ReportType,
  context?: {
    hasViewed?: boolean
    hasMovedIn?: boolean
    hasBooking?: boolean
    bookingStatus?: string
  }
): ReportEligibility {
  // Admin cannot report
  if (reporterRole === 'admin') {
    return {
      canReport: false,
      reason: 'Admins cannot submit reports. Use the disputes page to resolve issues.',
    }
  }

  // Tenant reporting property/landlord/homerunner
  if (reportType === 'property' && reporterRole === 'tenant') {
    if (!context?.hasViewed && !context?.hasMovedIn) {
      return {
        canReport: false,
        reason: 'You can only report a property after viewing or moving in.',
        requiresViewing: true,
        requiresMoveIn: true,
      }
    }
    return { canReport: true }
  }

  // All other report types are generally allowed
  return { canReport: true }
}

/**
 * Get the appropriate report type based on context
 */
export function getReportType(
  entityType: 'user' | 'property' | 'service',
  entityRole?: string
): ReportType {
  if (entityType === 'property') {
    return 'property'
  }

  if (entityType === 'service') {
    return 'service_provider'
  }

  // For users, determine by role
  if (entityRole) {
    const roleMap: Record<string, ReportType> = {
      tenant: 'tenant',
      landlord: 'landlord',
      homerunner: 'homerunner',
      service_provider: 'service_provider',
      handyman: 'handyman',
      artisan: 'artisan',
    }
    return roleMap[entityRole] || 'behavior'
  }

  return 'behavior'
}

/**
 * Generate a report reference number
 */
export function generateReportReference(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `REP-${year}-${random}`
}

