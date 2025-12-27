/**
 * Service Type Definitions
 * Matches backend Prisma schema
 */

export type ServiceType = 'REPAIR' | 'INSTALLATION' | 'MAINTENANCE' | 'INSPECTION'

export type ServicePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type ServiceStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type QuoteStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ServiceProvider {
  id: string
  userId: string
  businessName: string
  categories: string[]
  description: string
  yearsOfExperience: number
  certifications: string[]
  serviceAreas: string[]
  rating: number
  totalReviews: number
  completedJobs: number
  responseTime: string
  isVerified: boolean
  status: string
  avatar?: string
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export interface ServiceBooking {
  id: string
  userId: string
  providerId: string
  categoryId: string
  title: string
  description: string
  serviceType: ServiceType
  priority: ServicePriority
  status: ServiceStatus
  scheduledDate: string | null
  completedDate: string | null
  address: {
    street: string
    city: string
    state: string
    country: string
  }
  images: string[]
  estimatedCost: number | null
  finalCost: number | null
  currency: string
  rating: number | null
  review: string | null
  createdAt: string
  updatedAt: string
  provider: ServiceProvider
  user: {
    id: string
    firstName: string
    lastName: string
    phoneNumber: string
    avatar?: string
  }
}

export interface ServiceRequest {
  id: string
  userId: string
  categoryId: string
  title: string
  description: string
  serviceType: ServiceType
  priority: ServicePriority
  address: {
    street: string
    city: string
    state: string
    country: string
  }
  images: string[]
  preferredDate?: string
  budget?: number
  currency: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface ServiceQuote {
  id: string
  serviceRequestId: string
  providerId: string
  amount: number
  currency: string
  description: string
  estimatedDuration: string
  validUntil: string
  status: QuoteStatus
  createdAt: string
  updatedAt: string
  provider: ServiceProvider
}
