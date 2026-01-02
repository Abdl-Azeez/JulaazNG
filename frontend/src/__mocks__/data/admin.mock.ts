/**
 * Admin Dashboard Mock Data
 * Matches backend API specification from BACKEND_API_SPEC.md
 */

import type { ApiResponse } from '@/shared/types/common.types'
import type {
  AdminAnalytics,
  AdminUser,
  AdminReport,
  AdminPendingApproval,
  SystemSettings,
} from '@/shared/types/admin.types'
import { mockUsers } from './auth.mock'

// Sample admin analytics
export const mockAdminAnalytics: AdminAnalytics = {
  period: 'LAST_30_DAYS',
  users: {
    total: 12547,
    active: 8932,
    new: 342,
    tenants: 7821,
    landlords: 2134,
    serviceProviders: 892,
    artisans: 543,
    handymen: 89,
    homerunners: 68,
    growth: {
      percentage: 12.5,
      trend: 'UP',
    },
  },
  properties: {
    total: 4821,
    active: 3912,
    occupied: 2456,
    vacant: 1456,
    pending: 234,
    verified: 3687,
    featured: 145,
    occupancyRate: 62.8,
    growth: {
      percentage: 8.3,
      trend: 'UP',
    },
  },
  bookings: {
    total: 2345,
    confirmed: 1823,
    pending: 412,
    cancelled: 110,
    conversionRate: 77.7,
    growth: {
      percentage: 15.2,
      trend: 'UP',
    },
  },
  revenue: {
    total: 125000000,
    commissions: 6250000,
    serviceFees: 3125000,
    subscriptionFees: 1875000,
    growth: {
      percentage: 18.7,
      trend: 'UP',
    },
    byCategory: [
      { category: 'Property Rental', amount: 87500000 },
      { category: 'Services', amount: 25000000 },
      { category: 'Subscriptions', amount: 12500000 },
    ],
  },
  services: {
    total: 1892,
    completed: 1456,
    inProgress: 298,
    pending: 138,
    completionRate: 77.0,
    growth: {
      percentage: 22.3,
      trend: 'UP',
    },
  },
  topCategories: [
    { name: 'Apartments', count: 2134, percentage: 44.3 },
    { name: 'Plumbing', count: 456, percentage: 24.1 },
    { name: 'Electrical', count: 389, percentage: 20.6 },
  ],
  recentActivity: [
    {
      type: 'NEW_USER',
      userId: 'user_new_001',
      userName: 'John Doe',
      timestamp: '2024-02-14T10:30:00Z',
      description: 'New tenant registered',
    },
    {
      type: 'NEW_PROPERTY',
      propertyId: 'prop_new_001',
      propertyTitle: 'Luxury Villa in Ikoyi',
      timestamp: '2024-02-14T09:15:00Z',
      description: 'New property listed',
    },
    {
      type: 'PAYMENT',
      paymentId: 'pay_new_001',
      amount: 2500000,
      timestamp: '2024-02-14T08:45:00Z',
      description: 'Payment received',
    },
  ],
  updatedAt: new Date().toISOString(),
}

// Sample admin users list
export const mockAdminUsers: AdminUser[] = [
  {
    id: mockUsers.tenant1.id,
    firstName: mockUsers.tenant1.firstName,
    lastName: mockUsers.tenant1.lastName,
    email: mockUsers.tenant1.email,
    phoneNumber: mockUsers.tenant1.phoneNumber,
    roles: mockUsers.tenant1.roles,
    status: String(mockUsers.tenant1.status || 'active'),
    emailVerified: mockUsers.tenant1.isEmailVerified,
    phoneVerified: mockUsers.tenant1.isPhoneVerified,
    avatar: mockUsers.tenant1.avatar || mockUsers.tenant1.profilePicture,
    lastLogin: '2024-02-13T18:30:00Z',
    totalBookings: 5,
    totalSpent: 4500000,
    createdAt: String(mockUsers.tenant1.createdAt),
    updatedAt: String(mockUsers.tenant1.updatedAt),
  },
  {
    id: mockUsers.landlord1.id,
    firstName: mockUsers.landlord1.firstName,
    lastName: mockUsers.landlord1.lastName,
    email: mockUsers.landlord1.email,
    phoneNumber: mockUsers.landlord1.phoneNumber,
    roles: mockUsers.landlord1.roles,
    status: String(mockUsers.landlord1.status || 'active'),
    emailVerified: mockUsers.landlord1.isEmailVerified,
    phoneVerified: mockUsers.landlord1.isPhoneVerified,
    avatar: mockUsers.landlord1.avatar || mockUsers.landlord1.profilePicture,
    lastLogin: '2024-02-13T15:00:00Z',
    totalProperties: 5,
    totalEarnings: 12500000,
    createdAt: String(mockUsers.landlord1.createdAt),
    updatedAt: String(mockUsers.landlord1.updatedAt),
  },
]

// Sample pending approvals
export const mockPendingApprovals: AdminPendingApproval[] = [
  {
    id: 'approval_001',
    type: 'PROPERTY_VERIFICATION',
    entityId: 'prop_004',
    entityType: 'PROPERTY',
    title: 'Property Verification Required',
    description: 'New property listing needs verification',
    submittedBy: {
      id: mockUsers.landlord1.id,
      name: `${mockUsers.landlord1.firstName} ${mockUsers.landlord1.lastName}`,
      email: mockUsers.landlord1.email,
    },
    data: {
      propertyId: 'prop_004',
      propertyTitle: 'Cozy 1BR Apartment in Lekki',
      address: '45 Admiralty Way, Lekki Phase 1',
      documents: [
        { type: 'OWNERSHIP_PROOF', url: 'https://example.com/ownership.pdf' },
        { type: 'PROPERTY_PHOTOS', url: 'https://example.com/photos.zip' },
      ],
    },
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: '2024-02-13T10:00:00Z',
    updatedAt: '2024-02-13T10:00:00Z',
  },
  {
    id: 'approval_002',
    type: 'SERVICE_PROVIDER_VERIFICATION',
    entityId: 'sp_004',
    entityType: 'SERVICE_PROVIDER',
    title: 'Service Provider Verification',
    description: 'New service provider needs background verification',
    submittedBy: {
      id: 'user_sp_004',
      name: 'Ahmed Bello',
      email: 'ahmed@example.com',
    },
    data: {
      providerId: 'sp_004',
      businessName: 'Pro Painters',
      category: 'Painting',
      certifications: ['Professional Painter Certified'],
      yearsOfExperience: 6,
    },
    status: 'PENDING',
    priority: 'MEDIUM',
    createdAt: '2024-02-12T14:30:00Z',
    updatedAt: '2024-02-12T14:30:00Z',
  },
  {
    id: 'approval_003',
    type: 'PAYOUT_REQUEST',
    entityId: 'payout_003',
    entityType: 'PAYOUT',
    title: 'Payout Request Approval',
    description: 'Landlord requesting payout',
    submittedBy: {
      id: mockUsers.landlord1.id,
      name: `${mockUsers.landlord1.firstName} ${mockUsers.landlord1.lastName}`,
      email: mockUsers.landlord1.email,
    },
    data: {
      payoutId: 'payout_003',
      amount: 3500000,
      currency: 'NGN',
      bankAccount: {
        accountNumber: '0123456789',
        bankName: 'Access Bank',
        accountName: 'Adebayo Okonkwo',
      },
    },
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: '2024-02-14T09:00:00Z',
    updatedAt: '2024-02-14T09:00:00Z',
  },
]

// Sample admin reports
export const mockAdminReports: AdminReport[] = [
  {
    id: 'report_001',
    type: 'USER_REPORT',
    reportedBy: {
      id: mockUsers.tenant1.id,
      name: `${mockUsers.tenant1.firstName} ${mockUsers.tenant1.lastName}`,
    },
    reportedEntity: {
      id: 'user_landlord_002',
      type: 'USER',
      name: 'Suspicious Landlord',
    },
    reason: 'FRAUD',
    description: 'Requesting payment outside platform',
    evidence: [
      { type: 'SCREENSHOT', url: 'https://example.com/evidence1.png' },
      { type: 'CHAT_LOG', url: 'https://example.com/chat.pdf' },
    ],
    status: 'UNDER_REVIEW',
    priority: 'HIGH',
    assignedTo: 'admin_001',
    createdAt: '2024-02-13T16:00:00Z',
    updatedAt: '2024-02-13T17:00:00Z',
  },
  {
    id: 'report_002',
    type: 'PROPERTY_REPORT',
    reportedBy: {
      id: 'user_tenant_004',
      name: 'Jane Smith',
    },
    reportedEntity: {
      id: 'prop_005',
      type: 'PROPERTY',
      name: 'Fake Property Listing',
    },
    reason: 'MISLEADING_INFO',
    description: 'Property photos do not match actual property',
    evidence: [
      { type: 'PHOTO_COMPARISON', url: 'https://example.com/comparison.png' },
    ],
    status: 'RESOLVED',
    priority: 'MEDIUM',
    assignedTo: 'admin_002',
    resolution: 'Property delisted and landlord warned',
    resolvedAt: '2024-02-12T14:00:00Z',
    createdAt: '2024-02-11T10:00:00Z',
    updatedAt: '2024-02-12T14:00:00Z',
  },
]

// Sample system settings
export const mockSystemSettings: SystemSettings = {
  general: {
    siteName: 'JulaazNG',
    siteUrl: 'https://julaaz.ng',
    supportEmail: 'support@julaaz.ng',
    maintenanceMode: false,
  },
  payments: {
    platformFeePercentage: 5.0,
    serviceFeePercentage: 2.5,
    paymentGateways: ['PAYSTACK', 'FLUTTERWAVE'],
    defaultCurrency: 'NGN',
    minimumWithdrawal: 10000,
    withdrawalProcessingDays: 3,
  },
  bookings: {
    autoConfirmViewings: false,
    viewingCancellationHours: 24,
    applicationExpiryDays: 30,
    maxSimultaneousApplications: 5,
  },
  verification: {
    requireEmailVerification: true,
    requirePhoneVerification: true,
    requireIdVerification: false,
    autoVerifyProperties: false,
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    defaultChannel: 'IN_APP',
  },
  security: {
    sessionTimeoutMinutes: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
    twoFactorEnabled: false,
  },
  updatedAt: new Date().toISOString(),
}

// API Response Mocks
export const mockAdminAnalyticsResponse: ApiResponse<AdminAnalytics> = {
  success: true,
  data: mockAdminAnalytics,
  message: 'Admin analytics retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockAdminUsersResponse: ApiResponse<{
  users: AdminUser[]
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
    users: mockAdminUsers,
    pagination: {
      page: 1,
      limit: 20,
      total: mockAdminUsers.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Users retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockPendingApprovalsResponse: ApiResponse<{
  approvals: AdminPendingApproval[]
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
    approvals: mockPendingApprovals,
    pagination: {
      page: 1,
      limit: 20,
      total: mockPendingApprovals.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Pending approvals retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockAdminReportsResponse: ApiResponse<{
  reports: AdminReport[]
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
    reports: mockAdminReports,
    pagination: {
      page: 1,
      limit: 20,
      total: mockAdminReports.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Reports retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockSystemSettingsResponse: ApiResponse<SystemSettings> = {
  success: true,
  data: mockSystemSettings,
  message: 'System settings retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockApproveEntityResponse: ApiResponse<AdminPendingApproval> = {
  success: true,
  data: { ...mockPendingApprovals[0], status: 'APPROVED', approvedAt: new Date().toISOString() },
  message: 'Entity approved successfully',
  timestamp: new Date().toISOString(),
}

export const mockRejectEntityResponse: ApiResponse<AdminPendingApproval> = {
  success: true,
  data: { ...mockPendingApprovals[0], status: 'REJECTED', rejectedAt: new Date().toISOString() },
  message: 'Entity rejected',
  timestamp: new Date().toISOString(),
}

export const mockUpdateUserStatusResponse: ApiResponse<AdminUser> = {
  success: true,
  data: { ...mockAdminUsers[0], status: 'SUSPENDED' },
  message: 'User status updated successfully',
  timestamp: new Date().toISOString(),
}

export const mockUpdateSettingsResponse: ApiResponse<SystemSettings> = {
  success: true,
  data: mockSystemSettings,
  message: 'System settings updated successfully',
  timestamp: new Date().toISOString(),
}

// ============================================================
// UI-SPECIFIC TYPES & DATA (for Admin Pages)
// Migrated from: pages/admin/data/sample-admin-data.ts
// ============================================================

export interface PendingApproval {
  id: string
  type: 'property' | 'user' | 'service_provider' | 'homerunner' | 'withdrawal'
  title: string
  description: string
  submittedBy: string
  submittedAt: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  details?: Record<string, string>
}

export interface SystemStats {
  totalUsers: number
  totalProperties: number
  totalBookings: number
  totalRevenue: number
  activeListings: number
  pendingApprovals: number
  monthlyGrowth: number
  conversionRate: number
}

export interface UserStats {
  tenants: number
  landlords: number
  serviceProviders: number
  homerunners: number
  artisans: number
  handymen: number
}

export interface RecentActivity {
  id: string
  type: 'user_signup' | 'property_listed' | 'booking_completed' | 'payment_received' | 'dispute_raised' | 'approval_needed'
  title: string
  description: string
  timestamp: string
  user?: string
  amount?: number
}

export interface AnalyticsData {
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  bookings: {
    total: number
    thisMonth: number
    pending: number
    completed: number
    cancelled: number
  }
  users: {
    total: number
    newThisMonth: number
    active: number
    verified: number
  }
  properties: {
    total: number
    active: number
    pending: number
    rented: number
  }
}

export const samplePendingApprovals: PendingApproval[] = [
  {
    id: 'apr-001',
    type: 'property',
    title: '4 Bedroom Duplex - Victoria Island',
    description: 'New property listing awaiting inspection verification',
    submittedBy: 'Chief Adeleke',
    submittedAt: '2 hours ago',
    status: 'pending',
    priority: 'high',
    details: {
      location: 'Victoria Island, Lagos',
      price: '₦8,500,000/year',
      type: 'Duplex',
    },
  },
  {
    id: 'apr-002',
    type: 'homerunner',
    title: 'Homerunner Application - Adebayo Johnson',
    description: 'New homerunner application with completed background check',
    submittedBy: 'Adebayo Johnson',
    submittedAt: '5 hours ago',
    status: 'under_review',
    priority: 'medium',
    details: {
      experience: '3 years real estate',
      location: 'Lagos Mainland',
      rating: 'N/A (New)',
    },
  },
  {
    id: 'apr-003',
    type: 'service_provider',
    title: 'Service Provider - CleanPro Services',
    description: 'Cleaning service company verification pending',
    submittedBy: 'CleanPro Services Ltd',
    submittedAt: '1 day ago',
    status: 'pending',
    priority: 'medium',
    details: {
      services: 'Deep cleaning, Move-in/out',
      employees: '15 staff',
      coverage: 'Lagos, Abuja',
    },
  },
  {
    id: 'apr-004',
    type: 'withdrawal',
    title: 'Withdrawal Request - ₦450,000',
    description: 'Landlord earnings withdrawal to bank account',
    submittedBy: 'Mrs. Okonkwo',
    submittedAt: '3 hours ago',
    status: 'pending',
    priority: 'high',
    details: {
      bank: 'GTBank',
      account: '****5678',
      earnings: '₦1,200,000 available',
    },
  },
  {
    id: 'apr-005',
    type: 'property',
    title: '2 Bedroom Apartment - Lekki Phase 1',
    description: 'Property listing update requires re-verification',
    submittedBy: 'Engr. Balogun',
    submittedAt: '6 hours ago',
    status: 'pending',
    priority: 'low',
    details: {
      location: 'Lekki Phase 1, Lagos',
      price: '₦3,500,000/year',
      change: 'Price updated',
    },
  },
]

export const sampleSystemStats: SystemStats = {
  totalUsers: 24580,
  totalProperties: 3420,
  totalBookings: 8956,
  totalRevenue: 458000000,
  activeListings: 2890,
  pendingApprovals: 23,
  monthlyGrowth: 12.5,
  conversionRate: 34.2,
}

export const sampleUserStats: UserStats = {
  tenants: 18500,
  landlords: 4200,
  serviceProviders: 890,
  homerunners: 156,
  artisans: 720,
  handymen: 114,
}

export const sampleRecentActivities: RecentActivity[] = [
  {
    id: 'act-001',
    type: 'booking_completed',
    title: 'Booking Completed',
    description: '3 Bedroom Flat signed - 1 year lease',
    timestamp: '10 minutes ago',
    user: 'Mr. Chukwuemeka',
    amount: 4500000,
  },
  {
    id: 'act-002',
    type: 'user_signup',
    title: 'New Landlord Registration',
    description: 'Property owner from Ikoyi joined the platform',
    timestamp: '25 minutes ago',
    user: 'Dr. Fashola',
  },
  {
    id: 'act-003',
    type: 'property_listed',
    title: 'New Property Listed',
    description: '5 Bedroom Mansion in Banana Island',
    timestamp: '1 hour ago',
    user: 'Chief Okoro',
    amount: 25000000,
  },
  {
    id: 'act-004',
    type: 'payment_received',
    title: 'Payment Received',
    description: 'Rent payment for Studio Apartment',
    timestamp: '2 hours ago',
    user: 'Miss Adaobi',
    amount: 850000,
  },
  {
    id: 'act-005',
    type: 'dispute_raised',
    title: 'Dispute Raised',
    description: 'Maintenance issue reported for Unit 4B',
    timestamp: '3 hours ago',
    user: 'Mr. Ojo',
  },
  {
    id: 'act-006',
    type: 'approval_needed',
    title: 'Homerunner Verification',
    description: 'New homerunner application needs review',
    timestamp: '4 hours ago',
    user: 'Adebayo Johnson',
  },
]

export const sampleAnalytics: AnalyticsData = {
  revenue: {
    total: 458000000,
    thisMonth: 42500000,
    lastMonth: 38200000,
    growth: 11.3,
  },
  bookings: {
    total: 8956,
    thisMonth: 324,
    pending: 89,
    completed: 7890,
    cancelled: 977,
  },
  users: {
    total: 24580,
    newThisMonth: 1240,
    active: 18650,
    verified: 21340,
  },
  properties: {
    total: 3420,
    active: 2890,
    pending: 156,
    rented: 2340,
  },
}

export const monthlyRevenueData = [
  { month: 'Jan', revenue: 28500000 },
  { month: 'Feb', revenue: 31200000 },
  { month: 'Mar', revenue: 29800000 },
  { month: 'Apr', revenue: 35400000 },
  { month: 'May', revenue: 38900000 },
  { month: 'Jun', revenue: 36200000 },
  { month: 'Jul', revenue: 39500000 },
  { month: 'Aug', revenue: 41200000 },
  { month: 'Sep', revenue: 38700000 },
  { month: 'Oct', revenue: 40100000 },
  { month: 'Nov', revenue: 42500000 },
]

export const userGrowthData = [
  { month: 'Jan', users: 18200 },
  { month: 'Feb', users: 19100 },
  { month: 'Mar', users: 19800 },
  { month: 'Apr', users: 20500 },
  { month: 'May', users: 21200 },
  { month: 'Jun', users: 21900 },
  { month: 'Jul', users: 22400 },
  { month: 'Aug', users: 23100 },
  { month: 'Sep', users: 23600 },
  { month: 'Oct', users: 24100 },
  { month: 'Nov', users: 24580 },
]

// ============================================================
// ADMIN PAGE UI-SPECIFIC MOCK DATA
// From AdminPropertiesPage, AdminServicesPage, AdminDisputesPage,
// AdminBackgroundChecksPage, AdminPaymentsPage, AdminUsersPage
// ============================================================

import home1 from '@/assets/images/home1.jpg'
import home2 from '@/assets/images/home2.jpg'
import home3 from '@/assets/images/home3.jpg'
import home4 from '@/assets/images/home4.jpg'
import home5 from '@/assets/images/home5.jpg'
import home6 from '@/assets/images/home6.jpg'
import home7 from '@/assets/images/home7.jpg'
import home8 from '@/assets/images/home8.jpg'

// ============================================================
// ADMIN PROPERTIES
// ============================================================

export interface AdminProperty {
  id: string
  title: string
  address: string
  type: 'apartment' | 'house' | 'duplex' | 'studio' | 'office'
  price: number
  landlord: string
  landlordId: string
  status: 'active' | 'pending' | 'suspended' | 'rejected'
  verified: boolean
  createdAt: string
  views: number
  bookings: number
  images: string[]
  description?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  parking?: number
  amenities?: string[]
  neighbourhood?: string
  city?: string
}

const sampleImageArray = [home1, home2, home3, home4, home5, home6, home7, home8]

export const generateAdminProperties = (): AdminProperty[] => {
  const types: AdminProperty['type'][] = ['apartment', 'house', 'duplex', 'studio', 'office']
  const statuses: AdminProperty['status'][] = ['active', 'pending', 'suspended', 'rejected']
  const landlords = ['Femi Ogunleye', 'Chioma Nwosu', 'Grace Eze', 'Kunle Balogun', 'Tosin Adeyemi', 'Aisha Mohammed', 'David Okoro']
  const addresses = ['Lekki Phase 1', 'Victoria Island', 'Ikeja GRA', 'Surulere', 'Banana Island', 'Ikoyi', 'Yaba']
  const neighbourhoods = ['Lekki', 'Victoria Island', 'Ikeja', 'Surulere', 'Banana Island', 'Ikoyi', 'Yaba']
  const amenitiesList = [
    ['24/7 Power Supply', 'Fibre Internet', 'Parking', 'CCTV'],
    ['Swimming Pool', 'Gym', 'Security', 'Water Supply'],
    ['Smart Home', 'Balcony', 'Garden', 'Elevator'],
    ['Air Conditioning', 'Heating', 'Laundry', 'Storage'],
  ]
  
  return Array.from({ length: 45 }, (_, i) => {
    const imageCount = Math.floor(Math.random() * 5) + 3
    const selectedImages = Array.from({ length: imageCount }, () => 
      sampleImageArray[Math.floor(Math.random() * sampleImageArray.length)]
    )
    
    return {
      id: `${i + 1}`,
      title: `${Math.floor(Math.random() * 5) + 1} Bedroom ${types[Math.floor(Math.random() * types.length)]}`,
      address: `${addresses[Math.floor(Math.random() * addresses.length)]}, Lagos`,
      type: types[Math.floor(Math.random() * types.length)],
      price: Math.floor(Math.random() * 15000000) + 500000,
      landlord: landlords[Math.floor(Math.random() * landlords.length)],
      landlordId: `L${String(i + 1).padStart(3, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      verified: Math.random() > 0.3,
      createdAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      views: Math.floor(Math.random() * 2000),
      bookings: Math.floor(Math.random() * 20),
      images: selectedImages,
      description: 'Beautiful property with modern amenities and great location. Perfect for families and professionals seeking comfort and convenience.',
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 4) + 1,
      area: Math.floor(Math.random() * 500) + 100,
      parking: Math.floor(Math.random() * 3) + 1,
      amenities: amenitiesList[Math.floor(Math.random() * amenitiesList.length)],
      neighbourhood: neighbourhoods[Math.floor(Math.random() * neighbourhoods.length)],
      city: 'Lagos',
    }
  })
}

export const adminProperties = generateAdminProperties()

// ============================================================
// ADMIN SERVICES
// ============================================================

export interface AdminService {
  id: string
  name: string
  category: 'electrical' | 'plumbing' | 'painting' | 'cleaning' | 'repairs'
  provider: string
  providerId: string
  status: 'active' | 'pending' | 'suspended' | 'rejected'
  verified: boolean
  rating: number
  totalBookings: number
  completedBookings: number
  price: { min: number; max: number }
  createdAt: string
  lastActive: string
  description?: string
  location?: string
}

export const generateAdminServices = (): AdminService[] => {
  const categories: AdminService['category'][] = ['electrical', 'plumbing', 'painting', 'cleaning', 'repairs']
  const statuses: AdminService['status'][] = ['active', 'pending', 'suspended', 'rejected']
  const providers = [
    'Kunle Balogun',
    'Emeka Okoro',
    'Grace Eze',
    'Sarah Ike',
    'Michael Obi',
    'David Adeyemi',
    'Chioma Nwosu',
    'Femi Ogunleye',
  ]
  const locations = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano']

  return Array.from({ length: 38 }, (_, i) => ({
    id: `service-${i + 1}`,
    name: `${categories[Math.floor(Math.random() * categories.length)]} Service ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    provider: providers[Math.floor(Math.random() * providers.length)],
    providerId: `SP${String(i + 1).padStart(3, '0')}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    verified: Math.random() > 0.3,
    rating: Math.random() > 0.2 ? Math.round((Math.random() * 2 + 3) * 10) / 10 : 0,
    totalBookings: Math.floor(Math.random() * 300),
    completedBookings: Math.floor(Math.random() * 280),
    price: {
      min: Math.floor(Math.random() * 100000) + 5000,
      max: Math.floor(Math.random() * 500000) + 50000,
    },
    createdAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split('T')[0],
    lastActive: `${Math.floor(Math.random() * 7)} days ago`,
    description: 'Professional service with excellent customer satisfaction.',
    location: locations[Math.floor(Math.random() * locations.length)],
  }))
}

export const adminServices = generateAdminServices()

// ============================================================
// ADMIN DISPUTES
// ============================================================

export interface AdminDispute {
  id: string
  reference: string
  type: 'property' | 'service' | 'payment' | 'behavior'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'pending_response' | 'resolved' | 'closed'
  complainant: {
    name: string
    role: 'tenant' | 'landlord' | 'service_provider'
  }
  respondent: {
    name: string
    role: 'tenant' | 'landlord' | 'service_provider' | 'homerunner'
  }
  subject: string
  description: string
  createdAt: string
  lastUpdated: string
  amount?: number
  messages: number
  documents?: string[]
  conversationId?: string
}

export const generateAdminDisputes = (): AdminDispute[] => {
  const types: AdminDispute['type'][] = ['property', 'service', 'payment', 'behavior']
  const statuses: AdminDispute['status'][] = ['open', 'investigating', 'pending_response', 'resolved', 'closed']
  const priorities: AdminDispute['priority'][] = ['low', 'medium', 'high', 'critical']
  const complainants = [
    { name: 'Tosin Adeyemi', role: 'tenant' as const },
    { name: 'Chioma Nwosu', role: 'tenant' as const },
    { name: 'Grace Eze', role: 'landlord' as const },
    { name: 'Adebayo Johnson', role: 'tenant' as const },
    { name: 'Emeka Okoro', role: 'tenant' as const },
    { name: 'Sarah Ike', role: 'landlord' as const },
  ]
  const respondents = [
    { name: 'Femi Ogunleye', role: 'landlord' as const },
    { name: 'Kunle Balogun', role: 'service_provider' as const },
    { name: 'Michael Obi', role: 'tenant' as const },
    { name: 'Linda Ade', role: 'landlord' as const },
    { name: 'David Okoro', role: 'service_provider' as const },
  ]
  const subjects = [
    'Property condition not as described',
    'Incomplete service work',
    'Payment not received',
    'Unprofessional communication',
    'Security deposit refund',
    'Service quality issues',
    'Contract violation',
    'Property damage claim',
  ]

  return Array.from({ length: 47 }, (_, i) => {
    const complainant = complainants[Math.floor(Math.random() * complainants.length)]
    const respondent = respondents[Math.floor(Math.random() * respondents.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]

    return {
      id: `dispute-${i + 1}`,
      reference: `DSP-2024-${String(i + 1).padStart(3, '0')}`,
      type,
      priority,
      status,
      complainant,
      respondent,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      description: `Dispute regarding ${type} issue between ${complainant.name} and ${respondent.name}.`,
      createdAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      lastUpdated: `${Math.floor(Math.random() * 7)} days ago`,
      amount: type === 'payment' ? Math.floor(Math.random() * 2000000) + 50000 : undefined,
      messages: Math.floor(Math.random() * 20) + 1,
      documents: Math.random() > 0.3 ? [`document_${i + 1}.pdf`, `evidence_${i + 1}.zip`] : undefined,
    }
  })
}

export const adminDisputes = generateAdminDisputes()

// ============================================================
// ADMIN BACKGROUND CHECKS
// ============================================================

export interface AdminBackgroundCheckDocument {
  id: string
  name: string
  type: 'identity' | 'employment' | 'financial' | 'competency' | 'workshop' | 'other'
  status: 'pending' | 'approved' | 'rejected'
  uploadedAt: string
  fileUrl?: string
  notes?: string
}

export interface AdminBackgroundCheck {
  id: string
  userId: string
  userName: string
  userEmail: string
  userRole: 'tenant' | 'landlord' | 'handyman' | 'service_provider' | 'homerunner'
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  progress: number
  submittedAt: string
  lastUpdated: string
  documents: AdminBackgroundCheckDocument[]
  formData: {
    identityNumber?: string
    monthlyIncome?: string
    occupation?: string
    employer?: string
    employmentLength?: string
    financialCommitments?: string
    competencyEvidence?: string
    authenticityNotes?: string
    workshopAddress?: string
  }
}

export const generateAdminBackgroundChecks = (): AdminBackgroundCheck[] => {
  const roles: AdminBackgroundCheck['userRole'][] = ['tenant', 'landlord', 'handyman', 'service_provider', 'homerunner']
  const statuses: AdminBackgroundCheck['status'][] = ['pending', 'in_review', 'approved', 'rejected']
  const users = [
    { name: 'Tosin Adeyemi', email: 'tosin@example.com' },
    { name: 'Kunle Balogun', email: 'kunle@example.com' },
    { name: 'Chioma Nwosu', email: 'chioma@example.com' },
    { name: 'Adebayo Johnson', email: 'adebayo@example.com' },
    { name: 'Grace Eze', email: 'grace@example.com' },
    { name: 'Femi Ogunleye', email: 'femi@example.com' },
    { name: 'Michael Obi', email: 'michael@example.com' },
    { name: 'Sarah Ike', email: 'sarah@example.com' },
  ]

  return Array.from({ length: 38 }, (_, i) => {
    const user = users[Math.floor(Math.random() * users.length)]
    const role = roles[Math.floor(Math.random() * roles.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const docCount = Math.floor(Math.random() * 5) + 3
    const approvedDocs = Math.floor(docCount * (status === 'approved' ? 1 : Math.random() * 0.8))
    const progress = Math.round((approvedDocs / docCount) * 100)

    return {
      id: `bc-${String(i + 1).padStart(3, '0')}`,
      userId: `user-${String(i + 1).padStart(3, '0')}`,
      userName: user.name,
      userEmail: user.email,
      userRole: role,
      status,
      progress,
      submittedAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      lastUpdated: `${Math.floor(Math.random() * 7)} days ago`,
      documents: Array.from({ length: docCount }, (_, j) => ({
        id: `doc-${i}-${j}`,
        name: `Document ${j + 1}`,
        type: ['identity', 'employment', 'financial', 'competency', 'workshop', 'other'][Math.floor(Math.random() * 6)] as AdminBackgroundCheckDocument['type'],
        status: j < approvedDocs ? 'approved' : 'pending' as AdminBackgroundCheckDocument['status'],
        uploadedAt: new Date(2024, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      })),
      formData: {
        identityNumber: `${String.fromCharCode(65 + (i % 26))}${String(i + 1).padStart(9, '0')}`,
        monthlyIncome: String(Math.floor(Math.random() * 500000) + 100000),
        occupation: 'Professional',
        employer: 'Company Ltd',
        employmentLength: `${Math.floor(Math.random() * 10) + 1} years`,
      },
    }
  })
}

export const adminBackgroundChecks = generateAdminBackgroundChecks()

// ============================================================
// ADMIN PAYMENTS
// ============================================================

export interface AdminPayment {
  id: string
  reference: string
  type: 'rent' | 'service' | 'commission' | 'withdrawal' | 'refund'
  services?: string[]
  amount: number
  fee: number
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  payer: string
  payerType: 'tenant' | 'landlord' | 'service_provider'
  recipient: string
  recipientType: 'landlord' | 'platform' | 'service_provider' | 'homerunner'
  method: 'card' | 'bank_transfer' | 'wallet'
  pointsRedeemed?: number
  date: string
  description: string
  transactionId?: string
  cardLast4?: string
  bankAccount?: string
}

export const generateAdminPayments = (): AdminPayment[] => {
  const types: AdminPayment['type'][] = ['rent', 'service', 'commission', 'withdrawal', 'refund']
  const statuses: AdminPayment['status'][] = ['completed', 'pending', 'failed', 'refunded']
  const methods: AdminPayment['method'][] = ['card', 'bank_transfer', 'wallet']
  const payers = ['Tosin Adeyemi', 'Chioma Nwosu', 'Grace Eze', 'Femi Ogunleye', 'Kunle Balogun', 'Michael Obi', 'Adebayo Johnson']
  const recipients = ['Femi Ogunleye', 'Kunle Balogun', 'Platform', 'Adebayo Johnson', 'Bank Account']
  const serviceCatalog = [
    'Deep Cleaning',
    'AC Servicing',
    'Plumbing Repair',
    'Electrical Fix',
    'Painting',
    'Pest Control',
    'Generator Maintenance',
  ]
  const rentCatalog = ['Monthly Rent']
  const commissionCatalog = ['Platform Commission']
  const withdrawalCatalog = ['Withdrawal']
  const refundCatalog = ['Refund']
  
  return Array.from({ length: 52 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    const services = (() => {
      switch (type) {
        case 'service':
          return [
            serviceCatalog[Math.floor(Math.random() * serviceCatalog.length)],
            ...(Math.random() > 0.75
              ? [serviceCatalog[Math.floor(Math.random() * serviceCatalog.length)]]
              : []),
          ]
        case 'rent':
          return rentCatalog
        case 'commission':
          return commissionCatalog
        case 'withdrawal':
          return withdrawalCatalog
        case 'refund':
          return refundCatalog
        default:
          return undefined
      }
    })()

    const pointsRedeemed =
      status === 'completed' && Math.random() > 0.75
        ? Math.floor(Math.random() * 2500) + 100
        : undefined

    const description =
      type === 'service' && services && services.length > 0
        ? `Payment for ${services.join(', ')}`
        : `Payment for ${type}`

    return {
      id: `pay-${i + 1}`,
      reference: `PAY-2024-${String(i + 1).padStart(6, '0')}`,
      type,
      services,
      amount: Math.floor(Math.random() * 5000000) + 10000,
      fee: Math.floor(Math.random() * 50000) + 1000,
      status,
      payer: payers[Math.floor(Math.random() * payers.length)],
      payerType: 'tenant' as const,
      recipient: recipients[Math.floor(Math.random() * recipients.length)],
      recipientType: 'landlord' as const,
      method: methods[Math.floor(Math.random() * methods.length)],
      pointsRedeemed,
      date: new Date(
        2024,
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 28) + 1,
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60)
      ).toLocaleString('en-NG'),
      description,
      transactionId: `TXN${String(i + 1).padStart(10, '0')}`,
      cardLast4: String(Math.floor(Math.random() * 9000) + 1000),
      bankAccount: `****${String(Math.floor(Math.random() * 9000) + 1000)}`,
    }
  })
}

export const adminPayments = generateAdminPayments()

// ============================================================
// ADMIN USERS
// ============================================================

export interface AdminUserBackgroundCheckDocument {
  id: string
  name: string
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted'
  submittedAt?: string
  reviewedAt?: string
}

export interface AdminUserItem {
  id: string
  name: string
  email: string
  phone: string
  role: 'tenant' | 'landlord' | 'homerunner' | 'admin' | 'handyman' | 'service_provider'
  status: 'active' | 'pending' | 'suspended' | 'banned'
  verified: boolean
  joinedAt: string
  lastActive: string
  propertiesCount?: number
  bookingsCount?: number
  viewingsRequested?: number
  currentRentals?: number
  shortletsUsed?: number
  backgroundCheck: {
    status: 'not_started' | 'in_progress' | 'completed' | 'failed'
    progress: number
    documents: AdminUserBackgroundCheckDocument[]
  }
}

export const adminUsersList: AdminUserItem[] = [
  {
    id: '1',
    name: 'Tosin Adeyemi',
    email: 'tosin@example.com',
    phone: '08012345678',
    role: 'tenant',
    status: 'active',
    verified: true,
    joinedAt: '2024-01-15',
    lastActive: '2 hours ago',
    bookingsCount: 3,
    viewingsRequested: 12,
    currentRentals: 1,
    shortletsUsed: 2,
    backgroundCheck: {
      status: 'completed',
      progress: 100,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2024-01-16', reviewedAt: '2024-01-17' },
        { id: 'd2', name: 'Proof of Address', status: 'approved', submittedAt: '2024-01-16', reviewedAt: '2024-01-17' },
        { id: 'd3', name: 'Employment Letter', status: 'approved', submittedAt: '2024-01-16', reviewedAt: '2024-01-18' },
        { id: 'd4', name: 'Bank Statement', status: 'approved', submittedAt: '2024-01-16', reviewedAt: '2024-01-18' },
      ],
    },
  },
  {
    id: '2',
    name: 'Femi Ogunleye',
    email: 'femi@example.com',
    phone: '08023456789',
    role: 'landlord',
    status: 'active',
    verified: true,
    joinedAt: '2023-11-20',
    lastActive: '1 day ago',
    propertiesCount: 5,
    backgroundCheck: {
      status: 'completed',
      progress: 100,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2023-11-21', reviewedAt: '2023-11-22' },
        { id: 'd2', name: 'Property Ownership Docs', status: 'approved', submittedAt: '2023-11-21', reviewedAt: '2023-11-23' },
        { id: 'd3', name: 'Tax Clearance', status: 'approved', submittedAt: '2023-11-22', reviewedAt: '2023-11-24' },
      ],
    },
  },
  {
    id: '3',
    name: 'Adebayo Johnson',
    email: 'adebayo@example.com',
    phone: '08034567890',
    role: 'homerunner',
    status: 'active',
    verified: true,
    joinedAt: '2024-02-01',
    lastActive: '30 minutes ago',
    backgroundCheck: {
      status: 'in_progress',
      progress: 75,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2024-02-02', reviewedAt: '2024-02-03' },
        { id: 'd2', name: 'Proof of Address', status: 'approved', submittedAt: '2024-02-02', reviewedAt: '2024-02-03' },
        { id: 'd3', name: 'Police Clearance', status: 'approved', submittedAt: '2024-02-03', reviewedAt: '2024-02-04' },
        { id: 'd4', name: 'Guarantor Form', status: 'pending', submittedAt: '2024-02-05' },
      ],
    },
  },
  {
    id: '4',
    name: 'Chioma Nwosu',
    email: 'chioma@example.com',
    phone: '08045678901',
    role: 'tenant',
    status: 'pending',
    verified: false,
    joinedAt: '2024-03-10',
    lastActive: '5 hours ago',
    bookingsCount: 1,
    viewingsRequested: 3,
    currentRentals: 0,
    shortletsUsed: 0,
    backgroundCheck: {
      status: 'in_progress',
      progress: 25,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2024-03-11', reviewedAt: '2024-03-12' },
        { id: 'd2', name: 'Proof of Address', status: 'pending', submittedAt: '2024-03-12' },
        { id: 'd3', name: 'Employment Letter', status: 'not_submitted' },
        { id: 'd4', name: 'Bank Statement', status: 'not_submitted' },
      ],
    },
  },
  {
    id: '5',
    name: 'Kunle Balogun',
    email: 'kunle@example.com',
    phone: '08056789012',
    role: 'handyman',
    status: 'suspended',
    verified: true,
    joinedAt: '2023-12-05',
    lastActive: '3 days ago',
    backgroundCheck: {
      status: 'failed',
      progress: 50,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2023-12-06', reviewedAt: '2023-12-07' },
        { id: 'd2', name: 'Skill Certification', status: 'rejected', submittedAt: '2023-12-06', reviewedAt: '2023-12-08' },
        { id: 'd3', name: 'Police Clearance', status: 'not_submitted' },
      ],
    },
  },
  {
    id: '6',
    name: 'Grace Eze',
    email: 'grace@example.com',
    phone: '08067890123',
    role: 'service_provider',
    status: 'active',
    verified: true,
    joinedAt: '2024-01-28',
    lastActive: '1 hour ago',
    backgroundCheck: {
      status: 'completed',
      progress: 100,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2024-01-29', reviewedAt: '2024-01-30' },
        { id: 'd2', name: 'Business Registration', status: 'approved', submittedAt: '2024-01-29', reviewedAt: '2024-01-31' },
        { id: 'd3', name: 'Service License', status: 'approved', submittedAt: '2024-01-30', reviewedAt: '2024-02-01' },
      ],
    },
  },
  {
    id: '7',
    name: 'Emeka Obi',
    email: 'emeka@example.com',
    phone: '08078901234',
    role: 'tenant',
    status: 'active',
    verified: true,
    joinedAt: '2024-02-15',
    lastActive: '4 hours ago',
    bookingsCount: 2,
    viewingsRequested: 8,
    currentRentals: 1,
    shortletsUsed: 0,
    backgroundCheck: {
      status: 'completed',
      progress: 100,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2024-02-16', reviewedAt: '2024-02-17' },
        { id: 'd2', name: 'Proof of Address', status: 'approved', submittedAt: '2024-02-16', reviewedAt: '2024-02-17' },
        { id: 'd3', name: 'Employment Letter', status: 'approved', submittedAt: '2024-02-17', reviewedAt: '2024-02-18' },
        { id: 'd4', name: 'Bank Statement', status: 'approved', submittedAt: '2024-02-17', reviewedAt: '2024-02-18' },
      ],
    },
  },
  {
    id: '8',
    name: 'Aisha Mohammed',
    email: 'aisha@example.com',
    phone: '08089012345',
    role: 'landlord',
    status: 'active',
    verified: true,
    joinedAt: '2023-10-10',
    lastActive: '6 hours ago',
    propertiesCount: 8,
    backgroundCheck: {
      status: 'completed',
      progress: 100,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'approved', submittedAt: '2023-10-11', reviewedAt: '2023-10-12' },
        { id: 'd2', name: 'Property Ownership Docs', status: 'approved', submittedAt: '2023-10-11', reviewedAt: '2023-10-13' },
        { id: 'd3', name: 'Tax Clearance', status: 'approved', submittedAt: '2023-10-12', reviewedAt: '2023-10-14' },
      ],
    },
  },
  {
    id: '9',
    name: 'David Okoro',
    email: 'david@example.com',
    phone: '08090123456',
    role: 'homerunner',
    status: 'pending',
    verified: false,
    joinedAt: '2024-03-15',
    lastActive: '1 day ago',
    backgroundCheck: {
      status: 'not_started',
      progress: 0,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'not_submitted' },
        { id: 'd2', name: 'Proof of Address', status: 'not_submitted' },
        { id: 'd3', name: 'Police Clearance', status: 'not_submitted' },
        { id: 'd4', name: 'Guarantor Form', status: 'not_submitted' },
      ],
    },
  },
  {
    id: '10',
    name: 'Ngozi Ibe',
    email: 'ngozi@example.com',
    phone: '08001234567',
    role: 'tenant',
    status: 'banned',
    verified: false,
    joinedAt: '2023-09-01',
    lastActive: '2 weeks ago',
    bookingsCount: 0,
    viewingsRequested: 5,
    currentRentals: 0,
    shortletsUsed: 1,
    backgroundCheck: {
      status: 'failed',
      progress: 25,
      documents: [
        { id: 'd1', name: 'Government ID', status: 'rejected', submittedAt: '2023-09-02', reviewedAt: '2023-09-05' },
        { id: 'd2', name: 'Proof of Address', status: 'not_submitted' },
        { id: 'd3', name: 'Employment Letter', status: 'not_submitted' },
        { id: 'd4', name: 'Bank Statement', status: 'not_submitted' },
      ],
    },
  },
]
