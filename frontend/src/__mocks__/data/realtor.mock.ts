export type RealtorPipelineStage = 'prospecting' | 'viewing_scheduled' | 'application_in' | 'awaiting_signing'

export interface RealtorDashboardSummary {
  managedPortfolios: number
  activeTenants: number
  citiesCovered: number
  monthlyGmv: number
  avgCommissionRate: number
}

export interface RealtorPipelineItem {
  id: string
  propertyName: string
  landlordName: string
  tenantName?: string
  stage: RealtorPipelineStage
  potentialCommission: number
  nextAction: string
}

export interface RealtorEarningsSnapshot {
  month: string
  grossCommission: number
  expenses: number
  net: number
}

export const realtorDashboardSummary: RealtorDashboardSummary = {
  managedPortfolios: 7,
  activeTenants: 38,
  citiesCovered: 3,
  monthlyGmv: 125_000_000,
  avgCommissionRate: 0.08,
}

export const realtorPipeline: RealtorPipelineItem[] = [
  {
    id: 'rp-001',
    propertyName: 'Lekki Phase 1 – 3BR Penthouse',
    landlordName: 'Femi Ogunleye',
    stage: 'viewing_scheduled',
    potentialCommission: 650_000,
    nextAction: 'Confirm viewing time with tenant',
  },
  {
    id: 'rp-002',
    propertyName: 'Yaba – Studio Shortlet',
    landlordName: 'Chioma Nwosu',
    tenantName: 'Halima Bello',
    stage: 'application_in',
    potentialCommission: 120_000,
    nextAction: 'Review documents & send to landlord',
  },
  {
    id: 'rp-003',
    propertyName: 'Ikeja GRA – 4BR Duplex',
    landlordName: 'Adekunle Ajayi',
    stage: 'prospecting',
    potentialCommission: 900_000,
    nextAction: 'Propose exclusive management contract',
  },
]

export const realtorEarningsTrend: RealtorEarningsSnapshot[] = [
  { month: 'Jan', grossCommission: 1_800_000, expenses: 450_000, net: 1_350_000 },
  { month: 'Feb', grossCommission: 2_150_000, expenses: 520_000, net: 1_630_000 },
  { month: 'Mar', grossCommission: 2_050_000, expenses: 610_000, net: 1_440_000 },
  { month: 'Apr', grossCommission: 2_350_000, expenses: 650_000, net: 1_700_000 },
]

export const realtorClientMix = [
  { label: 'Existing landlord portfolios', value: 60 },
  { label: 'New landlords sourced on Julaaz', value: 25 },
  { label: 'Corporate & diaspora clients', value: 15 },
]

