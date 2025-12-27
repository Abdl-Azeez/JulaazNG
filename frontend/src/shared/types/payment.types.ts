/**
 * Payment Type Definitions
 * Matches backend API spec from BACKEND_API_SPEC.md Section 2.3 Payments
 */

// API Spec: paymentType: enum ['rent', 'security_deposit', 'processing_fee', 'legal_fee', 'insurance', 'service_booking', 'commission']
export type PaymentType =
  | 'rent'
  | 'security_deposit'
  | 'processing_fee'
  | 'legal_fee'
  | 'insurance'
  | 'service_booking'
  | 'commission'

// API Spec: status: enum ['pending', 'processing', 'completed', 'failed', 'refunded']
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

// API Spec: paymentMethod: enum ['card', 'bank_transfer', 'wallet']
export type PaymentMethodType = 'card' | 'bank_transfer' | 'wallet'

// API Spec: paymentGateway: enum ['paystack', 'flutterwave']
export type PaymentGateway = 'paystack' | 'flutterwave'

// Legacy uppercase types for backward compatibility
export type LegacyPaymentType = 'RENT' | 'DEPOSIT' | 'SERVICE' | 'APPLICATION_FEE' | 'PLATFORM_FEE'
export type LegacyPaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type LegacyPaymentMethodType = 'CARD' | 'BANK_TRANSFER' | 'USSD' | 'WALLET'
export type LegacyPaymentProvider = 'PAYSTACK' | 'FLUTTERWAVE' | 'INTERNAL'

// Payment item as per API spec
export interface PaymentItem {
  description: string
  amount: number
}

export interface PaymentMethod {
  id: string
  userId: string
  type: PaymentMethodType
  provider: PaymentGateway
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
  bookingId?: string
  agreementId?: string
  paymentType: PaymentType
  items: PaymentItem[]
  subtotal: number
  processingFee: number // 1.5% of subtotal
  totalAmount: number
  paymentMethod: PaymentMethodType
  paymentReference: string
  paymentGateway: PaymentGateway
  status: PaymentStatus
  dueDate?: string
  paidAt: string | null
  metadata?: {
    cardLast4?: string
    bankName?: string
    accountNumber?: string
    [key: string]: unknown
  }
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  paymentId: string
  type: 'charge' | 'refund' | 'transfer'
  amount: number
  currency: string
  status: 'success' | 'failed' | 'pending'
  reference: string
  provider: PaymentGateway
  providerResponse?: Record<string, unknown>
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
  status: 'pending' | 'processing' | 'completed' | 'failed'
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
