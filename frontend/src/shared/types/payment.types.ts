/**
 * Payment Type Definitions
 * Matches backend Prisma schema
 */

export type PaymentType =
  | 'RENT'
  | 'DEPOSIT'
  | 'SERVICE'
  | 'APPLICATION_FEE'
  | 'PLATFORM_FEE'

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export type PaymentMethodType = 'CARD' | 'BANK_TRANSFER' | 'USSD' | 'WALLET'

export type PaymentProvider = 'PAYSTACK' | 'FLUTTERWAVE' | 'INTERNAL'

export interface PaymentMethod {
  id: string
  userId: string
  type: PaymentMethodType
  provider: PaymentProvider
  last4?: string
  cardBrand?: string
  expiryMonth?: number
  expiryYear?: number
  accountNumber?: string
  bankName?: string
  accountName?: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  userId: string
  propertyId?: string
  bookingId?: string
  serviceBookingId?: string
  type: PaymentType
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod: string
  provider: PaymentProvider
  reference: string
  description: string
  metadata?: Record<string, any>
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  paymentId: string
  type: 'CHARGE' | 'REFUND' | 'TRANSFER'
  amount: number
  currency: string
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  reference: string
  provider: PaymentProvider
  providerResponse?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface LandlordEarnings {
  userId: string
  totalEarnings: number
  availableBalance: number
  pendingBalance: number
  totalPaidOut: number
  currency: string
  lastPayoutDate: string | null
  nextPayoutDate: string | null
  earningsByMonth: Array<{
    month: string
    amount: number
    properties: number
  }>
  earningsByProperty: Array<{
    propertyId: string
    propertyTitle: string
    totalEarnings: number
    lastPayment: string | null
  }>
  platformFees: number
  updatedAt: string
}

export interface PayoutRequest {
  id: string
  userId: string
  amount: number
  currency: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  bankAccount: {
    accountNumber: string
    bankName: string
    accountName: string
  }
  requestedAt: string
  processedAt: string | null
  completedAt: string | null
  reference: string
  notes?: string
}
