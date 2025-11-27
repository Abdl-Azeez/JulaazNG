import { useMemo } from 'react'
import { useAuthStore } from '@/shared/store/auth.store'
import { useRoleStore } from '@/shared/store/role.store'
import { samplePropertyBookings } from '@/pages/my-bookings/data/sample-bookings'
import { checkReportEligibility } from '@/shared/lib/report-utils'
import type { ReportEligibility } from '@/shared/types/report.types'

/**
 * Hook to check if user can report a property
 */
export function usePropertyReportEligibility(propertyId: string): ReportEligibility {
  const { isAuthenticated, user } = useAuthStore()
  const { activeRole } = useRoleStore()

  return useMemo(() => {
    if (!isAuthenticated || !user) {
      return {
        canReport: false,
        reason: 'Please log in to report',
      }
    }

    // Check if user has viewed or moved in
    const userBookings = samplePropertyBookings.filter(
      (booking) => booking.userId === user.id && booking.propertyId === propertyId
    )

    const hasViewed = userBookings.some(
      (booking) => booking.viewing?.completedAt || booking.status === 'viewing_completed'
    )
    const hasMovedIn = userBookings.some((booking) => booking.status === 'active')

    return checkReportEligibility(activeRole, 'property', {
      hasViewed,
      hasMovedIn,
      hasBooking: userBookings.length > 0,
    })
  }, [isAuthenticated, user, activeRole, propertyId])
}

