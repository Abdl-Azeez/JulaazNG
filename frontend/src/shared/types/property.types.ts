/**
 * Property Type Definitions
 * Matches backend Prisma schema and existing property entity
 */

export type PropertyType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'DUPLEX'
  | 'VILLA'
  | 'STUDIO'
  | 'TOWNHOUSE'
  | 'PENTHOUSE'
  // Also allow lowercase variants for flexibility
  | 'apartment'
  | 'house'
  | 'duplex'
  | 'villa'
  | 'studio'
  | 'townhouse'
  | 'penthouse'

export type PropertyStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'RENTED' | 'draft' | 'active' | 'inactive' | 'rented'

export type PriceType = 'ANNUAL' | 'MONTHLY' | 'NIGHTLY' | 'WEEKLY' | 'annually' | 'monthly' | 'nightly' | 'weekly'

export type RentalCategory = 'LONG_TERM' | 'SHORT_LET' | 'BOTH' | 'long_term' | 'shortlet'

export interface Property {
  id: string
  title: string
  description: string
  type: PropertyType | string
  bedrooms: number
  bathrooms: number
  price: number
  currency: string
  priceType: PriceType | string
  city: string
  state: string
  neighbourhood: string
  address: string
  rentalCategories: (RentalCategory | string)[]
  images: string[]
  thumbnail: string
  amenities: string[]
  isVerified: boolean
  isFeatured: boolean
  status: PropertyStatus | string
  views: number
  favourites: number
  landlordId: string
  landlordName: string
  // Optional additional landlord info
  landlordAvatar?: string
  landlordRating?: number
  // Dates can be string or Date
  createdAt: string | Date
  updatedAt: string | Date
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
