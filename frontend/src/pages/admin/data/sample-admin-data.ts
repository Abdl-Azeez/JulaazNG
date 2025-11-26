/**
 * Sample data for Admin pages
 */

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

