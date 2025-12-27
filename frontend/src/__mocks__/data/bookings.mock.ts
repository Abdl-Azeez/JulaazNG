/**
 * Bookings Mock Data
 * Matches backend API specification from BACKEND_API_SPEC.md
 */

import type { ApiResponse } from '@/shared/types/common.types'
import type { PropertyBooking, BookingStatus } from '@/shared/types/booking.types'
import { mockUsers } from './auth.mock'

// Define local types for booking-related data that aren't in the main types
interface ViewingRequest {
  id: string
  propertyId: string
  tenantId: string
  landlordId: string
  preferredDate: string
  alternativeDate?: string
  confirmedDate?: string
  status: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface PropertyApplication {
  id: string
  propertyId: string
  tenantId: string
  landlordId: string
  status: string
  moveInDate: string
  leaseDuration: number
  leaseDurationUnit: string
  employmentStatus?: string
  monthlyIncome?: number
  hasGuarantor?: boolean
  guarantorDetails?: {
    name: string
    relationship: string
    phoneNumber: string
    email: string
  }
  documents?: Array<{
    id: string
    type: string
    url: string
    uploadedAt: string
  }>
  notes?: string
  createdAt: string
  updatedAt: string
}

interface BookingTimeline {
  id: string
  bookingId: string
  status: string
  timestamp: string
  actor: {
    id: string
    name: string
    role: string
  }
  notes?: string
}

// Sample property data for bookings
const mockPropertyData = {
  prop_001: {
    id: 'prop_001',
    name: 'Luxury 3BR Apartment in Marina',
    address: '15 Marina Drive, Lekki',
    city: 'Lagos',
    state: 'Lagos',
    image: 'https://picsum.photos/seed/prop1/800/600',
    bedrooms: 3,
    bathrooms: 2,
    price: 1500000,
    priceType: 'monthly' as const,
  },
  prop_002: {
    id: 'prop_002',
    name: 'Modern 2BR in Lekki Phase 1',
    address: '25 Admiralty Way',
    city: 'Lagos',
    state: 'Lagos',
    image: 'https://picsum.photos/seed/prop2/800/600',
    bedrooms: 2,
    bathrooms: 2,
    price: 1200000,
    priceType: 'monthly' as const,
  },
  prop_003: {
    id: 'prop_003',
    name: 'Cozy Studio in Victoria Island',
    address: '10 Adeola Odeku',
    city: 'Lagos',
    state: 'Lagos',
    image: 'https://picsum.photos/seed/prop3/800/600',
    bedrooms: 1,
    bathrooms: 1,
    price: 800000,
    priceType: 'monthly' as const,
  },
}

// Sample bookings (using PropertyBooking type from booking.types.ts)
export const mockBookingsData: PropertyBooking[] = [
  {
    id: 'book_001',
    userId: mockUsers.tenant1.id,
    propertyId: 'prop_001',
    landlordId: mockUsers.landlord1.id,
    type: 'annual_lease',
    status: 'viewing_scheduled',
    property: mockPropertyData.prop_001,
    landlord: {
      id: mockUsers.landlord1.id,
      name: `${mockUsers.landlord1.firstName} ${mockUsers.landlord1.lastName}`,
      avatar: mockUsers.landlord1.profilePicture,
      phone: mockUsers.landlord1.phoneNumber,
    },
    viewing: {
      preferredDates: [new Date('2024-02-15T10:00:00Z')],
      scheduledDate: new Date('2024-02-15T10:00:00Z'),
      notes: 'Interested in the apartment. Would like to see the master bedroom.',
    },
    createdAt: new Date('2024-02-10T09:30:00Z'),
    updatedAt: new Date('2024-02-10T14:20:00Z'),
  },
  {
    id: 'book_002',
    userId: mockUsers.tenant1.id,
    propertyId: 'prop_002',
    landlordId: mockUsers.landlord1.id,
    type: 'annual_lease',
    status: 'application_submitted',
    property: mockPropertyData.prop_002,
    landlord: {
      id: mockUsers.landlord1.id,
      name: `${mockUsers.landlord1.firstName} ${mockUsers.landlord1.lastName}`,
      avatar: mockUsers.landlord1.profilePicture,
      phone: mockUsers.landlord1.phoneNumber,
    },
    application: {
      submittedAt: new Date('2024-02-12T09:00:00Z'),
      moveInDate: new Date('2024-03-01'),
      tenancyDuration: 12,
      minimumBudget: 1200000,
      notes: 'Looking for long-term rental. Can provide references.',
    },
    documents: [
      {
        id: 'doc_001',
        name: 'ID Card',
        type: 'id_card',
        url: 'https://example.com/id-card.pdf',
        status: 'pending',
        uploadedAt: new Date('2024-02-12T10:00:00Z'),
      },
      {
        id: 'doc_002',
        name: 'Proof of Income',
        type: 'proof_of_income',
        url: 'https://example.com/income.pdf',
        status: 'pending',
        uploadedAt: new Date('2024-02-12T10:05:00Z'),
      },
    ],
    createdAt: new Date('2024-02-12T09:00:00Z'),
    updatedAt: new Date('2024-02-12T10:05:00Z'),
  },
  {
    id: 'book_003',
    userId: mockUsers.tenant1.id,
    propertyId: 'prop_003',
    landlordId: mockUsers.landlord1.id,
    type: 'annual_lease',
    status: 'approved',
    property: mockPropertyData.prop_003,
    landlord: {
      id: mockUsers.landlord1.id,
      name: `${mockUsers.landlord1.firstName} ${mockUsers.landlord1.lastName}`,
      avatar: mockUsers.landlord1.profilePicture,
      phone: mockUsers.landlord1.phoneNumber,
    },
    application: {
      submittedAt: new Date('2024-02-11T14:00:00Z'),
      moveInDate: new Date('2024-02-20'),
      tenancyDuration: 6,
      minimumBudget: 800000,
    },
    createdAt: new Date('2024-02-11T14:00:00Z'),
    updatedAt: new Date('2024-02-13T15:00:00Z'),
  },
]

// Sample viewing requests (local type)
export const mockViewingRequests: ViewingRequest[] = [
  {
    id: 'view_001',
    propertyId: 'prop_001',
    tenantId: mockUsers.tenant1.id,
    landlordId: mockUsers.landlord1.id,
    preferredDate: '2024-02-15T10:00:00Z',
    alternativeDate: '2024-02-16T14:00:00Z',
    confirmedDate: '2024-02-15T10:00:00Z',
    status: 'confirmed',
    notes: 'Interested in viewing the property',
    createdAt: '2024-02-10T09:30:00Z',
    updatedAt: '2024-02-10T14:20:00Z',
  },
  {
    id: 'view_002',
    propertyId: 'prop_002',
    tenantId: mockUsers.tenant1.id,
    landlordId: mockUsers.landlord1.id,
    preferredDate: '2024-02-18T11:00:00Z',
    status: 'pending',
    notes: 'Available weekdays after 10am',
    createdAt: '2024-02-13T08:00:00Z',
    updatedAt: '2024-02-13T08:00:00Z',
  },
]

// Sample property applications (local type)
export const mockPropertyApplications: PropertyApplication[] = [
  {
    id: 'app_001',
    propertyId: 'prop_002',
    tenantId: mockUsers.tenant1.id,
    landlordId: mockUsers.landlord1.id,
    status: 'pending',
    moveInDate: '2024-03-01',
    leaseDuration: 12,
    leaseDurationUnit: 'MONTH',
    employmentStatus: 'EMPLOYED',
    monthlyIncome: 500000,
    hasGuarantor: true,
    guarantorDetails: {
      name: 'John Guarantor',
      relationship: 'Uncle',
      phoneNumber: '+2348012345678',
      email: 'guarantor@example.com',
    },
    documents: [
      {
        id: 'doc_001',
        type: 'ID_CARD',
        url: 'https://example.com/id-card.pdf',
        uploadedAt: '2024-02-12T10:00:00Z',
      },
      {
        id: 'doc_002',
        type: 'PROOF_OF_INCOME',
        url: 'https://example.com/income.pdf',
        uploadedAt: '2024-02-12T10:05:00Z',
      },
    ],
    notes: 'Looking for long-term rental',
    createdAt: '2024-02-12T09:00:00Z',
    updatedAt: '2024-02-12T10:05:00Z',
  },
]

// Sample booking timeline (local type)
export const mockBookingTimeline: BookingTimeline[] = [
  {
    id: 'tl_001',
    bookingId: 'book_002',
    status: 'pending',
    timestamp: '2024-02-12T09:00:00Z',
    actor: {
      id: mockUsers.tenant1.id,
      name: `${mockUsers.tenant1.firstName} ${mockUsers.tenant1.lastName}`,
      role: 'TENANT',
    },
    notes: 'Application submitted',
  },
  {
    id: 'tl_002',
    bookingId: 'book_002',
    status: 'under_review',
    timestamp: '2024-02-12T14:00:00Z',
    actor: {
      id: mockUsers.landlord1.id,
      name: `${mockUsers.landlord1.firstName} ${mockUsers.landlord1.lastName}`,
      role: 'LANDLORD',
    },
    notes: 'Documents received, under review',
  },
]

// API Response Mocks
export const mockMyBookingsResponse: ApiResponse<{
  bookings: PropertyBooking[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}> = {
  success: true,
  data: {
    bookings: mockBookingsData,
    pagination: {
      page: 1,
      limit: 10,
      total: mockBookingsData.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Bookings retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockBookingDetailResponse: ApiResponse<{
  booking: PropertyBooking
  timeline: BookingTimeline[]
}> = {
  success: true,
  data: {
    booking: mockBookingsData[0],
    timeline: mockBookingTimeline,
  },
  message: 'Booking details retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockCreateViewingResponse: ApiResponse<ViewingRequest> = {
  success: true,
  data: mockViewingRequests[0],
  message: 'Viewing request created successfully',
  timestamp: new Date().toISOString(),
}

export const mockCreateApplicationResponse: ApiResponse<PropertyApplication> = {
  success: true,
  data: mockPropertyApplications[0],
  message: 'Application submitted successfully',
  timestamp: new Date().toISOString(),
}

export const mockUpdateBookingStatusResponse: ApiResponse<PropertyBooking> = {
  success: true,
  data: { ...mockBookingsData[0], status: 'confirmed' as BookingStatus },
  message: 'Booking status updated successfully',
  timestamp: new Date().toISOString(),
}

export const mockCancelBookingResponse: ApiResponse<PropertyBooking> = {
  success: true,
  data: { ...mockBookingsData[0], status: 'cancelled' as BookingStatus },
  message: 'Booking cancelled successfully',
  timestamp: new Date().toISOString(),
}

// ============================================================
// UI PROPERTY BOOKINGS (for My Bookings Page)
// Migrated from: pages/my-bookings/data/sample-bookings.ts
// ============================================================
import home1 from '@/assets/images/home1.jpg'
import home2 from '@/assets/images/home2.jpg'
import home3 from '@/assets/images/home3.jpg'
import home4 from '@/assets/images/home4.jpg'
import home5 from '@/assets/images/home5.jpg'
import type { PropertyBooking as UIPropertyBooking } from '@/shared/types/booking.types'

export const samplePropertyBookings: UIPropertyBooking[] = [
  {
    id: 'booking-1',
    userId: 'user-1',
    propertyId: 'prop-1',
    landlordId: 'landlord-1',
    type: 'annual_lease',
    status: 'active',
    property: {
      id: '1',
      name: '2 Bedroom Apartment',
      address: '45 Admiralty Way',
      city: 'Lekki',
      state: 'Lagos',
      image: home1,
      bedrooms: 2,
      bathrooms: 2,
      price: 1200000,
      priceType: 'annually',
    },
    landlord: {
      id: 'landlord-1',
      name: 'Mr. Adebayo Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adebayo',
      phone: '+234 803 456 7890',
      email: 'adebayo.j@example.com',
    },
    viewing: {
      preferredDates: [new Date('2024-01-15T14:00:00')],
      scheduledDate: new Date('2024-01-15T14:00:00'),
      completedAt: new Date('2024-01-15T15:30:00'),
    },
    application: {
      submittedAt: new Date('2024-01-16T10:00:00'),
      moveInDate: new Date('2024-02-01T00:00:00'),
      tenancyDuration: 12,
      minimumBudget: 1200000,
      notes: 'Looking for a quiet place close to work',
    },
    agreement: {
      id: 'agreement-1',
      sentAt: new Date('2024-01-20T09:00:00'),
      signedAt: new Date('2024-01-21T14:30:00'),
      documentUrl: '/documents/agreement-1.pdf',
    },
    payment: {
      id: 'payment-1',
      amount: 1200000,
      status: 'completed',
      dueDate: new Date('2024-01-25T00:00:00'),
      paidAt: new Date('2024-01-24T16:45:00'),
    },
    timeline: [
      { status: 'pending', timestamp: new Date('2024-01-10T12:00:00'), note: 'Viewing request submitted' },
      { status: 'viewing_scheduled', timestamp: new Date('2024-01-12T09:00:00'), note: 'Viewing scheduled for Jan 15, 2024' },
      { status: 'viewing_completed', timestamp: new Date('2024-01-15T15:30:00'), note: 'Property viewing completed' },
      { status: 'application_submitted', timestamp: new Date('2024-01-16T10:00:00'), note: 'Application submitted' },
      { status: 'approved', timestamp: new Date('2024-01-19T16:00:00'), note: 'Application approved by landlord' },
      { status: 'payment_completed', timestamp: new Date('2024-01-24T16:45:00'), note: 'Payment completed' },
      { status: 'active', timestamp: new Date('2024-02-01T00:00:00'), note: 'Tenancy started' },
    ],
    createdAt: new Date('2024-01-10T12:00:00'),
    updatedAt: new Date('2024-02-01T00:00:00'),
  },
  {
    id: 'booking-2',
    userId: 'user-1',
    propertyId: 'prop-2',
    landlordId: 'landlord-2',
    type: 'annual_lease',
    status: 'application_submitted',
    property: {
      id: '2',
      name: '3 Bedroom Duplex',
      address: '12 Ogudu Road',
      city: 'Ikeja',
      state: 'Lagos',
      image: home2,
      bedrooms: 3,
      bathrooms: 3,
      price: 1800000,
      priceType: 'annually',
    },
    landlord: {
      id: 'landlord-2',
      name: 'Mrs. Chioma Okafor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma',
      phone: '+234 805 123 4567',
      email: 'chioma.o@example.com',
    },
    viewing: {
      preferredDates: [new Date('2024-01-25T14:00:00')],
      scheduledDate: new Date('2024-01-25T14:00:00'),
      completedAt: new Date('2024-01-25T15:00:00'),
    },
    application: {
      submittedAt: new Date('2024-01-26T11:30:00'),
      moveInDate: new Date('2024-03-01T00:00:00'),
      tenancyDuration: 12,
      minimumBudget: 1800000,
      notes: 'Family of 4, need spacious accommodation',
    },
    timeline: [
      { status: 'pending', timestamp: new Date('2024-01-20T10:00:00'), note: 'Viewing request submitted' },
      { status: 'viewing_scheduled', timestamp: new Date('2024-01-22T14:00:00'), note: 'Viewing scheduled' },
      { status: 'viewing_completed', timestamp: new Date('2024-01-25T15:00:00'), note: 'Property viewing completed' },
      { status: 'application_submitted', timestamp: new Date('2024-01-26T11:30:00'), note: 'Application submitted' },
      { status: 'application_submitted', timestamp: new Date('2024-01-27T09:00:00'), note: 'Application under review' },
    ],
    createdAt: new Date('2024-01-20T10:00:00'),
    updatedAt: new Date('2024-01-27T09:00:00'),
  },
  {
    id: 'booking-3',
    userId: 'user-1',
    propertyId: 'prop-3',
    landlordId: 'landlord-3',
    type: 'shortlet',
    status: 'approved',
    property: {
      id: '3',
      name: 'Luxury Studio Apartment',
      address: '89 Adeola Odeku Street',
      city: 'Victoria Island',
      state: 'Lagos',
      image: home3,
      bedrooms: 1,
      bathrooms: 1,
      price: 35000,
      priceType: 'nightly',
    },
    landlord: {
      id: 'landlord-3',
      name: 'Mr. Emeka Nwosu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka',
      phone: '+234 807 890 1234',
      email: 'emeka.n@example.com',
    },
    viewing: {
      preferredDates: [new Date('2024-02-10T16:00:00')],
      scheduledDate: new Date('2024-02-10T16:00:00'),
    },
    application: {
      submittedAt: new Date('2024-02-05T14:20:00'),
      moveInDate: new Date('2024-02-15T15:00:00'),
      stayLengthNights: 7,
      minimumBudget: 35000,
      notes: 'Business trip, need WiFi and workspace',
    },
    payment: {
      id: 'payment-3',
      amount: 245000,
      status: 'completed',
      dueDate: new Date('2024-02-12T00:00:00'),
      paidAt: new Date('2024-02-11T18:30:00'),
    },
    timeline: [
      { status: 'pending', timestamp: new Date('2024-02-05T14:20:00'), note: 'Shortlet booking request' },
      { status: 'approved', timestamp: new Date('2024-02-08T12:00:00'), note: 'Booking approved' },
      { status: 'payment_completed', timestamp: new Date('2024-02-11T18:30:00'), note: 'Payment completed' },
      { status: 'active', timestamp: new Date('2024-02-12T09:00:00'), note: 'Booking active' },
    ],
    createdAt: new Date('2024-02-05T14:20:00'),
    updatedAt: new Date('2024-02-12T09:00:00'),
  },
  {
    id: 'booking-4',
    userId: 'user-1',
    propertyId: 'prop-4',
    landlordId: 'landlord-4',
    type: 'annual_lease',
    status: 'viewing_scheduled',
    property: {
      id: '4',
      name: '4 Bedroom Terrace',
      address: '23 Chevron Drive',
      city: 'Lekki',
      state: 'Lagos',
      image: home4,
      bedrooms: 4,
      bathrooms: 4,
      price: 2500000,
      priceType: 'annually',
    },
    landlord: {
      id: 'landlord-4',
      name: 'Dr. Funmi Adeleke',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Funmi',
      phone: '+234 809 234 5678',
      email: 'funmi.a@example.com',
    },
    viewing: {
      preferredDates: [new Date('2024-02-20T10:00:00'), new Date('2024-02-21T14:00:00')],
      scheduledDate: new Date('2024-02-20T10:00:00'),
      notes: 'Interested in security features',
    },
    timeline: [
      { status: 'pending', timestamp: new Date('2024-02-15T13:45:00'), note: 'Viewing request submitted' },
      { status: 'viewing_scheduled', timestamp: new Date('2024-02-16T11:00:00'), note: 'Viewing scheduled' },
    ],
    createdAt: new Date('2024-02-15T13:45:00'),
    updatedAt: new Date('2024-02-16T11:00:00'),
  },
  {
    id: 'booking-5',
    userId: 'user-1',
    propertyId: 'prop-5',
    landlordId: 'landlord-5',
    type: 'annual_lease',
    status: 'rejected',
    property: {
      id: '5',
      name: '1 Bedroom Apartment',
      address: '67 Allen Avenue',
      city: 'Ikeja',
      state: 'Lagos',
      image: home5,
      bedrooms: 1,
      bathrooms: 1,
      price: 800000,
      priceType: 'annually',
    },
    landlord: {
      id: 'landlord-5',
      name: 'Mr. Tunde Bakare',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde',
      phone: '+234 802 345 6789',
      email: 'tunde.b@example.com',
    },
    viewing: {
      preferredDates: [new Date('2024-01-05T15:00:00')],
      scheduledDate: new Date('2024-01-05T15:00:00'),
      completedAt: new Date('2024-01-05T16:00:00'),
    },
    application: {
      submittedAt: new Date('2024-01-06T09:00:00'),
      moveInDate: new Date('2024-02-01T00:00:00'),
      tenancyDuration: 12,
      minimumBudget: 800000,
    },
    timeline: [
      { status: 'pending', timestamp: new Date('2024-01-03T11:00:00'), note: 'Viewing request submitted' },
      { status: 'viewing_scheduled', timestamp: new Date('2024-01-04T10:00:00'), note: 'Viewing scheduled' },
      { status: 'viewing_completed', timestamp: new Date('2024-01-05T16:00:00'), note: 'Viewing completed' },
      { status: 'application_submitted', timestamp: new Date('2024-01-06T09:00:00'), note: 'Application submitted' },
      { status: 'rejected', timestamp: new Date('2024-01-09T14:00:00'), note: 'Application rejected' },
    ],
    rejectionReason: 'Property has been rented to another tenant',
    createdAt: new Date('2024-01-03T11:00:00'),
    updatedAt: new Date('2024-01-09T14:00:00'),
  },
]

// ============================================================
// SERVICE BOOKINGS (UI-specific)
// Migrated from: pages/my-services/data/sample-service-bookings.ts
// ============================================================

import type { ServiceBooking } from '@/shared/types/booking.types'

export const sampleServiceBookings: ServiceBooking[] = [
  {
    id: 'service-1',
    userId: 'user-1',
    serviceId: 'cleaning-1',
    providerId: 'provider-1',
    type: 'cleaning',
    status: 'confirmed',
    service: {
      id: 'cleaning-1',
      name: 'Deep Cleaning Service',
      description: 'Comprehensive deep cleaning for apartments',
      category: 'cleaning',
      image: '/images/services/cleaning.jpg',
      price: 25000,
      duration: 4,
    },
    provider: {
      id: 'provider-1',
      name: 'CleanPro Services',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CleanPro',
      phone: '+234 801 234 5678',
      email: 'info@cleanpro.com',
      rating: 4.8,
      completedJobs: 342,
    },
    scheduledDate: new Date('2024-02-18T09:00:00'),
    scheduledTime: '09:00 AM - 01:00 PM',
    address: '45 Admiralty Way',
    city: 'Lekki',
    state: 'Lagos',
    notes: 'Please bring all cleaning supplies. Focus on kitchen and bathrooms.',
    propertyId: 'prop-1',
    propertyName: '2 Bedroom Apartment',
    payment: {
      amount: 25000,
      status: 'completed',
      paidAt: new Date('2024-02-15T14:30:00'),
      method: 'card',
    },
    timeline: [
      { status: 'pending', timestamp: new Date('2024-02-14T10:00:00'), note: 'Service booking requested' },
      { status: 'confirmed', timestamp: new Date('2024-02-15T09:00:00'), note: 'Booking confirmed by provider' },
    ],
    createdAt: new Date('2024-02-14T10:00:00'),
    updatedAt: new Date('2024-02-15T09:00:00'),
  },
  {
    id: 'service-2',
    userId: 'user-1',
    serviceId: 'moving-1',
    providerId: 'provider-2',
    type: 'moving',
    status: 'in_progress',
    service: {
      id: 'moving-1',
      name: 'Professional Moving Service',
      description: 'Full-service moving with packing and transportation',
      category: 'moving',
      image: '/images/services/moving.jpg',
      price: 75000,
      duration: 6,
    },
    provider: {
      id: 'provider-2',
      name: 'Swift Movers Ltd',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Swift',
      phone: '+234 803 456 7890',
      email: 'contact@swiftmovers.com',
      rating: 4.9,
      completedJobs: 521,
    },
    scheduledDate: new Date('2024-02-16T08:00:00'),
    scheduledTime: '08:00 AM - 02:00 PM',
    address: '23 Chevron Drive',
    city: 'Lekki',
    state: 'Lagos',
    notes: 'Moving from 2-bedroom to 4-bedroom. Have fragile items.',
    payment: {
      amount: 75000,
      status: 'completed',
      paidAt: new Date('2024-02-10T16:45:00'),
      method: 'bank_transfer',
    },
    startedAt: new Date('2024-02-16T08:15:00'),
    timeline: [
      { status: 'pending', timestamp: new Date('2024-02-08T11:30:00'), note: 'Moving service requested' },
      { status: 'confirmed', timestamp: new Date('2024-02-09T14:00:00'), note: 'Booking confirmed' },
      { status: 'in_progress', timestamp: new Date('2024-02-16T08:15:00'), note: 'Moving service started' },
    ],
    createdAt: new Date('2024-02-08T11:30:00'),
    updatedAt: new Date('2024-02-16T08:15:00'),
  },
  {
    id: 'service-3',
    userId: 'user-1',
    serviceId: 'plumbing-1',
    providerId: 'provider-3',
    type: 'plumbing',
    status: 'completed',
    service: {
      id: 'plumbing-1',
      name: 'Plumbing Repair Service',
      description: 'Expert plumbing repairs and installations',
      category: 'plumbing',
      image: '/images/services/plumbing.jpg',
      price: 15000,
      duration: 2,
    },
    provider: {
      id: 'provider-3',
      name: 'Ayo Plumbing Services',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayo',
      phone: '+234 805 678 9012',
      email: 'ayo@plumbing.com',
      rating: 4.7,
      completedJobs: 287,
    },
    scheduledDate: new Date('2024-01-28T10:00:00'),
    scheduledTime: '10:00 AM - 12:00 PM',
    address: '45 Admiralty Way',
    city: 'Lekki',
    state: 'Lagos',
    notes: 'Leaking kitchen sink and bathroom faucet',
    propertyId: 'prop-1',
    propertyName: '2 Bedroom Apartment',
    payment: {
      amount: 15000,
      status: 'completed',
      paidAt: new Date('2024-01-28T12:30:00'),
      method: 'cash',
    },
    startedAt: new Date('2024-01-28T10:15:00'),
    completedAt: new Date('2024-01-28T12:20:00'),
    rating: 5,
    review: 'Excellent service! Very professional and fixed everything quickly.',
    timeline: [
      { status: 'pending', timestamp: new Date('2024-01-25T15:00:00'), note: 'Service requested' },
      { status: 'confirmed', timestamp: new Date('2024-01-26T09:00:00'), note: 'Booking confirmed' },
      { status: 'in_progress', timestamp: new Date('2024-01-28T10:15:00'), note: 'Service started' },
      { status: 'completed', timestamp: new Date('2024-01-28T12:20:00'), note: 'Service completed successfully' },
    ],
    createdAt: new Date('2024-01-25T15:00:00'),
    updatedAt: new Date('2024-01-28T12:30:00'),
  },
  {
    id: 'service-4',
    userId: 'user-1',
    serviceId: 'painting-1',
    providerId: 'provider-4',
    type: 'painting',
    status: 'pending',
    service: {
      id: 'painting-1',
      name: 'Interior Painting Service',
      description: 'Professional interior painting for homes',
      category: 'painting',
      image: '/images/services/painting.jpg',
      price: 120000,
      duration: 16,
    },
    provider: {
      id: 'provider-4',
      name: 'ColorMasters Painting',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Color',
      phone: '+234 807 890 1234',
      email: 'info@colormasters.com',
      rating: 4.6,
      completedJobs: 198,
    },
    scheduledDate: new Date('2024-03-05T08:00:00'),
    scheduledTime: '08:00 AM - 04:00 PM (2 days)',
    address: '12 Ogudu Road',
    city: 'Ikeja',
    state: 'Lagos',
    notes: 'Need to paint entire 3-bedroom apartment. Prefer neutral colors.',
    propertyId: 'prop-2',
    propertyName: '3 Bedroom Duplex',
    payment: {
      amount: 120000,
      status: 'pending',
    },
    timeline: [
      { status: 'pending', timestamp: new Date('2024-02-20T13:00:00'), note: 'Painting service requested' },
    ],
    createdAt: new Date('2024-02-20T13:00:00'),
    updatedAt: new Date('2024-02-20T13:00:00'),
  },
  {
    id: 'service-5',
    userId: 'user-1',
    serviceId: 'fumigation-1',
    providerId: 'provider-5',
    type: 'cleaning',
    status: 'cancelled',
    service: {
      id: 'fumigation-1',
      name: 'Pest Control & Fumigation',
      description: 'Complete pest control and fumigation service',
      category: 'cleaning',
      image: '/images/services/fumigation.jpg',
      price: 18000,
      duration: 3,
    },
    provider: {
      id: 'provider-5',
      name: 'PestAway Solutions',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pest',
      phone: '+234 809 012 3456',
      email: 'contact@pestaway.com',
      rating: 4.5,
      completedJobs: 412,
    },
    scheduledDate: new Date('2024-02-10T14:00:00'),
    scheduledTime: '02:00 PM - 05:00 PM',
    address: '45 Admiralty Way',
    city: 'Lekki',
    state: 'Lagos',
    notes: 'Cockroach problem in kitchen',
    propertyId: 'prop-1',
    propertyName: '2 Bedroom Apartment',
    payment: {
      amount: 18000,
      status: 'refunded',
      paidAt: new Date('2024-02-08T11:00:00'),
      method: 'card',
    },
    timeline: [
      { status: 'pending', timestamp: new Date('2024-02-07T16:30:00'), note: 'Service requested' },
      { status: 'confirmed', timestamp: new Date('2024-02-08T10:00:00'), note: 'Booking confirmed' },
      { status: 'cancelled', timestamp: new Date('2024-02-09T12:00:00'), note: 'Cancelled by customer' },
    ],
    cancelledAt: new Date('2024-02-09T12:00:00'),
    cancellationReason: 'Found alternative solution',
    createdAt: new Date('2024-02-07T16:30:00'),
    updatedAt: new Date('2024-02-09T12:00:00'),
  },
]
