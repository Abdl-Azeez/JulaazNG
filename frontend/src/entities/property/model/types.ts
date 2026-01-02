export type RentalCategory = 'long_term' | 'shortlet'

export interface ShortletOffering {
  isAvailable: boolean
  headline: string
  nightlyRate: number
  weekendRate?: number
  weeklyRate?: number
  monthlyRate?: number
  minimumStayNights: number
  maximumStayNights?: number
  maxGuests?: number
  servicesIncluded: string[]
  facilities: string[]
  houseRules: string[]
  checkInWindow: string
  checkOutTime: string
  cleaningFee?: number
  securityDeposit?: number
}

export interface LongTermOffering {
  annualRent: number
  monthlyRent?: number
  minimumTermMonths: number
  furnished: boolean
  utilitiesIncluded: string[]
  paymentPlan: string[]
  notes?: string
}

export interface Property {
  id: string
  name: string
  image: string
  images?: string[] // Multiple images for slider
  area: number // in sqft
  bedrooms: number
  bathrooms: number
  parking: number
  price: number // legacy pricing reference (annual rent by default)
  location?: string
  ownerId?: string
  rentalCategories: RentalCategory[]
  annualRent?: number
  monthlyRent?: number
  nightlyRate?: number
  weeklyRate?: number
  minimumStayNights?: number
  maximumStayNights?: number
}

export interface PropertyCardProps {
  property: Property
  onRequestViewing?: (propertyId: string) => void
  onShare?: (propertyId: string) => void
  onSelect?: (propertyId: string) => void
  layout?: 'grid' | 'row'
}

export interface PropertyOwner {
  name: string
  phone: string
  email?: string
  avatar?: string
  initials?: string
  verified?: boolean
  averageRating?: number
  ratingCount?: number
}

export interface MoveInItem {
  label: string
  amount: number
  due?: string
}

export interface PropertyDetail extends Property {
  transactionType: 'Rent' | 'Buy'
  propertyType: string
  address: string
  city: string
  state: string
  country: string
  neighbourhood?: string
  description: string
  highlights: string[]
  amenities: string[]
  isFurnished: boolean
  furnishingNotes?: string
  moveInBreakdown: MoveInItem[]
  owner: PropertyOwner
  locationDescription: string
  mapUrl?: string
  breadcrumb: string[]
  longTermOffering?: LongTermOffering
  shortletOffering?: ShortletOffering
}
  allowedRentTerms?: Array<'monthly' | 'quarterly' | 'six_months' | 'annually'>

