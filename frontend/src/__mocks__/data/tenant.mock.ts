/**
 * Mock data for Tenant Dashboard
 * Migrated from:
 * - pages/tenant/payments/data/sample-payments.ts
 * - pages/tenant/agreements/data/sample-agreements.ts
 */

import type { Payment, Agreement } from '@/shared/types/tenant.types'
import home6 from '@/assets/images/home6.jpg'
import home9 from '@/assets/images/home9.jpg'

// ============================================================
// PAYMENTS
// ============================================================
export const mockTenantPayments: Payment[] = [
  {
    id: 'pay-001',
    tenantId: 'tenant-001',
    propertyId: '6',
    propertyName: 'Victoria Crest',
    propertyImage: home6,
    landlordId: 'landlord-001',
    landlordName: 'Vincent Anthony',
    services: ['Monthly Rent', 'Julaaz Protect+'],
    items: [
      {
        id: 'item-001',
        type: 'rent',
        description: 'First Month Rent - January 2025',
        amount: 450000,
      },
      {
        id: 'item-002',
        type: 'insurance',
        description: 'Julaaz Protect+ (Rental Insurance)',
        amount: 35000,
      },
    ],
    subtotal: 485000,
    processingFee: 9118, // 1.88% of subtotal
    total: 494118,
    status: 'pending',
    dueDate: new Date('2024-12-25'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'pay-002',
    tenantId: 'tenant-001',
    propertyId: '9',
    propertyName: 'Lekki Haven',
    propertyImage: home9,
    landlordId: 'landlord-002',
    landlordName: 'Sarah Okafor',
    services: ['Monthly Rent'],
    items: [
      {
        id: 'item-003',
        type: 'rent',
        description: 'Monthly Rent - December 2024',
        amount: 380000,
      },
    ],
    subtotal: 380000,
    processingFee: 7144, // 1.88%
    total: 387144,
    status: 'completed',
    dueDate: new Date('2024-12-01'),
    paidAt: new Date('2024-11-28'),
    paymentMethod: 'card',
    pointsRedeemed: 1200,
    reference: 'JLZ-PAY-20241128-001',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-28'),
  },
  {
    id: 'pay-003',
    tenantId: 'tenant-001',
    propertyId: '6',
    propertyName: 'Victoria Crest',
    propertyImage: home6,
    landlordId: 'landlord-001',
    landlordName: 'Vincent Anthony',
    services: ['Security Deposit', 'Legal Documentation', 'Service Charge'],
    items: [
      {
        id: 'item-004',
        type: 'security_deposit',
        description: 'Security Deposit (2 months)',
        amount: 900000,
      },
      {
        id: 'item-005',
        type: 'legal_fee',
        description: 'Legal Documentation Fee',
        amount: 50000,
      },
      {
        id: 'item-006',
        type: 'service_charge',
        description: 'Annual Service Charge',
        amount: 120000,
      },
    ],
    subtotal: 1070000,
    processingFee: 20116, // 1.88%
    total: 1090116,
    status: 'pending',
    dueDate: new Date('2024-12-20'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'pay-004',
    tenantId: 'tenant-001',
    propertyId: '9',
    propertyName: 'Lekki Haven',
    propertyImage: home9,
    landlordId: 'landlord-002',
    landlordName: 'Sarah Okafor',
    services: ['AC Servicing', 'Preventive Maintenance'],
    items: [
      {
        id: 'item-007',
        type: 'maintenance',
        description: 'Preventive maintenance - AC servicing and filters',
        amount: 45000,
      },
    ],
    subtotal: 45000,
    processingFee: 846,
    total: 45846,
    status: 'completed',
    dueDate: new Date('2024-10-10'),
    paidAt: new Date('2024-10-08'),
    paymentMethod: 'wallet',
    pointsRedeemed: 600,
    reference: 'JLZ-PAY-20241008-004',
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-08'),
  },
]

// ============================================================
// AGREEMENTS
// ============================================================
export const mockAgreements: Agreement[] = [
  {
    id: 'agr-001',
    propertyId: '6',
    propertyName: 'Victoria Crest',
    propertyImage: home6,
    propertyAddress: '15 Adeola Odeku Street, Victoria Island, Lagos',
    landlordName: 'Vincent Anthony',
    landlordId: 'landlord-001',
    tenantId: 'tenant-001',
    type: 'rental',
    status: 'pending',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    monthlyRent: 450000,
    securityDeposit: 900000,
    terms: [
      'The tenant agrees to pay rent on or before the 1st day of each month',
      'The security deposit will be refunded within 30 days of lease termination',
      'No subletting without written consent from the landlord',
      'The tenant is responsible for minor repairs and maintenance',
      'Property must be kept clean and in good condition',
      'No structural modifications without landlord approval',
      'Utilities (electricity, water) are the responsibility of the tenant',
      'Landlord has the right to inspect the property with 48 hours notice',
      '30 days written notice required for lease termination',
      'Pets are not allowed without prior written consent'
    ],
    documentUrl: '/documents/rental-agreement-001.pdf',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'agr-002',
    propertyId: '9',
    propertyName: 'Lekki Haven',
    propertyImage: home9,
    propertyAddress: '42 Admiralty Way, Lekki Phase 1, Lagos',
    landlordName: 'Sarah Okafor',
    landlordId: 'landlord-002',
    tenantId: 'tenant-001',
    type: 'rental',
    status: 'signed',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    monthlyRent: 380000,
    securityDeposit: 760000,
    terms: [
      'The tenant agrees to pay rent on or before the 1st day of each month',
      'The security deposit will be refunded within 30 days of lease termination',
      'No subletting without written consent from the landlord',
      'The tenant is responsible for minor repairs and maintenance',
      'Property must be kept clean and in good condition',
      'No structural modifications without landlord approval',
      'Utilities (electricity, water) are the responsibility of the tenant',
      'Landlord has the right to inspect the property with 48 hours notice'
    ],
    documentUrl: '/documents/rental-agreement-002.pdf',
    signedAt: new Date('2023-12-15'),
    signatureUrl: '/signatures/tenant-001-agr-002.png',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-15'),
  },
]

// Aliases for backward compatibility
export const samplePayments = mockTenantPayments
export const sampleAgreements = mockAgreements
