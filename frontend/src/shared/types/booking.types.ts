/**
 * Booking-related TypeScript types and interfaces
 */

// Booking Types
export type BookingType = 'rental' | 'short_let'

export type BookingStatus =
  | 'pending'
  | 'viewing_scheduled'
  | 'viewing_completed'
  | 'application_submitted'
  | 'documents_pending'
  | 'under_review'
  | 'approved'
  | 'agreement_sent'
  | 'payment_pending'
  | 'payment_completed'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'rejected'

export type ServiceBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'

export type ServiceType = 'cleaning' | 'moving' | 'maintenance' | 'fumigation' | 'painting' | 'plumbing' | 'electrical' | 'carpentry'

// Property Booking Interface
export interface PropertyBooking {
  id: string
  userId: string
  propertyId: string
  landlordId: string
  type: BookingType
  status: BookingStatus

  // Property Details
  property: {
    id: string
    name: string
    address: string
    city: string
    state: string
    image: string
    bedrooms: number
    bathrooms: number
    price: number
    priceType: 'monthly' | 'annually' | 'nightly'
  }

  // Landlord Details
  landlord: {
    id: string
    name: string
    avatar?: string
    phone?: string
    email?: string
  }

  // Viewing Details
  viewing?: {
    preferredDates: Date[]
    scheduledDate?: Date
    completedAt?: Date
    notes?: string
  }

  // Application Details
  application?: {
    submittedAt: Date
    moveInDate: Date
    tenancyDuration?: number // months for rental
    stayLengthNights?: number // nights for shortlet
    minimumBudget: number
    notes?: string
  }

  // Documents
  documents?: {
    id: string
    name: string
    type: string
    url: string
    status: 'pending' | 'approved' | 'rejected'
    uploadedAt: Date
  }[]

  // Agreement
  agreement?: {
    id: string
    sentAt: Date
    signedAt?: Date
    documentUrl: string
  }

  // Payment
  payment?: {
    id: string
    amount: number
    status: 'pending' | 'processing' | 'completed' | 'failed'
    dueDate: Date
    paidAt?: Date
  }

  // Timeline (optional for mock data flexibility)
  timeline?: {
    status: BookingStatus
    timestamp: Date
    note?: string
  }[]

  // Metadata
  createdAt: Date
  updatedAt: Date
  cancelledAt?: Date
  cancellationReason?: string
  rejectionReason?: string
}

// Service Booking Interface
export interface ServiceBooking {
  id: string
  userId: string
  serviceId: string
  providerId: string
  type: ServiceType
  status: ServiceBookingStatus

  // Service Details
  service: {
    id: string
    name: string
    description: string
    category: ServiceType
    image?: string
    price: number
    duration: number // in hours
  }

  // Provider Details
  provider: {
    id: string
    name: string
    avatar?: string
    phone?: string
    email?: string
    rating: number
    completedJobs: number
  }

  // Booking Details
  scheduledDate: Date
  scheduledTime: string
  address: string
  city: string
  state: string
  notes?: string

  // Property Context (if service is for a property)
  propertyId?: string
  propertyName?: string

  // Payment
  payment: {
    amount: number
    status: 'pending' | 'completed' | 'refunded'
    paidAt?: Date
    method?: string
  }

  // Service Execution
  startedAt?: Date
  completedAt?: Date
  rating?: number
  review?: string
  photos?: {
    before: string[]
    after: string[]
  }

  // Timeline
  timeline: {
    status: ServiceBookingStatus
    timestamp: Date
    note?: string
  }[]

  // Metadata
  createdAt: Date
  updatedAt: Date
  cancelledAt?: Date
  cancellationReason?: string
  rescheduledFrom?: Date
}

// Booking Stats
export interface BookingStats {
  total: number
  active: number
  pending: number
  completed: number
  cancelled: number
}

