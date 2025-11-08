export type PropertyStatus = 'active' | 'inactive' | 'reserved' | 'rented'

export interface LandlordProperty {
  id: string
  name: string
  image: string
  location: string
  status: PropertyStatus
  applications: number
  priceLabel: string
  lastUpdated: string
  occupancyRate: number
}

export interface LandlordPropertyDetail {
  id: string
  name: string
  image: string
  gallery?: string[]
  price: number
  address: string
  type: string
  size: number
  bedrooms: number
  bathrooms: number
  parking: number
  description: string
  applicationsCount: number
  latestApplicant: {
    name: string
    status: 'pending' | 'approved' | 'rejected'
  } | null
  tenant?: {
    name: string
    period: string
    contactMethod: string
  }
  payment?: {
    lastPaymentStatus: string
    lastPaymentDate: string
  }
  documents: Array<{
    id: string
    name: string
  }>
}

export interface EarningSnapshot {
  id: string
  propertyId: string
  propertyName: string
  tenantName: string
  amount: number
  status: 'received' | 'upcoming' | 'overdue'
  dueDate: string
  paidDate?: string
  bookingType: 'annual' | 'shortlet'
}

export interface EarningsSummary {
  totalMonth: number
  upcoming: number
  overdue: number
  shortletShare: number
}

export interface LandlordApplication {
  id: string
  propertyId: string
  propertyName: string
  applicantName: string
  avatar: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  moveInDate: string
  offerAmount: number
  bedrooms: number
  bathrooms: number
  parking: number
  sqft: number
  messagePreview: string
}

