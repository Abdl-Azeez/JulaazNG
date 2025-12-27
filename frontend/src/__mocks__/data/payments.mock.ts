/**
 * Payments Mock Data
 * Matches backend API specification from BACKEND_API_SPEC.md Section 2.3
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
    type: 'card',
    provider: 'paystack',
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
    type: 'bank_transfer',
    provider: 'flutterwave',
    accountNumber: '1234567890',
    bankName: 'GTBank',
    accountName: 'Chidinma Okafor',
    isDefault: false,
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
]

// Sample payments (API spec compliant)
export const mockPayments: Payment[] = [
  {
    id: 'pay_001',
    userId: mockUsers.tenant1.id,
    bookingId: 'book_003',
    paymentType: 'rent',
    items: [
      { description: 'Rent payment for Marina Apartment - February 2024', amount: 1500000 },
    ],
    subtotal: 1500000,
    processingFee: 22500, // 1.5% of subtotal
    totalAmount: 1522500,
    paymentMethod: 'card',
    paymentReference: 'TRX_123456789',
    paymentGateway: 'paystack',
    status: 'completed',
    dueDate: '2024-02-01',
    paidAt: '2024-02-01T10:30:00Z',
    metadata: {
      cardLast4: '4242',
      propertyTitle: 'Luxury 3BR Apartment in Marina',
      period: 'February 2024',
    },
    createdAt: '2024-02-01T10:25:00Z',
    updatedAt: '2024-02-01T10:30:00Z',
  },
  {
    id: 'pay_002',
    userId: mockUsers.tenant1.id,
    bookingId: 'book_003',
    paymentType: 'security_deposit',
    items: [
      { description: 'Security deposit for Marina Apartment', amount: 3000000 },
    ],
    subtotal: 3000000,
    processingFee: 45000,
    totalAmount: 3045000,
    paymentMethod: 'bank_transfer',
    paymentReference: 'TRX_987654321',
    paymentGateway: 'flutterwave',
    status: 'completed',
    dueDate: '2024-01-25',
    paidAt: '2024-01-25T14:00:00Z',
    metadata: {
      bankName: 'GTBank',
      accountNumber: '1234567890',
      propertyTitle: 'Luxury 3BR Apartment in Marina',
      refundable: true,
    },
    createdAt: '2024-01-25T13:50:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
  {
    id: 'pay_003',
    userId: mockUsers.tenant1.id,
    bookingId: 'sb_002',
    paymentType: 'service_booking',
    items: [
      { description: 'Electrical service - ceiling fan installation', amount: 32000 },
    ],
    subtotal: 32000,
    processingFee: 480,
    totalAmount: 32480,
    paymentMethod: 'card',
    paymentReference: 'TRX_456789123',
    paymentGateway: 'paystack',
    status: 'completed',
    paidAt: '2024-02-10T14:30:00Z',
    metadata: {
      cardLast4: '4242',
      providerName: 'Bright Spark Electrical',
      serviceType: 'Installation',
    },
    createdAt: '2024-02-10T14:25:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
  },
  {
    id: 'pay_004',
    userId: mockUsers.tenant1.id,
    bookingId: 'book_003',
    paymentType: 'processing_fee',
    items: [
      { description: 'Application processing fee', amount: 10000 },
    ],
    subtotal: 10000,
    processingFee: 150,
    totalAmount: 10150,
    paymentMethod: 'card',
    paymentReference: 'TRX_789123456',
    paymentGateway: 'paystack',
    status: 'pending',
    dueDate: '2024-02-15',
    paidAt: null,
    metadata: {
      propertyTitle: 'Luxury 3BR Apartment in Marina',
      nonRefundable: true,
    },
    createdAt: '2024-02-12T09:00:00Z',
    updatedAt: '2024-02-12T09:00:00Z',
  },
]

// Sample transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    paymentId: 'pay_001',
    type: 'charge',
    amount: 1522500,
    currency: 'NGN',
    status: 'success',
    reference: 'TRX_123456789',
    provider: 'paystack',
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
    type: 'charge',
    amount: 3045000,
    currency: 'NGN',
    status: 'success',
    reference: 'TRX_987654321',
    provider: 'flutterwave',
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
    status: 'completed',
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
    status: 'pending',
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
