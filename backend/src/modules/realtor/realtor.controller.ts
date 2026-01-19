import { Controller, Get } from '@nestjs/common'

@Controller('realtor')
export class RealtorController {
  @Get('dashboard')
  getDashboardSummary() {
    // Placeholder mock data – to be wired to real services later
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

  @Get('earnings')
  getEarningsSummary() {
    return {
      totalCommissionToDate: 18_500_000,
      currentMonthCommission: 2_350_000,
      expensesThisMonth: 650_000,
      netThisMonth: 1_700_000,
    }
  }
}

