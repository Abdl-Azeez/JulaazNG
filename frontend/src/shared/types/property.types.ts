/**
 * Property Type Definitions
 * Matches backend API spec from BACKEND_API_SPEC.md Section 2.2
 */

// API Spec: propertyType: enum ['apartment', 'house', 'duplex', 'studio', 'penthouse']
export type PropertyType =
  | 'apartment'
  | 'house'
  | 'duplex'
  | 'studio'
  | 'penthouse'

// API Spec: status: enum ['inactive', 'pending_inspection', 'active', 'reserved', 'rented']
export type PropertyStatus =
  | 'inactive'
  | 'pending_inspection'
  | 'active'
  | 'reserved'
  | 'rented'

// Legacy uppercase types for backward compatibility
export type LegacyPropertyType = 'APARTMENT' | 'HOUSE' | 'DUPLEX' | 'VILLA' | 'STUDIO' | 'TOWNHOUSE' | 'PENTHOUSE'
export type LegacyPropertyStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'RENTED'

export type PriceType = 'annually' | 'monthly' | 'nightly' | 'weekly'

export type RentTerm = 'monthly' | 'quarterly' | 'six_months' | 'annually'

// API Spec: rentalCategories: enum[] ['long_term', 'shortlet']
export type RentalCategory = 'long_term' | 'shortlet'

// API Spec compliant Property interface
export interface Property {
  id: string
  landlordId: string
  title: string
  description: string
  address: string
  city: string
  state: string
  country?: string
  latitude?: number
  longitude?: number
  propertyType: PropertyType
  bedrooms: number
  bathrooms: number
  toilets?: number
  carParkingSpaces?: number
  squareMeters?: number
  rentalCategories: RentalCategory[]
  allowedRentTerms?: RentTerm[]
  // Long-term rental
  annualRent?: number
  monthlyRent?: number
  minimumTenancyMonths?: number
  // Shortlet
  nightlyRate?: number
  weeklyRate?: number
  minimumStayNights?: number
  maximumStayNights?: number
  // Amenities
  amenities: string[] | Record<string, boolean>
  // Media
  images: string[]
  video?: string
  virtualTourUrl?: string
  // Status
  status: PropertyStatus
  isShortletReady?: boolean
  inspectionDate?: string
  inspectionNotes?: string
  // Metadata
  viewCount: number
  favouriteCount: number
  averageRating?: number
  totalReviews?: number
  createdAt: string | Date
  updatedAt: string | Date
  publishedAt?: string | Date
  // Extended UI fields (for compatibility)
  type?: PropertyType | string // Legacy alias for propertyType
  price?: number // Legacy price field
  currency?: string
  priceType?: PriceType | string
  neighbourhood?: string
  thumbnail?: string
  isVerified?: boolean
  isFeatured?: boolean
  views?: number // Legacy alias for viewCount
  favourites?: number // Legacy alias for favouriteCount
  landlordName?: string
  landlordAvatar?: string
  landlordRating?: number
}

export interface PropertyDetail extends Omit<Property, 'images'> {
  coordinates?: {
    lat: number
    lng: number
  }
  landlord?: {
    id: string
    firstName?: string
    lastName?: string
    name?: string
    phoneNumber?: string
    phone?: string
    email?: string
    avatar?: string
    verified?: boolean
    rating?: number
    reviewCount?: number
    propertiesCount?: number
    responseTime?: string
    memberSince?: string
  }
  highlights?: string[]
  moveInBreakdown?: Array<{
    item?: string
    label?: string
    amount: number
    due?: string
    required?: boolean
  }>
  // Additional optional shortlet pricing
  shortletPrice?: number
  shortletPriceType?: string
  // Images can be strings or objects with url/caption
  images: (string | { url: string; caption?: string })[]
  area?: number
  areaUnit?: string
  parking?: number
  furnished?: boolean
  petsAllowed?: boolean
  availableFrom?: string | Date
  minimumStay?: number
  minimumStayUnit?: string
  publishedAt?: string | Date
  reviewSummary?: {
    averageRating: number
    totalReviews: number
    ratings?: {
      cleanliness: number
      communication: number
      location: number
      value: number
    }
    ratingBreakdown?: {
      1: number
      2: number
      3: number
      4: number
      5: number
    }
    aspectRatings?: {
      cleanliness: number
      communication: number
      location: number
      value: number
    }
  }
}
