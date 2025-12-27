/**
 * Payments Mock Data
 * Matches backend API specification from BACKEND_API_SPEC.md
 */

import type { ApiResponse } from '@/shared/types/common.types'
import type {
  Payment,
  PaymentMethod,
  Transaction,
  PaymentStatus,
  LandlordEarnings,
  PayoutRequest,
} from '@/shared/types/payment.types'
import { mockUsers } from './auth.mock'

// Sample payment methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_001',
    userId: mockUsers.tenant1.id,
    type: 'CARD',
    provider: 'PAYSTACK',
    last4: '4242',
    cardBrand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'pm_002',
    userId: mockUsers.tenant1.id,
    type: 'BANK_TRANSFER',
    provider: 'FLUTTERWAVE',
    accountNumber: '1234567890',
    bankName: 'GTBank',
    accountName: 'Chidinma Okafor',
    isDefault: false,
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
]

// Sample payments
export const mockPayments: Payment[] = [
  {
    id: 'pay_001',
    userId: mockUsers.tenant1.id,
    propertyId: 'prop_001',
    bookingId: 'book_003',
    type: 'RENT',
    amount: 1500000,
    currency: 'NGN',
    status: 'COMPLETED',
    paymentMethod: 'CARD',
    provider: 'PAYSTACK',
    reference: 'TRX_123456789',
    description: 'Rent payment for Marina Apartment - February 2024',
    metadata: {
      propertyTitle: 'Luxury 3BR Apartment in Marina',
      period: 'February 2024',
      dueDate: '2024-02-01',
    },
    paidAt: '2024-02-01T10:30:00Z',
    createdAt: '2024-02-01T10:25:00Z',
    updatedAt: '2024-02-01T10:30:00Z',
  },
  {
    id: 'pay_002',
    userId: mockUsers.tenant1.id,
    propertyId: 'prop_001',
    bookingId: 'book_003',
    type: 'DEPOSIT',
    amount: 3000000,
    currency: 'NGN',
    status: 'COMPLETED',
    paymentMethod: 'BANK_TRANSFER',
    provider: 'FLUTTERWAVE',
    reference: 'TRX_987654321',
    description: 'Security deposit for Marina Apartment',
    metadata: {
      propertyTitle: 'Luxury 3BR Apartment in Marina',
      refundable: true,
      refundConditions: 'Full refund on checkout if no damages',
    },
    paidAt: '2024-01-25T14:00:00Z',
    createdAt: '2024-01-25T13:50:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
  {
    id: 'pay_003',
    userId: mockUsers.tenant1.id,
    serviceBookingId: 'sb_002',
    type: 'SERVICE',
    amount: 32000,
    currency: 'NGN',
    status: 'COMPLETED',
    paymentMethod: 'CARD',
    provider: 'PAYSTACK',
    reference: 'TRX_456789123',
    description: 'Payment for electrical service - ceiling fan installation',
    metadata: {
      providerName: 'Bright Spark Electrical',
      serviceType: 'Installation',
    },
    paidAt: '2024-02-10T14:30:00Z',
    createdAt: '2024-02-10T14:25:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
  },
  {
    id: 'pay_004',
    userId: mockUsers.tenant1.id,
    propertyId: 'prop_001',
    bookingId: 'book_003',
    type: 'APPLICATION_FEE',
    amount: 10000,
    currency: 'NGN',
    status: 'PENDING',
    paymentMethod: 'CARD',
    provider: 'PAYSTACK',
    reference: 'TRX_789123456',
    description: 'Application processing fee',
    metadata: {
      propertyTitle: 'Luxury 3BR Apartment in Marina',
      nonRefundable: true,
    },
    paidAt: null,
    createdAt: '2024-02-12T09:00:00Z',
    updatedAt: '2024-02-12T09:00:00Z',
  },
]

// Sample transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    paymentId: 'pay_001',
    type: 'CHARGE',
    amount: 1500000,
    currency: 'NGN',
    status: 'SUCCESS',
    reference: 'TRX_123456789',
    provider: 'PAYSTACK',
    providerResponse: {
      status: 'success',
      message: 'Payment successful',
      authorization: {
        authorization_code: 'AUTH_xyz123',
        bin: '424242',
        last4: '4242',
        exp_month: '12',
        exp_year: '2026',
        channel: 'card',
        card_type: 'visa',
        bank: 'Test Bank',
        country_code: 'NG',
        brand: 'visa',
      },
    },
    createdAt: '2024-02-01T10:30:00Z',
    updatedAt: '2024-02-01T10:30:00Z',
  },
  {
    id: 'txn_002',
    paymentId: 'pay_002',
    type: 'CHARGE',
    amount: 3000000,
    currency: 'NGN',
    status: 'SUCCESS',
    reference: 'TRX_987654321',
    provider: 'FLUTTERWAVE',
    providerResponse: {
      status: 'successful',
      message: 'Transfer successful',
    },
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
]

// Sample landlord earnings
export const mockLandlordEarnings: LandlordEarnings = {
  userId: mockUsers.landlord1.id,
  totalEarnings: 12500000,
  availableBalance: 3500000,
  pendingBalance: 1500000,
  totalPaidOut: 7500000,
  currency: 'NGN',
  lastPayoutDate: '2024-01-31T00:00:00Z',
  nextPayoutDate: '2024-02-28T00:00:00Z',
  earningsByMonth: [
    { month: '2024-01', amount: 4500000, properties: 3 },
    { month: '2024-02', amount: 1500000, properties: 1 },
  ],
  earningsByProperty: [
    {
      propertyId: 'prop_001',
      propertyTitle: 'Luxury 3BR Apartment in Marina',
      totalEarnings: 9000000,
      lastPayment: '2024-02-01T10:30:00Z',
    },
    {
      propertyId: 'prop_002',
      propertyTitle: 'Modern 2BR in Lekki Phase 1',
      totalEarnings: 3500000,
      lastPayment: '2024-01-15T09:00:00Z',
    },
  ],
  platformFees: 625000, // 5% of totalEarnings
  updatedAt: '2024-02-14T00:00:00Z',
}

// Sample payout requests
export const mockPayoutRequests: PayoutRequest[] = [
  {
    id: 'payout_001',
    userId: mockUsers.landlord1.id,
    amount: 2000000,
    currency: 'NGN',
    status: 'COMPLETED',
    bankAccount: {
      accountNumber: '0123456789',
      bankName: 'Access Bank',
      accountName: 'Adebayo Okonkwo',
    },
    requestedAt: '2024-01-25T10:00:00Z',
    processedAt: '2024-01-26T14:00:00Z',
    completedAt: '2024-01-26T16:30:00Z',
    reference: 'PAYOUT_ABC123',
    notes: 'Monthly payout - January 2024',
  },
  {
    id: 'payout_002',
    userId: mockUsers.landlord1.id,
    amount: 1500000,
    currency: 'NGN',
    status: 'PENDING',
    bankAccount: {
      accountNumber: '0123456789',
      bankName: 'Access Bank',
      accountName: 'Adebayo Okonkwo',
    },
    requestedAt: '2024-02-14T09:00:00Z',
    processedAt: null,
    completedAt: null,
    reference: 'PAYOUT_DEF456',
    notes: 'Partial payout request',
  },
]

// API Response Mocks
export const mockPaymentMethodsResponse: ApiResponse<PaymentMethod[]> = {
  success: true,
  data: mockPaymentMethods,
  message: 'Payment methods retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockPaymentsResponse: ApiResponse<{
  payments: Payment[]
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
    payments: mockPayments,
    pagination: {
      page: 1,
      limit: 20,
      total: mockPayments.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Payments retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockPaymentDetailResponse: ApiResponse<{
  payment: Payment
  transactions: Transaction[]
}> = {
  success: true,
  data: {
    payment: mockPayments[0],
    transactions: [mockTransactions[0]],
  },
  message: 'Payment details retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockInitiatePaymentResponse: ApiResponse<{
  payment: Payment
  authorizationUrl: string
  reference: string
}> = {
  success: true,
  data: {
    payment: mockPayments[3],
    authorizationUrl: 'https://checkout.paystack.com/xyz123',
    reference: 'TRX_789123456',
  },
  message: 'Payment initiated successfully',
  timestamp: new Date().toISOString(),
}

export const mockVerifyPaymentResponse: ApiResponse<{
  payment: Payment
  verified: boolean
}> = {
  success: true,
  data: {
    payment: { ...mockPayments[3], status: 'COMPLETED' as PaymentStatus },
    verified: true,
  },
  message: 'Payment verified successfully',
  timestamp: new Date().toISOString(),
}

export const mockLandlordEarningsResponse: ApiResponse<LandlordEarnings> = {
  success: true,
  data: mockLandlordEarnings,
  message: 'Earnings data retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockPayoutRequestsResponse: ApiResponse<{
  payouts: PayoutRequest[]
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
    payouts: mockPayoutRequests,
    pagination: {
      page: 1,
      limit: 20,
      total: mockPayoutRequests.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
  },
  message: 'Payout requests retrieved successfully',
  timestamp: new Date().toISOString(),
}

export const mockRequestPayoutResponse: ApiResponse<PayoutRequest> = {
  success: true,
  data: mockPayoutRequests[1],
  message: 'Payout requested successfully',
  timestamp: new Date().toISOString(),
}

export const mockAddPaymentMethodResponse: ApiResponse<PaymentMethod> = {
  success: true,
  data: mockPaymentMethods[0],
  message: 'Payment method added successfully',
  timestamp: new Date().toISOString(),
}

export const mockDeletePaymentMethodResponse: ApiResponse<{ deleted: boolean }> = {
  success: true,
  data: { deleted: true },
  message: 'Payment method deleted successfully',
  timestamp: new Date().toISOString(),
}
