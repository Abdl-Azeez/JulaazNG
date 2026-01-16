import { Injectable } from '@nestjs/common'

@Injectable()
export class RealtorService {
  // TODO: Inject repositories / PrismaService when real data layer is ready

  getDashboardSummary() {
    // This mirrors the controller mock for now; will be replaced with real queries
    return {
      overview: {
        managedProperties: 24,
        activeTenants: 38,
        monthlyGmv: 125_000_000,
        commissionRate: 0.08,
      },
      pipeline: {
        upcomingViewings: 6,
        pendingApplications: 9,
        renewalsThisMonth: 4,
      },
    }
  }

  getEarningsSummary() {
    return {
      totalCommissionToDate: 18_500_000,
      currentMonthCommission: 2_350_000,
      expensesThisMonth: 650_000,
      netThisMonth: 1_700_000,
    }
  }
}

