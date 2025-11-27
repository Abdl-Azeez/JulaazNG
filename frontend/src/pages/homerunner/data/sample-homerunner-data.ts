/**
 * Sample data for Homerunner pages
 */

export interface PropertyInspection {
  id: string
  propertyId: string
  propertyTitle: string
  propertyImage: string
  landlordName: string
  landlordPhone: string
  location: string
  scheduledFor: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  type: 'new_listing' | 'periodic' | 'move_out'
  notes?: string
  earnAmount: number
}

export interface PropertyViewing {
  id: string
  propertyId: string
  propertyTitle: string
  propertyImage: string
  tenantName: string
  tenantPhone: string
  landlordName: string
  location: string
  scheduledFor: string
  status:
    | 'scheduled'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'no_show'
    | 'cancelled'
    | 'rented'
  earnAmount: number
  commissionPotential: number // Commission if tenant signs
  notes?: string
}

export interface HomerunnerScheduleItem {
  id: string
  title: string
  time: string
  type: 'inspection' | 'viewing' | 'training' | 'follow_up'
  location: string
  details: string
  priority?: 'high' | 'medium' | 'low'
}

export interface HomerunnerEarnings {
  totalEarnings: number
  pendingEarnings: number
  thisMonthEarnings: number
  inspectionEarnings: number
  commissionEarnings: number
  totalInspections: number
  totalViewings: number
  conversionRate: number // % of viewings that converted to rentals
}

export interface EarningsTransaction {
  id: string
  type: 'inspection' | 'viewing' | 'commission'
  description: string
  amount: number
  date: string
  status: 'pending' | 'paid' | 'processing'
  propertyTitle: string
}

export const sampleInspections: PropertyInspection[] = [
  {
    id: 'insp-001',
    propertyId: 'prop-101',
    propertyTitle: '3 Bedroom Duplex - Victoria Island',
    propertyImage: '/images/properties/property-1.jpg',
    landlordName: 'Chief Adeleke',
    landlordPhone: '+234 803 456 7890',
    location: 'Plot 15, Adeola Odeku, Victoria Island, Lagos',
    scheduledFor: 'Today • 2:00 PM',
    status: 'confirmed',
    type: 'new_listing',
    notes: 'Fully furnished property. Landlord will provide keys at gate.',
    earnAmount: 15000,
  },
  {
    id: 'insp-002',
    propertyId: 'prop-102',
    propertyTitle: '2 Bedroom Apartment - Lekki Phase 1',
    propertyImage: '/images/properties/property-2.jpg',
    landlordName: 'Mrs. Okonkwo',
    landlordPhone: '+234 809 234 5678',
    location: '12 Admiralty Way, Lekki Phase 1, Lagos',
    scheduledFor: 'Tomorrow • 10:00 AM',
    status: 'pending',
    type: 'new_listing',
    earnAmount: 12000,
  },
  {
    id: 'insp-003',
    propertyId: 'prop-103',
    propertyTitle: '4 Bedroom Semi-Detached - Ikoyi',
    propertyImage: '/images/properties/property-3.jpg',
    landlordName: 'Engr. Balogun',
    landlordPhone: '+234 801 987 6543',
    location: '5 Bourdillon Road, Ikoyi, Lagos',
    scheduledFor: 'Dec 2 • 11:00 AM',
    status: 'pending',
    type: 'periodic',
    notes: 'Annual property condition inspection.',
    earnAmount: 20000,
  },
  {
    id: 'insp-004',
    propertyId: 'prop-104',
    propertyTitle: 'Studio Apartment - Yaba',
    propertyImage: '/images/properties/property-4.jpg',
    landlordName: 'Dr. Fashola',
    landlordPhone: '+234 805 111 2222',
    location: '78 Herbert Macaulay, Yaba, Lagos',
    scheduledFor: 'Dec 3 • 3:00 PM',
    status: 'confirmed',
    type: 'move_out',
    notes: 'Tenant moving out. Check for damages.',
    earnAmount: 10000,
  },
]

export const sampleViewings: PropertyViewing[] = [
  {
    id: 'view-001',
    propertyId: 'prop-201',
    propertyTitle: '3 Bedroom Flat - Magodo',
    propertyImage: '/images/properties/property-5.jpg',
    tenantName: 'Mr. Chukwuemeka',
    tenantPhone: '+234 802 333 4444',
    landlordName: 'Alhaji Musa',
    location: 'Phase 2, Magodo GRA, Lagos',
    scheduledFor: 'Today • 4:30 PM',
    status: 'confirmed',
    earnAmount: 5000,
    commissionPotential: 150000,
    notes: 'Tenant is very interested. Pre-qualified.',
  },
  {
    id: 'view-002',
    propertyId: 'prop-202',
    propertyTitle: '2 Bedroom Apartment - Ajah',
    propertyImage: '/images/properties/property-6.jpg',
    tenantName: 'Miss Adaobi',
    tenantPhone: '+234 808 555 6666',
    landlordName: 'Chief Eze',
    location: 'Abraham Adesanya, Ajah, Lagos',
    scheduledFor: 'Tomorrow • 9:00 AM',
    status: 'scheduled',
    earnAmount: 5000,
    commissionPotential: 80000,
  },
  {
    id: 'view-003',
    propertyId: 'prop-203',
    propertyTitle: '1 Bedroom Mini Flat - Surulere',
    propertyImage: '/images/properties/property-7.jpg',
    tenantName: 'Mr. Ojo',
    tenantPhone: '+234 701 777 8888',
    landlordName: 'Mrs. Adeyemi',
    location: 'Bode Thomas, Surulere, Lagos',
    scheduledFor: 'Dec 2 • 2:00 PM',
    status: 'scheduled',
    earnAmount: 5000,
    commissionPotential: 45000,
  },
  {
    id: 'view-004',
    propertyId: 'prop-204',
    propertyTitle: '4 Bedroom Duplex - Victoria Island',
    propertyImage: '/images/properties/property-1.jpg',
    tenantName: 'Dr. Adebayo',
    tenantPhone: '+234 803 999 0000',
    landlordName: 'Chief Williams',
    location: 'Ahmadu Bello Way, Victoria Island, Lagos',
    scheduledFor: 'Dec 4 • 10:00 AM',
    status: 'scheduled',
    earnAmount: 8000,
    commissionPotential: 250000,
  },
  {
    id: 'view-005',
    propertyId: 'prop-205',
    propertyTitle: '2 Bedroom Apartment - Ikeja',
    propertyImage: '/images/properties/property-2.jpg',
    tenantName: 'Mrs. Okoro',
    tenantPhone: '+234 805 111 2222',
    landlordName: 'Engr. Bello',
    location: 'Allen Avenue, Ikeja, Lagos',
    scheduledFor: 'Dec 5 • 3:00 PM',
    status: 'confirmed',
    earnAmount: 5000,
    commissionPotential: 120000,
  },
  {
    id: 'view-006',
    propertyId: 'prop-206',
    propertyTitle: '3 Bedroom Terrace - Lekki',
    propertyImage: '/images/properties/property-3.jpg',
    tenantName: 'Mr. Ibrahim',
    tenantPhone: '+234 807 333 4444',
    landlordName: 'Alhaji Mohammed',
    location: 'Lekki Phase 1, Lagos',
    scheduledFor: 'Dec 6 • 11:00 AM',
    status: 'scheduled',
    earnAmount: 6000,
    commissionPotential: 180000,
  },
]

export const sampleScheduleItems: HomerunnerScheduleItem[] = [
  {
    id: 'sch-001',
    title: 'Confirm keys with Lekki landlord',
    time: 'Today • 12:30 PM',
    type: 'follow_up',
    location: 'Lekki Phase 1',
    details: 'Call Mrs. Okonkwo before inspection to pick up smart lock code.',
    priority: 'high',
  },
  {
    id: 'sch-002',
    title: 'Magodo viewing with Chukwuemeka',
    time: 'Today • 4:30 PM',
    type: 'viewing',
    location: 'Magodo GRA Phase 2',
    details: 'Tenant prefers evening slots. Bring extra brochure.',
  },
  {
    id: 'sch-003',
    title: 'Upload Yaba inspection photos',
    time: 'Tomorrow • 9:00 AM',
    type: 'inspection',
    location: 'Julaaz HQ Portal',
    details: 'Ensure damages are tagged before submission.',
    priority: 'medium',
  },
  {
    id: 'sch-004',
    title: 'Monthly quality training',
    time: 'Friday • 11:00 AM',
    type: 'training',
    location: 'Virtual (Google Meet)',
    details: 'Facilitator: Julaaz Academy. Join 5 mins early.',
  },
]

export const sampleEarnings: HomerunnerEarnings = {
  totalEarnings: 1250000,
  pendingEarnings: 85000,
  thisMonthEarnings: 320000,
  inspectionEarnings: 450000,
  commissionEarnings: 800000,
  totalInspections: 48,
  totalViewings: 156,
  conversionRate: 32,
}

export const sampleTransactions: EarningsTransaction[] = [
  {
    id: 'txn-001',
    type: 'commission',
    description: 'Rental commission - 3 Bed Flat signed',
    amount: 150000,
    date: '2024-11-25',
    status: 'paid',
    propertyTitle: '3 Bedroom Flat - Victoria Island',
  },
  {
    id: 'txn-002',
    type: 'inspection',
    description: 'Property inspection completed',
    amount: 15000,
    date: '2024-11-24',
    status: 'paid',
    propertyTitle: '2 Bedroom Duplex - Lekki',
  },
  {
    id: 'txn-003',
    type: 'viewing',
    description: 'Property viewing conducted',
    amount: 5000,
    date: '2024-11-24',
    status: 'paid',
    propertyTitle: 'Studio Apartment - Ikoyi',
  },
  {
    id: 'txn-004',
    type: 'commission',
    description: 'Rental commission - Pending sign-off',
    amount: 120000,
    date: '2024-11-23',
    status: 'pending',
    propertyTitle: '4 Bedroom Semi-Detached - Magodo',
  },
  {
    id: 'txn-005',
    type: 'inspection',
    description: 'Move-out inspection',
    amount: 10000,
    date: '2024-11-22',
    status: 'processing',
    propertyTitle: '1 Bedroom Flat - Yaba',
  },
]

export const performanceStats = [
  {
    id: 'inspections',
    label: 'Inspections',
    value: '48',
    description: 'completed this month',
    trend: '+12%',
    trendUp: true,
  },
  {
    id: 'viewings',
    label: 'Viewings',
    value: '156',
    description: 'conducted this month',
    trend: '+8%',
    trendUp: true,
  },
  {
    id: 'conversion',
    label: 'Conversion',
    value: '32%',
    description: 'viewings to rentals',
    trend: '+5%',
    trendUp: true,
  },
  {
    id: 'rating',
    label: 'Rating',
    value: '4.9★',
    description: 'from landlords & tenants',
    trend: 'Excellent',
    trendUp: true,
  },
]

