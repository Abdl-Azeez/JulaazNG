/**
 * Landlord Dashboard Mock Data
 * Matches backend API specification from BACKEND_API_SPEC.md
 */

import type { ApiResponse } from '@/shared/types/common.types'
import type {
  LandlordProperty,
  LandlordApplication,
  EarningSnapshot,
  EarningsSummary,
} from '@/shared/types/landlord.types'
import { mockUsers } from './auth.mock'

// Define local types that aren't in the main landlord.types.ts
interface LandlordAnalytics {
  userId: string
  period: string
  overview: {
    totalProperties: number
    occupiedProperties: number
    vacantProperties: number
    totalTenants: number
    occupancyRate: number
    averageRent: number
  }
  earnings: {
    totalEarnings: number
    thisMonthEarnings: number
    lastMonthEarnings: number
    growthPercentage: number
    pendingPayments: number
    collectedPayments: number
  }
  performance: {
    totalViews: number
    totalInquiries: number
    totalApplications: number
    totalViewings: number
    conversionRate: number
    averageResponseTime: string
  }
  topPerformingProperties: Array<{
    propertyId: string
    title: string
    views: number
    applications: number
    revenue: number
  }>
  recentActivity: Array<{
    type: string
    propertyId: string
    propertyTitle: string
    timestamp: string
    description: string
  }>
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
  applicant?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    avatar?: string
  }
  property?: {
    id: string
    title: string
    thumbnail: string
    price: number
    currency: string
  }
  createdAt: string
  updatedAt: string
  approvedAt?: string
  rejectedAt?: string
}

// Sample landlord properties
export const mockLandlordProperties: LandlordProperty[] = [
  {
    id: 'prop_001',
    name: 'Luxury 3BR Apartment in Marina',
    image: 'https://picsum.photos/seed/prop1/800/600',
    location: '15 Marina Drive, Lekki, Lagos',
    status: 'active',
    applications: 3,
    priceLabel: '₦1,500,000/year',
    lastUpdated: '2024-02-10',
    occupancyRate: 0,
  },
  {
    id: 'prop_002',
    name: 'Modern 2BR in Lekki Phase 1',
    image: 'https://picsum.photos/seed/prop2/800/600',
    location: '25 Admiralty Way, Lagos',
    status: 'rented',
    applications: 1,
    priceLabel: '₦1,200,000/year',
    lastUpdated: '2024-02-08',
    occupancyRate: 100,
  },
  {
    id: 'prop_003',
    name: 'Cozy Studio in Victoria Island',
    image: 'https://picsum.photos/seed/prop3/800/600',
    location: '10 Adeola Odeku, Lagos',
    status: 'rented',
    applications: 0,
    priceLabel: '₦800,000/year',
    lastUpdated: '2024-02-05',
    occupancyRate: 100,
  },
]

// Sample property applications for landlord
export const mockLandlordApplications: PropertyApplication[] = [
  {
    id: 'app_001',
    propertyId: 'prop_001',
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
    applicant: {
      id: mockUsers.tenant1.id,
      firstName: mockUsers.tenant1.firstName,
      lastName: mockUsers.tenant1.lastName,
      email: mockUsers.tenant1.email,
      phoneNumber: mockUsers.tenant1.phoneNumber,
      avatar: mockUsers.tenant1.profilePicture,
    },
    property: {
      id: 'prop_001',
      title: 'Luxury 3BR Apartment in Marina',
      thumbnail: 'https://picsum.photos/seed/prop1/800/600',
      price: 1500000,
      currency: 'NGN',
    },
    createdAt: '2024-02-12T09:00:00Z',
    updatedAt: '2024-02-12T10:05:00Z',
  },
  {
    id: 'app_002',
    propertyId: 'prop_001',
    tenantId: 'user_tenant_003',
    landlordId: mockUsers.landlord1.id,
    status: 'under_review',
    moveInDate: '2024-02-25',
    leaseDuration: 6,
    leaseDurationUnit: 'MONTH',
    employmentStatus: 'SELF_EMPLOYED',
    monthlyIncome: 350000,
    hasGuarantor: false,
    notes: 'Short-term rental needed',
    applicant: {
      id: 'user_tenant_003',
      firstName: 'Folake',
      lastName: 'Adeleke',
      email: 'folake.adeleke@example.com',
      phoneNumber: '+2348098765432',
      avatar: 'https://i.pravatar.cc/150?img=45',
    },
    property: {
      id: 'prop_001',
      title: 'Luxury 3BR Apartment in Marina',
      thumbnail: 'https://picsum.photos/seed/prop1/800/600',
      price: 1500000,
      currency: 'NGN',
    },
    createdAt: '2024-02-11T14:00:00Z',
    updatedAt: '2024-02-12T09:30:00Z',
  },
]

// Sample landlord analytics (local type)
export const mockLandlordAnalytics: LandlordAnalytics = {
  userId: mockUsers.landlord1.id,
  period: 'LAST_30_DAYS',
  overview: {
    totalProperties: 5,
    occupiedProperties: 3,
    vacantProperties: 2,
    totalTenants: 3,
    occupancyRate: 60,
    averageRent: 1250000,
  },
  earnings: {
    totalEarnings: 12500000,
    thisMonthEarnings: 4500000,
    lastMonthEarnings: 4200000,
    growthPercentage: 7.1,
    pendingPayments: 1500000,
    collectedPayments: 11000000,
  },
  performance: {
    totalViews: 890,
    totalInquiries: 45,
    totalApplications: 18,
    totalViewings: 32,
    conversionRate: 11.25,
    averageResponseTime: '2.5 hours',
  },
  topPerformingProperties: [
    {
      propertyId: 'prop_001',
      title: 'Luxury 3BR Apartment in Marina',
      views: 142,
      applications: 5,
      revenue: 4500000,
    },
    {
      propertyId: 'prop_002',
      title: 'Modern 2BR in Lekki Phase 1',
      views: 85,
      applications: 3,
      revenue: 3600000,
    },
  ],
  recentActivity: [
    {
      type: 'NEW_APPLICATION',
      propertyId: 'prop_001',
      propertyTitle: 'Luxury 3BR Apartment in Marina',
      timestamp: '2024-02-12T09:00:00Z',
      description: 'New application from Chidinma Okafor',
    },
    {
      type: 'VIEWING_SCHEDULED',
      propertyId: 'prop_001',
      propertyTitle: 'Luxury 3BR Apartment in Marina',
      timestamp: '2024-02-10T14:20:00Z',
      description: 'Viewing scheduled for Feb 15, 2024',
    },
    {
      type: 'PAYMENT_RECEIVED',
      propertyId: 'prop_002',
      propertyTitle: 'Modern 2BR in Lekki Phase 1',
      timestamp: '2024-02-01T10:30:00Z',
      description: 'Rent payment received - ₦1,200,000',
    },
  ],
  updatedAt: new Date().toISOString(),
}

// Sample earnings snapshots
export const mockEarningSnapshots: EarningSnapshot[] = [
  {
    id: 'earn_001',
    propertyId: 'prop_001',
    propertyName: 'Luxury 3BR Apartment in Marina',
    tenantName: 'Chidinma Okafor',
    amount: 1500000,
    status: 'received',
    dueDate: '2024-02-01',
    paidDate: '2024-02-01',
    bookingType: 'annual',
  },
  {
    id: 'earn_002',
    propertyId: 'prop_002',
    propertyName: 'Modern 2BR in Lekki Phase 1',
    tenantName: 'Yusuf Ibrahim',
    amount: 1200000,
    status: 'upcoming',
    dueDate: '2024-03-01',
    bookingType: 'annual',
  },
  {
    id: 'earn_003',
    propertyId: 'prop_003',
    propertyName: 'Cozy Studio in Victoria Island',
    tenantName: 'Grace Okonkwo',
    amount: 800000,
    status: 'overdue',
    dueDate: '2024-02-15',
    bookingType: 'annual',
  },
]

// Sample earnings summary
export const mockEarningsSummary: EarningsSummary = {
  totalMonth: 4500000,
  upcoming: 1200000,
  overdue: 800000,
  shortletShare: 15,
}

// API Response Mocks
export const mockLandlordPropertiesResponse: ApiResponse<{
  properties: LandlordProperty[]
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
    properties: mockLandlordProperties,
    pagination: {
      page: 1,
      limit: 10,
      total: mockLandlordProperties.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Landlord properties retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockLandlordApplicationsResponse: ApiResponse<{
  applications: PropertyApplication[]
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
    applications: mockLandlordApplications,
    pagination: {
      page: 1,
      limit: 20,
      total: mockLandlordApplications.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Applications retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockLandlordAnalyticsResponse: ApiResponse<LandlordAnalytics> = {
  success: true,
  data: mockLandlordAnalytics,
  message: 'Analytics data retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockApproveApplicationResponse: ApiResponse<PropertyApplication> = {
  success: true,
  data: { ...mockLandlordApplications[0], status: 'approved', approvedAt: new Date().toISOString() },
  message: 'Application approved successfully',
  timestamp: new Date().toISOString(),
}

export const mockRejectApplicationResponse: ApiResponse<PropertyApplication> = {
  success: true,
  data: { ...mockLandlordApplications[0], status: 'rejected', rejectedAt: new Date().toISOString() },
  message: 'Application rejected',
  timestamp: new Date().toISOString(),
}

export const mockPropertyPerformanceResponse: ApiResponse<{
  propertyId: string
  analytics: {
    views: { date: string; count: number }[]
    inquiries: { date: string; count: number }[]
    applications: { date: string; count: number }[]
    revenue: { month: string; amount: number }[]
  }
}> = {
  success: true,
  data: {
    propertyId: 'prop_001',
    analytics: {
      views: [
        { date: '2024-02-01', count: 12 },
        { date: '2024-02-02', count: 8 },
        { date: '2024-02-03', count: 15 },
      ],
      inquiries: [
        { date: '2024-02-01', count: 2 },
        { date: '2024-02-02', count: 1 },
        { date: '2024-02-03', count: 3 },
      ],
      applications: [
        { date: '2024-02-12', count: 1 },
        { date: '2024-02-11', count: 1 },
      ],
      revenue: [
        { month: '2024-01', amount: 4500000 },
        { month: '2024-02', amount: 1500000 },
      ],
    },
  },
  message: 'Property performance data retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockEarningsResponse: ApiResponse<{
  summary: EarningsSummary
  snapshots: EarningSnapshot[]
}> = {
  success: true,
  data: {
    summary: mockEarningsSummary,
    snapshots: mockEarningSnapshots,
  },
  message: 'Earnings data retrieved successfully',
  timestamp: new Date().toISOString(),
}

// ============================================================
// UI-SPECIFIC LANDLORD DATA
// Migrated from: pages/landlord/data/
// ============================================================

import home1 from '@/assets/images/home1.jpg'
import home2 from '@/assets/images/home2.jpg'
import home3 from '@/assets/images/home3.jpg'
import home4 from '@/assets/images/home4.jpg'
// LandlordProperty and LandlordApplication already imported at top of file

// From sample-landlord-properties.ts
export const landlordProperties: LandlordProperty[] = [
  {
    id: 'prop-101',
    name: 'Viva Residency',
    image: home1,
    location: 'Lekki Phase 1, Lagos',
    status: 'active',
    applications: 10,
    priceLabel: '₦2.4M / year',
    lastUpdated: '2 hours ago',
    occupancyRate: 95,
  },
  {
    id: 'prop-102',
    name: 'Palmgrove Court',
    image: home2,
    location: 'Victoria Island, Lagos',
    status: 'rented',
    applications: 4,
    priceLabel: '₦1.8M / year',
    lastUpdated: '1 day ago',
    occupancyRate: 100,
  },
  {
    id: 'prop-103',
    name: 'Lekki Haven',
    image: home3,
    location: 'Lekki Phase 2, Lagos',
    status: 'inactive',
    applications: 2,
    priceLabel: '₦950K / year',
    lastUpdated: '5 days ago',
    occupancyRate: 0,
  },
  {
    id: 'prop-104',
    name: 'Ojodu Place',
    image: home4,
    location: 'Ikeja GRA, Lagos',
    status: 'reserved',
    applications: 20,
    priceLabel: '₦1.2M / year',
    lastUpdated: '12 hours ago',
    occupancyRate: 75,
  },
]

// From sample-applications.ts
export const landlordApplications: LandlordApplication[] = [
  {
    id: 'application-1',
    propertyId: 'prop-104',
    propertyName: 'Ojodu Place',
    applicantName: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    submittedAt: '2025-09-04T09:30:00Z',
    status: 'pending',
    moveInDate: '2025-09-18',
    offerAmount: 1800000,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    sqft: 600,
    messagePreview: 'I love the natural light in the living room. Hoping to schedule an in-person viewing this weekend.',
  },
  {
    id: 'application-2',
    propertyId: 'prop-101',
    propertyName: 'Viva Residency',
    applicantName: 'Ibukun Awosika',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ibukun',
    submittedAt: '2025-09-03T13:45:00Z',
    status: 'approved',
    moveInDate: '2025-09-10',
    offerAmount: 2400000,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    sqft: 820,
    messagePreview: 'Documents attached. Ready to proceed with agreement once inspection feedback is confirmed.',
  },
  {
    id: 'application-3',
    propertyId: 'prop-102',
    propertyName: 'Palmgrove Court',
    applicantName: 'Samuel Eze',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel',
    submittedAt: '2025-08-31T17:10:00Z',
    status: 'rejected',
    moveInDate: '2025-09-20',
    offerAmount: 1850000,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    sqft: 540,
    messagePreview: 'Thanks for the consideration. Kindly keep me in the loop if another unit becomes available.',
  },
  {
    id: 'application-4',
    propertyId: 'prop-104',
    propertyName: 'Ojodu Place',
    applicantName: 'Bola Tinubu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bola',
    submittedAt: '2025-09-02T10:00:00Z',
    status: 'pending',
    moveInDate: '2025-09-25',
    offerAmount: 1750000,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    sqft: 600,
    messagePreview: 'Relocating from Abuja, looking for something long term with a good neighborhood.',
  },
]

// From sample-earnings.ts
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

// From sample-landlord-property-details.ts
import type { LandlordPropertyDetail } from '@/shared/types/landlord.types'

export const landlordPropertyDetails: Record<string, LandlordPropertyDetail> = {
  'prop-101': {
    id: 'prop-101',
    name: 'Viva Residency',
    image: home1,
    gallery: [home1, home2, home3],
    price: 2400000,
    address: '12 Olaiya Street, Lekki Phase 1, Lagos, Nigeria',
    type: 'Apartment',
    size: 820,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    description: 'A contemporary serviced apartment with panoramic lagoon views, chef-ready kitchen, and concierge support.',
    applicationsCount: 3,
    latestApplicant: { name: 'John Doe', status: 'pending' },
    tenant: { name: 'Jane Smith', period: 'Jan - Dec 2025', contactMethod: 'Chat' },
    payment: { lastPaymentStatus: 'Paid (Sep 2025)', lastPaymentDate: '2025-09-02' },
    documents: [
      { id: 'doc-1', name: 'Tenancy_Agreement.pdf' },
      { id: 'doc-2', name: 'Utility_Bill_August.pdf' },
    ],
  },
  'prop-102': {
    id: 'prop-102',
    name: 'Palmgrove Court',
    image: home2,
    gallery: [home2, home4, home1],
    price: 1800000,
    address: '88 Adetokunbo Ademola, Victoria Island, Lagos',
    type: 'Penthouse',
    size: 540,
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    description: 'Stylish penthouse with skyline terrace, smart lighting, and weekly housekeeping for corporate tenants.',
    applicationsCount: 1,
    latestApplicant: { name: 'Ibukun Awosika', status: 'approved' },
    tenant: { name: 'Kingsley Ade', period: 'Apr 2024 - Mar 2025', contactMethod: 'Chat' },
    payment: { lastPaymentStatus: 'Paid (Aug 2025)', lastPaymentDate: '2025-08-28' },
    documents: [
      { id: 'doc-1', name: 'Signed_Agreement.pdf' },
      { id: 'doc-2', name: 'Inventory_Checklist.pdf' },
    ],
  },
  'prop-103': {
    id: 'prop-103',
    name: 'Lekki Haven',
    image: home3,
    gallery: [home3, home2, home4],
    price: 950000,
    address: '2 Prince Adelowo Adedeji, Lekki Phase 2, Lagos',
    type: 'Townhouse',
    size: 600,
    bedrooms: 3,
    bathrooms: 3,
    parking: 1,
    description: 'Townhouse in a gated estate with solar backup, dedicated workspace, and children play area.',
    applicationsCount: 0,
    latestApplicant: null,
    tenant: undefined,
    payment: undefined,
    documents: [{ id: 'doc-1', name: 'Listing_Brochure.pdf' }],
  },
  'prop-104': {
    id: 'prop-104',
    name: 'Ojodu Place',
    image: home4,
    gallery: [home4, home1, home2],
    price: 1200000,
    address: '15 Isaac John Street, Ikeja GRA, Lagos',
    type: 'Duplex',
    size: 760,
    bedrooms: 4,
    bathrooms: 4,
    parking: 3,
    description: 'Family-friendly duplex with landscaped garden, smart gate access, and backup water treatment.',
    applicationsCount: 5,
    latestApplicant: { name: 'Gloria Nwachukwu', status: 'pending' },
    tenant: { name: 'Obinna Okoye', period: 'Jul 2024 - Jun 2025', contactMethod: 'Chat' },
    payment: { lastPaymentStatus: 'Upcoming (Oct 2025)', lastPaymentDate: '2025-07-01' },
    documents: [
      { id: 'doc-1', name: 'Maintenance_Report.pdf' },
      { id: 'doc-2', name: 'Insurance_Cover_Nov.pdf' },
    ],
  },
}
