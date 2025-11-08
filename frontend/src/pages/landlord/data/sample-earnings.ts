import type { EarningsSummary, EarningSnapshot } from '@/shared/types/landlord.types'

export const earningsSummary: EarningsSummary = {
  totalMonth: 5400000,
  upcoming: 2100000,
  overdue: 0,
  shortletShare: 850000,
}

export const earningSnapshots: EarningSnapshot[] = [
  {
    id: 'earning-1',
    propertyId: 'prop-104',
    propertyName: 'Ojodu Place',
    tenantName: 'John Doe',
    amount: 1800000,
    status: 'received',
    dueDate: '2025-09-05',
    paidDate: '2025-09-05',
    bookingType: 'annual',
  },
  {
    id: 'earning-2',
    propertyId: 'prop-101',
    propertyName: 'Viva Residency',
    tenantName: 'Sarah Matthews',
    amount: 900000,
    status: 'upcoming',
    dueDate: '2025-09-12',
    bookingType: 'shortlet',
  },
  {
    id: 'earning-3',
    propertyId: 'prop-102',
    propertyName: 'Palmgrove Court',
    tenantName: 'Kingsley Ade',
    amount: 2400000,
    status: 'received',
    dueDate: '2025-08-28',
    paidDate: '2025-08-28',
    bookingType: 'annual',
  },
  {
    id: 'earning-4',
    propertyId: 'prop-103',
    propertyName: 'Lekki Haven',
    tenantName: 'Amina Salisu',
    amount: 260000,
    status: 'upcoming',
    dueDate: '2025-09-09',
    bookingType: 'shortlet',
  },
]

