/**
 * Tenant-related TypeScript types and interfaces
 */

// Agreement Types
export type AgreementStatus = 'pending' | 'signed' | 'expired' | 'terminated'
export type AgreementType = 'rental' | 'service' | 'lease_renewal'

export interface Agreement {
  id: string
  propertyId: string
  propertyName: string
  propertyImage?: string
  propertyAddress: string
  landlordName: string
  landlordId: string
  tenantId: string
  type: AgreementType
  status: AgreementStatus
  startDate: Date
  endDate: Date
  monthlyRent: number
  securityDeposit: number
  terms: string[]
  documentUrl?: string
  signedAt?: Date
  signatureUrl?: string
  createdAt: Date
  updatedAt: Date
}

// Payment Types
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
export type PaymentType = 
  | 'rent' 
  | 'security_deposit' 
  | 'processing_fee' 
  | 'legal_fee' 
  | 'insurance' 
  | 'maintenance' 
  | 'utility' 
  | 'late_fee'
  | 'service_charge'

export type PaymentMethod = 'card' | 'bank_transfer' | 'ussd' | 'wallet'

export interface PaymentItem {
  id: string
  type: PaymentType
  description: string
  amount: number
  quantity?: number
}

export interface Payment {
  id: string
  tenantId: string
  propertyId?: string
  propertyName?: string
  propertyImage?: string
  landlordId?: string
  landlordName?: string
  services?: string[]
  items: PaymentItem[]
  subtotal: number
  processingFee: number
  total: number
  status: PaymentStatus
  dueDate: Date
  paidAt?: Date
  paymentMethod?: PaymentMethod
  pointsRedeemed?: number
  reference?: string
  createdAt: Date
  updatedAt: Date
}

export interface PaymentReceipt {
  id: string
  paymentId: string
  receiptNumber: string
  tenantName: string
  tenantEmail: string
  items: PaymentItem[]
  subtotal: number
  processingFee: number
  total: number
  paymentMethod: PaymentMethod
  paidAt: Date
  reference: string
}

