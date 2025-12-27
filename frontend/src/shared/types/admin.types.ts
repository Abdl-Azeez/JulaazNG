/**
 * Admin Type Definitions
 * Matches backend Prisma schema and admin dashboard needs
 */

export interface AdminAnalytics {
  period: string
  users: {
    total: number
    active: number
    new: number
    tenants: number
    landlords: number
    serviceProviders: number
    artisans: number
    handymen: number
    homerunners: number
    growth: {
      percentage: number
      trend: 'UP' | 'DOWN' | 'STABLE'
    }
  }
  properties: {
    total: number
    active: number
    occupied: number
    vacant: number
    pending: number
    verified: number
    featured: number
    occupancyRate: number
    growth: {
      percentage: number
      trend: 'UP' | 'DOWN' | 'STABLE'
    }
  }
  bookings: {
    total: number
    confirmed: number
    pending: number
    cancelled: number
    conversionRate: number
    growth: {
      percentage: number
      trend: 'UP' | 'DOWN' | 'STABLE'
    }
  }
  revenue: {
    total: number
    commissions: number
    serviceFees: number
    subscriptionFees: number
    growth: {
      percentage: number
      trend: 'UP' | 'DOWN' | 'STABLE'
    }
    byCategory: Array<{
      category: string
      amount: number
    }>
  }
  services: {
    total: number
    completed: number
    inProgress: number
    pending: number
    completionRate: number
    growth: {
      percentage: number
      trend: 'UP' | 'DOWN' | 'STABLE'
    }
  }
  topCategories: Array<{
    name: string
    count: number
    percentage: number
  }>
  recentActivity: Array<{
    type: string
    userId?: string
    userName?: string
    propertyId?: string
    propertyTitle?: string
    paymentId?: string
    amount?: number
    timestamp: string
    description: string
  }>
  updatedAt: string
}

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  roles: string[]
  status: string
  emailVerified: boolean
  phoneVerified: boolean
  avatar?: string
  lastLogin: string | null
  totalBookings?: number
  totalSpent?: number
  totalProperties?: number
  totalEarnings?: number
  createdAt: string
  updatedAt: string
}

export interface AdminProperty {
  id: string
  title: string
  type: string
  city: string
  state: string
  price: number
  currency: string
  status: string
  isVerified: boolean
  isFeatured: boolean
  views: number
  landlordId: string
  landlordName: string
  createdAt: string
  updatedAt: string
}

export interface AdminServiceBooking {
  id: string
  title: string
  category: string
  status: string
  userId: string
  userName: string
  providerId: string
  providerName: string
  scheduledDate: string | null
  amount: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface AdminReport {
  id: string
  type: string
  reportedBy: {
    id: string
    name: string
  }
  reportedEntity: {
    id: string
    type: string
    name: string
  }
  reason: string
  description: string
  evidence: Array<{
    type: string
    url: string
  }>
  status: string
  priority: string
  assignedTo?: string
  resolution?: string
  resolvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface AdminPendingApproval {
  id: string
  type: string
  entityId: string
  entityType: string
  title: string
  description: string
  submittedBy: {
    id: string
    name: string
    email: string
  }
  data: Record<string, any>
  status: string
  priority: string
  approvedAt?: string
  rejectedAt?: string
  createdAt: string
  updatedAt: string
}

export interface SystemSettings {
  general: {
    siteName: string
    siteUrl: string
    supportEmail: string
    maintenanceMode: boolean
  }
  payments: {
    platformFeePercentage: number
    serviceFeePercentage: number
    paymentGateways: string[]
    defaultCurrency: string
    minimumWithdrawal: number
    withdrawalProcessingDays: number
  }
  bookings: {
    autoConfirmViewings: boolean
    viewingCancellationHours: number
    applicationExpiryDays: number
    maxSimultaneousApplications: number
  }
  verification: {
    requireEmailVerification: boolean
    requirePhoneVerification: boolean
    requireIdVerification: boolean
    autoVerifyProperties: boolean
  }
  notifications: {
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
    defaultChannel: string
  }
  security: {
    sessionTimeoutMinutes: number
    maxLoginAttempts: number
    passwordMinLength: number
    requireStrongPassword: boolean
    twoFactorEnabled: boolean
  }
  updatedAt: string
}
