export type PropertyStatus = 'active' | 'inactive' | 'reserved' | 'rented'

export interface LandlordProperty {
  id: string
  name: string
  image: string
  location: string
  status: PropertyStatus
  applications: number
  priceLabel: string
  lastUpdated: string
  occupancyRate: number
}

export type PropertyUse = 'rental' | 'shortlet' | 'hotel'
export type ElectricityType = 'generator' | 'solar' | 'government'

export interface NearbyAmenity {
  name: string
  distance?: string
  note?: string
}

export interface LandlordPropertyDetail {
  id: string
  name: string
  image: string
  gallery?: string[]
  price: number
  address: string
  type: string
  size: number
  bedrooms: number
  bathrooms: number
  parking: number
  description: string
  propertyUse?: PropertyUse
  allowShortlet?: boolean
  preferredPayment?: 'monthly' | 'quarterly' | 'six-monthly' | 'annually'
  electricity?: {
    availability: string
    type?: ElectricityType
  }
  nearby?: NearbyAmenity[]
  applicationsCount: number
  latestApplicant: {
    name: string
    status: 'pending' | 'approved' | 'rejected'
  } | null
  tenant?: {
    name: string
    period: string
    contactMethod: string
  }
  payment?: {
    lastPaymentStatus: string
    lastPaymentDate: string
  }
  documents: Array<{
    id: string
    name: string
  }>
}

export interface EarningSnapshot {
  id: string
  propertyId: string
  propertyName: string
  tenantName: string
  amount: number
  status: 'received' | 'upcoming' | 'overdue'
  dueDate: string
  paidDate?: string
  bookingType: 'annual' | 'shortlet'
}

export interface EarningsSummary {
  totalMonth: number
  upcoming: number
  overdue: number
  shortletShare: number
}

export interface LandlordApplication {
  id: string
  propertyId: string
  propertyName: string
  applicantName: string
  avatar: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  moveInDate: string
  offerAmount: number
  bedrooms: number
  bathrooms: number
  parking: number
  sqft: number
  messagePreview: string
  // Enhanced tenant background check information
  tenantDetails?: {
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
    numberOfChildren: number
    age: number
    occupation: string
    gender: 'male' | 'female' | 'other'
    monthlyIncome?: number
    employerName?: string
    yearsOfEmployment?: number
  }
}

export type ExpenseCategory = 
  | 'renovation'
  | 'maintenance'
  | 'repair'
  | 'facility_addition'
  | 'furniture'
  | 'appliances'
  | 'utilities'
  | 'insurance'
  | 'taxes'
  | 'cleaning'
  | 'landscaping'
  | 'security'
  | 'other'

export interface PropertyExpense {
  id: string
  propertyId: string
  propertyName: string
  category: ExpenseCategory
  description: string
  amount: number
  date: string
  receiptUrl?: string
  receiptName?: string
  vendor?: string
  notes?: string
  createdAt: string
}

export interface IncomeExpenseEntry {
  id: string
  propertyId: string
  propertyName: string
  type: 'income' | 'expense'
  amount: number
  date: string
  description: string
  category?: string
  receiptUrl?: string
}

export interface PropertyFinancialSummary {
  propertyId: string
  propertyName: string
  totalIncome: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  period: string
}

